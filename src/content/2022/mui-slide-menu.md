---
title: 2022 第16週 實作筆記：Mui 滑動式清單
date: 2022-04-23 11:35:33
tag:
  - [MaterialUI]
---

## 總結

使用 MuiMenu 與 MuiPaper 搭配組合出有滑動效果的清單元件，支援 RWD

![桌機版本](/2022/mui-slide-menu/demo-desktop.png)

![手機版本](/2022/mui-slide-menu/demo-mobile.png)

## 版本與環境

```
@mui/material: 5.6.2
```

## 筆記

### 開發思路

- 對 Mui theme 中的各個元件加上 `styleOverrides` 搭配開發時自定義的 css class names 處理排版效果
  - 大多數的 Mui 元件都有支援 `classes` props，搭配各元件的 API 說明即可將自定義的 css classes names 傳入對應的元件層
  - 以 [MuiMenu](https://mui.com/material-ui/api/menu/#css) 為例，其 `classes` props 支援三組 key：root、paper 與 list；亦即在 MuiMenu 的 classes 傳入 `{{ root: '___CustomRootClass___', paper: '___CustomPaperClass___', list: '___CustomListClass__' }}` 的話，最終 MuiMenu 的 css class names 會長這樣：
  ```html
  <div
    class="MuiModal-root ___CustomRootClass___ MuiPopover-root MuiMenu-root css-10nakn3-MuiModal-root-MuiPopover-root-MuiMenu-root"
  >
    <div
      class="MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation1 ___CustomPaperClass___ MuiMenu-paper MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation8 MuiPopover-paper css-1poimk-MuiPaper-root-MuiMenu-paper-MuiPaper-root-MuiPopover-paper"
    >
      <ul
        class="MuiList-root MuiList-padding ___CustomListClass__ MuiMenu-list css-6hp17o-MuiList-root-MuiMenu-list"
      >
        <! –– list items ––>
      </ul>
    </div>
  </div>
  ```
  - `___CustomRootClass___` 與 `MuiMenu-root` 並列
  - `___CustomPaperClass___` 與 `MuiMenu-paper` 並列
  - `___CustomListClass__` 與 `MuiMenu-list` 並列
  - 接著就可以在 mui theme 中透過 `styleOverrides` 來進行樣式設定了
- 使用 Mui `useMediaQuery` hook 判定目前的視區是否進入小版狀態，並根據此狀態替換元件的 css class names
- 套用 Mui `<Slide />` 元件在小版面時做出滑動效果
  - 在「非小版面」的狀態下設定 props `in` 恆常為 `true` 避免滑動發生（確保元件會固定顯示在畫面上）
  - 使用 props `container` 控制滑動的視覺效果只會發生在 `container` 容器中

### 原始碼

<script src="https://gist.github.com/tzynwang/a72ae5095969ca85ca877b86837f83a1.js"></script>

### 實作筆記

- 根據 `parent` 的值來過濾出 `dynamicChildList` 內容；並且 `parent` 為 `null` 時，右側欄位不會渲染出任何內容（在使用者未點擊親類別前，不顯示子類別）
- 透過 Mui `Checkbox` 元件的 `indeterminate` props 處理「某一親類別下的子類別沒有被全數勾選時」的視覺效果；邏輯如下：
  - 如果 `checkedChild` 陣列中「屬於某一親類別的子類別數量 !== 屬於該親類別的全體子類別數量」的話，代表該親類別處於 `indeterminate` 狀態
  - 如果`checkedChild` 陣列中「屬於某一親類別的子類別數量 === 屬於該親類別的全體子類別數量」的話，代表該親類別下的子類別已經全部被使用者勾選了，故該親類別應進入 `checked` 狀態
- 在使用者勾選親類別時，先將所有屬於該親類別的子類別都加入 `checkedChild` 陣列中，再透過 lodash 的 `uniqBy` 移除重複加入子類別
- 透過 lodash 的 `find` 功能判定某一子類別是否存在於 `checkedChild` 中，進而決定該子類別的 Mui `Checkbox` 元件是否應進入 `checked` 狀態

## 參考文件

- [MaterialUI: Customization/Components](https://mui.com/material-ui/customization/theme-components/)
- [MaterialUI: Menu](https://mui.com/material-ui/react-menu/#main-content)
- [MaterialUI: Transition/Slide](https://mui.com/material-ui/transitions/#slide)
- [MaterialUI: Paper](https://mui.com/material-ui/react-paper/#main-content)
