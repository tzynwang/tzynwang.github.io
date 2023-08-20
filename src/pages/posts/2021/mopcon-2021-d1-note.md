---
layout: '@Components/pages/SinglePostLayout.astro'
title: MOPCON 2021 第一天之JS、前端相關內容之議程筆記
date: 2021-10-23 16:47:32
tag:
  - [JavaScript]
---

## 總結

整理了 2021 MOPCON 第一天 JS、前端相關議程的筆記與延伸參考資料

## 你懂了 JavaScript，也不懂 JavaScript

> 總結：在時間有限的前提下，先學習價值最高的技術或知識

- 而何謂重要的知識：
  - 「這個知識對我寫 code 會有幫助嗎？」
  - 「不知道的話會容易寫出 bug、或是根本不知道 bug 從何而來」
- 比較不重要但有趣的知識：知道這些事情會讓你成為 JS 大師
  ![Thanks for inventing JavaScript](/2021/mopcon-2021-d1-note/ydnjs.png)
  ![meme](/2021/mopcon-2021-d1-note/dont-know.png)

### Type

- 留意`String + Number`會回傳字串結果
- `Array.prototype.sort()`預設是字典排序，要進行數字大小排列的話，需傳入 callback function `((a, b) => a - b)`
- 留意浮點數陷阱
  ```js
  0.5 + 0.1 === 0.6; // true
  0.2 + 0.1 === 0.3; // false
  ```
  - [Is floating point math broken?](https://stackoverflow.com/questions/588004/is-floating-point-math-broken)
    - In most programming languages, it is based on the **IEEE 754 standard**. The crux of the problem is that numbers are represented in this format as a whole number times a power of two; rational numbers (such as 0.1, which is 1/10) **whose denominator is not a power of two cannot be exactly represented**.
    - Think about representing 1/3 as a decimal value. It's **impossible to do exactly**! In the same way, 1/10 (decimal 0.1) **cannot be represented exactly in base 2 (binary)** as a "decimal" value; a repeating pattern after the decimal point goes on forever. **The value is not exact**, and therefore you can't do exact math with it using normal floating point methods.
  - [【筆記】Javascript 大數字與浮點數的計算處理 (decimal.js)](https://jsy.tw/blog/1878/javascript-decimal-js/)：Javascript 的數字型態一律為遵守 IEEE 754 規範的 number，採用雙精度儲存（double precision），佔用 64 bit。若整體數字（整數 + 小數）的長度超過 16 ~ 17 位，就會發生數字丟失的問題。
- JS 的 Number 有其極限（[Number.MAX_SAFE_INTEGER](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER): `9007199254740991`），超過此範圍請改用`BigInt`或`String`型態來保存資料

### Hoisting

- JS 在執行前就會先做一些處理，此語言有編譯（compile）的特性

### This

- `this`的值跟怎麼呼叫函式有關
  ```js
  document.querySelector('.a'); // null
  const q = document.querySelector;
  q('.a'); // Uncaught TypeError: Illegal invocation
  ```
  `document.querySelector('.a')`中的`this`是`document`，而`q('.a')`的`this`在非嚴格模式下會指向 global object，可透過使用`bind()`將`document`綁進去解決：
  ```js
  const q = document.querySelector.bind(document);
  q('.a'); // null
  ```
  ```js
  // 這樣也可以
  const q = document.querySelector;
  q.call(document, '.a');
  q.apply(document, ['.a']);
  ```
- 箭頭函式的 this 與一般函式的 this 不一樣（以下內容節錄自[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)）
  - Arrow functions establish "this" **based on the scope the Arrow function is defined within**.
  - Perhaps the greatest benefit of using Arrow functions is with DOM-level methods (`setTimeout`, `setInterval`, `addEventListener`) that usually required some kind of closure, call, apply or bind to ensure the function executed in the proper scope.

### Prototype

- 原型鍊（prototype chain）：在當下的 scope 找不到相對應的屬性或方法時，就往親代的 scope 找
- `arr.slice(1)`與`Array.prototype.slice.call(arr, 1)`做的是完全一樣的事，只是後者是將整個原型鍊全部寫出來

### async 與 event loop

- 需意識到 callback function 並不保證它是非同步執行
- 知道 event loop 中的 web API、stack 與 task queue 是什麼

## 用 Type 建立 Type：一起來當個 TypeScript 的型別魔術師

- 泛型（generics）：讓型別也變成一種變數，可以根據不同的情況套用不同的型別
  ```ts
  // 一般寫法，所有資料的型別皆已經被設定好
  type ConferenceWithGenerics = {
    name: string;
    year: number;
    isAddToCalendar: boolean;
    price: number;
  };
  ```
  ```ts
  // 泛型的寫法
  type ConferenceWithGenerics<T> = {
    name: string;
    year: number;
    isAddToCalendar: boolean;
    price: T;
  };
  ```
  `price`可根據`T`傳入的內容允許不同類型的資料，**把型別當成參數**
  ```ts
  // price為string型態的資料
  const mopcon: ConferenceWithGenerics<string> = {
    name: 'MOPCON';
    year: 2021;
    isAddToCalendar: true;
    price: '1000元';
  };
  ```
- 泛型可透過關鍵字 extends 來限制傳入的類型（generic constraints），可帶入預設值
  ```ts
  type ConferenceWithGenerics<T extends string | number = number> = {
    name: string;
    year: number;
    isAddToCalendar: boolean;
    price: T; // 允許傳入string或number型態的資料，並在沒有傳入參數的時候預設為number
  };
  ```
- Utility Types：把型別當成參數，透過 Utility Types 取得型的型別；TypeScript 本身就內建了多種 Utility Types
  ```ts
  type conferenceNameWithNull = 'MOPCON' | 'JSDC' | 'COSCUP' | null;
  type T1 = NonNullable<conferenceNameWithNull>;
  ```
  `NonNullable`是 TypeScript 內建的 Utility Types，如果檢視 T1 的內容會發現僅剩下`MOPCON`、`JSDC`與`COSCUP`；`null`不見了
- 透過`keyof`取得物件型別中所有的 key 作為型別（`keyof`後面接的是`Type`）；`typeof`後面接的是 JS 中的「值」（可直接加上物件，然後透過 TS 的自動推論來建立型別），會把值轉為「型別（`Type`）」，然後合體技如下：
  ```ts
  const mopcon = {
    name: 'MOPCON';
    year: 2021;
    isAddToCalendar: true;
    price: '1000元';
  };
  type keysOfConferenceFromTypeOf = keyof typeof mopcon;
  ```
  得到的內容是`'name' | 'year' | 'isAddToCalendar' | 'price'`
- 支援 Template Literals（反引號）：TS 會根據傳入的聯集組合出新的聯集
  ```ts
  type X = 'left' | 'right';
  type Y = 'top' | 'bottom';
  type Position = `${X}-${Y}`; // 'left-top' | 'left-bottom' | 'right-top' | 'right-bottom'
  ```
- 練習：寫一個 Utility Type 取得物件型別中所有屬性的 Keys

  ```ts
  type ConferenceWithGenerics = {
    name: string;
    year: number;
    isAddToCalendar: boolean;
    price: number;
  };

  // 先使用實際例子
  type Keys = keyof ConferenceWithGenerics;

  // 然後抽象化
  type Keys<T> = keyof T;

  // 實用：取出Conference物件中所有屬性的Keys放到T1中
  type T1 = Keys<Conference>;
  ```

- Indexed Access Types：透過中括號取得物件型別中的特定屬性值

  ```ts
  type Conference = {
    name: string;
    year: number;
    isAddToCalendar: boolean;
    price: number;
  };

  type T1 = Conference['name']; // string
  type T2 = Conference['name' | 'year']; // string | number
  type T3 = Conference[keyof Conference]; // string | number | boolean
  ```

  ```ts
  // 練習：寫一個Utility Type取得物件型別中所有屬性的Keys
  // 先使用實際例子
  type ConferenceValues = Conference[keyof Conference];

  // 再抽象化
  type Values<T> = T[keyof T];
  ```

- Mapped Type：解決 Index Signatures 之 key 太過廣泛的問題，使用關鍵字`in`；概念類似`Array.prototype.map()`

  ```ts
  type T = {
    [P in 'MOPCON' | 'JSDC' | 'COSCUP']: string;
  };
  // T = { MOPCON: string; JSDC: string; COSCUP: string; }
  ```

  修改物件型別中所有 value 的屬性：

  ```ts
  type T1 = {
    [Property in keyof Conference]: string;
  };
  // Conference物件中所有value都變為string類型
  ```

  修改物件型別中所有的 key：

  ```ts
  type T2 = {
    [Property in keyof Conference as `at${string &
      Property}`]: Conference[Property];
  };
  // atname: string; atyear: number; atisAddToCalendar: boolean; atprice: number;
  ```

  取出物件中特定的資料：

  ```ts
  // 只取出Conference中的name與price
  type T3 = {
    [Property in 'name' | 'price']: Conference[Property];
  };

  // 抽象化
  type PickObject<T, Key extends keyof T> = {
    [Property in Key]: T[Property];
  };

  // 一樣取出Conference中的name與price
  type T3 = PickObject<Conference, 'name' | 'price'>;
  ```

- Conditional Types

  - `X extends Y ? T : F`：若 X 是 Y 的子集合，型別 A 就是 T，反之為 F
  - `never extends Y ? T : F`：因為`never`（可理解為空集合）不是任何型態的子集合，因此型別 A 必定為 F

  ```ts
  type InferResp<T> = T extends { response: infer R; status: number } ? R : T;

  const successResp = { response: { data: 'foo' }, status: 200 };
  const errorResp = { status: 400 };

  type TS = InferResp<typeof successRest>; // { data: string }
  type TF = InferResp<typeof errorResp>; // { status: number }
  ```

- Recursion
  ```ts
  type SnakeToCamelCase<T extends string> =
    T extends `${infer Head}_${infer Tail}`
      ? `${Uncapitalize<Head>}${Capitalize<SnakeToCamelCase<Tail>>}`
      : T;
  ```

## 善用 UX 來提升 UU，打造滿足新手和專家的 UI

> 重點：想要做出同時滿足新手與專家使用的產品，在介面設計上應該注意什麼事情？

### 操作介面常見問題

- 初次使用（產品）若無法完成任務，很容易導致挫折、進而不願意再次嘗試（沒有下一次機會了）
- 介面一口氣提供了太多資訊，容易讓新手感到緊張、不知從何下手
- 假設提供操作說明：或許有幫助，但新手也不易記住這些步驟，閱讀說明也會打斷操作流程（回頭一看也忘記自己處理到哪一個步驟）
- 自助操作系統常用步驟引導的方式來協助使用者進行操作，但拉長操作時間也會讓專家使用者感到不耐煩
- 初次使用者 !== 新手，該使用者可能有使用類似產品的經驗

### 新手與專家對操作介面的共同需求

- 簡化資訊、進行資料分類、強調重點
- 提供複數種操作方式，同時滿足新手與專家使用者（舉例：台鐵提供了時間與車次兩種訂票方式）
- 使用現行標準、或使用者熟悉的元素（舉例：英文輸入使用與電腦鍵盤相同的排列方式）
- 活用使用者經驗與記錄來提升操作效率（舉例：ATM 詢問使用者是否將某功能加入「常用交易」清單內）

### 何謂 UU

- 易用性、通用使用性
- [Universal Usability](https://en.wikipedia.org/wiki/Universal_usability), products that are **usable for every citizen**.
  - Supporting a broad range of **hardware, software, and network access**. 介面應支援各種軟硬體與網路環境
  - Accommodating individual differences among users, such as age, gender, abilities, literacy, culture, income, and so forth. 需考量不同能力的使用者以及各種可能的使用情境
  - Bridging the knowledge gap between what users know and what they need to know about a specific system. 不同知識背景與經驗的使用者都可以順利操作

### 線上 QA

- 當輸入元素的外觀十分相似時，如何避免用戶做出錯誤輸入（比如把停車場圓形磁卡丟到硬幣孔）
  - 可以配合亮燈提示，引導使用者根據不同步驟做出對應行為
- 是否有推薦新手入門 UIUX 的相關書籍或網路資源？
  - 新手建議搭配實際案例來理解 UX 與 UI，不建議直接從理論下手

## 參考文件

- [Huli: 你懂了 JavaScript，也不懂 JavaScript](https://mopcon.org/2021/schedule/2021006)
- [PJCHENder: 用 Type 建立 Type：一起來當個 TypeScript 的型別魔術師](https://mopcon.org/2021/schedule/2021012)
- [善用 UX 來提升 UU，打造滿足新手和專家的 UI](https://mopcon.org/2021/schedule/2021015)
