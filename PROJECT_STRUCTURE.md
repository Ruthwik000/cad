# Venus CAD - Project Structure

## 📁 Directory Structure

```
venus-cad/
├── public/                          # Static assets
│   ├── index.html                   # Main HTML template
│   ├── manifest.json                # PWA manifest
│   ├── favicon.ico                  # App icon
│   ├── logo192.png                  # PWA icon (192x192)
│   ├── logo512.png                  # PWA icon (512x512)
│   ├── complete.wav                 # Notification sound
│   ├── axes.glb                     # 3D axis helper
│   ├── skybox-lights.jpg            # 3D environment lighting
│   ├── browserfs.min.js             # BrowserFS library
│   ├── model-viewer.min.js          # 3D viewer library
│   ├── openscad.js                  # OpenSCAD WASM wrapper
│   ├── openscad.wasm                # OpenSCAD compiler
│   ├── fonts/                       # Font files
│   │   └── InterVariable.woff2      # Inter font
│   └── libraries/                   # OpenSCAD libraries (ZIP)
│       ├── BOSL2.zip                # Belfry OpenSCAD Library
│       ├── MCAD.zip                 # Parametric CAD library
│       ├── NopSCADlib.zip           # Hardware library
│       └── [20+ more libraries]
│
├── src/                             # Source code
│   ├── components/                  # React components
│   │   ├── App.tsx                  # Main app container
│   │   ├── LandingPage.tsx          # Landing page with auth
│   │   ├── PanelSwitcher.tsx        # Top header navigation
│   │   ├── EditorPanel.tsx          # Code editor panel
│   │   ├── ViewerPanel.tsx          # 3D viewer panel
│   │   ├── CustomizerPanel.tsx      # Parameters panel
│   │   ├── AIChatPanel.tsx          # AI assistant chat
│   │   ├── ChatsPanel.tsx           # Session management
│   │   ├── SessionsSidebar.tsx      # Sessions sidebar
│   │   ├── Footer.tsx               # Bottom toolbar
│   │   ├── ExportButton.tsx         # Export functionality
│   │   ├── FilePicker.tsx           # File selection
│   │   ├── HelpMenu.tsx             # Help dialog
│   │   ├── SettingsMenu.tsx         # Settings dialog
│   │   ├── AuthDialog.tsx           # Login/signup modal
│   │   ├── FlowFieldBackground.tsx  # Animated background
│   │   ├── MultimaterialColorsDialog.tsx  # Color picker
│   │   └── contexts.ts              # React contexts
│   │
│   ├── firebase/                    # Firebase integration
│   │   ├── config.ts                # Firebase initialization
│   │   ├── auth.ts                  # Authentication functions
│   │   └── firestore.ts             # Database operations
│   │
│   ├── contexts/                    # React contexts
│   │   └── AuthContext.tsx          # Auth state management
│   │
│   ├── state/                       # State management
│   │   ├── app-state.ts             # App state types
│   │   ├── app-state-future.ts      # Future state features
│   │   ├── model.ts                 # Model class
│   │   ├── initial-state.ts         # Default state
│   │   ├── fragment-state.ts        # URL state sync
│   │   ├── customizer-types.ts      # Customizer types
│   │   ├── formats.ts               # Export formats
│   │   ├── default-scad.ts          # Default code
│   │   └── deep-mutate.ts           # State mutation helpers
│   │
│   ├── runner/                      # OpenSCAD execution
│   │   ├── openscad-runner.ts       # Main runner
│   │   ├── openscad-worker.ts       # Web worker
│   │   ├── actions.ts               # Runner actions
│   │   └── output-parser.ts         # Parse OpenSCAD output
│   │
│   ├── language/                    # Monaco Editor language
│   │   ├── openscad-language.ts     # Language definition
│   │   ├── openscad-builtins.ts     # Built-in functions
│   │   ├── openscad-completions.ts  # Auto-completion
│   │   ├── openscad-pseudoparser.ts # Syntax parser
│   │   ├── openscad-editor-options.ts  # Editor config
│   │   └── openscad-register-language.ts  # Register with Monaco
│   │
│   ├── fs/                          # File system
│   │   ├── filesystem.ts            # BrowserFS setup
│   │   ├── zip-archives.ts          # ZIP handling
│   │   └── BrowserFS.d.ts           # TypeScript definitions
│   │
│   ├── io/                          # Import/Export
│   │   ├── common.ts                # Common utilities
│   │   ├── export_3mf.ts            # 3MF export
│   │   ├── export_glb.ts            # GLB export
│   │   ├── import_off.ts            # OFF import
│   │   └── image_hashes.ts          # Image processing
│   │
│   ├── wasm/                        # WebAssembly files
│   │   ├── openscad.js              # WASM wrapper
│   │   └── openscad.wasm            # Compiled OpenSCAD
│   │
│   ├── index.tsx                    # App entry point
│   ├── index.css                    # Global styles
│   └── utils.ts                     # Utility functions
│
├── examples/                        # Example files
│   ├── cv-control-demo.scad         # Hand control demo
│   └── fonts.scad                   # Font examples
│
├── tests/                           # Test files
│   └── e2e.test.js                  # End-to-end tests
│
├── libs/                            # Pre-built libraries
│   ├── openscad-wasm/               # OpenSCAD WASM build
│   └── openscad-wasm.zip            # Packaged WASM
│
├── .github/                         # GitHub configuration
│   └── workflows/                   # CI/CD workflows
│
├── node_modules/                    # Dependencies (gitignored)
│
├── .env                             # Environment variables (gitignored)
├── .env.example                     # Environment template
├── .gitignore                       # Git ignore rules
├── package.json                     # NPM dependencies
├── package-lock.json                # Dependency lock file
├── tsconfig.json                    # TypeScript config
├── webpack.config.js                # Webpack main config
├── webpack.libs.config.js           # Webpack libs config
├── webpack-libs-plugin.js           # Custom Webpack plugin
├── jest.config.js                   # Jest test config
├── jest-puppeteer.config.js         # Puppeteer config
├── fonts.conf                       # Font configuration
├── axes.scad                        # 3D axes generator
├── build-libs-windows.js            # Build script (Windows)
├── create-all-empty-zips.js         # ZIP creation script
├── create-empty-zip.js              # Single ZIP script
├── libs-config.json                 # Libraries configuration
│
├── LICENSE.md                       # Main license
├── LICENSE.monaco                   # Monaco Editor license
├── LICENSE.viewstl                  # ViewSTL license
├── README.md                        # Project documentation
│
└── Documentation/                   # Additional docs
    ├── TECH_STACK.md                # Technology overview
    ├── PROJECT_STRUCTURE.md         # This file
    ├── FIREBASE_SETUP.md            # Firebase setup guide
    ├── FIREBASE_QUICK_SETUP.md      # Quick Firebase guide
    ├── AUTHENTICATION_COMPLETE.md   # Auth implementation
    ├── COLLABORATIVE_FEATURES.md    # Collaboration features
    ├── FIX_AUTH_ISSUE.md            # Auth troubleshooting
    ├── SETUP_CHECKLIST.md           # Setup checklist
    ├── firestore.rules              # Firestore security rules
    └── FIRESTORE_RULES_COPY_PASTE.txt  # Rules template
```

---

## 🎯 Key Directories Explained

### `/public` - Static Assets
**Purpose**: Files served directly by the web server
- **HTML**: Main app template
- **PWA**: Manifest and icons for installable app
- **3D Assets**: GLB models, environment maps
- **Libraries**: OpenSCAD library archives (20+ libraries)
- **WASM**: OpenSCAD compiler binaries

### `/src/components` - React Components
**Purpose**: All UI components
- **Layout**: App, PanelSwitcher, Footer
- **Panels**: Editor, Viewer, Customizer, AI Chat
- **Dialogs**: Auth, Settings, Help, Export
- **Special**: FlowFieldBackground (animated canvas)

### `/src/firebase` - Backend Integration
**Purpose**: Firebase services
- **config.ts**: Initialize Firebase with credentials
- **auth.ts**: Google OAuth, Email/Password auth
- **firestore.ts**: Database CRUD operations

### `/src/contexts` - React Context
**Purpose**: Global state management
- **AuthContext**: User authentication state
- **ModelContext**: 3D model and app state
- **FSContext**: File system state

### `/src/state` - State Management
**Purpose**: Application state logic
- **app-state.ts**: State type definitions
- **model.ts**: Main model class with business logic
- **initial-state.ts**: Default app state
- **fragment-state.ts**: URL-based state persistence

### `/src/runner` - OpenSCAD Execution
**Purpose**: Compile OpenSCAD code
- **openscad-runner.ts**: Main execution logic
- **openscad-worker.ts**: Web Worker for background compilation
- **output-parser.ts**: Parse compiler output and errors

### `/src/language` - Monaco Editor
**Purpose**: OpenSCAD language support
- **openscad-language.ts**: Syntax highlighting rules
- **openscad-builtins.ts**: Built-in functions list
- **openscad-completions.ts**: Auto-completion logic

### `/src/fs` - File System
**Purpose**: Browser-based file system
- **filesystem.ts**: BrowserFS initialization
- **zip-archives.ts**: Library archive handling

### `/src/io` - Import/Export
**Purpose**: File format conversion
- **export_3mf.ts**: 3MF format export
- **export_glb.ts**: GLB format export
- **import_off.ts**: OFF format import

---

## 📦 Build Output Structure

```
dist/                                # Production build
├── index.html                       # Main HTML
├── index.js                         # Bundled JavaScript
├── index.css                        # Bundled CSS
├── sw.js                            # Service Worker
├── assets/                          # Static assets
│   ├── fonts/
│   ├── images/
│   └── libraries/
└── wasm/                            # WebAssembly files
    ├── openscad.js
    └── openscad.wasm
```

---

## 🔧 Configuration Files

### `package.json`
- Dependencies and versions
- NPM scripts (start, build, test)
- Project metadata

### `tsconfig.json`
- TypeScript compiler options
- Module resolution
- Type checking rules

### `webpack.config.js`
- Entry points
- Output configuration
- Loaders (TypeScript, CSS)
- Plugins (Copy, Workbox)
- Dev server settings

### `jest.config.js`
- Test environment
- Test patterns
- Coverage settings

### `.env`
- Firebase credentials
- API keys (Gemini, Groq)
- Build-time variables

---

## 🚀 Entry Points

### Main Entry: `src/index.tsx`
```typescript
1. Load BrowserFS
2. Initialize file system
3. Register OpenSCAD language
4. Load persisted state
5. Render React app
6. Register service worker
```

### Worker Entry: `src/runner/openscad-worker.ts`
```typescript
1. Load OpenSCAD WASM
2. Initialize file system
3. Listen for compile requests
4. Execute OpenSCAD
5. Return results
```

---

## 📊 Data Flow

### User Input → 3D Model
```
1. User types in Monaco Editor
2. Code saved to state
3. User clicks "Render"
4. Code sent to Web Worker
5. OpenSCAD WASM compiles
6. OFF/STL output generated
7. Convert to GLB format
8. Display in model-viewer
9. Save to Firebase (if logged in)
```

### AI Generation → 3D Model
```
1. User enters prompt in AI Chat
2. Send to Gemini API
3. Receive OpenSCAD code
4. Insert into Monaco Editor
5. Auto-render (optional)
6. Display in viewer
7. Save session to Firebase
```

---

## 🗄️ Storage Locations

### Browser Storage
- **IndexedDB**: BrowserFS files, library cache
- **LocalStorage**: User preferences, current session ID
- **SessionStorage**: Temporary state

### Firebase Storage
- **Firestore**: User profiles, chat sessions, model code
- **Authentication**: User tokens, session data

### Memory
- **React State**: UI state, temporary data
- **Web Worker**: Compilation cache

---

## 🔐 Security Boundaries

### Client-Side
- User input validation
- XSS prevention
- CSRF protection
- Secure API key storage

### Firebase
- Authentication required
- Firestore security rules
- User-based access control
- Rate limiting

### API
- API key rotation
- Request validation
- Error handling
- Rate limiting

---

## 🎨 Styling Architecture

### Global Styles (`index.css`)
- CSS reset
- Dark theme variables
- Font imports
- Base styles

### Component Styles
- Inline styles (React)
- PrimeReact theme overrides
- Custom animations
- Responsive breakpoints

### Theme Colors
```css
--background: #000000
--surface: #0a0a0a
--surface-light: #141414
--border: #222222
--border-light: #333333
--text: #ffffff
--text-secondary: #9ca3af
--text-muted: #666666
--accent: #3b82f6
--accent-light: #818cf8
```

---

## 🧩 Component Hierarchy

```
App
├── AuthProvider (Context)
│   ├── LandingPage (if not started)
│   │   ├── FlowFieldBackground
│   │   ├── AuthDialog
│   │   └── SessionsList (if logged in)
│   │
│   └── Main App (if started)
│       ├── PanelSwitcher (Header)
│       │   ├── Back Button
│       │   ├── Chats Button
│       │   ├── Copy Link Button
│       │   ├── Code Toggle
│       │   ├── AI Assistant Toggle
│       │   └── Logout Button
│       │
│       ├── CustomizerPanel (Left)
│       │   └── Parameter Controls
│       │
│       ├── ViewerPanel (Center)
│       │   ├── model-viewer
│       │   └── CVControlPanel (overlay)
│       │
│       ├── EditorPanel (Right, optional)
│       │   └── Monaco Editor
│       │
│       ├── AIChatPanel (Right, optional)
│       │   ├── Message List
│       │   ├── Input Area
│       │   └── Image Upload
│       │
│       ├── ChatsPanel (Left, optional)
│       │   ├── New Chat Button
│       │   ├── Search
│       │   └── Session List
│       │
│       └── Footer (Bottom)
│           ├── Render Button
│           ├── Import Button
│           ├── Export Button
│           └── Status Display
```

---

## 📝 Naming Conventions

### Files
- **Components**: PascalCase (e.g., `EditorPanel.tsx`)
- **Utilities**: camelCase (e.g., `filesystem.ts`)
- **Types**: PascalCase (e.g., `app-state.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `DEFAULT_CODE`)

### Variables
- **React Components**: PascalCase
- **Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Private**: _prefixed

### CSS
- **Classes**: kebab-case
- **IDs**: camelCase
- **Custom Properties**: --kebab-case

---

## 🔄 State Management Pattern

### Local State (useState)
```typescript
const [value, setValue] = useState(initial);
```
**Use for**: Component-specific UI state

### Context State (useContext)
```typescript
const { user } = useAuth();
const model = useContext(ModelContext);
```
**Use for**: Shared state across components

### Remote State (Firebase)
```typescript
const sessions = await getUserSessions(userId);
```
**Use for**: Persistent data, multi-device sync

---

## 🚦 Development Workflow

1. **Start Dev Server**: `npm start`
2. **Edit Code**: Make changes in `/src`
3. **Hot Reload**: Browser updates automatically
4. **Test**: `npm run test:e2e`
5. **Build**: `npm run build`
6. **Deploy**: Upload `/dist` to hosting

---

## 📚 Key Files to Know

### Must Understand
- `src/index.tsx` - App entry point
- `src/components/App.tsx` - Main container
- `src/state/model.ts` - Business logic
- `src/runner/openscad-runner.ts` - Compilation
- `src/firebase/firestore.ts` - Database ops

### Configuration
- `webpack.config.js` - Build config
- `tsconfig.json` - TypeScript config
- `package.json` - Dependencies
- `.env` - Environment variables

### Documentation
- `README.md` - Project overview
- `TECH_STACK.md` - Technology details
- `FIREBASE_SETUP.md` - Backend setup

---

**Last Updated**: 2026-02-03
**Maintained By**: Venus CAD Team
