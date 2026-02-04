## Session 4 feb 19:43

Status: Pending

- Did not use the executor skill automatically
- When asked to use the skill, it loaded it
- Did not start any subagents (implementator Tasks), but did all the work in the main chat
- Created a isolated worktree at the beginning, under the path .worktree/feature/account-navigation-actions. The feature folder is not needed and adds a layer too much
- During environment setup the tests failed, but it accepted this and continued. This should not happen, this is an explicit guardrail
- After completing the issue, the build failed and it reasoned that this was OK since it was a worktree where the db was not setup. This is not OK, this should be an explicit guardrail
- No verify-task was done after each task, and no code-review and spec-compliance was done after the milestone (entire task list) was completed. This should be more clear in step 4 of the `implementator` skill and the `exector` skill
- It gives me list of next steps: review the implementation, test manually (requires db), commit changes, create PR, cleanup worktree. These actions should be part of the executor and/or implementator and/or encapsulated in specific skills / scripts.
- It figures out to run these commands after I asked to create a db in the worktree: Bash(npx prisma migrate dev && npx prisma db seed 2>&1)
- When manually running the app (npm run dev) it gave an error right away. This should be one of the steps to verify if a milestone has been completed. Does the app run? Also using agent-browser in a separate subagent to test the functionality will help a lot with verifying the work of the agent
- Asking to run agent-browser as a subagent does not work - it does not understand what agent-browser is and then it gets confused and continues in the main thread. Creating a few agent types with explicit loaded skills might help - running the verify-ui agent with the agent-browser skill preloaded might be more future proof. For the agent-browser this might include a short instruction on what it is and that it can start with `npx agent-browser --help` to get a list of content
-
