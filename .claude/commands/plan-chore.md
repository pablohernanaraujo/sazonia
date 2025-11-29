# Chore Planning

Create a new plan in ai/plans/chore/\*.md to resolve the `Chore` using the exact specified markdown `Plan Format`. Follow the `Instructions` to create the plan use the `Relevant Files` to focus on the right files. Follow the `Report` section to properly report the results of your work.

## Instructions

- IMPORTANT: You're writing a plan to resolve a chore based on the `Chore` that will add value to the application.
- IMPORTANT: The `Chore` describes the chore that will be resolved but remember we're not resolving the chore, we're creating the plan that will be used to resolve the chore based on the `Plan Format` below.
- You're writing a plan to resolve a chore, it should be simple but we need to be thorough and precise so we don't miss anything or waste time with any second round of changes.
- Create the plan in the `ai/plans/chore/*.md` file. Name it appropriately based on the `Chore`.
- Use the plan format below to create the plan.
- Research the codebase and put together a plan to accomplish the chore.
- IMPORTANT: Replace every <placeholder> in the `Plan Format` with the requested value. Add as much detail as needed to accomplish the chore.
- Use your reasoning model: THINK HARD about the plan and the steps to accomplish the chore.
- Respect requested files in the `Relevant Files` section.
- Start your research by reading the `README.md` file.
- When you finish creating the plan for the chore, follow the `Report` section to properly report the results of your work.

## Relevant Files

Focus on the following files:

- `README.md` - Contains the project overview and instructions.
- `.claude/rules/**` - Contains project conventions and patterns for API design, component architecture, routing, styling, authentication, TypeScript
  usage, and overall project structure
- `src/**` - Contains the codebase.

Ignore all other files in the codebase.

## Plan Format

```md
# Chore: <chore name>

## Chore Description

<describe the chore in detail>

## Relevant Files

Use these files to resolve the chore:

<find and list the files that are relevant to the chore describe why they are relevant in bullet points. If there are new files that need to be created to accomplish the chore, list them in an h3 'New Files' section.>

## Step by Step Tasks

IMPORTANT: Execute every step in order, top to bottom.

<list step by step tasks as h3 headers plus bullet points. use as many h3 headers as needed to accomplish the chore. Order matters, start with the foundational shared changes required to fix the chore then move on to the specific changes required to fix the chore. Your last step should be running the `Validation Commands` to validate the chore is complete with zero regressions.>

## Validation Commands

Execute every command to validate the chore is complete with zero regressions.

<list commands you'll use to validate with 100% confidence the chore is complete with zero regressions. every command must execute without errors so be specific about what you want to run to validate the chore is complete with zero regressions. Don't validate with curl commands.>

- Run tests to validate the chore is complete with zero regressions

## Notes

<optionally list any additional notes or context that are relevant to the chore that will be helpful to the developer>
```

## Chore

$ARGUMENTS

## Report

- Summarize the work you've just done in a concise bullet point list.
- Include a path to the plan you created in the `ai/plans/chore/*.md` file.

## Execute Plan

After creating the plan and reporting, evaluate the plan content and execute with the appropriate specialized agent:

### Agent Selection Criteria

Analyze the plan you just created and select the agent based on the primary technology involved:

1. **Firebase-related chores** - Use `subagent_type="general-purpose"` with firebase expertise when the plan involves:
   - Firebase Authentication, Firestore, Firebase Storage
   - Firebase Admin SDK, Firebase Security Rules
   - Real-time listeners, Firebase client patterns
   - Any Firebase configuration or integration

2. **Next.js-related chores** - Use `subagent_type="nextjs-testing-architect"` when the plan involves:
   - Next.js App Router, routing, server components
   - React components, hooks, forms
   - Vitest testing setup, Storybook
   - Build configuration, TypeScript setup
   - npm scripts, package.json modifications
   - General project tooling (ESLint, Husky, etc.)

3. **General/Other chores** - Use `subagent_type="general-purpose"` for anything else

### Execution Instructions

- Use the Task tool with the selected `subagent_type`
- Pass the full path to the plan file you just created
- Instruct the agent to read the plan and execute every step in order
- The agent should follow the `Step by Step Tasks` section exactly
- The agent must run all `Validation Commands` at the end to confirm zero regressions
- Wait for the agent to complete and report the results back to the user
