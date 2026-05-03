import React, { useState } from 'react';

export default function PRSimulator() {
  const [seats, setSeats] = useState(150);
  const [votes, setVotes] = useState([35, 25, 20, 15, 5]);
  const [coalition, setCoalition] = useState([]);
  
  const parties = ['Party A', 'Party B', 'Party C', 'Party D', 'Party E'];
  const colors = ['#2B7FE8', '#F1FAEE', '#A8DADC', '#457B9D', '#1D3557'];

  const handleSlider = (idx, val) => {
    const newVotes = [...votes];
    const diff = val - newVotes[idx];
    newVotes[idx] = val;
    const otherIdxs = [0, 1, 2, 3, 4].filter(i => i !== idx);
    const sumOthers = otherIdxs.reduce((sum, i) => sum + newVotes[i], 0);
    if (sumOthers > 0) {
      otherIdxs.forEach(i => {
        const share = newVotes[i] / sumOthers;
        newVotes[i] = Math.max(0, newVotes[i] - (diff * share));
      });
    } else {
      newVotes[otherIdxs[0]] = Math.max(0, 100 - val);
    }
    setVotes(newVotes.map(v => Math.round(v * 10) / 10));
  };

  const calculatedSeats = votes.map(v => Math.round((v / 100) * seats));
  const coalitionSeats = coalition.reduce((sum, idx) => sum + calculatedSeats[idx], 0);
  const threshold = Math.floor(seats / 2) + 1;

  const toggleCoalition = (idx) => {
    if (coalition.includes(idx)) {
      setCoalition(coalition.filter(i => i !== idx));
    } else {
      setCoalition([...coalition, idx]);
    }
  };

  return (
    <div className="simulator-container anim-fadeUp">
      <h3 style={{ marginBottom: '2rem', textAlign: 'center' }}>Proportional Representation Simulator</h3>
      
      <div style={{ marginBottom: '3rem' }}>
        <label>Total Parliament Seats: {seats}</label>
        <input type="range" min="50" max="400" value={seats} onChange={(e) => setSeats(parseInt(e.target.value))} />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        {parties.map((p, i) => (
          <div 
            key={i} 
            className={`glass-card ${coalition.includes(i) ? 'selected' : ''}`}
            onClick={() => toggleCoalition(i)}
            style={{ flex: '1', minWidth: '150px', cursor: 'pointer', borderTop: `4px solid ${colors[i]}`, backgroundColor: coalition.includes(i) ? 'rgba(255,255,255,0.15)' : 'var(--glass)' }}
          >
            <div style={{ fontWeight: 'bold' }}>{p}</div>
            <div style={{ fontSize: '1.5rem', margin: '0.5rem 0' }}>{calculatedSeats[i]} seats</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{votes[i]}% votes</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '2rem' }}>
        {votes.map((v, i) => (
          <div key={i} style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.9rem' }}>{parties[i]} Votes: {v}%</label>
            <input type="range" min="0" max="100" step="0.1" value={v} onChange={(e) => handleSlider(i, parseFloat(e.target.value))} />
          </div>
        ))}
      </div>

      <div className="glass-card" style={{ marginTop: '2rem', textAlign: 'center' }}>
        <h4 style={{ marginBottom: '1rem' }}>Coalition Builder</h4>
        <div style={{ fontSize: '2rem', color: coalitionSeats >= threshold ? 'var(--green)' : 'var(--text-muted)' }}>
          {coalitionSeats} / {seats} seats
        </div>
        <p style={{ color: 'var(--text-muted)' }}>Majority Threshold: {threshold}</p>
        {coalitionSeats >= threshold ? (
          <div style={{ marginTop: '1rem', color: '#4ADE80', fontWeight: 'bold' }}>✅ MAJORITY FORMED!</div>
        ) : (
          <div style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Select parties above to form a coalition</div>
        )}
      </div>
    </div>
  );
}
