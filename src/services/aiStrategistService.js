/**
 * LifeOS Neural Strategist Service
 * 
 * Provides local heuristic tactical plan decomposition for demo mode.
 * Architected with clean separation so a production backend API (e.g., POST /api/generate-strategy)
 * can be plugged in seamlessly without exposing API keys in frontend client bundles.
 */

import { calculateQuestXP } from '../types/constants.js';

export async function generateStrategyPlan({
  goal,
  timeBudget = 10,
  domain = 'Career',
  cadence = 'Intensive',
  constraints = ''
}) {
  // Simulate brief neural synthesis processing latency for realism
  await new Promise((resolve) => setTimeout(resolve, 800));

  const safeGoal = goal?.trim() || 'Accelerate Professional Growth & Daily Focus';
  const today = new Date();

  const getDateOffset = (days) => {
    const d = new Date(today);
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  // Generate customized structured missions based on user's goal & domain
  let quests = [];

  if (domain === 'Health') {
    quests = [
      {
        title: `Establish Baseline Metrics & Schedule for "${safeGoal}"`,
        description: `Audit current sleep architecture, resting heart rate, and define weekly training blocks. (${timeBudget}h weekly target)`,
        category: 'Health',
        priority: 'High',
        difficulty: 'Medium',
        dueDate: getDateOffset(1),
        xpReward: calculateQuestXP('Medium', 'High')
      },
      {
        title: 'Complete 3 Zone-2 Aerobic & Structural Conditioning Sessions',
        description: 'Build mitochondrial efficiency with consistent cadence and optimal recovery hydration.',
        category: 'Health',
        priority: 'Medium',
        difficulty: 'Hard',
        dueDate: getDateOffset(4),
        xpReward: calculateQuestXP('Hard', 'Medium')
      },
      {
        title: 'Weekly Nutritional Macro Calibration & Meal Prep Batch',
        description: 'Prepare anti-inflammatory nutrition protocol and verify micronutrient replenishment.',
        category: 'Health',
        priority: 'Low',
        difficulty: 'Easy',
        dueDate: getDateOffset(6),
        xpReward: calculateQuestXP('Easy', 'Low')
      }
    ];
  } else if (domain === 'Learning') {
    quests = [
      {
        title: `Synthesize Core Curriculum & Reading List for "${safeGoal}"`,
        description: `Filter top 3 reference books or courses and eliminate low-signal distractions. (${timeBudget}h commitment)`,
        category: 'Learning',
        priority: 'High',
        difficulty: 'Medium',
        dueDate: getDateOffset(1),
        xpReward: calculateQuestXP('Medium', 'High')
      },
      {
        title: 'Deep Focus Sprint: 4 Hours of Deliberate Practice & Flashcards',
        description: 'Apply active recall and spaced repetition to master high-frequency conceptual foundations.',
        category: 'Learning',
        priority: 'Epic',
        difficulty: 'Hard',
        dueDate: getDateOffset(3),
        xpReward: calculateQuestXP('Hard', 'Epic')
      },
      {
        title: 'Teach the Concept: Create a 1-Page Synthesis Summary Note',
        description: 'Utilize the Feynman technique to articulate key mental models without reference material.',
        category: 'Learning',
        priority: 'Medium',
        difficulty: 'Easy',
        dueDate: getDateOffset(5),
        xpReward: calculateQuestXP('Easy', 'Medium')
      }
    ];
  } else if (domain === 'Finance') {
    quests = [
      {
        title: `Financial Audit & Cash Flow Simulation for "${safeGoal}"`,
        description: `Reconcile all active subscriptions, liquid reserves, and discretionary outflows.`,
        category: 'Finance',
        priority: 'High',
        difficulty: 'Medium',
        dueDate: getDateOffset(2),
        xpReward: calculateQuestXP('Medium', 'High')
      },
      {
        title: 'Automate Recurring Investment Allocations & Index DCA',
        description: 'Ensure automated capital deployment aligns with long-term compound growth objectives.',
        category: 'Finance',
        priority: 'Medium',
        difficulty: 'Easy',
        dueDate: getDateOffset(4),
        xpReward: calculateQuestXP('Easy', 'Medium')
      },
      {
        title: 'Establish 90-Day Emergency Runway Buffer Strategy',
        description: 'Structure high-yield liquid safety nets to mitigate exogenous market volatility.',
        category: 'Finance',
        priority: 'Epic',
        difficulty: 'Hard',
        dueDate: getDateOffset(7),
        xpReward: calculateQuestXP('Hard', 'Epic')
      }
    ];
  } else {
    // Career / Default
    quests = [
      {
        title: `Map Milestone Architecture & Critical Path for "${safeGoal}"`,
        description: `Decompose requirements into functional deliverables, identifying blocker dependencies. (${timeBudget}h budget)`,
        category: 'Career',
        priority: 'High',
        difficulty: 'Medium',
        dueDate: getDateOffset(1),
        xpReward: calculateQuestXP('Medium', 'High')
      },
      {
        title: 'Deep Execution Block: Complete Prototype Implementation Core',
        description: 'Concentrated 90-minute focus blocks to deliver high-leverage technical functionality.',
        category: 'Career',
        priority: 'Epic',
        difficulty: 'Hard',
        dueDate: getDateOffset(3),
        xpReward: calculateQuestXP('Hard', 'Epic')
      },
      {
        title: 'Conduct Quality Verification, Testing, and Stakeholder Review',
        description: 'Stress-test edge cases, gather empirical feedback, and document release validation.',
        category: 'Career',
        priority: 'Medium',
        difficulty: 'Easy',
        dueDate: getDateOffset(6),
        xpReward: calculateQuestXP('Easy', 'Medium')
      }
    ];
  }

  return {
    objective: safeGoal,
    domain,
    timeBudget,
    cadence,
    summary: `Strategic blueprint optimized for ${timeBudget} hours/week using a ${cadence.toLowerCase()} cadence in the ${domain} domain.`,
    phases: [
      {
        name: 'Phase 1: Diagnostic & Foundation',
        duration: 'Days 1-2',
        focus: 'Eliminating friction, mapping dependencies, and baseline calibration.'
      },
      {
        name: 'Phase 2: Deep Momentum Sprint',
        duration: 'Days 3-5',
        focus: 'Uninterrupted deep work blocks tackling the highest leverage bottlenecks.'
      },
      {
        name: 'Phase 3: Consolidation & Review',
        duration: 'Days 6-7',
        focus: 'Synthesis, metric auditing, and preparation for the subsequent cycle.'
      }
    ],
    recommendedQuests: quests
  };
}
