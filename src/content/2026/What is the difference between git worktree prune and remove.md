---
title: What is the difference between git worktree prune and remove?
slug: git-worktree-prune-vs-remove
date: 2025-03-24 07:40:33
tag:
  - []
banner:
summary:
---

## TL;DR

- `git worktree prune` only deletes the worktree metadata.[^1]
- `git worktree remove <worktree>` deletes the worktree and its metadata.

By default, worktree metadata will automatically be deleted after 3 months; unless your git config `gc.worktreePruneExpire` is set to "never".[^2]

## Recipe for verifying the difference

### What happens when I delete the worktree manually?

1. Open the terminal, navigate to a git repository.
2. Run `git worktree add ../test-tree`.
3. Run `git worktree list`, you'll see "test-tree" in the list.
4. Run `rm -rf ../test-tree` to delete the worktree folder.
5. Run `git worktree list`, you'll still see "test-tree" in the list.
6. Run `git worktree prune` to delete the metadata of "test-tree".
7. Run `git worktree list`, "test-tree" is no longer listed.

### What happens when I run `git worktree remove`?

1. Open the terminal, navigate to a git repository.
2. Run `git worktree add ../test-tree`.
3. Run `git worktree list`, you'll see "test-tree" in the list.
4. Run `git worktree remove ../test-tree`.
5. Run `git worktree list`, "test-tree" is no longer listed.

[^1]: See [Git worktree prune - what it does?](https://stackoverflow.com/a/48347149/15028185)

[^2]: See [gc.worktreePruneExpire](https://git-scm.com/docs/git-config#Documentation/git-config.txt-gcworktreePruneExpire)
