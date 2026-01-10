# Sprint 2: Prompt Builder & Workflow Generation

**Sprint Goal**: Enable users to create structured prompts and generate AI-powered workflows with persona ordering suggestions

**Sprint Duration**: 2026-01-20 - 2026-01-24 (1 week)  
**Sprint Planning Date**: 2026-01-17  
**Sprint Review Date**: 2026-01-24  
**Sprint Retrospective Date**: 2026-01-24

## Sprint Overview

**Focus Areas**:

- Prompt creation interface with templates and real-time preview
- Workflow generation with AI-powered persona ordering
- Drag-and-drop workflow builder

**Key Deliverables**:

- Prompt builder with template library and live preview
- Workflow generator with 3-ordering comparison
- Workflow builder with persona editing and dependencies
- Save/load functionality for prompts and workflows

**Dependencies**:

- FR-006 LLM Connection must be complete (Sprint 1)
- User authentication (existing - Laravel Fortify)
- Settings infrastructure (existing via Laravel Fortify)

**Risks & Blockers**:

- LLM prompt engineering quality may require iterations
- Complex UI for ordering comparison needs UX validation
- Dependency between FR-007 and FR-008 requires sequential completion

---

## User Stories

### Story 2.1: Create Your Prompt - 8 Points

**User Story**: As a user, I want to create structured prompts using templates, so that I can generate effective AI prompts without being an expert.

**Acceptance Criteria**:

- [ ] Prompt Builder page accessible from navigation
- [ ] Template library sidebar with categories (Writing, Coding, Analysis)
- [ ] Selecting template populates form fields
- [ ] Real-time preview updates as user types
- [ ] Form fields: Intent, Context, Input Variables, Output Format
- [ ] Input variables highlighted in preview with ${variable} syntax
- [ ] Inline validation on blur with error messages
- [ ] Save prompt to templates functionality
- [ ] Test prompt with connected LLM
- [ ] Prompt history visible in sidebar

**Reference Documents**:

- [UX Design Documentation](../docs/ux/ux-design-documentation.md) - Section 3.2, Section 5.2
- Feature Request: [FR-007 Create Your Prompt](../backlog/features/FR-007-create-your-prompt.md)

**Technical References**:

- Model: `PromptTemplate`
- Migration: `create_prompt_templates_table`
- Controller: `PromptBuilderController`
- Route: `prompts.*`
- Component: `PromptBuilder.vue`, `PromptTemplateLibrary.vue`
- Service: `PromptService`

**Story Points**: 8

**Priority**: 🟠 High

**Status**: ⭕ Not Started

**Backlog Reference**: [FR-007](../backlog/features/FR-007-create-your-prompt.md)

**Tasks**:

| Task ID | Task Description                            | Class/Method Reference    | Document Reference   | Status | Points | Assignee |
| ------- | ------------------------------------------- | ------------------------- | -------------------- | ------ | ------ | -------- |
| T-201   | Create PromptTemplate model and migration   | `PromptTemplate`          | FR-007 Technical     | ⭕     | 0.5    |          |
| T-202   | Create PromptBuilderController              | `PromptBuilderController` | FR-007 Technical     | ⭕     | 0.5    |          |
| T-203   | Implement PromptService with template logic | `PromptService`           | FR-007 Technical     | ⭕     | 1      |          |
| T-204   | Create PromptTemplateLibrary.vue            | `PromptTemplateLibrary`   | UX Doc - Section 5.2 | ⭕     | 1      |          |
| T-205   | Create PromptBuilder.vue main component     | `PromptBuilder`           | UX Doc - Section 5.2 | ⭕     | 1.5    |          |
| T-206   | Implement real-time preview functionality   | Preview rendering         | UX Doc - Pattern 6.2 | ⭕     | 1      |          |
| T-207   | Add template categories and filtering       | `TemplateStore`           | FR-007 AC            | ⭕     | 0.5    |          |
| T-208   | Implement form validation                   | VeeValidate/Zod           | UX Doc - Validation  | ⭕     | 0.5    |          |
| T-209   | Create save/load functionality              | `PromptController@store`  | FR-007 AC            | ⭕     | 0.5    |          |
| T-210   | Integrate with FR-006 LLM for testing       | `LlmService.generate()`   | FR-007 AC            | ⭕     | 0.5    |          |
| T-211   | Write unit tests for PromptService          | `PromptServiceTest`       | Sprint Planning      | ⭕     | 0.5    |          |

**Total Task Points**: 9

---

### Story 2.2: Generate Workflow - 13 Points

**User Story**: As a user, I want AI to generate workflow structures with personas, so that I can get expert-level workflow planning with clear reasoning.

**Acceptance Criteria**:

- [ ] Generate Workflow button accessible from Prompt Builder
- [ ] Loading state with progress indication during generation
- [ ] Display 3 ordering options with pros/cons comparison
- [ ] Each option shows: name, best use case, pros, cons, persona count, estimated time
- [ ] User can select preferred ordering
- [ ] Selected ordering expands to flow diagram
- [ ] Workflow Builder page with persona cards
- [ ] Drag-and-drop reordering of personas
- [ ] Edit persona: name, description, instructions, effort estimate
- [ ] Add custom persona to workflow
- [ ] Visual dependency arrows between personas
- [ ] Save workflow functionality
- [ ] Regenerate workflow option

**Reference Documents**:

- [UX Design Documentation](../docs/ux/ux-design-documentation.md) - Section 3.3, Section 5.3
- Feature Request: [FR-008 Generate Workflow](../backlog/features/FR-008-generate-workflow.md)

**Technical References**:

- Model: `Workflow`, `WorkflowPersona`, `WorkflowPersonaDependency`
- Migration: `create_workflows_tables`
- Controller: `WorkflowController`
- Route: `workflows.*`
- Component: `WorkflowGenerator.vue`, `WorkflowPersonaSelector.vue`, `WorkflowBuilder.vue`
- Service: `WorkflowGenerationService`
- Library: `vuedraggable` (for drag-and-drop)

**Story Points**: 13

**Priority**: 🟠 High

**Status**: ⭕ Not Started

**Backlog Reference**: [FR-008](../backlog/features/FR-008-generate-workflow.md)

**Tasks**:

| Task ID | Task Description                               | Class/Method Reference          | Document Reference   | Status | Points | Assignee |
| ------- | ---------------------------------------------- | ------------------------------- | -------------------- | ------ | ------ | -------- |
| T-301   | Create Workflow models and migrations          | `Workflow`, `WorkflowPersona`   | FR-008 Technical     | ⭕     | 1      |          |
| T-302   | Create WorkflowController                      | `WorkflowController`            | FR-008 Technical     | ⭕     | 0.5    |          |
| T-303   | Implement WorkflowGenerationService            | `WorkflowGenerationService`     | FR-008 Technical     | ⭕     | 1.5    |          |
| T-304   | Create LLM prompt for persona generation       | LLM prompt engineering          | FR-008 AC            | ⭕     | 1      |          |
| T-305   | Implement 3-ordering generation with pros/cons | `generateOrderings()`           | FR-008 AC            | ⭕     | 1      |          |
| T-306   | Create WorkflowPersonaSelector.vue             | `WorkflowPersonaSelector`       | UX Doc - Section 5.3 | ⭕     | 1.5    |          |
| T-307   | Create WorkflowGenerator.vue loading/display   | `WorkflowGenerator`             | UX Doc - Section 5.3 | ⭕     | 1      |          |
| T-308   | Create WorkflowBuilder.vue with drag-drop      | `WorkflowBuilder`               | UX Doc - Section 5.3 | ⭕     | 1.5    |          |
| T-309   | Implement vuedraggable for reordering          | `vuedraggable`                  | FR-008 AC            | ⭕     | 0.5    |          |
| T-310   | Create persona editing modal                   | `PersonaEditModal`              | FR-008 AC            | ⭕     | 0.5    |          |
| T-311   | Implement dependency visualization             | SVG/Canvas diagram              | FR-008 AC            | ⭕     | 1      |          |
| T-312   | Add custom persona creation                    | `WorkflowController@addPersona` | FR-008 AC            | ⭕     | 0.5    |          |
| T-313   | Implement save workflow functionality          | `WorkflowController@store`      | FR-008 AC            | ⭕     | 0.5    |          |
| T-314   | Write unit tests for WorkflowService           | `WorkflowServiceTest`           | Sprint Planning      | ⭕     | 0.5    |          |

**Total Task Points**: 14

---

## Sprint Summary

**Total Story Points**: 21  
**Total Task Points**: 23

**User Stories Summary**:

| Story | Feature            | Points | Status         |
| ----- | ------------------ | ------ | -------------- |
| 2.1   | Create Your Prompt | 8      | ⭕ Not Started |
| 2.2   | Generate Workflow  | 13     | ⭕ Not Started |

**Sprint Burndown**:

| Day | Points Completed | Remaining |
| --- | ---------------- | --------- |
| 1   |                  | 21        |
| 2   |                  |           |
| 3   |                  |           |
| 4   |                  |           |
| 5   |                  |           |

**Sprint Review Notes**:

- Demo Prompt Builder with template library
- Demonstrate real-time preview functionality
- Show workflow generation with 3-ordering comparison
- Review drag-and-drop workflow editing
- Collect feedback on persona editing UX

**Sprint Retrospective Notes**:

- **What went well?**
    - [To be filled after sprint]
- **What could be improved?**
    - [To be filled after sprint]
- **Action items for next sprint**
    - [To be filled after sprint]

---

## Definition of Done

- [ ] All acceptance criteria met for each story
- [ ] Code reviewed and approved by at least one reviewer
- [ ] All unit tests passing (>80% coverage)
- [ ] Widget/integration tests for Vue components
- [ ] No critical or high-priority bugs
- [ ] Documentation updated (README, code comments)
- [ ] Deployed to staging environment
- [ ] Product Owner accepted acceptance criteria

---

## Dependencies on Previous Sprint

| Dependency              | Status                | Impact                   |
| ----------------------- | --------------------- | ------------------------ |
| FR-006 LLM Connection   | Must be ✅ Complete   | Blocks all Sprint 2 work |
| Landing Page Components | Should be ✅ Complete | No blocking dependency   |

---

## Risk Mitigation

| Risk                               | Impact | Mitigation                                     |
| ---------------------------------- | ------ | ---------------------------------------------- |
| LLM persona generation quality     | High   | Iterate on LLM prompt; add human review option |
| Complex UI for ordering comparison | Medium | Use established patterns from UX documentation |
| Drag-and-drop complexity           | Medium | Use vuedraggable library; test thoroughly      |
| LLM API rate limits                | Medium | Implement caching and rate limiting            |

---

## Reference Documents

- [Implementation Order Guide](implementation-order.md) - Phase 2
- [UX Design Documentation](../docs/ux/ux-design-documentation.md) - UI/UX specs
- Sprint 1: [Landing Page & LLM Foundation](sprint-01-landing-page-llm-foundation.md)
- [Product Backlog](../backlog/product-backlog.md) - Feature prioritization

---

## Document History

| Version | Date       | Changes                          |
| ------- | ---------- | -------------------------------- |
| 1.0     | 2026-01-10 | Initial sprint planning document |
| 1.1     | 2026-01-10 | Updated with detailed tasks      |
