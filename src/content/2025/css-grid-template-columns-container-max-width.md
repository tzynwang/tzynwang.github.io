---
title: 以 grid-template-columns 來限制最大容器寬
date: 2025-07-29 18:45:56
tag:
  - [CSS]
banner: /2025/css-grid-template-columns-container-max-width/let-me-in.jpg
summary: 在需要同時處理 overflow 和 filter drop-shadow 時，平常慣用的 max-width 配 margin-inline 的寫法可能會讓陰影⋯⋯看起來有點問題 🌚
draft:
---

行前說明：這篇文章會直接使用 [tailwind v3](https://v3.tailwindcss.com/) 的語法來描述 CSS 樣式。

---

最近收到的切版需求如下：

> 主要內容的容器最寬不超過 600 像素，且此容器需在畫面上水平置中。另外，此容器會有兩個子代元素，呈垂直排列。第一個子元素預期會有大量文字內容，使用者要能捲動此區域；而第二個子元素要帶陰影效果。噢對了，畫面最上方當然會有個導覽列。

![這是切版需求的示意圖](/2025/css-grid-template-columns-container-max-width/layout.png)

第一眼看到稿子想說還不簡單，直接 `md:mx-auto md:max-w-[600px]` 就好了。殊不知這在子元素同時需要處理「捲動」和「帶陰影效果」時會滑鐵盧——擴散出去的陰影會被 `overflow-hidden` 裁掉（可參考下方示意圖，或[可互動範例](https://codepen.io/Charlie7779/pen/gbaLXOZ)）。

![陰影被裁掉的示意圖](/2025/css-grid-template-columns-container-max-width/drop-shadow-is-cut.png)

一陣沉思後，改用 `grid-cols-[1fr,min(100%,600px),1fr]` 來處理。這行樣式做的事情是：

1. 將容器切成左中右三個欄
2. `min(100%,600px)` 代表中間欄的最小寬為 600 像素或滿版寬，亦即在低於 600 像素的小裝置時，中間欄可以享用整個裝置的寬度，但在裝置超過 600 像素後，此容器至多只能佔用 600 像素（由 [Adam Argyle 的文章 3 Unintuitive CSS Layout “Solutions”](https://nerdy.dev/3-unintuitive-layout-solutions#intrinsically-responsive-grid-columns) 啟發）
3. 剩下的空間透過 1fr 均分給左右欄（這個寫法印象是從 [Kevin Powell 的頻道](https://www.youtube.com/@KevinPowell)看到的）

沒有 `max-w-[600px]` 後，陰影效果就沒有被裁掉的問題了：

<p class="codepen" data-height="600" data-default-tab="result" data-slug-hash="myeOqbz" data-pen-title="grid col span" data-preview="true" data-user="Charlie7779" style="height: 600px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/Charlie7779/pen/myeOqbz">
  grid col span</a> by Charlie (<a href="https://codepen.io/Charlie7779">@Charlie7779</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://public.codepenassets.com/embed/index.js"></script>

搞定。
