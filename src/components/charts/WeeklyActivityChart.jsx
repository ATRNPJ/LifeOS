import React, { useState } from 'react';
import { Sparkles, CheckCircle2, TrendingUp } from 'lucide-react';
import { getPast7DaysData } from '../../utils/dateUtils';
import { useLifeOS } from '../../context/LifeOSContext';

export default function WeeklyActivityChart() {
  const { quests, history } = useLifeOS();
  const [hoveredDay, setHoveredDay] = useState(null);

  const daysData = getPast7DaysData(quests, history);
  const maxXP = Math.max(...daysData.map((d) => d.xp), 150);
  const totalWeekXP = daysData.reduce((acc, d) => acc + d.xp, 0);
  const totalWeekQuests = daysData.reduce((acc, d) => acc + d.quests, 0);

  return (
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
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={18} color="var(--accent-blue)" />
            <h3
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                letterSpacing: '-0.01em'
              }}
            >
              Weekly Activity Matrix
            </h3>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.125rem' }}>
            Trajectory across past 7 days
          </p>
        </div>

        {/* Weekly Totals */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Week Output
            </div>
            <div
              className="font-mono"
              style={{ fontSize: '0.875rem', fontWeight: 700, color: '#38bdf8' }}
            >
              {totalWeekQuests} Quests
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              XP Yield
            </div>
            <div
              className="font-mono"
              style={{ fontSize: '0.875rem', fontWeight: 700, color: '#34d399' }}
            >
              +{totalWeekXP} XP
            </div>
          </div>
        </div>
      </div>

      {/* SVG Bar Chart Visualization */}
      <div style={{ position: 'relative', height: '170px', width: '100%' }}>
        <svg
          viewBox="0 0 700 170"
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
          preserveAspectRatio="none"
        >
          {/* Subtle horizontal grid lines */}
          <line x1="0" y1="30" x2="700" y2="30" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="3 3" />
          <line x1="0" y1="80" x2="700" y2="80" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="3 3" />
          <line x1="0" y1="130" x2="700" y2="130" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="3 3" />

          {/* Render Bars */}
          {daysData.map((d, index) => {
            const barWidth = 44;
            const step = 700 / 7;
            const x = index * step + (step - barWidth) / 2;
            const heightPercent = d.xp > 0 ? (d.xp / maxXP) * 100 : (d.quests > 0 ? 25 : 6);
            const barHeight = Math.max(10, Math.min(110, (heightPercent / 100) * 110));
            const y = 140 - barHeight;

            const isHovered = hoveredDay === index;
            const isToday = d.isToday;

            return (
              <g
                key={d.dateStr}
                onMouseEnter={() => setHoveredDay(index)}
                onMouseLeave={() => setHoveredDay(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Background column highlight on hover */}
                {isHovered && (
                  <rect
                    x={index * step}
                    y="0"
                    width={step}
                    height="160"
                    fill="rgba(139, 92, 246, 0.08)"
                    rx="8"
                  />
                )}

                {/* Bar */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx="6"
                  fill={
                    isToday
                      ? 'url(#todayGradient)'
                      : d.xp > 0
                      ? 'url(#barGradient)'
                      : 'rgba(255, 255, 255, 0.06)'
                  }
                  stroke={
                    isToday
                      ? '#38bdf8'
                      : isHovered
                      ? '#8b5cf6'
                      : 'rgba(139, 92, 246, 0.2)'
                  }
                  strokeWidth={isToday || isHovered ? '2' : '1'}
                  filter={isToday || isHovered ? 'drop-shadow(0 0 8px rgba(56, 189, 248, 0.4))' : 'none'}
                  style={{ transition: 'all 0.2s ease' }}
                />

                {/* Day Label */}
                <text
                  x={x + barWidth / 2}
                  y="160"
                  textAnchor="middle"
                  fill={isToday ? '#38bdf8' : 'var(--text-muted)'}
                  fontSize="12"
                  fontWeight={isToday ? '700' : '500'}
                  fontFamily="'Plus Jakarta Sans', sans-serif"
                >
                  {isToday ? 'Today' : d.dayLabel}
                </text>

                {/* Value on top of bar */}
                {d.xp > 0 && (
                  <text
                    x={x + barWidth / 2}
                    y={y - 8}
                    textAnchor="middle"
                    fill={isToday ? '#38bdf8' : '#34d399'}
                    fontSize="11"
                    fontWeight="700"
                    fontFamily="'JetBrains Mono', monospace"
                  >
                    {d.xp}
                  </text>
                )}
              </g>
            );
          })}

          {/* Gradients */}
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="todayGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.5" />
            </linearGradient>
          </defs>
        </svg>

        {/* Hover Tooltip Popup */}
        {hoveredDay !== null && (
          <div
            className="animate-fade-in"
            style={{
              position: 'absolute',
              top: '5px',
              left: `${(hoveredDay / 6) * 75}%`,
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(15, 23, 42, 0.96)',
              border: '1px solid var(--border-card-hover)',
              borderRadius: '8px',
              padding: '0.4rem 0.75rem',
              boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
              pointerEvents: 'none',
              zIndex: 10,
              whiteSpace: 'nowrap'
            }}
          >
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {daysData[hoveredDay].dayLabel} ({daysData[hoveredDay].dateStr})
            </div>
            <div style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>
              +{daysData[hoveredDay].xp} XP &bull; {daysData[hoveredDay].quests} completed
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
