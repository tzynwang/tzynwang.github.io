---
title: 用 git worktree 新增資料夾 (X) 獨立工作區 (O)
date: 2025-01-16 19:12:56
tag:
  - [git]
banner: /2025/git-worktree/wahid-khene-axXa-pSVaIY-unsplash.jpg
summary: 使用 git worktree 可以從同一個 repo 切出多個彼此完全獨立的開發環境，需要同時開發多種功能，或是幫專案更換基礎建設時都滿好用的 😇
draft:
---

使用 `git worktree` 可以從同一個 repo 切出多個完全獨立的開發環境，幫專案更換基礎建設時特別好用 🤞

## 語法

新增：

```bash
git worktree add [-b <branch>] <path>
```

`-b <branch>` 代表切出一個名為 `<branch>` 的新分支。如果省略，則新分支會以 `<path>` 的最後一段命名。

> `git worktree add <path>` automatically creates a new branch whose name is the final component of `<path>` (a branch name after `$(basename <path>)`)... For instance, `git worktree add ../hotfix` creates new branch `hotfix` and checks it out at path `../hotfix`.[^1]

`<path>` 代表 worktree 要落腳的新（資料夾）位置。

移除：

```bash
git worktree remove [-f] <path>
```

這個指令會直接移除硬碟裡的資料夾，但不會移除任何 git 分支。如果確定要移除「包含未 commit 內容」的 worktree，就在下指令時加上 `-f`。

> Only clean worktrees (no untracked files and no modification in tracked files) can be removed. Unclean worktrees or ones with submodules can be removed with `--f`.[^2]

## 範例

假設我在資料夾 `repo` 內執行以下指令：

```bash
git worktree add -b feature/replace-webpack-by-vite ../use-vite
```

會發生兩件事：

- 建立一個與目前資料夾 `repo` 平行的新資料夾 `use-vite`
- 在 `use-vite` 切出一個名為 `feature/replace-webpack-by-vite` 的新分支

指令執行前後的硬碟樹狀圖如下：

```bash
# before script
.
└── ./repo

# after script
.
├── ./repo
└── ./use-vite
```

之後不管我在 `use-vite` 這個資料夾如何瞎搞，都完全不會影響 `repo` 的內容。相較之下，如果透過「建立一個新分支」來將專案從 webpack 換成 vite，我就必須在每次切換分支後重新安裝套件（因為這兩組分支依賴的套件互相衝突）。而使用 `git worktree` 建立新環境就不需要煩惱這件事 🌚

## 參考文件

- [git worktree](https://git-scm.com/docs/git-worktree)
- [What would I use git-worktree for?](https://stackoverflow.com/questions/31935776/what-would-i-use-git-worktree-for)

[^1]: [git-worktree # description](https://git-scm.com/docs/git-worktree#_description)

[^2]: [git-worktree # commands -- remove](https://git-scm.com/docs/git-worktree#Documentation/git-worktree.txt-remove)
