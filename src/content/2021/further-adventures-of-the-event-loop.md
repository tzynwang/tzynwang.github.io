---
title: 再訪 event loop
date: 2021-04-14 14:02:39
tag:
- [JavaScript]
---

## 總結

- 瀏覽器中的 JavaScript 環境（runtime）包含 standard stack、microtask queue 與(macro)task queue
- 簡化後的瀏覽器 event loop 流程如下：
  1. 處理 standard stack 中的**所有**任務
  1. standard stack 清空後，開始處理 microtask queue 中的**所有**任務
  1. microtask queue 清空後，開始處理(macro)task queue 中的**一個**任務
  1. 一次 event loop 中可能有複數個(macro)task queue，event loop 會執行每一個(macro)task queue 中**最早**被加進來的**一個**任務

<!--more-->

## 影片摘要：Further Adventures of the Event Loop

<iframe width="560" height="315" src="https://www.youtube.com/embed/u1kqx6AenYw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

- 05:30 An event loop has **one or more task queues**.
- 08:03 A microtask is promise. There are other things that generate microtasks, but 99.9% of things that you do it's going to be promises.
  - MDN: JavaScript **promises** and the **Mutation Observer API** both use the **microtask queue** to run their callbacks.
  - JAVASCRIPT.INFO: **Microtasks are usually created by promises**: an execution of .then/catch/finally handler becomes a microtask. Microtasks are used “under the cover” of await as well, as it’s another form of promise handling.
- 14:00 (Browser's event loop) is an infinite loop, we're going to pick a queue, we're going to grab the first (macro)task off that queue, run that (macro)task.
  - Then as long as there are microtasks, we're going to run all those (microtasks).
  - Then if we're ready to repaint, we're going to grab the animation tasks that are currently in the animation queue, and we're going to run all of those (tasks in animation queue).
  - And then we're going to repaint.
    ![event loop in browser](/2021/further-adventures-of-the-event-loop/u1kqx6AenYw-00-14-00.jpg)
- 個人心得：Erin Zimmer 的演講沒有特別區分 standard stack 與(macro)task queue，14:00 左右的總結稍微有點簡陋，搭配其他解說文件一起理解比較好

## 筆記 1

### standard stack

- 所有的 synchronous functions 在這裡發生
- standard stack 中所有的任務清空後，才會輪到 microtask queue 與(macro)task queue(s)

### microtask

- `microtask`的`micro`與 task 的尺寸沒有關聯
  > ...microtasks, which kind of conveys a sense of size. Microtask sounds smaller than a task, but really what it just meets the **microtask has a higher priority than a (macro)task**. It doesn't really say anything about the amount of work that you can do. Maybe a bit about what you should do. -- [Scheduling Tasks - HTTP 203](https://youtu.be/8eHInw9_U8k)
- `promises`的 callback function 會加入 microtask queue 執行
- 傳入`queueMicrotask()`的 function 也會加入 microtask queue 執行
- 瀏覽器每一次的 event loop 只會有一個 microtask queue
- 瀏覽器每一次的 event loop 會將 microtask queue 中**所有**的 microtasks 執行完畢後，再執行(macro)task queue 中的任務

### (macro)task

- microtask queue 清空後，event loop 才會開始處理(macro)task queue 中的任務
- 以下皆屬於(macro)task
  - 透過`<script src="...">`載入 JavaScript
  - `setTimeout`的 callback function 時間倒數完成後，callback function 會被推入(macro)task queue 執行
  - 其他如`setInterval`、`setImmediate`、`requestAnimationFrame`、I/O 與 UI rendering (repaint)等任務
- 瀏覽器每一次的 event loop 可能會有一個、或複數個(macro)task queue(s)
- 瀏覽器每一次的 event loop 只會執行(macro)task queue 中的**一個**(macro)task

## 影片演示(macro)task queue、animation callback queue 與 microtask

大約在 27:37 處開始：

<iframe width="560" height="315" src="https://www.youtube.com/embed/cCOL7MC4Pl0?start=1657" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### 題目解析：In The Loop

第一組程式碼：

```js
const button = document.querySelector('button');

button.addEventListener('click', function first () {
  Promise.resolve().then(() => console.log('microtask 1'));
  console.log('listener 1');
});

button.addEventListener('click', function second() {
  Promise.resolve().then(() => console.log('microtask 2'));
  console.log('listener 2');
});
```

- 輸出順序：`listener 1`、`microtask 1`、`listener 2`、`microtask 2`
- 分析：
  1. 使用者點選`button`後，task stack 執行`function first ()`的`console.log('listener 1')`
  1. `console.log('microtask 1')`被推到 microtask queue 中
  1. `function first ()`結束，task stack 空了，執行 microtask queue 中的`console.log('microtask 1')`
  1. 開始執行`function second()`的`console.log('listener 2')`
  1. `console.log('microtask 2')`被推到 microtask queue 中
  1. `function second()`結束，task stack 空了，執行 microtask queue 中的`console.log('microtask 2')`

第二組程式碼：

```js
const button = document.querySelector('button');

button.addEventListener('click', function first () {
  Promise.resolve().then(() => console.log('microtask 1'));
  console.log('listener 1');
})

button.addEventListener('click', function second() {
  Promise.resolve().then(() => console.log('microtask 2'));
  console.log('listener 2');
})

button.click();
```

- 輸出順序：`listener 1`、`listener 2`、`microtask 1`、`microtask 2`
- 分析：
  1. `button.click()`被執行
  1. 執行`function first ()`的`console.log('listener 1')`
  1. `console.log('microtask 1')`被推到 microtask queue 中
  1. `function first ()`結束，但`button.click()`還在執行（task stack 還未清空），還未輪到 microtask
  1. 開始執行`function second()`的`console.log('listener 2')`
  1. `console.log('microtask 2')`被推到 microtask queue 中
  1. `function second ()`結束，，`button.click()`還在執行（task stack 還未清空），還未輪到 microtask
  1. `button.click()`結束
  1. task stack 空了，執行 microtask queue 中的`console.log('listener 1')`與`console.log('microtask 2')`
- 在第一組程式碼中，`function first ()`結束後 task stack 就淨空了，故可以去處理 microtask queue 中的任務
- 而第二組程式碼則是：`function first ()`結束了，但`button.click()`還沒完，因為還有一個`function second ()`需執行；`function second ()`執行完畢後，`button.click()`才算完全結束，可以從 task stack 上移除，這時候才能處理 microtask queue 中的任務

## 影片摘要：Scheduling Tasks

<iframe width="560" height="315" src="https://www.youtube.com/embed/8eHInw9_U8k" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

- 02:45 There's a way to synchronously call a callback, there's a way to call a callback as a (macro)task, and there is a way to call a callback as a microtask
- 03:19 In the end, the event loop is just something that spins around and takes tasks out of different queues. And these **different queues have different priorities**.

  ```js
  synchronous(() => console.log('sync 1'));
  task       (() => console.log('task 1'));
  microtask  (() => console.log('microtask 1'));
  task       (() => console.log('task 2'));
  synchronous(() => console.log('sync 2'));
  microtask  (() => console.log('microtask 2'));

  /*
  output order:
  sync 1
  sync 2
  microtask 1
  microtask 2
  task 1
  task 2
  */

  function synchronous (cb) {
    cb();
  }

  function microtask (cb) {
    queueMicrotask(cb);

    // This can work too:
    // Promise.resolve().then(() => cb());
  }

  function task (cb) {
    setTimeout(() => cb());

    // A more reliable way without timeout clamping, use MessageChannel():
    // const mc = new MessageChannel();
    // mc.port1.postMessage(null);
    // mc.port2.addEventListener('message', () => {
    //   cb();
    // }, {once: true});
    // mc.port2.start();
  }
  ```

- 03:55 There are some very particular situations where microtasks can come before (macro)tasks, but **only when they're queued by the browser**, not by JavaScript.
- 04:57 (The code below) is not correct because the constructor of the promise, the function inside the promise constructor, this is call the **revealing constructor pattern**...will invoke **synchronously**.

  ```js
  function microtask (cb) {
    // This can NOT add the callback to microtask queue:
    new Promise(resolve => {
      cb();
      resolve();
    });
  }

  /*
  output order will change to:
  sync 1
  microtask 1
  sync 2
  microtask 2
  task 1
  task 2
  */
  ```

- 06:31 Most of the time (the code below) will be OK. However, `setTimeout()` has som very specific rules that when you start **scheduling tasks from within tasks** using this, once you reach a certain depth, **timeout clamping** will occur. So it won't schedule the task immediately, but it will start scaling it after 4 milliseconds.
  - [Clamping](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout#reasons_for_delays): In modern browsers, `setTimeout()`/`setInterval()` calls are throttled to a minimum of once every 4 ms when successive calls are triggered due to **callback nesting** (where the nesting level is at least a certain depth), or after certain number of successive intervals.
  - 06:59 The spec for this says, wait whatever time you put in there. But then the browser is free to add any kind of padding that they want.
- 08:36 The reason that we don't have a simple function for queuing tasks is **because there are many task queues**. And whenever someone suggests, let's have a simple function for queuing a task, the next question is, **which queue**?

## 筆記 2

- [process.nextTick() vs setImmediate()](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/#process-nexttick-vs-setimmediate)
  - `nextTick()`僅存於 node，`setImmediate()`目前[僅有 IE 支援](https://developer.mozilla.org/en-US/docs/Web/API/Window/setImmediate#browser_compatibility)
  - 傳進`nextTick()`的 callback function 會比傳進`setImmediate()`的 callback function 更早被 node 的 event loop 執行
  - 官方吐槽："In essence, the names should be swapped."

## 參考文件

- [Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)
- [Event loop: microtasks and macrotasks](https://javascript.info/event-loop)
- [Microtasks](https://javascript.info/microtask-queue)
- [Using microtasks in JavaScript with queueMicrotask()](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide)
- [Concurrency model and the event loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop)
- [Difference between microtask and macrotask within an event loop context](https://stackoverflow.com/q/25915634/15028185)
