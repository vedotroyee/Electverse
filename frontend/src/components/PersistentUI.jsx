import React, { useEffect, useState } from 'react';

export default function PersistentUI({ chaptersCount, currentIdx }) {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const mainScroll = document.getElementById('main-scroll');
      if (mainScroll) {
        const scrollTop = mainScroll.scrollTop;
        const scrollHeight = mainScroll.scrollHeight - mainScroll.clientHeight;
        setProgress((scrollTop / scrollHeight) * 100);
      }
    };
    
    const container = document.getElementById('main-scroll');
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const showNav = currentIdx > 0 && currentIdx < chaptersCount - 2;
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    setShowSkip(false);
    if (showNav) {
      const timer = setTimeout(() => setShowSkip(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [currentIdx, showNav]);

  const scrollToIdx = (idx) => {
    const section = document.querySelectorAll('.chapter')[idx];
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div className="flag-stripe"></div>
      <div className="scroll-progress-bar">
        <div id="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>
      
      <nav className={`top-nav ${showNav ? 'visible' : ''}`}>
        <div className="nav-logo">VoteGuru 🇮🇳</div>
        <div className="nav-pills desktop-only">
          {Array.from({ length: chaptersCount - 3 }).map((_, i) => (
            <div 
              key={i} 
              className={`nav-pill ${currentIdx === i + 1 ? 'active' : ''}`}
              onClick={() => scrollToIdx(i + 1)}
            ></div>
          ))}
        </div>
        <button className="btn-skip" onClick={() => scrollToIdx(chaptersCount - 2)}>
          Skip to Quiz →
        </button>
      </nav>

      <div className={`floating-menu desktop-only ${showNav ? 'visible' : ''}`}>
        {Array.from({ length: chaptersCount - 3 }).map((_, i) => (
          <div 
            key={i}
            className={`menu-dot ${currentIdx === i + 1 ? 'active' : ''}`}
            data-label={`Chapter ${i + 1}`}
            onClick={() => scrollToIdx(i + 1)}
          ></div>
        ))}
      </div>

      <button 
        className={`floating-skip-btn ${showSkip ? 'visible' : ''}`}
        onClick={() => scrollToIdx(currentIdx + 1)}
      >
        Skip ↓
      </button>
    </>
  );
}
