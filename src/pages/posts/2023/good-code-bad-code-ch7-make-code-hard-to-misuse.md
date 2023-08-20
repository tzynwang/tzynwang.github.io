---
layout: '@Components/SinglePostLayout.astro'
title: 閱讀筆記：Good Code, Bad Code Chapter 7 Make code hard to misuse
date: 2023-04-03 16:53:29
tag:
  - [Software Architecture]
---

## 總結

此篇是 Good Code, Bad Code: Think like a software engineer 第七章（Make code hard to misuse）的閱讀筆記，本章提出以下幾點「讓程式碼難以被誤用」的實作建議：

1. 使物件不可被修改（immutable）
2. 避免過於籠統的型別定義
3. 謹慎對應時間資料
4. Single source of truth: 資料與邏輯

## 筆記

### 使物件不可被修改

以 React 專案為例，如果要實作此建議，常見做法為搭配 `lodash/cloneDeep` 或透過 `immer/produce` 來避免「直接更動某一份資料的內容」。

參考以下範例：

```tsx
import React, { memo, useState, useCallback, useEffect } from 'react';
import cloneDeep from 'lodash';

interface InputValue {
  id: string;
  value: string;
}

function InputComponent(): React.ReactElement {
  /* States */
  const [inputValue, setInputValue] = useState<InputValue[]>();

  /* Functions */
  const onInputChange = useCallback(
    (id: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const cloneState = cloneDeep(inputValue);
      const inputIndex = cloneState.findIndex((input) => input.id === id);
      if (inputIndex > -1) {
        cloneState[inputIndex].value = e.target.value;
      } else {
        cloneState.push({ id, value: e.target.value });
      }
      setAnswer(cloneState);
    },
    [inputValue]
  );

  /* Hooks */
  useEffect(() => {
    // 根據 inputValue 執行其他操作...
  }, [inputValue]);

  /* Main */
  // 渲染 input 元件...
}
```

當工程師需要透過 `setInputValue` 修改 `inputValue` 時，會先對 `inputValue` 執行一次深拷貝取得 `cloneState`，接下來所有的改動都是發生在變數 `cloneState` 上，原本的 `inputValue` 不參與「被拷貝」以外的任何工作。

這能確保此元件 `useEffect` 所依賴的 `inputValue` 不會在 `onInputChange` 被執行的途中被意外修改內容，導致預料外的 side effect 發生。

### 避免過於籠統的型別定義

書中範例為「二維座標資料陣列」：

```ts
type LocationInfo = number[];

const location1: LocationInfo[] = [
  [42, 37],
  [6, 24],
  [], // 無效座標，但 TypeScript 檢查不出來
  [92, 40, 3], // 無效座標，但 TypeScript 檢查不出來
];
```

本書認為 `LocationInfo` 這樣的型別定義過於寬鬆，基本上這個型別無法提供「關於座標這類資料的具體訊息」。其他工程師看到這個型別只知道 `LocationInfo` 會是一組數字陣列，卻無法認知到「一組座標陣列必須且只能包含兩個數字（分別代表 X 與 Y 軸）」這個需求。

建議：只要有可能，就使用更精確的型別定義內容。

```ts
type LocationInfoBetter = [number, number];

const location2: LocationInfoBetter[] = [
  [42, 37],
  [6, 24],
  [], // 現在 TypeScript 會報錯
  [92, 40, 3], // 現在 TypeScript 會報錯
];
```

### 謹慎對應時間資料

本書關於「處理時間類型資料」的建議如下：

- 一個 function 以及其參數名稱要明確定義「需要傳入什麼型態的時間資料」，是要傳入「一段時間」、或是傳入一個「時間點」
- 承上，在需要傳入時間資料時，明確列出需要的時間單位（常見誤區：秒或毫秒）
- 儲存時間資料時，注意時區陷阱；針對此點，本書建議工程師挑選一個合適的套件來輔助開發，借力使力，也避免重造輪子

### Single source of truth: 資料與邏輯

本章指出程式碼中的資料可歸納為以下兩種：

- 初級資料（primary data）：無法透過計算等方式來「得知」，此類資料基本上就是那些「作為參數餵給功能的內容」或是「固定的資料」；例：銀行帳戶中的存款、欠款
- 衍伸資料（derived data）：可透過計算得出的內容；例：銀行帳戶中的「餘額」，可透過「存款減去欠款」後得出

以上述銀行帳戶資料為例，一個理想中的資料結構應該只需要包含存款與欠款（初級資料），不需要再立一個 class field 來保存餘額（衍伸資料）。工程師應只有在需要的時候，直接透過計算「存款減欠款」來得到餘額資料。

在計算十分耗能的情況下，本書建議導入 cache 以及 lazy calculate 等機制來避免不必要的效能浪費。

---

而除了資料上的 single source of truth 以外，本書也提醒工程師在開發時也要注意維持「邏輯上的 single source of truth」。亦即：一段功能（比如針對特定資料的 formatter 邏輯）是否也有保持單一來源準則。

舉例：假設今天前端在兩個元件中都需要使用一段後端回傳、且需要經過加工整理（format）的資料，這個資料的 formatter 就可以透過 custom hook 或是 util tool 的形式包裝，而不是直接把資料加工的邏輯散落在各個元件中。

良好的抽象層通常也能協助維持邏輯的 single source of truth 原則。

## 參考文件

- [Manning: Good Code, Bad Code](https://www.manning.com/books/good-code-bad-code)
- [Lodash](https://lodash.com/)
- [Immer](https://immerjs.github.io/immer/)
