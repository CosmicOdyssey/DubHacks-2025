import { storage } from '@forge/api';

// Export individual action handlers for Rovo
export async function analyzeNode(payload, context) {
  console.log('Analyze Node action invoked:', { payload, context });
  
  try {
    const graphData = await storage.get('graphData') || { nodes: [], edges: [] };
    const { nodeId } = payload;
    
    // Find the node
    const nodeData = graphData.nodes.find(n => n.id === nodeId);
    if (!nodeData) {
      return { error: 'Node not found' };
    }

    const { label, type, blockType, metadata, filename } = nodeData;
    
    // Find connected nodes
    const dependencies = graphData.edges
      .filter(e => e.source === nodeId)
      .map(e => {
        const targetNode = graphData.nodes.find(n => n.id === e.target);
        return targetNode ? targetNode.label : e.target;
      });

    return {
      purpose: metadata?.purpose || 'No detailed purpose available',
      complexity: metadata?.complexity || 'unknown',
      dependencies: dependencies,
      exports: metadata?.keyExports || {},
      relatedConcepts: metadata?.relatedConcepts || [],
      coreLogic: metadata?.coreLogic || ''
    };
  } catch (error) {
    console.error('Analyze node error:', error);
    return { error: error.message };
  }
}

export async function createTasks(payload, context) {
  console.log('Create Tasks action invoked:', { payload, context });
  
  try {
    const graphData = await storage.get('graphData') || { nodes: [], edges: [] };
    const { nodeId } = payload;
    
    const nodeData = graphData.nodes.find(n => n.id === nodeId);
    if (!nodeData) {
      return { error: 'Node not found' };
    }

    const { label, metadata } = nodeData;
    const complexity = metadata?.complexity || 'medium';
    const tasks = [];

    if (complexity === 'high' || complexity === 'very-high') {
      tasks.push({
        title: `Refactor ${label} to reduce complexity`,
        description: `This file has ${complexity} complexity. Consider breaking it into smaller modules.`,
        priority: 'High'
      });
    }

    if (metadata?.relatedConcepts?.length > 0) {
      tasks.push({
        title: `Document ${label} architecture`,
        description: `Add documentation covering: ${metadata.relatedConcepts.join(', ')}`,
        priority: 'Medium'
      });
    }

    const dependencies = graphData.edges.filter(e => e.source === nodeId);
    if (dependencies.length > 10) {
      tasks.push({
        title: `Optimize dependencies in ${label}`,
        description: `This file has ${dependencies.length} dependencies. Review and reduce coupling.`,
        priority: 'Medium'
      });
    }

    tasks.push({
      title: `Add unit tests for ${label}`,
      description: `Create comprehensive unit tests to improve code reliability.`,
      priority: 'High'
    });

    return { tasks };
  } catch (error) {
    console.error('Create tasks error:', error);
    return { error: error.message };
  }
}

export async function suggestImprovements(payload, context) {
  console.log('Suggest Improvements action invoked:', { payload, context });
  
  try {
    const graphData = await storage.get('graphData') || { nodes: [], edges: [] };
    const { nodeId } = payload;
    
    const nodeData = graphData.nodes.find(n => n.id === nodeId);
    if (!nodeData) {
      return { error: 'Node not found' };
    }

    const { metadata } = nodeData;
    const suggestions = [];

    if (metadata?.complexity === 'high' || metadata?.complexity === 'very-high') {
      suggestions.push({
        category: 'Refactoring',
        suggestion: 'Break down complex functions into smaller, single-responsibility units',
        impact: 'High'
      });
    }

    suggestions.push({
      category: 'Documentation',
      suggestion: 'Add comprehensive JSDoc comments and inline documentation',
      impact: 'Medium'
    });

    suggestions.push({
      category: 'Architecture',
      suggestion: 'Apply SOLID principles for better maintainability',
      impact: 'High'
    });

    if (metadata?.relatedConcepts?.some(c => c.toLowerCase().includes('api'))) {
      suggestions.push({
        category: 'Performance',
        suggestion: 'Consider caching, lazy loading, or pagination',
        impact: 'Medium'
      });
    }

    return { suggestions };
  } catch (error) {
    console.error('Suggest improvements error:', error);
    return { error: error.message };
  }
}
