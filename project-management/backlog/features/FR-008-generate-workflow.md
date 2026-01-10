# Feature Request: FR-008 - Generate Workflow

**Status**: ⭕ Not Started  
**Priority**: 🟠 High  
**Story Points**: 13  
**Created**: 2026-01-10  
**Updated**: 2026-01-10  
**Assigned Sprint**: [Sprint Number or "Backlog"]

## Description

Implement an AI-powered workflow generation feature that takes a user's structured prompt and automatically generates a complete workflow structure. The generated workflow includes 5-10 personas, each representing a step that builds upon the previous one in a progressive flow. The LLM must suggest 3 different orderings of the personas with clear arguments for the pros and cons of each ordering. This feature transforms high-level user intent into actionable, structured workflows.

## User Story

As a user,
I want the AI to analyze my prompt and suggest 3 different workflow orders with 5-10 personas that build on each other,
so that I can choose the best approach for my project with clear reasoning for each ordering option.

## Acceptance Criteria

- [ ] Users can initiate workflow generation from a prompt
- [ ] AI analyzes prompt and suggests 5-10 distinct personas for the workflow
- [ ] Each persona represents a step that builds progressively on previous steps
- [ ] LLM generates 3 different orderings of the personas
- [ ] Each ordering includes clear pros and cons with reasoning
- [ ] Each persona includes clear instructions and estimated effort
- [ ] Users can select their preferred ordering from the 3 options
- [ ] Users can edit, reorder, or remove personas after selection
- [ ] Users can add custom personas to the workflow
- [ ] Generated workflows can be saved and reused
- [ ] Users can regenerate workflow if unsatisfied with results
- [ ] Workflow structure supports branching and conditional logic

## UX Requirements

### User Flow

1. User completes prompt creation (FR-007)
2. User clicks "Generate Workflow"
3. System shows loading state with progress
4. User sees 3 ordering options with pros/cons
5. User compares options and selects preferred ordering
6. User enters workflow builder with generated personas
7. User can edit, reorder, add, or remove personas
8. User saves workflow

### Interface Specifications

- Three-column card layout for ordering comparison
- Cards show: ordering name, best use case, pros, cons, persona count, estimated time
- Selected ordering highlighted with border and checkmark
- Flow diagram below selected ordering shows persona progression
- Drag-and-drop reordering in workflow builder
- Dependency arrows between connected personas

### Ordering Card Content

```
┌─────────────────────────────────────────┐
│  Sequential Builder                     │
│  ────────────────────────────────────   │
│  Best for: Simple, linear processes     │
│                                         │
│  Pros:                                  │
│  + Easy to understand and follow        │
│  + Clear handoff points                 │
│  + Simple to estimate timeline          │
│                                         │
│  Cons:                                  │
│  - Less flexible for changes            │
│  - May create bottlenecks               │
│                                         │
│  Personas: 6  |  Est. Time: 2 days      │
│  [Select This]                          │
└─────────────────────────────────────────┘
```

### Interaction Patterns

- Selection and comparison for ordering choice
- Loading states with progress indicators
- Drag-and-drop for persona reordering
- Modal for adding custom personas

### Accessibility

- Comparison cards have proper heading structure
- Pros/cons sections marked with ARIA labels
- Flow diagram has text alternative description
- Drag-and-drop has keyboard alternative (up/down buttons)

### Responsive Design

- Mobile: Single ordering card, swipe to compare
- Tablet: Two ordering cards side-by-side
- Desktop: Three ordering cards side-by-side

## Business Value

- Accelerates project planning significantly
- Reduces cognitive load on users for workflow design
- Provides expert-level workflow ordering decisions with transparent reasoning
- Ensures workflows follow best practices with progressive persona building
- Differentiates product with intelligent workflow generation and ordering analysis
- Enables non-experts to create complex, well-reasoned workflows

## Technical Requirements

- Integration with connected LLM (FR-006) for workflow generation
- LLM prompt engineering for generating persona suggestions and orderings with reasoning
- Workflow structure data model with personas, dependencies, and metadata
- Display component for presenting 3 orderings with pros/cons comparison
- Drag-and-drop persona reordering functionality
- Persona editing interface with instructions and effort estimates
- Workflow template storage and retrieval
- Branching/conditional logic support in workflow model
- Export capability (JSON, Markdown, etc.)
- Regeneration with prompt refinement options

## UX References

- [UX Design Documentation](../ux/ux-design-documentation.md)
- Wireframe: Workflow Generator - Persona Ordering Selection (Section 5.3)
- User Flow: Workflow Generation with Persona Selection (Section 3.3)
- Pattern: Selection and Comparison (Section 6.3)
- Pattern: Loading States and Progress (Section 6.5)

## Technical References

- Model: `Workflow`, `WorkflowPersona`, `WorkflowPersonaDependency`
- Controller: `WorkflowController`
- Tables: `workflows`, `workflow_personas`, `workflow_persona_dependencies`
- Routes: `workflows.*`
- Component: `WorkflowGenerator.vue`, `WorkflowPersonaSelector.vue`, `WorkflowBuilder.vue`

## Dependencies

- LLM Connection feature (FR-006) must be implemented first
- Create Your Prompt feature (FR-007) must be implemented first

## Notes

- Consider adding workflow templates based on industry/category
- May want to add collaboration features in future
- Consider workflow execution/tracking as future enhancement
- Could integrate with popular project management tools
- May want to add A/B testing for different workflow approaches
- LLM prompt should be carefully crafted to ensure high-quality persona suggestions

## History

- 2026-01-10 - Created
- 2026-01-10 - Updated to include persona-based workflow with 3 ordering options
