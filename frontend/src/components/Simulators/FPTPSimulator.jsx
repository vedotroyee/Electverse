import React, { useState, useEffect } from 'react';

export default function FPTPSimulator() {
  const [votes, setVotes] = useState([40, 25, 20, 10, 5]);
  const candidates = ['Party A', 'Party B', 'Party C', 'Party D', 'Party E'];
  const colors = ['#E63946', '#F1FAEE', '#A8DADC', '#457B9D', '#1D3557'];

  const handleSlider = (idx, val) => {
    const newVotes = [...votes];
    const diff = val - newVotes[idx];
    newVotes[idx] = val;
    
    // Distribute diff proportionally to others to keep total 100
    const otherIdxs = [0, 1, 2, 3, 4].filter(i => i !== idx);
    const sumOthers = otherIdxs.reduce((sum, i) => sum + newVotes[i], 0);
    
    if (sumOthers > 0) {
      otherIdxs.forEach(i => {
        const share = newVotes[i] / sumOthers;
        newVotes[i] = Math.max(0, newVotes[i] - (diff * share));
      });
    } else {
      // If all others are 0, just subtract from the first other one
      newVotes[otherIdxs[0]] = Math.max(0, 100 - val);
    }
    
    setVotes(newVotes.map(v => Math.round(v * 10) / 10));
  };

  const winnerIdx = votes.indexOf(Math.max(...votes));
  const totalVotes = votes.reduce((a, b) => a + b, 0);
  const wastedVotes = (totalVotes - votes[winnerIdx]).toFixed(1);

  return (
    <div className="simulator-container anim-fadeUp">
      <h3 style={{ marginBottom: '2rem', textAlign: 'center' }}>First Past the Post Simulator</h3>
      
      <div className="sim-bar-container">
        {votes.map((v, i) => (
          <div 
            key={i} 
            className={`sim-bar ${i === winnerIdx ? 'winner' : ''}`}
            style={{ height: `${v * 2}px`, backgroundColor: colors[i], color: colors[i] }}
          >
            {i === winnerIdx && <div className="sim-crown">👑</div>}
            <div style={{ position: 'absolute', bottom: '-25px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
              {candidates[i]} ({v}%)
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '3rem' }}>
        {votes.map((v, i) => (
          <div key={i} style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>{candidates[i]}: {v}%</label>
            <input 
              type="range" min="0" max="100" step="0.1"
              value={v}
              onChange={(e) => handleSlider(i, parseFloat(e.target.value))}
            />
          </div>
        ))}
      </div>

      <div className="glass-card" style={{ marginTop: '2rem', textAlign: 'center', borderLeft: `4px solid ${colors[winnerIdx]}` }}>
        <strong>{candidates[winnerIdx]}</strong> won with only <strong>{votes[winnerIdx]}%</strong> of the vote. 
        <br/>
        <span style={{ color: 'var(--text-muted)' }}>{wastedVotes}% of votes elected nobody and were "wasted".</span>
      </div>
    </div>
  );
}
