# Phase 2 Integration Tests

## Test Scenarios

### Scenario 1: Brainstorm → Plan Flow
1. Invoke brainstorming skill with feature idea
2. Verify Socratic questioning works correctly
3. Verify design document creation
4. Verify handoff to planning skill
5. Verify plan includes milestones and tasks

### Scenario 2: Plan → Executor Handoff
1. Invoke planning skill with approved design
2. Verify plan structure (header, tasks, steps)
3. Verify execution handoff options presented
4. Verify executor skill reference in plan

### Scenario 3: Script Integration
1. Verify brainstorming references setup-worktree.sh
2. Verify planning references verify-task and verify-milestone
3. Test script execution with sample projects

## Verification Checklist
- [ ] No "Phase 1 placeholder" notes remain in skills
- [ ] No broken Superpowers references
- [ ] All script paths are correct
- [ ] Milestone structure present in planning output
- [ ] Verification hooks integrated

## Expected Outcomes
- Skills work with new architecture
- Deterministic layer integration works
- Ready for Phase 3 (executor skill implementation)
