---
title: 「In The Loop | Jake Archibald」相關筆記
date: 2021-04-11 16:06:17
categories:
- JavaScript
tags:
---

## 總結


## 環境
```
Google Chrome: 89.0.4389.114 (Official Build) (64-bit)
os: Windows_NT 10.0.18363 win32 x64
```

## `requestAnimationFrame()`
{% figure figure--center 2021/requestAnimationFrame/cCOL7MC4Pl0-00-16-31.png "'圖中央三個淺色大方塊各代表一個frame，frame中的一個黃色方塊代表一個task，task會根據順序執行，但在沒有透過requestAnimationFrame()呼叫callback function的情況下，task可能在frame中任何一個時間點被執行'" %}
- 瀏覽器一次只會執行一個task，並task是根據task stack先進後出的順序來執行；可是這並沒有保證task被執行的時間點
- `requestAnimationFrame()`確保其callback function一定會在每一個frame的開頭被執行（在瀏覽器處理CSS與渲染前），如下圖：
{% figure figure--center 2021/requestAnimationFrame/cCOL7MC4Pl0-00-17-38.png "'由requestAnimationFrame()呼叫的call back function會在每一個frame開頭被執行，如上圖黃色方塊'" %}

### 其他相關筆記

參考資料：[Inside look at modern web browser (part 3)](https://developers.google.com/web/updates/2018/09/inside-browser-part3)
- If you are animating elements, the browser has to run these operations in between every frame. Most of our displays refresh the screen 60 times a second (60 fps); animation will appear smooth to human eyes when you are moving things across the screen at every frame. However, if the animation misses the frames in between, then the page will appear "janky".
  - 顯示器的規格若為60 fps (frames per second)，即代表畫面一秒會刷新60次 => 約每17毫秒刷新一次；畫面上的動畫若配合瀏覽器刷新的頻率來「動（變化）」，視覺效果就會比較流暢。反過來說，螢幕刷新時若動畫內容沒有跟著配合，即是掉幀

{% figure figure--center 2021/requestAnimationFrame/pagejank1.png %}

- Even if your rendering operations are keeping up with screen refresh, these calculations are running on the main thread, which means it could be blocked when your application is running JavaScript. You can divide JavaScript operation into small chunks and schedule to run at every frame using `requestAnimationFrame()`.
  - `requestAnimationFrame()`除了用以確保動畫配合螢幕刷新的頻率來「動」之外，也可將JavaScript內容透過`requestAnimationFrame()`分拆，配合每一次螢幕刷新的時間點執行小部分內容，避免因為一次執行太大量的Javascript導致畫面渲染被延遲（或阻擋）

{% figure figure--center 2021/requestAnimationFrame/pagejank2.png "'太大塊的JavaScript內容會讓main thread無暇處理畫面更新（渲染）'" %}
{% figure figure--center 2021/requestAnimationFrame/raf.png "'將太大塊的JavaScript透過requestAnimationFrame()拆解，在螢幕每一次刷新時執行'" %}

參考資料：[Optimize JavaScript Execution](https://developers.google.com/web/fundamentals/performance/rendering/optimize-javascript-execution)
- The only way to guarantee that your JavaScript will run at the start of a frame is to use `requestAnimationFrame()`.
  - `requestAnimationFrame()`會確保其callback function在frame的開頭執行
- Frameworks or samples may use `setTimeout()` or `setInterval()` to do visual changes like animations, but the problem with this is that the callback will run at some point in the frame, possibly right at the end, and that can often have the effect of causing us to miss a frame, resulting in jank.
- `setTimeout()`與`setInterval()`的時間參數僅代表callback function「至少」延遲X毫秒後執行，無法確保callback function被執行的時間點


## 其他參考文件
- [MDN: Window.requestAnimationFrame()](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
- [深入理解requestAnimationFrame的動畫迴圈](https://codertw.com/%E5%89%8D%E7%AB%AF%E9%96%8B%E7%99%BC/260087/)