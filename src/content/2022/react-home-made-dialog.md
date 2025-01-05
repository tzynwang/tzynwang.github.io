---
title: 2022 第33週 學習筆記：手刻對話框元件
date: 2022-08-20 09:18:01
tag:
- [HTML]
- [React]
---

## 總結

參考了 [Material UI Dialog 的原始碼](https://github.com/mui/material-ui/blob/master/packages/mui-material/src/Dialog/Dialog.js)，刻了一個自用的對話框元件

- 除了使用 `classNames` 套件來管理元件的 css class name 外，目前暫時不需要其他的 dependency package
- 待改善：目前的設計還無法透過 props 傳入動畫樣式設定

原始碼：[https://github.com/tzynwang/react-home-made-dialog](https://github.com/tzynwang/react-home-made-dialog)
展示頁：[https://tzynwang.github.io/react-home-made-dialog/](https://tzynwang.github.io/react-home-made-dialog/)

## 元件設計

<script src="https://gist.github.com/tzynwang/eeb23c983ef8fcaac9b56699d7f59798.js"></script>

### DialogGround

- 對話框元件的背景，設定 `aria role` 為 `presentation` 代表此元件僅作為視覺表現用
  - MDN: This is done with the `presentation` role or its synonym role `none`, which declare that an element is being used **only for presentation** and therefore **does not have any accessibility semantics**.
- 負責監聽 `click` 與 `keydown` 事件，再根據 props 是否傳入 `disableCloseByBackdropClick` 與 `disableCloseByKeyPress` 來決定事件發生時是否要關閉對話框

### HomeMadeDialog

- 對話框本體，在這裡監聽 `transitionend` 事件
  - 偵測到 `dialogOpen` 轉變為 `false` 時，對元件的 css class 加上 `scopedStyle.unmountedAnimation` 執行 transition 動畫效果
  - 監聽到 transition 動畫效果結束時，將 state `mounted` 設定為 `false`，此時才將元件自畫面上移除
  - 透過以上流程，讓對話框元件先執行透明度轉變為 0 的動畫，動畫結束後，再移除對話框元件
- 另外，因為元件本身允許傳入所有 HTMLDivElement 原生的 attributes，故在透過 `...rest` 取得剩下所有的 props 後，將 `style`、`className` 與 `role` 的值複製一份到變數中，移除 `rest` 物件裡前述的鍵值，最後才使用 spread syntax 將原生 attributes 傳給 div 本身；移除對應鍵值是為了避免 spread syntax 覆蓋掉元件本身 `style`、`className` 與 `role` 的設定

### Portal

<script src="https://gist.github.com/tzynwang/41db5e893a77591dd4134420634dab45.js"></script>

- 使用 react-dom 提供的 `ReactDOM.createPortal` 來將元件掛載至指定 DOM 元件中，在這邊預設目的地為 `document.body`
- 將對話框元件掛載出去的好處是可以不受親代元件 `z-index` 或 `overflow: hidden` 限制元件的可見度；且將對話框掛載到另外一個平面節點上的話，可以在對話框本身需要重渲染時，重渲染的演算只需要處理該節點
  - 如果將對話框原地掛載到使用此元件的節點，有可能該節點處在巢狀結構深處，對話框需要重渲染時會連帶影響一整串節點

## 參考文件

- [MDN ARIA: presentation role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/presentation_role)
- [MDN: transitionend event](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionend_event)
- [StackOverFlow: React - animate mount and unmount of a single component](https://stackoverflow.com/questions/40064249/react-animate-mount-and-unmount-of-a-single-component)
