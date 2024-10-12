---
title: 下載附件時，檔案名稱從何而來？
date: 2024-10-12 10:32:45
tag:
	- [HTTP]
banner: /2024/http-res-headers-content-disposition/camila-serey-QLPl9HDHKZ4-unsplash.jpg
summary: 答：HTTP response headers 中的 Content-Disposition filename 會決定瀏覽器下載附件時，預設使用的檔案名稱。
draft: 
---

懶人包：透過瀏覽器下載檔案時，會由 HTTP response headers 中的 `Content-Disposition` `filename` 來決定該檔案的預設名稱。

## 筆記

HTTP response headers 中的 `Content-Disposition` 能設定兩種資訊：

- 瀏覽器要將該回應視為 **`inline` 還是  `attachment` 類型**的內容
- 透過 `filename` 指定下載附件時，**預設使用的檔案名稱**

設定為 `Content-Disposition: inline` 時，代表瀏覽器要將該回應視為「網頁」類型的內容。以 Chrome 來說，如果一個 .pdf 連結設定為 `Content-Disposition: inline`，那麼在使用者點擊此連結時，會以「另開新分頁」的形式來顯示該連結的內容。而如果一個 .pdf 連結的 `Content-Disposition` 設定為 `attachment`，那麼在使用者點擊該連結時，該連結會被 Chrome 視為附件，進行「下載」。

> mdn: The first parameter in the HTTP context is either `inline` (default value, indicating it can be **displayed inside the Web page, or as the Web page**) or `attachment` (indicating it should **be downloaded**; most browsers presenting a 'Save as' dialog, prefilled with the value of the filename parameters if present).

執行下載時，附件預設的檔案名稱就由 `Content-Disposition` 的 `filename` 決定。如果有在前端覆蓋預設檔名的需求，可使用 npm 套件 [file-saver](https://www.npmjs.com/package/file-saver) 來處理（這個套件的原理是透過 HTML `<a>` 元件來「覆蓋」預設檔名）。

---

順帶一提，除了瀏覽器的開發者模式以外，也能透過在終端執行 `curl -I <some_file_url>` 來直接觀察 response headers 的內容。指令中的 `-I` 代表只取 headers 資訊，參考 [curl 文件](https://curl.se/docs/manpage.html#-I)。

## 參考文件

- [mdn: Content-Disposition](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition)
- [wikipedia: MIME > Content-Disposition](https://en.wikipedia.org/wiki/MIME#Content-Disposition)
