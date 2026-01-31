/**
 * Arcanea Integration Test Suite
 * 
 * Comprehensive testing of all ecosystem components working together
 */

const { ArcaneaTriggerEngine, GuardianRouter, AIRouter } = require('./trigger-system-v3');
const fs = require('fs');
const path = require('path');

class IntegrationTestSuite {
  constructor() {
    this.results = [];
    this.passed = 0;
    this.failed = 0;
  }

  async runAll() {
    console.log('🧪 Arcanea Integration Test Suite\n');
    console.log('='.repeat(60));

    await this.testTriggerSystem();
    await this.testGuardianRouter();
    await this.testWorkflows();
    await this.testArcParser();
    await this.testPremiumUI();

    console.log('\n' + '='.repeat(60));
    console.log(`\n📊 Results: ${this.passed} passed, ${this.failed} failed`);
    console.log(`✅ Success Rate: ${((this.passed / (this.passed + this.failed)) * 100).toFixed(1)}%`);

    return { passed: this.passed, failed: this.failed };
  }

  async test(name, fn) {
    try {
      await fn();
      this.passed++;
      console.log(`  ✅ ${name}`);
      this.results.push({ name, status: 'passed' });
    } catch (error) {
      this.failed++;
      console.log(`  ❌ ${name}`);
      console.log(`     ${error.message}`);
      this.results.push({ name, status: 'failed', error: error.message });
    }
  }

  async testTriggerSystem() {
    console.log('\n🎯 Testing Trigger System\n');

    const engine = new ArcaneaTriggerEngine();

    await this.test('Register triggers', () => {
      // Test triggers
      engine.register({
        name: 'Test Trigger 1',
        type: 'keyword',
        pattern: ['test', 'example'],
        actions: [{ type: 'suggest', parameters: {} }]
      });
      
      engine.register({
        name: 'Test Trigger 2',
        type: 'pattern',
        pattern: /\btest\b/i,
        actions: [{ type: 'generate', parameters: {} }]
      });

      // Fire trigger for guardian routing test
      engine.register({
        name: 'Fire Guardian Trigger',
        type: 'keyword',
        pattern: ['stuck', 'blocked', 'fire'],
        guardian: 'dragon-forge',
        actions: [{ type: 'suggest', parameters: { skills: ['skill_block_remove'] } }]
      });

      // Structure trigger for keyword matching test
      engine.register({
        name: 'Structure Helper',
        type: 'keyword',
        pattern: ['structure', 'organize'],
        guardian: 'crystal-architect',
        actions: [{ type: 'suggest', parameters: {} }]
      });

      if (engine.triggers.size !== 4) {
        throw new Error(`Expected 4 triggers, got ${engine.triggers.size}`);
      }
    });

    await this.test('Pattern matching', async () => {
      const result = await engine.process({ text: 'This is a test message' });
      if (result.length < 1) {
        throw new Error('Expected at least 1 trigger match');
      }
    });

    await this.test('Guardian routing', async () => {
      const result = await engine.process({ text: 'I am stuck and need fire' });
      const fireMatch = result.find(r => r.guardian === 'dragon-forge');
      if (!fireMatch) {
        throw new Error('Expected dragon-forge to match fire-related text');
      }
    });

    await this.test('Keyword matching', async () => {
      const result = await engine.process({ text: 'Help me structure this' });
      const structureMatch = result.find(r => r.trigger.includes('Structure'));
      if (!structureMatch) {
        throw new Error('Expected structure-related trigger to match');
      }
    });

    await this.test('Trigger statistics', () => {
      const stats = engine.getStats();
      if (stats.triggersFired === 0) {
        throw new Error('Expected triggers to have fired');
      }
      if (stats.registeredTriggers !== 4) {
        throw new Error(`Expected 4 registered triggers, got ${stats.registeredTriggers}`);
      }
    });

    await this.test('Context history', () => {
      const history = engine.getHistory(5);
      if (history.length < 3) {
        throw new Error('Expected at least 3 items in history');
      }
    });

    await this.test('Enable/disable triggers', () => {
      const id = engine.register({
        name: 'Toggle Test',
        type: 'keyword',
        pattern: ['toggle'],
        actions: []
      });

      engine.setTriggerState(id, false);
      const trigger = engine.triggers.get(id);
      if (trigger.enabled !== false) {
        throw new Error('Expected trigger to be disabled');
      }
    });
  }

  async testGuardianRouter() {
    console.log('\n🧙 Testing Guardian Router\n');

    const router = new GuardianRouter();

    await this.test('Fire guardian selection', () => {
      const guardian = router.select({ text: 'I need to ignite my creativity' }, {});
      if (guardian !== 'dragon-forge') {
        throw new Error(`Expected dragon-forge, got ${guardian}`);
      }
    });

    await this.test('Earth guardian selection', () => {
      const guardian = router.select({ text: 'Help me build a solid foundation' }, {});
      if (guardian !== 'crystal-architect' && guardian !== 'mountain-builder') {
        throw new Error(`Expected earth guardian, got ${guardian}`);
      }
    });

    await this.test('Water guardian selection', () => {
      const guardian = router.select({ text: 'The story needs more emotional flow' }, {});
      if (guardian !== 'river-storyteller' && guardian !== 'ocean-memory') {
        throw new Error(`Expected water guardian, got ${guardian}`);
      }
    });

    await this.test('Default guardian fallback', () => {
      const guardian = router.select({ text: 'Just a normal sentence' }, {});
      if (!guardian) {
        throw new Error('Expected default guardian fallback');
      }
    });

    await this.test('Guardian suggestions', () => {
      const suggestions = router.getSuggestions('dragon-forge', {});
      if (suggestions.length === 0) {
        throw new Error('Expected suggestions for dragon-forge');
      }
      if (!suggestions[0].type || !suggestions[0].text) {
        throw new Error('Expected suggestion to have type and text');
      }
    });
  }

  async testWorkflows() {
    console.log('\n⚡ Testing Workflow System\n');

    const engine = new ArcaneaTriggerEngine();

    await this.test('Workflow registration', async () => {
      const workflowDef = {
        phases: [
          { name: 'phase1', action: 'generate', agent: 'dragon-forge' },
          { name: 'phase2', action: 'enhance', agent: 'crystal-architect' }
        ]
      };

      const result = await engine.startWorkflow(workflowDef, { text: 'test' }, 'dragon-forge');
      if (!result.workflowId) {
        throw new Error('Expected workflow ID');
      }
    });

    await this.test('Active workflow tracking', async () => {
      const stats = engine.getStats();
      if (stats.activeWorkflows === 0) {
        throw new Error('Expected at least 1 active workflow');
      }
    });

    await this.test('Workflow phases execution', async () => {
      // Check that a workflow has phases
      for (const [id, workflow] of engine.activeWorkflows) {
        if (workflow.phases.length === 0) {
          throw new Error('Expected workflow to have phases');
        }
        break;
      }
    });
  }

  async testArcParser() {
    console.log('\n📜 Testing .arc Parser Integration\n');

    const parserPath = path.join(__dirname, 'enhanced-parser.js');
    
    await this.test('Parser file exists', () => {
      if (!fs.existsSync(parserPath)) {
        throw new Error('enhanced-parser.js not found');
      }
    });

    await this.test('Parser can be loaded', () => {
      try {
        delete require.cache[require.resolve(parserPath)];
        require(parserPath);
      } catch (error) {
        throw new Error(`Failed to load parser: ${error.message}`);
      }
    });

    await this.test('Example .arc files exist', () => {
      const examplesPath = path.join(__dirname, '..', 'examples');
      if (!fs.existsSync(examplesPath)) {
        throw new Error('examples directory not found');
      }
      
      const files = fs.readdirSync(examplesPath);
      const arcFiles = files.filter(f => f.endsWith('.arc'));
      if (arcFiles.length === 0) {
        throw new Error('No .arc example files found');
      }
    });
  }

  async testPremiumUI() {
    console.log('\n🎨 Testing Premium UI Components\n');

    const uiPath = path.join(__dirname, '..', '..', '..', 'arcanea.ai', 'components', 'prompt-books');

    await this.test('PremiumPromptBooks.tsx exists', () => {
      const filePath = path.join(uiPath, 'PremiumPromptBooks.tsx');
      if (!fs.existsSync(filePath)) {
        throw new Error('PremiumPromptBooks.tsx not found');
      }
    });

    await this.test('UI has required components', () => {
      const filePath = path.join(uiPath, 'PremiumPromptBooks.tsx');
      const content = fs.readFileSync(filePath, 'utf-8');
      
      const requiredComponents = [
        'WeightControl',
        'TagBuilder',
        'Sidebar',
        'PromptEditor',
        'GuardianPanel'
      ];

      for (const component of requiredComponents) {
        if (!content.includes(component)) {
          throw new Error(`Missing component: ${component}`);
        }
      }
    });

    await this.test('Weight control functionality', () => {
      const filePath = path.join(uiPath, 'PremiumPromptBooks.tsx');
      const content = fs.readFileSync(filePath, 'utf-8');
      
      if (!content.includes('weight')) {
        throw new Error('Weight functionality not found');
      }
      if (!content.includes('presets')) {
        throw new Error('Weight presets not found');
      }
    });

    await this.test('Tab system implementation', () => {
      const filePath = path.join(uiPath, 'PremiumPromptBooks.tsx');
      const content = fs.readFileSync(filePath, 'utf-8');
      
      const tabs = ['prompts', 'txt2img', 'img2img'];
      for (const tab of tabs) {
        if (!content.includes(tab)) {
          throw new Error(`Missing tab: ${tab}`);
        }
      }
    });

    await this.test('Guardian integration', () => {
      const filePath = path.join(uiPath, 'PremiumPromptBooks.tsx');
      const content = fs.readFileSync(filePath, 'utf-8');
      
      const guardians = ['dragon-forge', 'crystal-architect', 'river-storyteller'];
      let found = 0;
      for (const guardian of guardians) {
        if (content.includes(guardian)) found++;
      }
      
      if (found === 0) {
        throw new Error('No guardian references found in UI');
      }
    });
  }
}

// Run tests if executed directly
if (require.main === module) {
  const suite = new IntegrationTestSuite();
  suite.runAll().then(results => {
    process.exit(results.failed > 0 ? 1 : 0);
  });
}

module.exports = IntegrationTestSuite;
