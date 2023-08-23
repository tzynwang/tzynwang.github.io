---
layout: '@Components/pages/SinglePostLayout.astro'
title: JavaScript 快速筆記：Event.currentTarget
date: 2022-08-17 22:22:53
tag:
  - [JavaScript]
---

## 總結

在觀摩 [material-ui Dialog 原始碼](https://github.com/mui/material-ui/blob/master/packages/mui-material/src/Dialog/Dialog.js)的時候發現過去沒用過的 property `Event.currentTarget`，記錄一下與 `Event.target` 的差異

## 筆記

- Event.currentTarget：實際帶有 eventListener 的 DOM 元素
  - MDN: `Event.currentTarget` always refers to the element to which **the event handler has been attached**, as opposed to `Event.target`, which identifies the element on which the event occurred and which may be its descendant.
- Event.target：事件真正的起始點
  - MDN: the reference to the object onto **which the event was dispatched**

<iframe src="https://codesandbox.io/embed/nice-shadow-ftlbqb?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="nice-shadow-ftlbqb"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

DEMO CODE 解說：

- 分別在 inner box 與 outer wrapper 綁上 click 監聽（32-33 行），並透過 `stopPropagation` 阻止事件向親層冒泡（14 行）
- 點擊 inner box 時，事件停留在 inner 層，`e.target` 與 `e.currentTarget` 皆會是 inner box
- 點擊 middle wrapper 時，點擊事件本身（`e.target`）發生在 middle wrapper，但冒泡到 outer wrapper 層，被 outer wrapper 的事件監聽捕捉到，`e.currentTarget` 會是帶有監聽器的 outer wrapper
  - 雖然在 function setTarget 中加入 `stopPropagation`，但在 middle wrapper 發生的事件，首先要先浮到 outer wrapper 被捕捉，才會有後續的 `stopPropagation`；middle wrapper 本身沒有任何事件監聽，事件不會在這一層被取消
- 點擊 outer wrapper 的邏輯與點擊 inner box 雷同，`e.target` 與 `e.currentTarget` 都會是 outer wrapper

### bonus track: Event.stopImmediatePropagation

搜尋相關資料時連帶找到 `Event.stopImmediatePropagation()`，與 `stopPropagation` 的差異在：如果一個 DOM 元素被加上複數個同樣事件類型但不同 handler function 的監聽器，那麼各個 handler function 會根據其在程式碼的順序由上到下依序執行，此時如果在 handler function 中呼叫 `stopImmediatePropagation` 則剩下來的 handler function 都不會被觸發

> MDN: If several listeners are attached to the same element for the same event type, they are **called in the order in which they were added**. If `stopImmediatePropagation()` is invoked during one such call, no remaining listeners will be called.

<iframe src="https://codesandbox.io/embed/jolly-bhabha-5zfi6b?fontsize=14&hidenavigation=1&theme=dark"
    style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
    title="jolly-bhabha-5zfi6b"
    allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
    sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  ></iframe>

於上述 DEMO CODE 中的 `funcTwo` 呼叫了 `e.stopImmediatePropagation()`，故 `funcThree` 與 `funcFour` 都沒有被執行，useState 變數 `result` 中只有前兩個 functions 執行完的結果

## 參考文件

- [MDN: Event.currentTarget](https://developer.mozilla.org/en-US/docs/Web/API/Event/currentTarget)
- [MDN: Event.target](https://developer.mozilla.org/en-US/docs/Web/API/Event/target)
- [MDN: Event.stopImmediatePropagation()](https://developer.mozilla.org/en-US/docs/Web/API/Event/stopImmediatePropagation)
