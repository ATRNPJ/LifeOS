import React, { useState } from 'react';
import {
  Cpu,
  Sparkles,
  Bot,
  Zap,
  Clock,
  ArrowRight,
  CheckCircle2,
  ListPlus,
  ShieldAlert,
  Sliders,
  Layers
} from 'lucide-react';
import { useLifeOS } from '../context/LifeOSContext';
import { generateStrategyPlan } from '../services/aiStrategistService';
import { CATEGORIES } from '../types/constants';
import Badge from '../components/common/Badge';

export default function AIStrategistPage() {
  const { addQuest, unlockAchievement, setActiveTab, showToast } = useLifeOS();

  const [objective, setObjective] = useState('Design & Implement High-Performance Microservices Architecture');
  const [domain, setDomain] = useState('Career');
  const [timeBudget, setTimeBudget] = useState(12);
  const [cadence, setCadence] = useState('Intensive');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [adopted, setAdopted] = useState(false);

  const presets = [
    { label: '🚀 SaaS MVP Sprint', obj: 'Deploy Full-Stack Production MVP with Automated CI/CD', domain: 'Career', hours: 15 },
    { label: '🏃 Athletic Conditioning', obj: '10km Endurance Run Conditioning & Mobility Protocol', domain: 'Health', hours: 8 },
    { label: '🧠 Data Systems Mastery', obj: 'Master Distributed Consensus & Database Internals', domain: 'Learning', hours: 10 },
    { label: '📈 Wealth Optimization', obj: 'Automate Investment Inflows & Trim Recurring Overhead', domain: 'Finance', hours: 5 }
  ];

  const handleApplyPreset = (p) => {
    setObjective(p.obj);
    setDomain(p.domain);
    setTimeBudget(p.hours);
    setGeneratedPlan(null);
    setAdopted(false);
  };

  const handleSynthesize = async (e) => {
    e.preventDefault();
    if (!objective.trim()) return;

    setIsGenerating(true);
    setAdopted(false);

    try {
      const plan = await generateStrategyPlan({
        goal: objective,
        timeBudget,
        domain,
        cadence
      });
      setGeneratedPlan(plan);
    } catch {
      showToast({
        type: 'info',
        title: 'Strategy Engine Error',
        message: 'Could not generate strategic roadmap.'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAdoptPlan = () => {
    if (!generatedPlan || adopted) return;

    // Add each quest to state
    generatedPlan.recommendedQuests.forEach((q) => {
      addQuest(q);
    });

    // Unlock Neural Architect achievement
    unlockAchievement('ai_architect');

    setAdopted(true);

    showToast({
      type: 'achievement',
      title: 'Plan Integrated into Quest Log!',
      message: `${generatedPlan.recommendedQuests.length} tactical missions appended to your command deck.`
    });
  };

  return (
    <div className="page-container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #a855f7 0%, #38bdf8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 0 15px rgba(168, 85, 247, 0.4)'
            }}
          >
            <Cpu size={20} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Neural Strategist
          </h1>
          <span
            className="badge"
            style={{
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              fontSize: '0.75rem'
            }}
          >
            Demo Engine
          </span>
        </div>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          Deconstruct ambitions into phased execution blueprints and actionable quest bounties.
        </p>
      </div>

      {/* Honest Demo Mode Disclaimer Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'rgba(56, 189, 248, 0.08)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.875rem'
        }}
      >
        <Bot size={20} color="#38bdf8" style={{ flexShrink: 0, marginTop: '0.125rem' }} />
        <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          <strong style={{ color: '#38bdf8' }}>Demo Tactical Engine Active:</strong> This feature utilizes a high-precision deterministic roadmap algorithm directly in your browser without requiring third-party API keys. Generated tactical missions can be adopted straight into your active quest database!
        </div>
      </div>

      {/* Preset Buttons */}
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
          Quick Strategic Presets
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleApplyPreset(p)}
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Planning Configuration Form */}
      <div
        className="glass-panel"
        style={{
          padding: '1.5rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-card)'
        }}
      >
        <form onSubmit={handleSynthesize} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Objective */}
          <div>
            <label htmlFor="ai-objective" className="form-label">
              Primary Objective / Master Goal <span style={{ color: 'var(--accent-rose)' }}>*</span>
            </label>
            <input
              id="ai-objective"
              type="text"
              className="form-input"
              placeholder="e.g. Master React architecture, Train for 10K marathon, Read 10 books..."
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              required
            />
          </div>

          {/* Domain, Time Budget, and Cadence */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem'
            }}
          >
            <div>
              <label htmlFor="ai-domain" className="form-label">Primary Life Domain</label>
              <select
                id="ai-domain"
                className="form-select"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
              >
                {Object.keys(CATEGORIES).map((key) => (
                  <option key={key} value={key} style={{ background: '#0f172a' }}>
                    {CATEGORIES[key].name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="ai-budget" className="form-label">
                Weekly Time Budget: <span className="font-mono" style={{ color: 'var(--accent-cyan)' }}>{timeBudget} Hours</span>
              </label>
              <input
                id="ai-budget"
                type="range"
                min="2"
                max="40"
                step="1"
                value={timeBudget}
                onChange={(e) => setTimeBudget(Number(e.target.value))}
                style={{ width: '100%', marginTop: '0.5rem', accentColor: 'var(--accent-cyan)' }}
              />
            </div>

            <div>
              <label htmlFor="ai-cadence" className="form-label">Execution Intensity</label>
              <select
                id="ai-cadence"
                className="form-select"
                value={cadence}
                onChange={(e) => setCadence(e.target.value)}
              >
                <option value="Standard" style={{ background: '#0f172a' }}>Standard (Sustainable)</option>
                <option value="Intensive" style={{ background: '#0f172a' }}>Intensive (High Output)</option>
                <option value="Sprint" style={{ background: '#0f172a' }}>Sprint Mode (Maximum Focus)</option>
              </select>
            </div>
          </div>

          {/* Action button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isGenerating || !objective.trim()}
              style={{ padding: '0.625rem 1.5rem', gap: '0.5rem' }}
            >
              {isGenerating ? (
                <>
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: '#fff',
                      borderRadius: '50%',
                      animation: 'spin 0.6s linear infinite'
                    }}
                  />
                  <span>Decomposing Strategy...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Synthesize Tactical Roadmap</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Generated Plan Section */}
      {generatedPlan && (
        <div
          className="animate-fade-in"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}
        >
          {/* Plan Header Card */}
          <div
            className="glass-panel"
            style={{
              padding: '1.5rem',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-card-hover)',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(6, 182, 212, 0.08) 100%)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--accent-cyan)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  SYNTHESIZED STRATEGY BLUEPRINT
                </span>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.25rem' }}>
                  {generatedPlan.objective}
                </h2>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  {generatedPlan.summary}
                </p>
              </div>

              <button
                type="button"
                className={`btn ${adopted ? 'btn-secondary' : 'btn-primary'}`}
                onClick={handleAdoptPlan}
                disabled={adopted}
                style={{ gap: '0.5rem', whiteSpace: 'nowrap' }}
              >
                {adopted ? (
                  <>
                    <CheckCircle2 size={16} color="#10b981" />
                    <span>Plan Integrated into Deck</span>
                  </>
                ) : (
                  <>
                    <ListPlus size={16} />
                    <span>Adopt All Quests into Log</span>
                  </>
                )}
              </button>
            </div>

            {/* Phased Milestones */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1rem',
                marginTop: '0.5rem'
              }}
            >
              {generatedPlan.phases.map((phase, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--accent-violet)', textTransform: 'uppercase' }}>
                      {phase.duration}
                    </span>
                    <span className="font-mono" style={{ fontSize: '0.6875rem', color: 'var(--text-dim)' }}>
                      PHASE 0{idx + 1}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {phase.name}
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    {phase.focus}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Quests Deck */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={17} color="var(--accent-blue)" />
                <span>Recommended Operational Missions</span>
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                {generatedPlan.recommendedQuests.length} Quests Prepared
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {generatedPlan.recommendedQuests.map((q, idx) => (
                <div
                  key={idx}
                  className="glass-panel"
                  style={{
                    padding: '1rem 1.25rem',
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.625rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                    <div>
                      <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {q.title}
                      </h4>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        {q.description}
                      </p>
                    </div>

                    <span
                      className="badge badge-xp"
                      style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', flexShrink: 0 }}
                    >
                      +{q.xpReward} XP
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '0.5rem',
                      borderTop: '1px solid var(--border-subtle)',
                      fontSize: '0.75rem'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '0.375rem' }}>
                      <Badge type="category" value={q.category} size="sm" />
                      <Badge type="priority" value={q.priority} size="sm" />
                      <Badge type="difficulty" value={q.difficulty} size="sm" />
                    </div>

                    <span style={{ color: 'var(--text-dim)' }}>
                      Target: {q.dueDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
