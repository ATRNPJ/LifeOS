import React from 'react';
import { CATEGORIES, PRIORITIES, DIFFICULTIES, STATUSES } from '../../types/constants';

export default function Badge({ type, value, size = 'md' }) {
  let label = value;
  let color = '#94a3b8';
  let bg = 'rgba(148, 163, 184, 0.12)';
  let border = 'rgba(148, 163, 184, 0.25)';

  if (type === 'category' && CATEGORIES[value]) {
    const cat = CATEGORIES[value];
    label = cat.name;
    color = cat.color;
    bg = cat.bg;
    border = cat.border;
  } else if (type === 'priority' && PRIORITIES[value]) {
    const prio = PRIORITIES[value];
    label = prio.label;
    color = prio.color;
    bg = `rgba(${prio.color === '#f43f5e' ? '244, 63, 94' : prio.color === '#f59e0b' ? '245, 158, 11' : prio.color === '#38bdf8' ? '56, 189, 248' : '148, 163, 184'}, 0.12)`;
    border = prio.border;
  } else if (type === 'difficulty' && DIFFICULTIES[value]) {
    const diff = DIFFICULTIES[value];
    label = diff.label;
    color = diff.color;
    bg = `rgba(${diff.color === '#f59e0b' ? '245, 158, 11' : diff.color === '#a855f7' ? '168, 85, 247' : diff.color === '#38bdf8' ? '56, 189, 248' : '16, 185, 129'}, 0.12)`;
    border = `rgba(${diff.color === '#f59e0b' ? '245, 158, 11' : diff.color === '#a855f7' ? '168, 85, 247' : diff.color === '#38bdf8' ? '56, 189, 248' : '16, 185, 129'}, 0.3)`;
  } else if (type === 'status' && STATUSES[value]) {
    const stat = STATUSES[value];
    label = stat.label;
    color = stat.color;
    bg = `rgba(${stat.color === '#10b981' ? '16, 185, 129' : stat.color === '#38bdf8' ? '56, 189, 248' : '148, 163, 184'}, 0.12)`;
    border = `rgba(${stat.color === '#10b981' ? '16, 185, 129' : stat.color === '#38bdf8' ? '56, 189, 248' : '148, 163, 184'}, 0.3)`;
  }

  const isSmall = size === 'sm';

  return (
    <span
      className="badge"
      style={{
        backgroundColor: bg,
        color: color,
        border: `1px solid ${border}`,
        fontSize: isSmall ? '0.6875rem' : '0.75rem',
        padding: isSmall ? '0.15rem 0.45rem' : '0.2rem 0.6rem'
      }}
    >
      <span
        style={{
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          backgroundColor: color,
          boxShadow: `0 0 6px ${color}`
        }}
      />
      {label}
    </span>
  );
}
