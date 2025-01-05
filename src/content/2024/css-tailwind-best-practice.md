---
title: tailwind 快速上手筆記
date: 2024-06-22 11:53:07
tag:
- [CSS]
banner: /2024/css-tailwind-best-practice/jason-leung-cwhtQIssH9k-unsplash.jpg
summary: 最近有機會在新專案試用 tailwind。而為了避免繞遠路，在正式開工前先花了點時間搜集關於這個套件的 best practice。
draft: 
---

最近有機會在新專案試用 tailwind。而為了避免繞遠路，在正式開工前先花了點時間搜集關於這個套件的 best practice。

注意此篇文章不是 tailwind 的新手教學，而是記錄一些我認為在對這個套件有了基本了解後，可以搭配使用，進而讓開發更輕鬆的工具與訣竅。

## 搭配工具

### 官方 prettier 套件

連結：[prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)

目的：讓所有的 tailwind class 根據[官方推薦的順序](https://tailwindcss.com/blog/automatic-class-sorting-with-prettier#how-classes-are-sorted)（base layer >> components layer >> utilities layer）排列，確保使用到的樣式都不會被權重（specificity）問題影響。另外，這個 plugin 預設也會幫忙移除多餘的空白（space）與重複出現的樣式。最後，統一樣式的排序也能讓閱讀程式碼的人比較輕鬆。

### 官方 plugin

[`@tailwindcss/typography`](https://github.com/tailwindlabs/tailwindcss-typography)：

對文章常見元件提供預設樣式，比如標題的 margin 與清單的樣式，實際效果可參考[官方範例](https://play.tailwindcss.com/uj1vGACRJA?layout=preview)。適合不想花太多時間自己調教文章樣式的人。

在極致懶惰的情況下，可以只在整篇文章的容器加上 `class="prose"` 就好。不過此 plugin 也提供客製化的選項，比如在不同螢幕寬（breakpoint）[調整字體大小](https://github.com/tailwindlabs/tailwindcss-typography?tab=readme-ov-file#applying-a-type-scale)或是微調 `.prose` 之下[各式元件的預設樣式](https://github.com/tailwindlabs/tailwindcss-typography?tab=readme-ov-file#element-modifiers)。

---

[`@tailwindcss/forms`](https://github.com/tailwindlabs/tailwindcss-forms)：對表單常見元件提供預設樣式，目前的支援列表可參考 [README](https://github.com/tailwindlabs/tailwindcss-forms?tab=readme-ov-file#basic-usage)。

需注意輸入元件要帶入 type 設定，比如 `input[type='text']`。

---

[@tailwindcss/container-queries](https://github.com/tailwindlabs/tailwindcss-container-queries)：如名稱所示，安裝此 plugin 後就能使用 tailwind class 來實現 container query。

支援[一次性使用的 query 尺寸](https://github.com/tailwindlabs/tailwindcss-container-queries?tab=readme-ov-file#arbitrary-container-sizes)，也[支援透過 `tailwind.config` 來複寫](https://github.com/tailwindlabs/tailwindcss-container-queries?tab=readme-ov-file#configuration)全域尺寸設定。

### cheat sheet

搜尋 `tailwind cheat sheet` 後，挑一個看起來順眼的使用即可。個人目前是使用 [Flowbite 的 cheat sheet](https://flowbite.com/tools/tailwind-cheat-sheet/)，因為有深色模式、點一下就能複製、支援搜尋結果的 expand/collapse。

目的：減少開發時額外的心智負荷，幫助開發者快速找到還沒背起來的樣式——所以絕大多數的注意力能用於解決核心問題，不會被「回想樣式如何設定」打斷思考流程。

## 操作

### 關於重複樣式

當大量重複的樣式出現在多個元件時，除了「直接擷取重複的樣式，包裝出（抽象化）一個帶有基本樣式的元件」以外，其實也可以考慮以下方式：

- 如果重複的樣式只出現在單一檔案中（整包專案目前沒有其他地方用到這一套樣式），那就算不做任何優化也沒有關係。當日後需要修改這些樣式時，直接透過 IDE 的多重選取編輯（multi-cursor editing）來一口氣做調整就好。可參考 [tailwind 官方的範例](https://tailwindcss.com/docs/reusing-styles#multi-cursor-editing)
- 寫好樣式後，使用迴圈來產生元件

簡單來說，「重複」這件事情沒有那麼可怕，有時候問題其實有抽象化以外的解決方式。尤其抽象化會增加閱讀、理解程式碼的門檻，在執行前可以評估抽象化帶來的好處是否大於日後維護的成本。

### 關於 `@apply`

> ...don’t use `@apply` just to make things look “cleaner”.

不要「只」因為想讓樣式看起來比較簡潔而使用 `@apply`，比如以下不良示範：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn-primary {
    @apply py-2 px-5 bg-violet-500 text-white font-semibold rounded-full shadow-md hover:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-400 focus:ring-opacity-75;
  }
}
```

理由是：這種使用 `@apply` 的方式，就和直接手寫 CSS 樣式沒什麼兩樣，[失去很多使用 tailwind 系統的優點](https://tailwindcss.com/docs/reusing-styles#avoiding-premature-abstraction)——你需要發想 CSS 樣式的名稱、需要在不同的檔案之間切換才能知道樣式的設定。日後修改一個 `@apply` 樣式時，你不確定是否會有預期外的影響。最後，打包（bundle）完的檔案尺寸也會比較大。

`@apply` 比較推薦的應用場合，是在需要將 tailwind 的樣式權杖（design token）[套用在第三方套件](https://tailwindcss.com/docs/functions-and-directives#apply)的時候。

### 關於動態樣式

「不要」動態組合 tailwind 樣式，比如以下錯誤示範：

```tsx
const meetCondition = Math.random() >= 0.5;
const dynamicClass = `text-${meetCondition ? 'green' : 'red'}-500`;

<h1 class={dynamicClass}>Hello World</h1>;
```

理由是：tailwind 會檢查整個專案，並只產生有使用到的樣式。而 tailwind 的檢查機制又是「完整比對 class 名稱」（出自[官方文件](https://tailwindcss.com/docs/content-configuration#class-detection-in-depth)）。所以 tailwind 無法辨認出上述動態組出的 `text-green-500` 與 `text-red-500`。

解決方式：需要動態樣式時，要完整列出 tailwind class 名稱：

```tsx
const meetCondition = Math.random() >= 0.5;
const dynamicClass = meetCondition ? 'text-green-500' : 'text-red-500';

<h1 class={dynamicClass}>Hello World</h1>;
```

更多資訊請參考[官方文件](https://tailwindcss.com/docs/content-configuration#dynamic-class-names) 的說明。

## 實用樣式

以下是從一些教學影片匯集出來，不需要開發者再從頭造輪子的實用內建樣式：

- `.group` 可讓元件的外觀根據**親元件的狀態**進行變化，而 `.peer` 則是能讓元件的外觀根據**鄰近元件的狀態**進行變化
- `.container` 可讓元件直接變成有限寬度的容器，可透過 `tailwind.config` 中的 `theme.container` 設定全域樣式
- `.size` 可同時設定元件的寬高，比如 `.size-2` 在預設情況下會將元件的寬高都設定為 8px
- `.divide` 可設定元件在水平或是垂直方向產生分隔線（使用的 CSS 樣式為 `border`）
- `.ring` 會透過 `box-shadow` 來產生類似邊線的效果
- 在一些真的無法使用 `flex` 或 `grid` 來安排元件間距時，可使用 `.space` 來做出間距（使用的 CSS 樣式為 `margin`）
- `.bg-gradient-to-` / `.from-` / .`via-` / `.to-` 能直接控制背景顏色梯度（background-gradient）的方向，以及背景起點、中繼、終點的顏色
- `.animation` 提供了一些基本動畫效果——旋轉（`.animate-spin`）、閃爍（`.animate-ping`）、脈動（`.animate-pulse`）與彈跳（`.animate-bounce`）

## 參考文件

本筆記大部分的工具與技巧出自以下三部 YouTube 影片，再搭配 [tailwind 官方文件](https://tailwindcss.com/)整理為筆記：

- [I WISH I Knew These Tailwind Tips Earlier](https://youtu.be/QBajvZaWLXs?si=kDfIQmn3vlSLNrxl)
- [10 Tailwind Tricks You NEED To Know!](https://youtu.be/aSlK3GhRuXA?si=wofL_8WI0GMGQoQS)
- [10 Tailwind Classes I Wish I Knew Earlier](https://youtu.be/x1RJ5Q09PqM?si=tR17D0aGEywUmTY2)
