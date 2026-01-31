/**
 * Arcanea Agent Workflow Orchestrator
 * 
 * Coordinates multi-agent workflows for complex creative tasks
 * Manages agent handoffs, state transitions, and workflow execution
 */

const { EventEmitter } = require('events');
const { ArcaneaTriggerEngine } = require('./trigger-system-v3');

class AgentWorkflowOrchestrator extends EventEmitter {
  constructor(options = {}) {
    super();
    this.triggerEngine = options.triggerEngine || new ArcaneaTriggerEngine();
    this.maxConcurrency = options.maxConcurrency || 5;
    this.timeout = options.timeout || 30000;
    
    this.activeWorkflows = new Map();
    this.workflowDefinitions = new Map();
    this.agentRegistry = new Map();
    
    this.metrics = {
      workflowsStarted: 0,
      workflowsCompleted: 0,
      workflowsFailed: 0,
      avgExecutionTime: 0
    };

    this.registerDefaultWorkflows();
  }

  /**
   * Register default workflow definitions
   */
  registerDefaultWorkflows() {
    // World Building Workflow
    this.registerWorkflow({
      id: 'world-creation',
      name: 'Complete World Building',
      description: 'Create a complete fictional world from scratch',
      phases: [
        {
          id: 'foundation',
          name: 'Cosmological Foundation',
          agent: 'crystal-architect',
          skill: 'skill_base_build',
          action: 'generate',
          prompt: 'Design the fundamental cosmology: physics, magic system, and universal laws',
          output: 'cosmology',
          timeout: 10000
        },
        {
          id: 'geography',
          name: 'Geographical Design',
          agent: 'crystal-architect',
          skill: 'skill_structure',
          action: 'generate',
          prompt: 'Create detailed geography: continents, climates, biomes, and landmarks',
          input: ['foundation.cosmology'],
          output: 'geography',
          timeout: 10000
        },
        {
          id: 'cultures',
          name: 'Cultural Development',
          agent: 'river-storyteller',
          skill: 'skill_narrative',
          action: 'generate',
          prompt: 'Develop diverse cultures: societies, traditions, conflicts, and relationships',
          input: ['foundation.cosmology', 'geography.landmarks'],
          output: 'cultures',
          timeout: 15000
        },
        {
          id: 'history',
          name: 'Historical Timeline',
          agent: 'ocean-memory',
          skill: 'skill_narrative',
          action: 'generate',
          prompt: 'Create a rich historical timeline: ages, events, wars, and evolution',
          input: ['foundation.cosmology', 'cultures.societies'],
          output: 'history',
          timeout: 15000
        },
        {
          id: 'magic',
          name: 'Magic System Design',
          agent: 'quantum-designer',
          skill: 'skill_reality',
          action: 'generate',
          prompt: 'Design detailed magic system: sources, limitations, costs, and applications',
          input: ['foundation.cosmology'],
          output: 'magic_system',
          timeout: 12000
        }
      ],
      orchestrator: 'crystal-architect',
      onComplete: 'validate_world'
    });

    // Character Development Workflow
    this.registerWorkflow({
      id: 'character-creation',
      name: 'Complete Character Development',
      description: 'Create a fully realized character with all dimensions',
      phases: [
        {
          id: 'archetype',
          name: 'Archetype Definition',
          agent: 'void-gazer',
          skill: 'skill_vision',
          action: 'generate',
          prompt: 'Determine core archetype and role in the narrative',
          output: 'archetype',
          timeout: 5000
        },
        {
          id: 'foundation',
          name: 'Foundation Traits',
          agent: 'mountain-builder',
          skill: 'skill_base_build',
          action: 'generate',
          prompt: 'Establish core personality traits, values, and foundation',
          input: ['archetype.type'],
          output: 'foundation',
          timeout: 8000
        },
        {
          id: 'backstory',
          name: 'Backstory Creation',
          agent: 'ocean-memory',
          skill: 'skill_narrative',
          action: 'generate',
          prompt: 'Create emotional backstory with formative experiences and wounds',
          input: ['foundation.traits', 'archetype.role'],
          output: 'backstory',
          timeout: 12000
        },
        {
          id: 'voice',
          name: 'Voice Development',
          agent: 'whisper-messenger',
          skill: 'skill_communicate',
          action: 'generate',
          prompt: 'Develop authentic voice: speech patterns, vocabulary, rhythm',
          input: ['foundation.traits', 'backstory.experiences'],
          output: 'voice',
          timeout: 8000
        },
        {
          id: 'visual',
          name: 'Visual Design',
          agent: 'vision-artist',
          skill: 'skill_vision',
          action: 'generate',
          prompt: 'Create visual appearance: features, style, distinctive markers',
          input: ['foundation.traits', 'archetype.type'],
          output: 'visual',
          timeout: 10000
        },
        {
          id: 'relationships',
          name: 'Relationship Mapping',
          agent: 'rain-singer',
          skill: 'skill_relationship',
          action: 'generate',
          prompt: 'Map key relationships: allies, enemies, mentors, loves',
          input: ['foundation.traits', 'backstory.connections'],
          output: 'relationships',
          timeout: 10000
        }
      ],
      orchestrator: 'character-shaper',
      onComplete: 'validate_character'
    });

    // Story Development Workflow
    this.registerWorkflow({
      id: 'story-creation',
      name: 'Complete Story Development',
      description: 'Develop a complete story from concept to outline',
      phases: [
        {
          id: 'concept',
          name: 'Concept Generation',
          agent: 'void-gazer',
          skill: 'skill_vision',
          action: 'generate',
          prompt: 'Generate unique story concept with hook and premise',
          output: 'concept',
          timeout: 8000
        },
        {
          id: 'characters',
          name: 'Character Ensemble',
          agent: 'character-shaper',
          skill: 'skill_create',
          action: 'workflow',
          workflow: 'character-creation',
          count: 3,
          output: 'characters',
          timeout: 30000
        },
        {
          id: 'plot',
          name: 'Plot Architecture',
          agent: 'crystal-architect',
          skill: 'skill_structure',
          action: 'generate',
          prompt: 'Design plot structure: acts, turning points, climax, resolution',
          input: ['concept.premise', 'characters.protagonist'],
          output: 'plot',
          timeout: 12000
        },
        {
          id: 'scenes',
          name: 'Scene Breakdown',
          agent: 'river-storyteller',
          skill: 'skill_narrative',
          action: 'generate',
          prompt: 'Break down into individual scenes with purposes and emotional beats',
          input: ['plot.acts', 'characters.all'],
          output: 'scenes',
          timeout: 15000
        },
        {
          id: 'themes',
          name: 'Thematic Layering',
          agent: 'mist-weaver',
          skill: 'skill_narrative',
          action: 'generate',
          prompt: 'Weave in themes: symbolic elements, motifs, deeper meanings',
          input: ['concept.themes', 'plot.climax'],
          output: 'themes',
          timeout: 10000
        }
      ],
      orchestrator: 'story-weaver',
      onComplete: 'validate_story'
    });

    // Spell Creation Workflow
    this.registerWorkflow({
      id: 'spell-creation',
      name: 'Arcane Spell Crafting',
      description: 'Create a magical spell with system integration',
      phases: [
        {
          id: 'concept',
          name: 'Spell Concept',
          agent: 'void-gazer',
          skill: 'skill_vision',
          action: 'generate',
          prompt: 'Define spell concept: effect, purpose, uniqueness',
          output: 'concept',
          timeout: 5000
        },
        {
          id: 'mechanics',
          name: 'Mechanics Design',
          agent: 'crystal-architect',
          skill: 'skill_structure',
          action: 'generate',
          prompt: 'Design mechanics: cost, limitations, requirements, duration',
          input: ['concept.effect'],
          output: 'mechanics',
          timeout: 8000
        },
        {
          id: 'lore',
          name: 'Lore Integration',
          agent: 'river-storyteller',
          skill: 'skill_narrative',
          action: 'generate',
          prompt: 'Create lore: origin, famous users, legendary uses, cultural significance',
          input: ['concept.effect', 'mechanics.cost'],
          output: 'lore',
          timeout: 8000
        },
        {
          id: 'visual',
          name: 'Visual Manifestation',
          agent: 'vision-artist',
          skill: 'skill_vision',
          action: 'generate',
          prompt: 'Describe visual appearance: casting, effects, aftermath',
          input: ['concept.effect', 'mechanics.components'],
          output: 'visual',
          timeout: 6000
        }
      ],
      orchestrator: 'crystal-architect',
      onComplete: 'validate_spell'
    });
  }

  /**
   * Register a workflow definition
   */
  registerWorkflow(definition) {
    this.workflowDefinitions.set(definition.id, definition);
    this.emit('workflow:registered', { id: definition.id, name: definition.name });
    return definition.id;
  }

  /**
   * Start a workflow instance
   */
  async startWorkflow(workflowId, context = {}, options = {}) {
    const definition = this.workflowDefinitions.get(workflowId);
    if (!definition) {
      throw new Error(`Workflow not found: ${workflowId}`);
    }

    const instanceId = `wf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const workflow = {
      id: instanceId,
      definitionId: workflowId,
      name: definition.name,
      context,
      status: 'running',
      currentPhase: 0,
      phases: [],
      results: {},
      startTime: Date.now(),
      options: { ...options }
    };

    this.activeWorkflows.set(instanceId, workflow);
    this.metrics.workflowsStarted++;

    this.emit('workflow:started', { instanceId, workflow: definition.name });

    try {
      // Execute phases sequentially
      for (let i = 0; i < definition.phases.length; i++) {
        const phase = definition.phases[i];
        workflow.currentPhase = i;

        const phaseResult = await this.executePhase(phase, workflow, definition);
        workflow.phases.push(phaseResult);

        // Store result
        if (phaseResult.success && phase.output) {
          workflow.results[phase.output] = phaseResult.output;
        }

        // Handle phase failure
        if (!phaseResult.success && phase.critical !== false) {
          throw new Error(`Phase ${phase.name} failed: ${phaseResult.error}`);
        }

        this.emit('workflow:phaseCompleted', {
          workflowId: instanceId,
          phase: phase.name,
          success: phaseResult.success
        });
      }

      // Workflow complete
      workflow.status = 'completed';
      workflow.endTime = Date.now();
      workflow.duration = workflow.endTime - workflow.startTime;

      this.metrics.workflowsCompleted++;
      this.updateAvgExecutionTime(workflow.duration);

      // Run completion handler
      if (definition.onComplete) {
        await this.runCompletionHandler(definition.onComplete, workflow);
      }

      this.emit('workflow:completed', {
        instanceId,
        workflow: definition.name,
        duration: workflow.duration,
        results: workflow.results
      });

      return {
        success: true,
        instanceId,
        workflow: definition.name,
        duration: workflow.duration,
        results: workflow.results,
        phases: workflow.phases
      };

    } catch (error) {
      workflow.status = 'failed';
      workflow.error = error.message;
      workflow.endTime = Date.now();

      this.metrics.workflowsFailed++;

      this.emit('workflow:failed', {
        instanceId,
        workflow: definition.name,
        error: error.message,
        phases: workflow.phases
      });

      return {
        success: false,
        instanceId,
        workflow: definition.name,
        error: error.message,
        phases: workflow.phases
      };
    }
  }

  /**
   * Execute a single workflow phase
   */
  async executePhase(phase, workflow, definition) {
    const startTime = Date.now();

    try {
      // Prepare input from previous phases
      const input = this.preparePhaseInput(phase, workflow.results);

      // Resolve agent
      const agent = phase.agent || definition.orchestrator;

      let output;

      // Execute based on action type
      switch (phase.action) {
        case 'generate':
          output = await this.executeGenerate(phase, input, agent);
          break;

        case 'workflow':
          // Nested workflow
          const nestedResult = await this.startWorkflow(phase.workflow, input, {
            parentWorkflow: workflow.id
          });
          output = nestedResult.results;
          break;

        case 'parallel':
          // Parallel agent execution
          output = await this.executeParallel(phase, input);
          break;

        case 'validate':
          output = await this.executeValidate(phase, input);
          break;

        case 'enhance':
          output = await this.executeEnhance(phase, input, agent);
          break;

        default:
          throw new Error(`Unknown action type: ${phase.action}`);
      }

      return {
        name: phase.name,
        success: true,
        output,
        agent,
        executionTime: Date.now() - startTime,
        input
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
   * Prepare phase input from workflow results
   */
  preparePhaseInput(phase, results) {
    const input = { ...phase.parameters };

    if (phase.input) {
      for (const inputRef of phase.input) {
        const [key, subkey] = inputRef.split('.');
        if (results[key]) {
          if (subkey) {
            input[key] = results[key][subkey] || results[key];
          } else {
            input[key] = results[key];
          }
        }
      }
    }

    return input;
  }

  /**
   * Execute generate action
   */
  async executeGenerate(phase, input, agent) {
    // In production, this would call the AI Router
    return {
      generated: true,
      phase: phase.name,
      agent,
      prompt: phase.prompt,
      input: Object.keys(input)
    };
  }

  /**
   * Execute parallel actions
   */
  async executeParallel(phase, input) {
    const agents = phase.agents || [phase.agent];
    const promises = agents.map(agent => 
      this.executeGenerate(phase, input, agent)
    );

    const results = await Promise.all(promises);
    return { parallel: true, results };
  }

  /**
   * Execute validation
   */
  async executeValidate(phase, input) {
    // In production, would validate against rules
    return { valid: true, checked: Object.keys(input) };
  }

  /**
   * Execute enhancement
   */
  async executeEnhance(phase, input, agent) {
    // In production, would enhance existing content
    return { enhanced: true, phase: phase.name, agent };
  }

  /**
   * Run workflow completion handler
   */
  async runCompletionHandler(handler, workflow) {
    switch (handler) {
      case 'validate_world':
        // Validate complete world
        console.log(`Validating world: ${workflow.results.cosmology ? '✓' : '✗'}`);
        break;
      
      case 'validate_character':
        // Validate complete character
        console.log(`Validating character: ${workflow.results.archetype ? '✓' : '✗'}`);
        break;
      
      case 'validate_story':
        // Validate complete story
        console.log(`Validating story: ${workflow.results.concept ? '✓' : '✗'}`);
        break;
      
      case 'validate_spell':
        // Validate complete spell
        console.log(`Validating spell: ${workflow.results.concept ? '✓' : '✗'}`);
        break;
    }
  }

  /**
   * Get workflow status
   */
  getWorkflowStatus(instanceId) {
    const workflow = this.activeWorkflows.get(instanceId);
    if (!workflow) {
      return null;
    }

    return {
      id: workflow.id,
      name: workflow.name,
      status: workflow.status,
      currentPhase: workflow.currentPhase,
      totalPhases: workflow.phases.length,
      duration: workflow.endTime ? workflow.endTime - workflow.startTime : Date.now() - workflow.startTime,
      progress: (workflow.currentPhase / workflow.phases.length) * 100,
      results: Object.keys(workflow.results)
    };
  }

  /**
   * List active workflows
   */
  listActiveWorkflows() {
    return Array.from(this.activeWorkflows.values())
      .filter(w => w.status === 'running')
      .map(w => ({
        id: w.id,
        name: w.name,
        currentPhase: w.currentPhase,
        totalPhases: w.phases.length,
        duration: Date.now() - w.startTime
      }));
  }

  /**
   * Cancel a running workflow
   */
  cancelWorkflow(instanceId) {
    const workflow = this.activeWorkflows.get(instanceId);
    if (workflow && workflow.status === 'running') {
      workflow.status = 'cancelled';
      workflow.endTime = Date.now();
      this.emit('workflow:cancelled', { instanceId });
      return true;
    }
    return false;
  }

  /**
   * Update average execution time
   */
  updateAvgExecutionTime(duration) {
    const total = this.metrics.avgExecutionTime * (this.metrics.workflowsCompleted - 1) + duration;
    this.metrics.avgExecutionTime = total / this.metrics.workflowsCompleted;
  }

  /**
   * Get orchestrator metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      activeWorkflows: this.listActiveWorkflows().length,
      registeredWorkflows: this.workflowDefinitions.size,
      successRate: this.metrics.workflowsStarted > 0
        ? (this.metrics.workflowsCompleted / this.metrics.workflowsStarted * 100).toFixed(1)
        : 0
    };
  }

  /**
   * List available workflows
   */
  listWorkflows() {
    return Array.from(this.workflowDefinitions.values()).map(wf => ({
      id: wf.id,
      name: wf.name,
      description: wf.description,
      phases: wf.phases.length,
      orchestrator: wf.orchestrator
    }));
  }
}

// Export
module.exports = AgentWorkflowOrchestrator;

// Example usage
if (require.main === module) {
  console.log('⚡ Arcanea Agent Workflow Orchestrator\n');

  const orchestrator = new AgentWorkflowOrchestrator();

  // Event listeners
  orchestrator.on('workflow:started', (data) => {
    console.log(`🚀 Started: ${data.workflow} (${data.instanceId})`);
  });

  orchestrator.on('workflow:phaseCompleted', (data) => {
    console.log(`  ✓ Phase: ${data.phase}`);
  });

  orchestrator.on('workflow:completed', (data) => {
    console.log(`✅ Completed: ${data.workflow} in ${data.duration}ms`);
  });

  orchestrator.on('workflow:failed', (data) => {
    console.log(`❌ Failed: ${data.workflow} - ${data.error}`);
  });

  // Demo: List available workflows
  console.log('\n📋 Available Workflows:');
  const workflows = orchestrator.listWorkflows();
  workflows.forEach(wf => {
    console.log(`  • ${wf.name} (${wf.phases} phases)`);
  });

  // Demo: Execute a workflow
  console.log('\n🎭 Executing Character Creation Workflow:\n');
  
  (async () => {
    const result = await orchestrator.startWorkflow('character-creation', {
      genre: 'fantasy',
      tone: 'epic'
    });

    console.log('\n📊 Result:', result.success ? 'Success' : 'Failed');
    console.log('📦 Outputs:', Object.keys(result.results).join(', '));
    
    console.log('\n📈 Metrics:', orchestrator.getMetrics());
  })();
}
