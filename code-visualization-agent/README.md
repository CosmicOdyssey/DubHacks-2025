# Code Visualization Agent - Atlassian Forge App

A Forge app for Jira that analyzes codebases and transforms them into interconnected knowledge blocks, helping University of Washington teams understand code relationships and delegate tasks effectively.

## Features

- **Code Analysis**: Parse JavaScript/TypeScript files to extract functions, classes, and dependencies
- **AI Integration**: Uses Google Gemini Flash API to analyze code blocks and suggest tasks
- **Interactive Visualization**: Graph-based visualization of code relationships and dependencies
- **Task Delegation**: Generate Jira issues automatically from analyzed code blocks
- **Multiple File Types**: Support for JavaScript, TypeScript, Python, and more

## Setup Instructions

### Prerequisites

1. Node.js 18.x or 20.x
2. Forge CLI installed globally: `npm install -g @forge/cli`
3. Google Gemini API key (optional, for AI analysis)
4. Atlassian Developer Account

### Installation

1. Clone this repository
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```

### Configuration

1. Set up your Google Gemini API key (optional):
   ```bash
   forge environment set GEMINI_API_KEY your_api_key_here
   ```

2. Login to Forge:
   ```bash
   forge login
   ```

3. Deploy the app:
   ```bash
   forge deploy
   ```

4. Install on your Jira site:
   ```bash
   forge install
   ```

## Usage

### 1. Upload Code
- Navigate to any Jira project
- Find the "Code Visualization Agent" app in the project sidebar
- Use the "Upload Code" tab to paste code for analysis

### 2. Analyze Repository
- Use the "Repository URL" tab to analyze entire repositories (feature in development)

### 3. View Visualization
- Switch to the "Visualization" tab to see:
  - Interactive graph of code relationships
  - Dependency mapping
  - Complexity analysis
  - File structure overview

### 4. Task Delegation
- Use the "Task Delegation" tab to:
  - Select code blocks for task creation
  - Filter by complexity or analysis status
  - Generate Jira issues automatically
  - View created issues and their relationships

## Architecture

### Backend Components

- **CodeParser**: Analyzes code using AST parsing (@babel/parser, acorn)
- **GeminiService**: Integrates with Google Gemini Flash API for AI analysis
- **Main Resolver**: Handles API calls and data storage

### Frontend Components

- **Main App**: Tab-based interface for different features
- **SimpleGraphVisualization**: SVG-based graph visualization
- **TaskDelegationDashboard**: Issue creation and management interface

### Key Files

- `src/index.js` - Main Forge resolver with API endpoints
- `src/backend/codeParser.js` - Code analysis and parsing logic
- `src/backend/geminiService.js` - AI integration service
- `src/frontend/index.jsx` - Main React application
- `src/frontend/components/` - React components for UI
- `manifest.yml` - Forge app configuration

## API Endpoints

- `analyzeCode` - Parse and analyze code content
- `getVisualizationData` - Get graph data for visualization
- `createJiraIssues` - Generate Jira issues from code blocks
- `getStoredAnalysis` - Retrieve cached analysis results

## Development

### Local Development

```bash
# Start tunnel for local development
forge tunnel

# View logs
forge logs
```

### Building and Deployment

```bash
# Bundle the Custom UI (required before each deploy)
npm run build

# Deploy to development environment
forge deploy --environment development

# Deploy to production
forge deploy --environment production
```

## Configuration Options

### Supported File Types
- JavaScript (.js, .mjs)
- TypeScript (.ts, .tsx)
- JSX (.jsx)
- Python (.py) - basic support
- Generic text files

### Gemini API Integration
- Rate limiting: 1 request per second
- Retry logic: 3 attempts with exponential backoff
- Response parsing: JSON extraction from AI responses
- Fallback analysis: Works without API key (limited functionality)

## Example Usage

1. **Analyze a React component**:
   ```javascript
   import React, { useState } from 'react';
   
   const MyComponent = () => {
     const [count, setCount] = useState(0);
     
     const handleClick = () => {
       setCount(count + 1);
     };
     
     return (
       <button onClick={handleClick}>
         Count: {count}
       </button>
     );
   };
   
   export default MyComponent;
   ```

2. **Generated Analysis**:
   - Functions: `MyComponent`, `handleClick`
   - Dependencies: `React`, `useState`
   - Complexity: Low (2/5)
   - Suggested tasks: Add tests, Add PropTypes, Optimize re-renders

3. **Created Jira Issues**:
   - "Add unit tests for MyComponent" (Story, 3 pts)
   - "Add PropTypes validation" (Task, 1 pt)
   - "Optimize component re-renders" (Task, 2 pts)

## Troubleshooting

### Common Issues

1. **"Gemini API key not configured"**
   - Set the API key using: `forge environment set GEMINI_API_KEY your_key`

2. **"No code blocks found"**
   - Ensure the code is valid JavaScript/TypeScript
   - Check that the code contains functions or classes

3. **"Analysis failed"**
   - Check network connectivity
   - Verify Gemini API key is valid
   - Review Forge logs for detailed errors

### Performance Considerations

- Large files (>2000 lines) are truncated for Gemini analysis
- Graph visualization is optimized for up to 100 nodes
- Storage is limited by Forge platform constraints

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review Forge logs: `forge logs`
3. Create an issue in the repository
4. Contact the development team

## Roadmap

- [ ] Repository URL analysis
- [ ] Support for more programming languages
- [ ] Advanced graph layouts and filtering
- [ ] Integration with GitHub/GitLab APIs
- [ ] Team assignment suggestions
- [ ] Code review automation
- [ ] Performance metrics and analytics
