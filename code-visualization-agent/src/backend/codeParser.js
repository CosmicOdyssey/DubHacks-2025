import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as acorn from 'acorn';
import { simple as walkSimple } from 'acorn-walk';

export class CodeParser {
  constructor() {
    this.supportedExtensions = ['.js', '.jsx', '.ts', '.tsx', '.mjs'];
  }

  async parseCode(codeContent, fileName, fileType = 'javascript') {
    try {
      switch (fileType) {
        case 'javascript':
        case 'typescript':
          return this.parseJavaScript(codeContent, fileName);
        case 'python':
          return this.parsePython(codeContent, fileName);
        default:
          return this.parseGeneric(codeContent, fileName);
      }
    } catch (error) {
      console.error(`Error parsing ${fileName}:`, error);
      return this.createErrorNode(fileName, error.message);
    }
  }

  parseJavaScript(codeContent, fileName) {
    const codeBlocks = [];
    const dependencies = new Set();
    
    try {
      const ast = parse(codeContent, {
        sourceType: 'module',
        plugins: [
          'jsx',
          'typescript',
          'decorators-legacy',
          'classProperties',
          'asyncGenerators',
          'functionBind',
          'exportDefaultFrom',
          'exportNamespaceFrom',
          'dynamicImport',
          'nullishCoalescingOperator',
          'optionalChaining'
        ]
      });

      traverse(ast, {
        ImportDeclaration(path) {
          dependencies.add(path.node.source.value);
        },
        
        FunctionDeclaration(path) {
          const node = path.node;
          codeBlocks.push({
            id: `${fileName}_func_${node.id?.name || 'anonymous'}`,
            name: node.id?.name || 'anonymous',
            type: 'function',
            file: fileName,
            startLine: node.loc?.start.line || 0,
            endLine: node.loc?.end.line || 0,
            parameters: node.params.map(param => param.name || 'param'),
            async: node.async,
            generator: node.generator,
            complexity: this.calculateComplexity(path),
            dependencies: Array.from(dependencies)
          });
        },
        
        ClassDeclaration(path) {
          const node = path.node;
          const methods = [];
          
          path.traverse({
            MethodDefinition(methodPath) {
              const method = methodPath.node;
              methods.push({
                name: method.key.name || 'method',
                kind: method.kind,
                static: method.static,
                async: method.value.async
              });
            }
          });
          
          codeBlocks.push({
            id: `${fileName}_class_${node.id?.name || 'anonymous'}`,
            name: node.id?.name || 'anonymous',
            type: 'class',
            file: fileName,
            startLine: node.loc?.start.line || 0,
            endLine: node.loc?.end.line || 0,
            methods: methods,
            superClass: node.superClass?.name || null,
            complexity: this.calculateComplexity(path),
            dependencies: Array.from(dependencies)
          });
        },
        
        VariableDeclaration(path) {
          path.node.declarations.forEach(declarator => {
            if (declarator.init && 
                (declarator.init.type === 'ArrowFunctionExpression' || 
                 declarator.init.type === 'FunctionExpression')) {
              codeBlocks.push({
                id: `${fileName}_var_${declarator.id.name}`,
                name: declarator.id.name,
                type: 'variable_function',
                file: fileName,
                startLine: path.node.loc?.start.line || 0,
                endLine: path.node.loc?.end.line || 0,
                kind: path.node.kind,
                async: declarator.init.async,
                complexity: this.calculateComplexity(path),
                dependencies: Array.from(dependencies)
              });
            }
          });
        }
      });

      return {
        fileName,
        codeBlocks,
        dependencies: Array.from(dependencies),
        imports: Array.from(dependencies),
        exports: this.extractExports(ast)
      };
      
    } catch (error) {
      console.error('Babel parsing failed, trying Acorn:', error);
      return this.parseWithAcorn(codeContent, fileName);
    }
  }

  parseWithAcorn(codeContent, fileName) {
    const codeBlocks = [];
    const dependencies = new Set();
    
    try {
      const ast = acorn.parse(codeContent, {
        ecmaVersion: 'latest',
        sourceType: 'module',
        locations: true
      });

      walkSimple(ast, {
        ImportDeclaration(node) {
          dependencies.add(node.source.value);
        },
        
        FunctionDeclaration(node) {
          codeBlocks.push({
            id: `${fileName}_func_${node.id?.name || 'anonymous'}`,
            name: node.id?.name || 'anonymous',
            type: 'function',
            file: fileName,
            startLine: node.loc?.start.line || 0,
            endLine: node.loc?.end.line || 0,
            parameters: node.params.map(param => param.name || 'param'),
            async: node.async,
            generator: node.generator,
            complexity: 2,
            dependencies: Array.from(dependencies)
          });
        },
        
        ClassDeclaration(node) {
          codeBlocks.push({
            id: `${fileName}_class_${node.id?.name || 'anonymous'}`,
            name: node.id?.name || 'anonymous',
            type: 'class',
            file: fileName,
            startLine: node.loc?.start.line || 0,
            endLine: node.loc?.end.line || 0,
            complexity: 3,
            dependencies: Array.from(dependencies)
          });
        }
      });

      return {
        fileName,
        codeBlocks,
        dependencies: Array.from(dependencies),
        imports: Array.from(dependencies),
        exports: []
      };
      
    } catch (error) {
      console.error('Acorn parsing also failed:', error);
      return this.createErrorNode(fileName, error.message);
    }
  }

  parsePython(codeContent, fileName) {
    const codeBlocks = [];
    const lines = codeContent.split('\n');
    let currentIndent = 0;
    
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('def ')) {
        const functionName = trimmed.match(/def\s+(\w+)/)?.[1] || 'unnamed';
        codeBlocks.push({
          id: `${fileName}_func_${functionName}`,
          name: functionName,
          type: 'function',
          file: fileName,
          startLine: index + 1,
          complexity: 2,
          language: 'python'
        });
      }
      
      if (trimmed.startsWith('class ')) {
        const className = trimmed.match(/class\s+(\w+)/)?.[1] || 'unnamed';
        codeBlocks.push({
          id: `${fileName}_class_${className}`,
          name: className,
          type: 'class',
          file: fileName,
          startLine: index + 1,
          complexity: 3,
          language: 'python'
        });
      }
    });

    return {
      fileName,
      codeBlocks,
      dependencies: [],
      imports: [],
      exports: []
    };
  }

  parseGeneric(codeContent, fileName) {
    return {
      fileName,
      codeBlocks: [{
        id: `${fileName}_generic`,
        name: fileName,
        type: 'file',
        file: fileName,
        startLine: 1,
        endLine: codeContent.split('\n').length,
        complexity: 1,
        language: 'unknown'
      }],
      dependencies: [],
      imports: [],
      exports: []
    };
  }

  calculateComplexity(path) {
    let complexity = 1;
    
    path.traverse({
      IfStatement() { complexity++; },
      WhileStatement() { complexity++; },
      ForStatement() { complexity++; },
      SwitchCase() { complexity++; },
      ConditionalExpression() { complexity++; },
      LogicalExpression() { complexity++; }
    });
    
    return Math.min(complexity, 5);
  }

  extractExports(ast) {
    const exports = [];
    
    traverse(ast, {
      ExportNamedDeclaration(path) {
        if (path.node.declaration) {
          if (path.node.declaration.id) {
            exports.push(path.node.declaration.id.name);
          }
        }
        if (path.node.specifiers) {
          path.node.specifiers.forEach(spec => {
            exports.push(spec.exported.name);
          });
        }
      },
      
      ExportDefaultDeclaration(path) {
        exports.push('default');
      }
    });
    
    return exports;
  }

  createErrorNode(fileName, errorMessage) {
    return {
      fileName,
      codeBlocks: [{
        id: `${fileName}_error`,
        name: 'Parse Error',
        type: 'error',
        file: fileName,
        error: errorMessage,
        complexity: 1
      }],
      dependencies: [],
      imports: [],
      exports: []
    };
  }

  detectFileType(fileName) {
    const ext = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
    
    switch (ext) {
      case '.js':
      case '.jsx':
      case '.mjs':
        return 'javascript';
      case '.ts':
      case '.tsx':
        return 'typescript';
      case '.py':
        return 'python';
      case '.java':
        return 'java';
      case '.go':
        return 'go';
      case '.rs':
        return 'rust';
      default:
        return 'unknown';
    }
  }
}