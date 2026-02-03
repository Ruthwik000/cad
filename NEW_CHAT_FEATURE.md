# New Chat Feature

## Overview
Users can now start a fresh chat session from anywhere in the app with a single click.

## Implementation

### 1. Landing Page - New Chat Button
**Location**: Left sidebar (when logged in)
**Behavior**:
- Clears current session ID from localStorage
- Navigates to `/editor` (fresh editor)
- Opens with empty chat panel
- No previous messages loaded

```typescript
const handleNewChat = () => {
  localStorage.removeItem('currentSessionId');
  navigate('/editor');
};
```

### 2. Editor Header - New Chat Button
**Location**: Top header, next to Venus logo
**Icon**: Plus icon (➕)
**Tooltip**: "New Chat"
**Behavior**: Same as landing page button

### 3. Session Clearing Logic
When navigating to `/editor` without a session ID:
- `localStorage.removeItem('currentSessionId')`
- `setMessages([])` - Clear chat messages
- `setCurrentSessionId(null)` - Clear session state
- Editor starts with default/empty code

## User Flows

### Flow 1: New Chat from Landing Page
1. User is on landing page
2. User clicks "New Chat" in sidebar
3. Navigates to `/editor`
4. Fresh editor opens with:
   - Empty chat panel
   - Default OpenSCAD code
   - No session ID
   - Ready for new prompt

### Flow 2: New Chat from Editor
1. User is working on a session
2. User clicks ➕ button in header
3. Navigates to `/editor`
4. Previous session preserved in database
5. Fresh editor opens for new work

### Flow 3: New Chat with Auto-Save
1. User enters prompt on landing page
2. Clicks "Create now"
3. New session created automatically
4. Navigates to `/editor/:sessionId`
5. Session saved with initial prompt

## Routes

### `/editor` - New Session
- No session ID in URL
- No session ID in localStorage
- Fresh start
- First AI response will create session (if logged in)

### `/editor/:sessionId` - Existing Session
- Session ID in URL
- Session ID stored in localStorage
- Messages loaded from Firestore
- Model code loaded from session

## Session Creation Timing

### Option 1: On First Message (Current)
- User navigates to `/editor`
- User enters first prompt
- Session created when prompt is sent
- Session ID stored and URL updated

### Option 2: On Navigation (Alternative)
- User clicks "New Chat"
- Empty session created immediately
- Navigate to `/editor/:sessionId`
- Session ready for messages

**Current Implementation**: Option 1 (lazy creation)

## Benefits

### 1. Clean Slate
- Start fresh without clutter
- No confusion with previous work
- Clear mental model

### 2. Easy Access
- Available from landing page
- Available from editor
- One click away

### 3. Session Preservation
- Old sessions remain intact
- Can return to previous work
- Nothing lost

### 4. Intuitive UX
- Familiar pattern (like ChatGPT)
- Clear visual indicator (➕)
- Consistent behavior

## Technical Details

### State Management
```typescript
// Clear session
localStorage.removeItem('currentSessionId');
setCurrentSessionId(null);
setMessages([]);

// Load session
const sessionId = localStorage.getItem('currentSessionId');
if (sessionId) {
  loadSessionMessages(sessionId);
}
```

### Navigation
```typescript
// New chat
navigate('/editor');

// Specific session
navigate(`/editor/${sessionId}`);

// Back to home
navigate('/');
```

### Session Detection
```typescript
useEffect(() => {
  if (sessionId) {
    // Load existing session
    localStorage.setItem('currentSessionId', sessionId);
    loadSessionMessages(sessionId);
  } else {
    // Clear for new chat
    localStorage.removeItem('currentSessionId');
    setMessages([]);
  }
}, [sessionId]);
```

## UI Components

### Landing Page Sidebar
```
┌─────────────────────────┐
│ ➕ New Chat             │ ← Starts fresh editor
├─────────────────────────┤
│ RECENT                  │
├─────────────────────────┤
│ Create a phone stand    │
│ Design a gear system    │
│ Make a vase with...     │
└─────────────────────────┘
```

### Editor Header
```
┌────────────────────────────────────────────┐
│ ← Venus ➕  │  Chats 🔗 Code AI 🚪        │
│             ↑                               │
│        New Chat                             │
└────────────────────────────────────────────┘
```

## Future Enhancements

### 1. Confirmation Dialog
Before starting new chat, ask:
```
"Start new chat? Current work will be saved."
[Cancel] [New Chat]
```

### 2. Quick Templates
```
New Chat ▼
├─ Blank
├─ From Template
├─ Duplicate Current
└─ Import from File
```

### 3. Keyboard Shortcut
- `Ctrl+N` or `Cmd+N` for new chat
- `Ctrl+T` or `Cmd+T` for new tab (future)

### 4. Tab System
- Multiple chats in tabs
- Switch between active chats
- Close tabs individually

### 5. Draft Sessions
- Auto-save drafts
- Resume unsaved work
- "You have unsaved changes"

## Testing Checklist

- [x] New Chat button in landing page sidebar
- [x] New Chat button in editor header
- [x] Clicking clears current session
- [x] Navigates to `/editor`
- [x] Chat panel is empty
- [x] No messages loaded
- [x] Previous session preserved
- [x] Can return to previous session
- [x] First message creates new session
- [x] Session appears in sidebar after creation

## Known Issues

None currently.

## Conclusion

The New Chat feature provides a seamless way to start fresh work while preserving existing sessions. The implementation is clean, intuitive, and follows familiar patterns from other chat-based applications.
