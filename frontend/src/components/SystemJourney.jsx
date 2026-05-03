import React from 'react';
import { useNavigate } from 'react-router-dom';
import Chapter from './Chapter';
import { useTranslation } from 'react-i18next';

// Import Simulators
import FPTPSimulator from './Simulators/FPTPSimulator';
import PRSimulator from './Simulators/PRSimulator';
import TwoRoundSimulator from './Simulators/TwoRoundSimulator';
import RCVSimulator from './Simulators/RCVSimulator';
import MixedSimulator from './Simulators/MixedSimulator';
import CollegeSimulator from './Simulators/CollegeSimulator';
import DirectSimulator from './Simulators/DirectSimulator';
import AppointedSimulator from './Simulators/AppointedSimulator';

const simulatorMap = {
  fptp: <FPTPSimulator />,
  pr: <PRSimulator />,
  two: <TwoRoundSimulator />,
  rcv: <RCVSimulator />,
  mixed: <MixedSimulator />,
  college: <CollegeSimulator />,
  direct: <DirectSimulator />,
  appointed: <AppointedSimulator />
};

export default function SystemJourney({ system, onEnter }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (!system) return null;

  return (
    <>
      {/* Hero Section */}
      <Chapter 
        id={`sys-${system.id}-hero`} 
        bgPrompt={system.bgPrompt}
        onEnter={() => onEnter(system.id)}
      >
        <h1 className="hero-title anim-fadeUp" style={{ fontSize: '5rem' }}>{t(`systems.${system.id}`, system.title)}</h1>
        <p className="hero-subhead anim-fadeUp delay-100" style={{ fontSize: '1.5rem', opacity: 0.8 }}>{t(`systems.${system.id}_subhead`, system.subhead)}</p>
      </Chapter>

      {/* How It Works Section */}
      <Chapter 
        id={`sys-${system.id}-works`}
        onEnter={() => onEnter(system.id)}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
           <div>
              <h1 className="ch-title anim-slideLeft" style={{ marginBottom: '2rem' }}>{t('system_view.how_it_works', 'How It Works')}</h1>
              <div className="glass-card anim-slideRight delay-100" style={{ fontSize: '1.3rem', lineHeight: '1.8' }}>
                {t(`systems.${system.id}_worksDesc`, system.worksDesc)}
              </div>
           </div>
           
           {/* Interactive Simulator Injection */}
           <div className="anim-scaleIn delay-200">
              {simulatorMap[system.id]}
           </div>
        </div>
      </Chapter>

      {/* World Examples Section */}
      <Chapter 
        id={`sys-${system.id}-examples`}
        onEnter={() => onEnter(system.id)}
      >
        <h1 className="ch-title anim-fadeUp" style={{ textAlign: 'center', marginBottom: '4rem' }}>{t('system_view.world_examples', 'World Examples')}</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
          {(Array.isArray(t(`${system.i18nKey}_examples`, { returnObjects: true })) ? t(`${system.i18nKey}_examples`, { returnObjects: true }) : []).map((ex, i) => (
            <div key={i} className={`glass-card anim-fadeUp delay-${(i+1)*100}`} style={{ borderTop: `4px solid ${system.color}` }}>
              <h3 style={{ marginBottom: '1.5rem', color: 'var(--gold)' }}>{ex.country}</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '1.1rem' }}>{ex.desc}</p>
            </div>
          ))}
        </div>
      </Chapter>

      {/* Pros & Cons Section */}
      <Chapter 
        id={`sys-${system.id}-proscons`}
        onEnter={() => onEnter(system.id)}
      >
        <h1 className="ch-title anim-slideLeft" style={{ textAlign: 'center' }}>{t('system_view.tradeoffs', 'The Trade-offs')}</h1>
        <div className="pros-cons" style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div className="glass-card anim-slideLeft delay-100" style={{ borderLeft: '4px solid #4ADE80' }}>
            <h3 style={{ color: '#4ADE80', marginBottom: '1.5rem' }}>{t('system_view.pros', 'The Arguments For')}</h3>
            <ul style={{ listStyle: 'none' }}>
              {(Array.isArray(t(`${system.i18nKey}_pros`, { returnObjects: true })) ? t(`${system.i18nKey}_pros`, { returnObjects: true }) : []).map((pro, i) => (
                <li key={i} style={{ marginBottom: '1.2rem', display: 'flex', gap: '1rem', fontSize: '1.1rem' }}>
                  <span>✅</span> <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="glass-card anim-slideRight delay-200" style={{ borderLeft: '4px solid #FB7185' }}>
            <h3 style={{ color: '#FB7185', marginBottom: '1.5rem' }}>{t('system_view.cons', 'The Criticisms')}</h3>
            <ul style={{ listStyle: 'none' }}>
              {(Array.isArray(t(`${system.i18nKey}_cons`, { returnObjects: true })) ? t(`${system.i18nKey}_cons`, { returnObjects: true }) : []).map((con, i) => (
                <li key={i} style={{ marginBottom: '1.2rem', display: 'flex', gap: '1rem', fontSize: '1.1rem' }}>
                  <span>❌</span> <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="glass-card anim-scaleIn delay-300" style={{ marginTop: '3rem', borderLeft: `4px solid var(--gold)`, textAlign: 'center' }}>
          <p style={{ fontSize: '1.2rem', fontStyle: 'italic' }}>{t(`${system.i18nKey}_shock`)}</p>
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem' }} className="anim-fadeUp delay-400">
          <button className="btn-back-home" onClick={() => navigate('/hub')}>
            ← {t('common.back_to_hub', 'Back to Hub')}
          </button>
        </div>
      </Chapter>
    </>
  );
}
