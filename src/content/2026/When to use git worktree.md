---
title: When to use git worktree
slug: git-worktree-use-case
date: 2025-03-24 07:40:33
tag:
  - []
banner:
summary:
---

## Use cases in frontend projects

- You need to work on different topics simultaneously.[^1]
- You need to switch the developing environment, and there are breaking changes before and after. For example;
  - The tech-stack is totally different, you need to reinstall the dependencies, re-config the environment variables after switching.
  - The folder structure changes a lot, your IDE needs to re-index them.
- You don't want to spend time on syncing the history between each repository that created by `git clone` (since `git worktree` make each tree share the same `.git`).[^2]

## Further reading

<!-- TODO -->

[[How to git stash unmerged path | How to git stash unmerged paths (new added files)]]

[^1]: I especially like the idea from [What would I use git-worktree for?](https://stackoverflow.com/questions/31935776/what-would-i-use-git-worktree-for) that use it to review teammates' pr/mr.

[^2]: See [I have no idea what use case is satisfied by git worktree...](https://news.ycombinator.com/item?id=19007761) and [git worktrees vs "clone --reference"](https://stackoverflow.com/questions/48307968/git-worktrees-vs-clone-reference).
