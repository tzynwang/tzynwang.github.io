---
title: 以 minmax() 來實作伸縮自如的容器
date: 2025-11-09 14:17:43
tag:
  - [CSS]
banner: /2025/css-grid-minmax/伸縮自如的愛.jpeg
summary: 如果你需要根據內容多寡來動態調整一個元件的尺寸，但這個元件又有一個必須遵守的最大尺寸限制，那 minmax() 應該會是你的好朋友。而如果你看不懂前面那句話到底在公尛，那歡迎點開這篇文章看一下範例，大概就會懂了 🌚
draft:
---

## 前言

最近處理了兩種元件剛好都很適合用 `display: grid` 搭配 `minmax()` 來解，需求如下：

1. 使用者提供的內容長短不一，而元件本身要能良好地展示極短與極長的內容
2. 如果是極短的內容，預期展示全部內容，並且元件本身「不可佔據任何額外的空間」
3. 如果是極長的內容，可以接受部分內容不被展示；元件本身「可以佔據一定程度的額外空間，但絕不可突破版面限制」

🥹：阿鬼，你能不能講中文

🦊：其實就是要搓麵包屑和對話框元件，並且這兩個元件都各有一處需要帶入使用者提供的內容。

## 實際程式碼

麵包屑：有兩組固定寬度的連結、一組固定寬度的按鈕，搭配使用者提供的「極短或極長的連結」來組成元件。整個麵包屑只能佔據一行空間（不可換行）。三個連結最少僅能佔據剛好夠它們用的空間，最多也只是「整行扣掉按鈕後剩下的空間」。允許前端隱藏部分過長的連結內容。

<p
  class="codepen"
  data-height="300"
  data-default-tab="css,result"
  data-slug-hash="JoGQeXy"
  data-pen-title="dynamic width by minmax() "
  data-preview="true"
  data-user="Charlie7779"
  style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em"
>
  <span>See the Pen <a href="https://codepen.io/Charlie7779/pen/JoGQeXy"> dynamic width by minmax() </a> by Charlie (<a href="https://codepen.io/Charlie7779">@Charlie7779</a>) on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://public.codepenassets.com/embed/index.js"></script>

對話框：天地區塊都是固定內容，但中間要用來展示使用者提供的極短或極長內容。整個對話框有最大尺寸限制。當使用者提供的內容極短時，此元件不可額外佔據多餘空間。當使用者提供的內容極長時，此元件最多也僅能使用「不超過最大尺寸限制」的空間。

<p
  class="codepen"
  data-height="300"
  data-default-tab="css,result"
  data-slug-hash="gbPNQeJ"
  data-pen-title="dynamic height by minmax()"
  data-preview="true"
  data-user="Charlie7779"
  style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em"
>
  <span>See the Pen <a href="https://codepen.io/Charlie7779/pen/gbPNQeJ"> dynamic height by minmax()</a> by Charlie (<a href="https://codepen.io/Charlie7779">@Charlie7779</a>) on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://public.codepenassets.com/embed/index.js"></script>

🥹：所以這跟 `display:grid` 和 `minmax()` 有什麼關係？

🦊：`grid` 讓元件遵守最大空間限制，而 `minmax()` 可以根據內容來動態調整它需要佔據的空間。

以麵包屑來說，關鍵是以下兩組樣式：

- `grid-template-columns: max-content max-content minmax(4ch, max-content) max-content max-content`
- `overflow: hidden; text-overflow: ellipsis; white-space: nowrap;`

第一組樣式的 `max-content` 讓固定寬度的連結「僅取用它們需要的空間，不佔據任何額外空間」，而 `minmax(4ch, max-content)` 代表使用者提供的連結最少會佔據 `4ch` 的寬，最多可以佔據「足夠展示其內容的寬度」——這裡再搭配第二組樣式，做出「過長的內容會被隱藏，並以 `...` 取代之」的效果。這樣就能實現「當內容極短時，此麵包屑僅佔據需要的空間；而當內容極長時，盡可能展示所有內容，但不造成爆版」的需求。

以對話框來說，關鍵是以下兩組樣式：

- `max-height: min(240px, calc(100dvh - 96px))`
- `grid-template-rows: max-content minmax(0, 1fr) max-content`

透過 `max-height` 限制元件最大高度，再搭配 `grid-template-rows` 中的 `minmax(0, 1fr)` 來實現「當內容極短時，中間部位僅佔據需要的空間，而當內容極長時，可以取用剩餘的所有可用空間」——這樣就能讓對話框對應「內容極短時，展示全部內容，並且元件本身不佔據任何額外的空間」，以及在使用者提供極長內容時，對話框依舊不會超過設計稿的高度限制。

搞定！

## 參考資料

[Intrinsic size](https://developer.mozilla.org/en-US/docs/Glossary/Intrinsic_Size)：`max-content` 是「內容在不彎折情況下的空間」，而不是「最大可以使用的空間」。
