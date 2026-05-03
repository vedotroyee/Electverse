import React from 'react';
import { useNavigate } from 'react-router-dom';
import Chapter from './Chapter';
import { useTranslation } from 'react-i18next';

const systems = [
  { id: 'fptp', icon: '🎯', name: 'First Past the Post', desc: 'The simplest rule: most votes wins.', flags: '🇬🇧 🇮🇳 🇺🇸', color: 'var(--fptp)' },
  { id: 'pr', icon: '📊', name: 'Proportional Representation', desc: 'Seats match the national vote share.', flags: '🇳🇱 🇸🇪 🇿🇦', color: 'var(--pr)' },
  { id: 'two', icon: '🔄', name: 'Two-Round / Runoff', desc: 'Round 1 to narrow, Round 2 for majority.', flags: '🇫🇷 🇧🇷 🇷🇺', color: 'var(--two-round)' },
  { id: 'rcv', icon: '🔢', name: 'Ranked Choice Voting', desc: 'Rank candidates 1, 2, 3...', flags: '🇦🇺 🇮🇪 🇳🇿', color: 'var(--rcv)' },
  { id: 'mixed', icon: '⚖️', name: 'Mixed Member / Hybrid', desc: 'Local reps + proportional fairness.', flags: '🇩🇪 🇯🇵 🇳🇿', color: 'var(--mixed)' },
  { id: 'college', icon: '🗳️', name: 'Electoral College', desc: 'Indirect voting via state electors.', flags: '🇺🇸 🇩🇪 🇮🇳', color: 'var(--college)' },
  { id: 'direct', icon: '🙋', name: 'Direct Democracy', desc: 'Citizens vote on the laws themselves.', flags: '🇨🇭 🇮🇸 🇺🇾', color: 'var(--direct)' },
  { id: 'appointed', icon: '👑', name: 'Appointed / Monarchy', desc: 'No elections. Power is inherited or seized.', flags: '🇸🇦 🇨🇳 🇻🇦', color: 'var(--appointed)' }
];

export default function Hub({ onSelectSystem }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Chapter id="screen-hub" bgPrompt="global election collage ballot boxes flags voting booths warm light photorealistic" noSnap inView>
      <div className="content">
        <h1 className="hero-title anim-fadeUp" style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '3.5rem' }}>
          {t('hub.title')}
        </h1>
        <p className="anim-fadeUp delay-100" style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '3rem' }}>
          {t('hub.subtitle')}
        </p>

        <div className="hub-grid">
          {systems.map((sys, i) => (
            <div 
              key={sys.id} 
              className={`system-card anim-scaleIn delay-${(i % 4) * 100}`} 
              style={{ borderLeftColor: sys.color }}
              onClick={() => onSelectSystem(sys.id)}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{sys.icon}</div>
              <h3 style={{ marginBottom: '0.5rem', fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}>{t(`systems.${sys.id}`, sys.name)}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: '1.5' }}>
                {t(`systems.${sys.id}_subhead`, sys.desc)}
              </p>
              <div style={{ letterSpacing: '4px' }}>{sys.flags}</div>
            </div>
          ))}

          {/* New Integration Cards */}
          <div 
            className="system-card anim-scaleIn delay-300" 
            style={{ borderLeftColor: 'var(--gold)', background: 'rgba(245, 166, 35, 0.1)' }}
            onClick={() => navigate('/quiz')}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🧠</div>
            <h3 style={{ marginBottom: '0.5rem', fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}>{t('quiz.hero_title', 'Values Quiz')}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: '1.5' }}>
              {t('quiz.hub_desc', 'Discover which election system truly aligns with your political values.')}
            </p>
            <div style={{ color: 'var(--gold)', fontWeight: 'bold' }}>{t('common.take_quiz')} →</div>
          </div>

          <div 
            className="system-card anim-scaleIn delay-400" 
            style={{ borderLeftColor: 'var(--text-light)', background: 'rgba(255, 255, 255, 0.05)' }}
            onClick={() => navigate('/comparison')}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚖️</div>
            <h3 style={{ marginBottom: '0.5rem', fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}>{t('comparison.title', 'Comparison')}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: '1.5' }}>
              {t('comparison.subtitle', 'Side-by-side analysis of fairness, stability, and simplicity.')}
            </p>
            <div style={{ color: 'var(--text-light)', fontWeight: 'bold' }}>{t('common.compare')} →</div>
          </div>
        </div>
      </div>
    </Chapter>
  );
}
