---
layout: '@Components/pages/SinglePostLayout.astro'
title: MUI Drawer 樣式客製
date: 2022-01-16 22:15:18
tag:
  - [MaterialUI]
---

## 總結

除了 `Drawer` `元件以外，Paper` 也會被 `Select` 等 MUI 元件共用，不適合直接把樣式設定在 `.MuiPaper-root` 上；故在處理 `Drawer` 元件的外觀時，傳入額外的 `className` 來處理 `Paper` 在不同 `Drawer` 元件下的客製外觀

## 筆記

- `classNames` 作為 `props` 傳入元件中
- 樣式設定參考 gist 中 `theme.drawer.tx` 的內容
  - `Drawer` 元件的通用外觀（padding、字體顏色與 word-break）設定在 `.MuiDrawer-paper` 上
  - `.MuiDrawer-root.small-drawer .MuiPaper-root` 指定小型 `Drawer` 外觀
  - `.MuiDrawer-root.big-drawer .MuiPaper-root` 指定大型 `Drawer` 外觀

![small drawer](/2022/mui-drawer-style/small-drawer.png)

![big drawer](/2022/mui-drawer-style/big-drawer.png)

## 原始碼

<script src="https://gist.github.com/tzynwang/4d916ff4f58b6fb93be759fd2586a0c0.js"></script>

## 參考文件

- [MUI Drawer API: CSS](https://mui.com/api/drawer/#css)
