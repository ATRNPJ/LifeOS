/**
 * Date and timeline utility functions for LifeOS
 */

export function getCurrentDateString() {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

export function parseDate(dateStr) {
  if (!dateStr) return null;
  // Handle YYYY-MM-DD
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  }
  return new Date(dateStr);
}

export function getDaysDifference(dateStr) {
  if (!dateStr) return null;
  const target = parseDate(dateStr);
  if (!target || isNaN(target.getTime())) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

export function isOverdue(dateStr, isCompleted = false) {
  if (!dateStr || isCompleted) return false;
  const diff = getDaysDifference(dateStr);
  return diff !== null && diff < 0;
}

export function isDueToday(dateStr) {
  if (!dateStr) return false;
  const diff = getDaysDifference(dateStr);
  return diff === 0;
}

export function isDueTomorrow(dateStr) {
  if (!dateStr) return false;
  const diff = getDaysDifference(dateStr);
  return diff === 1;
}

export function formatDateLabel(dateStr) {
  if (!dateStr) return 'No Date';
  const diff = getDaysDifference(dateStr);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff === -1) return 'Yesterday';
  if (diff !== null && diff < -1) return `${Math.abs(diff)}d Overdue`;
  if (diff !== null && diff > 1 && diff <= 7) return `In ${diff} days`;

  const d = parseDate(dateStr);
  if (!d || isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 17) return 'Good Afternoon';
  if (hour >= 17 && hour < 22) return 'Good Evening';
  return 'Night Shift';
}

export function getFullDateDisplay() {
  const options = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
  return new Date().toLocaleDateString('en-US', options);
}

/**
 * Generate 7-day activity data for the weekly chart
 */
export function getPast7DaysData(quests = [], historyMap = {}) {
  const result = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });

    // Completed quests matching this date
    let questsCount = 0;
    let earnedXP = 0;

    quests.forEach((q) => {
      if (q.status === 'completed' && q.completedAt) {
        const completedDate = q.completedAt.split('T')[0];
        if (completedDate === dateStr) {
          questsCount++;
          earnedXP += (q.xpReward || 0);
        }
      }
    });

    // Merge with persisted history if any
    if (historyMap && historyMap[dateStr]) {
      questsCount = Math.max(questsCount, historyMap[dateStr].quests || 0);
      earnedXP = Math.max(earnedXP, historyMap[dateStr].xp || 0);
    }

    result.push({
      dateStr,
      dayLabel,
      isToday: i === 0,
      quests: questsCount,
      xp: earnedXP
    });
  }

  return result;
}
