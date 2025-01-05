---
title: 「Glass effect header」實作筆記
date: 2022-05-14 14:42:46
tag:
- [CSS]
- [React]
---

## 總結

記錄一下如何搭配自製 hook 與 [css.glass](https://css.glass/) 做出有毛玻璃效果的 App Header ，視覺設計參考以下網站：
毛玻璃效果：[MaterialUI](https://mui.com/)、[tailwindcss](https://tailwindcss.com/docs/installation)
捲動後修改背景色：[Asana](https://asana.com/?noredirect)

## 版本與環境

```
react: 17.0.2
```

## 筆記

### 自製 hook

<script src="https://gist.github.com/tzynwang/7409c396191607b250274efa9b04fbdd.js"></script>

效果：掛載後根據目前的捲動位置判斷畫面是否（捲到）頂部，回傳 `boolean`
備註：

- debounce 300 的反應稍微有點慢，如果視覺反饋要更即時的話，可將延遲降低到 50 至 100 左右
- Firefox 須透過手動設定才能開啟支援 CSS `backdrop-filter` 效果（參考 [Can I use](https://caniuse.com/?search=backdrop-filter)）

### 效果展示

<iframe src="https://codesandbox.io/embed/blue-night-cid40q?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="blue-night-cid40q"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

## 參考文件

- [MDN: window.scrollY](https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY)
- [MDN: backdrop-filter](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter)
