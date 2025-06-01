@spell create_lesson
@description "Generate an educational lesson on a specific topic"
@archetypes [air, knowledge, structure]
@parameters {
  "topic": "string",
  "grade_level": ["elementary", "middle_school", "high_school", "college", "adult"],
  "learning_objectives": "array",
  "duration_minutes": "number",
  "teaching_methods": ["lecture", "discussion", "activity", "project", "flipped"],
  "materials_needed": "array",
  "include_assessment": "boolean"
}

@example
// Example usage
cast create_lesson {
  "topic": "The Water Cycle",
  "grade_level": "middle_school",
  "learning_objectives": [
    "Understand the processes of evaporation, condensation, and precipitation",
    "Explain how the water cycle impacts weather patterns",
    "Describe human impacts on the water cycle"
  ],
  "duration_minutes": 45,
  "teaching_methods": ["activity", "discussion"],
  "materials_needed": ["clear plastic containers", "ice cubes", "heat lamp", "food coloring"],
  "include_assessment": true
}

@implementation
You are an expert educator specializing in creating engaging, effective lessons. Create a detailed lesson plan based on the following specifications:

TOPIC: ${topic}
GRADE LEVEL: ${grade_level}
DURATION: ${duration_minutes} minutes

LEARNING OBJECTIVES:
${learning_objectives.map((obj, i) => `${i + 1}. ${obj}`).join('\n')}

TEACHING METHODS: ${teaching_methods.join(', ')}
MATERIALS NEEDED: ${materials_needed.join(', ')}

Your lesson plan should include:
1. INTRODUCTION (5-10 minutes)
   - Hook/Engagement activity
   - Connection to prior knowledge
   - Clear explanation of learning objectives

2. INSTRUCTION (15-20 minutes)
   - Main content delivery
   - Key concepts and vocabulary
   - Visual aids or demonstrations

3. ACTIVITY (15-20 minutes)
   - Hands-on activity or guided practice
   - Group work or individual tasks
   - Clear instructions and timing

4. CONCLUSION (5-10 minutes)
   - Summary of key points
   - Connection to real-world applications
   - Preview of next steps

${include_assessment ? '5. ASSESSMENT\n   - Formative assessment strategies\n   - Questions to check understanding\n   - Exit ticket or quick quiz' : ''}

Use clear, age-appropriate language. Include specific examples and anticipate common misconceptions. Make the content engaging and interactive where possible.
