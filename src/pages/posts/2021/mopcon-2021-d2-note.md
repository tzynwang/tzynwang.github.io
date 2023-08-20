---
layout: '@Components/SinglePostLayout.astro'
title: MOPCON 2021 第二天之前端開發相關內容之議程筆記
date: 2021-10-24 11:46:28
tag:
  - [Web performance]
---

## 總結

整理了 2021 MOPCON 第二天與前端開發相關議程（包含心法與技術面向）的筆記與延伸參考資料

## 面對學不完的技術，工程師該如何自救

> 重點：保持好奇心，根據自己的需求來學習，並培養能判斷任務優先度的能力

- 台灣的學校提供的是結構性（structural）的學習方式，然而非結構性（unstructured）的學習能力有其必要性
  - 結構性的學習：透過已經安排好的課綱或教材、教科書或影片來學習一科目
  - 非結構性的學習：（以前端開發來說）自行閱讀原始碼或官方文件來掌握一門新技術；如果一直想要走在技術的最前線，非結構性的學習能力是必要的，因為你必須在其他人幫你整理好資料之前就自行想辦法吸收、內化一門知識
- 如何判斷是否需學習一個新技術？
  - 以開源專案來說：參考 GitHub repo 的活絡程度（星星數與提交的更新頻率）、社群活躍程度
  - 評估該技術的前瞻性：包含使用該技術的必要性，以及該技術的穩定程度
  - 如果是有興趣的新技術那當然可以深入鑽研，為新而新則沒有必要；拋開時間上的焦慮感來鑽研一門科目，而不是雨露均霑
- 過去的習慣可能是「先學好學完、再上戰場」，但慢慢地變成「發現自己欠缺什麼能力，根據這些不足來進行補強」
- 在這個高度分工的年代，如何找到隊友？
  - 參加社群，多交朋友，與他們交換社群帳號；你不一定要親自研究所有領域，但看看人家在他的專業領域中有什麼新分享，而你就可以藉此收穫新知
- 好的工程師應培養出可以判斷任務輕重緩急的能力，根據自己的專業知識預測未來可能會遇到的挑戰
- 讓自己保持好奇心、踏出舒適圈，但也不用一直待在讓自己身心疲乏的核爆圈

## 報稅手機版的 UX 優化與 JTBD 的用法實踐

> 重點：專案在開發的各個階段就頻繁導入易用性測試（usability test）來確保最終成果真的可以服務到使用者

- JTBD: Jobs to be Done
- Jobs Story：根據使用者「要解決的問題」來研訂開發策略（但並不是捨棄 user story），設計出「使用者在操作產品完成任務時可以感到滿足」的解決方案

![user story, job story](/2021/mopcon-2021-d2-note/user-story-job-story.png)

- 如何讓使用者覺得你的服務值得信賴？
  - 「在每一個對的時間，提供對的感受體驗」
  - 信任不是突然、自然發生的
- 信任是透過什麼樣的體驗累積而成？
  - 體貼感：預先設想使用者**可能會在哪裡犯錯**，並**預先避免錯誤發生**（替使用者想好下一步）
  - 熟悉感：以相似的方式**類比**，減少學習曲線；提供視覺上具有**一致性**的元件與畫面，降低認知負荷；讓使用者以熟悉的方式進行互動
  - 專業感：把複雜的任務**簡化**、讓使用者可以輕易理解現在發生什麼事；避免使用使用者不清楚的專業術語
  - 安全感：了解使用者一開始持有的預期，調整使用者對系統的預期認知，**增加使用者對系統功能與流程的掌握程度**
- 在每一個開發階段（wireframe 時、視覺設計時、開發時）都導入易用性測試
- 結論：
  - 要了解產品是要幫使用者解決什麼問題？
  - 以使用者的問題為核心展開開發，所有的設計指向一致目標
  - 持續發現問題，並及早解決問題

## 算字數而已，為何如此麻煩？ —— 從 Unicode 標準看 Emoji 和多語系的組合技

```js
'好'.length
// 1
'𪚥'.length
// 2
'🤔'.length
// 2
'👨‍👩‍👦‍👦'.length
// 11

'💩' == '\uD83D\uDCA9'
// true

[...'👨‍👩‍👦‍👦']
// ['👨', '‍', '👩', '‍', '👦', '‍', '👦']
```

![emoji](/2021/mopcon-2021-d2-note/know-something-strange.jpg)

- 為什麼在用 length 計算字數的時候會出現上述結果？
  - `length`長度超過 1 代表背後是由多個 unicode codepoints 組合而成
  - JavaScript 的`str.length`回傳的是 str 以 UTF-16 編碼的單位數量
    > [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/length): The length property of a String object contains the length of the string, in **UTF-16 code units**.
- Surrogate Pair：「代理對」
  - 💩 可以拆為`U+D83D`與`U+DCA9`的組合，這就是一組代理對
- 解決方式：改為計算「grapheme cluster（字位、形素、字素）」的數量
  - grapheme cluster：最小的有意義書寫符號單位（引自維基百科）
  - JavaScript 目前可以靠 Lodash 中的[toArray](https://lodash.com/docs#toArray)來幫忙處理
    解法來自[Why is "👍".length === 2?](https://stackoverflow.com/a/46085089/15028185)
    ```js
    _.toArray('🤔').length; // --> 1
    ```
- 延伸閱讀：
  - [Emoji String Length, Issues with Rounded Buttons, Bundled Exchanges](https://css-tricks.com/weekly-platform-news-emoji-string-length-issues-with-rounded-buttons-bundled-exchanges/)
  - [在程式裡算 Emoji 字數的那些問題](https://medium.com/dcardlab/%E5%9C%A8%E7%A8%8B%E5%BC%8F%E8%A3%A1%E7%AE%97-emoji-%E5%AD%97%E6%95%B8%E7%9A%84%E9%82%A3%E4%BA%9B%E5%95%8F%E9%A1%8C-8e1a1170a499)

## Speed Up Your App with Web Vitals

> 使用者認為的快：「內容出現的速度快、回應快、網站畫面不會大幅度變動」

- Web Vitals：由 Google 提出，檢驗一個網站的使用者體驗是否良好的核心指標
  - [Web Vitals](https://web.dev/vitals/) is an initiative by Google to provide unified guidance for quality signals that are essential to **delivering a great user experience on the web**.
- Core Web Vitals：由 LCP、FID 與 CLS 組成
  - Largest Contentful Paint：最大內容區塊出現的時間點
  - First Input Delay：使用者與網站互動後，網站**真正回應使用者的時間差**
    舉例：在網站的搜尋欄位打字，而網站真的把使用者輸入的內容呈現在輸入框內的時間差
  - Cumulative Layout Shift：（載入完畢後，整體）版面移動的幅度，評估的是視覺上的**穩定程度**
    舉例：如果有廣告會大幅擠動網頁版面，CLS 數值就會很高
- Other Web Vitals：兩項，FCP 與 TTFB
  - First Contentful Paint：**畫面上出現第一個像素**的時間點
  - Time to First Byte：瀏覽器收到資源的第一個時間點
- 造成網頁載入速度低落的原因：
  - 有 rendering blocking（禁止轉譯）的資源，比如沒有必要在 header 區塊載入的 CSS 或 JS 內容
  - 伺服器回應速度本來就慢
  - （上面這一點連帶影響到）資源載入的速度慢
- （聊天室撿來的討論串）「code-splitting 除了講者提到的切 chunk 以外，還有什麼其他實現的方法嗎？」
  - 使用 ES import 語法（而非 commonJS 的`require()`），因為其匯入相對靜態的特性，能方便 webpack 或 rollup 等打包軟體過濾掉未使用的內容
  - 比較少使用的 module 可配合 dynamic import 達成「只有在用到該功能的時候才進行匯入」
- 補充：
  - [Code splitting](https://developer.mozilla.org/en-US/docs/Glossary/Code_splitting): splitting of code into various bundles or components which can then **be loaded on demand** or in **parallel**. To prevent the requirement of downloading ginormous files, scripts can be **split into multiple smaller files**. Then features required at page load can be downloaded immediately with additional scripts being lazy loaded after the page or application is interactive, thus **improving performance**. While the total amount of code is the same (and perhaps even a few bytes larger), **the amount of code needed during initial load can be reduced**. 將程式碼拆分成小塊，檔案合計總大小不變，但在初次載入時需要下載的檔案大小會縮減
  - [Tree shaking](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking): a term commonly used within a JavaScript context to describe **the removal of dead code**. It relies on the `import` and `export` statements in ES2015 to detect if code modules are exported and imported for use between JavaScript files. In modern JavaScript applications, we use **module bundlers (e.g., webpack or Rollup) to automatically remove dead code** when bundling multiple JavaScript files into single files. This is important for preparing code that is production ready, for example with **clean structures** and **minimal file size**. 意即把沒有用到程式碼內容排除掉

## 參考文件

- [面對學不完的技術，工程師該如何自救](https://mopcon.org/2021/schedule/2021025)
- [iOS 隱私與便利的前世今生](https://mopcon.org/2021/schedule/2021028)
- [報稅手機版的 UX 優化與 JBTD 的用法實踐](https://mopcon.org/2021/schedule/2021034)
- [算字數而已，為何如此麻煩？ —— 從 Unicode 標準看 Emoji 和多語系的組合技](https://mopcon.org/2021/schedule/2021037)
- [Speed Up Your App with Web Vitals](https://mopcon.org/2021/schedule/2021042)
