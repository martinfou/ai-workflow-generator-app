# Feature Request: FR-007 - Create Your Prompt

**Status**: ⭕ Not Started  
**Priority**: 🟠 High  
**Story Points**: 8  
**Created**: 2026-01-10  
**Updated**: 2026-01-10  
**Assigned Sprint**: [Sprint Number or "Backlog"]

## Description

Implement a prompt creation interface that helps users structure their prompts effectively for AI models. The interface should guide users through creating well-structured prompts that clearly communicate their intent, improving AI response quality. This feature includes template suggestions, real-time prompt preview, and intent clarification helpers.

## User Story

As a user,
I want to use an intuitive interface to structure my prompts for AI models,
so that I can create clear, effective prompts that produce high-quality AI responses without needing to be an expert prompt engineer.

## Acceptance Criteria

- [ ] Users can access a prompt creation interface
- [ ] Interface provides templates for common prompt types
- [ ] Real-time preview shows how the prompt will be interpreted
- [ ] Users can define intent, context, and expected output format
- [ ] Interface validates prompt structure before submission
- [ ] Users can save and reuse their prompt templates
- [ ] Users can test prompts against their connected LLM
- [ ] Prompt history is stored for user's created prompts

## UX Requirements

### User Flow

1. User navigates to Prompts → New Prompt
2. User sees template library in left sidebar
3. User selects template or starts blank
4. User fills in form fields (intent, context, input variables, output format)
5. Real-time preview updates as user types
6. User can test prompt with connected LLM
7. User saves prompt to templates

### Interface Specifications

- Two-column layout: Templates sidebar (25%), Builder main (75%)
- Preview panel below builder (full-width)
- Template categories: Writing, Coding, Analysis, Custom
- Input variables highlighted in preview with ${variable} syntax
- Validation errors shown inline below each field
- Loading state during LLM testing

### Interaction Patterns

- Progressive disclosure for advanced options
- Toast notifications for save/test feedback
- Inline validation on blur
- Template application replaces form content

### Accessibility

- Form fields properly labeled and associated
- Preview panel announced when updated
- Keyboard navigation between form and preview
- Focus management during template selection

### Responsive Design

- Mobile: Single column, templates above builder
- Tablet: Two-column, stacked preview
- Desktop: Full two-column with side preview

## Business Value

- Lowers barrier to entry for non-technical users
- Improves AI response quality through structured prompting
- Reduces prompt engineering knowledge required
- Enables users to create consistent, high-quality prompts
- Differentiates product with guided prompt creation experience

## Technical Requirements

- Vue.js component for prompt builder interface
- Template system for common prompt patterns
- Real-time preview rendering
- Integration with LLM connection feature (FR-006)
- Database storage for user prompt templates
- Prompt testing/validation endpoint
- Responsive design for mobile and desktop

## UX References

- [UX Design Documentation](../ux/ux-design-documentation.md)
- Wireframe: Prompt Builder Interface (Section 5.2)
- User Flow: Prompt Creation (Section 3.2)
- Pattern: Progressive Disclosure (Section 6.1)
- Pattern: Real-Time Validation (Section 6.2)

## Technical References

- Model: `PromptTemplate`
- Controller: `PromptBuilderController`
- Table: `prompt_templates`
- Routes: `prompts.*`
- Component: `PromptBuilder.vue`

## Dependencies

- LLM Connection feature (FR-006) must be implemented first

## Notes

- Consider adding prompt sharing capabilities in future
- May want to add prompt optimization suggestions
- Consider prompt versioning for improved iterations
- Could integrate with prompt libraries from community

## History

- 2026-01-10 - Created
