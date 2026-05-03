import React, { useState, useCallback } from 'react';
import axios from 'axios';
import API_BASE from '../config';
import Globe3D from './Globe3D';
import { useTranslation } from 'react-i18next';

const countries = [
  "us", "uk", "in", "fr", "de", "jp", "au", "ca", "br", "za"
];

export default function LoginGate({ onLoginSuccess }) {
  const { t, i18n } = useTranslation();
  const [stage, setStage] = useState('preloader');
  const [fadeOut, setFadeOut] = useState(false);
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [purpose, setPurpose] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePreloaderClick = (e) => {
    setFadeOut(true);
    setTimeout(() => setStage('login'), 900);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/users`, { name, country, purpose });
      onLoginSuccess(res.data);
    } catch (error) {
      console.error("Login failed:", error);
      alert("Failed to connect to server. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  /* ─── PRELOADER ─── */
  if (stage === 'preloader') {
    return (
      <div
        className={`preloader-screen ${fadeOut ? 'fade-out' : ''}`}
        onClick={handlePreloaderClick}
      >
        <Globe3D />

        {/* Heading anchored BELOW the globe */}
        <div className="preloader-text">
          <div className="lang-selector-preloader" onClick={(e) => e.stopPropagation()}>
            <p className="lang-select-hint">{t('common.choose_language', 'SELECT YOUR MISSION LANGUAGE')}</p>
            <div className="lang-pills">
              <button className={i18n.language === 'en' ? 'active' : ''} onClick={(e) => { e.stopPropagation(); changeLanguage('en'); }}>ENGLISH</button>
              <button className={i18n.language === 'hi' ? 'active' : ''} onClick={(e) => { e.stopPropagation(); changeLanguage('hi'); }}>हिन्दी</button>
              <button className={i18n.language === 'es' ? 'active' : ''} onClick={(e) => { e.stopPropagation(); changeLanguage('es'); }}>ESPAÑOL</button>
              <button className={i18n.language === 'fr' ? 'active' : ''} onClick={(e) => { e.stopPropagation(); changeLanguage('fr'); }}>FRANÇAIS</button>
              <button className={i18n.language === 'ar' ? 'active' : ''} onClick={(e) => { e.stopPropagation(); changeLanguage('ar'); }}>العربية</button>
              <button className={i18n.language === 'zh' ? 'active' : ''} onClick={(e) => { e.stopPropagation(); changeLanguage('zh'); }}>中文</button>
              <button className={i18n.language === 'ja' ? 'active' : ''} onClick={(e) => { e.stopPropagation(); changeLanguage('ja'); }}>日本語</button>
            </div>
          </div>
          <h1 className="font-display preloader-title">{t('common.app_name')}</h1>
          <p className="preloader-sub">{t('common.subtitle', 'Decoding Democracy Worldwide')}</p>
          <p className="preloader-cta">{t('common.click_to_enter', 'Click anywhere to enter')}</p>
        </div>
      </div>
    );
  }

  /* ─── LOGIN ─── */
  return (
    <div className="login-screen">
      {/* Cinematic background */}
      <div className="login-bg" />
      <div className="login-overlay" />

      <div className="login-container-expanded fade-in-up">
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h1 className="font-display" style={{ fontSize: '3.5rem', marginBottom: '0.8rem' }}>{t('login.welcome')}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>{t('login.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="login-field-group stagger-1">
            <label className="login-label">{t('login.identity_label')}</label>
            <input
              type="text"
              className="login-input-premium"
              placeholder={t('login.identity_placeholder')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="login-field-group stagger-2">
            <label className="login-label">{t('login.origin_label')}</label>
            <select
              className="login-input-premium"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            >
              <option value="" disabled>{t('login.origin_placeholder')}</option>
              {['us', 'uk', 'in', 'fr', 'de', 'jp', 'au', 'ca', 'br', 'za'].map(cid => (
                <option key={cid} value={t(`countries.${cid}`)}>
                  {t(`countries.${cid}`)}
                </option>
              ))}
              <option value="Other">{t('countries.other', 'Other')}</option>
            </select>
          </div>

          <div className="login-field-group stagger-3">
            <label className="login-label">{t('login.mission_label')}</label>
            <select
              className="login-input-premium"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              required
            >
              <option value="" disabled>{t('login.mission_placeholder')}</option>
              <option value="student">{t('login.mission_options.student', '🎓 Academic Research')}</option>
              <option value="citizen">{t('login.mission_options.citizen', '🗳️ Civic Awareness')}</option>
              <option value="journalist">{t('login.mission_options.journalist', '📰 Political Analysis')}</option>
              <option value="policy">{t('login.mission_options.policy', '🏛️ Policy & Governance')}</option>
            </select>
          </div>

          <div className="stagger-4">
            <button type="submit" className="btn-primary btn-login-expand" disabled={loading}>
              {loading ? t('common.loading') : t('login.enter_button')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
