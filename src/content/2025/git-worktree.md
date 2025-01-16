---
title: 用 git worktree 新增資料夾 (X) 獨立工作區 (O)
date: 2025-01-16 19:12:56
tag:
  - [git]
banner: /2025/git-worktree/wahid-khene-axXa-pSVaIY-unsplash.jpg
summary: 使用 git worktree 可以從同一個 repo 切出多個彼此完全獨立的開發環境，需要同時開發多種功能，或是幫專案更換基礎建設時都滿好用的 😇
draft:
---

除了 `git stash` 和 `git checkout -b <new-branch>` 之外，也可考慮使用 `git worktree` 來處理與專案基礎建設有關的改動，避免做到一半需要切換環境時一陣手忙腳亂。

## 語法

新增：

```bash
git worktree add -b <branch> <path>
```

- `-b <branch>` 代表直接切出一個名為 `branch` 的新分支
- `<path>` 代表新開發環境（新資料夾）的路徑

移除：

```bash
git worktree remove <worktree>
```

移除名為 `<worktree>` 的 worktree，注意**硬碟中的資料夾也會跟著一起被刪掉**。

## 範例

```bash
git worktree add -b feature/replace-webpack-by-vite ../use-vite
```

執行以上範例代表著：

- 我建立了一個與目前 repo 平行的新資料夾，名為 `use-vite`
- 我在 `use-vite` 切出一個名為 `replace-webpack-by-vite` 的新分支

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

之後不管我在 `use-vite` 這個資料夾如何瞎搞，都完全不會影響 `repo` 的內容。相較之下，如果透過「建立一個新分支」來將專案從 webpack 換成 vite，我就必須在每次切換分支後重新安裝套件（因為這兩組分支依賴的套件互相衝突）。而使用 `git worktree` 建立新環境就不需要煩惱這件事 😇

## 參考文件

- [git worktree](https://git-scm.com/docs/git-worktree)
- [What would I use git-worktree for?](https://stackoverflow.com/questions/31935776/what-would-i-use-git-worktree-for)
