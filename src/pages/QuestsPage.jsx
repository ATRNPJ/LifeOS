import React, { useState, useMemo } from 'react';
import { Swords, Plus, Sparkles, Filter, CheckCircle2, ListFilter, AlertCircle } from 'lucide-react';
import { useLifeOS } from '../context/LifeOSContext';
import QuestCard from '../components/quests/QuestCard';
import QuestFilters from '../components/quests/QuestFilters';
import Modal from '../components/common/Modal';

export default function QuestsPage() {
  const {
    quests,
    setQuickAddOpen,
    editingQuest,
    setEditingQuest,
    deleteQuest
  } = useLifeOS();

  // Filters & Sorting state
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate_asc');

  // Deletion modal state
  const [questToDelete, setQuestToDelete] = useState(null);

  const resetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setStatusFilter('all');
    setPriorityFilter('all');
    setSortBy('dueDate_asc');
  };

  // Filtered and sorted quests
  const filteredQuests = useMemo(() => {
    return quests
      .filter((q) => {
        // Search filter
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          const matchTitle = q.title?.toLowerCase().includes(term);
          const matchDesc = q.description?.toLowerCase().includes(term);
          if (!matchTitle && !matchDesc) return false;
        }

        // Category filter
        if (categoryFilter !== 'all' && q.category !== categoryFilter) {
          return false;
        }

        // Status filter
        if (statusFilter !== 'all' && q.status !== statusFilter) {
          return false;
        }

        // Priority filter
        if (priorityFilter !== 'all' && q.priority !== priorityFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'dueDate_asc') {
          return (a.dueDate || '9999').localeCompare(b.dueDate || '9999');
        }
        if (sortBy === 'dueDate_desc') {
          return (b.dueDate || '0000').localeCompare(a.dueDate || '0000');
        }
        if (sortBy === 'xp_desc') {
          return (b.xpReward || 0) - (a.xpReward || 0);
        }
        if (sortBy === 'priority_desc') {
          const pOrder = { Epic: 4, High: 3, Medium: 2, Low: 1 };
          return (pOrder[b.priority] || 0) - (pOrder[a.priority] || 0);
        }
        if (sortBy === 'title_asc') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [quests, searchTerm, categoryFilter, statusFilter, priorityFilter, sortBy]);

  // Quick stats
  const totalQuests = quests.length;
  const completedCount = quests.filter((q) => q.status === 'completed').length;
  const pendingCount = totalQuests - completedCount;
  const totalXPAvailable = quests.reduce((acc, q) => acc + (q.xpReward || 0), 0);

  const handleConfirmDelete = () => {
    if (questToDelete) {
      deleteQuest(questToDelete.id);
      setQuestToDelete(null);
    }
  };

  return (
    <div className="page-container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
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
                color: '#a855f7'
              }}
            >
              <Swords size={20} />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Quest Command Log
            </h1>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Browse, filter, and execute your tactical operations to gain XP.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setQuickAddOpen(true)}
          style={{ gap: '0.5rem' }}
        >
          <Plus size={18} />
          <span>Forge New Quest</span>
        </button>
      </div>

      {/* Stats Summary Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem'
        }}
      >
        <div className="glass-panel" style={{ padding: '0.875rem 1.125rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>
            Total Quests
          </div>
          <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.25rem' }}>
            {totalQuests}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '0.875rem 1.125rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>
            In Progress
          </div>
          <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#38bdf8', marginTop: '0.25rem' }}>
            {pendingCount}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '0.875rem 1.125rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>
            Completed
          </div>
          <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#34d399', marginTop: '0.25rem' }}>
            {completedCount}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '0.875rem 1.125rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>
            XP Reserve
          </div>
          <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#c084fc', marginTop: '0.25rem' }}>
            {totalXPAvailable} XP
          </div>
        </div>
      </div>

      {/* Filter Component */}
      <QuestFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onReset={resetFilters}
      />

      {/* Quests Result List */}
      {filteredQuests.length === 0 ? (
        <div
          className="glass-panel"
          style={{
            padding: '3rem 1.5rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem',
            borderRadius: 'var(--radius-lg)'
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)'
            }}
          >
            <ListFilter size={24} />
          </div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
            No Quests Match Your Filters
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-dim)', maxWidth: '380px' }}>
            Adjust your search terms, clear active domain filters, or create a new quest.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={resetFilters}
            >
              Clear All Filters
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setQuickAddOpen(true)}
            >
              <Plus size={15} />
              <span>New Quest</span>
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {filteredQuests.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              onEdit={(q) => setEditingQuest(q)}
              onDelete={(q) => setQuestToDelete(q)}
            />
          ))}
        </div>
      )}

      {/* Confirmation Modal for Delete */}
      <Modal
        isOpen={Boolean(questToDelete)}
        onClose={() => setQuestToDelete(null)}
        title="Confirm Quest Elimination"
        subtitle="Permanent removal from quest database"
        maxWidth="460px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              backgroundColor: 'rgba(244, 63, 94, 0.1)',
              padding: '0.875rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(244, 63, 94, 0.3)'
            }}
          >
            <AlertCircle size={20} color="#f43f5e" style={{ flexShrink: 0, marginTop: '0.125rem' }} />
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#fda4af' }}>
                Delete "{questToDelete?.title}"?
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                This will delete the quest record. Are you sure you want to proceed?
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setQuestToDelete(null)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleConfirmDelete}
            >
              Confirm Deletion
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
