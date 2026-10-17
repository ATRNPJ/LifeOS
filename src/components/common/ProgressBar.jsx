import React from 'react';

export default function ProgressBar({
  progress = 0,
  max = 100,
  color = '#8b5cf6',
  height = '8px',
  showLabel = false,
  label = '',
  detail = '',
  glow = true
}) {
  const percentage = Math.min(100, Math.max(0, (progress / max) * 100));

  return (
    <div style={{ width: '100%' }}>
      {(showLabel || detail) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.375rem',
            fontSize: '0.75rem',
            fontWeight: 600
          }}
        >
          {showLabel && <span style={{ color: 'var(--text-muted)' }}>{label}</span>}
          {detail && (
            <span
              className="font-mono"
              style={{ color: 'var(--text-main)', marginLeft: 'auto' }}
            >
              {detail}
            </span>
          )}
        </div>
      )}
      <div
        style={{
          width: '100%',
          height,
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '9999px',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: color,
            borderRadius: '9999px',
            transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: glow ? `0 0 10px ${color}` : 'none'
          }}
        />
      </div>
    </div>
  );
}
