import React, { useState } from 'react';
import {
  Shield,
  Flame,
  CheckCircle2,
  Calendar,
  Sparkles,
  Plus,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Target
} from 'lucide-react';
import { useLifeOS } from '../context/LifeOSContext';
import StatCard from '../components/common/StatCard';
import ProgressBar from '../components/common/ProgressBar';
import QuestCard from '../components/quests/QuestCard';
import WeeklyActivityChart from '../components/charts/WeeklyActivityChart';
import { isDueToday, isOverdue, formatDateLabel } from '../utils/dateUtils';

export default function Dashboard() {
  const {
    profile,
    levelInfo,
    quests,
    setQuickAddOpen,
    setEditingQuest,
    deleteQuest,
    setActiveTab,
    resetDemoData
  } = useLifeOS();

  const [todayFilter, setTodayFilter] = useState('all'); // all, pending, completed

  // Categorize quests
  const completedQuests = quests.filter((q) => q.status === 'completed');
  const overdueQuests = quests.filter((q) => isOverdue(q.dueDate, q.status === 'completed'));
  
  // Today's quests
  const todayQuests = quests.filter((q) => isDueToday(q.dueDate));
  const todayCompleted = todayQuests.filter((q) => q.status === 'completed');
  const todayPending = todayQuests.filter((q) => q.status !== 'completed');

  const filteredTodayQuests = todayQuests.filter((q) => {
    if (todayFilter === 'pending') return q.status !== 'completed';
    if (todayFilter === 'completed') return q.status === 'completed';
    return true;
  });

  // Daily goal calculation
  const dailyGoal = profile.dailyGoal || 3;
  const dailyProgressPercent = Math.min(100, Math.round((todayCompleted.length / dailyGoal) * 100));

  // Upcoming non-today quests
  const upcomingQuests = quests
    .filter((q) => !isDueToday(q.dueDate) && !isOverdue(q.dueDate, q.status === 'completed') && q.status !== 'completed')
    .slice(0, 4);

  // If there are zero quests in total
  const hasNoQuests = quests.length === 0;

  return (
    <div className="page-container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Welcome banner if no quests exist */}
      {hasNoQuests && (
        <div
          className="glass-panel"
          style={{
            padding: '2rem',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-card-hover)',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '1rem'
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)'
            }}
          >
            <Sparkles size={28} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Welcome to LifeOS Command Deck
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: '500px', marginTop: '0.25rem' }}>
              Your command center has no active quests. Initialize your personal journey or restore our starter mission deck to begin leveling up.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setQuickAddOpen(true)}
            >
              <Plus size={16} />
              <span>Create First Quest</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={resetDemoData}
            >
              Load Starter Quests
            </button>
          </div>
        </div>
      )}

      {/* Top Metric Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '1.25rem'
        }}
      >
        {/* Level & XP Card */}
        <div
          className="glass-panel"
          style={{
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Player Rank
            </span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(139, 92, 246, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#c084fc'
              }}
            >
              <Shield size={17} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="font-mono" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#c084fc' }}>
              Level {levelInfo.level}
            </span>
            <span style={{ fontSize: '0.75rem', color: levelInfo.badgeColor, fontWeight: 700 }}>
              {levelInfo.rankTitle}
            </span>
          </div>

          <div style={{ marginTop: '0.5rem' }}>
            <ProgressBar
              progress={levelInfo.xpInCurrentLevel}
              max={levelInfo.xpNeededForNext}
              color="var(--accent-violet)"
              height="6px"
              showLabel
              label="Next Level"
              detail={`${levelInfo.xpInCurrentLevel}/${levelInfo.xpNeededForNext} XP`}
            />
          </div>
        </div>

        {/* Streak Card */}
        <StatCard
          icon={Flame}
          label="Active Streak"
          value={`${profile.streak} Days`}
          subtext="Keep completing daily quests to amplify momentum"
          badgeText="Burning Hot"
          badgeColor="#f59e0b"
          accentColor="#f59e0b"
        />

        {/* Daily Goal Card */}
        <div
          className="glass-panel"
          style={{
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Daily Objective
            </span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(6, 182, 212, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8'
              }}
            >
              <Target size={17} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="font-mono" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {todayCompleted.length} / {dailyGoal}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600 }}>
              {dailyProgressPercent}% Achieved
            </span>
          </div>

          <div style={{ marginTop: '0.5rem' }}>
            <ProgressBar
              progress={todayCompleted.length}
              max={dailyGoal}
              color="#38bdf8"
              height="6px"
            />
          </div>
        </div>

        {/* Completed Quests Stat */}
        <StatCard
          icon={CheckCircle2}
          label="Quests Completed"
          value={completedQuests.length}
          subtext={`${quests.length - completedQuests.length} active quests in progress`}
          badgeText={`Total XP: ${profile.totalXP}`}
          badgeColor="#10b981"
          accentColor="#10b981"
          onClick={() => setActiveTab('quests')}
        />
      </div>

      {/* Overdue Warning Alert if any */}
      {overdueQuests.length > 0 && (
        <div
          className="animate-fade-in"
          style={{
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'rgba(244, 63, 94, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f43f5e'
              }}
            >
              <AlertTriangle size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#fda4af' }}>
                {overdueQuests.length} Overdue {overdueQuests.length === 1 ? 'Quest' : 'Quests'} Requiring Attention
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Tactical deadlines breached. Reschedule or conquer these objectives to protect your streak.
              </div>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => setActiveTab('planner')}
          >
            Review in Planner
          </button>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1.2fr)',
          gap: '1.75rem'
        }}
        className="dashboard-columns"
      >
        {/* Left Column: Today's Quests */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  color: 'var(--text-main)',
                  letterSpacing: '-0.01em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <span>Today's Tactical Objectives</span>
                <span
                  className="badge"
                  style={{
                    backgroundColor: 'rgba(56, 189, 248, 0.15)',
                    color: '#38bdf8',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    fontSize: '0.6875rem'
                  }}
                >
                  {todayQuests.length}
                </span>
              </h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                Scheduled for execution today
              </p>
            </div>

            {/* Filter buttons */}
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <button
                type="button"
                className={`btn btn-sm ${todayFilter === 'all' ? 'btn-secondary' : 'btn-ghost'}`}
                onClick={() => setTodayFilter('all')}
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
              >
                All ({todayQuests.length})
              </button>
              <button
                type="button"
                className={`btn btn-sm ${todayFilter === 'pending' ? 'btn-secondary' : 'btn-ghost'}`}
                onClick={() => setTodayFilter('pending')}
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
              >
                Pending ({todayPending.length})
              </button>
              <button
                type="button"
                className={`btn btn-sm ${todayFilter === 'completed' ? 'btn-secondary' : 'btn-ghost'}`}
                onClick={() => setTodayFilter('completed')}
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
              >
                Done ({todayCompleted.length})
              </button>
            </div>
          </div>

          {/* Quests List */}
          {filteredTodayQuests.length === 0 ? (
            <div
              className="glass-panel"
              style={{
                padding: '2.5rem 1.5rem',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                gap: '0.75rem',
                minHeight: '220px'
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#10b981'
                }}
              >
                <CheckCircle2 size={22} />
              </div>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-main)' }}>
                {todayFilter === 'pending' && todayQuests.length > 0
                  ? 'All of today\'s quests are completed! Great work!'
                  : 'No objectives assigned for today'}
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-dim)', maxWidth: '350px' }}>
                Add a new quest or pull upcoming tasks from your planner to keep advancing.
              </p>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setQuickAddOpen(true)}
                style={{ marginTop: '0.25rem' }}
              >
                <Plus size={15} />
                <span>Add Today Quest</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filteredTodayQuests.map((quest) => (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  onEdit={(q) => setEditingQuest(q)}
                  onDelete={(q) => deleteQuest(q.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Weekly Activity & Upcoming Deadlines */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Weekly Activity Matrix Chart */}
          <WeeklyActivityChart />

          {/* Upcoming Horizons Box */}
          <div
            className="glass-panel"
            style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.875rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={17} color="var(--accent-violet)" />
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Upcoming Deadlines
                </h3>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setActiveTab('planner')}
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              >
                <span>Planner</span>
                <ArrowRight size={13} />
              </button>
            </div>

            {upcomingQuests.length === 0 ? (
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-dim)', padding: '0.75rem 0' }}>
                No future deadlines scheduled. You're clear!
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {upcomingQuests.map((q) => (
                  <div
                    key={q.id}
                    onClick={() => setEditingQuest(q)}
                    style={{
                      padding: '0.625rem 0.875rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.75rem',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div
                        style={{
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                          color: 'var(--text-main)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {q.title}
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-dim)' }}>
                        {formatDateLabel(q.dueDate)} &bull; {q.category}
                      </div>
                    </div>
                    <span
                      className="badge badge-xp"
                      style={{ fontSize: '0.6875rem', padding: '0.15rem 0.4rem', flexShrink: 0 }}
                    >
                      +{q.xpReward} XP
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
