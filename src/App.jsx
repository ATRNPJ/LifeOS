import React, { useState } from 'react';
import { LifeOSProvider, useLifeOS } from './context/LifeOSContext';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import MobileNav from './components/layout/MobileNav';
import ToastContainer from './components/common/Toast';
import QuestModal from './components/quests/QuestModal';

import Dashboard from './pages/Dashboard';
import QuestsPage from './pages/QuestsPage';
import PlannerPage from './pages/PlannerPage';
import AchievementsPage from './pages/AchievementsPage';
import AIStrategistPage from './pages/AIStrategistPage';
import SettingsPage from './pages/SettingsPage';

function LifeOSContent() {
  const {
    activeTab,
    quickAddOpen,
    setQuickAddOpen,
    editingQuest,
    setEditingQuest
  } = useLifeOS();

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'quests':
        return <QuestsPage />;
      case 'planner':
        return <PlannerPage />;
      case 'achievements':
        return <AchievementsPage />;
      case 'strategist':
        return <AIStrategistPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-layout">
      {/* Collapsible Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Viewport */}
      <div className="main-content">
        <Topbar onOpenMobileMenu={() => setMobileDrawerOpen(!mobileDrawerOpen)} />

        <main style={{ flex: 1 }}>
          {renderActivePage()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Audio / XP / Achievement Toasts */}
      <ToastContainer />

      {/* Quick Add Quest Modal */}
      <QuestModal
        isOpen={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
        initialQuest={null}
      />

      {/* Edit Quest Modal */}
      <QuestModal
        isOpen={Boolean(editingQuest)}
        onClose={() => setEditingQuest(null)}
        initialQuest={editingQuest}
      />
    </div>
  );
}

export default function App() {
  return (
    <LifeOSProvider>
      <LifeOSContent />
    </LifeOSProvider>
  );
}
