---
layout: '@Components/pages/SinglePostLayout.astro'
title: 為什麼使用innerHTML對元素新增內容後，該元素「子代」的事件監聽器失效？
date: 2021-05-25 18:32:01
tag:
  - [HTML]
  - [JavaScript]
---

## 問題描述

1. 對`<button id="alert">alert('hello world')</button>`加上事件監聽器，使其被點擊後會出現 alert 訊息
1. 透過`innerHTML`對`<div id="target">`新增一個`<span>`標籤（不對`<button id="alert">`進行任何處理），但**新增完畢**後，點擊`<button id="alert">`卻**無法出現 alert 訊息了**
1. 示範用原始碼如下：

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="js,result" data-user="Charlie7779" data-slug-hash="JjWJdBW" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="innerHTML destroying descendants' event listeners">
  <span>See the Pen <a href="https://codepen.io/Charlie7779/pen/JjWJdBW">
  innerHTML destroying descendants' event listeners</a> by Charlie (<a href="https://codepen.io/Charlie7779">@Charlie7779</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

## 原因

- `innerHTML`實際上是「移除原本的內容後，以新的內容取代之」
- 就算是新增，也會觸發上述的「移除 ─ 新增」機制，綁定好的事件監聽器的子代元素也會一起被移除

> [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML#value): Setting the value of innerHTML **removes all of the element's descendants** and replaces them with nodes constructed by parsing the HTML given in the string htmlString.

- 在示範用的程式碼中，點擊`<button id="replace">`對`<div id="target">`新增一個`<span>`後，原先綁定了事件監聽器的`<button id="alert">`已被移除，並被一個新的`<button id="alert">`取代
- 新的`<button id="alert">`沒有任何事件監聽器，故點擊後不會出現 alert 訊息

## 解決方式

### createElement()搭配 appendChild()

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="js,result" data-user="Charlie7779" data-slug-hash="jOBwbEE" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="appendChild">
  <span>See the Pen <a href="https://codepen.io/Charlie7779/pen/jOBwbEE">
  appendChild</a> by Charlie (<a href="https://codepen.io/Charlie7779">@Charlie7779</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

- 透過`let span = document.createElement("span")`建立一個`<span>`元素
- 使用`textContent`設定`span`的文字內容
- 執行`target.appendChild(span)`將`span`加為`target`的子代元素

> [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild): The `Node.appendChild()` method **adds a node to the end of the list of children** of a specified parent node.

### insertAdjacentHTML()

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="js,result" data-user="Charlie7779" data-slug-hash="GRWEpoP" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="insertAdjacentHTML()">
  <span>See the Pen <a href="https://codepen.io/Charlie7779/pen/GRWEpoP">
  insertAdjacentHTML()</a> by Charlie (<a href="https://codepen.io/Charlie7779">@Charlie7779</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

關於`element.insertAdjacentHTML(position, text)`：

- `position`參數以下四選一：
  - `beforebegin`：在`element`前插入`text`
  - `afterbegin`：在`element`內部、第一個 childNode 前插入`text`
  - `beforeend`：在`element`內部、最後的 childNode 後插入`text`
  - `afterend`：在`element`後插入`text`
- `text`：會被轉換為 HTML 節點，可使用 template literal

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="js,result" data-user="Charlie7779" data-slug-hash="eYvRpvv" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="insertAdjacentHTML() -- position">
  <span>See the Pen <a href="https://codepen.io/Charlie7779/pen/eYvRpvv">
  insertAdjacentHTML() -- position</a> by Charlie (<a href="https://codepen.io/Charlie7779">@Charlie7779</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

## 參考文件

- [MDN: Element.insertAdjacentHTML()](https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML)
- [MDN: Node.appendChild()](https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild)
- [StackOverFlow: Is it possible to append to innerHTML without destroying descendants' event listeners?](https://stackoverflow.com/questions/595808/is-it-possible-to-append-to-innerhtml-without-destroying-descendants-event-list)
