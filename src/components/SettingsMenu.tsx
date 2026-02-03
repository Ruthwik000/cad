// Portions of this file are Copyright 2021 Google LLC, and licensed under GPL2+. See COPYING.

import { CSSProperties, useContext, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { MenuItem } from 'primereact/menuitem';
import { Menu } from 'primereact/menu';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { ModelContext } from './contexts.ts';
import { isInStandaloneMode } from '../utils.ts';
import { confirmDialog } from 'primereact/confirmdialog';

export default function SettingsMenu({className, style}: {className?: string, style?: CSSProperties}) {
  const model = useContext(ModelContext);
  if (!model) throw new Error('No model');
  const state = model.state;

  const settingsMenu = useRef<Menu>(null);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  const handleOpenApiKeyDialog = () => {
    const savedKey = localStorage.getItem('gemini_api_key') || '';
    setApiKey(savedKey);
    setShowApiKeyDialog(true);
  };

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey.trim());
      setShowApiKeyDialog(false);
      setShowKey(false);
    }
  };

  const handleRemoveApiKey = () => {
    confirmDialog({
      message: 'Are you sure you want to remove your API key? You will need to enter it again to use AI features.',
      header: 'Remove API Key',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        localStorage.removeItem('gemini_api_key');
        setApiKey('');
        setShowApiKeyDialog(false);
      },
      acceptLabel: 'Remove',
      rejectLabel: 'Cancel'
    });
  };
  return (
    <>
      <Menu model={[
        {
          label: 'Manage AI API Key',
          icon: 'pi pi-key',
          command: handleOpenApiKeyDialog
        },
        {
          separator: true
        },
        {
          label: state.view.layout.mode === 'multi'
            ? 'Switch to single panel mode'
            : "Switch to side-by-side mode",
          icon: 'pi pi-table',
          // disabled: true,
          command: () => model.changeLayout(state.view.layout.mode === 'multi' ? 'single' : 'multi'),
        },
        {
          separator: true
        },  
        {
          label: state.view.showAxes ? 'Hide axes' : 'Show axes',
          icon: 'pi pi-asterisk',
          // disabled: true,
          command: () => model.mutate(s => s.view.showAxes = !s.view.showAxes)
        },
        {
          label: state.view.lineNumbers ? 'Hide line numbers' : 'Show line numbers',
          icon: 'pi pi-list',
          // disabled: true,
          command: () => model.mutate(s => s.view.lineNumbers = !s.view.lineNumbers)
        },
        ...(isInStandaloneMode() ? [
          {
            separator: true
          },  
          {
            label: 'Clear local storage',
            icon: 'pi pi-list',
            // disabled: true,
            command: () => {
              confirmDialog({
                message: "This will clear all the edits you've made and files you've created in this playground " +
                  "and will reset it to factory defaults. " +
                  "Are you sure you wish to proceed? (you might lose your models!)",
                header: 'Clear local storage',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                  localStorage.clear();
                  location.reload();
                },
                acceptLabel: `Clear all files!`,
                rejectLabel: 'Cancel'
              });
            },
          },
        ] : []),
      ] as MenuItem[]} popup ref={settingsMenu} />

      <Dialog
        header="Manage AI API Key"
        visible={showApiKeyDialog}
        onHide={() => {
          setShowApiKeyDialog(false);
          setShowKey(false);
        }}
        style={{ width: '500px' }}
        modal
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ margin: 0, color: '#666666', fontSize: '0.9rem' }}>
            Enter your Gemini API key to use AI features. Your key is stored locally in your browser.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>API Key</label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <InputText
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Gemini API key"
                type={showKey ? 'text' : 'password'}
                style={{ flex: 1 }}
              />
              <Button
                icon={showKey ? 'pi pi-eye-slash' : 'pi pi-eye'}
                onClick={() => setShowKey(!showKey)}
                text
                tooltip={showKey ? 'Hide key' : 'Show key'}
              />
            </div>
          </div>

          <div style={{ 
            padding: '0.75rem', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '6px',
            fontSize: '0.85rem',
            color: '#495057'
          }}>
            <strong>Get your API key:</strong>
            <br />
            Visit{' '}
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#3b82f6' }}
            >
              Google AI Studio
            </a>
            {' '}to create a free API key.
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
            {apiKey && (
              <Button
                label="Remove Key"
                icon="pi pi-trash"
                onClick={handleRemoveApiKey}
                severity="danger"
                outlined
              />
            )}
            <Button
              label="Cancel"
              onClick={() => {
                setShowApiKeyDialog(false);
                setShowKey(false);
              }}
              outlined
            />
            <Button
              label="Save"
              icon="pi pi-check"
              onClick={handleSaveApiKey}
              disabled={!apiKey.trim()}
            />
          </div>
        </div>
      </Dialog>
    
      <Button title="Settings menu"
          style={style}
          className={className}
          rounded
          text
          icon="pi pi-cog"
          onClick={(e) => settingsMenu.current && settingsMenu.current.toggle(e)} />
    </>
  );
}