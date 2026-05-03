import React from 'react';
import { useNavigate } from 'react-router-dom';
import Chapter from './Chapter';
import { useTranslation } from 'react-i18next';

const compareData = [
  { id: 'fptp', name: 'FPTP', fair: '⭐⭐', stable: '⭐⭐⭐⭐', simple: '⭐⭐⭐⭐', local: '⭐⭐⭐⭐',
    countries: [
      { id: 'uk', flag: '🇬🇧', name: 'UK' }, { id: 'in', flag: '🇮🇳', name: 'India' }, { id: 'us', flag: '🇺🇸', name: 'USA' },
      { id: 'ca', flag: '🇨🇦', name: 'Canada' }, { id: 'ng', flag: '🇳🇬', name: 'Nigeria' }, { id: 'gh', flag: '🇬🇭', name: 'Ghana' },
      { id: 'ke', flag: '🇰🇪', name: 'Kenya' }, { id: 'my', flag: '🇲🇾', name: 'Malaysia' }
    ]},
  { id: 'pr', name: 'PR', fair: '⭐⭐⭐⭐', stable: '⭐⭐', simple: '⭐⭐', local: '⭐',
    countries: [
      { id: 'nl', flag: '🇳🇱', name: 'Netherlands' }, { id: 'se', flag: '🇸🇪', name: 'Sweden' }, { id: 'za', flag: '🇿🇦', name: 'South Africa' },
      { id: 'be', flag: '🇧🇪', name: 'Belgium' }, { id: 'fi', flag: '🇫🇮', name: 'Finland' }, { id: 'dk', flag: '🇩🇰', name: 'Denmark' },
      { id: 'no', flag: '🇳🇴', name: 'Norway' }, { id: 'il', flag: '🇮🇱', name: 'Israel' }, { id: 'es', flag: '🇪🇸', name: 'Spain' }
    ]},
  { id: 'two', name: 'Two-Round', fair: '⭐⭐⭐', stable: '⭐⭐⭐', simple: '⭐⭐⭐', local: '⭐⭐⭐',
    countries: [
      { id: 'fr', flag: '🇫🇷', name: 'France' }, { id: 'br', flag: '🇧🇷', name: 'Brazil' }, { id: 'ru', flag: '🇷🇺', name: 'Russia' },
      { id: 'eg', flag: '🇪🇬', name: 'Egypt' }, { id: 'tr', flag: '🇹🇷', name: 'Turkey' }, { id: 'ir', flag: '🇮🇷', name: 'Iran' },
      { id: 'co', flag: '🇨🇴', name: 'Colombia' }, { id: 'pl', flag: '🇵🇱', name: 'Poland' }
    ]},
  { id: 'rcv', name: 'RCV', fair: '⭐⭐⭐⭐', stable: '⭐⭐⭐', simple: '⭐', local: '⭐⭐⭐⭐',
    countries: [
      { id: 'au', flag: '🇦🇺', name: 'Australia' }, { id: 'ie', flag: '🇮🇪', name: 'Ireland' }, { id: 'nz', flag: '🇳🇿', name: 'New Zealand' },
      { id: 'mt', flag: '🇲🇹', name: 'Malta' }, { id: 'pg', flag: '🇵🇬', name: 'Papua New Guinea' }, { id: 'us', flag: '🇺🇸', name: 'USA' }
    ]},
  { id: 'mixed', name: 'Mixed', fair: '⭐⭐⭐⭐', stable: '⭐⭐⭐', simple: '⭐⭐', local: '⭐⭐⭐⭐',
    countries: [
      { id: 'de', flag: '🇩🇪', name: 'Germany' }, { id: 'jp', flag: '🇯🇵', name: 'Japan' }, { id: 'nz', flag: '🇳🇿', name: 'New Zealand' },
      { id: 'kr', flag: '🇰🇷', name: 'South Korea' }, { id: 'it', flag: '🇮🇹', name: 'Italy' }, { id: 'mx', flag: '🇲🇽', name: 'Mexico' },
      { id: 'hu', flag: '🇭🇺', name: 'Hungary' }, { id: 'th', flag: '🇹🇭', name: 'Thailand' }
    ]},
  { id: 'college', name: 'Electoral College', fair: '⭐', stable: '⭐⭐⭐', simple: '⭐⭐', local: '⭐⭐',
    countries: [
      { id: 'us', flag: '🇺🇸', name: 'USA' }, { id: 'in', flag: '🇮🇳', name: 'India' },
      { id: 'de', flag: '🇩🇪', name: 'Germany' }, { id: 'pk', flag: '🇵🇰', name: 'Pakistan' },
      { id: 'mm', flag: '🇲🇲', name: 'Myanmar' }
    ]},
  { id: 'direct', name: 'Direct Democracy', fair: '⭐⭐⭐⭐', stable: '⭐', simple: '⭐⭐⭐⭐', local: '⭐⭐⭐⭐',
    countries: [
      { id: 'ch', flag: '🇨🇭', name: 'Switzerland' }, { id: 'is', flag: '🇮🇸', name: 'Iceland' }, { id: 'uy', flag: '🇺🇾', name: 'Uruguay' },
      { id: 'tw', flag: '🇹🇼', name: 'Taiwan' }, { id: 'us', flag: '🇺🇸', name: 'USA' }
    ]},
  { id: 'appointed', name: 'Appointed', fair: '❌', stable: '⭐⭐⭐⭐', simple: '⭐⭐⭐⭐', local: '❌',
    countries: [
      { id: 'sa', flag: '🇸🇦', name: 'Saudi Arabia' }, { id: 'cn', flag: '🇨🇳', name: 'China' }, { id: 'va', flag: '🇻🇦', name: 'Vatican City' },
      { id: 'ae', flag: '🇦🇪', name: 'UAE' }, { id: 'qa', flag: '🇶🇦', name: 'Qatar' }, { id: 'bn', flag: '🇧🇳', name: 'Brunei' },
      { id: 'kp', flag: '🇰🇵', name: 'North Korea' }, { id: 'om', flag: '🇴🇲', name: 'Oman' }
    ]}
];

export default function Comparison() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Chapter 
      id="screen-comparison" 
      bgPrompt="diverse people world holding ballots smiling warm cinematic"
    >
      <div className="content">
        <h1 className="hero-title anim-fadeUp" style={{ textAlign: 'center', fontSize: '3.5rem' }}>{String(t('comparison.title', 'Global Comparison'))}</h1>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '3rem' }} className="anim-fadeUp delay-100">
          {String(t('comparison.subtitle', 'No perfect system exists. Every democracy is a compromise.'))}
        </p>

        <div className="glass-card anim-scaleIn delay-200" style={{ overflowX: 'auto', padding: '1.5rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--glass-border)', color: 'var(--gold)' }}>
                <th style={{ padding: '1rem' }}>{String(t('comparison.table.system', 'System'))}</th>
                <th style={{ padding: '1rem' }}>{String(t('comparison.table.fairness', 'Fairness'))}</th>
                <th style={{ padding: '1rem' }}>{String(t('comparison.table.stability', 'Stability'))}</th>
                <th style={{ padding: '1rem' }}>{String(t('comparison.table.simplicity', 'Simplicity'))}</th>
                <th style={{ padding: '1rem' }}>{String(t('comparison.table.local_rep', 'Local Rep'))}</th>
                <th style={{ padding: '1rem', minWidth: '260px' }}>{String(t('comparison.table.countries', 'Countries'))}</th>
              </tr>
            </thead>
            <tbody>
              {compareData.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }} className={`anim-slideLeft delay-${i * 100}`}>
                  <td style={{ padding: '1rem', fontWeight: 'bold' }}>{String(t(`systems.${row.id}`, row.name))}</td>
                  <td style={{ padding: '1rem' }}>{row.fair}</td>
                  <td style={{ padding: '1rem' }}>{row.stable}</td>
                  <td style={{ padding: '1rem' }}>{row.simple}</td>
                  <td style={{ padding: '1rem' }}>{row.local}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {row.countries.map((c, j) => (
                        <span key={j} className="country-pill">
                          {c.flag} {String(t(`countries.${c.id}`, c.name))}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem' }} className="anim-fadeUp delay-300">
          <button className="btn-back-home" onClick={() => navigate('/hub')}>
            ← {t('common.back_to_hub', 'Back to Hub')}
          </button>
        </div>
      </div>
    </Chapter>
  );
}
