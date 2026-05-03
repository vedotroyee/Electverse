import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import API_BASE from '../../config';
import { MessageSquare, Newspaper, X, Send, Globe, ChevronRight } from 'lucide-react';
import './AIPanel.css';

const REGIONS = [
  { id: 'World', label: 'World', flag: '🌍' },
  { id: 'India', label: 'India', flag: '🇮🇳' },
  { id: 'USA', label: 'USA', flag: '🇺🇸' },
  { id: 'UK', label: 'UK', flag: '🇬🇧' },
  { id: 'Europe', label: 'Europe', flag: '🇪🇺' },
  { id: 'Brazil', label: 'Brazil', flag: '🇧🇷' },
  { id: 'Australia', label: 'Australia', flag: '🇦🇺' },
  { id: 'Asia', label: 'Asia', flag: '🌏' },
];

const FALLBACK_NEWS = [
  {
    source: { name: "Global Times" },
    publishedAt: new Date().toISOString(),
    title: "Major Election Reform Announced in 12 Nations",
    description: "New voting protocols aim to increase transparency and voter turnout across multiple democratic nations.",
    url: "#",
  },
  {
    source: { name: "Civic Daily" },
    publishedAt: new Date().toISOString(),
    title: "How Digital IDs are Shaping Modern Elections",
    description: "Technological advancements are revolutionizing the way citizens cast their ballots.",
    url: "#",
  },
  {
    source: { name: "Election Watch" },
    publishedAt: new Date().toISOString(),
    title: "Youth Voter Turnout Hits Historic Highs",
    description: "Recent data shows a significant increase in engagement among voters aged 18-25.",
    url: "#",
  },
  {
    source: { name: "Democracy Now" },
    publishedAt: new Date().toISOString(),
    title: "The Future of Electoral Colleges Worldwide",
    description: "Exploring different systems used to balance regional and national interests.",
    url: "#",
  },
  {
    source: { name: "Policy Pulse" },
    publishedAt: new Date().toISOString(),
    title: "Campaign Financing Laws: A Global Comparison",
    description: "Analyzing how different countries regulate the flow of money in politics.",
    url: "#",
  },
  {
    source: { name: "Voter Voice" },
    publishedAt: new Date().toISOString(),
    title: "Accessibility in Voting: Closing the Gap",
    description: "Efforts to ensure every citizen, regardless of ability, can exercise their right to vote.",
    url: "#",
  }
];

const AIPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(localStorage.getItem('ev_last_tab') || 'ai');
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('ev_chat_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse chat history", e);
      return [];
    }
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [news, setNews] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('World');
  const [hasUnreadNews, setHasUnreadNews] = useState(false);
  const [newsFetched, setNewsFetched] = useState(false);
  const scrollRef = useRef(null);
  const newsIntervalRef = useRef(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem('ev_last_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('ev_chat_history', JSON.stringify(messages.slice(-20)));
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // News fetching — ONLY when panel is open and on news tab
  const fetchNews = async (region) => {
    const r = region || selectedRegion;
    try {
      const response = await axios.get(`${API_BASE}/api/news?region=${r}`);
      if (response.data && response.data.length > 0) {
        setNews(response.data);
        setHasUnreadNews(false); // user is looking at news
      } else {
        setNews(FALLBACK_NEWS);
      }
    } catch (error) {
      console.error("News fetch failed, using fallback", error);
      setNews(FALLBACK_NEWS);
    }
    setNewsFetched(true);
  };

  // Start/stop news polling based on panel open state + active tab
  useEffect(() => {
    if (isOpen && activeTab === 'news') {
      // Fetch immediately only if not yet fetched or region changed
      fetchNews();
      // Auto-refresh every 5 minutes while panel is open
      newsIntervalRef.current = setInterval(() => fetchNews(), 300000);
    } else {
      // Stop polling when panel is closed or not on news tab
      clearInterval(newsIntervalRef.current);
    }
    return () => clearInterval(newsIntervalRef.current);
  }, [isOpen, activeTab, selectedRegion]);

  const handleSend = async (textOverride) => {
    const messageText = textOverride || input;
    if (!messageText.trim()) return;

    const userMsg = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await axios.post(`${API_BASE}/api/chat`, {
        messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content }))
      });
      setMessages(prev => [...prev, { role: 'assistant', content: response.data.content }]);
    } catch (error) {
      const isQuota = error.response?.status === 429 || error.response?.data?.message === 'quota_exceeded';
      const errMsg = isQuota
        ? "⏳ The AI's free-tier quota is temporarily exhausted. Please try again in a few minutes — Gemini resets limits automatically!"
        : "Sorry, I'm having trouble connecting. Please try again! 🗳️";
      setMessages(prev => [...prev, { role: 'assistant', content: errMsg }]);
    } finally {
      setIsTyping(false);
    }
  };

  const starterChips = [
    "How does FPTP work?",
    "Which country has best voter turnout?",
    "What is gerrymandering?",
    "How does India elect its PM?"
  ];

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const diff = Math.floor((new Date() - date) / 3600000);
    return diff < 1 ? 'Just now' : `${diff} hours ago`;
  };

  return (
    <div className={`electverse-panel-container ${isOpen ? 'panel-open' : ''}`}>
      {/* Floating Button */}
      <button 
        className={`floating-trigger-btn ${hasUnreadNews ? 'has-badge' : ''}`}
        onClick={() => {
          setIsOpen(true);
          setHasUnreadNews(false);
        }}
      >
        Have a Question? 🗳️
      </button>

      {/* Side Panel Overlay */}
      <div className="panel-overlay" onClick={() => setIsOpen(false)} />

      {/* Main Panel */}
      <aside className="electverse-panel">
        <header className="panel-header">
          <div className="tabs">
            <button 
              className={activeTab === 'ai' ? 'active' : ''} 
              onClick={() => setActiveTab('ai')}
            >
              <MessageSquare size={18} /> Ask AI
            </button>
            <button 
              className={activeTab === 'news' ? 'active' : ''} 
              onClick={() => setActiveTab('news')}
            >
              <Newspaper size={18} /> Election News
            </button>
          </div>
          <button className="close-btn" onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </header>

        <div className="panel-body">
          {activeTab === 'ai' ? (
            <div className="tab-content ai-tab">
              <div className="chat-history" ref={scrollRef}>
                {messages.length === 0 && (
                  <div className="welcome-chat">
                    <h3>Hello! 👋</h3>
                    <p>I'm ElectVerse Guide, your civic education assistant. Ask me anything about elections worldwide!</p>
                  </div>
                )}
                {messages.map((msg, i) => (
                  <div key={i} className={`message-bubble ${msg.role}`}>
                    <div className="bubble-inner">
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="message-bubble assistant">
                    <div className="bubble-inner typing">
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="chat-footer">
                <div className="starter-chips">
                  {starterChips.map(chip => (
                    <button key={chip} onClick={() => handleSend(chip)}>{chip}</button>
                  ))}
                </div>
                <div className="input-bar">
                  <input 
                    type="text" 
                    placeholder="Ask anything about elections worldwide..." 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  />
                  <button onClick={() => handleSend()}>
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="tab-content news-tab">
              <div className="region-filters">
                {REGIONS.map(r => (
                  <button 
                    key={r.id} 
                    className={selectedRegion === r.id ? 'active' : ''}
                    onClick={() => setSelectedRegion(r.id)}
                  >
                    {r.flag} {r.label}
                  </button>
                ))}
              </div>
              
              <div className="news-list">
                {news.map((item, i) => (
                  <div key={i} className="news-card">
                    <div className="news-meta">
                      <span className="source">{item.source.name}</span>
                      <span className="time">• {formatTime(item.publishedAt)}</span>
                    </div>
                    <h4 className="news-title">{item.title}</h4>
                    <p className="news-desc">{item.description}</p>
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="read-more">
                      Read More <ChevronRight size={14} />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default AIPanel;
