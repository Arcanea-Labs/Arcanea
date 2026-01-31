/**
 * Arcanea Trigger System v2.0
 * Event-driven automation for the creative ecosystem
 */

const { EventEmitter } = require('events');
const path = require('path');
const fs = require('fs').promises;

class ArcaneaTriggerSystem extends EventEmitter {
  constructor(options = {}) {
    super();
    
    this.options = {
      dataDir: './data',
      triggerDir: './triggers',
      logLevel: 'info',
      ...options
    };
    
    this.triggers = new Map();
    this.rules = new Map();
    this.executionQueue = [];
    this.executionHistory = [];
    this.activeExecutions = new Map();
    this.isRunning = false;
    
    // Initialize directories
    this.initialize();
  }
  
  async initialize() {
    try {
      await this.ensureDirectory(this.options.triggerDir);
      await this.ensureDirectory(`${this.options.dataDir}/triggers`);
      await this.ensureDirectory(`${this.options.dataDir}/history`);
      
      // Load existing triggers
      await this.loadTriggers();
      
      console.log('🔔 Arcanea Trigger System initialized');
      this.emit('initialized');
      
    } catch (error) {
      console.error('Failed to initialize trigger system:', error);
      throw error;
    }
  }
  
  async ensureDirectory(dir) {
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
    }
  }
  
  // === TRIGGER DEFINITION ===
  
  defineTrigger(config) {
    const trigger = {
      id: config.id || `trigger_${Date.now()}`,
      name: config.name,
      type: config.type, // 'file' | 'schedule' | 'event' | 'dependency' | 'manual'
      enabled: config.enabled !== false,
      priority: config.priority || 'normal',
      
      // Condition
      condition: config.condition || {},
      
      // Action
      action: config.action,
      
      // Metadata
      description: config.description || '',
      tags: config.tags || [],
      
      // Execution tracking
      executionCount: 0,
      lastExecuted: null,
      lastSuccess: null,
      lastFailure: null,
      
      // Timestamps
      created: new Date().toISOString(),
      modified: new Date().toISOString()
    };
    
    this.triggers.set(trigger.id, trigger);
    console.log(`🎯 Trigger defined: ${trigger.name} (${trigger.type})`);
    
    return trigger;
  }
  
  // === TRIGGER TYPES ===
  
  createFileTrigger(config) {
    return this.defineTrigger({
      ...config,
      type: 'file',
      condition: {
        type: 'file',
        pattern: config.pattern,
        events: config.events || ['create', 'modify'],
        basePath: config.basePath || './'
      }
    });
  }
  
  createScheduleTrigger(config) {
    return this.defineTrigger({
      ...config,
      type: 'schedule',
      condition: {
        type: 'schedule',
        schedule: config.schedule, // cron expression
        timezone: config.timezone || 'UTC'
      }
    });
  }
  
  createEventTrigger(config) {
    return this.defineTrigger({
      ...config,
      type: 'event',
      condition: {
        type: 'event',
        eventType: config.eventType,
        eventSource: config.eventSource,
        filter: config.filter || {}
      }
    });
  }
  
  createDependencyTrigger(config) {
    return this.defineTrigger({
      ...config,
      type: 'dependency',
      condition: {
        type: 'dependency',
        dependencies: config.dependencies,
        operator: config.operator || 'AND'
      }
    });
  }
  
  // === TRIGGER EXECUTION ===
  
  async executeTrigger(triggerId, context = {}) {
    const trigger = this.triggers.get(triggerId);
    if (!trigger) {
      throw new Error(`Trigger not found: ${triggerId}`);
    }
    
    if (!trigger.enabled) {
      console.log(`Trigger ${trigger.name} is disabled`);
      return { success: false, reason: 'disabled' };
    }
    
    // Check condition
    if (!this.evaluateCondition(trigger.condition, context)) {
      return { success: false, reason: 'condition_not_met' };
    }
    
    // Execute action
    const executionId = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const execution = {
      id: executionId,
      triggerId: trigger.id,
      triggerName: trigger.name,
      context,
      startTime: new Date().toISOString(),
      status: 'running'
    };
    
    this.activeExecutions.set(executionId, execution);
    this.executionQueue.push(executionId);
    
    try {
      console.log(`⚡ Executing trigger: ${trigger.name}`);
      
      // Execute the action
      const result = await this.executeAction(trigger.action, context);
      
      // Update trigger stats
      trigger.executionCount++;
      trigger.lastExecuted = new Date().toISOString();
      trigger.lastSuccess = new Date().toISOString();
      
      // Update execution
      execution.status = 'success';
      execution.endTime = new Date().toISOString();
      execution.result = result;
      
      // Add to history
      this.addToHistory(execution);
      
      // Emit event
      this.emit('triggerExecuted', { trigger, execution, result });
      
      return { success: true, executionId, result };
      
    } catch (error) {
      // Handle failure
      trigger.lastFailure = new Date().toISOString();
      
      execution.status = 'failed';
      execution.endTime = new Date().toISOString();
      execution.error = error.message;
      
      this.addToHistory(execution);
      this.emit('triggerFailed', { trigger, execution, error });
      
      return { success: false, executionId, error: error.message };
    } finally {
      this.activeExecutions.delete(executionId);
      const queueIndex = this.executionQueue.indexOf(executionId);
      if (queueIndex > -1) {
        this.executionQueue.splice(queueIndex, 1);
      }
    }
  }
  
  async executeAction(action, context) {
    // Handle different action types
    if (typeof action === 'function') {
      return action(context);
    }
    
    if (typeof action === 'string') {
      // Skill invocation
      return this.invokeSkill(action, context);
    }
    
    if (action.skill) {
      return this.invokeSkill(action.skill, action.parameters || context);
    }
    
    if (action.agent) {
      return this.invokeAgent(action.agent, action.task, context);
    }
    
    if (action.script) {
      return this.executeScript(action.script, context);
    }
    
    throw new Error('Invalid action type');
  }
  
  async invokeSkill(skillName, parameters) {
    console.log(`🎨 Invoking skill: ${skillName}`);
    // Skill execution would be delegated to skill system
    return {
      skill: skillName,
      parameters,
      result: `Skill ${skillName} executed with params: ${JSON.stringify(parameters)}`,
      timestamp: new Date().toISOString()
    };
  }
  
  async invokeAgent(agentName, task, context) {
    console.log(`🤖 Invoking agent: ${agentName}`);
    // Agent execution would be delegated to agent system
    return {
      agent: agentName,
      task,
      context,
      result: `Agent ${agentName} processed task: ${task}`,
      timestamp: new Date().toISOString()
    };
  }
  
  async executeScript(scriptPath, context) {
    console.log(`📜 Executing script: ${scriptPath}`);
    // Script execution would load and run the script
    return {
      script: scriptPath,
      context,
      result: `Script ${scriptPath} executed`,
      timestamp: new Date().toISOString()
    };
  }
  
  // === CONDITION EVALUATION ===
  
  evaluateCondition(condition, context) {
    if (!condition) return true;
    
    switch (condition.type) {
      case 'file':
        return this.evaluateFileCondition(condition, context);
      case 'schedule':
        return this.evaluateScheduleCondition(condition, context);
      case 'event':
        return this.evaluateEventCondition(condition, context);
      case 'dependency':
        return this.evaluateDependencyCondition(condition, context);
      case 'composite':
        return this.evaluateCompositeCondition(condition, context);
      case 'expression':
        return this.evaluateExpressionCondition(condition, context);
      default:
        return true;
    }
  }
  
  evaluateFileCondition(condition, context) {
    const { pattern, events, basePath } = condition;
    
    if (!context.file) return false;
    
    // Check event type
    if (events && !events.includes(context.file.event)) {
      return false;
    }
    
    // Check pattern match
    if (pattern) {
      const regex = new RegExp(pattern.replace(/\*/g, '.*'));
      if (!regex.test(context.file.path)) {
        return false;
      }
    }
    
    return true;
  }
  
  evaluateScheduleCondition(condition, context) {
    const { schedule, timezone } = condition;
    
    if (!schedule) return true;
    
    // Simplified cron evaluation
    const now = new Date();
    const parts = schedule.split(' ');
    
    // Very basic cron parsing - would need full library for production
    const minute = now.getMinutes();
    const hour = now.getHours();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const dayOfWeek = now.getDay();
    
    // Check each part (simplified)
    const checks = [
      this.matchCronPart(parts[0], minute),
      this.matchCronPart(parts[1], hour),
      this.matchCronPart(parts[2], day),
      this.matchCronPart(parts[3], month),
      this.matchCronPart(parts[4], dayOfWeek)
    ];
    
    return checks.every(c => c);
  }
  
  matchCronPart(part, value) {
    if (part === '*') return true;
    if (part.includes(',')) {
      return part.split(',').map(p => parseInt(p)).includes(value);
    }
    if (part.includes('/')) {
      const [start, interval] = part.split('/').map(Number);
      return value >= start && value % interval === 0;
    }
    return parseInt(part) === value;
  }
  
  evaluateEventCondition(condition, context) {
    const { eventType, eventSource, filter } = condition;
    
    if (!context.event) return false;
    
    if (eventType && context.event.type !== eventType) {
      return false;
    }
    
    if (eventSource && context.event.source !== eventSource) {
      return false;
    }
    
    if (filter) {
      for (const [key, value] of Object.entries(filter)) {
        if (context.event[key] !== value) {
          return false;
        }
      }
    }
    
    return true;
  }
  
  evaluateDependencyCondition(condition, context) {
    const { dependencies, operator } = condition;
    
    if (!dependencies || dependencies.length === 0) return true;
    
    const status = this.getDependencyStatus(dependencies);
    
    if (operator === 'OR') {
      return status.some(s => s.satisfied);
    }
    
    return status.every(s => s.satisfied);
  }
  
  getDependencyStatus(dependencies) {
    return dependencies.map(dep => ({
      id: dep,
      satisfied: this.triggers.has(dep) && this.triggers.get(dep).lastExecuted !== null
    }));
  }
  
  evaluateCompositeCondition(condition, context) {
    const { operator, conditions } = condition;
    
    if (!conditions || conditions.length === 0) return true;
    
    const results = conditions.map(c => this.evaluateCondition(c, context));
    
    switch (operator) {
      case 'AND':
        return results.every(r => r);
      case 'OR':
        return results.some(r => r);
      case 'NOT':
        return !results[0];
      default:
        return results.every(r => r);
    }
  }
  
  evaluateExpressionCondition(condition, context) {
    const { expression } = condition;
    
    // Very simplified expression evaluation
    // In production, use a proper expression parser
    try {
      // Replace context variables
      let evalExpression = expression;
      for (const [key, value] of Object.entries(context)) {
        evalExpression = evalExpression.replace(new RegExp(`\\b${key}\\b`, 'g'), JSON.stringify(value));
      }
      
      return Boolean(eval(evalExpression));
    } catch (error) {
      console.warn('Expression evaluation failed:', error.message);
      return false;
    }
  }
  
  // === EVENT HANDLING ===
  
  emitEvent(eventType, eventData) {
    const event = {
      type: eventType,
      data: eventData,
      timestamp: new Date().toISOString()
    };
    
    this.emit('event', event);
    
    // Check for matching triggers
    for (const [triggerId, trigger] of this.triggers) {
      if (trigger.type === 'event') {
        const context = { event };
        if (this.evaluateCondition(trigger.condition, context)) {
          this.executeTrigger(triggerId, context);
        }
      }
    }
  }
  
  // === TRIGGER MANAGEMENT ===
  
  async loadTriggers() {
    try {
      const triggerFiles = await this.getFiles(this.options.triggerDir, '.json');
      
      for (const file of triggerFiles) {
        try {
          const content = await fs.readFile(file, 'utf-8');
          const triggerData = JSON.parse(content);
          this.defineTrigger(triggerData);
        } catch (error) {
          console.warn(`Failed to load trigger from ${file}:`, error.message);
        }
      }
      
      console.log(`📂 Loaded ${this.triggers.size} triggers`);
      
    } catch (error) {
      console.warn('No triggers found or error loading:', error.message);
    }
  }
  
  async saveTrigger(triggerId) {
    const trigger = this.triggers.get(triggerId);
    if (!trigger) return;
    
    const filePath = `${this.options.triggerDir}/${triggerId}.json`;
    await fs.writeFile(filePath, JSON.stringify(trigger, null, 2));
  }
  
  async getFiles(dir, extension) {
    try {
      const files = await fs.readdir(dir);
      return files
        .filter(f => f.endsWith(extension))
        .map(f => path.join(dir, f));
    } catch {
      return [];
    }
  }
  
  enableTrigger(triggerId) {
    const trigger = this.triggers.get(triggerId);
    if (trigger) {
      trigger.enabled = true;
      trigger.modified = new Date().toISOString();
      console.log(`✅ Trigger enabled: ${trigger.name}`);
    }
  }
  
  disableTrigger(triggerId) {
    const trigger = this.triggers.get(triggerId);
    if (trigger) {
      trigger.enabled = false;
      trigger.modified = new Date().toISOString();
      console.log(`⏸️ Trigger disabled: ${trigger.name}`);
    }
  }
  
  deleteTrigger(triggerId) {
    const trigger = this.triggers.get(triggerId);
    if (trigger) {
      this.triggers.delete(triggerId);
      console.log(`🗑️ Trigger deleted: ${trigger.name}`);
    }
  }
  
  // === HISTORY & STATISTICS ===
  
  addToHistory(execution) {
    this.executionHistory.push({
      ...execution,
      timestamp: new Date().toISOString()
    });
    
    // Keep only last 1000 entries
    if (this.executionHistory.length > 1000) {
      this.executionHistory = this.executionHistory.slice(-1000);
    }
  }
  
  getHistory(options = {}) {
    let history = [...this.executionHistory];
    
    if (options.triggerId) {
      history = history.filter(h => h.triggerId === options.triggerId);
    }
    
    if (options.status) {
      history = history.filter(h => h.status === options.status);
    }
    
    if (options.limit) {
      history = history.slice(-options.limit);
    }
    
    return history;
  }
  
  getStatistics() {
    const successful = this.executionHistory.filter(h => h.status === 'success').length;
    const failed = this.executionHistory.filter(h => h.status === 'failed').length;
    
    const triggerStats = {};
    for (const [id, trigger] of this.triggers) {
      triggerStats[id] = {
        name: trigger.name,
        executions: trigger.executionCount,
        lastExecuted: trigger.lastExecuted,
        successRate: trigger.executionCount > 0 
          ? ((trigger.executionCount - (trigger.lastFailure ? 1 : 0)) / trigger.executionCount * 100).toFixed(1)
          : null
      };
    }
    
    return {
      totalTriggers: this.triggers.size,
      activeTriggers: Array.from(this.triggers.values()).filter(t => t.enabled).length,
      totalExecutions: this.executionHistory.length,
      successfulExecutions: successful,
      failedExecutions: failed,
      successRate: successful + failed > 0 
        ? ((successful / (successful + failed)) * 100).toFixed(1)
        : null,
      triggerStatistics: triggerStats
    };
  }
  
  // === PREDEFINED TRIGGERS ===
  
  setupPredefinedTriggers() {
    // Character creation trigger
    this.createFileTrigger({
      name: 'character_created',
      pattern: '**/*.character.arc',
      events: ['create'],
      action: {
        skill: 'create.relationship_suggestions',
        parameters: {
          generate_villains: true,
          generate_allies: true
        }
      },
      description: 'Generate character relationships when new character is created'
    });
    
    // World building trigger
    this.createFileTrigger({
      name: 'world_updated',
      pattern: '**/*.world.arc',
      events: ['modify'],
      action: {
        skill: 'analyze.coherence',
        parameters: {
          aspects: ['logic', 'timeline']
        }
      },
      description: 'Validate world consistency when modified'
    });
    
    // Spell completion trigger
    this.createEventTrigger({
      name: 'spell_completed',
      eventType: 'spell_execution_complete',
      action: {
        skill: 'evolve.concept',
        parameters: {
          store_results: true
        }
      },
      description: 'Refine spell after execution'
    });
    
    // Scheduled cleanup
    this.createScheduleTrigger({
      name: 'daily_cleanup',
      schedule: '0 3 * * *', // 3 AM daily
      action: {
        script: './scripts/cleanup.js'
      },
      description: 'Daily system maintenance'
    });
    
    // Dependency example
    this.createDependencyTrigger({
      name: 'world_complete',
      dependencies: ['character_created', 'world_updated'],
      action: {
        skill: 'combine.orchestrate',
        parameters: {
          workflow: 'full_world_package'
        }
      },
      description: 'Execute when world development is complete'
    });
    
    console.log('🎯 Predefined triggers setup complete');
  }
}

// === DEFAULT EXPORT ===
module.exports = ArcaneaTriggerSystem;