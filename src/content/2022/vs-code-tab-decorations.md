---
title: VSCode Tab Decorations
date: 2022-05-02 12:20:13
tag:
  - [VSCode]
---

## 總結

VSCode 在 1.53 版開始支援 Tab Decoration 功能，開啟後即可在分頁上顯示 git 或 diagnostics 相關的視覺狀態提示

> Two new settings allow you to configure whether editor tabs show decorations, such as **git status** or **diagnostics**.

## 版本與環境

```
VScode: 1.53
```

## 開啟步驟

1. 熱鍵組合 `⌘,` 或 `Code >> Preferences >> Settings`，於 `Search settings` 欄位輸入關鍵字 `workbench decorations`
1. 勾選 `Workbench › Editor › Decorations: Badges` 與 `Workbench › Editor › Decorations: Colors` 此二選項（分別在分頁上出現**提示徽章**與**顏色 highlight**效果

效果如下：

![demo](/2022/vs-code-tab-decorations/demo.png)

## 參考文件

- [vscode-docs: January 2021 (version 1.53)](https://github.com/microsoft/vscode-docs/blob/vnext/release-notes/v1_53.md#tab-decorations)
- [VSCode: enable or disable editor tabs modified since last git commit, show git status with modified tabs colors](https://stackoverflow.com/questions/58377383/vscode-enable-or-disable-editor-tabs-modified-since-last-git-commit-show-git-s)
