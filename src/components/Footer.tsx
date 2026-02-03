// Portions of this file are Copyright 2021 Google LLC, and licensed under GPL2+. See COPYING.

import { CSSProperties, useContext, useRef } from 'react';
import { ModelContext, FSContext } from './contexts.ts';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Badge } from 'primereact/badge';
import { Toast } from 'primereact/toast';
import ExportButton from './ExportButton.tsx';
import SettingsMenu from './SettingsMenu.tsx';
import MultimaterialColorsDialog from './MultimaterialColorsDialog.tsx';


export default function Footer({style}: {style?: CSSProperties}) {
  const model = useContext(ModelContext);
  const fs = useContext(FSContext);
  if (!model) throw new Error('No model');
  if (!fs) throw new Error('No filesystem');
  const state = model.state;
  
  const toast = useRef<Toast>(null);

  const severityByMarkerSeverity = new Map<monaco.MarkerSeverity, 'danger' | 'warning' | 'info'>([
    [monaco.MarkerSeverity.Error, 'danger'],
    [monaco.MarkerSeverity.Warning, 'warning'],
    [monaco.MarkerSeverity.Info, 'info'],
  ]);
  const markers = state.lastCheckerRun?.markers ?? [];
  const getBadge = (s: monaco.MarkerSeverity) => {
    const count = markers.filter(m => m.severity == s).length;
    const sev = s == monaco.MarkerSeverity.Error ? 'danger'
      : s == monaco.MarkerSeverity.Warning ? 'warning'
      : s == monaco.MarkerSeverity.Info ? 'info'
      : 'success';
    return <>{count > 0 && <Badge value={count} severity={severityByMarkerSeverity.get(s)}></Badge>}</>;
  };


  const maxMarkerSeverity = markers.length == 0 ? undefined : markers.map(m => m.severity).reduce((a, b) => Math.max(a, b));
  
  return <>
    <ProgressBar mode="indeterminate"
                style={{
                  marginLeft: '5px',
                  marginRight: '5px',
                    visibility: state.rendering || state.previewing || state.checkingSyntax || state.exporting
                      ? 'visible' : 'hidden',
                    height: '6px' }}></ProgressBar>
      
    <div className="flex flex-row gap-1" style={{
        alignItems: 'center',
        margin: '5px',
        ...(style ?? {})
    }}>
      {/* Import Button - Always visible */}
      <Button
        icon="pi pi-upload"
        onClick={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = '.scad,.stl,.obj,.off,.3mf,.glb,.gltf,.dxf,.svg';
          input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
              try {
                const path = `/${file.name}`;
                const isTextFile = file.name.endsWith('.scad') || file.name.endsWith('.dxf') || file.name.endsWith('.svg');
                
                // Get BrowserFS Buffer
                const Buffer = (window as any).BrowserFS.BFSRequire('buffer').Buffer;
                
                if (isTextFile) {
                  // Handle text files (SCAD, DXF, SVG) - store content directly
                  const text = await file.text();
                  const buffer = Buffer.from(text, 'utf8');
                  fs.writeFile(path, buffer);
                  
                  // Use openFile for text files (it will read and add to sources)
                  model.openFile(path);
                } else {
                  // Handle binary files (STL, OBJ, OFF, 3MF, GLB, GLTF) - use blob URL
                  const arrayBuffer = await file.arrayBuffer();
                  const buffer = Buffer.from(arrayBuffer);
                  fs.writeFile(path, buffer);
                  
                  // Create blob URL for binary files (don't store content in state)
                  const blob = new Blob([arrayBuffer]);
                  const blobUrl = URL.createObjectURL(blob);
                  
                  // Manually update state for binary files to avoid reading content
                  model.mutate(s => {
                    // Remove source of previous active path if it's unmodified
                    const readSource = (p: string) => {
                      try {
                        return new TextDecoder("utf-8").decode(fs.readFileSync(p));
                      } catch (e) {
                        return '';
                      }
                    };
                    const activePathContent = readSource(s.params.activePath);
                    s.params.sources = s.params.sources.filter(src => src.path !== s.params.activePath || src.content != activePathContent);
                    
                    // Set new active path and add source with URL (not content)
                    s.params.activePath = path;
                    if (!s.params.sources.find(src => src.path === path)) {
                      s.params.sources = [...s.params.sources, { path, url: blobUrl }];
                    }
                    
                    // Reset render state
                    s.lastCheckerRun = undefined;
                    s.output = undefined;
                    s.export = undefined;
                    s.preview = undefined;
                    s.currentRunLogs = undefined;
                    s.error = undefined;
                    s.is2D = undefined;
                  });
                  
                  // Trigger render for binary files
                  model.render({isPreview: true, now: false});
                }
                
                toast.current?.show({severity: 'success', summary: 'Imported', detail: `${file.name} imported successfully`});
              } catch (error) {
                console.error('Import error:', error);
                toast.current?.show({severity: 'error', summary: 'Import Failed', detail: `${error}`});
              }
            }
          };
          input.click();
        }}
        className="p-button-sm p-button-secondary"
        label="Import"
        tooltip="Import file (SCAD, STL, OBJ, OFF, 3MF, GLB, DXF, SVG)"
        tooltipOptions={{ position: 'top' }}
      />

      {/* Export Button - Always visible */}
      <ExportButton />

      {state.previewing ? (
          <Button
            icon="pi pi-bolt"
            disabled
            className="p-button-sm"
            label="Previewing..."
            />
        ) : state.output && state.output.isPreview ? (
            <Button
              icon="pi pi-bolt"
              onClick={() => model.render({isPreview: false, now: true})}
              className="p-button-sm"
              disabled={state.rendering}
              label={state.rendering ? 'Rendering...' : 'Render'}
              />
        ) : undefined
      }
      <MultimaterialColorsDialog />
      {/* <Button
        icon="pi pi-bolt"
        onClick={() => model.render({isPreview: false, now: true})}
        className="p-button-sm"
        label="Render"
        />

      <ExportButton /> */}
      
      {(state.lastCheckerRun || state.output) &&
        <Button type="button"
            severity={maxMarkerSeverity && severityByMarkerSeverity.get(maxMarkerSeverity)}
            icon="pi pi-align-left"
            text={!state.view.logs}
            onClick={() => model.logsVisible = !state.view.logs}
            className={maxMarkerSeverity && `p-button-${severityByMarkerSeverity.get(maxMarkerSeverity) ?? 'success'}`}
            >
          {getBadge(monaco.MarkerSeverity.Error)}
          {getBadge(monaco.MarkerSeverity.Warning)}
          {getBadge(monaco.MarkerSeverity.Info)}
        </Button>}

      <div style={{flex: 1}}></div>

      <SettingsMenu />

      <Toast ref={toast} />
    </div>
  </>
}
