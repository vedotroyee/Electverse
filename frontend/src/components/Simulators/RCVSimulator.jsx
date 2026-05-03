import React, { useState } from 'react';

export default function RCVSimulator() {
  const [ranking, setRanking] = useState(['Blue', 'Green', 'Red', 'Yellow']);
  const [round, setRound] = useState(1);
  
  // Dummy vote data for the simulation
  const rawVotes = [
    { p: ['Blue', 'Red', 'Green', 'Yellow'], count: 35 },
    { p: ['Red', 'Blue', 'Green', 'Yellow'], count: 25 },
    { p: ['Green', 'Red', 'Blue', 'Yellow'], count: 20 },
    { p: ['Yellow', 'Green', 'Red', 'Blue'], count: 20 },
  ];

  const colors = {
    Blue: '#2B7FE8',
    Red: '#E63946',
    Green: '#2A9D8F',
    Yellow: '#E9C46A'
  };

  const getResults = (currentRound) => {
    let results = { Blue: 0, Red: 0, Green: 0, Yellow: 0 };
    let eliminated = [];
    
    for (let r = 1; r <= currentRound; r++) {
      results = { Blue: 0, Red: 0, Green: 0, Yellow: 0 };
      rawVotes.forEach(v => {
        const topChoice = v.p.find(p => !eliminated.includes(p));
        if (topChoice) results[topChoice] += v.count;
      });
      
      if (r < currentRound) {
        const activeParties = Object.keys(results).filter(p => !eliminated.includes(p));
        const lowest = activeParties.reduce((a, b) => results[a] < results[b] ? a : b);
        eliminated.push(lowest);
      }
    }
    return { results, eliminated };
  };

  const { results, eliminated } = getResults(round);
  const winner = Object.keys(results).find(p => results[p] > 50);

  return (
    <div className="simulator-container anim-fadeUp">
      <h3 style={{ marginBottom: '2rem', textAlign: 'center' }}>Ranked Choice Simulator</h3>

      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <h4 style={{ marginBottom: '1rem' }}>Step 1: Your Personal Ballot</h4>
        <div style={{ display: 'flex', gap: '10px' }}>
          {ranking.map((name, i) => (
            <div key={name} style={{ flex: 1, padding: '10px', background: colors[name], borderRadius: '8px', textAlign: 'center', cursor: 'grab' }}>
               <div style={{ fontSize: '0.8rem' }}>Choice {i + 1}</div>
               <div style={{ fontWeight: 'bold' }}>{name}</div>
            </div>
          ))}
        </div>
        <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Imagine thousands of voters doing the same. Let's count them...</p>
      </div>

      <div className="glass-card" style={{ borderLeft: '4px solid var(--gold)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h4>Round {round}</h4>
          <div style={{ display: 'flex', gap: '10px' }}>
             <button className="btn-primary" style={{ padding: '0.5rem 1rem' }} onClick={() => setRound(Math.max(1, round - 1))}>Previous</button>
             <button className="btn-primary" style={{ padding: '0.5rem 1rem' }} onClick={() => setRound(Math.min(3, round + 1))} disabled={!!winner}>Next Round</button>
             <button className="btn-primary" style={{ padding: '0.5rem 1rem' }} onClick={() => setRound(1)}>Reset</button>
          </div>
        </div>

        <div className="sim-bar-container" style={{ height: '200px' }}>
          {Object.keys(results).map(name => (
            <div 
              key={name}
              className={`sim-bar ${results[name] > 50 ? 'winner' : ''}`}
              style={{ 
                height: `${results[name] * 2}px`, 
                backgroundColor: eliminated.includes(name) ? '#333' : colors[name],
                opacity: eliminated.includes(name) ? 0.3 : 1
              }}
            >
              <div style={{ position: 'absolute', bottom: '-25px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.8rem' }}>
                {name} {results[name]}%
              </div>
              {results[name] > 50 && <div className="sim-crown">🏆</div>}
            </div>
          ))}
        </div>

        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          {winner ? (
            <div style={{ color: colors[winner], fontSize: '1.5rem', fontWeight: 'bold' }}>
               Final Winner: {winner} Party!
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)' }}>
               {round < 3 ? `Eliminating ${eliminated[eliminated.length - 1] || 'lowest candidate'} and redistributing...` : 'Calculating...'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
