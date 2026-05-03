import React, { useState } from 'react';
import axios from 'axios';
import API_BASE from '../config';

const quizQ = [
  { q: "How many seats are required for a majority in the Lok Sabha?", o: ["250", "272", "300", "543"], a: 1 },
  { q: "Which constitutional body conducts elections independently?", o: ["Parliament", "Supreme Court", "Election Commission"], a: 2 },
  { q: "What is the security deposit for a Lok Sabha candidate?", o: ["₹10,000", "₹25,000", "₹50,000", "₹1 Lakh"], a: 1 },
  { q: "When does the Model Code of Conduct come into force?", o: ["Voting Day", "When dates are announced", "1 month prior"], a: 1 },
  { q: "What does VVPAT provide to the voter?", o: ["Extra vote", "Paper slip confirmation", "Digital receipt via SMS"], a: 1 }
];

export default function DeepDive({ user, roleContent }) {
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [locked, setLocked] = useState(false);

  const handleAns = async (oIdx) => {
    if (locked) return;
    setLocked(true);
    
    const isCorrect = oIdx === quizQ[qIndex].a;
    let newScore = score;
    
    if (isCorrect) {
      newScore += 1;
      setScore(newScore);
      setFeedback("<span style='color:var(--green)'>Correct! ✅</span>");
    } else {
      setFeedback("<span style='color:red'>Incorrect ❌</span>");
    }

    setTimeout(async () => {
      setFeedback('');
      setLocked(false);
      
      if (qIndex + 1 < quizQ.length) {
        setQIndex(qIndex + 1);
      } else {
        setShowResult(true);
        // Save score to DB
        if (user && user._id) {
          try {
            await axios.put(`${API_BASE}/api/users/${user._id}/score`, { score: newScore });
          } catch (err) {
            console.error("Failed to save score", err);
          }
        }
      }
    }, 1500);
  };

  let title = "First-Time Voter 📋";
  if (score === 5) title = "Chief Election Commissioner 🏆";
  else if (score >= 3) title = "Returning Officer 🥈";

  return (
    <section id="screen-deepdive" className="chapter no-snap">
      <div className="content panel-container">
        <div dangerouslySetInnerHTML={{ __html: roleContent }}></div>
        
        <div id="quiz-area" style={{ marginTop: '3rem', borderTop: '2px solid var(--border-color)', paddingTop: '2rem' }}>
          <h2 style={{ color: 'var(--navy)', marginBottom: '1rem', textAlign: 'center' }}>Final Quiz 📝</h2>
          
          {!showResult ? (
            <div className="quiz-slide active">
              <h3 style={{ marginBottom: '1.5rem' }}>Q{qIndex + 1}: {quizQ[qIndex].q}</h3>
              {quizQ[qIndex].o.map((opt, oIdx) => (
                <button 
                  key={oIdx}
                  className="quiz-btn"
                  onClick={() => handleAns(oIdx)}
                  disabled={locked}
                >
                  {opt}
                </button>
              ))}
              <div className="quiz-feedback" dangerouslySetInnerHTML={{ __html: feedback }} style={{ opacity: feedback ? 1 : 0 }}></div>
            </div>
          ) : (
            <div id="quiz-result" style={{ textAlign: 'center' }}>
              <h1 style={{ fontSize: '4rem', color: 'var(--saffron)' }}>{score}/5</h1>
              <h2 style={{ marginBottom: '1rem' }}>{title}</h2>
              <div className="share-card">
                <p id="share-text" style={{ fontWeight: 'bold', marginBottom: '1rem' }}>
                  I scored {score}/5 on VoteGuru! 🗳️ Do you know India's election process? #VoteGuru
                </p>
                <button 
                  className="btn-main" 
                  onClick={() => {
                    navigator.clipboard.writeText(`I scored ${score}/5 on VoteGuru! 🗳️ Do you know India's election process? #VoteGuru`);
                    alert('Copied to clipboard!');
                  }}
                >
                  Copy to Clipboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
