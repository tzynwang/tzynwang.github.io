---
title: 2022 第45週 試用筆記：HTMLImageElement.srcset
date: 2022-11-12 21:25:59
categories:
  - [Web performance]
tags:
---

## 總結

可透過 `img` 標籤的 `srcset` 屬性來指定使用複數個圖片來源、以及這些圖片的使用條件。
比如使用者如果使用較為窄小裝置開啟網站，瀏覽器即可根據 `img.srcset` 中的設定來抓取對應尺寸的圖片，而不用嘗試載入使用者裝置根本用不到的寬大尺寸圖片。

## 版本與環境

```text
chrome: 107.0.5304.87 (arm64)
firefox: 105.0.1
```

## 筆記

語法：`{圖片路徑}{空格}{搭配的渲染尺寸 或 pixel density descriptor}`

- 搭配的渲染尺寸：以語法 `/img/small.jpg 640w` 來說，即是「如果畫面上需要一個 640px 寬的圖片，請使用圖片 `small.jpg`」；而 `/img/medium.jpg 960w` 則是「如果需要在畫面上顯示 960px 這麼寬的圖片，使用 `medium.jpg` 這個檔案」。注意書寫時使用的單位不是 `px` 而是 `w`
- pixel density descriptor：指定各種像素密度要搭配使用的檔案

在 chrome 與 firefox 中執行下方範例 1 觀察到的結果是：

- 當螢幕寬度小於 640px 時，會顯示 img640
- 當螢幕寬度介於 640px 至 960px 時，使用圖片 img960
- 螢幕寬度大於 960px 後，一律顯示 img1280
- img1920 永遠沒有出現

相較之下範例 2 在兩款瀏覽器上透過開發者工具來觀察則很好理解，透過 dev tool 切換裝置 dpr 後，即可觀察到瀏覽器根據 dpr 設定使用對應的圖片。

```tsx
import img640 from '@Assets/alexander-andrews-mEdKuPYJe1I-640.jpg';
import img960 from '@Assets/ray-hennessy-xUUZcpQlqpM-960.jpg';
import img1280 from '@Assets/erik-mclean-OVWn1sbGIYQ-1280.jpg';
import img1920 from '@Assets/qijin-xu-fJyO0eo6_1920.jpg';

// 範例1 根據尺寸使用對應檔案
<img
  srcSet={`${img640} 640w, ${img960} 960w, ${img1280} 1280w`}
  src={img1920}
  alt="fox"
/>;

// 範例2 根據像素密度使用對應檔案
<img
  srcSet={`${img640} 1x, ${img960} 2x, ${img1280} 3x`}
  src={img1920}
  alt="fox"
/>;
```

不解的部分是參考 MDN 為 srcset 指定 fallback 時，反而無法在 chrome 以及 firefox 中正常發揮功用 ( ͡° ͜ʖ ͡°)

> MDN: If the condition descriptor is not provided (in other words, the image candidate provides only a URL), the candidate is used as the fallback **if none of the other candidates match**.

```tsx
// 直接導致圖片切換失敗，不論是 chrome 或 firefox 都只會渲染 img1920
<img
  srcSet={`${img640} 640w, ${img960} 960w, ${img1280} 1280w, ${img1920}`}
  alt="fox"
/>
```

## 參考文件

- [MDN: HTMLImageElement.srcset](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/srcset)
- [MDN: img #srcset](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-srcset)
- [6 Steps to Improve HTML Images For Users & Developers](https://austingil.com/better-html-images/)
- [YouTube: srcset and sizes attributes - [ images on the web | part one ]](https://youtu.be/2QYpkrX2N48)
- [本篇 demo code repo: tzynwang/img-srcset](https://github.com/tzynwang/img-srcset)
