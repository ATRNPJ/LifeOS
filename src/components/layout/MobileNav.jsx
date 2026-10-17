import React from 'react';
import {
  LayoutDashboard,
  Swords,
  Calendar,
  Trophy,
  Cpu,
  Settings
} from 'lucide-react';
import { useLifeOS } from '../../context/LifeOSContext';

export default function MobileNav() {
  const { activeTab, setActiveTab } = useLifeOS();

  const items = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'quests', label: 'Quests', icon: Swords },
    { id: 'planner', label: 'Plan', icon: Calendar },
    { id: 'achievements', label: 'Badges', icon: Trophy },
    { id: 'strategist', label: 'AI Plan', icon: Cpu },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <nav
      className="mobile-bottom-nav"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '62px',
        backgroundColor: 'rgba(10, 16, 30, 0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 100,
        padding: '0 0.5rem'
      }}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveTab(item.id)}
            style={{
              background: 'transparent',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.2rem',
              color: isActive ? '#a855f7' : 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.25rem 0.5rem',
              minWidth: '50px',
              transition: 'color var(--transition-fast)'
            }}
          >
            <Icon size={19} />
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#f8fafc' : 'inherit'
              }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
