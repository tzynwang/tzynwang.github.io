---
title: 2022 第25週 學習筆記：在 React App 中對應 race condition
date: 2022-06-25 12:01:10
tag:
  - [React]
---

## 總結

最近撞到 race condition 的坑，記錄一下在使用 react 搭配 axios 開發時可以怎麼解決

## 筆記

### 情境描述

- 前端根據 url 中的 `contendId_X` 向後端索取對應資料（ `contendId_X` 對應的資料量相對龐大，後端無法馬上回應）；但在後端回傳對應內容前，使用者就離開了該畫面
- 使用者進入了另一個畫面，前端根據新的 `contentId_Y` 向後端索取資料
- 後端先回傳了 `contentId_Y` 的資料，隨後才回傳 `contendId_X` 的結果，造成畫面上的內容不正確

### 解法

- 57 行：進入畫面時，比對 url 中的 `contentId` 與後端回傳的內容的 `contentId` 是否一致，兩邊的 `contentId` 不同時，就不應該更新用來保存資料的 states 變數
- 65 行：監聽 url 狀態，一旦使用者選擇瀏覽到其他 url ，就透過 `AbortController.abort()` 取消已經送出的 request
- 66 行：承上，一旦使用者選擇瀏覽到其他 url ，就將保存資料用的 states 變數回歸到預設狀態，避免使用者在新畫面看到舊畫面的資料
- 完整內容可參考 [tzynwang/react-deal-with-race-condition](https://github.com/tzynwang/react-deal-with-race-condition)

<script src="https://gist.github.com/tzynwang/0488ab7b41d06d52f83afa7022c85905.js"></script>

### 關於 race condition

> Wikipedia: A race condition (or race hazard) is the condition of an electronics, software, or other system where the system's substantive behavior is dependent on the sequence or timing of other **uncontrollable events**. It becomes a bug when one or more of the possible behaviors is undesirable.

> StackOverFlow: A race condition occurs when two or more threads can **access shared data** and they **try to change it at the same time**. Because the thread scheduling algorithm can swap between threads at any time, you don't know the order in which the threads will attempt to access the shared data. Therefore, the result of the change in data is dependent on the thread scheduling algorithm, i.e. both threads are "racing" to access/change the data.

- 解釋（比喻）：
  - 冰箱裡的牛奶沒了，你先發現這件事，出門準備買一瓶鮮奶；接著你室友也看到冰箱裡沒有鮮奶了，於是他也出門準備買一瓶；最後冰箱裡有兩瓶鮮奶。
  - 其實只需要補一瓶鮮奶到冰箱就好，可是你跟你的室友都觀測到「冰箱沒有鮮奶」這個事件，且兩個人都出發去買鮮奶。
- 解決辦法（比喻）：
  - 任何發現冰箱沒有牛奶的人，都先把冰箱整個鎖起來（critical section），等到買好鮮奶回家後，再解開冰箱的鎖，把牛奶放進去；這樣就不會有「意外多買一瓶鮮奶」的問題發生了。
  - critical section (by Wikipedia): In concurrent programming, concurrent accesses to shared resources can lead to unexpected or erroneous behavior, so parts of the program where the shared resource is accessed need to be protected in ways that avoid the concurrent access. One way to do so is known as a critical section or critical region. This protected section **cannot be entered by more than one process or thread at a time**; others are suspended until the first leaves the critical section.

## 參考文件

- [Wikipedia: Race condition](https://en.wikipedia.org/wiki/Race_condition)
- [StackOverFlow: What is a race condition?](https://stackoverflow.com/questions/34510/what-is-a-race-condition)
- [MDN: AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
- [MDN: AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)
- [Fixing Race Conditions in React with useEffect](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect#fixing-the-useeffect-race-condition=)
- [YouTube: Race Conditions and How to Prevent Them - A Look at Dekker's Algorithm](https://youtu.be/MqnpIwN7dz0)
