---
layout: '@Components/pages/SinglePostLayout.astro'
title: 閱讀筆記：Good Code, Bad Code Chapter 5 Make code readable
date: 2023-03-25 14:40:09
tag:
  - [Software Architecture]
---

## 總結

此篇文章是 Good Code, Bad Code: Think like a software engineer 第五章（Make code readable）的閱讀筆記。此章旨在提供「提升程式碼可讀性」的具體手段。

## 筆記

### 關於「提升程式碼可讀性」的核心觀念

> The essence of **readability** is ensuring that engineers can **quickly and accurately understand what some code does**. Actually achieving this often requires **being empathetic** and trying to imagine how things might be confusing or open to misinterpretation when seen from someone else’s point of view.

總結：撰寫程式碼時，試著站在「閱讀這段程式碼的人」的立場（同理）思考——這段程式碼有哪些部分可能會令人困惑、誤會？

可參考以下列出的技巧來辨識一段程式碼是否包含不易理解的部分，而各種容易造成理解困難的因子又各自可以透過什麼方式來化解。

### 如何提升程式碼的可讀性

#### 為 function 或變數進行有意義的命名

有意義的名稱可以讓工程師一看就知道該 function 想要達成的功能、或是該變數代表的意義。

負面範例：使用者根據 function 名稱（`getHeadingMarginTopByRWD`）可理解此功能乃是根據 RWD breakpoint 來回傳對應的 heading margin-top 數值，但無法得知回傳的數值是根據什麼樣的規則計算出來的。

```ts
function getHeadingMarginTopByRWD(): number {
  const upBreakpointXl = isCurrentBreakPointUp('xl');
  const upBreakpointMd = isCurrentBreakPointUp('md');

  if (upBreakpointXl) {
    return 92;
  }
  if (upBreakpointMd) {
    return 76;
  }
  return 60;
}
```

正面範例：追加常數 `APP_BAR_HEIGHT_PX` 協助辨明整個 function 的計算規則。

```ts
function getHeadingMarginTopByRWD(): number {
  const APP_BAR_HEIGHT_PX = 60;
  const upBreakpointXl = isCurrentBreakPointUp('xl');
  const upBreakpointMd = isCurrentBreakPointUp('md');

  if (upBreakpointXl) {
    return APP_BAR_HEIGHT_PX + 32;
  }
  if (upBreakpointMd) {
    return APP_BAR_HEIGHT_PX + 16;
  }
  return APP_BAR_HEIGHT_PX;
}
```

現在可知 heading 的 margin-top 數值乃是根據「app bar 的元件高度」以及「RWD breakpoint 條件」來計算。日後即使 app bar 高度有變，接手維護這段程式碼的工程師也能明白應該如何調整 `getHeadingMarginTopByRWD` 的內容。

---

補充：命名規則還可以延伸到 function 參數上。工程師可以透過 TypeScript 以及 object destructure 來模擬出參數命名的效果：

```ts
interface sendMessageArgs {
  message: string;
  priority?: number;
  allowRetry?: boolean;
}

function sendMessage({ message, priority, allowRetry }: sendMessageArgs) {
  // ...
}

sendMessage({ message: 'hello world!' });
sendMessage({ message: 'hello again!', priority: 3, allowRetry: true });
```

#### 合理使用註解

儘管在本書第三章有提到「避免讓一段程式碼必須依賴註解、文件才能夠被理解」，但如果是為了說明商業邏輯、或是一些需要特殊處理才能讓程式碼動起來的情況下，則不要吝於對程式碼提供註解。而前述的「特殊情境」可能是：

- 引用的第三方套件有些已知但還未解決的問題，我們在使用這些套件時，需要透過一些技巧來讓程式碼最終還是能表現出想要的效果；這時，僅透過程式碼本身可能很難猜出工程師的本意，那麼提供註解來解釋「為何在這裡我們要這樣寫 code」就是一個合理的註解使用情境
- 一包程式碼可能經過多次轉手，部分既有程式碼可能不易維護（比如試圖修改一個眼前的小問題，卻發現這造成牽一髮動全身的窘境），而這些「是為了配合既有程式碼來解決問題」的手法就適合搭配註解來說明「為何這裡的 code 要這樣寫」

比較好的做法是根據常識來判斷「這段程式碼是否需要其他說明才能讓他人理解」。如果一包程式碼因為一些理由無法使得它能自我表述（self-explanatory），那麼為這段 code 加上註解就是一個合理的行為。

反之，為了一看就能懂的概念繼續添加註解就是畫蛇添足，應避免這類行為。

#### 避免無意義的程式碼行數限制

不過度追求壓縮程式碼的行數、字數。避免僅只是為了壓縮字數而犧牲程式碼的可讀性。

另外，如果察覺到一段程式碼開始有「壓縮長度」的需求，此時可能也須檢查該程式碼是否一口氣試圖解決過多問題（沒有良好的抽象層）的傾象。

#### 避免過多巢狀結構

舉例：

```ts
function formatArrayToObject(argArray) {
  if (argArray.conditionX) {
    return argArray.reduce((prev, curr) => {
      if (curr.conditionY) {
        // ...
      } else {
        // ...
      }
    }, {})
  } else {
    return { ... }
  }
}
```

過多的條件分支會讓一段程式碼不易閱讀，也代表此 function 可能試圖一口氣解決太多問題。

可透過 early return 、或是將該 function 中處理的多種任務各自分拆為單一功能來避免理解困難。

#### 避免反共識的撰寫風格

反共識（比如使用小寫開頭的單字為 class 命名、使用小寫單字來命名常數）的撰寫風格會造成其他人在閱讀程式碼時，無法套用既有的經驗來幫助理解內容。過於自由的撰寫風格會增加理解程式碼的困難度。

書中建議：開發團隊可挑選一組全員同意遵守的 linter 來避免此類問題。

#### 合理使用新功能

重點如下：

1. 使用過於新穎的語法是否會造成開發團隊中其他成員的理解困難？
2. 看到新玩具就想要嘗試是人性，但需注意自己是否有正確運用該功能？或是只是想嚐鮮、但沒有仔細思考該工具的使用情境是否合理？應盡量避免後者發生。

## 參考文件

- [Manning: Good Code, Bad Code](https://www.manning.com/books/good-code-bad-code)
