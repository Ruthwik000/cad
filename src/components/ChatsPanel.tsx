import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useAuth } from '../contexts/AuthContext';
import { getUserSessions, createSession, deleteSession, Session } from '../firebase/firestore';
import { ProgressSpinner } from 'primereact/progressspinner';

interface ChatsPanelProps {
  className?: string;
  style?: React.CSSProperties;
  onSelectSession?: (session: Session) => void;
}

export default function ChatsPanel({ className, style, onSelectSession }: ChatsPanelProps) {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(
    localStorage.getItem('currentSessionId')
  );

  useEffect(() => {
    if (user) {
      loadSessions();
    }
  }, [user]);

  const loadSessions = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userSessions = await getUserSessions(user.uid);
      setSessions(userSessions);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = async () => {
    if (!user) return;
    
    try {
      const sessionId = await createSession(user.uid, 'New Chat');
      localStorage.setItem('currentSessionId', sessionId);
      setCurrentSessionId(sessionId);
      await loadSessions();
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  const handleSelectSession = (session: Session) => {
    setCurrentSessionId(session.id);
    localStorage.setItem('currentSessionId', session.id);
    if (onSelectSession) {
      onSelectSession(session);
    }
  };

  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      await deleteSession(sessionId);
      if (currentSessionId === sessionId) {
        localStorage.removeItem('currentSessionId');
        setCurrentSessionId(null);
      }
      await loadSessions();
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user) {
    return (
      <div className={className} style={style}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          backgroundColor: '#0a0a0a',
          padding: '1.5rem'
        }}>
          <div style={{
            textAlign: 'center',
            color: '#666666',
            padding: '2rem 1rem'
          }}>
            <i className="pi pi-sign-in" style={{ fontSize: '2rem', marginBottom: '1rem', display: 'block' }}></i>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>
              Sign in to save and access your chat sessions
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className} style={style}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#0a0a0a'
      }}>
        {/* Header */}
        <div style={{
          padding: '1rem 1.5rem',
          borderBottom: '1px solid #222222'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <h3 style={{ margin: 0, color: '#ffffff', fontSize: '1rem', fontWeight: 500 }}>
              Chat Sessions
            </h3>
            <Button
              icon="pi pi-refresh"
              rounded
              text
              onClick={loadSessions}
              disabled={loading}
              style={{ color: '#ffffff', width: '32px', height: '32px' }}
            />
          </div>

          {/* New Chat Button */}
          <Button
            label="New Chat"
            icon="pi pi-plus"
            onClick={handleNewChat}
            style={{
              width: '100%',
              backgroundColor: '#3b82f6',
              border: 'none',
              padding: '0.6rem',
              fontSize: '0.9rem',
              fontWeight: 500
            }}
          />

          {/* Search */}
          <div style={{ marginTop: '1rem' }}>
            <InputText
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chats..."
              style={{
                width: '100%',
                backgroundColor: '#141414',
                border: '1px solid #333333',
                color: '#ffffff',
                padding: '0.6rem',
                fontSize: '0.9rem'
              }}
            />
          </div>
        </div>

        {/* Sessions List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0.5rem'
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <ProgressSpinner style={{ width: '40px', height: '40px' }} />
            </div>
          ) : filteredSessions.length === 0 ? (
            <div style={{
              textAlign: 'center',
              color: '#666666',
              padding: '2rem 1rem',
              fontSize: '0.9rem'
            }}>
              {searchQuery ? 'No chats found' : 'No chat sessions yet'}
            </div>
          ) : (
            filteredSessions.map((session) => (
              <div
                key={session.id}
                onClick={() => handleSelectSession(session)}
                style={{
                  padding: '0.75rem',
                  margin: '0.25rem',
                  backgroundColor: session.id === currentSessionId ? '#1a1a1a' : 'transparent',
                  border: `1px solid ${session.id === currentSessionId ? '#3b82f6' : '#222222'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  if (session.id !== currentSessionId) {
                    e.currentTarget.style.backgroundColor = '#141414';
                  }
                }}
                onMouseLeave={(e) => {
                  if (session.id !== currentSessionId) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    marginBottom: '0.25rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {session.title}
                  </div>
                  <div style={{
                    color: '#666666',
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span>{session.messages?.length || 0} messages</span>
                    <span>•</span>
                    <span>{session.updatedAt.toDate().toLocaleDateString()}</span>
                  </div>
                </div>
                <Button
                  icon="pi pi-trash"
                  rounded
                  text
                  severity="danger"
                  onClick={(e) => handleDeleteSession(session.id, e)}
                  style={{
                    width: '28px',
                    height: '28px',
                    minWidth: '28px',
                    color: '#ff6b6b'
                  }}
                />
              </div>
            ))
          )}
        </div>

        {/* Footer Info */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid #222222',
          fontSize: '0.8rem',
          color: '#666666',
          textAlign: 'center'
        }}>
          {sessions.length} {sessions.length === 1 ? 'session' : 'sessions'}
        </div>
      </div>
    </div>
  );
}
