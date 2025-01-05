---
title: 2022 第17週 實作筆記：RWD 側欄
date: 2022-04-29 22:23:52
tag:
- [MaterialUI]
- [React]
---

## 總結

參考了 Material UI 的 Drawer 設計刻出 RWD App Bar

![手機版面](/2022/react-rwd-app-bar/demo-mobile.png)

![平板版面](/2022/react-rwd-app-bar/demo-tablet.png)

![桌機版面](/2022/react-rwd-app-bar/demo-desktop.png)

展示：[https://tzynwang.github.io/rwd-app-bar/](https://tzynwang.github.io/rwd-app-bar/)
原始碼：[https://github.com/tzynwang/rwd-app-bar/tree/feature/rwd-bar](https://github.com/tzynwang/rwd-app-bar/tree/feature/rwd-bar)

## 筆記

### 設計說明

- 參考日前經手專案的版面設計，文字規格如下：
  - 手機版面：頂部左側（menu icon）點開後出現一般選項清單，右側（avatar）點開後出現使用者相關選項的清單；在手機版面下，清單要蓋滿頂部以外的版面空間
  - 平板版面：預設清單收合在左側，點擊後展開，並上方出現 logo；而 avatar 移動至畫面右上角
  - 大版面：清單固定在展開狀態，移除收合清單的按鈕（平板版面清單右上角）

### 開發思路

- 分拆為以下兩個元件：
  - Bar：包含 BarHeader 與 BarBody 兩個部位
    - BarHeader 僅會出現在手機版面最上方
    - BarBody（一般選項清單）：包含 News、Archives、Tags 與 Contact Us 這四個選項，透過 CSS 設定在大小版面呈現不同效果，並在平板、桌機版面追加 logo Row
  - AvatarWithMenu：如其名，包含 Avatar 與 Menu，兩者同捆為一個元件傳入 BarHeader，或搭配 Material UI 的 `useMediaQuery` 在平板、桌機版面的情況下出現於畫面右上角
    - Menu（使用者相關選項的清單）：包含 Setting 與 Log Out，手機版時呈現滿版，平板與桌機版面則固定在 avatar 下方位置

### CSS 筆記

- 使用 `transform: translate()` 搭配 `transition` 做出位移動畫效果
- 平板版面的「收合」狀態是透過 `width: 60px` 搭配 `overflow: hidden` 與 `white-space: nowrap` 組合出來的

### Material UI 相關

<script src="https://gist.github.com/tzynwang/1e640db6c3d9709b88141076c2c32c1b.js"></script>

透過 `<CssBaseline />` 與 `createTheme` 修改 MUI default theme 的 `typography` 內容來調整專案的整體字型

<script src="https://gist.github.com/tzynwang/fc6878f235ef58d87d02ea5025884626.js"></script>

使用 Mui `styled()` 時可傳入自定義 `props`，此 Logo 元件可透過 `props: black` 來控制字體顏色

## 參考文件

- [MUI: Drawer](https://mui.com/material-ui/react-drawer/#main-content)
- [MUI API: styled](https://mui.com/system/styled/#api)
- [Can you pass custom props to Material-UI v5 `styled()` components?](https://stackoverflow.com/questions/68814908/can-you-pass-custom-props-to-material-ui-v5-styled-components)
