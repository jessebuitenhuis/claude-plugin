---
name: browser-verification
description: Test application functionality using browser automation. Use after implementation to verify user flows work correctly.
---

# Browser Verification Skill

Test the application using browser automation to verify functionality works as expected.

## Prerequisites

- Application must be running (npm run dev or equivalent)
- agent-browser skill must be available

## Process

1. **Start the application** if not already running
2. **Identify test cases** based on recent changes:
   - For new features: Test main user flows
   - For bug fixes: Verify the fix works
   - For UI changes: Check visual appearance
3. **Use agent-browser skill** to automate testing:
   ```
   Use Skill tool with skill="agent-browser"
   ```
4. **Verify critical paths**:
   - Login/logout (if applicable)
   - Main navigation
   - CRUD operations
   - Any feature-specific functionality
5. **Report findings** with screenshots and any issues discovered
