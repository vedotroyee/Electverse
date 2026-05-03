import React, { useState } from 'react';

export default function TwoRoundSimulator() {
  const [votesR1, setVotesR1] = useState([30, 28, 20, 15, 7]);
  const [redist, setRedist] = useState([50, 50, 50]); // % of eliminated candidates' votes going to R2 Candidate 1
  
  const parties = ['Candidate A', 'Candidate B', 'Candidate C', 'Candidate D', 'Candidate E'];
  const colors = ['#F4A261', '#E76F51', '#264653', '#2A9D8F', '#E9C46A'];

  const handleSliderR1 = (idx, val) => {
    const newVotes = [...votesR1];
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
    setVotesR1(newVotes.map(v => Math.round(v * 10) / 10));
  };

  // Find top 2
  const sortedIdxs = [0, 1, 2, 3, 4].sort((a, b) => votesR1[b] - votesR1[a]);
  const finalists = [sortedIdxs[0], sortedIdxs[1]];
  const eliminated = [sortedIdxs[2], sortedIdxs[3], sortedIdxs[4]];

  const r2Base1 = votesR1[finalists[0]];
  const r2Base2 = votesR1[finalists[1]];
  
  let r2Total1 = r2Base1;
  let r2Total2 = r2Base2;
  
  eliminated.forEach((idx, i) => {
    const eliminatedVotes = votesR1[idx];
    const to1 = eliminatedVotes * (redist[i] / 100);
    const to2 = eliminatedVotes * ((100 - redist[i]) / 100);
    r2Total1 += to1;
    r2Total2 += to2;
  });

  const winIdx = r2Total1 > r2Total2 ? finalists[0] : finalists[1];

  return (
    <div className="simulator-container anim-fadeUp">
      <h3 style={{ marginBottom: '2rem', textAlign: 'center' }}>Two-Round Runoff Simulator</h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
        <div>
          <h4 style={{ marginBottom: '1.5rem', color: 'var(--gold)' }}>Round 1 Results</h4>
          {votesR1.map((v, i) => (
            <div key={i} style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                <span>{parties[i]} {finalists.includes(i) ? '✅' : '❌'}</span>
                <span>{v}%</span>
              </div>
              <input type="range" min="0" max="100" step="0.1" value={v} onChange={(e) => handleSliderR1(i, parseFloat(e.target.value))} />
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: finalists.includes(i) ? colors[i] : '#444', width: `${v}%`, transition: 'width 0.3s' }}></div>
              </div>
            </div>
          ))}
        </div>

        <div className="glass-card">
          <h4 style={{ marginBottom: '1.5rem', color: 'var(--gold)' }}>Round 2 Matchup</h4>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
               <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{parties[finalists[0]]}</div>
                  <div style={{ fontSize: '2rem', color: colors[finalists[0]] }}>{r2Total1.toFixed(1)}%</div>
               </div>
               <div style={{ alignSelf: 'center', fontSize: '1.5rem' }}>VS</div>
               <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{parties[finalists[1]]}</div>
                  <div style={{ fontSize: '2rem', color: colors[finalists[1]] }}>{r2Total2.toFixed(1)}%</div>
               </div>
            </div>
            
            <div style={{ height: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden', display: 'flex' }}>
               <div style={{ width: `${r2Total1}%`, background: colors[finalists[0]], transition: 'width 0.3s' }}></div>
               <div style={{ width: `${r2Total2}%`, background: colors[finalists[1]], transition: 'width 0.3s' }}></div>
            </div>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Adjust where eliminated candidates' votes go:</p>
          {eliminated.map((idx, i) => (
            <div key={idx} style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
                <span>{parties[idx]}'s voters to A</span>
                <span>{redist[i]}%</span>
              </div>
              <input type="range" min="0" max="100" value={redist[i]} onChange={(e) => {
                const nr = [...redist];
                nr[i] = parseInt(e.target.value);
                setRedist(nr);
              }} />
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '1.5rem', fontWeight: 'bold', color: colors[winIdx] }}>
        🏆 Final Winner: {parties[winIdx]}
      </div>
    </div>
  );
}
