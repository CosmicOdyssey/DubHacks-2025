export class GeminiService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
    this.model = 'gemini-1.5-flash';
    this.rateLimitDelay = 1000;
    this.maxRetries = 3;
  }

  async analyzeCodeBlock(codeBlock, fullCode, fileName) {
    const prompt = this.createAnalysisPrompt(codeBlock, fullCode, fileName);
    
    try {
      const response = await this.callGeminiAPI(prompt);
      return this.parseGeminiResponse(response, codeBlock);
    } catch (error) {
      console.error('Gemini API error:', error);
      return this.createFallbackAnalysis(codeBlock);
    }
  }

  async analyzeBatch(codeBlocks, fullCode, fileName) {
    const results = [];
    
    for (let i = 0; i < codeBlocks.length; i++) {
      if (i > 0) {
        await this.delay(this.rateLimitDelay);
      }
      
      try {
        const analysis = await this.analyzeCodeBlock(codeBlocks[i], fullCode, fileName);
        results.push(analysis);
      } catch (error) {
        console.error(`Error analyzing block ${i}:`, error);
        results.push(this.createFallbackAnalysis(codeBlocks[i]));
      }
    }
    
    return results;
  }

  createAnalysisPrompt(codeBlock, fullCode, fileName) {
    return `
Analyze this ${codeBlock.type} from file "${fileName}" and provide a JSON response with the following structure:

{
  "purpose": "Brief description of what this code does",
  "functionality": "Detailed explanation of functionality",
  "dependencies": ["array", "of", "dependencies"],
  "dependents": ["array", "of", "potential", "dependents"],
  "complexity": 1-5 (integer),
  "tasks": ["atomic", "task", "breakdowns"],
  "tags": ["relevant", "concept", "tags"],
  "relationships": {
    "calls": ["functions", "it", "calls"],
    "calledBy": ["functions", "that", "call", "this"],
    "imports": ["modules", "it", "imports"],
    "exports": ["what", "it", "exports"]
  },
  "suggestedJiraIssues": [
    {
      "summary": "Issue title",
      "description": "Issue description",
      "type": "Story|Bug|Task",
      "priority": "High|Medium|Low",
      "storyPoints": 1-8
    }
  ]
}

Code Block Details:
- Name: ${codeBlock.name}
- Type: ${codeBlock.type}
- File: ${fileName}
- Lines: ${codeBlock.startLine}-${codeBlock.endLine}

Context (full file for reference):
\`\`\`
${fullCode.substring(0, 2000)}${fullCode.length > 2000 ? '...' : ''}
\`\`\`

Focus on the specific ${codeBlock.type} "${codeBlock.name}" and provide practical, actionable insights.
`;
  }

  async callGeminiAPI(prompt, retryCount = 0) {
    const url = `${this.baseUrl}/${this.model}:generateContent`;
    
    const requestBody = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.1,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    try {
      const response = await fetch(`${url}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        if (response.status === 429 && retryCount < this.maxRetries) {
          await this.delay(this.rateLimitDelay * Math.pow(2, retryCount));
          return this.callGeminiAPI(prompt, retryCount + 1);
        }
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response from Gemini API');
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      if (retryCount < this.maxRetries) {
        await this.delay(this.rateLimitDelay * Math.pow(2, retryCount));
        return this.callGeminiAPI(prompt, retryCount + 1);
      }
      throw error;
    }
  }

  parseGeminiResponse(responseText, originalBlock) {
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      const parsed = JSON.parse(jsonMatch[0]);
      
      return {
        ...originalBlock,
        analysis: {
          purpose: parsed.purpose || 'No purpose identified',
          functionality: parsed.functionality || 'No functionality description',
          dependencies: parsed.dependencies || [],
          dependents: parsed.dependents || [],
          complexity: Math.min(Math.max(parsed.complexity || 2, 1), 5),
          tasks: parsed.tasks || [],
          tags: parsed.tags || [],
          relationships: parsed.relationships || {},
          suggestedJiraIssues: parsed.suggestedJiraIssues || [],
          analyzedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      return this.createFallbackAnalysis(originalBlock);
    }
  }

  createFallbackAnalysis(codeBlock) {
    return {
      ...codeBlock,
      analysis: {
        purpose: `${codeBlock.type} ${codeBlock.name}`,
        functionality: 'Analysis unavailable - Gemini API integration needed',
        dependencies: codeBlock.dependencies || [],
        dependents: [],
        complexity: codeBlock.complexity || 2,
        tasks: [`Review and understand ${codeBlock.name}`, `Add tests for ${codeBlock.name}`],
        tags: [codeBlock.type, 'needs-analysis'],
        relationships: {
          calls: [],
          calledBy: [],
          imports: codeBlock.dependencies || [],
          exports: []
        },
        suggestedJiraIssues: [{
          summary: `Review ${codeBlock.name} ${codeBlock.type}`,
          description: `Analyze and document the ${codeBlock.type} ${codeBlock.name} in ${codeBlock.file}`,
          type: 'Task',
          priority: 'Medium',
          storyPoints: 2
        }],
        analyzedAt: new Date().toISOString(),
        fallback: true
      }
    };
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  validateApiKey() {
    return this.apiKey && this.apiKey.length > 0;
  }

  async testConnection() {
    if (!this.validateApiKey()) {
      throw new Error('API key not configured');
    }

    try {
      const testPrompt = 'Hello, please respond with "OK" if you can receive this message.';
      const response = await this.callGeminiAPI(testPrompt);
      return response.toLowerCase().includes('ok');
    } catch (error) {
      console.error('Gemini connection test failed:', error);
      return false;
    }
  }
}