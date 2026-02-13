---
title: 工作筆記：在前端顯示不同 origin 後端提供的圖片
date: 2023-11-19 07:52:25
tag:
  - [Web security]
banner: /2023/html-image-element-cross-origin/wai-siew-LjesOs00QRg-unsplash.jpg
summary: 對 HtmlImageElement 設定 crossOrigin="use-credentials" 來解決因為 CORS 無法顯示圖片的問題。
draft:
---

## 問題描述

目前手上的前端專案會由後端提供圖片連結，並使用 `<img />` 顯示。但前後端有不同的 origin，造成圖片因 CORS 問題無法正常顯示。

註：發生問題時，後端已經設定好 `Access-Control-Allow-Origin`。

## 解決方式

在 `<img />` 設定 `crossOrigin="use-credentials"`。

```html
<img src="{urlFromBackend}" crossorigin="use-credentials" />
```

`<img />` 在沒有設定 `crossOrigin` 時，預設為 `crossOrigin="anonymous"`，代表只在前後端有相同的 origin 時，才傳送憑證（credential）。

設定為 `crossOrigin="use-credentials"` 的話，即使前後端在不同的 origin 也會提供憑證，因為 `use-credentials` 代表以下設定：

- `Request.mode: cors` ——允許 cross-origin 請求
- `Request.credentials: include` ——不論前後端是否同 origin，都會在請求附上 cookies 與 basic http auth 等資訊

此時前端才能提供證據，證明自己在後端的 `Access-Control-Allow-Origin` 範圍內，進而取得圖片資源。

## 參考文件

- [Definitions of Web-related terms > Origin](https://developer.mozilla.org/en-US/docs/Glossary/Origin)
- [HTMLImageElement crossOrigin property](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/crossOrigin)
- [Request mode property](https://developer.mozilla.org/en-US/docs/Web/API/Request/mode)
- [Request credentials property](https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials)
