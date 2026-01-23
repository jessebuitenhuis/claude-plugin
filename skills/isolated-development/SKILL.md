---
name: isolated-development
description: Executes a development task in an isolated git worktree and creates a pull request when finished. Use this when working on parallel tasks that can be merged back individually.
---

## 1. Setup

Before starting the work, even when the work is very simple, ALWAYS do this:

- Create a git worktree in the .worktrees folder
- Run npm install

## 2. Work

Execute your task as instructed

## 3. Publish

After the work is done:

- Commit your work
- Push the commits
- Create a pull request

## 4. Cleanup

If all changes have been pushed and the pull request has been created succesfully, remove the git worktree.
