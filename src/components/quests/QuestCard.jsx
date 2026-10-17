import React, { useState } from 'react';
import {
  Check,
  Calendar,
  Sparkles,
  Edit3,
  Trash2,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useLifeOS } from '../../context/LifeOSContext';
import Badge from '../common/Badge';
import { formatDateLabel, isOverdue, isDueToday } from '../../utils/dateUtils';

export default function QuestCard({ quest, onEdit, onDelete }) {
  const { toggleQuestCompletion } = useLifeOS();
  const [expanded, setExpanded] = useState(false);

  const isCompleted = quest.status === 'completed';
  const overdue = isOverdue(quest.dueDate, isCompleted);
  const dueToday = isDueToday(quest.dueDate);

  const handleToggle = (e) => {
    e.stopPropagation();
    toggleQuestCompletion(quest.id);
  };

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.125rem 1.25rem',
        borderRadius: 'var(--radius-lg)',
        border: overdue
          ? '1px solid rgba(244, 63, 94, 0.4)'
          : isCompleted
          ? '1px solid rgba(16, 185, 129, 0.2)'
          : '1px solid var(--border-subtle)',
        backgroundColor: isCompleted
          ? 'rgba(15, 23, 42, 0.45)'
          : 'var(--bg-card)',
        opacity: isCompleted ? 0.78 : 1,
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}
    >
      {/* Top Row: Checkbox, Title, and Action Controls */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
        {/* Checkbox */}
        <button
          type="button"
          onClick={handleToggle}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault();
              handleToggle(e);
            }
          }}
          aria-label={isCompleted ? `Mark incomplete: ${quest.title}` : `Complete quest: ${quest.title}`}
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '6px',
            border: isCompleted
              ? '2px solid #10b981'
              : overdue
              ? '2px solid rgba(244, 63, 94, 0.6)'
              : '2px solid rgba(255, 255, 255, 0.25)',
            backgroundColor: isCompleted ? '#10b981' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            marginTop: '0.125rem',
            transition: 'all var(--transition-fast)',
            boxShadow: isCompleted ? '0 0 10px rgba(16, 185, 129, 0.4)' : 'none'
          }}
        >
          {isCompleted && <Check size={16} strokeWidth={3} color="#ffffff" />}
        </button>

        {/* Quest Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem'
            }}
          >
            <h3
              style={{
                fontSize: '0.9375rem',
                fontWeight: 600,
                color: isCompleted ? 'var(--text-muted)' : 'var(--text-main)',
                textDecoration: isCompleted ? 'line-through' : 'none',
                lineHeight: 1.4,
                wordBreak: 'break-word'
              }}
            >
              {quest.title}
            </h3>

            {/* Quick Actions (Edit, Delete) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                flexShrink: 0
              }}
            >
              <button
                type="button"
                className="btn-icon"
                onClick={() => onEdit(quest)}
                aria-label={`Edit ${quest.title}`}
                title="Edit quest"
                style={{ padding: '0.35rem' }}
              >
                <Edit3 size={15} />
              </button>
              <button
                type="button"
                className="btn-icon"
                onClick={() => onDelete(quest)}
                aria-label={`Delete ${quest.title}`}
                title="Delete quest"
                style={{ padding: '0.35rem', color: 'rgba(244, 63, 94, 0.7)' }}
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>

          {/* Description preview / collapsible */}
          {quest.description && (
            <div style={{ marginTop: '0.35rem' }}>
              <p
                style={{
                  fontSize: '0.8125rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.45,
                  display: expanded ? 'block' : '-webkit-box',
                  WebkitLineClamp: expanded ? 'unset' : 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {quest.description}
              </p>
              {quest.description.length > 100 && (
                <button
                  type="button"
                  onClick={() => setExpanded(!expanded)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-blue)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    padding: '0.15rem 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                    marginTop: '0.2rem'
                  }}
                >
                  {expanded ? (
                    <>
                      <span>Show less</span>
                      <ChevronUp size={12} />
                    </>
                  ) : (
                    <>
                      <span>Show details</span>
                      <ChevronDown size={12} />
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Metadata Badges Row */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
          paddingTop: '0.625rem',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: '0.75rem'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.375rem' }}>
          <Badge type="category" value={quest.category} size="sm" />
          <Badge type="priority" value={quest.priority} size="sm" />
          <Badge type="difficulty" value={quest.difficulty} size="sm" />

          {/* Due date tag */}
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              color: overdue ? '#f43f5e' : dueToday ? '#38bdf8' : 'var(--text-dim)',
              fontWeight: overdue || dueToday ? 600 : 500,
              marginLeft: '0.25rem'
            }}
          >
            {overdue ? <AlertTriangle size={13} /> : <Calendar size={13} />}
            {formatDateLabel(quest.dueDate)}
          </span>
        </div>

        {/* XP Reward Pill */}
        <div
          className="badge-xp"
          title={`Awards ${quest.xpReward} XP upon completion`}
          style={{
            padding: '0.2rem 0.5rem',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            fontWeight: 700
          }}
        >
          <Sparkles size={12} />
          <span>+{quest.xpReward} XP</span>
        </div>
      </div>
    </div>
  );
}
