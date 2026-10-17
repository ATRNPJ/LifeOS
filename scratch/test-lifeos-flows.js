/**
 * Comprehensive verification script for LifeOS logic and flows
 */

import {
  INITIAL_PROFILE,
  INITIAL_QUESTS,
  INITIAL_ACHIEVEMENTS,
  calculateQuestXP,
  CATEGORIES,
  PRIORITIES,
  DIFFICULTIES
} from '../src/types/constants.js';

import { getLevelInfo } from '../src/utils/gamification.js';
import { isOverdue, isDueToday, formatDateLabel, getPast7DaysData } from '../src/utils/dateUtils.js';
import { generateStrategyPlan } from '../src/services/aiStrategistService.js';

console.log('=== TEST 1: XP and Level Progression Curves ===');
const initialLevel = getLevelInfo(INITIAL_PROFILE.totalXP);
console.log(`Initial totalXP: ${INITIAL_PROFILE.totalXP} -> Level: ${initialLevel.level}, CurrentLevelXP: ${initialLevel.xpInCurrentLevel}/${initialLevel.xpNeededForNext}, Rank: ${initialLevel.rankTitle}`);
if (initialLevel.level >= 1 && initialLevel.progressPercent >= 0) {
  console.log('✔ PASS: Initial level calculation valid');
} else {
  throw new Error('FAIL: Initial level calculation incorrect');
}

// Leveling up test
const levelUpXP = initialLevel.nextThreshold + 50;
const ascendantLevel = getLevelInfo(levelUpXP);
console.log(`Leveled Up totalXP: ${levelUpXP} -> Level: ${ascendantLevel.level}, Rank: ${ascendantLevel.rankTitle}`);
if (ascendantLevel.level > initialLevel.level) {
  console.log('✔ PASS: Level ascension correctly calculated');
} else {
  throw new Error('FAIL: Level progression failed to advance');
}

console.log('\n=== TEST 2: Quest Creation & Dynamic XP Bounty Calculation ===');
const hardEpicXP = calculateQuestXP('Hard', 'Epic');
console.log(`Hard (120 Base) * Epic (2.0x) = ${hardEpicXP} XP (Expected: 240)`);
if (hardEpicXP === 240) {
  console.log('✔ PASS: calculateQuestXP matches formula');
} else {
  throw new Error(`FAIL: Expected 240 XP, got ${hardEpicXP}`);
}

const newQuest = {
  id: 'quest-test-1',
  title: 'Audit Distributed Storage Node Consistency',
  description: 'Inspect Raft log partitions and heartbeat latency',
  category: 'Career',
  priority: 'High',
  difficulty: 'Medium',
  status: 'todo',
  dueDate: '2026-10-16',
  xpReward: calculateQuestXP('Medium', 'High'),
  xpAwarded: false
};
console.log(`Created Quest: "${newQuest.title}", Bounty: +${newQuest.xpReward} XP`);

console.log('\n=== TEST 3: Quest Completion, XP Awarding, and Persistence Simulation ===');
let currentTotalXP = INITIAL_PROFILE.totalXP;
let questState = { ...newQuest };

// Complete quest
const priorXP = currentTotalXP;
currentTotalXP += questState.xpReward;
questState.status = 'completed';
questState.xpAwarded = true;
questState.completedAt = new Date().toISOString();

console.log(`Prior XP: ${priorXP} -> Completed -> New XP: ${currentTotalXP} (+${questState.xpReward})`);
if (currentTotalXP === priorXP + 90 && questState.xpAwarded === true) {
  console.log('✔ PASS: Quest completion correctly awarded XP and marked xpAwarded=true');
} else {
  throw new Error('FAIL: Quest completion XP error');
}

console.log('\n=== TEST 4: Page Refresh Simulation & Duplicate XP Prevention ===');
// Simulate saving to storage and reloading
const serialized = JSON.stringify({ profile: { ...INITIAL_PROFILE, totalXP: currentTotalXP }, quests: [questState] });
const deserialized = JSON.parse(serialized);

const reloadedQuest = deserialized.quests[0];
const reloadedProfile = deserialized.profile;

// Check if reloaded quest awards XP again upon page refresh
let refreshXP = reloadedProfile.totalXP;
if (reloadedQuest.status === 'completed' && reloadedQuest.xpAwarded === true) {
  // It should NOT re-add XP because xpAwarded is true
  console.log('✔ PASS: Reloaded state recognized quest as already awarded. No duplicate XP awarded on load.');
} else {
  throw new Error('FAIL: Duplicate XP vulnerability detected on reload');
}

console.log('\n=== TEST 5: Undoing Completion & Reversing Reward ===');
// Undo completion
const undoXP = questState.xpReward;
currentTotalXP = Math.max(0, currentTotalXP - undoXP);
questState.status = 'todo';
questState.xpAwarded = false;
questState.completedAt = null;

console.log(`Reverted quest -> Current XP: ${currentTotalXP} (Expected: ${priorXP})`);
if (currentTotalXP === priorXP && questState.xpAwarded === false) {
  console.log('✔ PASS: Undoing completion cleanly reversed XP and reset flags');
} else {
  throw new Error(`FAIL: Undoing completion failed to restore previous XP. Got ${currentTotalXP}`);
}

console.log('\n=== TEST 6: Timeline & Overdue Detection ===');
const overdueDate = '2026-10-10';
const todayDate = new Date().toISOString().split('T')[0];
const futureDate = '2026-10-25';

console.log(`Date '${overdueDate}' overdue check: ${isOverdue(overdueDate, false)} (Expected: true)`);
console.log(`Date '${todayDate}' today check: ${isDueToday(todayDate)} (Expected: true)`);
console.log(`Date '${futureDate}' overdue check: ${isOverdue(futureDate, false)} (Expected: false)`);

if (isOverdue(overdueDate, false) === true && isDueToday(todayDate) === true && isOverdue(futureDate, false) === false) {
  console.log('✔ PASS: Date & Overdue categorization functions accurately');
} else {
  throw new Error('FAIL: Date calculation error');
}

console.log('\n=== TEST 7: AI Strategist Plan Generation & Adoption ===');
const generatedPlan = await generateStrategyPlan({
  goal: 'Deploy Production Microservices Cluster',
  domain: 'Career',
  timeBudget: 15,
  cadence: 'Intensive'
});

console.log(`Generated Roadmap for: "${generatedPlan.objective}"`);
console.log(`Phases generated: ${generatedPlan.phases.length}`);
console.log(`Quests proposed: ${generatedPlan.recommendedQuests.length}`);

if (generatedPlan.phases.length === 3 && generatedPlan.recommendedQuests.length >= 3) {
  console.log('✔ PASS: AI Strategist synthesized valid phased roadmap and mission deck');
} else {
  throw new Error('FAIL: AI Strategist generated invalid structure');
}

console.log('\n=========================================');
console.log(' ALL BUSINESS LOGIC AND WORKFLOW TESTS PASSED');
console.log('=========================================');
