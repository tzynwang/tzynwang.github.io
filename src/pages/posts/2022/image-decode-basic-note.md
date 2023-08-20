---
layout: '@Components/pages/SinglePostLayout.astro'
title: 2022 第47週 閱讀筆記：Don’t use JPEG-XR on the Web
date: 2022-11-27 11:09:12
tag:
  - [Image format]
  - [Web performance]
---

## 總結

在選擇影像格式時，除了壓縮率以外，可能也得將圖片解碼（decode）的效率納入考量。
即使一張圖片本身的尺寸變小（更快被下載到客戶端），但若硬體需要花費較多資源進行解碼，那麼對使用者來說，更換圖片的保存格式也無助於提升一個網站的載入效能（使用體驗） ┐(ツ)┌

## 筆記

JPEG-XR 與 AVIF 這兩種格式皆可在維持圖片視覺品質的情況下，表現出更好的檔案壓縮率（需要傳輸的資料量更少）。然而在 [Web Performance Calendar: Don’t use JPEG-XR on the Web](https://calendar.perfplanet.com/2018/dont-use-jpeg-xr-on-the-web/) 的檢證過程中，發現 JPEG-XR 格式的圖片並沒有比較快出現在使用者的裝置上，理由如下：

1. JPEG-XR 的解碼發生在 CPU 中，但 CPU 除了處理影像解碼外，還需處理前端的 JS 編譯內容；亦即此格式的圖片會吃掉預計拿來處理畫面渲染的資源
   > During the investigation, it was suggested that Internet Explorer **may have implemented the decoding of JPEG-XRs software-side on the CPU**, which would utilize the same thread as the active browser tab, thereby impacting overall page loading and rendering performance.
2. 而 JPG 格式的解碼工作卻可以交棒給 GPU 處理，讓 CPU 專注進行 JS 編譯
3. 結果就是使用 JPEG-XR 格式的前端 SPA 專案為了處理圖片解碼，分走了原本可以拿來進行畫面渲染的資源；使用 JPG 的 SPA 專案反而可以透過 CPU/GPU 分工來更快完成畫面渲染

### 影響解碼效率的因素

參考 [Dexecure: Image decoding on the web](https://dexecure.com/blog/image-decoding/) 一文，列點如下：

1. 影像尺寸：尺寸越大的圖片，解碼時需要的時間就越長；故提升網站效能的第一步通常都是建議開發者將圖片尺寸調整到最終使用者會看到的大小就好，不要提供過大的圖片
2. 瀏覽器本身被允許存取的 CPU/RAM 資源量：能使用的資源越多，自然能更快完成圖片解碼，並把結果渲染到畫面上；同樣的圖片在電腦與手機上渲染的時間不同，也是因為這兩種硬體能提供的資源量多寡有所差異
3. decoder 的普及度：常見的格式如 PNG 或 JPG 雖然在檔案尺寸壓縮率不如 AVIF 或 webP，但因為在各種裝置上的解碼效率較好，在 web performance 上的表現不一定會比較差

AVIF 與 webP 這類壓縮率好、但解碼效率（目前還）較不起色的檔案格式還有一個發揮場合：如果預期網站的使用者通常處在一個數據傳輸嚴苛的情況下（頻寬窄小、網速慢，或是處在傳輸成本極高的環境），那麼使用 AVIF/webP 格式來確保圖片佔用較少的傳輸資源，把顯示圖片的成本轉移到使用者解碼圖片這一段，也是一種應用方式。

## 參考文件

- [Web Performance Calendar: Don’t use JPEG-XR on the Web](https://calendar.perfplanet.com/2018/dont-use-jpeg-xr-on-the-web/)
- [Is AVIF the future of images on the web?](https://calendar.perfplanet.com/2018/is-avif-the-future-of-images-on-the-web/)
- [Dexecure: Image decoding on the web](https://dexecure.com/blog/image-decoding/)
