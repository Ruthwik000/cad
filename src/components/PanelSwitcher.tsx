// Portions of this file are Copyright 2021 Google LLC, and licensed under GPL2+. See COPYING.

import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToggleButton } from 'primereact/togglebutton';
import { Button } from 'primereact/button';
import { ModelContext } from './contexts.ts';
import { useAuth } from '../contexts/AuthContext';
import { Toast } from 'primereact/toast';
import { toggleSessionSharing } from '../firebase/firestore';

export default function PanelSwitcher() {
  const model = useContext(ModelContext);
  const navigate = useNavigate();
  const { user, logOut } = useAuth();
  const toastRef = React.useRef<Toast>(null);
  
  if (!model) throw new Error('No model');

  const state = model.state;

  const handleCopyLink = () => {
    // Generate shareable link with current session
    const sessionId = localStorage.getItem('currentSessionId');
    
    if (!sessionId) {
      toastRef.current?.show({
        severity: 'warn',
        summary: 'No Active Session',
        detail: 'Create a chat first to share',
        life: 3000
      });
      return;
    }
    
    // Enable sharing for this session
    if (user) {
      toggleSessionSharing(sessionId, true).catch(err => {
        console.error('Error enabling sharing:', err);
      });
    }
    
    const shareUrl = `${window.location.origin}/${sessionId}`;
    
    navigator.clipboard.writeText(shareUrl).then(() => {
      toastRef.current?.show({
        severity: 'success',
        summary: 'Link Copied!',
        detail: 'Anyone with this link can collaborate',
        life: 3000
      });
    }).catch(() => {
      toastRef.current?.show({
        severity: 'error',
        summary: 'Failed to copy',
        detail: 'Please try again',
        life: 3000
      });
    });
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <Toast ref={toastRef} position="top-right" />
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1.5rem',
        backgroundColor: '#0a0a0a',
        borderBottom: '1px solid #222222',
        minHeight: '56px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          {/* Back Button */}
          <Button
            icon="pi pi-arrow-left"
            rounded
            text
            onClick={handleBack}
            tooltip="Back to Home"
            tooltipOptions={{ position: 'bottom' }}
            style={{
              color: '#ffffff',
              width: '36px',
              height: '36px'
            }}
          />
          
          <h2 style={{ 
            margin: 0, 
            fontSize: '1.1rem',
            fontWeight: 400,
            color: '#ffffff',
            letterSpacing: '0.5px'
          }}>
            Venus
          </h2>

          {/* New Chat Button */}
          <Button
            icon="pi pi-plus"
            rounded
            text
            onClick={async () => {
              if (user) {
                try {
                  const { createSession } = await import('../firebase/firestore');
                  const sessionId = await createSession(user.uid, 'New Chat');
                  localStorage.setItem('currentSessionId', sessionId);
                  navigate(`/${sessionId}`);
                } catch (error) {
                  console.error('Error creating session:', error);
                  navigate('/new');
                }
              } else {
                navigate('/new');
              }
            }}
            tooltip="New Chat"
            tooltipOptions={{ position: 'bottom' }}
            style={{
              color: '#ffffff',
              width: '36px',
              height: '36px'
            }}
          />
        </div>
        
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center'
        }}>
          {/* Copy Link Button */}
          <Button
            icon="pi pi-link"
            onClick={handleCopyLink}
            tooltip="Copy shareable link"
            tooltipOptions={{ position: 'bottom' }}
            style={{
              backgroundColor: '#1a1a1a',
              color: '#ffffff',
              border: '1px solid #333333',
              padding: '0.5rem 1rem'
            }}
          />
          
          <ToggleButton
            checked={state.view.codeEditorVisible ?? false}
            onLabel="Code"
            offLabel="Code"
            onIcon="pi pi-code"
            offIcon="pi pi-code"
            onChange={() => model.toggleCodeEditor()}
            style={{
              backgroundColor: state.view.codeEditorVisible ? '#ffffff' : '#1a1a1a',
              color: state.view.codeEditorVisible ? '#000000' : '#ffffff',
              border: '1px solid #333333',
              padding: '0.5rem 1rem',
              fontWeight: 500
            }}
          />
          
          <ToggleButton
            checked={state.view.aiChatVisible ?? false}
            onLabel="AI Assistant"
            offLabel="AI Assistant"
            onIcon="pi pi-sparkles"
            offIcon="pi pi-sparkles"
            onChange={() => model.toggleAIChat()}
            style={{
              backgroundColor: state.view.aiChatVisible ? '#ffffff' : '#1a1a1a',
              color: state.view.aiChatVisible ? '#000000' : '#ffffff',
              border: '1px solid #333333',
              padding: '0.5rem 1rem',
              fontWeight: 500
            }}
          />
          
          {/* Logout Button */}
          {user && (
            <Button
              icon="pi pi-sign-out"
              onClick={handleLogout}
              tooltip="Sign Out"
              tooltipOptions={{ position: 'bottom' }}
              style={{
                backgroundColor: '#1a1a1a',
                color: '#ffffff',
                border: '1px solid #333333',
                padding: '0.5rem 1rem'
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}
