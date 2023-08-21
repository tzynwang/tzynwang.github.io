---
layout: '@Components/pages/SinglePostLayout.astro'
title: 「重設表單（form reset）」相關筆記
date: 2021-05-13 14:27:11
tag:
  - [HTML]
---

## 總結

HTML 本身即支援兩種重設表單**全部**內容的方法：

- Form `reset()`：作用在表單物件上（`formObject.reset()`）
- Input `type="reset"`：設置在表單的`<input>`上，點擊後觸發

定義重設：將 input 欄位的值**重置為預設值**

## 環境

```
Google Chrome: 90.0.4430.93 (Official Build) (x86_64)
ox: macOS Big Suf Version 11.1
```

## 範例展示

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="html,result" data-user="Charlie7779" data-slug-hash="YzZwRxa" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="form reset">
  <span>See the Pen <a href="https://codepen.io/Charlie7779/pen/YzZwRxa">
  form reset</a> by Charlie (<a href="https://codepen.io/Charlie7779">@Charlie7779</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

## `reset()`

- 對`formObject`使用，即會將該表單所有的 input 欄位都重設回預設值
- `formObject`：HTML 中的`<form>`物件（The Form object represents an HTML `<form>` element.），可透過`document.querySelector()`抓取

### 與`<button>`搭配 1

```html
<!-- HTML部分 -->
<form class="first">
  <!-- 省略部分內容 -->
  <button id="resetFirst">Reset</button>
</form>
```

```js
// JavaScript部分
document.querySelector('#resetFirst').addEventListener('click', (event) => {
  document.querySelector('.first').reset();
  event.preventDefault();
});
```

解說：

- 監聽`<button>`的點擊事件，點擊事件發生後，抓取`formObject`，套用`reset()`
- 因`<button>`沒有設置任和`type`內容，故默認為`type="submit"`，所以在示範中加上`event.preventDefault()`來避免送出表單的動作
  > [MDN](https://developer.mozilla.org/en-US/docs/Learn/Forms/Basic_native_form_controls#actual_buttons): For `<button>` elements, omitting the type attribute (or an invalid value of type) results in a submit button.

## `type="reset"`

### 與`<input>`搭配

```html
<!-- HTML部分 -->
<form>
  <!-- 省略部分內容 -->
  <input type="reset" value='Reset by type="reest"' />
</form>
```

- 直接將`<input>`設置為`type="reset"`即可，點擊後即會自動執行「重設表單中所有 input 欄位內容」的動作
- 沒有設定`value`的話，預設顯示文字`Reset`；可透過設定`value`的值來修改顯示在按鈕中的文字
- 不需額外設置 JavaScript

### 與`<button>`搭配 2

```html
<!-- HTML部分 -->
<form>
  <!-- 省略部分內容 -->
  <button type="reset">Reset</button>
</form>
```

- 效果與設置`input type="reset"`相同，點擊後即會重設表單中所有 input 欄位內容
- 不需額外設置 JavaScript

## 參考文件

- [W3Schools: Form reset() Method](https://www.w3schools.com/jsref/met_form_reset.asp)
- [MDN: input type="reset"](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/reset)
- [MDN: Basic native form controls -- Actual buttons](https://developer.mozilla.org/en-US/docs/Learn/Forms/Basic_native_form_controls#actual_buttons)
- [Quotation marks in HTML attribute values?](https://stackoverflow.com/a/9760424/15028185)
