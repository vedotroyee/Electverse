import React, { useState } from 'react';

export default function AppointedSimulator() {
  const [role, setRole] = useState('King');
  const [showDemocracy, setShowDemocracy] = useState(false);

  const roles = {
    King: { title: 'Absolute Monarch', source: 'Birthright', flow: 'Decree' },
    Leader: { title: 'Party Chairman', source: 'Inner Circle', flow: 'Directive' },
    General: { title: 'Military Junta', source: 'Force', flow: 'Order' },
    Cleric: { title: 'Supreme Leader', source: 'Divine Law', flow: 'Fatwa' }
  };

  return (
    <div className="simulator-container anim-fadeUp">
      <h3 style={{ marginBottom: '2rem', textAlign: 'center' }}>Power Flow Simulator</h3>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
        <button 
          className="btn-primary" 
          onClick={() => setShowDemocracy(!showDemocracy)}
          style={{ background: showDemocracy ? 'var(--gold)' : 'rgba(255,255,255,0.1)', color: showDemocracy ? 'black' : 'white' }}
        >
          {showDemocracy ? 'Switch to Autocracy' : 'Compare with Democracy'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        <div className="glass-card">
          <h4 style={{ marginBottom: '1.5rem' }}>Select Role</h4>
          {Object.keys(roles).map(r => (
            <div 
              key={r} 
              className={`system-card ${role === r ? 'selected' : ''}`}
              onClick={() => setRole(r)}
              style={{ 
                marginBottom: '1rem', 
                padding: '1rem', 
                cursor: 'pointer',
                background: role === r ? 'rgba(255,255,255,0.1)' : 'transparent',
                borderLeft: `4px solid ${role === r ? 'var(--gold)' : '#333'}`
              }}
            >
              <strong>{r}</strong>
            </div>
          ))}
        </div>

        <div className="glass-card" style={{ position: 'relative', overflow: 'hidden', minHeight: '400px' }}>
          <h4 style={{ textAlign: 'center', marginBottom: '2rem' }}>{showDemocracy ? 'Democracy: Upward Accountability' : `${roles[role].title}: Downward Accountability`}</h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px' }}>
             {/* Level 1 */}
             <div className="glass-card" style={{ padding: '1rem 2rem', border: '1px solid var(--gold)' }}>
                {showDemocracy ? 'Citizens / Voters' : roles[role].title}
             </div>

             {/* Arrow 1 */}
             <div style={{ fontSize: '2rem', transform: showDemocracy ? 'rotate(180deg)' : 'none', transition: 'transform 0.5s' }}>⬇️</div>

             {/* Level 2 */}
             <div className="glass-card" style={{ padding: '1rem 2rem' }}>
                {showDemocracy ? 'Representatives' : 'State Bureaucracy'}
             </div>

             {/* Arrow 2 */}
             <div style={{ fontSize: '2rem', transform: showDemocracy ? 'rotate(180deg)' : 'none', transition: 'transform 0.5s' }}>⬇️</div>

             {/* Level 3 */}
             <div className="glass-card" style={{ padding: '1rem 2rem', opacity: 0.7 }}>
                {showDemocracy ? 'Executive / Gov' : 'Citizens / Subjects'}
             </div>
          </div>

          <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
             {showDemocracy 
               ? "In a democracy, power flows from the bottom up. Citizens hold the ultimate authority via the vote." 
               : `In this system, power flows from the ${role} via ${roles[role].flow}. There is zero upward accountability.`}
          </div>
        </div>
      </div>
    </div>
  );
}
