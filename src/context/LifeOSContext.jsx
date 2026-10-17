import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  INITIAL_PROFILE,
  INITIAL_QUESTS,
  INITIAL_ACHIEVEMENTS,
  calculateQuestXP,
  CATEGORIES
} from '../types/constants';
import { getStorageItem, setStorageItem, clearLifeOSStorage } from '../utils/storage';
import { getLevelInfo, sound } from '../utils/gamification';
import { getCurrentDateString, getPast7DaysData } from '../utils/dateUtils';

const LifeOSContext = createContext(null);

export function LifeOSProvider({ children }) {
  // 1. Initial State from Storage
  const [profile, setProfile] = useState(() =>
    getStorageItem('profile_v1', INITIAL_PROFILE)
  );
  const [quests, setQuests] = useState(() =>
    getStorageItem('quests_v1', INITIAL_QUESTS)
  );
  const [achievements, setAchievements] = useState(() =>
    getStorageItem('achievements_v1', INITIAL_ACHIEVEMENTS)
  );
  const [history, setHistory] = useState(() =>
    getStorageItem('history_v1', {
      [getCurrentDateString()]: { quests: 1, xp: 30 }
    })
  );

  // UI state
  const [toasts, setToasts] = useState([]);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [editingQuest, setEditingQuest] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // 2. Persist state changes
  useEffect(() => {
    setStorageItem('profile_v1', profile);
  }, [profile]);

  useEffect(() => {
    setStorageItem('quests_v1', quests);
  }, [quests]);

  useEffect(() => {
    setStorageItem('achievements_v1', achievements);
  }, [achievements]);

  useEffect(() => {
    setStorageItem('history_v1', history);
  }, [history]);

  // Toast dispatch
  const showToast = useCallback((toastData) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    const newToast = { id, ...toastData };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Level Info derivation
  const levelInfo = useMemo(() => {
    return getLevelInfo(profile.totalXP);
  }, [profile.totalXP]);

  // Achievement verification engine
  const checkAchievements = useCallback(
    (currentQuests, currentTotalXP, currentStreak) => {
      const completedList = currentQuests.filter((q) => q.status === 'completed');
      const completedCount = completedList.length;
      const currentLevel = getLevelInfo(currentTotalXP).level;

      // Unique categories completed
      const completedCategories = new Set(
        completedList.map((q) => q.category).filter(Boolean)
      );

      // Has legendary completed
      const hasLegendary = completedList.some(
        (q) => q.difficulty === 'Legendary'
      );

      setAchievements((prevAchievements) => {
        let updated = false;
        let additionalXP = 0;

        const nextAchievements = prevAchievements.map((ach) => {
          if (ach.unlocked) return ach;

          let shouldUnlock = false;
          let currentProgress = 0;

          switch (ach.id) {
            case 'first_blood':
              currentProgress = completedCount;
              shouldUnlock = completedCount >= 1;
              break;
            case 'quest_5':
              currentProgress = completedCount;
              shouldUnlock = completedCount >= 5;
              break;
            case 'quest_20':
              currentProgress = completedCount;
              shouldUnlock = completedCount >= 20;
              break;
            case 'streak_3':
              currentProgress = currentStreak;
              shouldUnlock = currentStreak >= 3;
              break;
            case 'streak_7':
              currentProgress = currentStreak;
              shouldUnlock = currentStreak >= 7;
              break;
            case 'legendary_slayer':
              currentProgress = hasLegendary ? 1 : 0;
              shouldUnlock = hasLegendary;
              break;
            case 'polymath':
              currentProgress = completedCategories.size;
              shouldUnlock = completedCategories.size >= 5;
              break;
            case 'level_5':
              currentProgress = currentLevel;
              shouldUnlock = currentLevel >= 5;
              break;
            case 'ai_architect':
              // Unlocked when user adopts an AI strategic plan
              break;
            default:
              break;
          }

          if (shouldUnlock && !ach.unlocked) {
            updated = true;
            additionalXP += ach.rewardXP || 0;

            if (profile.soundEffects) {
              sound.playAchievementUnlocked();
            }

            showToast({
              type: 'achievement',
              title: `Achievement Unlocked: ${ach.title}`,
              message: `${ach.description} (+${ach.rewardXP} XP)`,
              icon: ach.icon
            });

            return {
              ...ach,
              unlocked: true,
              unlockedAt: new Date().toISOString()
            };
          }

          return ach;
        });

        if (additionalXP > 0) {
          setProfile((p) => ({
            ...p,
            totalXP: p.totalXP + additionalXP
          }));
        }

        return updated ? nextAchievements : prevAchievements;
      });
    },
    [profile.soundEffects, showToast]
  );

  // Check achievements when profile or quests change
  useEffect(() => {
    checkAchievements(quests, profile.totalXP, profile.streak);
  }, [quests.length, profile.totalXP, profile.streak, checkAchievements]);

  // Streak logic update
  const updateStreakOnCompletion = useCallback(() => {
    const todayStr = getCurrentDateString();
    setProfile((prev) => {
      if (prev.lastActiveDate === todayStr) {
        // Already active today, streak remains strong
        return prev;
      }

      // Calculate if yesterday was active
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      let newStreak = prev.streak;
      if (prev.lastActiveDate === yesterdayStr) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }

      return {
        ...prev,
        streak: newStreak,
        lastActiveDate: todayStr
      };
    });
  }, []);

  // Quest Actions
  const addQuest = useCallback((questData) => {
    const calculatedXP =
      questData.xpReward ||
      calculateQuestXP(questData.difficulty || 'Medium', questData.priority || 'Medium');

    const newQuest = {
      id: `quest-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: questData.title.trim(),
      description: questData.description ? questData.description.trim() : '',
      category: questData.category || 'Career',
      priority: questData.priority || 'Medium',
      difficulty: questData.difficulty || 'Medium',
      status: questData.status || 'todo',
      dueDate: questData.dueDate || getCurrentDateString(),
      completedAt: null,
      xpReward: calculatedXP,
      xpAwarded: false,
      createdAt: new Date().toISOString()
    };

    setQuests((prev) => [newQuest, ...prev]);

    showToast({
      type: 'info',
      title: 'Quest Initialized',
      message: `"${newQuest.title}" added to your task log. (+${calculatedXP} XP on completion)`
    });

    return newQuest;
  }, [showToast]);

  const updateQuest = useCallback((id, updatedFields) => {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id !== id) return q;

        // Recalculate XP if difficulty or priority changed and quest is not yet completed
        let xpReward = q.xpReward;
        if (
          !q.xpAwarded &&
          (updatedFields.difficulty || updatedFields.priority)
        ) {
          xpReward = calculateQuestXP(
            updatedFields.difficulty || q.difficulty,
            updatedFields.priority || q.priority
          );
        }

        return {
          ...q,
          ...updatedFields,
          xpReward
        };
      })
    );

    showToast({
      type: 'info',
      title: 'Quest Updated',
      message: 'Changes saved successfully.'
    });
  }, [showToast]);

  const deleteQuest = useCallback((id) => {
    setQuests((prev) => {
      const target = prev.find((q) => q.id === id);
      if (!target) return prev;

      // If quest was completed and awarded XP, do we deduct or keep?
      // Best practice: if completed, alert user or keep XP to prevent penalty on cleanup.
      // We will keep XP to avoid frustrating the user upon housekeeping.
      return prev.filter((q) => q.id !== id);
    });

    showToast({
      type: 'info',
      title: 'Quest Removed',
      message: 'Quest was deleted from your registry.'
    });
  }, [showToast]);

  // Complete / Undo Complete Quest
  const toggleQuestCompletion = useCallback((id) => {
    const todayStr = getCurrentDateString();

    setQuests((prev) => {
      const target = prev.find((q) => q.id === id);
      if (!target) return prev;

      const isNowCompleted = target.status !== 'completed';

      if (isNowCompleted) {
        // --- COMPLETING QUEST ---
        const gainedXP = target.xpReward || 50;

        setProfile((prevProfile) => {
          const prevLevel = getLevelInfo(prevProfile.totalXP).level;
          const newXP = prevProfile.totalXP + gainedXP;
          const newLevel = getLevelInfo(newXP).level;

          if (prevProfile.soundEffects) {
            if (newLevel > prevLevel) {
              sound.playLevelUp();
            } else {
              sound.playQuestComplete();
            }
          }

          if (newLevel > prevLevel) {
            showToast({
              type: 'level',
              title: '⭐ LEVEL ASCENSION!',
              message: `You reached Level ${newLevel}! Power level elevated.`,
              xpAmount: gainedXP
            });
          } else {
            showToast({
              type: 'xp',
              title: 'Quest Completed!',
              message: `+${gainedXP} XP claimed for "${target.title}"`,
              xpAmount: gainedXP
            });
          }

          return {
            ...prevProfile,
            totalXP: newXP
          };
        });

        // Record in history map for weekly charts
        setHistory((prevHistory) => {
          const current = prevHistory[todayStr] || { quests: 0, xp: 0 };
          return {
            ...prevHistory,
            [todayStr]: {
              quests: current.quests + 1,
              xp: current.xp + gainedXP
            }
          };
        });

        updateStreakOnCompletion();

        return prev.map((q) =>
          q.id === id
            ? {
                ...q,
                status: 'completed',
                completedAt: new Date().toISOString(),
                xpAwarded: true
              }
            : q
        );
      } else {
        // --- UNDOING COMPLETION ---
        const reversedXP = target.xpReward || 50;

        setProfile((prevProfile) => {
          const newXP = Math.max(0, prevProfile.totalXP - reversedXP);
          return {
            ...prevProfile,
            totalXP: newXP
          };
        });

        // Decrement history count
        setHistory((prevHistory) => {
          const current = prevHistory[todayStr] || { quests: 1, xp: reversedXP };
          return {
            ...prevHistory,
            [todayStr]: {
              quests: Math.max(0, current.quests - 1),
              xp: Math.max(0, current.xp - reversedXP)
            }
          };
        });

        showToast({
          type: 'info',
          title: 'Completion Reverted',
          message: `Quest marked incomplete. -${reversedXP} XP deducted.`
        });

        return prev.map((q) =>
          q.id === id
            ? {
                ...q,
                status: 'todo',
                completedAt: null,
                xpAwarded: false
              }
            : q
        );
      }
    });
  }, [showToast, updateStreakOnCompletion]);

  // Quick status changer
  const changeQuestStatus = useCallback((id, newStatus) => {
    setQuests((prev) => {
      const target = prev.find((q) => q.id === id);
      if (!target) return prev;

      if (newStatus === 'completed' && target.status !== 'completed') {
        // delegate to toggle completion
        setTimeout(() => toggleQuestCompletion(id), 0);
        return prev;
      }

      if (target.status === 'completed' && newStatus !== 'completed') {
        // delegate to toggle completion to reverse XP
        setTimeout(() => toggleQuestCompletion(id), 0);
        return prev;
      }

      return prev.map((q) =>
        q.id === id ? { ...q, status: newStatus } : q
      );
    });
  }, [toggleQuestCompletion]);

  // Change due date directly
  const changeQuestDueDate = useCallback((id, newDueDate) => {
    setQuests((prev) =>
      prev.map((q) => (q.id === id ? { ...q, dueDate: newDueDate } : q))
    );
    showToast({
      type: 'info',
      title: 'Timeline Adjusted',
      message: `Due date rescheduled.`
    });
  }, [showToast]);

  // Unlock specific achievement (e.g. AI Architect)
  const unlockAchievement = useCallback((achievementId) => {
    setAchievements((prev) => {
      const target = prev.find((a) => a.id === achievementId);
      if (!target || target.unlocked) return prev;

      if (profile.soundEffects) {
        sound.playAchievementUnlocked();
      }

      showToast({
        type: 'achievement',
        title: `Achievement Unlocked: ${target.title}`,
        message: `${target.description} (+${target.rewardXP} XP)`,
        icon: target.icon
      });

      if (target.rewardXP) {
        setProfile((p) => ({ ...p, totalXP: p.totalXP + target.rewardXP }));
      }

      return prev.map((a) =>
        a.id === achievementId
          ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() }
          : a
      );
    });
  }, [profile.soundEffects, showToast]);

  // Reset to initial demo data
  const resetDemoData = useCallback(() => {
    clearLifeOSStorage();
    setProfile(INITIAL_PROFILE);
    setQuests(INITIAL_QUESTS);
    setAchievements(INITIAL_ACHIEVEMENTS);
    setHistory({
      [getCurrentDateString()]: { quests: 1, xp: 30 }
    });

    showToast({
      type: 'info',
      title: 'Demo Environment Reset',
      message: 'LifeOS has been restored to factory demo state.'
    });
  }, [showToast]);

  // Export & Import backup
  const exportData = useCallback(() => {
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      profile,
      quests,
      achievements,
      history
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lifeos-backup-${getCurrentDateString()}.json`;
    link.click();
    URL.revokeObjectURL(url);

    showToast({
      type: 'info',
      title: 'Backup Exported',
      message: 'Your LifeOS profile and quest ledger were saved to JSON.'
    });
  }, [profile, quests, achievements, history, showToast]);

  const importData = useCallback((jsonData) => {
    try {
      const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      if (!data.profile || !Array.isArray(data.quests)) {
        throw new Error('Invalid LifeOS backup format');
      }

      setProfile(data.profile);
      setQuests(data.quests);
      if (Array.isArray(data.achievements)) {
        setAchievements(data.achievements);
      }
      if (data.history) {
        setHistory(data.history);
      }

      showToast({
        type: 'info',
        title: 'Data Restored',
        message: 'Successfully imported backup state.'
      });
      return true;
    } catch (err) {
      showToast({
        type: 'info',
        title: 'Import Failed',
        message: err.message || 'Could not parse the backup file.'
      });
      return false;
    }
  }, [showToast]);

  const value = {
    profile,
    setProfile,
    quests,
    achievements,
    history,
    levelInfo,
    toasts,
    showToast,
    dismissToast,
    quickAddOpen,
    setQuickAddOpen,
    editingQuest,
    setEditingQuest,
    activeTab,
    setActiveTab,
    sidebarCollapsed,
    setSidebarCollapsed,
    // Methods
    addQuest,
    updateQuest,
    deleteQuest,
    toggleQuestCompletion,
    changeQuestStatus,
    changeQuestDueDate,
    unlockAchievement,
    resetDemoData,
    exportData,
    importData
  };

  return (
    <LifeOSContext.Provider value={value}>
      {children}
    </LifeOSContext.Provider>
  );
}

export function useLifeOS() {
  const context = useContext(LifeOSContext);
  if (!context) {
    throw new Error('useLifeOS must be used within a LifeOSProvider');
  }
  return context;
}
