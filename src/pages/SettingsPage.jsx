import React, { useState } from 'react';
import {
  Settings,
  User,
  Sliders,
  Volume2,
  VolumeX,
  RotateCcw,
  Download,
  Upload,
  AlertTriangle,
  Check,
  Sparkles,
  ShieldCheck,
  Palette
} from 'lucide-react';
import { useLifeOS } from '../context/LifeOSContext';
import { sound } from '../utils/gamification';
import Modal from '../components/common/Modal';

export default function SettingsPage() {
  const {
    profile,
    setProfile,
    quests,
    achievements,
    resetDemoData,
    exportData,
    importData,
    showToast
  } = useLifeOS();

  // Local form state
  const [name, setName] = useState(profile.name || 'Alex Mercer');
  const [title, setTitle] = useState(profile.title || 'Cyber Vanguard');
  const [avatar, setAvatar] = useState(profile.avatar || '⚡');
  const [dailyGoal, setDailyGoal] = useState(profile.dailyGoal || 3);
  const [soundEffects, setSoundEffects] = useState(profile.soundEffects !== false);
  const [theme, setTheme] = useState(profile.theme || 'deep-navy');

  // Confirmation modal state for reset
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importModalOpen, setImportModalOpen] = useState(false);

  const avatarsList = ['⚡', '🛡️', '⚔️', '🔮', '🧬', '🚀', '💎', '🐉', '🎯', '👑'];

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfile((prev) => ({
      ...prev,
      name: name.trim() || 'Alex Mercer',
      title: title.trim() || 'Cyber Vanguard',
      avatar,
      dailyGoal: Number(dailyGoal) || 3,
      soundEffects,
      theme
    }));

    showToast({
      type: 'info',
      title: 'Settings Saved',
      message: 'Profile configuration updated successfully.'
    });
  };

  const handleTestAudio = () => {
    sound.playLevelUp();
  };

  const handleConfirmReset = () => {
    resetDemoData();
    setResetModalOpen(false);
    // Sync local form state
    setName('Alex Mercer');
    setTitle('Cyber Vanguard');
    setAvatar('⚡');
    setDailyGoal(3);
    setSoundEffects(true);
    setTheme('deep-navy');
  };

  const handleExecuteImport = () => {
    if (!importJsonText.trim()) return;
    const success = importData(importJsonText);
    if (success) {
      setImportModalOpen(false);
      setImportJsonText('');
    }
  };

  return (
    <div className="page-container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '900px' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: 'rgba(139, 92, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#c084fc'
            }}
          >
            <Settings size={20} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            System Settings & Preferences
          </h1>
        </div>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          Configure user identity, sensory feedback, daily objectives, and data backups.
        </p>
      </div>

      <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {/* Profile Card */}
        <div
          className="glass-panel"
          style={{
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <User size={18} color="var(--accent-violet)" />
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Tactical Profile & Avatar
            </h2>
          </div>

          {/* Avatar selector */}
          <div>
            <label className="form-label">Profile Insignia / Avatar</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.35rem' }}>
              {avatarsList.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => setAvatar(av)}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    fontSize: '1.25rem',
                    backgroundColor: avatar === av ? 'rgba(139, 92, 246, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                    border: avatar === av ? '2px solid var(--accent-violet)' : '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div>
              <label htmlFor="user-name" className="form-label">Display Name</label>
              <input
                id="user-name"
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="user-title" className="form-label">Character Class / Rank Title</label>
              <input
                id="user-title"
                type="text"
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>

          {/* Daily Goal */}
          <div>
            <label htmlFor="daily-goal" className="form-label">
              Daily Quest Objective Target: <span className="font-mono" style={{ color: 'var(--accent-blue)' }}>{dailyGoal} Quests / Day</span>
            </label>
            <input
              id="daily-goal"
              type="range"
              min="1"
              max="10"
              step="1"
              value={dailyGoal}
              onChange={(e) => setDailyGoal(Number(e.target.value))}
              style={{ width: '100%', marginTop: '0.35rem', accentColor: 'var(--accent-blue)' }}
            />
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
              Used to gauge your daily dashboard progress meter and consistency streak.
            </div>
          </div>
        </div>

        {/* Audio & Sensory Card */}
        <div
          className="glass-panel"
          style={{
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <Volume2 size={18} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Sensory & Sound Synthesis
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
                Web Audio Sound Effects
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.125rem' }}>
                Harmonic chime synthesis when completing quests, leveling up, or claiming achievements.
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleTestAudio}
                title="Test audio chime"
              >
                <Sparkles size={14} />
                <span>Test Chime</span>
              </button>

              <button
                type="button"
                className={`btn btn-sm ${soundEffects ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSoundEffects(!soundEffects)}
              >
                {soundEffects ? <Volume2 size={16} /> : <VolumeX size={16} />}
                <span>{soundEffects ? 'Enabled' : 'Muted'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button type="submit" className="btn btn-primary" style={{ padding: '0.625rem 1.75rem' }}>
            <Check size={16} />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>

      {/* Data Backup & Reset Card */}
      <div
        className="glass-panel"
        style={{
          padding: '1.5rem',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
          <ShieldCheck size={18} color="#10b981" />
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Data Persistence & Ledger Management
          </h2>
        </div>

        <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          All LifeOS progression, quest records, and statistics reside in your browser's private localStorage. Export a JSON backup to transfer data across workstations.
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={exportData}
          >
            <Download size={15} />
            <span>Export Backup (JSON)</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setImportModalOpen(true)}
          >
            <Upload size={15} />
            <span>Import Backup (JSON)</span>
          </button>

          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => setResetModalOpen(true)}
            style={{ marginLeft: 'auto' }}
          >
            <RotateCcw size={15} />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Resetting Demo Data */}
      <Modal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        title="Reset LifeOS Environment?"
        subtitle="This operation resets all records to the factory demo defaults."
        maxWidth="460px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(244, 63, 94, 0.1)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              display: 'flex',
              gap: '0.75rem'
            }}
          >
            <AlertTriangle size={22} color="#f43f5e" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '0.8125rem', color: '#fda4af', lineHeight: 1.4 }}>
              <strong>Caution:</strong> All custom quests, acquired XP, unlocked achievements, and personal tweaks will be replaced with initial demo items.
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setResetModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleConfirmReset}
            >
              Confirm Factory Reset
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal for Importing JSON Data */}
      <Modal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        title="Import LifeOS Backup"
        subtitle="Paste your exported JSON state payload below"
        maxWidth="500px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <textarea
            className="form-textarea"
            rows={8}
            placeholder='{"version": 1, "profile": {...}, "quests": [...]}'
            value={importJsonText}
            onChange={(e) => setImportJsonText(e.target.value)}
            style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setImportModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleExecuteImport}
              disabled={!importJsonText.trim()}
            >
              Restore State
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
