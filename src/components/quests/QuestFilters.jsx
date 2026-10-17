import React from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { CATEGORIES, STATUSES, PRIORITIES } from '../../types/constants';

export default function QuestFilters({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  sortBy,
  setSortBy,
  onReset
}) {
  const hasActiveFilters =
    searchTerm ||
    categoryFilter !== 'all' ||
    statusFilter !== 'all' ||
    priorityFilter !== 'all' ||
    sortBy !== 'dueDate_asc';

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.25rem',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}
    >
      {/* Top Search & Sort Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '0.875rem',
          alignItems: 'center'
        }}
      >
        {/* Search Bar */}
        <div style={{ position: 'relative', width: '100%' }}>
          <Search
            size={16}
            color="var(--text-muted)"
            style={{
              position: 'absolute',
              left: '0.875rem',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none'
            }}
          />
          <input
            type="text"
            className="form-input"
            placeholder="Search quests by title, description or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              paddingLeft: '2.35rem',
              paddingRight: searchTerm ? '2.25rem' : '0.875rem'
            }}
          />
          {searchTerm && (
            <button
              type="button"
              className="btn-icon"
              onClick={() => setSearchTerm('')}
              style={{
                position: 'absolute',
                right: '0.5rem',
                top: '50%',
                transform: 'translateY(-50%)',
                padding: '0.25rem'
              }}
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowUpDown size={15} color="var(--text-muted)" />
          <select
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ width: 'auto', minWidth: '160px' }}
          >
            <option value="dueDate_asc" style={{ background: '#0f172a' }}>Due: Earliest First</option>
            <option value="dueDate_desc" style={{ background: '#0f172a' }}>Due: Latest First</option>
            <option value="xp_desc" style={{ background: '#0f172a' }}>XP: Highest First</option>
            <option value="priority_desc" style={{ background: '#0f172a' }}>Priority: Highest</option>
            <option value="title_asc" style={{ background: '#0f172a' }}>Title: A to Z</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)', marginRight: '0.25rem' }}>
          CATEGORY:
        </span>
        <button
          type="button"
          onClick={() => setCategoryFilter('all')}
          className={`badge ${categoryFilter === 'all' ? 'badge-active' : ''}`}
          style={{
            cursor: 'pointer',
            border: categoryFilter === 'all' ? '1px solid var(--accent-violet)' : '1px solid var(--border-subtle)',
            backgroundColor: categoryFilter === 'all' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255, 255, 255, 0.04)',
            color: categoryFilter === 'all' ? '#ffffff' : 'var(--text-muted)'
          }}
        >
          All Domains
        </button>
        {Object.keys(CATEGORIES).map((key) => {
          const cat = CATEGORIES[key];
          const isSelected = categoryFilter === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setCategoryFilter(key)}
              className="badge"
              style={{
                cursor: 'pointer',
                border: isSelected ? `1px solid ${cat.color}` : '1px solid var(--border-subtle)',
                backgroundColor: isSelected ? cat.bg : 'rgba(255, 255, 255, 0.04)',
                color: isSelected ? cat.color : 'var(--text-muted)'
              }}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Status & Priority Row */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          paddingTop: '0.5rem',
          borderTop: '1px solid var(--border-subtle)'
        }}
      >
        {/* Status Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)', marginRight: '0.25rem' }}>
            STATUS:
          </span>
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className="badge"
            style={{
              cursor: 'pointer',
              border: statusFilter === 'all' ? '1px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
              backgroundColor: statusFilter === 'all' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.04)',
              color: statusFilter === 'all' ? '#ffffff' : 'var(--text-muted)'
            }}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('todo')}
            className="badge"
            style={{
              cursor: 'pointer',
              border: statusFilter === 'todo' ? '1px solid #94a3b8' : '1px solid var(--border-subtle)',
              backgroundColor: statusFilter === 'todo' ? 'rgba(148, 163, 184, 0.2)' : 'rgba(255, 255, 255, 0.04)',
              color: statusFilter === 'todo' ? '#ffffff' : 'var(--text-muted)'
            }}
          >
            To Do
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('in_progress')}
            className="badge"
            style={{
              cursor: 'pointer',
              border: statusFilter === 'in_progress' ? '1px solid #38bdf8' : '1px solid var(--border-subtle)',
              backgroundColor: statusFilter === 'in_progress' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.04)',
              color: statusFilter === 'in_progress' ? '#38bdf8' : 'var(--text-muted)'
            }}
          >
            In Progress
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('completed')}
            className="badge"
            style={{
              cursor: 'pointer',
              border: statusFilter === 'completed' ? '1px solid #10b981' : '1px solid var(--border-subtle)',
              backgroundColor: statusFilter === 'completed' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
              color: statusFilter === 'completed' ? '#34d399' : 'var(--text-muted)'
            }}
          >
            Completed
          </button>
        </div>

        {/* Priority & Reset Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)' }}>
              PRIORITY:
            </span>
            <select
              className="form-select"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              style={{ width: 'auto', padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
            >
              <option value="all" style={{ background: '#0f172a' }}>All Priorities</option>
              {Object.keys(PRIORITIES).map((p) => (
                <option key={p} value={p} style={{ background: '#0f172a' }}>
                  {PRIORITIES[p].label}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={onReset}
              style={{ fontSize: '0.75rem', padding: '0.3rem 0.5rem' }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
