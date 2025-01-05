---
title: 2022 第19週 實作筆記：在 React APP 中搭配 Mui 處理基礎動畫
date: 2022-05-11 18:24:59
tag:
- [CSS]
- [React]
- [MaterialUI]
---

## 總結

記錄一下如何使用 Mui 搭配 styled component 處理簡單點擊效果動畫

<iframe src="https://codesandbox.io/embed/compassionate-meninsky-scr36s?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="compassionate-meninsky-scr36s"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

## 版本與環境

```
@mui/material: 5.0.3
```

## 筆記

- 需求：使用者點擊按鈕後，按鈕需表現出「轉一圈」的動畫
- 想法梳理：
  - 透過 CSS class 來控制動畫表現與否
  - 透過 `useState` 來控制元件是否綁定控制動畫的 CSS class
- 實作：
  - 搭配 `setTimout()` 在一秒後將 `useState` 狀態重設回 `false` ，移除動畫效果
  - 使用 `transform/rotate` 處理動畫，至少在 Blink 與 Gecko 這兩個瀏覽器引擎中僅會觸發 re-composite，不會發生 re-flow (layout) 與 re-paint，效能表現較好
  - 因按鈕只需轉一圈，故 `animation-iteration-count` 設定為一次即可
- 備註：
  - 從 `@mui/system` export 出來的 `keyframes` 其實就是 `@emotion/react` 的 `keyframes`
    > You can define animations using the `keyframes` helper from `@emotion/react`. `keyframes` takes in a css keyframe definition and returns an object you can use in styles. You can use strings or objects just like css.
    > Ref.: [Emotion: Keyframes](https://emotion.sh/docs/keyframes)

## 參考文件

- [MDN: animation](https://developer.mozilla.org/en-US/docs/Web/CSS/animation)
- [CSS Triggers: transform](https://csstriggers.com/transform)
- [How to apply custom animation effect @keyframes in MUI?](https://stackoverflow.com/a/63546822/15028185)
