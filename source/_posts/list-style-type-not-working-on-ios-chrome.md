---
title: 為什麼iOS上的Chrome沒有呈現設定好的list-style-type
date: 2021-04-22 11:53:12
categories:
- CSS
tags:
---

{% figure figure--center 2021/list-style-type-not-working-on-ios-chrome/ask.jpg "'一種Chrome，各自表述渲染結果'" %}

## 環境
```
Google Chrome (Desktop): 90.0.4430.85 (Official Build) (64-bit)
Google Chrome (iOS): 87.0.4280.163
```

## 原始問題
HTML內容如下：
```HTML
<ul id="thumbs-up">
  <li>Apple</li>
  <li>Banana</li>
  <li>Cherry</li>
</ul>
```
而CSS樣式設定如下：
```CSS
#thumbs-up li {
  list-style-type: "\1F44D";
}
```
在電腦版的Chrome有正常顯示清單圖示「👍」，但切換到手機版的Chrome，顯示的卻是「●」。
{% figure figure--center 2021/list-style-type-not-working-on-ios-chrome/desktop-screenshot.jpg "'電腦版畫面'" %}
{% figure figure--center 2021/list-style-type-not-working-on-ios-chrome/ios-screenshot.png "'手機版畫面'" %}
同一份CSS樣式，同樣都用Chrome來瀏覽，為何`<li>`的樣式不同？

## 解答
- 電腦版Chrome的browser engine是Blink
- 但手機板Chrome的browser engine是WebKit
  - [Wikipedia](https://en.wikipedia.org/wiki/Google_Chrome): Chrome is available on Apple's mobile iOS operating system as Google Chrome for iOS. In accordance with Apple's requirements for browsers released through their App Store, **this version of Chrome uses the iOS WebKit** – which is Apple's own mobile rendering engine and components, developed for their Safari browser – therefore it is restricted from using Google's own V8 JavaScript engine.
- 而根據MDN文件，WebKit並不支援以`<string> value`設定`list-style-type`樣式，所以手機版的Chrome無法處理`list-style-type: "\1F44D";`
  {% figure figure--center 2021/list-style-type-not-working-on-ios-chrome/browser-support.png "'WebKit並不支援以string作為list-style-type的值'" %}
- `list-style-type: "\1F44D";`沒有作用的話，[WebKit的user agent stylesheet](https://trac.webkit.org/browser/trunk/Source/WebCore/css/html.css)內容就會取而代之，其樣式設定如下：
  ```CSS
  /* lists */
  ul, menu, dir {
      display: block;
      list-style-type: disc;
      -webkit-margin-before: 1__qem;
      -webkit-margin-after: 1em;
      -webkit-margin-start: 0;
      -webkit-margin-end: 0;
      -webkit-padding-start: 40px;
  }
  ```
- 所以透過iOS版的Chrome只會看到「●」，而不是使用`<string> value`指定的「👍」樣式

## 使用::before來實作
HTML內容不變，CSS樣式改為以下內容：
```CSS
#thumbs-up {
  padding-inline-start: 0;
  /* 將<li>樣式的空間移除，使<li>（包含樣式與內文）向畫面左方靠攏 */
}

#thumbs-up li {
  list-style: none;
  /* 移除<li>樣式 */
}

#thumbs-up li::before {
  content: "👍 ";
  /* 使用content搭配::before來填入樣式內容 */
}
```
實際結果如下：
{% figure figure--center 2021/list-style-type-not-working-on-ios-chrome/ios-screenshot-before-content.png "'iOS裝置也可看到自定義的li樣式了'" %}


## 參考文件
- 感謝ALPHA Camp政治助教的回覆：
  {% figure figure--center 2021/list-style-type-not-working-on-ios-chrome/AC-reply.png "'在幾乎所有的瀏覽器都支援偽元素::before的情況下，設定::before的content比較能確保li的樣式可以好好呈現在使用者眼前'" %}
- [各ブラウザごとのデフォルトのスタイルシート、user agent stylesheetのまとめ -Chrome, Safari, Firefox, Edge](https://coliss.com/articles/build-websites/operation/css/user-agent-stylesheets.html)
- [webkit/trunk/Source/WebCore/css/html.css](https://trac.webkit.org/browser/trunk/Source/WebCore/css/html.css)
- [MDN: list-style-type](https://developer.mozilla.org/en-US/docs/Web/CSS/list-style-type)
- [web.dev: Custom bullets with CSS ::marker](https://web.dev/css-marker-pseudo-element/)：須注意WebKit目前僅支援修改`::marker`的`color`與`font-size`，[參考MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/::marker#browser_compatibility)