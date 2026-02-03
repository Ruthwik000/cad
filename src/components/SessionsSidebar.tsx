import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { useAuth } from '../contexts/AuthContext';
import { getUserSessions, createSession, deleteSession, Session } from '../firebase/firestore';

interface SessionsSidebarProps {
  visible: boolean;
  onClose: () => void;
  onSelectSession: (session: Session) => void;
  currentSessionId?: string;
}

export default function SessionsSidebar({
  visible,
  onClose,
  onSelectSession,
  currentSessionId
}: SessionsSidebarProps) {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && user) {
      loadSessions();
    }
  }, [visible, user]);

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

  const handleNewSession = async () => {
    if (!user) return;
    
    try {
      const sessionId = await createSession(user.uid, 'New Session');
      await loadSessions();
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      await deleteSession(sessionId);
      await loadSessions();
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      left: 0,
      top: 0,
      bottom: 0,
      width: '300px',
      backgroundColor: '#0a0a0a',
      borderRight: '1px solid #222222',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      padding: '1rem'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <h3 style={{ margin: 0, color: '#ffffff', fontSize: '1.1rem' }}>Sessions</h3>
        <Button
          icon="pi pi-times"
          rounded
          text
          onClick={onClose}
          style={{ color: '#ffffff' }}
        />
      </div>

      {/* New Session Button */}
      <Button
        label="New Session"
        icon="pi pi-plus"
        onClick={handleNewSession}
        style={{
          width: '100%',
          marginBottom: '1rem',
          backgroundColor: '#3b82f6',
          border: 'none'
        }}
      />

      {/* Sessions List */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: '#666666', padding: '2rem' }}>
            Loading sessions...
          </div>
        ) : sessions.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#666666', padding: '2rem' }}>
            No sessions yet
          </div>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              onClick={() => onSelectSession(session)}
              style={{
                padding: '0.75rem',
                backgroundColor: session.id === currentSessionId ? '#1a1a1a' : 'transparent',
                border: `1px solid ${session.id === currentSessionId ? '#3b82f6' : '#222222'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
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
                  fontSize: '0.75rem'
                }}>
                  {session.updatedAt.toDate().toLocaleDateString()}
                </div>
              </div>
              <Button
                icon="pi pi-trash"
                rounded
                text
                severity="danger"
                onClick={(e) => handleDeleteSession(session.id, e)}
                style={{
                  width: '32px',
                  height: '32px',
                  minWidth: '32px'
                }}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
