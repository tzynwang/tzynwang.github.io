---
title: 2022 第42週 實作筆記：TypeScript type predicates
date: 2022-10-21 19:45:14
tag:
  - [TypeScript]
---

## 問題描述

將資料根據特定條件進行加工、並試圖透過 `.filter()` 來濾掉 `null` 值時，遇到 ts 報錯的狀況：

```ts
interface AttachmentFromGCS {
  url: string;
  name: string;
  size: number;
}

interface AttachmentA {
  fileName: string;
  fileSize: number;
}

interface AttachmentB {
  fileName: string;
  fileUrl: string;
}

/* 接下來要根據 url 內容來判定該檔案屬於類型 A 或類型 B */
const attachmentMixed: AttachmentFromGCS[] = [
  { url: 'xxx/typeA/xxx', name: 'file1', size: 8000 },
  { url: 'xxx/typeB/xxx', name: 'file2', size: 600 },
  { url: 'xxx/typeB/xxx', name: 'file3', size: 960 },
];

/* 但以下寫法在 TypeScript 4.8.4 版依舊會報錯 */
const resultFail: (AttachmentA | AttachmentB)[] = attachmentMixed
  .map((attach) => {
    if (attach.url.includes('typeA')) {
      return { fileName: attach.name, fileSize: attach.size };
    }
    if (attach.url.includes('typeB')) {
      return { fileName: attach.name, fileUrl: attach.url };
    }
    return null;
  })
  .filter((item) => !!item);
/* 
錯誤訊息為
Type '({ fileName: string; fileSize: number; fileUrl?: undefined; } | { fileName: string; fileUrl: string; fileSize?: undefined; } | null)[]' is not assignable to type '(AttachmentA | AttachmentB)[]'.
  Type '{ fileName: string; fileSize: number; fileUrl?: undefined; } | { fileName: string; fileUrl: string; fileSize?: undefined; } | null' is not assignable to type 'AttachmentA | AttachmentB'.
    Type 'null' is not assignable to type 'AttachmentA | AttachmentB'.
*/
```

## 解決辦法

```ts
/* 可以透過 type predicates 來讓 .filter() 發揮作用 */
const resultPass: (AttachmentA | AttachmentB)[] = attachmentMixed
  .map((attach) => {
    if (attach.url.includes('typeA')) {
      return { fileName: attach.name, fileSize: attach.size };
    }
    if (attach.url.includes('typeB')) {
      return { fileName: attach.name, fileUrl: attach.url };
    }
    return null;
  })
  .filter(function notNull(item): item is AttachmentA | AttachmentB {
    return !!item;
  });
```

引用（但為了配合上述範例，有進行語句調整）TypeScript 官方文件的說明：

> Any time `notNull` is called with some variable (in the above example, `item`), TypeScript will **narrow that variable to that specific type** if the original type **is compatible**.

當一個函式的回傳內容為 type predicates 時，TypeScript 會在「傳入函式的參數能被轉型成指定型態時」進行轉型。

```ts
const resultPass: (AttachmentA | AttachmentB)[] = attachmentMixed
  .map((attach) => {
    if (attach.url.includes('typeA')) {
      return { fileName: attach.name, fileSize: attach.size };
    }
    if (attach.url.includes('typeB')) {
      return { fileName: attach.name, fileUrl: attach.url };
    }
    return null;
  })
  /* 也可直接寫成箭頭函式 */
  .filter((item): item is AttachmentA | AttachmentB => !!item);
```

問題解決。

## 參考文件

- [TypeScript: Using type predicates](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)
- [Infer type guard => array.filter(x => !!x) should refine Array<T|null> to Array<T> #16069](https://github.com/microsoft/TypeScript/issues/16069)
- [StackOverFlow: TypeScript: Why is that my filter method cannot narrow the type and eliminate the undefined and false from the array](https://stackoverflow.com/questions/63541843/typescript-why-is-that-my-filter-method-cannot-narrow-the-type-and-eliminate-th)
