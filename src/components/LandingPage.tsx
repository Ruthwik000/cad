import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import FlowFieldBackground from './FlowFieldBackground';
import AuthDialog from './AuthDialog';
import { useAuth } from '../contexts/AuthContext';
import { getUserSessions, Session, createSession } from '../firebase/firestore';
import { ProgressSpinner } from 'primereact/progressspinner';

interface LandingPageProps {
  onStartProject: (prompt: string, sessionId?: string) => void;
}

export default function LandingPage({ onStartProject }: LandingPageProps) {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { user, logOut } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  // Add responsive CSS for features grid
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .features-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
      }
      @media (max-width: 768px) {
        .features-grid {
          grid-template-columns: 1fr;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const examplePrompts = [
    "Create a simple cube with rounded edges",
    "Design a phone stand with 45 degree angle",
    "Make a parametric gear with 20 teeth",
    "Create a vase with spiral pattern",
    "Design a customizable box with lid"
  ];

  useEffect(() => {
    if (user) {
      loadUserSessions();
    }
  }, [user]);

  const loadUserSessions = async () => {
    if (!user) return;
    
    try {
      setLoadingSessions(true);
      const userSessions = await getUserSessions(user.uid);
      setSessions(userSessions.slice(0, 10));
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoadingSessions(false);
    }
  };

  const handleSelectSession = (session: Session) => {
    localStorage.setItem('currentSessionId', session.id);
    onStartProject(session.title, session.id);
  };

  const handleNewChat = async () => {
    if (!user) {
      // If not logged in, just navigate to root
      navigate('/');
      return;
    }

    try {
      // Create a new empty session
      const sessionId = await createSession(user.uid, 'New Chat');
      localStorage.setItem('currentSessionId', sessionId);
      
      // Reload sessions list
      await loadUserSessions();
      
      // Navigate to the new session
      navigate(`/${sessionId}`);
    } catch (error) {
      console.error('Error creating new session:', error);
      // Fallback to root
      navigate('/');
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    // Check if user is authenticated
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    
    setIsGenerating(true);
    
    // Create a new session if user is logged in
    let sessionId: string | undefined;
    try {
      // Generate a better title from the prompt
      const title = prompt.length > 50 
        ? prompt.substring(0, 50).trim() + '...' 
        : prompt.trim();
      
      sessionId = await createSession(user.uid, title);
      localStorage.setItem('currentSessionId', sessionId);
      
      // Store the initial prompt to be loaded into input box
      localStorage.setItem('initialPrompt', prompt);
      
      // Don't add message to Firestore yet - let the user send it from the chat
      
      // Reload sessions to show the new one
      await loadUserSessions();
    } catch (error) {
      console.error('Error creating session:', error);
    }
    
    onStartProject(prompt, sessionId);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <FlowFieldBackground
        color="#818cf8"
        trailOpacity={0.1}
        particleCount={800}
        speed={0.8}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
      />

      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1.5rem 3rem', backgroundColor: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user && (
            <Button
              icon="pi pi-bars"
              rounded
              text
              onClick={() => setShowSidebar(!showSidebar)}
              tooltip="Toggle sidebar"
              tooltipOptions={{ position: 'bottom' }}
              style={{
                color: '#ffffff',
                width: '36px',
                height: '36px'
              }}
            />
          )}
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.5px' }}>
            Venus-CAD
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {user ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#ffffff', fontSize: '0.9rem' }}>
                {user.photoURL && (
                  <img src={user.photoURL} alt="Profile" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #3b82f6' }} />
                )}
                <span>{user.displayName || user.email}</span>
              </div>
              <Button label="Sign Out" onClick={async () => { await logOut(); }}
                style={{ color: '#ffffff', backgroundColor: 'transparent', fontSize: '0.95rem', fontWeight: 500,
                  padding: '0.5rem 1.5rem', border: '1px solid rgba(255, 255, 255, 0.3)', borderRadius: '8px' }} />
            </>
          ) : (
            <>
              <Button label="Log in" text onClick={() => setShowAuthDialog(true)}
                style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 500, padding: '0.5rem 1.5rem',
                  backgroundColor: 'transparent', border: 'none' }} />
              <Button label="Get started" onClick={() => setShowAuthDialog(true)}
                style={{ color: '#000000', backgroundColor: '#ffffff', fontSize: '0.95rem', fontWeight: 600,
                  padding: '0.5rem 1.5rem', border: 'none', borderRadius: '8px' }} />
            </>
          )}
        </div>
      </div>

      <AuthDialog visible={showAuthDialog} onHide={() => setShowAuthDialog(false)} />

      <div style={{
        position: 'absolute',
        top: '80px',
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'row'
      }}>
        {/* Left Sidebar - Chat History (only when logged in and showSidebar is true) */}
        {user && showSidebar && (
          <div style={{
            width: '280px',
            backgroundColor: 'rgba(10, 10, 10, 0.95)',
            borderRight: '1px solid #333333',
            padding: '1.5rem 1rem',
            overflowY: 'auto',
            backdropFilter: 'blur(10px)'
          }}>
            <Button
              label="New Chat"
              icon="pi pi-plus"
              onClick={handleNewChat}
              style={{
                width: '100%',
                marginBottom: '1rem',
                backgroundColor: 'transparent',
                border: '1px solid #333333',
                color: '#ffffff',
                padding: '0.6rem',
                fontSize: '0.9rem'
              }}
            />

            <div style={{
              fontSize: '0.75rem',
              color: '#666666',
              marginBottom: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Recent
            </div>

            {loadingSessions ? (
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <ProgressSpinner style={{ width: '30px', height: '30px' }} />
              </div>
            ) : sessions.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '2rem 1rem',
                color: '#666666',
                fontSize: '0.85rem'
              }}>
                <i className="pi pi-inbox" style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'block', opacity: 0.3 }}></i>
                No chats yet.<br />
                Start creating!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => handleSelectSession(session)}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      backgroundColor: 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div style={{
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      marginBottom: '0.25rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {session.title || 'Untitled Chat'}
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <div style={{
                        color: '#666666',
                        fontSize: '0.7rem'
                      }}>
                        {session.updatedAt?.toDate ? session.updatedAt.toDate().toLocaleDateString() : 'Recent'}
                      </div>
                      {session.messages && session.messages.length > 0 && (
                        <div style={{
                          color: '#666666',
                          fontSize: '0.7rem'
                        }}>
                          {session.messages.length} msg{session.messages.length !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Main Content */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '20px'
        }}>
          <div style={{ maxWidth: '950px', width: '100%', textAlign: 'center', margin: '0 auto', paddingTop: '12vh' }}>
            <h1 style={{
              fontSize: '4rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.5rem',
              lineHeight: '1.1', letterSpacing: '-0.02em'
            }}>
              What will you <span style={{ color: '#818cf8', fontStyle: 'italic' }}>create</span> today?
            </h1>

            <p style={{ fontSize: '1.4rem', color: '#9ca3af', marginBottom: '4rem', fontWeight: 400 }}>
              Create stunning 3D models by chatting with AI.
            </p>

            <div style={{
              backgroundColor: 'rgba(20, 20, 20, 0.95)', borderRadius: '24px', padding: '1.5rem',
              boxShadow: '0 20px 60px rgba(0,0,0,0.8)', border: '1px solid #333333',
              marginBottom: '3rem', backdropFilter: 'blur(10px)'
            }}>
              <InputTextarea value={prompt} onChange={(e) => setPrompt(e.target.value)}
                placeholder="What do you want to build?" rows={6} autoResize disabled={isGenerating}
                onKeyDown={(e) => { if (e.key === 'Enter' && e.ctrlKey) handleGenerate(); }}
                style={{
                  width: '100%', fontSize: '1.05rem', border: 'none', borderRadius: '16px',
                  padding: '1.5rem', resize: 'none', backgroundColor: 'transparent',
                  color: '#9ca3af', minHeight: '120px'
                }} />

              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #333333'
              }}>
                <div style={{ fontSize: '0.85rem', color: '#666666' }}>Press Ctrl+Enter</div>
                <Button label={isGenerating ? "Generating..." : "Create now"}
                  icon={isGenerating ? "pi pi-spin pi-spinner" : "pi pi-arrow-right"} iconPos="right"
                  onClick={handleGenerate} disabled={!prompt.trim() || isGenerating}
                  style={{
                    padding: '0.75rem 2rem', fontSize: '1rem', fontWeight: 600,
                    background: '#3b82f6', color: '#ffffff', border: 'none',
                    borderRadius: '12px', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
                  }} />
              </div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <p style={{ color: '#666666', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Try these examples:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
                {examplePrompts.map((example, index) => (
                  <button key={index} onClick={() => setPrompt(example)} disabled={isGenerating}
                    style={{
                      backgroundColor: 'transparent', color: '#9ca3af', border: '1px solid #333333',
                      borderRadius: '20px', padding: '0.6rem 1.2rem', fontSize: '0.85rem',
                      cursor: 'pointer', transition: 'all 0.2s ease'
                    }}>
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Features Section - Moved down with black transparent background */}
          <div style={{ 
            width: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(20px)',
            padding: '6rem 2rem',
            marginTop: '4rem'
          }}>
            <div style={{ 
              maxWidth: '1400px', 
              width: '100%', 
              margin: '0 auto'
            }}>
              <h2 style={{
                fontSize: '3.5rem',
                fontWeight: 700,
                color: '#ffffff',
                textAlign: 'center',
                marginBottom: '1.5rem',
                letterSpacing: '-0.02em'
              }}>
                Powerful Features
              </h2>
              <p style={{
                fontSize: '1.3rem',
                color: '#9ca3af',
                textAlign: 'center',
                marginBottom: '5rem'
              }}>
                Everything you need to bring your 3D ideas to life
              </p>

              <div className="features-grid">
                {/* Feature 1: Image to 3D */}
                <div style={{
                  backgroundColor: 'rgba(20, 20, 20, 0.6)',
                  border: '1px solid rgba(129, 140, 248, 0.2)',
                  borderRadius: '20px',
                  padding: '3rem',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                  minHeight: '320px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(20, 20, 20, 0.8)';
                  e.currentTarget.style.borderColor = 'rgba(129, 140, 248, 0.5)';
                  e.currentTarget.style.transform = 'translateY(-5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(20, 20, 20, 0.6)';
                  e.currentTarget.style.borderColor = 'rgba(129, 140, 248, 0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '16px',
                    backgroundColor: 'rgba(129, 140, 248, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '2rem'
                  }}>
                    <i className="pi pi-image" style={{ fontSize: '2.5rem', color: '#818cf8' }}></i>
                  </div>
                  <h3 style={{
                    fontSize: '1.6rem',
                    fontWeight: 600,
                    color: '#ffffff',
                    marginBottom: '1.2rem'
                  }}>
                    Image to 3D CAD Model
                  </h3>
                  <p style={{
                    fontSize: '1.1rem',
                    color: '#9ca3af',
                    lineHeight: '1.8'
                  }}>
                    Transform 2D images, sketches, or screenshots into fully editable 3D models. Simply paste or upload an image and watch AI convert it to CAD.
                  </p>
                </div>

                {/* Feature 2: Collaborative Building */}
                <div style={{
                  backgroundColor: 'rgba(20, 20, 20, 0.6)',
                  border: '1px solid rgba(129, 140, 248, 0.2)',
                  borderRadius: '20px',
                  padding: '3rem',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                  minHeight: '320px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(20, 20, 20, 0.8)';
                  e.currentTarget.style.borderColor = 'rgba(129, 140, 248, 0.5)';
                  e.currentTarget.style.transform = 'translateY(-5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(20, 20, 20, 0.6)';
                  e.currentTarget.style.borderColor = 'rgba(129, 140, 248, 0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '16px',
                    backgroundColor: 'rgba(129, 140, 248, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '2rem'
                  }}>
                    <i className="pi pi-users" style={{ fontSize: '2.5rem', color: '#818cf8' }}></i>
                  </div>
                  <h3 style={{
                    fontSize: '1.6rem',
                    fontWeight: 600,
                    color: '#ffffff',
                    marginBottom: '1.2rem'
                  }}>
                    Collaborative Building
                  </h3>
                  <p style={{
                    fontSize: '1.1rem',
                    color: '#9ca3af',
                    lineHeight: '1.8'
                  }}>
                    Share your projects with a link and work together in real-time. Multiple users can view, edit, and iterate on designs simultaneously.
                  </p>
                </div>

                {/* Feature 3: Smart Parametric Tuning */}
                <div style={{
                  backgroundColor: 'rgba(20, 20, 20, 0.6)',
                  border: '1px solid rgba(129, 140, 248, 0.2)',
                  borderRadius: '20px',
                  padding: '3rem',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                  minHeight: '320px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(20, 20, 20, 0.8)';
                  e.currentTarget.style.borderColor = 'rgba(129, 140, 248, 0.5)';
                  e.currentTarget.style.transform = 'translateY(-5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(20, 20, 20, 0.6)';
                  e.currentTarget.style.borderColor = 'rgba(129, 140, 248, 0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '16px',
                    backgroundColor: 'rgba(129, 140, 248, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '2rem'
                  }}>
                    <i className="pi pi-sliders-h" style={{ fontSize: '2.5rem', color: '#818cf8' }}></i>
                  </div>
                  <h3 style={{
                    fontSize: '1.6rem',
                    fontWeight: 600,
                    color: '#ffffff',
                    marginBottom: '1.2rem'
                  }}>
                    Smart Parametric Tuning
                  </h3>
                  <p style={{
                    fontSize: '1.1rem',
                    color: '#9ca3af',
                    lineHeight: '1.8'
                  }}>
                    Adjust dimensions and parameters with intuitive sliders or natural language. Ask AI to resize, reshape, or modify any aspect of your model instantly.
                  </p>
                </div>

                {/* Feature 4: Advanced Boolean Operations */}
                <div style={{
                  backgroundColor: 'rgba(20, 20, 20, 0.6)',
                  border: '1px solid rgba(129, 140, 248, 0.2)',
                  borderRadius: '20px',
                  padding: '3rem',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                  minHeight: '320px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(20, 20, 20, 0.8)';
                  e.currentTarget.style.borderColor = 'rgba(129, 140, 248, 0.5)';
                  e.currentTarget.style.transform = 'translateY(-5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(20, 20, 20, 0.6)';
                  e.currentTarget.style.borderColor = 'rgba(129, 140, 248, 0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '16px',
                    backgroundColor: 'rgba(129, 140, 248, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '2rem'
                  }}>
                    <i className="pi pi-box" style={{ fontSize: '2.5rem', color: '#818cf8' }}></i>
                  </div>
                  <h3 style={{
                    fontSize: '1.6rem',
                    fontWeight: 600,
                    color: '#ffffff',
                    marginBottom: '1.2rem'
                  }}>
                    Advanced Boolean Operations
                  </h3>
                  <p style={{
                    fontSize: '1.1rem',
                    color: '#9ca3af',
                    lineHeight: '1.8'
                  }}>
                    Create complex geometries with union, intersection, and difference operations. Merge shapes or carve intricate details with precision.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div style={{
            position: 'relative', paddingBottom: '20px', color: '#666666',
            fontSize: '0.9rem', textAlign: 'center'
          }}>
            Powered by OpenSCAD & AI
          </div>
        </div>
      </div>
    </div>
  );
}
