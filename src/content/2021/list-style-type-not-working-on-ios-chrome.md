---
title: 為什麼iOS上的Chrome沒有呈現設定好的list-style-type
date: 2021-04-22 11:53:12
tag:
  - [CSS]
---

![一種Chrome，各自表述渲染結果](/2021/list-style-type-not-working-on-ios-chrome/ask.jpg)

## 環境

```
Google Chrome (Desktop): 90.0.4430.85 (Official Build) (64-bit)
Google Chrome (iOS): 87.0.4280.163
```

## 原始問題

HTML 內容如下：

```html
<ul id="thumbs-up">
  <li>Apple</li>
  <li>Banana</li>
  <li>Cherry</li>
</ul>
```

而 CSS 樣式設定如下：

```css
#thumbs-up li {
  list-style-type: '\1F44D';
}
```

在電腦版的 Chrome 有正常顯示清單圖示「👍」，但切換到手機版的 Chrome，顯示的卻是「●」。
![電腦版畫面](/2021/list-style-type-not-working-on-ios-chrome/desktop-screenshot.jpg)
![手機版畫面](/2021/list-style-type-not-working-on-ios-chrome/ios-screenshot.png)
同一份 CSS 樣式，同樣都用 Chrome 來瀏覽，為何`<li>`的樣式不同？

## 解答

- 電腦版 Chrome 的 browser engine 是 Blink
- 但手機板 Chrome 的 browser engine 是 WebKit
  - [Wikipedia](https://en.wikipedia.org/wiki/Google_Chrome): Chrome is available on Apple's mobile iOS operating system as Google Chrome for iOS. In accordance with Apple's requirements for browsers released through their App Store, **this version of Chrome uses the iOS WebKit** – which is Apple's own mobile rendering engine and components, developed for their Safari browser – therefore it is restricted from using Google's own V8 JavaScript engine.
- 而根據 MDN 文件，WebKit 並不支援以`<string> value`設定`list-style-type`樣式，所以手機版的 Chrome 無法處理`list-style-type: "\1F44D";`
  ![WebKit並不支援以string作為list-style-type的值](/2021/list-style-type-not-working-on-ios-chrome/browser-support.png)
- `list-style-type: "\1F44D";`沒有作用的話，[WebKit 的 user agent stylesheet](https://trac.webkit.org/browser/trunk/Source/WebCore/css/html.css)內容就會取而代之，其樣式設定如下：
  ```css
  /* lists */
  ul,
  menu,
  dir {
    display: block;
    list-style-type: disc;
    -webkit-margin-before: 1__qem;
    -webkit-margin-after: 1em;
    -webkit-margin-start: 0;
    -webkit-margin-end: 0;
    -webkit-padding-start: 40px;
  }
  ```
- 所以透過 iOS 版的 Chrome 只會看到「●」，而不是使用`<string> value`指定的「👍」樣式

## 使用::before 來實作

HTML 內容不變，CSS 樣式改為以下內容：

```css
#thumbs-up {
  padding-inline-start: 0;
  /* 將<li>樣式的空間移除，使<li>（包含樣式與內文）向畫面左方靠攏 */
}

#thumbs-up li {
  list-style: none;
  /* 移除<li>樣式 */
}

#thumbs-up li::before {
  content: '👍 ';
  /* 使用content搭配::before來填入樣式內容 */
}
```

實際結果如下：

![iOS裝置也可看到自定義的li樣式了](/2021/list-style-type-not-working-on-ios-chrome/ios-screenshot-before-content.png)

## 參考文件

- 感謝 ALPHA Camp 政治助教的回覆：
  ![在幾乎所有的瀏覽器都支援偽元素::before的情況下，設定::before的content比較能確保li的樣式可以好好呈現在使用者眼前](/2021/list-style-type-not-working-on-ios-chrome/AC-reply.png)
- [各ブラウザごとのデフォルトのスタイルシート、user agent stylesheet のまとめ -Chrome, Safari, Firefox, Edge](https://coliss.com/articles/build-websites/operation/css/user-agent-stylesheets.html)
- [webkit/trunk/Source/WebCore/css/html.css](https://trac.webkit.org/browser/trunk/Source/WebCore/css/html.css)
- [MDN: list-style-type](https://developer.mozilla.org/en-US/docs/Web/CSS/list-style-type)
- [web.dev: Custom bullets with CSS ::marker](https://web.dev/css-marker-pseudo-element/)：須注意 WebKit 目前僅支援修改`::marker`的`color`與`font-size`，[參考 MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/::marker#browser_compatibility)
