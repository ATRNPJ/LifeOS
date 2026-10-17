import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, Trash2, AlertCircle } from 'lucide-react';
import Modal from '../common/Modal';
import { CATEGORIES, PRIORITIES, DIFFICULTIES, STATUSES, calculateQuestXP } from '../../types/constants';
import { getCurrentDateString } from '../../utils/dateUtils';
import { useLifeOS } from '../../context/LifeOSContext';

export default function QuestModal({ isOpen, onClose, initialQuest = null }) {
  const { addQuest, updateQuest, deleteQuest } = useLifeOS();

  const isEditing = Boolean(initialQuest);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Career');
  const [priority, setPriority] = useState('Medium');
  const [difficulty, setDifficulty] = useState('Medium');
  const [status, setStatus] = useState('todo');
  const [dueDate, setDueDate] = useState(getCurrentDateString());
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (initialQuest) {
      setTitle(initialQuest.title || '');
      setDescription(initialQuest.description || '');
      setCategory(initialQuest.category || 'Career');
      setPriority(initialQuest.priority || 'Medium');
      setDifficulty(initialQuest.difficulty || 'Medium');
      setStatus(initialQuest.status || 'todo');
      setDueDate(initialQuest.dueDate || getCurrentDateString());
    } else {
      setTitle('');
      setDescription('');
      setCategory('Career');
      setPriority('Medium');
      setDifficulty('Medium');
      setStatus('todo');
      setDueDate(getCurrentDateString());
    }
    setError('');
    setConfirmDelete(false);
  }, [initialQuest, isOpen]);

  const calculatedXP = calculateQuestXP(difficulty, priority);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Quest title is required to initialize task protocol.');
      return;
    }

    if (isEditing) {
      updateQuest(initialQuest.id, {
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        difficulty,
        status,
        dueDate
      });
    } else {
      addQuest({
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        difficulty,
        status,
        dueDate,
        xpReward: calculatedXP
      });
    }

    onClose();
  };

  const handleDelete = () => {
    if (initialQuest) {
      deleteQuest(initialQuest.id);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Modify Quest Parameters' : 'Forge New Quest'}
      subtitle={isEditing ? `Refining ID #${initialQuest?.id}` : 'Configure tactical parameters and earn progression XP'}
      maxWidth="580px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Title Field */}
        <div>
          <label htmlFor="quest-title" className="form-label">
            Quest Objective <span style={{ color: 'var(--accent-rose)' }}>*</span>
          </label>
          <input
            id="quest-title"
            type="text"
            className="form-input"
            placeholder="e.g. Complete System Refactor or 30-min Sprint"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError('');
            }}
            autoFocus
          />
          {error && <div className="form-error">{error}</div>}
        </div>

        {/* Description Field */}
        <div>
          <label htmlFor="quest-desc" className="form-label">
            Operational Intel & Notes (Optional)
          </label>
          <textarea
            id="quest-desc"
            className="form-textarea"
            rows={3}
            placeholder="Subtasks, execution constraints, or tactical notes..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Category & Status */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label htmlFor="quest-category" className="form-label">Domain / Category</label>
            <select
              id="quest-category"
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {Object.keys(CATEGORIES).map((key) => (
                <option key={key} value={key} style={{ background: '#0f172a' }}>
                  {CATEGORIES[key].name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="quest-status" className="form-label">Execution Status</label>
            <select
              id="quest-status"
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {Object.keys(STATUSES).map((key) => (
                <option key={key} value={key} style={{ background: '#0f172a' }}>
                  {STATUSES[key].label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Difficulty & Priority */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label htmlFor="quest-difficulty" className="form-label">Difficulty Rating</label>
            <select
              id="quest-difficulty"
              className="form-select"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              {Object.keys(DIFFICULTIES).map((key) => (
                <option key={key} value={key} style={{ background: '#0f172a' }}>
                  {DIFFICULTIES[key].label} ({DIFFICULTIES[key].baseXP} Base XP)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="quest-priority" className="form-label">Priority Multiplier</label>
            <select
              id="quest-priority"
              className="form-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              {Object.keys(PRIORITIES).map((key) => (
                <option key={key} value={key} style={{ background: '#0f172a' }}>
                  {PRIORITIES[key].label} ({PRIORITIES[key].multiplier}x)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Due Date & XP Reward Calculation */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', alignItems: 'center' }}>
          <div>
            <label htmlFor="quest-duedate" className="form-label">Tactical Due Date</label>
            <input
              id="quest-duedate"
              type="date"
              className="form-input"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          {/* XP Preview Box */}
          <div
            style={{
              padding: '0.625rem 0.875rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '1.125rem'
            }}
          >
            <div style={{ fontSize: '0.6875rem', color: '#6ee7b7', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Sparkles size={12} />
              <span>ESTIMATED BOUNTY</span>
            </div>
            <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399' }}>
              +{calculatedXP} XP
            </div>
          </div>
        </div>

        {/* Delete confirmation banner if requested */}
        {confirmDelete && (
          <div
            className="animate-fade-in"
            style={{
              padding: '0.875rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(244, 63, 94, 0.12)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fda4af', fontSize: '0.8125rem', fontWeight: 600 }}>
              <AlertCircle size={16} />
              <span>Are you sure you want to delete this quest?</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={handleDelete}
              >
                Yes, Delete Quest
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setConfirmDelete(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Modal Footer Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-subtle)',
            marginTop: '0.5rem'
          }}
        >
          {isEditing && !confirmDelete ? (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              style={{ color: 'var(--accent-rose)' }}
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 size={15} />
              <span>Delete</span>
            </button>
          ) : (
            <div />
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {isEditing ? 'Save Changes' : 'Initialize Quest'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
