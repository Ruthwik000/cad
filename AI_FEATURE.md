# AI Assistant Feature

## Overview
The OpenSCAD Playground now includes an AI-powered assistant that can generate OpenSCAD code based on natural language descriptions.

## Features
- **Chat Interface**: Cursor-like chat interface in a sidebar
- **Natural Language Input**: Describe what you want to create (e.g., "create a realistic car", "generate a horse", "make a wheel")
- **Context-Aware Editing**: AI can modify existing code based on your requests (e.g., "make the headlights round", "add a spare tire")
- **Automatic Code Generation**: Uses Google's Gemini 1.5 Flash model to generate detailed OpenSCAD code
- **Direct Integration**: Generated code is automatically inserted into the editor
- **Persistent API Key**: Your Gemini API key is stored locally in your browser
- **Edit Mode Detection**: Automatically detects when you have existing code and switches to edit mode

## How to Use

1. **Get a Gemini API Key**
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create a free API key

2. **Open the AI Assistant**
   - Click the "AI" button with the sparkles icon (✨) in the header
   - The chat panel will slide in from the left

3. **Enter Your API Key**
   - On first use, you'll be prompted to enter your Gemini API key
   - The key is saved in your browser's localStorage for future use

4. **Generate Models**
   - Type what you want to create in the chat input
   - Press Enter to send (Shift+Enter for new line)
   - The AI will generate OpenSCAD code and insert it into the editor
   - The model will automatically render in the viewer

## Example Prompts

### Creating New Models
- "Create a realistic car with wheels and windows"
- "Generate a detailed horse model"
- "Make a gear wheel with 20 teeth"
- "Design a coffee mug with a handle"
- "Create a chess piece - a knight"

### Editing Existing Models
- "Make the headlights round"
- "Add a spare tire to the back"
- "Change the wheels to be larger"
- "Add door handles"
- "Make the roof curved instead of flat"
- "Add racing stripes"
- "Increase the size by 50%"

## Technical Details
- **Model**: gemini-1.5-flash (Google's fast and efficient model)
- **API**: Google Generative AI API
- **System Prompt**: Dynamically switches between "create" and "edit" modes based on existing code
- **Context Awareness**: Includes current OpenSCAD code in the prompt when editing
- **Code Extraction**: Automatically extracts code from markdown code blocks if present

## Privacy
- Your API key is stored only in your browser's localStorage
- No data is sent to any server except Google's Gemini API
- All communication is direct between your browser and Google's API

## Troubleshooting
- **"Error: API Error: 401"**: Your API key is invalid or expired
- **"Error: API Error: 429"**: You've exceeded the API rate limit
- **No code generated**: Try rephrasing your prompt to be more specific
- **Code doesn't render**: Check the console for OpenSCAD syntax errors
