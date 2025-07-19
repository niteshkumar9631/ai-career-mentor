import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [isShort, setIsShort] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [particles, setParticles] = useState([]);
  const canvasRef = useRef(null);

  // Create floating particles effect
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.5 + 0.2,
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(() => {
      setParticles(prev => 
        prev.map(particle => ({
          ...particle,
          x: particle.x + particle.speedX,
          y: particle.y + particle.speedY,
          x: particle.x > window.innerWidth ? 0 : particle.x < 0 ? window.innerWidth : particle.x,
          y: particle.y > window.innerHeight ? 0 : particle.y < 0 ? window.innerHeight : particle.y,
        }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsLoading(true);
    setResponse("");

    try {
      const res = await axios.post("/api/ai/career-path", {
        query,
        responseType: isShort ? "short" : "long",
      });

      setResponse(res.data.roadmap);
    } catch (err) {
      console.error(err);
      setResponse("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      {/* Animated Background */}
      <div className="background">
        <div className="gradient-bg"></div>
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>

      {/* Particles */}
      <div className="particles">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              opacity: particle.opacity,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="container">
        <div className="header">
          <div className="logo-container">
            <div className="logo-icon"></div>
            <h1 className="title">
              <span className="title-text">AI Career</span>
              <span className="title-highlight">Mentor</span>
            </h1>
          </div>
          <p className="subtitle">Your Gateway to Future Success</p>
        </div>

        <div className="main-card">
          <form onSubmit={handleSubmit} className="form-container">
            <div className="input-group">
              <div className="input-wrapper">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="What do you want to become?"
                  className="main-input"
                  disabled={isLoading}
                />
                <div className="input-glow"></div>
              </div>
              <button 
                type="submit" 
                className={`submit-btn ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="loading-spinner">
                    <div className="spinner"></div>
                  </div>
                ) : (
                  <>
                    <span>Ask AI</span>
                    <div className="btn-glow"></div>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="options-container">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={isShort}
                onChange={() => setIsShort(!isShort)}
                disabled={isLoading}
              />
              <span className="slider">
                <span className="slider-text">{isShort ? 'Short' : 'Long'}</span>
              </span>
            </label>
            <span className="option-label">Response Type</span>
          </div>
        </div>

        {response && (
          <div className="response-container">
            <div className="response-card">
              <div className="response-header">
                <div className="ai-avatar">🤖</div>
                <h3>AI Response</h3>
              </div>
              <div className="response-content">
                <p>{response}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
