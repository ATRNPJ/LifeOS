import React from 'react';

export default function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
  badgeText,
  badgeColor = '#8b5cf6',
  accentColor = '#8b5cf6',
  onClick
}) {
  return (
    <div
      className="glass-panel"
      onClick={onClick}
      style={{
        padding: '1.25rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        minHeight: '130px'
      }}
    >
      {/* Subtle background glow dot */}
      <div
        style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          background: accentColor,
          opacity: 0.08,
          filter: 'blur(20px)',
          pointerEvents: 'none'
        }}
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.75rem'
        }}
      >
        <span
          style={{
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}
        >
          {label}
        </span>
        {Icon && (
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: `rgba(${
                accentColor === '#10b981'
                  ? '16, 185, 129'
                  : accentColor === '#06b6d4'
                  ? '6, 182, 212'
                  : accentColor === '#f59e0b'
                  ? '245, 158, 11'
                  : '139, 92, 246'
              }, 0.12)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: accentColor,
              border: `1px solid rgba(255, 255, 255, 0.06)`
            }}
          >
            <Icon size={17} />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.25rem' }}>
        <span
          className="font-mono"
          style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--text-main)',
            lineHeight: 1.1
          }}
        >
          {value}
        </span>
        {badgeText && (
          <span
            className="badge"
            style={{
              backgroundColor: `rgba(255, 255, 255, 0.06)`,
              color: badgeColor,
              border: `1px solid rgba(255, 255, 255, 0.1)`,
              fontSize: '0.6875rem'
            }}
          >
            {badgeText}
          </span>
        )}
      </div>

      {subtext && (
        <span
          style={{
            fontSize: '0.75rem',
            color: 'var(--text-dim)',
            marginTop: 'auto'
          }}
        >
          {subtext}
        </span>
      )}
    </div>
  );
}
