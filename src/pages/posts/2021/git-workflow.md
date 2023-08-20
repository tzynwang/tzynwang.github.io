---
layout: '@Components/pages/SinglePostLayout.astro'
title: Git workflow
date: 2021-02-19 11:03:13
tag:
  - [git]
---

## Summary of this post

A note for 2 types of the git workflow:

1. Create a GitHub repository first, then clone it to local to work
1. Work on local first, then create a GitHub repository to push local work to it

先`git clone`一個空的 repository 再開始本機作業會省事一點。

## Environment

```
git: 2.30.0.windows.2
os: Windows_NT 10.0.18363 win32 x64
```

## Workflow: git clone first

1. Create a repository on GitHub
1. Copy the repository URL `https://github.com/<username>/<repository-name>.git`
1. Launch cmd.exe, move to the preferred location, run `git clone <repository URL>`
1. Move to the folder by `cd <repository-name>`
1. Complete the work in local folder, run `git add .` and `git commit`
1. Run `git push` to push the local work to the GitHub repository

Note: no need to config the `remote` and `branch` manually, `git clone` will take care these.
先`git clone`一個空的 repository 可以省略手動設定 remote 跟 branch 的步驟。

## Workflow: local work first

1. Complete the work locally
1. Create a repository on GitHub
1. Run `git init` in the local working folder
1. Run the following command to add remote URL: `git remote add <short-name-for-repository> <url-for-repository>`
   For example: `git remote add origin https://github.com/tzynwang/hello.git`
1. Run `git add .` and `git commit`
1. Run `git push --set-upstream origin master` to push local content to GitHub repository

Note: need to config `git remote` and `git push --set-upstream` manually
如果先在本機執行作業前沒有先`git clone`一個空的 repository，那麼`git init`後必須手動執行`git remote add`，第一次`git push`時也須加上`--set-upstream origin master`

## Reference

- [Git Basics - Working with Remotes](https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes)
- [Git Guides: Git Remote](https://github.com/git-guides/git-remote)
- [Git Guides: Git Push](https://github.com/git-guides/git-push)
