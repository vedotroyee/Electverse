import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

const API_URL = "https://image.pollinations.ai/prompt/";
const API_PARAMS = "?width=1920&height=1080&nologo=true&enhance=true&seed=42";

export default function Chapter({ id, idx, bgPrompt, overlayClass, children, noSnap, onEnter }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
    onChange: (inView) => {
      if (inView && onEnter) {
        onEnter(idx);
      }
    }
  });

  const fullBgUrl = bgPrompt 
    ? `${API_URL}${encodeURIComponent(bgPrompt)}${API_PARAMS}`
    : null;

  useEffect(() => {
    if (fullBgUrl) {
      const img = new Image();
      img.src = fullBgUrl;
      img.onload = () => setImgLoaded(true);
    } else {
      setImgLoaded(true);
    }
  }, [fullBgUrl]);

  return (
    <section 
      id={id} 
      ref={ref} 
      className={`chapter ${noSnap ? 'no-snap' : ''} ${inView ? 'in-view' : ''}`}
    >
      <div className="shimmer-layer"></div>
      
      {fullBgUrl && (
        <div 
          className={`bg-image-layer ${imgLoaded ? 'loaded' : ''}`}
          style={{ backgroundImage: `url(${fullBgUrl})` }}
        ></div>
      )}

      <div className="overlay"></div>
      
      <div className="content">
        {children}
      </div>
    </section>
  );
}
