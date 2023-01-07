---
title: 2023 第1週 學習筆記：TypeScript 中的 interface merging
date: 2023-01-07 12:48:40
categories:
  - [TypeScript]
tags:
---

## 總結

最近在嘗試 MaterialUI 的元件 props 客製內容，發現原來 typescript interface 支援同名合併的功能，記錄一下相關內容。

## 版本與環境

```text
typescript: 4.9.4
```

## 筆記

> For the purposes of this article, “declaration merging” means that the compiler merges two separate declarations declared with the same name into a single definition. This merged definition **has the features of both of the original declarations**. **Any number of declarations can be merged**; it’s not limited to just two declarations.

重點：

- 合併之後，便會包含所有的型別定義
- 合併的數量沒有限制，並不限於兩個

參考以下範例：

```ts
interface User {
  name: string;
}

interface User {
  age: number;
}

interface User {
  job: string;
}

const u1: User = {
  name: 'user1',
};

const u2: User = {
  name: 'user2',
  age: 42,
  job: 'engineer',
};
```

變數 `u1` 會讓 ts 編譯器報錯，錯誤內容為缺少必要的鍵值 `age` 與 `job`：`Type '{ name: string; }' is missing the following properties from type 'User': age, job`。

變數 `u2` 因具備三個型別 `User` 指定的鍵值故不會有問題。

注意不能使用關鍵字 `type` 進行 declaration merging，ts 編譯器會報錯 `Duplicate identifier 'xxx'.`

```ts
/* 用 type 來宣告型別會導致合併失敗 */

type UserT = {
  name: string;
};

type UserT = {
  age: number;
};
```

## 參考文件

- [TypeScript: Declaration Merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html)
