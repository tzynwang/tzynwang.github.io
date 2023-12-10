---
title: 為什麼在瀏覽器環境中使用while loop執行ajax request會讓頁面陷入凍結狀態？
date: 2021-04-08 21:10:25
tag:
  - [JavaScript]
---

## 環境

```
Google Chrome: 89.0.4389.114 (Official Build) (64-bit)
os: Windows_NT 10.0.18363 win32 x64
```

## 原始題目

ALPHA Camp 學期 2-2：請向 [RANDOM USER GENERATOR](https://randomuser.me/) 這支 API 索取資料，並在瀏覽器畫面上點擊按鈕後，輸出三位「只有女性」的資料。

## 遭遇問題

最初想要使用以下程式碼來過濾 API 回傳的資料，但會讓瀏覽器分頁陷入凍結狀態：

<script src="https://gist.github.com/tzynwang/b7049eb35ec2a9950f4c48f1fdd48c28.js"></script>

## 問題背後的脈絡梳理

基本上 Philip Roberts 的影片回答了「為什麼以上程式碼會造成瀏覽器凍結？」的問題：

<iframe width="560" height="315" src="https://www.youtube.com/embed/8aGhZQkoFbQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

- V8（Chrome 的 JavaScript runtime）本身僅包含 call stack 與 heap，V8 的原始碼沒有`setTimeout()`、`XMLHttpRequest`（實現 ajax 的 API）等內容
- `setTimeout()`與`XMLHttpRequest`並非由 ECMAScript 定義，在 MDN 文件中，這兩個功能分別由 HTML Living Standard 與 XMLHttpRequest Living Standard 規範
  - `setTimeout()`: [HTML Living Standard](https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-settimeout)
  - `XMLHttpRequest`: [XMLHttpRequest Living Standard](https://xhr.spec.whatwg.org/)
- `setTimeout()`與`XMLHttpRequest`的 callback function 會停留在 callback queue，等待 stack 裡面的 task 被清空後，這些停留在 callback queue 的 task 才會被執行
- 瀏覽器分頁當機的原因是：我請 JavaScript 在 user array 長度沒有大於 4 前，不停執行`getFemaleUser()`此功能
  - 在`getFemaleUser()`中，我使用 ajax 技術向 API 請求資料，但是，「整理取得的資料」這個 task 會停留在 callback queue 中
  - 而在 stack 沒有清空前，callback queue 是不會被推到 stack 被執行的
  - stack 因為 while loop 的條件一直為 true（整理資料的 task 沒有被執行的話，user array 的長度是不會改變的），所以 while loop 會一直被執行下去
  - 在程式碼加上`console.log()`觀察實際被執行的內容，可以很明顯看出`axios.get()`以內的程式碼根本沒有被執行
    <script src="https://gist.github.com/tzynwang/b0f95a819bf495c771c321cfaa4ecf8e.js"></script>
    ![因為stack裡面的任務沒有清空，callback queue裡面的task永遠不會被執行](/2021/while-loop-ajax/ajax.png)

## 結論

- 我的 while loop 條件是根據 callback queue task 來決定的，但我讓 callback queue 中的 task 永遠沒有機會被執行
- 而 JavaScript 的 single thread 特性會讓它不停地執行 stack 內的任務，直到 stack 清空之前 JavaScript 不會處理其他事情，所以分頁畫面凍結了，JavaScript 也永遠卡在 while loop 裡面
- Jake Archibald 的演講在提到 Render steps 時提供了相關說明，約 8:55 開始：

<iframe width="560" height="315" src="https://www.youtube.com/embed/cCOL7MC4Pl0?start=535" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## 此問題的解決方式

- 直接根據[RANDOM USER GENERATOR 的說明文件](https://randomuser.me/documentation#gender)，在請求的 URL 加上特定 parameter 過濾需求資料（女性、三位：`?gender=female&results=3`）
- 透過 recursive 讓`getFemaleUser()`在條件沒有被滿足的情況下再度呼叫`getFemaleUser()`

## 補充

<script src="https://gist.github.com/tzynwang/1cf59700311f401a74042df5c76cf47f.js"></script>

![因為stack裡面的任務沒有清空，callback queue裡面的task永遠不會被執行](/2021/while-loop-ajax/setTimeout.png)

- 將`axios.get()`抽換為`setTimeout()`也會造成頁面凍結，原理與上述一致
- `setTimeout()`的 callback function（`arr.push("add item to array");`）被推到 callback queue 之後，`arr.push`等待 stack 被清空，但能讓 while loop 停下來的 task 本身就在 callback queue 中被 stack 永遠不會結束的 task 卡住，因此 while loop 永遠不會停下來
  ![meme](/2021/while-loop-ajax/不要停下來.jpg)

## 參考文件

- [What the heck is the event loop anyway? | Philip Roberts](https://youtu.be/8aGhZQkoFbQ)
- [Jake Archibald: In The Loop](https://youtu.be/cCOL7MC4Pl0)
- [Further Adventures of the Event Loop - Erin Zimmer](https://youtu.be/u1kqx6AenYw)
- [[筆記] 理解 JavaScript 中的事件循環、堆疊、佇列和併發模式（Learn event loop, stack, queue, and concurrency mode of JavaScript in depth）](https://pjchender.blogspot.com/2017/08/javascript-learn-event-loop-stack-queue.html)：這篇文章內的影片全部都是 Philip Roberts 的演講內容，影片部分直接觀看 Philip Roberts 本人的演講錄影即可
