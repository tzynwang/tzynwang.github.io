---
title: 2022 第3週 學習記錄：MUI Drawer 樣式客製
date: 2022-01-16 22:15:18
categories:
  - [MaterialUI]
tags:
---

## 總結

## 筆記
### 情境

### 實作
- classNames 作為 props 傳入
- 樣式參考 gist 中 theme.drawer.tx 的內容
  - Drawer 元件的通用外觀（padding、字體顏色與 word-break）設定在 MuiDrawer-paper 上
  - .MuiDrawer-root.small-drawer .MuiPaper-root 指定小型 drawer 外觀
  - .MuiDrawer-root.big-drawer .MuiPaper-root 指定大型 drawer 外觀

### 原始碼

<script src="https://gist.github.com/tzynwang/4d916ff4f58b6fb93be759fd2586a0c0.js"></script>

## 參考文件
- [MUI Drawer API: CSS](https://mui.com/api/drawer/#css)
