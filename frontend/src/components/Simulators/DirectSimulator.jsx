import React, { useState } from 'react';

export default function DirectSimulator() {
  const [question, setQuestion] = useState("Should the city build a new park?");
  const [yesPercent, setYesPercent] = useState(52);
  const [turnout, setTurnout] = useState(48);

  const isPassed = yesPercent > 50 && turnout > 40; // Simplified Swiss rules

  return (
    <div className="simulator-container anim-fadeUp">
      <h3 style={{ marginBottom: '2rem', textAlign: 'center' }}>Direct Democracy Simulator</h3>

      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <div className="glass-card" style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '1rem', color: 'var(--gold)' }}>Type a Referendum Question:</label>
          <input 
            type="text" 
            className="login-input" 
            value={question} 
            onChange={(e) => setQuestion(e.target.value)} 
            style={{ width: '100%', fontSize: '1.2rem' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          <div className="glass-card">
            <label>Yes Vote: {yesPercent}%</label>
            <input type="range" min="0" max="100" value={yesPercent} onChange={(e) => setYesPercent(parseInt(e.target.value))} />
            <div style={{ display: 'flex', height: '10px', background: '#333', borderRadius: '5px', marginTop: '1rem', overflow: 'hidden' }}>
              <div style={{ width: `${yesPercent}%`, background: 'var(--direct)' }}></div>
              <div style={{ width: `${100 - yesPercent}%`, background: '#E63946' }}></div>
            </div>
          </div>

          <div className="glass-card">
            <label>Voter Turnout: {turnout}%</label>
            <input type="range" min="0" max="100" value={turnout} onChange={(e) => setTurnout(parseInt(e.target.value))} />
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Swiss rule: Most initiatives require {'>'}40% turnout to be valid.</p>
          </div>
        </div>

        <div className={`glass-card ${isPassed ? 'passed' : 'failed'}`} style={{ textAlign: 'center', border: `2px solid ${isPassed ? 'var(--direct)' : '#E63946'}`, background: isPassed ? 'rgba(45,106,79,0.1)' : 'rgba(230,57,70,0.1)' }}>
          <div style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>RESULT FOR:</div>
          <h2 style={{ marginBottom: '1.5rem' }}>"{question}"</h2>
          
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: isPassed ? 'var(--direct)' : '#E63946' }}>
             {isPassed ? 'APPROVED' : 'REJECTED'}
          </div>
          
          <div style={{ marginTop: '2rem', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
             <div>
                <strong>Status:</strong> {isPassed ? 'Binding Law' : 'No Change'}
             </div>
             <div>
                <strong>Rule:</strong> Double Majority (Canton + Population)
             </div>
             <div>
                <strong>Context:</strong> Swiss Federal Initiative
             </div>
             <div>
                <strong>Trigger:</strong> Constitutional Amendment
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
