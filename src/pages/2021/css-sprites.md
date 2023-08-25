---
layout: '@Components/pages/SinglePostLayout.astro'
title: 「CSS Sprites」相關筆記
date: 2021-09-01 14:14:50
tag:
  - [CSS]
---

## 總結

CSS Sprites 帶來的優勢：減少發對伺服器發送請求的次數，增加 performance

## 筆記

- CSS Sprites are a means of combining multiple images into a **single image file** for use on a website, to help with **performance**.
- The term “sprites” comes from a technique in computer graphics, most often used in video games.
  - The idea was that the computer could **fetch a graphic into memory**, and then only **display parts of that image** at a time, which was faster than having to continually fetch new images.
  - The sprite was the big combined graphic.
- Get the image **once**, and shift it around and only display parts of it. This **reduces the overhead of having to fetch multiple images**.
- 把一堆 icon 集合在一張大圖裡面，這樣只要請求（request）就一次就可以取得所有的 icon
- 透過 background-position 調整「顯示這張大圖的哪一個部分」就可以在網頁各處展示需要的 icon
- 因為瀏覽器只需要對伺服器做一次請求就可以獲得全部的圖示，請求的數量減少，網頁載入的速度會變快
  > By now you should realize that the more HTTP requests your page requires, the more overhead you'll have and therefore the slower the page will be. **Reducing the number of HTTP request** is the best thing you can to **speed up a page**. [Book of Speed](https://www.bookofspeed.com/chapter3.html)

### 關於 HTTP/2

- 然而 MDN 也有補充：
  > Note: When using HTTP/2, it may in fact be more bandwidth-friendly to use multiple small requests.
- stackOverFlow:
  - Thanks to the **multiplexing** feature of the HTTP/2 protocol, the number of concurrent requests per domain is not limited to 6-8, but it is virtually unlimited.
  - It is virtually unlimited in the sense that browsers and servers may limit the number of concurrent requests via the [HTTP/2 configuration parameter](https://datatracker.ietf.org/doc/html/rfc7540#section-6.5.2) called `SETTINGS_MAX_CONCURRENT_STREAMS`.
- Wikipedia HTTP/2:
  - Additional performance improvements in the first draft of HTTP/2 (which was a copy of SPDY) come from **multiplexing of requests and responses** to avoid some of the head-of-line blocking problem in HTTP 1 (even when HTTP pipelining is used), header compression, and prioritization of requests.

## 參考文件

- [MDN: Implementing image sprites in CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Images/Implementing_image_sprites_in_CSS)
- [CSS Sprites: What They Are, Why They’re Cool, and How To Use Them](https://css-tricks.com/css-sprites/)
- [Wikipedia: HTTP/2](https://en.wikipedia.org/wiki/HTTP/2)
- [stackOverFlow: Is the per-host connection limit raised with HTTP/2?](https://stackoverflow.com/a/36847527/15028185)
- [Instant Sprite: CSS Sprite Generator](https://instantsprite.com/)
