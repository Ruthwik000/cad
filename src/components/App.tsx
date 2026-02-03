// Portions of this file are Copyright 2021 Google LLC, and licensed under GPL2+. See COPYING.

import React, { CSSProperties, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import {MultiLayoutComponentId, State, StatePersister} from '../state/app-state'
import { Model } from '../state/model';
import EditorPanel from './EditorPanel';
import ViewerPanel from './ViewerPanel';
import Footer from './Footer';
import { ModelContext, FSContext } from './contexts';
import PanelSwitcher from './PanelSwitcher';
import { ConfirmDialog } from 'primereact/confirmdialog';
import CustomizerPanel from './CustomizerPanel';
import AIChatPanel from './AIChatPanel';
import LandingPage from './LandingPage';


// Editor Component (main workspace)
function EditorWorkspace({model, state, leftWidth, setLeftWidth, rightChatWidth, setRightChatWidth, rightEditorWidth, setRightEditorWidth, viewerHeight, setViewerHeight}: any) {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const [wasmReady, setWasmReady] = useState(false);

  // Preload WASM and worker files
  useEffect(() => {
    const preloadWasm = async () => {
      try {
        console.log('Starting WASM preload...');
        
        // Preload the WASM file
        const wasmResponse = await fetch('/openscad.wasm');
        if (wasmResponse.ok) {
          console.log('WASM file preloaded');
        }
        
        // Preload the worker
        const workerResponse = await fetch('/openscad-worker.js');
        if (workerResponse.ok) {
          console.log('Worker file preloaded');
        }
        
        // Wait longer for full initialization (WASM module needs time)
        setTimeout(() => {
          setWasmReady(true);
          console.log('WASM ready for rendering - triggering automatic render');
          
          // Automatically render after WASM is ready
          setTimeout(() => {
            if (model && model.source && model.source.trim()) {
              console.log('Auto-rendering model...');
              model.render({ isPreview: true, now: true });
            }
          }, 500);
        }, 5000); // Increased to 5 seconds
      } catch (error) {
        console.error('Error preloading WASM:', error);
        // Still set to true after delay even if preload fails
        setTimeout(() => setWasmReady(true), 5000);
      }
    };
    
    preloadWasm();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'F5') {
        event.preventDefault();
        model.render({isPreview: true, now: true})
      } else if (event.key === 'F6') {
        event.preventDefault();
        model.render({isPreview: false, now: true})
      } else if (event.key === 'F7') {
        event.preventDefault();
        model.export();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Load session if sessionId is provided
  useEffect(() => {
    if (sessionId) {
      localStorage.setItem('currentSessionId', sessionId);
    } else {
      // Clear session if no sessionId in URL (new chat)
      localStorage.removeItem('currentSessionId');
    }

    // Open AI chat if there's an initial prompt
    const initialPrompt = localStorage.getItem('initialPrompt');
    if (initialPrompt && !state.view.aiChatVisible) {
      model.toggleAIChat();
    }
  }, [sessionId]);

  // Resize handlers
  const handleLeftResize = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = leftWidth;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - startX;
      const newWidth = Math.max(200, Math.min(600, startWidth + delta));
      setLeftWidth(newWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const handleRightChatResize = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = rightChatWidth;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = startX - e.clientX;
      const newWidth = Math.max(300, Math.min(800, startWidth + delta));
      setRightChatWidth(newWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const handleRightEditorResize = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = rightEditorWidth;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = startX - e.clientX;
      const newWidth = Math.max(300, Math.min(1000, startWidth + delta));
      setRightEditorWidth(newWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const handleViewerResize = (e: React.MouseEvent) => {
    e.preventDefault();
    const container = (e.target as HTMLElement).parentElement;
    if (!container) return;
    
    const startY = e.clientY;
    const containerRect = container.getBoundingClientRect();
    const startHeight = viewerHeight;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientY - startY;
      const containerHeight = containerRect.height;
      const deltaPercent = (delta / containerHeight) * 100;
      const newHeight = Math.max(20, Math.min(80, startHeight + deltaPercent));
      setViewerHeight(newHeight);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      backgroundColor: '#000000'
    }}>
      {/* WASM Loading Indicator */}
      {!wasmReady && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          padding: '2rem',
          borderRadius: '12px',
          border: '1px solid #333',
          textAlign: 'center'
        }}>
          <div style={{ color: '#ffffff', fontSize: '1.2rem', marginBottom: '1rem' }}>
            Initializing 3D Engine...
          </div>
          <div style={{ color: '#666', fontSize: '0.9rem' }}>
            Loading OpenSCAD WASM module
          </div>
        </div>
      )}
      
      {/* Top Header */}
      <PanelSwitcher />

      {/* Main Content Area */}
      <div style={{
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
        backgroundColor: '#000000'
      }}>
        {/* Left Sidebar - Properties/Customizer */}
        <div style={{
          width: `${leftWidth}px`,
          borderRight: '1px solid #222222',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0a0a0a',
          position: 'relative'
        }}>
          <CustomizerPanel 
            className=""
            style={{ flex: 1, display: 'flex' }} 
          />
          {/* Left Resize Handle */}
          <div
            onMouseDown={handleLeftResize}
            style={{
              position: 'absolute',
              right: -4,
              top: 0,
              bottom: 0,
              width: '8px',
              cursor: 'col-resize',
              zIndex: 10,
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ffffff20'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          />
        </div>

        {/* Center Area - Viewer Only */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          backgroundColor: '#000000',
          position: 'relative'
        }}>
          {/* Full Height: 3D Preview */}
          <div style={{
            height: '100%',
            display: 'flex',
            backgroundColor: '#000000',
            position: 'relative'
          }}>
            <ViewerPanel 
              className=""
              style={{ flex: 1, display: 'flex' }} 
            />
          </div>
        </div>

        {/* Right Sidebar - Code Editor */}
        {state.view.codeEditorVisible && (
          <div style={{
            width: `${rightEditorWidth}px`,
            borderLeft: '1px solid #222222',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#0a0a0a',
            position: 'relative'
          }}>
            {/* Right Resize Handle */}
            <div
              onMouseDown={handleRightEditorResize}
              style={{
                position: 'absolute',
                left: -4,
                top: 0,
                bottom: 0,
                width: '8px',
                cursor: 'col-resize',
                zIndex: 10,
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ffffff20'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            />
            <EditorPanel 
              className=""
              style={{ flex: 1, display: 'flex' }} 
            />
          </div>
        )}

        {/* Right Sidebar - AI Chat */}
        {state.view.aiChatVisible && (
          <div style={{
            width: `${rightChatWidth}px`,
            borderLeft: '1px solid #222222',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#0a0a0a',
            position: 'relative'
          }}>
            {/* Right Resize Handle */}
            <div
              onMouseDown={handleRightChatResize}
              style={{
                position: 'absolute',
                left: -4,
                top: 0,
                bottom: 0,
                width: '8px',
                cursor: 'col-resize',
                zIndex: 10,
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ffffff20'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            />
            <AIChatPanel 
              visible={true} 
              onClose={() => model.toggleAIChat()}
              initialPrompt={null}
            />
          </div>
        )}

      </div>

      {/* Bottom Footer */}
      <Footer />
      <ConfirmDialog />
    </div>
  );
}

// Landing Page Wrapper
function LandingPageWrapper() {
  const navigate = useNavigate();

  const handleStartProject = (prompt: string, sessionId?: string) => {
    if (sessionId) {
      // Force a full page reload to ensure OpenSCAD initializes properly
      window.location.href = `/${sessionId}`;
    } else {
      // Create a temporary ID for new sessions
      window.location.href = '/new';
    }
  };

  return <LandingPage onStartProject={handleStartProject} />;
}

export function App({initialState, statePersister, fs}: {initialState: State, statePersister: StatePersister, fs: FS}) {
  const [state, setState] = useState(initialState);
  const [leftWidth, setLeftWidth] = useState(300);
  const [rightChatWidth, setRightChatWidth] = useState(400);
  const [rightEditorWidth, setRightEditorWidth] = useState(500);
  const [viewerHeight, setViewerHeight] = useState(50); // percentage
  
  const model = new Model(fs, state, setState, statePersister);
  
  useEffect(() => model.init(), []);

  return (
    <Router>
      <ModelContext.Provider value={model}>
        <FSContext.Provider value={fs}>
          <Routes>
            <Route path="/" element={<LandingPageWrapper />} />
            <Route path="/:sessionId" element={
              <EditorWorkspace 
                model={model}
                state={state}
                leftWidth={leftWidth}
                setLeftWidth={setLeftWidth}
                rightChatWidth={rightChatWidth}
                setRightChatWidth={setRightChatWidth}
                rightEditorWidth={rightEditorWidth}
                setRightEditorWidth={setRightEditorWidth}
                viewerHeight={viewerHeight}
                setViewerHeight={setViewerHeight}
              />
            } />
          </Routes>
        </FSContext.Provider>
      </ModelContext.Provider>
    </Router>
  );
}
