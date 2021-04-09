---
title: 為什麼在瀏覽器環境中使用while loop執行ajax request會讓頁面陷入凍結狀態？
date: 2021-04-08 21:10:25
categories:
- JavaScript
tags:
---

## 環境
```
Google Chrome: 89.0.4389.114 (Official Build) (64-bit)
os: Windows_NT 10.0.18363 win32 x64
```

## 原始題目
ALPHA Camp學期2-2：請向 [RANDOM USER GENERATOR](https://randomuser.me/) 這支API索取資料，並在瀏覽器畫面上點擊按鈕後，輸出三位「只有女性」的資料。


## 遭遇問題
最初想要使用以下程式碼來過濾API回傳的資料，但會讓瀏覽器分頁陷入凍結狀態：
<script src="https://gist.github.com/tzynwang/b7049eb35ec2a9950f4c48f1fdd48c28.js"></script>


## 問題背後的脈絡梳理
基本上Philip Roberts的影片回答了「為什麼以上程式碼會造成瀏覽器凍結？」的問題：
<iframe width="560" height="315" src="https://www.youtube.com/embed/8aGhZQkoFbQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

- V8（Chrome的JavaScript runtime）本身僅包含call stack與heap，V8的原始碼沒有`setTimeout()`、`XMLHttpRequest`（實現ajax的API）等內容
- `setTimeout()`與`XMLHttpRequest`並非由ECMAScript定義，在MDN文件中，這兩個功能分別由HTML Living Standard與XMLHttpRequest Living Standard規範
  - `setTimeout()`: [HTML Living Standard](https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-settimeout)
  - `XMLHttpRequest`: [XMLHttpRequest Living Standard](https://xhr.spec.whatwg.org/)
- `setTimeout()`與`XMLHttpRequest`的callback function會停留在callback queue，等待stack裡面的task被清空後，這些停留在callback queue的task才會被執行
- 瀏覽器分頁當機的原因是：我請JavaScript在user array長度沒有大於4前，不停執行`getFemaleUser()`此功能
  - 在`getFemaleUser()`中，我使用ajax技術向API請求資料，但是，「整理取得的資料」這個task會停留在callback queue中
  - 而在stack沒有清空前，callback queue是不會被推到stack被執行的
  - stack因為while loop的條件一直為true（整理資料的task沒有被執行的話，user array的長度是不會改變的），所以while loop會一直被執行下去
  - 在程式碼加上`console.log()`觀察實際被執行的內容，可以很明顯看出`axios.get()`以內的程式碼根本沒有被執行
  <script src="https://gist.github.com/tzynwang/b0f95a819bf495c771c321cfaa4ecf8e.js"></script>
  {% figure figure--center 2021/while-loop-ajax/ajax.png "'因為stack裡面的任務沒有清空，callback queue裡面的task永遠不會被執行'" %}


## 結論
- 我的while loop條件是根據callback queue task來決定的，但我讓callback queue中的task永遠沒有機會被執行
- 而JavaScript的single thread特性會讓它不停地執行stack內的任務，直到stack清空之前JavaScript不會處理其他事情，所以分頁畫面凍結了，JavaScript也永遠卡在while loop裡面
- Jake Archibald的演講在提到Render steps時提供了相關說明，約8:55開始：
<iframe width="560" height="315" src="https://www.youtube.com/embed/cCOL7MC4Pl0?start=535" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>


## 此問題的解決方式
- 直接根據[RANDOM USER GENERATOR的說明文件](https://randomuser.me/documentation#gender)，在請求的URL加上特定parameter過濾需求資料（女性、三位：`?gender=female&results=3`）
- 透過recursive讓`getFemaleUser()`在條件沒有被滿足的情況下再度呼叫`getFemaleUser()`


## 補充
<script src="https://gist.github.com/tzynwang/1cf59700311f401a74042df5c76cf47f.js"></script>
{% figure figure--center 2021/while-loop-ajax/setTimeout.png "'因為stack裡面的任務沒有清空，callback queue裡面的task永遠不會被執行'" %}
- 將`axios.get()`抽換為`setTimeout()`也會造成頁面凍結，原理與上述一致
- `setTimeout()`的callback function（`arr.push("add item to array");`）被推到callback queue之後，`arr.push`等待stack被清空，但能讓while loop停下來的task本身就在callback queue中被stack永遠不會結束的task卡住，因此while loop永遠不會停下來
{% figure figure--center 2021/while-loop-ajax/不要停下來.jpg %}


## 參考文件
- [What the heck is the event loop anyway? | Philip Roberts](https://youtu.be/8aGhZQkoFbQ)
- [Jake Archibald: In The Loop](https://youtu.be/cCOL7MC4Pl0)
- [Further Adventures of the Event Loop - Erin Zimmer](https://youtu.be/u1kqx6AenYw)
- [[筆記] 理解 JavaScript 中的事件循環、堆疊、佇列和併發模式（Learn event loop, stack, queue, and concurrency mode of JavaScript in depth）](https://pjchender.blogspot.com/2017/08/javascript-learn-event-loop-stack-queue.html)：這篇文章內的影片全部都是Philip Roberts的演講內容，影片部分直接觀看Philip Roberts本人的演講錄影即可