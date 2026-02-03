# Routing Setup Documentation

## Overview
The application now uses React Router for proper URL-based navigation, enabling shareable links and better user experience.

## Routes

### 1. Landing Page
**Route**: `/`
**Component**: `LandingPage`
**Purpose**: Home page where users can:
- Enter prompts to create 3D models
- View their chat history (when logged in)
- Sign up / Log in
- Browse example prompts

### 2. Editor (New Session)
**Route**: `/editor`
**Component**: `EditorWorkspace`
**Purpose**: Main workspace for creating and editing 3D models without a specific session

### 3. Editor (Specific Session)
**Route**: `/editor/:sessionId`
**Component**: `EditorWorkspace`
**Purpose**: Load a specific session by ID, enabling:
- Shareable links to collaborate
- Direct access to saved sessions
- Session restoration from URL

## Key Features

### Shareable Links
Users can now share direct links to their sessions:
- Format: `https://yourapp.com/editor/SESSION_ID`
- Copy link button in the header generates the shareable URL
- Anyone with the link can view/edit the session (if sharing is enabled in Firestore)

### Navigation Flow
1. User lands on `/` (landing page)
2. User enters prompt and clicks "Create now"
3. New session created in Firestore (if logged in)
4. User navigated to `/editor/SESSION_ID`
5. AI chat opens automatically with the initial prompt

### Back Navigation
- Back button in header navigates to `/` (landing page)
- Preserves user's login state
- Clears current session context

### Session Loading
When a user visits `/editor/:sessionId`:
1. Session ID is extracted from URL
2. Session ID stored in localStorage as `currentSessionId`
3. AI Chat Panel loads messages from that session
4. Model code is restored from session data

## Implementation Details

### Router Setup
```typescript
<Router>
  <Routes>
    <Route path="/" element={<LandingPageWrapper />} />
    <Route path="/editor" element={<EditorWorkspace />} />
    <Route path="/editor/:sessionId" element={<EditorWorkspace />} />
  </Routes>
</Router>
```

### Navigation Hooks
Components use `useNavigate()` from React Router:
```typescript
const navigate = useNavigate();
navigate('/editor/abc123'); // Navigate to session
navigate('/'); // Navigate to home
```

### URL Parameters
Extract session ID from URL:
```typescript
const { sessionId } = useParams();
```

## Benefits

### 1. Shareable Sessions
- Users can share direct links to their 3D models
- Enables collaboration without complex sharing UI
- Works with Firestore sharing permissions

### 2. Bookmarkable URLs
- Users can bookmark specific sessions
- Browser history works properly
- Deep linking supported

### 3. Better UX
- Clean URLs instead of hash-based routing
- Browser back/forward buttons work correctly
- Proper page titles and meta tags (can be added)

### 4. SEO Friendly
- Search engines can index different pages
- Better for public galleries (future feature)
- Proper canonical URLs

## Future Enhancements

### 1. Additional Routes
- `/gallery` - Public gallery of shared models
- `/profile/:userId` - User profile pages
- `/explore` - Discover trending models
- `/docs` - Documentation pages

### 2. Route Guards
- Protected routes requiring authentication
- Redirect to login if not authenticated
- Permission checks for private sessions

### 3. Query Parameters
- `/editor?prompt=...` - Pre-fill prompt
- `/editor?theme=dark` - Theme preferences
- `/editor?view=code` - Default view mode

### 4. Dynamic Titles
```typescript
useEffect(() => {
  document.title = `Venus - ${sessionTitle}`;
}, [sessionTitle]);
```

### 5. 404 Page
- Handle invalid session IDs
- Redirect to home with error message
- Suggest similar sessions

## Migration Notes

### Breaking Changes
- URLs changed from hash-based to path-based
- Old bookmarks may not work (can add redirect logic)
- Service worker may need cache updates

### Backward Compatibility
To support old hash-based URLs, add a redirect:
```typescript
useEffect(() => {
  const hash = window.location.hash;
  if (hash.startsWith('#/editor/')) {
    const sessionId = hash.replace('#/editor/', '');
    navigate(`/editor/${sessionId}`, { replace: true });
  }
}, []);
```

## Testing Checklist

- [ ] Landing page loads at `/`
- [ ] Creating new session navigates to `/editor/:sessionId`
- [ ] Session ID appears in URL
- [ ] Copy link button generates correct URL
- [ ] Pasting shared link loads the session
- [ ] Back button returns to landing page
- [ ] Browser back/forward buttons work
- [ ] Logout redirects to landing page
- [ ] Invalid session IDs handled gracefully
- [ ] URL updates when switching sessions

## Dependencies

```json
{
  "react-router-dom": "^6.x.x"
}
```

Installed with:
```bash
npm install react-router-dom
```
