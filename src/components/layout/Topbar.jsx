import React from 'react';
import { Plus, Flame, Sparkles, Menu, Shield } from 'lucide-react';
import { useLifeOS } from '../../context/LifeOSContext';
import { getGreeting, getFullDateDisplay } from '../../utils/dateUtils';

export default function Topbar({ onOpenMobileMenu }) {
  const { profile, levelInfo, setQuickAddOpen, setActiveTab } = useLifeOS();

  return (
    <header
      style={{
        height: '70px',
        borderBottom: '1px solid var(--border-subtle)',
        backgroundColor: 'rgba(7, 11, 20, 0.8)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 40
      }}
    >
      {/* Left: Greeting & Current Date */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Mobile menu button */}
        <button
          type="button"
          className="btn-icon mobile-only"
          onClick={onOpenMobileMenu}
          aria-label="Open mobile menu"
          style={{ display: 'none' }}
        >
          <Menu size={22} />
        </button>

        <div>
          <h1
            style={{
              fontSize: '1.05rem',
              fontWeight: 700,
              color: 'var(--text-main)',
              letterSpacing: '-0.01em',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span>{getGreeting()},</span>
            <span
              style={{
                background: 'linear-gradient(90deg, #c084fc, #60a5fa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              {profile.name}
            </span>
          </h1>
          <p
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-dim)',
              letterSpacing: '0.01em'
            }}
          >
            {getFullDateDisplay()}
          </p>
        </div>
      </div>

      {/* Right: Gamified Stats Pills & Quick Add */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
        {/* Streak Flame Pill */}
        <div
          title={`${profile.streak} Day Quest Streak active!`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            padding: '0.35rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            color: '#f59e0b',
            fontSize: '0.8125rem',
            fontWeight: 700
          }}
        >
          <Flame size={16} fill="#f59e0b" />
          <span className="font-mono">{profile.streak}</span>
          <span style={{ fontSize: '0.6875rem', color: '#fbbf24', fontWeight: 600 }}>
            STREAK
          </span>
        </div>

        {/* Level / Total XP Pill */}
        <div
          onClick={() => setActiveTab('achievements')}
          title="Click to view achievements and rank progression"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'rgba(139, 92, 246, 0.12)',
            border: '1px solid rgba(139, 92, 246, 0.28)',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)'
          }}
        >
          <Shield size={15} color="#c084fc" />
          <span
            style={{
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: '#c084fc'
            }}
          >
            Lvl {levelInfo.level}
          </span>
          <span
            className="font-mono"
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
              paddingLeft: '0.5rem'
            }}
          >
            {profile.totalXP} XP
          </span>
        </div>

        {/* Quick Add Quest Button */}
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => setQuickAddOpen(true)}
          style={{
            padding: '0.45rem 0.95rem',
            gap: '0.375rem'
          }}
        >
          <Plus size={16} />
          <span>New Quest</span>
        </button>
      </div>
    </header>
  );
}
