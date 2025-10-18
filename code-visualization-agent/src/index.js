import Resolver from '@forge/resolver';
import { storage } from '@forge/api';
import { CodeParser } from './backend/codeParser.js';
import { GeminiService } from './backend/geminiService.js';

const resolver = new Resolver();
const codeParser = new CodeParser();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const geminiService = new GeminiService(GEMINI_API_KEY);

resolver.define('main', async (req) => {
  console.log('Main function called');
  
  return {
    success: true,
    message: 'Code Visualization Agent initialized',
    hasGeminiKey: !!GEMINI_API_KEY
  };
});

resolver.define('analyzeCode', async (req) => {
  const { codeContent, fileName, fileType } = req.payload;
  
  try {
    const parseResult = await codeParser.parseCode(codeContent, fileName, fileType);
    
    let analysis;
    if (GEMINI_API_KEY && parseResult.codeBlocks.length > 0) {
      const analyzedBlocks = await geminiService.analyzeBatch(
        parseResult.codeBlocks, 
        codeContent, 
        fileName
      );
      
      analysis = {
        ...parseResult,
        codeBlocks: analyzedBlocks,
        analyzedWithAI: true
      };
    } else {
      analysis = {
        ...parseResult,
        analyzedWithAI: false,
        message: GEMINI_API_KEY ? 'No code blocks found' : 'Gemini API key not configured'
      };
    }
    
    const storageKey = `analysis_${fileName.replace(/[^a-zA-Z0-9]/g, '_')}`;
    await storage.set(storageKey, analysis);
    
    return {
      success: true,
      analysis: analysis
    };
  } catch (error) {
    console.error('Error analyzing code:', error);
    return {
      success: false,
      error: error.message
    };
  }
});

resolver.define('getStoredAnalysis', async (req) => {
  const { fileName } = req.payload;
  
  try {
    const storageKey = `analysis_${fileName.replace(/[^a-zA-Z0-9]/g, '_')}`;
    const analysis = await storage.get(storageKey);
    return {
      success: true,
      analysis: analysis
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
});

resolver.define('createJiraIssues', async (req) => {
  const { codeBlocks, projectKey } = req.payload;
  
  try {
    const createdIssues = [];
    
    for (const block of codeBlocks) {
      if (block.analysis && block.analysis.suggestedJiraIssues) {
        for (const issue of block.analysis.suggestedJiraIssues) {
          const jiraIssue = await createJiraIssue({
            ...issue,
            projectKey: projectKey,
            codeBlock: block
          });
          createdIssues.push(jiraIssue);
        }
      }
    }
    
    return {
      success: true,
      createdIssues: createdIssues
    };
  } catch (error) {
    console.error('Error creating Jira issues:', error);
    return {
      success: false,
      error: error.message
    };
  }
});

resolver.define('getVisualizationData', async (req) => {
  const { fileName } = req.payload;
  
  try {
    const storageKey = `analysis_${fileName.replace(/[^a-zA-Z0-9]/g, '_')}`;
    const analysis = await storage.get(storageKey);
    
    if (!analysis) {
      return {
        success: false,
        error: 'No analysis found for this file'
      };
    }
    
    const graphData = createGraphData(analysis);
    
    return {
      success: true,
      graphData: graphData
    };
  } catch (error) {
    console.error('Error getting visualization data:', error);
    return {
      success: false,
      error: error.message
    };
  }
});

async function createJiraIssue(issueData) {
  return {
    id: `ISSUE-${Date.now()}`,
    key: `CV-${Math.floor(Math.random() * 1000)}`,
    summary: issueData.summary,
    description: issueData.description,
    type: issueData.type,
    priority: issueData.priority,
    storyPoints: issueData.storyPoints,
    codeReference: {
      file: issueData.codeBlock.file,
      name: issueData.codeBlock.name,
      type: issueData.codeBlock.type
    }
  };
}

function createGraphData(analysis) {
  const nodes = [];
  const edges = [];
  
  analysis.codeBlocks.forEach(block => {
    nodes.push({
      id: block.id,
      label: block.name,
      type: block.type,
      complexity: block.analysis?.complexity || block.complexity || 1,
      file: block.file,
      group: block.type,
      size: (block.analysis?.complexity || block.complexity || 1) * 10
    });
    
    if (block.dependencies) {
      block.dependencies.forEach(dep => {
        edges.push({
          from: block.id,
          to: `dep_${dep}`,
          type: 'dependency',
          label: 'imports'
        });
        
        if (!nodes.find(n => n.id === `dep_${dep}`)) {
          nodes.push({
            id: `dep_${dep}`,
            label: dep,
            type: 'dependency',
            group: 'external',
            size: 5
          });
        }
      });
    }
    
    if (block.analysis?.relationships?.calls) {
      block.analysis.relationships.calls.forEach(called => {
        edges.push({
          from: block.id,
          to: called,
          type: 'calls',
          label: 'calls'
        });
      });
    }
  });
  
  return { nodes, edges };
}

export const handler = resolver.getDefinitions();