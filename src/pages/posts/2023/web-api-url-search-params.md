---
layout: '@Components/SinglePostLayout.astro'
title: 快速筆記：使用 URL 與 URLSearchParams 建構子處理網址
date: 2023-08-09 19:52:24
tag:
  - [Web api]
---

## 總結

目前負責的專案在路由設計上採用 query string （例：`/product?category=A`）而非 path params （例：`/product/category/A`）來處理分頁，此篇筆記會記錄如何使用 web api `URL` 與 `URLSearchParams` 來處理網址。

## 筆記

以下功能會回傳 url 中的 params 物件，傳入 `initialValue` 主要是為了滿足型別需求。

```ts
function getUrlSearchParams<T>(initialValue: T) {
  const url = new URL(window.location.href);
  const paramsEntries = Array.from(url.searchParams.entries());
  return paramsEntries.reduce((prev, curr) => {
    const [key, value] = curr;
    return { ...prev, [key]: value };
  }, initialValue);
}

// 以 https://example.com/product?category=A 為例，會取出 params = { category: 'A' }
const params = getUrlSearchParams({ category: '' });
```

以下功能會產生一組「開啟 Gmail 並預先填好收件人與信件主旨」的 url 連結：

```ts
function getMailUrl() {
  const baseUrl = 'https://mail.google.com/mail/u/0/';
  const params = new URLSearchParams();
  params.append('fs', '1');
  params.append('tf', 'cm');
  params.append('source', 'mailto');
  params.append('to', 'mail@example.com');
  params.append('su', '這裡寫主旨');
  const url = new URL(baseUrl);
  url.search = params.toString();
  return url.href;
}
```

## 參考文件

- [MDN: URL](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL)
- [MDN: URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)
- [stackOverFlow: Compose e-mail via URL-params (googlemail)](https://stackoverflow.com/questions/2027131/compose-e-mail-via-url-params-googlemail)
