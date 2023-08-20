---
layout: '@Components/SinglePostLayout.astro'
title: 「X-Frame-Options、Same-origin policy、Cross-Origin Resource Sharing」相關筆記
date: 2021-04-13 18:09:25
tag:
  - [Web security]
---

## 原始問題

在[作品](https://codepen.io/Charlie7779/pen/MWJgKrP)中插入 Linkedin、Facebook 與 Instagram 的超連結，為什麼在 codepen 右側欄位中點選這些超連結無法前往該網站？

![在codepen的輸出視窗點擊超連結，無法連線至該網站](/2021/cross-origin-resource-sharing/codepen-screenshot.png)

## 簡答

根據 DevTool Console 顯示的錯誤訊息，codepen.io 將`X-Frame-Options`設定為`sameorigin`，故無法在 codepen.io 的`<iframe>`中開啟不同來源（origin）的網站（Linkedin、Facebook 或 Instagram）

## 環境

```
Google Chrome: 89.0.4389.114 (Official Build) (64-bit)
os: Windows_NT 10.0.18363 win32 x64
```

## X-Frame-Options

- [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options): This indicate whether or not a browser should be allowed to render a page in a `<frame>`, `<iframe>`, `<embed>` or `<object>`.
  - `deny`: The page cannot be displayed in a frame, regardless of the site attempting to do so.
  - `sameorigin`: The page can only be displayed in a frame on the same origin as the page itself.
  - `deny`不允許載入任何頁面，而`sameorigin`允許載入同源的頁面
  - 將作品原始碼中超連結的`href`修改為 codepen.io 上其他作品的連結的話，可以在右側輸出欄位連線到該作品

### 問題解析

- 在 codepen.io 處於 Editor View 模式時，作品是透過 codepen.io 網站中的`<iframe>`來展示
- codepen.io 將`X-Frame-Options`設定為`sameorigin`，而 Linkedin、Facebook 或 Instagram 與 codepen.io 並不屬於相同來源，故無法在 codepen.io 的`<iframe>`中開啟這些網站

  ![Editor View模式下，作品透過codepen.io網站中的iframe元素展示](/2021/cross-origin-resource-sharing/codepen-iframe.png)

- 如果使用 debug mode 來開啟 codepen.io 上的作品，此時作品不再透過`<iframe>`展示，且瀏覽器通常允許 cross-origin writes（下述），故可正常連線至其他網站

  ![使用Debug Mode開啟作品時，作品本身即是一個完整的HTML文件，而非嵌於codepen.io網站中的部分內容](/2021/cross-origin-resource-sharing/codepen-debug-mode.png)

## 定義 Same-origin policy

- [MDN](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy): The same-origin policy is a critical security mechanism that restricts how a document (or script) loaded from one origin can interact with a resource from another origin.
- [Google Developers](https://web.dev/cross-origin-resource-sharing/): The browser's same-origin policy **blocks** reading a resource from a **different origin**.
- [CSRF Introduction and what is the Same-Origin Policy](https://youtu.be/KaEj_qZgiKY?t=227): Same-origin policy prevents scripts from one origin to access private data on another origin.

### 定義 origin

- [MDN](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy#definition_of_an_origin): Two URLs have the same origin if the protocol, port (if specified), and host are the same for both.
  - Compares `http://store.company.com/dir/page.html` with the following URLs:
  <table>
    <tr>
      <th>URL</th>
      <th>Outcome</th>
      <th>Reason</th>
    </tr>
    <tr>
      <td>http://store.company.com/dir2/other.html</td>
      <td>Same origin</td>
      <td>Only the path differs</td>
    </tr>
    <tr>
      <td>http://store.company.com/dir/inner/another.html</td>
      <td>Same origin</td>
      <td>Only the path differs</td>
    </tr>
    <tr>
      <td>https://store.company.com/page.html</td>
      <td>Failure</td>
      <td>Different protocol</td>
    </tr>
    <tr>
      <td>http://news.company.com/dir/page.html</td>
      <td>Failure	</td>
      <td>Different host</td>
    </tr>
    <tr>
      <td>http://store.company.com:81/dir/page.html</td>
      <td>Failure</td>
      <td>Different port (http:// is port 80 by default)</td>
    </tr>
  </table>

### 筆記

- Same-origin policy 是瀏覽器提供的安全政策，會限制一個網站只能與相同來源的文件或 script 互動
- 何謂相同來源？兩組 URL 若符合以下條件，則視為屬於同樣來源：
  - 擁有相同的 protocol（都是 HTTP 或 HTTPS）
  - 擁有相同的 host（domain）
  - 擁有相同的 port

### 例外

參考[MDN: Cross-origin network access](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy#cross-origin_network_access)

- 瀏覽器通常允許 cross-origin writes（顯示資料），比如：開啟不同來源的網站，或是送出表單
- 瀏覽器通常允許 cross-origin embedding，比如：
  - 透過`<script src="…"></script>`嵌入不同來源的 JavaScript
  - 透過`<link rel="stylesheet" href="…">`嵌入不同來源的 CSS
  - 使用`@font-face`載入不同來源的字型資源
  - 使用`<audio>`、`<img>`、`<video>`、`<iframe>`、`<object>`或`<embed>`載入不同來源網站的資源

## 定義 Cross-Origin Resource Sharing (CORS)

- [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS): CORS is an **HTTP-header based mechanism** that allows a server to indicate any other origins (domain, scheme, or port) than its own from which a browser should permit loading of resources.
- [Google Developers](https://web.dev/cross-origin-resource-sharing/): Enabling CORS lets the server tell the browser it's permitted to use an additional origin.
  - When you want to get a public resource from a different origin, the resource-providing server needs to tell the browser "This origin where the request is coming from can access my resource". The browser remembers that and allows cross-origin resource sharing.

### 處理方式

流程如下：

1. 設定 server 的 HTTP response headers 來讓瀏覽器知道可以執行 CORS

- 以 Express 為例：加上`cors()`

```js
var express = require('express');
var cors = require('cors');
var app = express();

app.use(cors()); // 讓server允許CORS

app.get('/products/:id', function (req, res, next) {
  res.json({ msg: 'This is CORS-enabled for all origins!' });
});

app.listen(80, function () {
  console.log('CORS-enabled web server listening on port 80');
});
```

1. 透過瀏覽器發出 request 的時候，header 需包含`Origin`資訊

- 透過`fetch()` API 發出的 request 預設就會包含`Origin`，參考[MDN: Supplying request options](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#supplying_request_options)
- 或是加上`{mode: 'cors'}`確保 request header 包含`Origin`
- 重點仍然是 server 端要允許 CORS，參考[Allow Access-Control-Allow-Origin header using HTML5 fetch API](https://stackoverflow.com/a/40063679/15028185)

1. server 收到包含`Origin`資訊的 header、並 server 本身允許 CORS 時，server 發出的 response header 就會包含`Access-Control-Allow-Origin`的 key-value pair；`*`代表允許來自任何 URL 的 CORS，或是字串（僅允許特定 URL 進行 CORS）
1. 瀏覽器收到 response header，並`Access-Control-Allow-Origin`的值允許客戶端 CORS 的話，就會將 server 回覆的內容提供給客戶端

## 參考文件

- YouTube:
  - [CORS in 100 Seconds](https://youtu.be/4KHiSt0oLJ0)
  - [CSRF Introduction and what is the Same-Origin Policy? - web 0x04](https://youtu.be/KaEj_qZgiKY)
- Google Developers:
  - [Cross-Origin Resource Sharing (CORS)](https://web.dev/cross-origin-resource-sharing/)
  - [Cross-origin requests](https://developers.google.com/web/ilt/pwa/working-with-the-fetch-api#cross-origin_requests)
- Express:
  - [cors()](https://expressjs.com/en/resources/middleware/cors.html)
  - [What happens without CORS?](https://node-cors-client.netlify.app/)
- 其他參考資源
  - [How to make a cross domain request in JavaScript using CORS](https://www.moxio.com/blog/12/how-to-make-a-cross-domain-request-in-javascript-using-cors)
