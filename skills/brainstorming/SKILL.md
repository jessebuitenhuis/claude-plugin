---
name: brainstorming
description: "You MUST use this before any creative work - creating features, building components, adding functionality, or modifying behavior. Explores user intent, requirements and design before implementation."
---

# Brainstorming Ideas Into Designs

Turn ideas into fully formed designs through collaborative dialogue.

## Process

**1. Understand the Idea**
- Check project state (files, docs, recent commits)
- Ask questions one at a time to refine the idea
- Prefer multiple choice, but open-ended is fine too
- Focus on: purpose, constraints, success criteria

**2. Explore Approaches**
- Propose 2-3 different approaches with trade-offs
- Present options conversationally with your recommendation
- Lead with your recommended option and explain why

**3. Present the Design**
- Break into sections of 200-300 words
- Ask after each section whether it looks right so far
- Cover: architecture, components, data flow, error handling, testing
- Be ready to clarify if something doesn't make sense

**4. Document**
- Write validated design to `docs/plans/YYYY-MM-DD-<topic>-design.md`
- Commit to git
- Ask: "Ready to set up for implementation?"

**5. Handoff**
- Use `scripts/setup-worktree.sh` to create isolated workspace
- Use the `planning` skill to create detailed implementation plan
