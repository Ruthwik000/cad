# Resizable Panels Feature

## Overview
All panels in VenusCAD are now fully resizable, giving you complete control over your workspace layout.

## Resizable Areas

### 1. Left Sidebar (Parameters Panel)
- **Default Width**: 300px
- **Min Width**: 200px
- **Max Width**: 600px
- **Resize Handle**: Right edge of the panel
- **Visual Feedback**: Handle highlights on hover

### 2. Right Sidebar (AI Chat Panel)
- **Default Width**: 400px
- **Min Width**: 300px
- **Max Width**: 800px
- **Resize Handle**: Left edge of the panel
- **Visual Feedback**: Handle highlights on hover

### 3. Center Split (Viewer/Editor)
- **Default Split**: 50% / 50%
- **Min Height**: 20% for each panel
- **Max Height**: 80% for each panel
- **Resize Handle**: Horizontal divider between viewer and editor
- **Visual Feedback**: Handle highlights on hover

## How to Resize

### Horizontal Resize (Left/Right Panels)
1. Hover over the edge of the panel
2. Cursor changes to `↔` (col-resize)
3. Click and drag left or right
4. Release to set the new width

### Vertical Resize (Viewer/Editor Split)
1. Hover over the divider between viewer and editor
2. Cursor changes to `↕` (row-resize)
3. Click and drag up or down
4. Release to set the new split ratio

## Visual Feedback

### Resize Handles
- **Width**: 8px invisible hit area
- **Hover Effect**: Semi-transparent white overlay (`#ffffff20`)
- **Cursor**: Changes to indicate resize direction
- **Z-Index**: 10 (always on top)

### During Resize
- **Body Cursor**: Changes globally to resize cursor
- **User Select**: Disabled to prevent text selection
- **Smooth**: Real-time updates as you drag

## Technical Details

### State Management
- Left width: Stored in component state
- Right width: Stored in component state
- Viewer height: Stored as percentage in component state
- Persists during session (resets on page reload)

### Constraints
- **Left Panel**: 200px - 600px
- **Right Panel**: 300px - 800px
- **Viewer Height**: 20% - 80%
- **Editor Height**: Automatically calculated (100% - viewer height)

### Performance
- Uses native mouse events
- No throttling needed (smooth performance)
- Cleanup on mouse up
- No memory leaks

## Keyboard Shortcuts
- No keyboard shortcuts for resizing (mouse only)
- Panels remember their size during the session

## Future Enhancements
- [ ] Save panel sizes to localStorage
- [ ] Double-click to reset to default size
- [ ] Keyboard shortcuts for common layouts
- [ ] Preset layouts (coding, viewing, balanced)
- [ ] Collapse/expand animations

## Benefits

1. **Flexibility**: Customize workspace to your needs
2. **Focus**: Make the panel you're working on larger
3. **Multi-monitor**: Optimize for different screen sizes
4. **Workflow**: Different layouts for different tasks
5. **Professional**: Matches VS Code and other IDEs

## Example Workflows

### Coding Focus
- Left: 250px (minimal parameters)
- Center: 80% editor, 20% viewer
- Right: Closed (no AI chat)

### AI Assistance
- Left: 250px
- Center: 50/50 split
- Right: 600px (large AI chat)

### 3D Modeling
- Left: 400px (large parameters)
- Center: 70% viewer, 30% editor
- Right: Closed

### Balanced
- Left: 300px
- Center: 50/50 split
- Right: 400px (when open)
