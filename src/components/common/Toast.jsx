import React from 'react';
import { Sparkles, Trophy, Award, CheckCircle2, Info, X } from 'lucide-react';
import { useLifeOS } from '../../context/LifeOSContext';

export default function ToastContainer() {
  const { toasts, dismissToast } = useLifeOS();

  if (!toasts.length) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        maxWidth: '380px',
        width: 'calc(100vw - 3rem)',
        pointerEvents: 'none'
      }}
    >
      {toasts.map((toast) => {
        const isXP = toast.type === 'xp';
        const isAchievement = toast.type === 'achievement';
        const isLevel = toast.type === 'level';

        let borderColor = 'rgba(255, 255, 255, 0.12)';
        let shadow = '0 8px 24px rgba(0, 0, 0, 0.4)';
        let icon = <Info size={18} color="#38bdf8" />;

        if (isXP) {
          borderColor = 'rgba(16, 185, 129, 0.4)';
          shadow = '0 8px 25px rgba(0, 0, 0, 0.5), 0 0 15px rgba(16, 185, 129, 0.25)';
          icon = <Sparkles size={18} color="#10b981" />;
        } else if (isAchievement) {
          borderColor = 'rgba(245, 158, 11, 0.45)';
          shadow = '0 8px 25px rgba(0, 0, 0, 0.5), 0 0 20px rgba(245, 158, 11, 0.3)';
          icon = <Trophy size={18} color="#f59e0b" />;
        } else if (isLevel) {
          borderColor = 'rgba(168, 85, 247, 0.5)';
          shadow = '0 8px 30px rgba(0, 0, 0, 0.6), 0 0 25px rgba(168, 85, 247, 0.4)';
          icon = <Award size={20} color="#c084fc" />;
        }

        return (
          <div
            key={toast.id}
            className="glass-panel animate-fade-in"
            style={{
              pointerEvents: 'auto',
              padding: '0.875rem 1.125rem',
              borderRadius: 'var(--radius-md)',
              border: `1px solid ${borderColor}`,
              boxShadow: shadow,
              backgroundColor: 'rgba(15, 23, 42, 0.94)',
              backdropFilter: 'blur(16px)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              position: 'relative'
            }}
          >
            <div style={{ marginTop: '0.125rem', flexShrink: 0 }}>
              {icon}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.125rem'
                }}
              >
                <h4
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: isLevel ? '#c084fc' : isAchievement ? '#fcd34d' : 'var(--text-main)'
                  }}
                >
                  {toast.title}
                </h4>
                {toast.xpAmount && (
                  <span
                    className="badge badge-xp"
                    style={{ fontSize: '0.6875rem', padding: '0.1rem 0.4rem' }}
                  >
                    +{toast.xpAmount} XP
                  </span>
                )}
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                {toast.message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="btn-icon"
              style={{
                padding: '0.25rem',
                margin: '-0.25rem -0.5rem 0 0',
                opacity: 0.6
              }}
              aria-label="Dismiss toast"
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
