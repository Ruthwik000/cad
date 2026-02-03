# Venus CAD - Tech Stack Overview

## 🏗️ Architecture Overview

Venus CAD is a modern web-based 3D CAD application that combines AI-powered model generation with real-time 3D visualization, collaborative features, and hand gesture control.

---

## 📦 Frontend Application

### **React 18.3.1**
- **Purpose**: Core UI framework
- **Usage**: 
  - Component-based architecture for all UI elements
  - Hooks for state management (useState, useEffect, useContext)
  - Context API for global state (Auth, Model, FS)
- **Key Components**:
  - `App.tsx` - Main application container
  - `LandingPage.tsx` - Landing page with auth
  - `EditorPanel.tsx` - Code editor interface
  - `ViewerPanel.tsx` - 3D model viewer
  - `AIChatPanel.tsx` - AI assistant chat
  - `ChatsPanel.tsx` - Session management

### **TypeScript 5.9.2**
- **Purpose**: Type-safe JavaScript
- **Usage**:
  - Strong typing for all components and functions
  - Interface definitions for data structures
  - Type safety for Firebase operations
  - Better IDE support and error catching
- **Key Types**:
  - `Session`, `ChatMessage`, `UserProfile` (Firestore)
  - `State`, `Model` (App state)
  - Component props interfaces

---

## 🎨 UI & Design System

### **PrimeReact 10.8.5**
- **Purpose**: React UI component library
- **Usage**:
  - `Button` - All interactive buttons
  - `InputTextarea` - Text input for prompts
  - `Dialog` - Modal dialogs (Auth, Settings)
  - `ToggleButton` - Code/AI Assistant toggles
  - `ProgressSpinner` - Loading indicators
  - `Toast` - Notifications (copy link, errors)
  - `ConfirmDialog` - Confirmation prompts
- **Styling**: Custom dark theme matching editor aesthetic

### **PrimeIcons 7.0.0**
- **Purpose**: Icon library
- **Usage**:
  - `pi-sparkles` - AI features
  - `pi-code` - Code editor
  - `pi-comments` - Chat sessions
  - `pi-link` - Share links
  - `pi-sign-out` - Logout
  - `pi-bars` - Sidebar toggle
  - `pi-arrow-left` - Back navigation

### **PrimeFlex 3.3.1**
- **Purpose**: CSS utility library
- **Usage**: Responsive layouts and spacing utilities

---

## 🎮 3D Rendering & Visualization

### **model-viewer**
- **Purpose**: 3D model display component
- **Usage**:
  - Renders GLB/GLTF 3D models
  - Interactive camera controls (orbit, pan, zoom)
  - Lighting and environment setup
  - AR support for mobile devices
- **Features**:
  - Auto-rotate
  - Camera controls
  - Shadow rendering
  - Environment lighting

### **GLTF/3D Model Processing**
- **@gltf-transform/core 4.1.1**
- **@gltf-transform/extensions 4.1.1**
- **Purpose**: 3D model manipulation
- **Usage**:
  - Convert OpenSCAD output to GLB
  - Optimize 3D models
  - Add materials and textures
  - Export in multiple formats (STL, GLB, 3MF)

---

## 💻 Code Editor

### **Monaco Editor 0.52.2**
- **Purpose**: VS Code-powered code editor
- **Usage**:
  - OpenSCAD code editing
  - Syntax highlighting
  - Auto-completion
  - Error detection
  - Custom language support
- **Integration**:
  - `@monaco-editor/react 4.6.0` - React wrapper
  - `@monaco-editor/loader 1.4.0` - Dynamic loading
- **Features**:
  - Custom OpenSCAD language definition
  - Built-in functions and modules
  - Code completion for OpenSCAD
  - Dark theme integration

---

## 🗄️ Browser File System

### **BrowserFS**
- **Purpose**: In-browser file system
- **Usage**:
  - Store OpenSCAD files locally
  - Manage library files
  - Cache 3D models
  - Persistent storage in IndexedDB
- **Features**:
  - Virtual file system
  - ZIP archive support
  - Library management
  - File persistence

### **JSZip 3.10.1**
- **Purpose**: ZIP file handling
- **Usage**:
  - Extract library archives
  - Package multiple files
  - Import/export projects
  - Handle font libraries

---

## 🔥 Authentication & Storage

### **Firebase**
- **firebase 10.x** (latest)

#### **Firebase Authentication**
- **Purpose**: User authentication
- **Usage**:
  - Google OAuth sign-in
  - Email/Password authentication
  - Session management
  - User profile creation
- **Implementation**:
  - `src/firebase/auth.ts` - Auth functions
  - `src/contexts/AuthContext.tsx` - React context
  - Automatic token refresh
  - Secure session handling

#### **Cloud Firestore**
- **Purpose**: NoSQL database
- **Usage**:
  - Store user profiles
  - Save chat sessions
  - Store 3D model code
  - Collaborative session sharing
- **Collections**:
  ```
  users/{userId}
    - uid, email, displayName, photoURL
    - createdAt, lastLogin
  
  sessions/{sessionId}
    - userId, title, isShared
    - messages[], modelCode
    - createdAt, updatedAt
  ```
- **Security Rules**:
  - User-based access control
  - Collaborative sharing support
  - Owner-only delete permissions

#### **Firebase Analytics**
- **Purpose**: Usage tracking
- **Usage**: Track user interactions and feature usage

---

## 🤖 AI Integration

### **Google Gemini API**
- **Model**: gemini-3-flash-preview
- **Purpose**: AI-powered 3D model generation
- **Usage**:
  - Natural language to OpenSCAD code
  - Code modification and refinement
  - Image-to-3D model conversion
  - Contextual code suggestions
- **Features**:
  - Multi-modal input (text + images)
  - Conversation history
  - Code-only output mode
  - Temperature control for creativity

### **Groq API** (Optional)
- **Purpose**: Alternative AI provider
- **Usage**: Fallback for text-only generation

---

## 📹 Computer Vision

### **TensorFlow.js**
- **@tensorflow/tfjs**
- **@tensorflow-models/hand-pose-detection**
- **Purpose**: Hand gesture recognition
- **Usage**:
  - Real-time hand tracking via webcam
  - Gesture recognition (5 gestures):
    - Point (index up) - Hover mode
    - Pinch (thumb+index) - Grab/rotate
    - Open hand - Pan view
    - Closed fist - Orbit camera
    - Two hands - Zoom in/out
- **Features**:
  - MediaPipe Hands model
  - Real-time skeleton drawing
  - Gesture-based 3D controls
  - Camera feed overlay

---

## 🛠️ Development Tools

### **Webpack 5.97.1**
- **Purpose**: Module bundler
- **Usage**:
  - Bundle React application
  - Code splitting
  - Asset optimization
  - Development server
- **Plugins**:
  - `copy-webpack-plugin` - Copy static assets
  - `workbox-webpack-plugin` - Service worker

### **TypeScript Compiler**
- **ts-loader 9.5.1**
- **Purpose**: Compile TypeScript to JavaScript
- **Usage**: Type checking and transpilation

### **Webpack Dev Server 5.2.0**
- **Purpose**: Development server
- **Usage**:
  - Hot module replacement
  - Live reload
  - Proxy API requests
  - HTTPS support

---

## 🎨 Styling & Animation

### **Custom CSS**
- **Purpose**: Component styling
- **Usage**:
  - Dark theme (#000000, #0a0a0a, #141414)
  - Inline styles for components
  - CSS animations (fadeInUp, pulse)
  - Responsive layouts

### **Flow Field Background**
- **Purpose**: Animated particle background
- **Usage**:
  - Canvas-based particle system
  - Mathematical flow fields
  - Mouse interaction
  - Performance-optimized rendering

---

## 🔧 Build & Deployment

### **Service Worker**
- **Purpose**: Offline support and caching
- **Usage**:
  - Cache static assets
  - Offline functionality
  - Progressive Web App (PWA)
  - Background sync

### **Environment Variables**
- **dotenv 17.2.3**
- **Purpose**: Configuration management
- **Usage**:
  - Firebase credentials
  - API keys (Gemini, Groq)
  - Build-time configuration

---

## 📊 Data Flow Architecture

```
User Input (Landing Page)
    ↓
AI Chat Panel (Gemini API)
    ↓
OpenSCAD Code Generation
    ↓
Monaco Editor (Code Display)
    ↓
OpenSCAD WASM Compiler
    ↓
3D Model Output (OFF/STL)
    ↓
GLTF Transform (Convert to GLB)
    ↓
Model Viewer (3D Display)
    ↓
Firebase (Save Session)
```

---

## 🔐 Security Features

### **Firebase Security Rules**
- User-based access control
- Session ownership validation
- Collaborative sharing permissions
- Read/write restrictions

### **Authentication**
- Secure OAuth flow
- Token-based sessions
- Automatic token refresh
- HTTPS-only connections

### **Data Privacy**
- Client-side encryption
- Secure API key storage
- Environment variable protection
- No sensitive data in code

---

## 🚀 Performance Optimizations

### **Code Splitting**
- Lazy loading components
- Dynamic imports
- Route-based splitting

### **Caching**
- Service worker caching
- Browser storage (IndexedDB)
- Firebase offline persistence
- Asset caching

### **Rendering**
- React.memo for expensive components
- Virtual scrolling for long lists
- Debounced input handlers
- RequestAnimationFrame for animations

---

## 📱 Progressive Web App (PWA)

### **Features**
- Installable on desktop/mobile
- Offline functionality
- App-like experience
- Push notifications (future)

### **Manifest**
- App icons (192px, 512px)
- Theme colors
- Display mode
- Start URL

---

## 🧪 Testing

### **Jest 29.7.0**
- **Purpose**: Unit testing framework
- **Usage**: Component and function testing

### **Puppeteer 23.11.1**
- **Purpose**: E2E testing
- **Usage**: Browser automation and testing

### **jest-puppeteer 11.0.0**
- **Purpose**: Jest + Puppeteer integration
- **Usage**: End-to-end test automation

---

## 📦 Package Management

### **npm**
- **Purpose**: Dependency management
- **Usage**:
  - Install packages
  - Run scripts
  - Manage versions
  - Lock dependencies

### **Key Scripts**
```json
{
  "start": "webpack serve --mode=development",
  "build": "webpack --mode=production",
  "test:e2e": "jest",
  "build:libs": "webpack --config webpack.libs.config.js"
}
```

---

## 🌐 Browser Compatibility

### **Supported Browsers**
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

### **Required Features**
- WebAssembly support
- WebGL 2.0
- IndexedDB
- Service Workers
- MediaDevices API (for hand tracking)

---

## 📈 Scalability Considerations

### **Current Architecture**
- Client-side rendering
- Serverless backend (Firebase)
- CDN-ready static assets
- Horizontal scaling via Firebase

### **Future Enhancements**
- Server-side rendering (SSR)
- Edge computing for AI
- Real-time collaboration (WebRTC)
- Distributed rendering

---

## 🔄 State Management

### **React Context API**
- `AuthContext` - User authentication state
- `ModelContext` - 3D model and app state
- `FSContext` - File system state

### **Local State**
- Component-level useState
- Session storage for temporary data
- LocalStorage for preferences

### **Remote State**
- Firebase Firestore for persistent data
- Real-time listeners for updates
- Optimistic UI updates

---

## 🎯 Key Features Enabled by Tech Stack

1. **AI-Powered Generation** - Gemini API + Monaco Editor
2. **Real-time 3D Visualization** - model-viewer + GLTF Transform
3. **Hand Gesture Control** - TensorFlow.js + MediaPipe
4. **Collaborative Sharing** - Firebase Firestore + Security Rules
5. **Offline Support** - Service Workers + BrowserFS
6. **Professional Code Editor** - Monaco Editor + OpenSCAD Language
7. **Session Management** - Firebase Auth + Firestore
8. **Responsive UI** - React + PrimeReact + Custom CSS
9. **Cross-platform** - PWA + Responsive Design
10. **Type Safety** - TypeScript throughout

---

## 📚 Documentation & Resources

- **React**: https://react.dev
- **TypeScript**: https://www.typescriptlang.org
- **Firebase**: https://firebase.google.com/docs
- **PrimeReact**: https://primereact.org
- **Monaco Editor**: https://microsoft.github.io/monaco-editor
- **TensorFlow.js**: https://www.tensorflow.org/js
- **Gemini API**: https://ai.google.dev

---

**Tech Stack Version**: 1.0
**Last Updated**: 2026-02-03
**Maintained By**: Venus CAD Team
