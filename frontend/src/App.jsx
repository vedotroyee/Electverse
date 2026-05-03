import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE from './config';
import LoginGate from './components/LoginGate';
import Hub from './components/Hub';
import SystemJourney from './components/SystemJourney';
import Comparison from './components/Comparison';
import Quiz from './components/Quiz';
import { useTranslation } from 'react-i18next';
import { systemData } from './data/systems';
import AIPanel from './components/AIPanel/AIPanel';

function App() {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("Current language in App:", i18n.language);
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    navigate('/hub');
  };

  const handleEnterSystem = async (sysId) => {
    if (user && user._id) {
      try {
        await axios.put(`${API_BASE}/api/users/${user._id}/progress`, { systemId: sysId });
      } catch (err) {
        console.error("Error updating progress:", err);
      }
    }
  };

  // Persistent Nav
  const TopNav = () => (
    <nav className="top-nav">
      <div className="nav-logo" onClick={() => navigate('/hub')} style={{ cursor: 'pointer' }}>
        {t('common.app_name')} 🌍
      </div>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        {user && <span className="user-badge">{user.name} • {user.country}</span>}
        
        <button className="btn-primary-outline" onClick={() => navigate('/comparison')}>
          {t('common.compare')}
        </button>
        <button className="btn-primary gold-btn" onClick={() => navigate('/quiz')}>
          {t('common.take_quiz')}
        </button>
      </div>
    </nav>
  );

  return (
    <>
      {user && <TopNav />}
      
      <main className="scroll-container">
        <Routes>
          <Route path="/" element={!user ? <LoginGate onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/hub" />} />
          <Route path="/hub" element={user ? <Hub onSelectSystem={(id) => navigate(`/system/${id}`)} /> : <Navigate to="/" />} />
          
          {systemData.map(sys => (
            <Route 
              key={sys.id} 
              path={`/system/${sys.id}`} 
              element={user ? <SystemJourney system={sys} onEnter={handleEnterSystem} /> : <Navigate to="/" />} 
            />
          ))}

          <Route path="/comparison" element={user ? <Comparison /> : <Navigate to="/" />} />
          <Route path="/quiz" element={user ? <Quiz user={user} /> : <Navigate to="/" />} />
        </Routes>
      </main>
      <AIPanel />
    </>
  );
}

export default App;
