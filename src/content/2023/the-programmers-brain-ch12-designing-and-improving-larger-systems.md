---
title: 閱讀筆記：The Programmer's Brain Chapter 12 Designing and improving larger system
date: 2023-11-02 19:31:55
tag:
	- [General]
banner: /2023/the-programmers-brain-ch12-designing-and-improving-larger-systems/mike-kononov-lFv0V3_2H6s-unsplash.jpg
summary: 本章介紹了 CDCB (cognitive dimensions of codebases)，讓使用者能透過「認知」的角度來觀察程式碼。使用者在理解到程式碼的各種認知特徵後，也能根據一個專案的生命週期來決定維護重點方向。
draft: 
---

## 總結

本章介紹了 CDCB (cognitive dimensions of codebases)，讓使用者能透過「認知」的角度來觀察程式碼。使用者在理解到程式碼的各種認知特徵後，也能根據一個專案的生命週期來決定維護重點方向。

## 筆記

### 何謂 CDCB (cognitive dimensions of codebases)

CDCB (cognitive dimensions of codebases) 是從 CDN (cognitive dimensions of notation) 延伸出來的框架。主要是從認知（cognitive）的角度來研究一包程式碼，探究的問題多半為：「這包程式碼好修改、好維護嗎？」以及「使用者能輕鬆地在這包 code 裡面找到他需要的資訊嗎？」這類**非技術面向**的問題。

> CDN, which is a technique to **examine codebases from a cognitive perspective**. CDN helps you answer questions about existing large codebases, such as “Will this code be easy for people to change?” or “Will this codebase be easy for people to find information in?”

透過 CDCB 來檢視一包程式碼，可以讓你了解其他人使用這包程式碼的體驗與心情，也可以說是評估一包程式碼的可用性（usability）。

> Examining codebases from a cognitive rather than technical perspective can help you gain a better perspective on **how people interact with your code**.

> ...when we discuss different libraries, frameworks, modules, or programming languages, we can also discuss **what they do to your brain** rather than your computer.

### 程式碼的認知特徵

以下摘要本書提到的 13 種程式碼的認知特徵。

易出錯性（Error Proneness）：以程式語言為例，本書指出弱型別的 JavaScript 就比強型別的 C 來得「容易出錯」。程式碼也會有這種特性，當一個使用者運用沒有完整說明文件的函式庫時，就比使用有著嚴謹說明文件的函式庫容易出錯。

---

連貫性（Consistency）：比如變數是否統一採用駝峰或蛇形命名？是否所有的 class 都以大寫開頭命名？「不連貫」會增加使用者的認知負荷，因為需要一直確認「看到的東西是否一致」。

> A framework or language that is **inconsistent** in its use of names and conventions might lead to greater cognitive load because it will **take your brain more energy to understand what is what**, and it might take you more time to find relevant information.

---

擴散性（Diffuseness）：指一段程式碼佔據的實體或認知空間。

比如以下兩個功能有一樣的效果，但解法ㄧ的擴散性就比解法二高：

```js
const arr = [1, 2, 3];

// 一
const result1 = [];
for (let i = 0; i < arr.length; i++) {
  result1.push(arr[i] + 2);
}

// 二
const result2 = arr.map((item) => item + 2);
```

而一段程式碼是否能被有效分塊（chunking）就會影響認知空間的消耗。

---

隱藏依賴（Hidden dependencies）：舉例來說，如果一個出現在畫面上的按鈕是透過 JavaScript 渲染、而非直接刻在 html 中的話，這種情況就能算是一種「隱藏依賴」，因為控制該按鈕的程式碼是獨立於 html 以外的 JavaScript 檔案。

---

臨時性（Provisionality）：書中定義為「在思考時使用該工具的難度」。比如多人進行討論時，「使用白板將想法記錄下來」的難度就會比「把想法記錄在 Google Doc 中」來得低。因為白板不會限制使用者「怎麼書寫」，但 Google Doc 會限制使用者「只能根據它的規則來記錄內容」。亦即 Google Doc 的臨時性比白板來得低。

> If a codebase or programming language is **very strict** (for example, using types, assertions, and post conditions), it can **be hard to use code to express a thought**. We then say this tool has **low provisionality**.

程式碼的低臨時性會讓使用者理解這包 code 的難度變高，因為低臨時性代表程式碼要求使用者要嚴謹地思考、使用它。亦即在程式碼本身的邏輯以外，使用者需要消耗額外的精神來進行「符合程式碼規範的思考」。

> Provisionality is an essential factor in learnability because expressing vague ideas and incomplete code might be needed if you are a beginner in a certain system. Thinking of a plan for your code while **also thinking about types and syntax** can **cause too much cognitive load** in beginners.

---

黏度（Viscosity）：代表改動的難度。可以想像一下：修改強型別程式碼多半會比修改弱型別程式碼費工，因為弱型別不要求使用者嚴謹的定義型別資訊。

而如果一段程式碼需要消耗大量時間在測試、打包或編譯上，我們也能說這包程式碼的改動黏度很高。

---

漸進改變支援度（Progressive evaluation）：可參考 webpack 的使用方式，使用者可以傳入非常少的打包設定（沒有指定的部分就讓 webpack 預設值發揮），但也能根據自身需求傳入十分詳盡的客製化設定。我們可以說 webpack 有不錯的改變支援度。

---

角色辨識度（Role expressiveness）：以 Visual Studio Code 的主題 [dracula](https://draculatheme.com/visual-studio-code) 與 [GitHub Theme](https://marketplace.visualstudio.com/items?itemName=GitHub.github-vscode-theme) 為例，這兩個主題都會根據程式碼的角色與功能來標注對應的顏色（比如 dracula 會將 class 中的 constructor / get 等關鍵字統一標記為粉色、而 method 統標為綠色）。

能夠一眼「辨認出不同段落的功能」的難度越低，就代表角色辨識度越高。

---

關聯度（Closeness of mapping）：領域驅動設計（Domain Driven Design）基本上就是在提倡此特徵。

> ...domain-driven design philosophy prescribes that the **structure and identifiers** in code should **match the business domain**.

負面舉例：如果一個函式的命名很難讓人一眼就了解該函式的目的、或是命名根本與函式本身在做的事行背道而馳，我們就能說該函式名稱的關聯度很低。

---

思考難度（Hard mental operations）：難度越高，對認知的消耗程度就越大。書中舉例如下：

> Finally, some operations are hard because they take a toll on the working memory, for example, if data has to be downloaded from **two difference sources** in **two different formats** and converted into a **third format**. The user will then have to keep track of the different streams and their corresponding types.

---

額外資訊支援度（Secondary notation）：比較白話文的說法就是「對註解的支援程度」或是「是否支援 name parameter」。這些特徵不會影響一段程式碼要表現的功能，但能讓使用者比較容易理解程式碼意圖達成的目標。

---

抽象程度（Abstraction）：代表使用者是否能自訂功能、類別（class）與物件。書中舉例：一個允許使用者自訂 subclass （使用者可主動）的函式庫，其抽象程度就比只提供 api 讓使用者介接的函式庫（使用者處於被動）來得高。

> For example, allowing a library user to create a subclass to which additional functionality can be added has more power of abstraction than a library that just allows API calls.

---

可視性（Visibility）：書中舉例偏向「對結構的支援程度」。

> For example, an API that fetches data might return a string, a JSON file, or an object, which each have a different visibility. **If a string is returned, it is harder to see the form of the data**, and the framework offers the user lower visibility.

### 認知特徵與開發時的心智活動

[本書第 11 章](/2023/the-programmers-brain-ch11-the-act-of-writing-code#開發行為背後的心智活動) 有提過 5 種開發時的心智活動，分別是搜尋（searching）、理解（comprehension）、轉錄（transcription）、增量（incrementation）與探索（exploration）。而這些心智活動與上述提到的 13 種認知特徵的互動如下：

- 搜尋：大量的隱藏依賴（Hidden dependencies）會阻礙搜尋；高擴散性（Diffuseness）會讓程式碼變長，於是要搜尋的內容變多；不過良好的額外資訊支援（Secondary notation）（註解）會降低搜尋的難度
- 理解：低可視性（Visibility）會增加理解難度，反之明顯的角色辨識度（Role expressiveness）與明顯的連貫性（Consistency）可以降低此活動的難度
- 轉錄、增量：在擴充功能時，讓理解變簡單的高連貫性（Consistency）可能會增加額外工作，因為需要確保整包程式碼的一致性；另外高黏度（Viscosity）也會讓提升這兩種活動的困難度
- 探索：高臨時性（Provisionality）、漸進改變支援度（Progressive evaluation）會讓探索體驗較為良好；反觀高思考難度（Hard mental operations）會讓增加探索的難度

### 設計上的取捨

程式碼的認知特徵有可能互相對立，而「為了增加某一面向的特徵，所以對程式碼進行修改」就被稱為設計操縱（design maneuver）。

> Making changes to a codebase to improve a certain dimension in a codebase is called a **design maneuver**.

以下列出較常見的對立特徵：

- 易出錯性（Error Proneness）對黏度（Viscosity）
- 臨時性（Provisionality）、漸進改變支援度（Progressive evaluation）對易出錯性（Error Proneness）
- 角色辨識度（Role expressiveness）對擴散性（Diffuseness）

---

另外，需注意一包程式碼在不同的生命階段會有不同的重點取向。

比如進入穩定、夕陽階段的專案通常大改動較少、搜尋行為較多，那麼提升註解（Secondary notation）的成分就能讓開發者的體驗比較好。反過來說，還在早期衝刺階段的程式碼可以比較不計較黏度（Viscosity）與連貫性（Consistency）特徵，降低擴充功能的難度。

## 參考文件

- [Manning: The Programmer's Brain](https://www.manning.com/books/the-programmers-brain)
