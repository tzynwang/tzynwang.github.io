---
title: gh-pages 部屬選項
date: 2022-06-01 21:57:11
categories:
- [git]
tags:
---

## 總結
日前有將展示網站部屬到額外 repo 的需求，而 `gh-pages` 有提供選項來將 build 好的內容直接部屬到指定的 repo 中，此篇是記錄相關操作說明的筆記

## 版本與環境
```
gh-pages: 4.0.0
```

## 筆記

<script src="https://gist.github.com/tzynwang/523bae300542918954d1409c7fe51ad0.js"></script>

- `publish` 最多接收三個參數： `dir` 、 `options` 與 `callback`
- `dir` 指定打包完畢（已經 build 完）內容的資料夾名稱
- options 在本次部屬時有額外指定兩個參數：
  - `repo` 指定內容要被推到哪一個 repository ，原文說明：If instead your script is not in a git repository, or **if you want to push to another repository**, you can **provide the repository URL** in the repo option.
  - `remote` 指定要被 git push 的是哪一支 `remote branch` ，原文說明：The name of the remote you'll be pushing to. The **default is your 'origin' remote**, but this can be configured to push to any remote.


## 參考文件
- [gh-pages: options](https://github.com/tschaub/gh-pages#options)