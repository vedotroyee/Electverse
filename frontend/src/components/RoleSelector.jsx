import React, { useState } from 'react';
import axios from 'axios';

export default function RoleSelector({ user, onRoleSelect }) {
  const [selectedRole, setSelectedRole] = useState(null);

  const roles = [
    { id: 'voter', icon: '🗳️', title: 'Voter', desc: 'Know your rights & process' },
    { id: 'candidate', icon: '🏅', title: 'Candidate', desc: 'Contest, campaign & win' },
    { id: 'observer', icon: '👁️', title: 'Observer', desc: 'Monitor & report' },
    { id: 'student', icon: '📚', title: 'Student / Curious', desc: 'Learn & ace your exams' }
  ];

  const handleSelect = async (roleId) => {
    setSelectedRole(roleId);
    
    // Save role to DB
    if (user && user._id) {
      try {
        await axios.put(`http://localhost:5000/api/users/${user._id}/role`, { role: roleId });
      } catch (err) {
        console.error("Failed to save role", err);
      }
    }

    const roleData = {
      voter: "<h3>Voter Path</h3><p>Ensure you check electoralsearch.eci.gov.in regularly. If you shift residence, use Form 8.</p>",
      candidate: "<h3>Candidate Path</h3><p>Remember, filing a false affidavit is grounds for immediate disqualification. Track every rupee spent.</p>",
      observer: "<h3>Observer Path</h3><p>Download the cVIGIL app to anonymously report Model Code of Conduct violations in real-time.</p>",
      student: "<h3>Student Path</h3><p>Great job making it here! Let's test what you've learned to ace your civics knowledge.</p>"
    };

    onRoleSelect(roleData[roleId]);
    setTimeout(() => {
      document.getElementById('screen-deepdive').scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <section id="screen-roles" className="chapter no-snap">
      <div className="content">
        <h1 className="ch-title" style={{ color: 'var(--navy)', textAlign: 'center' }}>Who are YOU in this election?</h1>
        
        <div className="role-grid">
          {roles.map(r => (
            <div 
              key={r.id}
              className={`role-card ${selectedRole === r.id ? 'selected' : (selectedRole ? 'dimmed' : '')}`}
              onClick={() => handleSelect(r.id)}
            >
              <div className="role-icon">{r.icon}</div>
              <h3>{r.title}</h3>
              <p style={{ color: 'var(--text-muted)' }}>{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
