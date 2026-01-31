/**
 * Arcanea Trigger System v3.0
 * 
 * Sophisticated event-driven automation engine for agent workflows.
 * Supports pattern matching, conditional logic, scheduled triggers,
 * and multi-agent orchestration.
 */

const EventEmitter = require('events');

class ArcaneaTriggerEngine extends EventEmitter {
  constructor(options = {}) {
    super();
    this.triggers = new Map();
    this.activeWorkflows = new Map();
    this.contextHistory = [];
    this.maxHistory = options.maxHistory || 1000;
    this.guardianRouter = options.guardianRouter || new GuardianRouter();
    this.aiRouter = options.aiRouter || new AIRouter();
    
    // Performance metrics
    this.metrics = {
      triggersFired: 0,
      workflowsCompleted: 0,
      workflowsFailed: 0,
      avgExecutionTime: 0
    };
  }

  /**
   * Register a new trigger
   */
  register(trigger) {
    const id = trigger.id || `trigger_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    this.triggers.set(id, {
      ...trigger,
      id,
      enabled: trigger.enabled !== false,
      createdAt: new Date(),
      fireCount: 0,
      lastFired: null
    });

    this.emit('trigger:registered', { id, trigger });
    return id;
  }

  /**
   * Unregister a trigger
   */
  unregister(id) {
    const trigger = this.triggers.get(id);
    if (trigger) {
      this.triggers.delete(id);
      this.emit('trigger:unregistered', { id, trigger });
      return true;
    }
    return false;
  }

  /**
   * Process input through all triggers
   */
  async process(context) {
    const startTime = Date.now();
    const results = [];

    // Add to history
    this.addToHistory(context);

    // Check each trigger
    for (const [id, trigger] of this.triggers) {
      if (!trigger.enabled) continue;

      try {
        const match = await this.matchTrigger(trigger, context);
        
        if (match.matched) {
          const result = await this.executeTrigger(trigger, context, match);
          results.push({
            triggerId: id,
            trigger: trigger.name,
            success: result.success,
            actions: result.actions,
            guardian: result.guardian,
            executionTime: Date.now() - startTime
          });

          // Update metrics
          this.metrics.triggersFired++;
          trigger.fireCount++;
          trigger.lastFired = new Date();
        }
      } catch (error) {
        this.emit('trigger:error', { id, error, context });
        console.error(`Trigger ${id} failed:`, error);
      }
    }

    return results;
  }

  /**
   * Match trigger against context
   */
  async matchTrigger(trigger, context) {
    const { type, pattern, confidence = 0.8, conditions } = trigger;

    switch (type) {
      case 'pattern':
        return this.matchPattern(pattern, context, confidence);
      
      case 'keyword':
        return this.matchKeywords(pattern, context, confidence);
      
      case 'semantic':
        return this.matchSemantic(pattern, context, confidence);
      
      case 'conditional':
        return this.matchConditions(conditions, context);
      
      case 'scheduled':
        return this.matchSchedule(pattern, context);
      
      default:
        return { matched: false };
    }
  }

  /**
   * Pattern matching with regex or string
   */
  matchPattern(pattern, context, confidence) {
    const text = context.text || context.content || '';
    
    let regex;
    if (typeof pattern === 'string') {
      // Convert string pattern to regex
      regex = new RegExp(pattern, 'i');
    } else if (pattern instanceof RegExp) {
      regex = pattern;
    } else if (Array.isArray(pattern)) {
      // Multiple patterns
      for (const p of pattern) {
        const result = this.matchPattern(p, context, confidence);
        if (result.matched) return result;
      }
      return { matched: false };
    }

    const match = text.match(regex);
    if (match) {
      return {
        matched: true,
        confidence: confidence,
        matches: match,
        groups: match.groups || {}
      };
    }

    return { matched: false };
  }

  /**
   * Keyword matching
   */
  matchKeywords(keywords, context, confidence) {
    const text = (context.text || context.content || '').toLowerCase();
    const keywordList = Array.isArray(keywords) ? keywords : [keywords];
    
    const matches = [];
    for (const keyword of keywordList) {
      if (text.includes(keyword.toLowerCase())) {
        matches.push(keyword);
      }
    }

    if (matches.length > 0) {
      const matchConfidence = confidence * (matches.length / keywordList.length);
      return {
        matched: true,
        confidence: Math.min(matchConfidence, 1.0),
        matches
      };
    }

    return { matched: false };
  }

  /**
   * Semantic matching (simplified - would use embeddings in production)
   */
  matchSemantic(intent, context, confidence) {
    // Simplified semantic matching using keyword proximity
    // In production, this would use vector embeddings
    const text = (context.text || context.content || '').toLowerCase();
    const intentWords = intent.toLowerCase().split(' ');
    
    let score = 0;
    for (const word of intentWords) {
      if (text.includes(word)) score++;
    }

    const matchConfidence = score / intentWords.length;
    if (matchConfidence >= confidence) {
      return {
        matched: true,
        confidence: matchConfidence,
        semanticMatch: intent
      };
    }

    return { matched: false };
  }

  /**
   * Conditional matching
   */
  matchConditions(conditions, context) {
    if (!conditions || conditions.length === 0) {
      return { matched: true, confidence: 1.0 };
    }

    for (const condition of conditions) {
      const result = this.evaluateCondition(condition, context);
      if (!result.passed) {
        return { matched: false };
      }
    }

    return { matched: true, confidence: 1.0 };
  }

  /**
   * Evaluate single condition
   */
  evaluateCondition(condition, context) {
    const { field, operator, value } = condition;
    const fieldValue = this.getFieldValue(context, field);

    switch (operator) {
      case 'equals':
        return { passed: fieldValue === value };
      case 'not_equals':
        return { passed: fieldValue !== value };
      case 'contains':
        return { passed: String(fieldValue).includes(value) };
      case 'greater_than':
        return { passed: Number(fieldValue) > Number(value) };
      case 'less_than':
        return { passed: Number(fieldValue) < Number(value) };
      case 'exists':
        return { passed: fieldValue !== undefined && fieldValue !== null };
      case 'regex':
        return { passed: new RegExp(value).test(String(fieldValue)) };
      default:
        return { passed: false };
    }
  }

  /**
   * Get nested field value
   */
  getFieldValue(obj, path) {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null;
    }, obj);
  }

  /**
   * Schedule matching
   */
  matchSchedule(schedule, context) {
    // Check if current time matches schedule
    const now = new Date();
    
    if (schedule.cron) {
      // Parse cron expression
      return this.matchCron(schedule.cron, now);
    }
    
    if (schedule.interval) {
      // Check if enough time has passed
      const lastRun = context.lastRun || new Date(0);
      const elapsed = now - lastRun;
      return { matched: elapsed >= schedule.interval };
    }

    return { matched: false };
  }

  /**
   * Execute matched trigger
   */
  async executeTrigger(trigger, context, match) {
    const startTime = Date.now();
    const actions = [];

    try {
      // Route to appropriate guardian
      const guardian = trigger.guardian || 
        this.guardianRouter.select(context, match);

      // Execute each action
      for (const action of trigger.actions || []) {
        const actionResult = await this.executeAction(action, context, guardian, match);
        actions.push({
          name: action.name || action.type,
          success: actionResult.success,
          output: actionResult.output,
          executionTime: Date.now() - startTime
        });

        if (!actionResult.success && action.critical) {
          throw new Error(`Critical action failed: ${action.name}`);
        }
      }

      this.emit('trigger:executed', {
        trigger: trigger.id,
        guardian,
        actions,
        executionTime: Date.now() - startTime
      });

      return {
        success: true,
        guardian,
        actions,
        executionTime: Date.now() - startTime
      };

    } catch (error) {
      this.emit('trigger:failed', {
        trigger: trigger.id,
        error,
        context
      });

      return {
        success: false,
        error: error.message,
        actions,
        executionTime: Date.now() - startTime
      };
    }
  }

  /**
   * Execute single action
   */
  async executeAction(action, context, guardian, match) {
    const { type, handler, parameters = {} } = action;

    try {
      let output;

      switch (type) {
        case 'generate':
          output = await this.aiRouter.generate({
            prompt: parameters.prompt,
            guardian,
            context,
            ...parameters
          });
          break;

        case 'analyze':
          output = await this.aiRouter.analyze({
            content: context.text || context.content,
            type: parameters.analysisType,
            ...parameters
          });
          break;

        case 'enhance':
          output = await this.aiRouter.enhance({
            content: context.text || context.content,
            type: parameters.enhancementType,
            ...parameters
          });
          break;

        case 'transform':
          output = await this.aiRouter.transform({
            content: context.text || context.content,
            targetFormat: parameters.targetFormat,
            ...parameters
          });
          break;

        case 'validate':
          output = await this.aiRouter.validate({
            content: context.text || context.content,
            rules: parameters.rules,
            ...parameters
          });
          break;

        case 'suggest':
          output = await this.generateSuggestions(context, guardian, parameters);
          break;

        case 'workflow':
          output = await this.startWorkflow(parameters.workflow, context, guardian);
          break;

        case 'custom':
          if (typeof handler === 'function') {
            output = await handler(context, guardian, match, parameters);
          }
          break;

        default:
          throw new Error(`Unknown action type: ${type}`);
      }

      return { success: true, output };

    } catch (error) {
      console.error(`Action ${type} failed:`, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Generate suggestions
   */
  async generateSuggestions(context, guardian, parameters) {
    const suggestions = [];
    
    // Get guardian-specific suggestions
    const guardianSuggestions = this.guardianRouter.getSuggestions(guardian, context);
    suggestions.push(...guardianSuggestions);

    // Get skill-based suggestions
    if (parameters.skills) {
      for (const skillId of parameters.skills) {
        const skillSuggestions = await this.getSkillSuggestions(skillId, context);
        suggestions.push(...skillSuggestions);
      }
    }

    return { suggestions, count: suggestions.length };
  }

  /**
   * Get skill-specific suggestions
   */
  async getSkillSuggestions(skillId, context) {
    // Map skill IDs to suggestion templates
    const skillTemplates = {
      'skill_block_remove': [
        { type: 'technique', text: 'Try the 5-minute free-write technique' },
        { type: 'prompt', text: 'Write the worst version first, then refine' },
        { type: 'exercise', text: 'Change your environment - move to a different space' }
      ],
      'skill_structure': [
        { type: 'framework', text: 'Use the Three-Act Structure' },
        { type: 'outline', text: 'Start with bullet points for each section' },
        { type: 'template', text: 'Apply the Hero\'s Journey template' }
      ],
      'skill_narrative': [
        { type: 'arc', text: 'Consider the character\'s transformation arc' },
        { type: 'tension', text: 'Add tension through internal conflict' },
        { type: 'pacing', text: 'Vary scene lengths for rhythm' }
      ],
      'skill_order': [
        { type: 'organize', text: 'Group related concepts together' },
        { type: 'sequence', text: 'Present ideas in logical progression' },
        { type: 'hierarchy', text: 'Use heading levels for importance' }
      ]
    };

    return skillTemplates[skillId] || [
      { type: 'general', text: `Apply ${skillId} technique` }
    ];
  }

  /**
   * Start a workflow
   */
  async startWorkflow(workflowDef, context, guardian) {
    const workflowId = `workflow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const workflow = {
      id: workflowId,
      definition: workflowDef,
      context,
      guardian,
      status: 'running',
      phases: [],
      startTime: Date.now()
    };

    this.activeWorkflows.set(workflowId, workflow);
    this.emit('workflow:started', { workflowId, workflow });

    try {
      // Execute workflow phases
      for (const phase of workflowDef.phases || []) {
        const phaseResult = await this.executeWorkflowPhase(phase, workflow);
        workflow.phases.push(phaseResult);

        if (!phaseResult.success && phase.critical) {
          throw new Error(`Critical phase failed: ${phase.name}`);
        }
      }

      workflow.status = 'completed';
      workflow.endTime = Date.now();
      workflow.duration = workflow.endTime - workflow.startTime;

      this.metrics.workflowsCompleted++;
      this.emit('workflow:completed', { workflowId, workflow });

      return { workflowId, workflow };

    } catch (error) {
      workflow.status = 'failed';
      workflow.error = error.message;
      workflow.endTime = Date.now();

      this.metrics.workflowsFailed++;
      this.emit('workflow:failed', { workflowId, error, workflow });

      return { workflowId, workflow, error: error.message };
    }
  }

  /**
   * Execute workflow phase
   */
  async executeWorkflowPhase(phase, workflow) {
    const startTime = Date.now();

    try {
      // Select agent for this phase
      const agent = phase.agent || workflow.guardian;

      // Execute phase action
      const result = await this.executeAction(
        { type: phase.action || 'generate', ...phase },
        workflow.context,
        agent,
        {}
      );

      return {
        name: phase.name,
        success: result.success,
        output: result.output,
        agent,
        executionTime: Date.now() - startTime
      };

    } catch (error) {
      return {
        name: phase.name,
        success: false,
        error: error.message,
        executionTime: Date.now() - startTime
      };
    }
  }

  /**
   * Add context to history
   */
  addToHistory(context) {
    this.contextHistory.push({
      ...context,
      timestamp: new Date()
    });

    // Trim history if too large
    if (this.contextHistory.length > this.maxHistory) {
      this.contextHistory = this.contextHistory.slice(-this.maxHistory);
    }
  }

  /**
   * Get context history
   */
  getHistory(limit = 10) {
    return this.contextHistory.slice(-limit);
  }

  /**
   * Get trigger statistics
   */
  getStats() {
    return {
      ...this.metrics,
      registeredTriggers: this.triggers.size,
      activeWorkflows: this.activeWorkflows.size,
      historySize: this.contextHistory.length
    };
  }

  /**
   * Enable/disable trigger
   */
  setTriggerState(id, enabled) {
    const trigger = this.triggers.get(id);
    if (trigger) {
      trigger.enabled = enabled;
      this.emit('trigger:stateChanged', { id, enabled });
      return true;
    }
    return false;
  }

  /**
   * List all triggers
   */
  listTriggers() {
    return Array.from(this.triggers.entries()).map(([id, trigger]) => ({
      id,
      name: trigger.name,
      enabled: trigger.enabled,
      type: trigger.type,
      fireCount: trigger.fireCount,
      lastFired: trigger.lastFired
    }));
  }
}

/**
 * Guardian Router - Selects appropriate guardian for context
 */
class GuardianRouter {
  constructor() {
    this.guardianKeywords = {
      'dragon-forge': ['stuck', 'blocked', 'ignite', 'burn', 'transform', 'fire'],
      'phoenix-artisan': ['rebuild', 'renew', 'rise', 'ashes', 'rebirth'],
      'volcano-sculptor': ['explode', 'breakthrough', 'pressure', 'force', 'erupt'],
      'crystal-architect': ['structure', 'design', 'build', 'foundation', 'architecture'],
      'mountain-builder': ['foundation', 'core', 'base', 'solid', 'enduring'],
      'river-storyteller': ['flow', 'story', 'narrative', 'journey', 'path'],
      'ocean-memory': ['depth', 'emotion', 'memory', 'feel', 'subconscious'],
      'whisper-messenger': ['communicate', 'say', 'express', 'voice', 'speak'],
      'void-gazer': ['imagine', 'infinite', 'possibility', 'vision', 'dream']
    };
  }

  select(context, match) {
    const text = (context.text || context.content || '').toLowerCase();
    
    // Score each guardian
    const scores = {};
    for (const [guardian, keywords] of Object.entries(this.guardianKeywords)) {
      scores[guardian] = 0;
      for (const keyword of keywords) {
        if (text.includes(keyword)) {
          scores[guardian]++;
        }
      }
    }

    // Return highest scoring guardian
    const selected = Object.entries(scores)
      .sort((a, b) => b[1] - a[1])[0];

    return selected && selected[1] > 0 ? selected[0] : 'elemental-fusion';
  }

  getSuggestions(guardian, context) {
    const suggestions = {
      'dragon-forge': [
        { type: 'ignite', text: 'Ignite creative fire...' },
        { type: 'burn', text: 'Burn away limitations...' },
        { type: 'transform', text: 'Transform this into...' }
      ],
      'crystal-architect': [
        { type: 'structure', text: 'Structure this as...' },
        { type: 'design', text: 'Design the foundation...' },
        { type: 'build', text: 'Build the framework...' }
      ],
      'river-storyteller': [
        { type: 'flow', text: 'Let this flow into...' },
        { type: 'narrative', text: 'The narrative unfolds...' },
        { type: 'journey', text: 'On this journey...' }
      ],
      'elemental-fusion': [
        { type: 'combine', text: 'Combine elemental forces...' },
        { type: 'harmonize', text: 'Harmonize all elements...' },
        { type: 'unify', text: 'Unify diverse energies...' }
      ]
    };

    return suggestions[guardian] || suggestions['elemental-fusion'] || [];
  }
}

/**
 * AI Router - Routes to appropriate AI model
 */
class AIRouter {
  constructor() {
    this.models = {
      fast: ['claude-haiku', 'gpt-3.5-turbo'],
      moderate: ['claude-sonnet', 'gpt-4', 'gemini-pro'],
      complex: ['claude-opus', 'gpt-4-turbo', 'gemini-ultra']
    };
  }

  async generate(options) {
    // In production, this would call actual AI APIs
    console.log(`AI Generate: ${options.prompt?.substring(0, 50)}...`);
    return { text: `[Generated content for: ${options.prompt?.substring(0, 30)}...]` };
  }

  async analyze(options) {
    console.log(`AI Analyze: ${options.type}`);
    return { analysis: `[Analysis of type: ${options.type}]` };
  }

  async enhance(options) {
    console.log(`AI Enhance: ${options.type}`);
    return { enhanced: `[Enhanced content]` };
  }

  async transform(options) {
    console.log(`AI Transform to: ${options.targetFormat}`);
    return { transformed: `[Transformed to ${options.targetFormat}]` };
  }

  async validate(options) {
    console.log(`AI Validate with rules: ${options.rules?.length}`);
    return { valid: true, issues: [] };
  }
}

// Export for use
module.exports = {
  ArcaneaTriggerEngine,
  GuardianRouter,
  AIRouter
};

// Example usage and built-in triggers
if (require.main === module) {
  console.log('🎯 Arcanea Trigger System v3.0\n');

  const engine = new ArcaneaTriggerEngine();

  // Register example triggers
  engine.register({
    name: 'Creative Block Remover',
    type: 'keyword',
    pattern: ['stuck', 'blocked', 'can\'t start', "don't know"],
    confidence: 0.85,
    guardian: 'dragon-forge',
    actions: [
      {
        type: 'suggest',
        parameters: { skills: ['skill_block_remove'] }
      }
    ]
  });

  engine.register({
    name: 'Structure Helper',
    type: 'keyword',
    pattern: ['structure', 'organize', 'framework', 'design'],
    confidence: 0.80,
    guardian: 'crystal-architect',
    actions: [
      {
        type: 'suggest',
        parameters: { skills: ['skill_structure', 'skill_order'] }
      }
    ]
  });

  engine.register({
    name: 'Story Flow Assistant',
    type: 'keyword',
    pattern: ['story', 'narrative', 'flow', 'plot'],
    confidence: 0.80,
    guardian: 'river-storyteller',
    actions: [
      {
        type: 'suggest',
        parameters: { skills: ['skill_narrative'] }
      }
    ]
  });

  // Test the engine
  console.log('✅ Registered triggers:', engine.listTriggers().length);
  console.log('\n🧪 Testing trigger detection:\n');

  // Test cases
  const testCases = [
    { text: "I'm stuck and can't figure out what to write" },
    { text: "Help me structure this world building project" },
    { text: "The story flow feels wrong, how do I fix it?" },
    { text: "Just a normal sentence without triggers" }
  ];

  (async () => {
    for (const test of testCases) {
      console.log(`\nInput: "${test.text}"`);
      const results = await engine.process(test);
      
      if (results.length > 0) {
        results.forEach(r => {
          console.log(`  → Triggered: ${r.trigger} (${r.guardian})`);
          console.log(`  → Success: ${r.success}, Time: ${r.executionTime}ms`);
        });
      } else {
        console.log('  → No triggers matched');
      }
    }

    console.log('\n📊 Stats:', engine.getStats());
  })();
}
