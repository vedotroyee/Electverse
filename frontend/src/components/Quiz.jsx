import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Chapter from './Chapter';
import { useTranslation } from 'react-i18next';

const quizQuestions = [
  { id: 'q1', trait: 'PR' },
  { id: 'q2', trait: 'FPTP' },
  { id: 'q3', trait: 'FPTP' },
  { id: 'q4', trait: 'FPTP' },
  { id: 'q5', trait: 'Direct' },
  { id: 'q6', trait: 'PR' },
  { id: 'q7', trait: 'TwoRound' },
  { id: 'q8', trait: 'FPTP' }
];

const initialAnswers = quizQuestions.reduce((acc, q) => ({ ...acc, [q.id]: 50 }), {});

export default function Quiz({ user }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [answers, setAnswers] = useState(initialAnswers);
  const [result, setResult] = useState(null);
  const [resultId, setResultId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSlider = (id, val) => {
    setAnswers(prev => ({ ...prev, [id]: parseInt(val) }));
  };

  const handleRetake = () => {
    setResult(null);
    setResultId(null);
    setAnswers({ ...initialAnswers });
    window.scrollTo(0, 0);
  };

  const calculateResult = async () => {
    setLoading(true);
    let scores = { PR: 0, FPTP: 0, TwoRound: 0, Direct: 0 };
    
    quizQuestions.forEach(q => {
      const val = answers[q.id];
      if (q.trait === 'FPTP') scores.FPTP += val;
      if (q.trait === 'PR') scores.PR += val;
      if (q.trait === 'TwoRound') scores.TwoRound += val;
      if (q.trait === 'Direct') scores.Direct += val;
    });

    const topSystem = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    
    const sysNames = {
      FPTP: "First Past the Post",
      PR: "Proportional Representation",
      TwoRound: "Two-Round Runoff",
      Direct: "Direct Democracy"
    };

    const sysIds = {
      FPTP: "fptp",
      PR: "pr",
      TwoRound: "two",
      Direct: "direct"
    };

    const finalRes = sysNames[topSystem];
    setResult(finalRes);
    setResultId(sysIds[topSystem]);

    if (user && user._id) {
      try {
        await axios.put(`http://localhost:5000/api/users/${user._id}/quiz`, { result: finalRes });
      } catch (err) {
        console.error("Failed to save quiz result", err);
      }
    }
    setLoading(false);
  };

  return (
    <Chapter id="screen-quiz" bgPrompt="single ballot paper wooden desk dramatic warm side light macro" noSnap>
      <div className="content">
        <h1 className="hero-title anim-fadeUp" style={{ textAlign: 'center', marginBottom: '3rem' }}>{t('quiz.hero_title', 'Which System Suits Your Values?')}</h1>
        
        {!result ? (
          <div className="glass-card anim-fadeUp delay-100" style={{ maxWidth: '800px', margin: '0 auto' }}>
            {quizQuestions.map(q => (
              <div key={q.id} style={{ marginBottom: '2rem' }}>
                <p style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>{t(`quiz.questions.${q.id}`)}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('quiz.disagree', 'Disagree')}</span>
                  <input 
                    type="range" min="0" max="100" 
                    value={answers[q.id]} 
                    onChange={(e) => handleSlider(q.id, e.target.value)} 
                    style={{ flexGrow: 1, accentColor: 'var(--gold)' }}
                  />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('quiz.agree', 'Agree')}</span>
                </div>
              </div>
            ))}
            <div style={{ textAlign: 'center', marginTop: '3rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn-primary" onClick={calculateResult} disabled={loading}>
                {loading ? t('common.loading') : t('quiz.reveal_button', 'Reveal My Ideal System →')}
              </button>
              <button className="btn-back-home" onClick={() => navigate('/hub')}>
                ← {t('common.back_to_hub')}
              </button>
            </div>
          </div>
        ) : (
          <div className="glass-card anim-scaleIn" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', borderColor: 'var(--gold)' }}>
            <h3 style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{t('quiz.align_text', 'Your Values Align With:')}</h3>
            <h1 className="font-display" style={{ fontSize: '3rem', color: 'var(--gold)', marginBottom: '2rem' }}>{String(t(`systems.${resultId}`, result))}</h1>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn-primary" onClick={handleRetake}>{t('quiz.restart')} ↺</button>
              <button className="btn-back-home" onClick={() => navigate('/hub')}>
                ← {t('common.back_to_hub')}
              </button>
            </div>
          </div>
        )}
      </div>
    </Chapter>
  );
}
