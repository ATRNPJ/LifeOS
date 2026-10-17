export const CATEGORIES = {
  Health: {
    id: 'Health',
    name: 'Health & Vitality',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.12)',
    border: 'rgba(16, 185, 129, 0.3)',
    icon: 'Activity'
  },
  Career: {
    id: 'Career',
    name: 'Career & Work',
    color: '#38bdf8',
    bg: 'rgba(56, 189, 248, 0.12)',
    border: 'rgba(56, 189, 248, 0.3)',
    icon: 'Briefcase'
  },
  Learning: {
    id: 'Learning',
    name: 'Knowledge & Skill',
    color: '#a855f7',
    bg: 'rgba(168, 85, 247, 0.12)',
    border: 'rgba(168, 85, 247, 0.3)',
    icon: 'BookOpen'
  },
  Personal: {
    id: 'Personal',
    name: 'Personal & Life',
    color: '#ec4899',
    bg: 'rgba(236, 72, 153, 0.12)',
    border: 'rgba(236, 72, 153, 0.3)',
    icon: 'Compass'
  },
  Finance: {
    id: 'Finance',
    name: 'Wealth & Finance',
    color: '#eab308',
    bg: 'rgba(234, 179, 8, 0.12)',
    border: 'rgba(234, 179, 8, 0.3)',
    icon: 'Coins'
  }
};

export const PRIORITIES = {
  Low: { id: 'Low', label: 'Low', color: '#94a3b8', multiplier: 1.0, border: 'rgba(148, 163, 184, 0.3)' },
  Medium: { id: 'Medium', label: 'Medium', color: '#38bdf8', multiplier: 1.25, border: 'rgba(56, 189, 248, 0.3)' },
  High: { id: 'High', label: 'High', color: '#f59e0b', multiplier: 1.5, border: 'rgba(245, 158, 11, 0.3)' },
  Epic: { id: 'Epic', label: 'Epic', color: '#f43f5e', multiplier: 2.0, border: 'rgba(244, 63, 94, 0.35)' }
};

export const DIFFICULTIES = {
  Easy: { id: 'Easy', label: 'Easy', baseXP: 30, color: '#10b981' },
  Medium: { id: 'Medium', label: 'Medium', baseXP: 60, color: '#38bdf8' },
  Hard: { id: 'Hard', label: 'Hard', baseXP: 120, color: '#a855f7' },
  Legendary: { id: 'Legendary', label: 'Legendary', baseXP: 250, color: '#f59e0b' }
};

export const STATUSES = {
  todo: { id: 'todo', label: 'To Do', color: '#94a3b8' },
  in_progress: { id: 'in_progress', label: 'In Progress', color: '#38bdf8' },
  completed: { id: 'completed', label: 'Completed', color: '#10b981' }
};

export function calculateQuestXP(difficulty = 'Medium', priority = 'Medium') {
  const base = DIFFICULTIES[difficulty]?.baseXP || 60;
  const mult = PRIORITIES[priority]?.multiplier || 1.25;
  return Math.round(base * mult);
}

export const INITIAL_PROFILE = {
  name: 'Alex Mercer',
  title: 'Cyber Vanguard',
  avatar: '⚡',
  dailyGoal: 3,
  soundEffects: true,
  theme: 'deep-navy',
  totalXP: 380,
  streak: 4,
  lastActiveDate: new Date().toISOString().split('T')[0]
};

export const INITIAL_ACHIEVEMENTS = [
  {
    id: 'first_blood',
    title: 'First Spark',
    description: 'Complete your first quest and claim your place in LifeOS.',
    category: 'Quests',
    icon: 'Sparkles',
    target: 1,
    rewardXP: 50,
    unlocked: true,
    unlockedAt: '2026-10-12T10:00:00Z'
  },
  {
    id: 'quest_5',
    title: 'Flow State',
    description: 'Complete 5 quests successfully.',
    category: 'Quests',
    icon: 'Target',
    target: 5,
    rewardXP: 100,
    unlocked: false,
    unlockedAt: null
  },
  {
    id: 'quest_20',
    title: 'Grand Centurion',
    description: 'Complete 20 total quests across any domain.',
    category: 'Quests',
    icon: 'Shield',
    target: 20,
    rewardXP: 300,
    unlocked: false,
    unlockedAt: null
  },
  {
    id: 'streak_3',
    title: 'Consistent Fire',
    description: 'Maintain an active daily quest streak for 3 days.',
    category: 'Streaks',
    icon: 'Flame',
    target: 3,
    rewardXP: 120,
    unlocked: true,
    unlockedAt: '2026-10-14T09:30:00Z'
  },
  {
    id: 'streak_7',
    title: 'Unstoppable Momentum',
    description: 'Keep your productivity flame burning for 7 consecutive days.',
    category: 'Streaks',
    icon: 'Zap',
    target: 7,
    rewardXP: 350,
    unlocked: false,
    unlockedAt: null
  },
  {
    id: 'legendary_slayer',
    title: 'Titan Slayer',
    description: 'Conquer any Legendary difficulty quest.',
    category: 'Feats',
    icon: 'Crown',
    target: 1,
    rewardXP: 250,
    unlocked: false,
    unlockedAt: null
  },
  {
    id: 'polymath',
    title: 'The Renaissance Mind',
    description: 'Complete at least 1 quest in all 5 life categories.',
    category: 'Mastery',
    icon: 'Compass',
    target: 5,
    rewardXP: 200,
    unlocked: false,
    unlockedAt: null
  },
  {
    id: 'level_5',
    title: 'Ascendant Rank',
    description: 'Ascend to Level 5 or higher.',
    category: 'Progression',
    icon: 'Trophy',
    target: 5,
    rewardXP: 400,
    unlocked: false,
    unlockedAt: null
  },
  {
    id: 'ai_architect',
    title: 'Neural Architect',
    description: 'Synthesize an AI strategic roadmap and adopt it into your quests.',
    category: 'Strategy',
    icon: 'Cpu',
    target: 1,
    rewardXP: 100,
    unlocked: false,
    unlockedAt: null
  }
];

// Helper to get formatted relative ISO dates
const today = new Date();
const formatDate = (daysOffset) => {
  const d = new Date(today);
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
};

export const INITIAL_QUESTS = [
  {
    id: 'quest-01',
    title: 'Complete 45-min High Intensity Interval Training',
    description: 'Cardio interval circuits, kettlebell swings, and recovery stretching to recharge physical readiness.',
    category: 'Health',
    priority: 'High',
    difficulty: 'Medium',
    status: 'completed',
    dueDate: formatDate(-1),
    completedAt: '2026-10-15T18:00:00Z',
    xpReward: 90,
    xpAwarded: true
  },
  {
    id: 'quest-02',
    title: 'Review System Architecture & Microservices Refactor',
    description: 'Evaluate event-driven choreography vs orchestration tradeoffs and document key boundary decisions.',
    category: 'Career',
    priority: 'Epic',
    difficulty: 'Hard',
    status: 'in_progress',
    dueDate: formatDate(0), // Today
    completedAt: null,
    xpReward: 240,
    xpAwarded: false
  },
  {
    id: 'quest-03',
    title: 'Read 2 Chapters of "Designing Data-Intensive Applications"',
    description: 'Deep dive into consensus algorithms, raft protocols, and partition tolerance models.',
    category: 'Learning',
    priority: 'Medium',
    difficulty: 'Medium',
    status: 'todo',
    dueDate: formatDate(0), // Today
    completedAt: null,
    xpReward: 75,
    xpAwarded: false
  },
  {
    id: 'quest-04',
    title: 'Optimize Monthly Investment Portfolio & Expense Ledger',
    description: 'Review index funds DCA allocations, update emergency liquidity tracker, and categorize statements.',
    category: 'Finance',
    priority: 'Medium',
    difficulty: 'Easy',
    status: 'todo',
    dueDate: formatDate(1), // Tomorrow
    completedAt: null,
    xpReward: 38,
    xpAwarded: false
  },
  {
    id: 'quest-05',
    title: '30-Minute Mindfulness & Journaling Ritual',
    description: 'Reflect on weekly achievements, clear cognitive debt, and write down 3 deep gratitude anchors.',
    category: 'Personal',
    priority: 'Low',
    difficulty: 'Easy',
    status: 'completed',
    dueDate: formatDate(0),
    completedAt: '2026-10-16T08:15:00Z',
    xpReward: 30,
    xpAwarded: true
  },
  {
    id: 'quest-06',
    title: 'Deploy Production Zero-Trust Auth Migration',
    description: 'Roll out JWT refresh token rotation with hardware key FIDO2 fallback across auth nodes.',
    category: 'Career',
    priority: 'Epic',
    difficulty: 'Legendary',
    status: 'todo',
    dueDate: formatDate(3),
    completedAt: null,
    xpReward: 500,
    xpAwarded: false
  },
  {
    id: 'quest-07',
    title: 'Hydration Protocol: Drink 3L Filtered Electrolyte Water',
    description: 'Hit baseline hydration targets before 20:00 to optimize cognitive clarity and sleep architecture.',
    category: 'Health',
    priority: 'Medium',
    difficulty: 'Easy',
    status: 'in_progress',
    dueDate: formatDate(0),
    completedAt: null,
    xpReward: 38,
    xpAwarded: false
  },
  {
    id: 'quest-08',
    title: 'Update Living Room Smart Lighting & Ambient Station',
    description: 'Automate circadian rhythm warm light transitions at sunset for improved melatonin onset.',
    category: 'Personal',
    priority: 'Low',
    difficulty: 'Medium',
    status: 'todo',
    dueDate: formatDate(-2), // Overdue for testing planner!
    completedAt: null,
    xpReward: 60,
    xpAwarded: false
  }
];
