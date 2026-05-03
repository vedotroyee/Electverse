import React, { useState } from 'react';

const states = [
  { id: 'CA', name: 'California', ev: 54, pop: 39000000 },
  { id: 'TX', name: 'Texas', ev: 40, pop: 30000000 },
  { id: 'FL', name: 'Florida', ev: 30, pop: 22000000 },
  { id: 'NY', name: 'New York', ev: 28, pop: 20000000 },
  { id: 'IL', name: 'Illinois', ev: 19, pop: 12000000 },
  { id: 'PA', name: 'Pennsylvania', ev: 19, pop: 13000000 },
  { id: 'OH', name: 'Ohio', ev: 17, pop: 11000000 },
  { id: 'GA', name: 'Georgia', ev: 16, pop: 10000000 },
  { id: 'NC', name: 'N. Carolina', ev: 16, pop: 10000000 },
  { id: 'MI', name: 'Michigan', ev: 15, pop: 10000000 }
];

export default function CollegeSimulator() {
  const [allocation, setAllocation] = useState(states.reduce((acc, s) => ({ ...acc, [s.id]: s.id === 'CA' || s.id === 'NY' ? 'blue' : 'red' }), {}));

  const toggleState = (id) => {
    setAllocation(prev => ({
      ...prev,
      [id]: prev[id] === 'red' ? 'blue' : 'red'
    }));
  };

  const blueEV = states.reduce((sum, s) => sum + (allocation[s.id] === 'blue' ? s.ev : 0), 0);
  const redEV = states.reduce((sum, s) => sum + (allocation[s.id] === 'red' ? s.ev : 0), 0);
  
  const bluePop = states.reduce((sum, s) => sum + (allocation[s.id] === 'blue' ? s.pop : 0), 0);
  const redPop = states.reduce((sum, s) => sum + (allocation[s.id] === 'red' ? s.pop : 0), 0);

  return (
    <div className="simulator-container anim-fadeUp">
      <h3 style={{ marginBottom: '2rem', textAlign: 'center' }}>Electoral College Simulator</h3>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div className="glass-card">
          <h4 style={{ marginBottom: '1.5rem' }}>Simplified US Map (Top 10 States)</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px' }}>
             {states.map(s => (
               <div 
                 key={s.id} 
                 onClick={() => toggleState(s.id)}
                 style={{ 
                   padding: '1rem', 
                   background: allocation[s.id] === 'blue' ? '#2B7FE8' : '#E63946',
                   borderRadius: '8px',
                   cursor: 'pointer',
                   textAlign: 'center',
                   transition: 'transform 0.2s',
                   border: '2px solid rgba(255,255,255,0.2)'
                 }}
                 onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                 onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
               >
                 <div style={{ fontWeight: 'bold' }}>{s.id}</div>
                 <div style={{ fontSize: '0.7rem' }}>{s.ev} EV</div>
               </div>
             ))}
          </div>
          <p style={{ marginTop: '2rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Click a state to flip it. Real election has 50 states + DC.</p>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
          <h4 style={{ marginBottom: '2rem' }}>Electoral Score</h4>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
             <div style={{ color: '#2B7FE8', fontWeight: 'bold' }}>BLUE: {blueEV}</div>
             <div style={{ color: '#E63946', fontWeight: 'bold' }}>RED: {redEV}</div>
          </div>

          <div style={{ height: '20px', background: '#333', borderRadius: '10px', overflow: 'hidden', display: 'flex', marginBottom: '2rem' }}>
             <div style={{ width: `${(blueEV / 270) * 50}%`, background: '#2B7FE8', transition: 'width 0.3s' }}></div>
             <div style={{ width: `${(redEV / 270) * 50}%`, background: '#E63946', transition: 'width 0.3s' }}></div>
          </div>

          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
             Threshold to win: <strong>270</strong>
          </div>

          <div style={{ marginTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
             <h4 style={{ marginBottom: '1rem' }}>Popular Vote Paradox</h4>
             <div style={{ fontSize: '0.8rem', textAlign: 'left' }}>
                <div style={{ marginBottom: '0.5rem' }}>Blue Pop: {bluePop.toLocaleString()}</div>
                <div>Red Pop: {redPop.toLocaleString()}</div>
             </div>
             {((bluePop > redPop && blueEV < redEV) || (redPop > bluePop && redEV < blueEV)) && (
               <div style={{ marginTop: '1rem', color: 'var(--gold)', fontWeight: 'bold', fontSize: '0.8rem' }}>
                  ⚠️ PARADOX: Popular vote winner would LOSE the election!
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
