import React from 'react';
import {
  LayoutDashboard,
  Swords,
  Calendar,
  Trophy,
  Cpu,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap
} from 'lucide-react';
import { useLifeOS } from '../../context/LifeOSContext';
import ProgressBar from '../common/ProgressBar';

export default function Sidebar() {
  const {
    activeTab,
    setActiveTab,
    sidebarCollapsed,
    setSidebarCollapsed,
    profile,
    levelInfo
  } = useLifeOS();

  const navItems = [
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
    { id: 'quests', label: 'Quests & Logs', icon: Swords },
    { id: 'planner', label: 'Tactical Planner', icon: Calendar },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'strategist', label: 'AI Strategist', icon: Cpu, badge: 'Demo' },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside
      className="sidebar-desktop"
      style={{
        width: sidebarCollapsed ? '80px' : '260px',
        backgroundColor: 'rgba(10, 16, 30, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 50,
        userSelect: 'none'
      }}
    >
      {/* Top Header */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: sidebarCollapsed ? 'center' : 'space-between',
            padding: sidebarCollapsed ? '1.5rem 0.5rem' : '1.5rem 1.25rem',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Hexagon/Emblem Icon */}
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)',
                color: '#fff',
                fontWeight: 800,
                fontSize: '1.1rem',
                flexShrink: 0
              }}
            >
              <Zap size={20} fill="#fff" />
            </div>

            {!sidebarCollapsed && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <span
                    style={{
                      fontSize: '1.125rem',
                      fontWeight: 800,
                      letterSpacing: '-0.02em',
                      color: '#ffffff'
                    }}
                  >
                    Life<span style={{ color: 'var(--accent-blue)' }}>OS</span>
                  </span>
                  <span
                    className="badge"
                    style={{
                      fontSize: '0.625rem',
                      padding: '0.1rem 0.35rem',
                      background: 'rgba(139, 92, 246, 0.2)',
                      color: '#c084fc',
                      border: '1px solid rgba(139, 92, 246, 0.3)'
                    }}
                  >
                    v1.0
                  </span>
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-dim)', letterSpacing: '0.04em' }}>
                  COMMAND DECK
                </div>
              </div>
            )}
          </div>

          {!sidebarCollapsed && (
            <button
              type="button"
              className="btn-icon"
              onClick={() => setSidebarCollapsed(true)}
              aria-label="Collapse sidebar"
              title="Collapse sidebar"
              style={{ padding: '0.375rem' }}
            >
              <ChevronLeft size={18} />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav style={{ padding: '1.25rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                title={sidebarCollapsed ? item.label : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  width: '100%',
                  padding: sidebarCollapsed ? '0.75rem' : '0.65rem 0.875rem',
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isActive
                    ? 'rgba(139, 92, 246, 0.16)'
                    : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  border: isActive
                    ? '1px solid rgba(139, 92, 246, 0.35)'
                    : '1px solid transparent',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  position: 'relative',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.875rem'
                }}
              >
                <Icon
                  size={19}
                  color={isActive ? '#a855f7' : 'currentColor'}
                  style={{ flexShrink: 0 }}
                />

                {!sidebarCollapsed && (
                  <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
                )}

                {!sidebarCollapsed && item.badge && (
                  <span
                    className="badge"
                    style={{
                      fontSize: '0.625rem',
                      padding: '0.1rem 0.35rem',
                      backgroundColor: 'rgba(56, 189, 248, 0.15)',
                      color: '#38bdf8',
                      border: '1px solid rgba(56, 189, 248, 0.3)'
                    }}
                  >
                    {item.badge}
                  </span>
                )}

                {/* Active indicator bar */}
                {isActive && (
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '20%',
                      bottom: '20%',
                      width: '3px',
                      backgroundColor: 'var(--accent-violet)',
                      borderRadius: '0 4px 4px 0',
                      boxShadow: '0 0 8px var(--accent-violet)'
                    }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile & Toggle Section */}
      <div
        style={{
          padding: sidebarCollapsed ? '1rem 0.5rem' : '1.25rem 1rem',
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'rgba(15, 23, 42, 0.4)'
        }}
      >
        {sidebarCollapsed ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <div
              title={`${profile.name} (Lvl ${levelInfo.level})`}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: 'rgba(139, 92, 246, 0.25)',
                border: '1px solid rgba(139, 92, 246, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                cursor: 'pointer'
              }}
              onClick={() => setActiveTab('settings')}
            >
              {profile.avatar || '⚡'}
            </div>
            <button
              type="button"
              className="btn-icon"
              onClick={() => setSidebarCollapsed(false)}
              aria-label="Expand sidebar"
              title="Expand sidebar"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        ) : (
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '0.875rem',
                cursor: 'pointer'
              }}
              onClick={() => setActiveTab('settings')}
              title="Go to settings"
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(139, 92, 246, 0.2)',
                  border: '1px solid rgba(139, 92, 246, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.3rem',
                  flexShrink: 0
                }}
              >
                {profile.avatar || '⚡'}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: 'var(--text-main)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {profile.name}
                </div>
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: levelInfo.badgeColor,
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {profile.title || levelInfo.rankTitle}
                </div>
              </div>
            </div>

            {/* Level & XP Mini Bar */}
            <div style={{ marginBottom: '0.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  marginBottom: '0.375rem',
                  color: 'var(--text-muted)'
                }}
              >
                <span style={{ color: '#c084fc' }}>Level {levelInfo.level}</span>
                <span className="font-mono">
                  {levelInfo.xpInCurrentLevel} / {levelInfo.xpNeededForNext} XP
                </span>
              </div>
              <ProgressBar
                progress={levelInfo.xpInCurrentLevel}
                max={levelInfo.xpNeededForNext}
                color="var(--accent-violet)"
                height="6px"
              />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
