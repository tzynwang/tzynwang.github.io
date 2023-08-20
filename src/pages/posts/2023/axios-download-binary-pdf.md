---
layout: '@Components/pages/SinglePostLayout.astro'
title: 快速筆記：使用 axios 下載後端回傳的 pdf binary
date: 2023-06-02 19:42:22
tag:
  - [axios]
---

## 總結

在透過 axios 來下載 binary 檔案時，記得要設定 `responseType: 'arraybuffer'` 以便順利取得資料。

## 版本與環境

```
axios: 0.24.1
```

## 筆記

程式碼如下：

```ts
const response = await axios.post(
  '/api/to/download/pdf',
  { url },
  { responseType: 'arraybuffer' }
);
const pdfUrl = window.URL.createObjectURL(new Blob([response.data]));
const link = document.createElement('a');
link.href = pdfUrl;
link.setAttribute('download', 'file.pdf');
link.click(); // 瀏覽器應該會自動開始執行下載
```

透過 `axios.post` 連線時，要在 `.post()` 的第三個參數傳入設定檔 `{ responseType: 'arraybuffer' }` 來取出 binary 資料。

> "arraybuffer": The `response` is a JavaScript `ArrayBuffer` containing binary data.

接著將 binary 資料透過 `new Blob()` 與 `window.URL.createObjectURL()` 產生下載連結，原理如下：

- `new Blob()` 會將後端提供的 binary 內容轉為 Blob 物件
- `window.URL.createObjectURL()` 會為「傳入此功能的參數」建立 url ，至此，後端回傳的 pdf binary 已經被轉成「可以下載的檔案連結」

最後透過 `document.createElement('a')` 建立 anchor 元件並直接點擊即可。注意：不需要將該 anchor 渲染到畫面上（不用 `document.body.appendChild(...)`）

完事。

## 參考文件

- [axios: Request Config](https://axios-http.com/docs/req_config)
- [MDN: XMLHttpRequest > responseType property](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType)
- [MDN: Blob()](https://developer.mozilla.org/en-US/docs/Web/API/Blob/Blob)
- [MDN: URL > createObjectURL()](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static)
- [stackOverFlow: Download binary file with Axios](https://stackoverflow.com/questions/49040247/download-binary-file-with-axios)
