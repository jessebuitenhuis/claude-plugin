# Agent Skills Directory

This directory contains agent definitions that coordinate skills to accomplish specific workflows.

## Agent Structure

Each agent is defined as a markdown file with frontmatter specifying:

- **name**: Unique identifier for the agent
- **description**: What the agent does
- **model**: Which Claude model to use (sonnet, opus, etc.)
- **permissions**: Special permissions (e.g., acceptEdits)
- **skills**: List of skills this agent can use

## Available Agents

### implementator
Focused implementation agent that completes individual development tasks using TDD.

**Use when**: You need to implement a specific feature or fix with clear acceptance criteria.

**Skills**:
- development
- test
- backend
- frontend
- isolated-development

## Creating New Agents

1. Create a new `.md` file in this directory
2. Add frontmatter with agent metadata
3. Document the agent's role, workflow, and constraints
4. Reference relevant skills

## Agent vs Skill

- **Skills**: Reusable capabilities that can be invoked independently
- **Agents**: Coordinators that combine multiple skills with specific workflows and constraints
