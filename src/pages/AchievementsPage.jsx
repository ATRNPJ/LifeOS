import React, { useState } from 'react';
import {
  Trophy,
  Sparkles,
  Flame,
  Target,
  Shield,
  Zap,
  Crown,
  Compass,
  Cpu,
  Lock,
  CheckCircle2,
  Award
} from 'lucide-react';
import { useLifeOS } from '../context/LifeOSContext';
import ProgressBar from '../components/common/ProgressBar';

export default function AchievementsPage() {
  const { achievements, quests, profile, levelInfo } = useLifeOS();
  const [filter, setFilter] = useState('all'); // all, unlocked, locked

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

  const completedQuestsCount = quests.filter((q) => q.status === 'completed').length;
  const completedCategories = new Set(
    quests.filter((q) => q.status === 'completed').map((q) => q.category)
  );

  const getIcon = (iconName, unlocked) => {
    const props = {
      size: 22,
      color: unlocked ? '#f59e0b' : 'var(--text-muted)'
    };
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles {...props} />;
      case 'Target':
        return <Target {...props} />;
      case 'Shield':
        return <Shield {...props} />;
      case 'Flame':
        return <Flame {...props} fill={unlocked ? '#f59e0b' : 'none'} />;
      case 'Zap':
        return <Zap {...props} fill={unlocked ? '#f59e0b' : 'none'} />;
      case 'Crown':
        return <Crown {...props} />;
      case 'Compass':
        return <Compass {...props} />;
      case 'Trophy':
        return <Trophy {...props} />;
      case 'Cpu':
        return <Cpu {...props} />;
      default:
        return <Award {...props} />;
    }
  };

  // Calculate live progress for each achievement
  const getAchievementProgress = (ach) => {
    if (ach.unlocked) return { current: ach.target, max: ach.target, percent: 100 };

    let current = 0;
    switch (ach.id) {
      case 'first_blood':
      case 'quest_5':
      case 'quest_20':
        current = completedQuestsCount;
        break;
      case 'streak_3':
      case 'streak_7':
        current = profile.streak || 0;
        break;
      case 'legendary_slayer':
        current = quests.some((q) => q.status === 'completed' && q.difficulty === 'Legendary') ? 1 : 0;
        break;
      case 'polymath':
        current = completedCategories.size;
        break;
      case 'level_5':
        current = levelInfo.level;
        break;
      case 'ai_architect':
        current = 0;
        break;
      default:
        current = 0;
    }

    const clampedCurrent = Math.min(ach.target, current);
    const percent = Math.min(100, Math.round((clampedCurrent / ach.target) * 100));

    return {
      current: clampedCurrent,
      max: ach.target,
      percent
    };
  };

  const filteredList = achievements.filter((a) => {
    if (filter === 'unlocked') return a.unlocked;
    if (filter === 'locked') return !a.unlocked;
    return true;
  });

  return (
    <div className="page-container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f59e0b'
              }}
            >
              <Trophy size={20} />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Hall of Achievements
            </h1>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Milestones and badges unlocked across your productivity evolution.
          </p>
        </div>

        {/* Filter controls */}
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          <button
            type="button"
            className={`btn btn-sm ${filter === 'all' ? 'btn-secondary' : 'btn-ghost'}`}
            onClick={() => setFilter('all')}
          >
            All ({totalCount})
          </button>
          <button
            type="button"
            className={`btn btn-sm ${filter === 'unlocked' ? 'btn-secondary' : 'btn-ghost'}`}
            onClick={() => setFilter('unlocked')}
          >
            Unlocked ({unlockedCount})
          </button>
          <button
            type="button"
            className={`btn btn-sm ${filter === 'locked' ? 'btn-secondary' : 'btn-ghost'}`}
            onClick={() => setFilter('locked')}
          >
            Locked ({totalCount - unlockedCount})
          </button>
        </div>
      </div>

      {/* Progress Card Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '1.5rem',
          borderRadius: 'var(--radius-xl)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(139, 92, 246, 0.06) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.2)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Overall Completion Matrix
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.125rem' }}>
              {unlockedCount} of {totalCount} Badges Claimed ({progressPercent}%)
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span
              className="badge"
              style={{
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                color: '#fbbf24',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                fontSize: '0.8125rem',
                padding: '0.35rem 0.75rem'
              }}
            >
              <Sparkles size={14} />
              <span>
                {achievements
                  .filter((a) => a.unlocked)
                  .reduce((acc, a) => acc + (a.rewardXP || 0), 0)}{' '}
                Achievement XP
              </span>
            </span>
          </div>
        </div>

        <ProgressBar
          progress={unlockedCount}
          max={totalCount}
          color="#f59e0b"
          height="10px"
        />
      </div>

      {/* Achievements Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.25rem'
        }}
      >
        {filteredList.map((ach) => {
          const isUnlocked = ach.unlocked;
          const progress = getAchievementProgress(ach);

          return (
            <div
              key={ach.id}
              className="glass-panel"
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-lg)',
                border: isUnlocked
                  ? '1px solid rgba(245, 158, 11, 0.3)'
                  : '1px solid var(--border-subtle)',
                backgroundColor: isUnlocked
                  ? 'rgba(15, 23, 42, 0.85)'
                  : 'rgba(15, 23, 42, 0.45)',
                opacity: isUnlocked ? 1 : 0.75,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1rem',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Unlocked corner aura */}
              {isUnlocked && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-30px',
                    right: '-30px',
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: '#f59e0b',
                    opacity: 0.1,
                    filter: 'blur(20px)',
                    pointerEvents: 'none'
                  }}
                />
              )}

              {/* Top Row: Icon, Title, and Category */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    backgroundColor: isUnlocked
                      ? 'rgba(245, 158, 11, 0.15)'
                      : 'rgba(255, 255, 255, 0.05)',
                    border: isUnlocked
                      ? '1px solid rgba(245, 158, 11, 0.35)'
                      : '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {isUnlocked ? getIcon(ach.icon, true) : <Lock size={20} color="var(--text-dim)" />}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <h3
                      style={{
                        fontSize: '0.9375rem',
                        fontWeight: 700,
                        color: isUnlocked ? 'var(--text-main)' : 'var(--text-muted)'
                      }}
                    >
                      {ach.title}
                    </h3>
                    <span
                      className="badge badge-xp"
                      style={{ fontSize: '0.6875rem', padding: '0.15rem 0.4rem', flexShrink: 0 }}
                    >
                      +{ach.rewardXP} XP
                    </span>
                  </div>

                  <span
                    style={{
                      fontSize: '0.6875rem',
                      color: 'var(--text-dim)',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em'
                    }}
                  >
                    {ach.category}
                  </span>

                  <p
                    style={{
                      fontSize: '0.8125rem',
                      color: 'var(--text-muted)',
                      marginTop: '0.35rem',
                      lineHeight: 1.4
                    }}
                  >
                    {ach.description}
                  </p>
                </div>
              </div>

              {/* Bottom: Progress or Unlocked Stamp */}
              <div
                style={{
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--border-subtle)'
                }}
              >
                {isUnlocked ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.75rem',
                      color: '#fbbf24',
                      fontWeight: 600
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <CheckCircle2 size={14} color="#f59e0b" />
                      <span>Unlocked & Claimed</span>
                    </span>
                    {ach.unlockedAt && (
                      <span style={{ fontSize: '0.6875rem', color: 'var(--text-dim)' }}>
                        {new Date(ach.unlockedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                ) : (
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.6875rem',
                        color: 'var(--text-dim)',
                        marginBottom: '0.25rem',
                        fontWeight: 600
                      }}
                    >
                      <span>Progress</span>
                      <span className="font-mono">
                        {progress.current} / {progress.max}
                      </span>
                    </div>
                    <ProgressBar
                      progress={progress.current}
                      max={progress.max}
                      color="#8b5cf6"
                      height="5px"
                      glow={false}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
