---
title: 閱讀筆記：Good Code, Bad Code Chapter 4 Errors
date: 2023-03-19 15:11:59
tag:
- [Software Architecture]
---

## 總結

此篇文章是 Good Code, Bad Code: Think like a software engineer 第四章（Errors）的閱讀筆記。除記錄章節重點外，本篇文章也提供一些如何在 TypeScript 實作此章建議的範例程式碼。

本章重點如下：

- 軟體拋錯代表有功能執行不如預期，不應隱藏、且應盡可能讓錯誤明顯，工程師才有機會處理錯誤
- 盡可能讓工程師意識到「某段程式碼可能會拋錯」，工程師才會有「這段程式碼可能會出錯，我需要提供應對手段」的意識

## 筆記

### Recoverability

本書認為軟體錯誤可分為「可復原」與「無法復原」兩種類型，此二類型的特徵如下：

- 可復原的錯誤：代表軟體遭遇此類錯誤時，有辦法自行脫離錯誤狀態。
  - 以前端開發為例，「呼叫後端 API 時收到 503 Service Unavailable 回應」就是一種「可復原錯誤」，前端服務能在偵測到後端回應 503 後，在畫面上顯示提示訊息，而不是讓整個前端服務停止運作
  - 牽涉到「外部」的錯誤通常可歸類在此範疇，因「外部失效」是一軟體在運行中可預見的事態。以前端開發為例，相對於前端服務本身，「後端 API 回應」以及「使用者提供的輸入（從鍵入文字資料到上傳檔案）」失效都是合理且可預期發生的行為，要求前端服務在偵測到此類行為時能夠自行應對、處理（而不是讓整個服務跟著停止運作），算是合理的開發規格
- 無法復原的錯誤：代表軟體遭遇此類錯誤時，無法自行脫離錯誤狀態
  - 以前端開發為例，假設使用者在開啟一 React APP 時因網路狀態不佳、導致一部分 JavaScript 檔案沒有被載入，結果會導致此 React APP 無法正常運行，且此 React APP 也無法自主脫離這個錯誤狀態，這就是一種無法復原的錯誤
  - 如果將規模縮小到 function 等級，則「呼叫某 function 時，沒有提供正確的參數」導致該 function 無法順利被執行，對該 function 來說，這就是無法復原的錯誤
  - 針對此類錯誤，本書作者認為「原地且大聲報錯（failing fast and failing loudly）」是比較好的處理方式，因爲如此才能確保錯誤被工程師看見、才有機會被修復

### Robustness vs. failure

> failing fast and failing loudly

- 原地拋錯：這會讓工程師在除錯時能夠盡快定位到錯誤位置，而不用翻找一層又一層的程式碼
- 大聲拋錯：確保錯誤會被察覺、被修復，而不是被靜默處理，導致程式碼「看起來沒有出錯」卻又有不如預期的行為發生

#### 注意穩健性（Robustness）

以前端開發來說，在 JavaScript 中如果拋錯（`throw new Error('...')`）但未搭配 `try...catch` 語法來捕捉錯誤的話，即會導致整段程式碼停止執行。在前端遵守 `failing fast and failing loudly` 原則時，需注意是否為該功能附上對應的 `try...catch` 語法，否則服務會在錯誤被拋出時即停止運行，導致使用體驗不佳。

以 React 為例，元件 `ErrorBoundary` 可視為整個 APP 的 `try...catch` 語法；如果整個 APP 中有部分程式碼會拋錯，但沒有緊鄰的 `try..catch` 來捕捉該錯誤，此錯誤最終會被 `ErrorBoundary` 攔截。工程師可透過此元件決定如何處理錯誤（發送 GA 事件來記錄錯誤資訊、顯示提示用的 UI 元件等等）。

需注意：目前 TypeScript 尚未支援在 function 的回傳型態中定義該 function 是否會拋錯（參考 [How to declare a function that throws an error in Typescript](https://stackoverflow.com/questions/49434751/how-to-declare-a-function-that-throws-an-error-in-typescript)），這部分就得仰賴文件說明、或是呼叫 function 的使用者需意識到該 function 得搭配 `try...catch` 來確保程式碼的穩健性。

### 範例：如何在 TypeScript 中提示錯誤

```ts
function getSquareRoot(arg) {
  // 根據參數 arg 回傳其開根號後的值，如果 arg 不是大於等於零的數字，則此 function 無法對該 arg 開根號
}
```

以上列 `getSquareRoot` 為例，在 TypeScript 中有以下幾種「讓工程師察覺到參數 arg 的值不合理」的手段：

#### 直接拋錯

優點：提供明確錯誤訊息，呼叫此 function 的工程師會知道為何出錯
缺點：如果使用此 function 的工程師沒有提供對應的 `try...catch` 語法的話，整段程式碼一出錯（被餵了不合法的參數）就會停止執行，且目前 TypeScript 還無法透過型別提示該 function 是否會拋錯，需要引用 function 的工程師主動確認文件或原始碼

```ts
function getSquareRoot(arg) {
  if (typeof arg !== 'number') {
    throw new Error(
      `getSquareRoot arg not valid, should be number, but receive ${arg}, type: ${typeof arg}.`
    );
  }
  // ...
}
```

#### 回傳 `null`

優點：可透過 TypeScript 的型別定義讓呼叫此 function 的工程師意識到回傳的值可能為 `null` 或數字，工程師需要先檢查回傳的值的型別，才能繼續執行接下來的邏輯
缺點：回傳 `null` 無法提供太多有意義的錯誤資訊

```ts
function getSquareRoot(arg) {
  if (typeof arg !== 'number') {
    return null;
  } else {
    // ...
  }
}
```

#### 回傳 magic value

下下策，回傳的值基本上無法提供有意義的錯誤資訊，也無法透過型別檢查得知回傳的值是否有效；儘管有這種作法但並不推薦實務使用

```ts
function getSquareRoot(arg) {
  if (typeof arg !== 'number') {
    return -1;
  } else {
    // ...
  }
}
```

## 參考文件

- [Manning: Good Code, Bad Code](https://www.manning.com/books/good-code-bad-code)
- [react.dev: Catching rendering errors with an error boundary](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [stackOverFlow: How to declare a function that throws an error in Typescript](https://stackoverflow.com/questions/49434751/how-to-declare-a-function-that-throws-an-error-in-typescript)
- [issues: Suggestion: `throws` clause and typed catch clause #13219](https://github.com/microsoft/TypeScript/issues/13219)
- [issues: `Result value must be used` check #8240](https://github.com/microsoft/TypeScript/issues/8240)
