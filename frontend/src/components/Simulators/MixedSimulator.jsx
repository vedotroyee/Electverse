import React, { useState } from 'react';

export default function MixedSimulator() {
  const [localVote, setLocalVote] = useState('Party A');
  const [partyVote, setPartyVote] = useState('Party B');
  
  const parties = ['Party A', 'Party B', 'Party C', 'Party D'];
  const colors = ['#2A9D8F', '#E9C46A', '#F4A261', '#E76F51'];

  // Base simulation data
  const constituencySeats = { 'Party A': 30, 'Party B': 15, 'Party C': 5, 'Party D': 0 };
  const partyPercentages = { 'Party A': 35, 'Party B': 40, 'Party C': 15, 'Party D': 10 };
  const totalSeats = 100;

  const getResults = () => {
    // 1. Calculate how many seats each party SHOULD have based on party vote
    const targets = parties.reduce((acc, p) => ({
      ...acc,
      [p]: Math.round((partyPercentages[p] / 100) * totalSeats)
    }), {});

    // 2. See how many "Top-up" seats are needed to reach targets
    const listSeats = parties.reduce((acc, p) => {
      const needed = Math.max(0, targets[p] - constituencySeats[p]);
      return { ...acc, [p]: needed };
    }, {});

    return { targets, listSeats };
  };

  const { targets, listSeats } = getResults();

  return (
    <div className="simulator-container anim-fadeUp">
      <h3 style={{ marginBottom: '2rem', textAlign: 'center' }}>Mixed Member Proportional (MMP) Simulator</h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="glass-card">
          <h4 style={{ marginBottom: '1.5rem', color: 'var(--gold)' }}>Your Ballot</h4>
          
          <div style={{ marginBottom: '2rem' }}>
            <p style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>Vote 1: Local Candidate (FPTP)</p>
            <select className="login-input" value={localVote} onChange={(e) => setLocalVote(e.target.value)}>
               {parties.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>This vote goes directly to a person in your area.</p>
          </div>

          <div>
            <p style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>Vote 2: Party List (PR)</p>
            <select className="login-input" value={partyVote} onChange={(e) => setPartyVote(e.target.value)}>
               {parties.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>This vote determines the overall fairness of parliament.</p>
          </div>
        </div>

        <div className="glass-card">
          <h4 style={{ marginBottom: '1.5rem', color: 'var(--gold)' }}>Final Parliament Composition</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {parties.map((p, i) => {
              const cS = constituencySeats[p];
              const lS = listSeats[p];
              const total = cS + lS;
              return (
                <div key={p} style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                    <span>{p}</span>
                    <span>{total} seats</span>
                  </div>
                  <div style={{ display: 'flex', height: '12px', borderRadius: '6px', overflow: 'hidden', background: '#333' }}>
                    <div style={{ width: `${cS}%`, background: colors[i] }}></div>
                    <div style={{ width: `${lS}%`, background: colors[i], opacity: 0.5 }}></div>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', gap: '10px', marginTop: '4px' }}>
                    <span>Solid: Constituency ({cS})</span>
                    <span>Translucent: List Top-up ({lS})</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ marginTop: '2rem', textAlign: 'center' }}>
        <strong>Party B</strong> got 40% of the party vote, so they ended up with 40 seats total, even though they only won 15 local races.
        <br/>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>The list seats "top up" the party so their representation matches their popularity.</span>
      </div>
    </div>
  );
}
