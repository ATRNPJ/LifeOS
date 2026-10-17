import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  AlertTriangle,
  Clock,
  Sparkles,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  CalendarDays,
  Plus
} from 'lucide-react';
import { useLifeOS } from '../context/LifeOSContext';
import QuestCard from '../components/quests/QuestCard';
import {
  isOverdue,
  isDueToday,
  isDueTomorrow,
  getDaysDifference,
  getCurrentDateString,
  formatDateLabel
} from '../utils/dateUtils';

export default function PlannerPage() {
  const {
    quests,
    changeQuestDueDate,
    setQuickAddOpen,
    setEditingQuest,
    deleteQuest
  } = useLifeOS();

  const [showCompleted, setShowCompleted] = useState(false);

  // Filter out completed if toggled
  const activeQuests = quests.filter((q) => (showCompleted ? true : q.status !== 'completed'));

  // Groupings
  const overdueQuests = [];
  const todayQuests = [];
  const tomorrowQuests = [];
  const thisWeekQuests = [];
  const futureQuests = [];
  const undatedQuests = [];

  activeQuests.forEach((q) => {
    if (!q.dueDate) {
      undatedQuests.push(q);
      return;
    }
    const isCompleted = q.status === 'completed';
    if (isOverdue(q.dueDate, isCompleted)) {
      overdueQuests.push(q);
    } else if (isDueToday(q.dueDate)) {
      todayQuests.push(q);
    } else if (isDueTomorrow(q.dueDate)) {
      tomorrowQuests.push(q);
    } else {
      const diff = getDaysDifference(q.dueDate);
      if (diff !== null && diff > 1 && diff <= 7) {
        thisWeekQuests.push(q);
      } else if (diff !== null && diff > 7) {
        futureQuests.push(q);
      } else {
        // Fallback
        todayQuests.push(q);
      }
    }
  });

  // Helper for quick rescheduling
  const handleQuickReschedule = (questId, target) => {
    const today = new Date();
    let newDate = new Date(today);

    if (target === 'today') {
      newDate = today;
    } else if (target === 'tomorrow') {
      newDate.setDate(today.getDate() + 1);
    } else if (target === 'nextWeek') {
      newDate.setDate(today.getDate() + 7);
    }

    const dateStr = newDate.toISOString().split('T')[0];
    changeQuestDueDate(questId, dateStr);
  };

  const renderSectionHeader = (title, count, icon, color, subtext) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.625rem 0',
        borderBottom: `1px solid rgba(255, 255, 255, 0.08)`,
        marginBottom: '0.875rem'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
        <div style={{ color }}>{icon}</div>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
          {title}
        </h2>
        <span
          className="badge"
          style={{
            backgroundColor: `rgba(255, 255, 255, 0.06)`,
            color: color,
            border: `1px solid rgba(255, 255, 255, 0.1)`,
            fontSize: '0.75rem'
          }}
        >
          {count}
        </span>
      </div>
      {subtext && (
        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
          {subtext}
        </span>
      )}
    </div>
  );

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
                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8'
              }}
            >
              <CalendarDays size={20} />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Tactical Planner
            </h1>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Chronological horizon view of upcoming missions and deadlines.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          {/* Toggle show completed */}
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.8125rem',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            <input
              type="checkbox"
              checked={showCompleted}
              onChange={(e) => setShowCompleted(e.target.checked)}
              style={{ accentColor: 'var(--accent-violet)', cursor: 'pointer' }}
            />
            <span>Show Completed</span>
          </label>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setQuickAddOpen(true)}
            style={{ gap: '0.375rem' }}
          >
            <Plus size={16} />
            <span>Add Quest</span>
          </button>
        </div>
      </div>

      {/* Timeline Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* 1. OVERDUE SECTION */}
        {overdueQuests.length > 0 && (
          <section
            style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'rgba(244, 63, 94, 0.05)',
              border: '1px solid rgba(244, 63, 94, 0.25)'
            }}
          >
            {renderSectionHeader(
              'Overdue Objectives',
              overdueQuests.length,
              <AlertTriangle size={18} />,
              '#f43f5e',
              'Immediate action required'
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {overdueQuests.map((q) => (
                <div key={q.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <QuestCard
                    quest={q}
                    onEdit={(item) => setEditingQuest(item)}
                    onDelete={(item) => deleteQuest(item.id)}
                  />
                  {/* Quick Reschedule bar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingLeft: '2.5rem' }}>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                      QUICK RESCHEDULE:
                    </span>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      style={{ fontSize: '0.6875rem', padding: '0.15rem 0.5rem', color: '#38bdf8' }}
                      onClick={() => handleQuickReschedule(q.id, 'today')}
                    >
                      Shift to Today
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      style={{ fontSize: '0.6875rem', padding: '0.15rem 0.5rem', color: '#a855f7' }}
                      onClick={() => handleQuickReschedule(q.id, 'tomorrow')}
                    >
                      Shift to Tomorrow
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 2. DUE TODAY SECTION */}
        <section>
          {renderSectionHeader(
            'Due Today',
            todayQuests.length,
            <Clock size={18} />,
            '#38bdf8',
            'Today\'s priority stream'
          )}
          {todayQuests.length === 0 ? (
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-dim)', fontStyle: 'italic', padding: '0.5rem 0' }}>
              No quests currently scheduled for today.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {todayQuests.map((q) => (
                <QuestCard
                  key={q.id}
                  quest={q}
                  onEdit={(item) => setEditingQuest(item)}
                  onDelete={(item) => deleteQuest(item.id)}
                />
              ))}
            </div>
          )}
        </section>

        {/* 3. TOMORROW SECTION */}
        <section>
          {renderSectionHeader(
            'Tomorrow',
            tomorrowQuests.length,
            <CalendarIcon size={18} />,
            '#a855f7',
            'Next in queue'
          )}
          {tomorrowQuests.length === 0 ? (
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-dim)', fontStyle: 'italic', padding: '0.5rem 0' }}>
              No quests scheduled for tomorrow.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {tomorrowQuests.map((q) => (
                <QuestCard
                  key={q.id}
                  quest={q}
                  onEdit={(item) => setEditingQuest(item)}
                  onDelete={(item) => deleteQuest(item.id)}
                />
              ))}
            </div>
          )}
        </section>

        {/* 4. UPCOMING THIS WEEK */}
        <section>
          {renderSectionHeader(
            'Upcoming (Next 7 Days)',
            thisWeekQuests.length,
            <CalendarIcon size={18} />,
            '#10b981',
            'Mid-term horizon'
          )}
          {thisWeekQuests.length === 0 ? (
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-dim)', fontStyle: 'italic', padding: '0.5rem 0' }}>
              No additional tasks planned for the next 7 days.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {thisWeekQuests.map((q) => (
                <QuestCard
                  key={q.id}
                  quest={q}
                  onEdit={(item) => setEditingQuest(item)}
                  onDelete={(item) => deleteQuest(item.id)}
                />
              ))}
            </div>
          )}
        </section>

        {/* 5. FUTURE / LATER */}
        {futureQuests.length > 0 && (
          <section>
            {renderSectionHeader(
              'Later Horizons',
              futureQuests.length,
              <CalendarIcon size={18} />,
              '#94a3b8',
              'Future pipeline'
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {futureQuests.map((q) => (
                <QuestCard
                  key={q.id}
                  quest={q}
                  onEdit={(item) => setEditingQuest(item)}
                  onDelete={(item) => deleteQuest(item.id)}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
