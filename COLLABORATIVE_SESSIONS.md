# Collaborative Sessions Guide

## Overview
Venus now supports real-time collaborative 3D modeling through shareable session links. Multiple users can work together on the same 3D model by sharing a session URL.

## How It Works

### Session Creation
1. User logs in and creates a new chat
2. A unique session ID is generated in Firestore
3. Session is stored with:
   - `userId`: Owner's user ID
   - `title`: Chat title (first 50 chars of prompt)
   - `messages`: Array of chat messages
   - `modelCode`: Current OpenSCAD code
   - `isShared`: Boolean flag for collaboration
   - `createdAt`: Timestamp
   - `updatedAt`: Timestamp

### Session Display
Each session in the sidebar shows:
- **Title**: Descriptive name from the initial prompt
- **Date**: Last updated date
- **Message Count**: Number of messages in the chat
- **Empty State**: "No chats yet" when user has no sessions

### Sharing a Session

#### Step 1: Copy Link
1. Open a session in the editor
2. Click the "Copy Link" button (🔗 icon) in the header
3. Session is automatically marked as `isShared: true`
4. Shareable URL is copied to clipboard

#### Step 2: Share URL
The URL format is:
```
https://yourapp.com/editor/SESSION_ID
```

Example:
```
https://yourapp.com/editor/abc123xyz789
```

#### Step 3: Collaborate
- Anyone with the link can access the session
- Both users can:
  - View all chat messages
  - Send new messages to AI
  - Edit the 3D model code
  - See real-time updates (on refresh)
  - Export the model

## Firestore Security Rules

### Read Access
Users can read a session if:
1. They own the session (`userId` matches), OR
2. Session is marked as shared (`isShared: true`)

```javascript
allow read: if request.auth != null && 
               (resource.data.userId == request.auth.uid ||
                resource.data.isShared == true);
```

### Write Access
Users can update a session if:
1. They own the session, OR
2. Session is shared and they're authenticated

```javascript
allow update: if request.auth != null && 
                 (resource.data.userId == request.auth.uid ||
                  resource.data.isShared == true);
```

### Delete Access
Only the owner can delete a session:
```javascript
allow delete: if request.auth != null && 
                 resource.data.userId == request.auth.uid;
```

## Features

### 1. Session Persistence
- All messages saved to Firestore
- Model code saved automatically
- Sessions persist across browser sessions
- Load any session by URL

### 2. Chat History
- View all previous sessions in sidebar
- Click any session to load it
- See message count and last update date
- Search through sessions (future feature)

### 3. Collaborative Editing
- Multiple users can edit the same session
- Changes saved to Firestore in real-time
- Each message includes timestamp
- Model code updates on every AI response

### 4. Session Management
- Create new sessions with "New Chat" button
- Load existing sessions from sidebar
- Share sessions via copy link
- Delete sessions (owner only)

## User Flow Examples

### Example 1: Solo User
1. User logs in
2. Enters prompt: "Create a phone stand"
3. Session created with title "Create a phone stand"
4. AI generates code
5. User refines with more prompts
6. All saved to session automatically
7. User can return later and continue

### Example 2: Collaboration
1. User A creates session: "Design a gear system"
2. User A clicks "Copy Link"
3. User A shares link with User B
4. User B opens link in browser
5. User B sees all messages and current model
6. User B adds prompt: "Make the teeth sharper"
7. AI updates the model
8. Both users see the updated code
9. Either user can export the final model

### Example 3: Public Sharing
1. User creates impressive 3D model
2. User shares link on social media
3. Anyone can view and remix the model
4. Viewers can fork by creating their own session
5. Original session remains unchanged

## Technical Implementation

### Session Loading
When user visits `/editor/:sessionId`:
```typescript
1. Extract sessionId from URL params
2. Store in localStorage as 'currentSessionId'
3. Load session from Firestore
4. Populate chat messages
5. Load model code into editor
6. Enable AI chat panel
```

### Message Saving
Every message is saved immediately:
```typescript
await addMessageToSession(sessionId, {
  role: 'user' | 'assistant',
  content: string,
  image?: string,
  timestamp: Timestamp.now()
});
```

### Code Syncing
Model code updates on every AI response:
```typescript
await updateSession(sessionId, {
  modelCode: generatedCode,
  updatedAt: Timestamp.now()
});
```

## Best Practices

### For Users
1. **Give descriptive titles**: First prompt becomes the title
2. **Share responsibly**: Anyone with link can edit
3. **Save important versions**: Export models before major changes
4. **Use clear prompts**: Helps collaborators understand intent

### For Developers
1. **Validate session access**: Check Firestore rules
2. **Handle missing sessions**: Show 404 or redirect
3. **Implement conflict resolution**: For simultaneous edits
4. **Add real-time sync**: Use Firestore listeners (future)
5. **Rate limit API calls**: Prevent abuse

## Future Enhancements

### 1. Real-Time Sync
- Use Firestore `onSnapshot()` listeners
- Live updates without refresh
- Show other users' cursors
- Conflict resolution for simultaneous edits

### 2. Permissions System
- View-only links
- Edit permissions per user
- Invite-only sessions
- Password-protected sessions

### 3. Version History
- Save snapshots of model code
- Revert to previous versions
- Compare versions side-by-side
- Branch from any version

### 4. Comments & Annotations
- Add comments to specific lines
- Annotate 3D model features
- Reply to comments
- Resolve discussions

### 5. Session Templates
- Save sessions as templates
- Public template gallery
- Fork popular templates
- Rate and review templates

### 6. Team Workspaces
- Organize sessions by project
- Team member management
- Shared asset libraries
- Team analytics

## Troubleshooting

### Session Not Loading
**Problem**: Shared link doesn't load session
**Solutions**:
1. Check if user is logged in
2. Verify session exists in Firestore
3. Check `isShared` flag is true
4. Verify Firestore rules are deployed

### Messages Not Saving
**Problem**: Chat messages disappear on refresh
**Solutions**:
1. Check `currentSessionId` in localStorage
2. Verify Firestore write permissions
3. Check browser console for errors
4. Ensure user is authenticated

### Copy Link Not Working
**Problem**: Copy link button doesn't work
**Solutions**:
1. Check if session ID exists
2. Verify clipboard API permissions
3. Try HTTPS (required for clipboard)
4. Check browser compatibility

### Collaborative Edits Not Syncing
**Problem**: Other user's changes not visible
**Solutions**:
1. Refresh the page (no real-time sync yet)
2. Check Firestore update permissions
3. Verify both users have session access
4. Check for JavaScript errors

## Security Considerations

### 1. Authentication Required
- All session access requires login
- Anonymous users cannot view sessions
- Prevents spam and abuse

### 2. Owner Controls
- Only owner can delete sessions
- Owner can disable sharing
- Owner maintains full control

### 3. Data Privacy
- Sessions are private by default
- Sharing is opt-in via copy link
- No public session directory (yet)

### 4. Rate Limiting
- Implement API rate limits
- Prevent excessive session creation
- Limit message frequency

### 5. Content Moderation
- Monitor for inappropriate content
- Report/flag system (future)
- Automated content filtering

## API Reference

### Create Session
```typescript
const sessionId = await createSession(userId: string, title: string);
```

### Get Session
```typescript
const session = await getSession(sessionId: string);
```

### Update Session
```typescript
await updateSession(sessionId: string, {
  messages?: ChatMessage[],
  modelCode?: string,
  title?: string
});
```

### Add Message
```typescript
await addMessageToSession(sessionId: string, {
  role: 'user' | 'assistant',
  content: string,
  image?: string
});
```

### Toggle Sharing
```typescript
await toggleSessionSharing(sessionId: string, isShared: boolean);
```

### Delete Session
```typescript
await deleteSession(sessionId: string);
```

## Conclusion

The collaborative session system enables seamless teamwork on 3D modeling projects. With proper security rules and intuitive UX, users can easily share their work and collaborate in real-time.

Future enhancements will add real-time synchronization, version control, and advanced permission management to make Venus the ultimate collaborative 3D modeling platform.
