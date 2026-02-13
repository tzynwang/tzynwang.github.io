---
title: 「Base64」相關筆記
date: 2021-07-05 11:18:25
tag:
  - [Data exchange format]
---

## 總結

發現自己還沒有辦法流暢地解釋「Base64 到底是什麼？」，此篇為查找相關資料後整理的筆記

## 筆記

### base64 是什麼？

- Wiki: In programming, Base64 is a group of **binary-to-text encoding schemes** that represent binary data (more specifically, a sequence of **8-bit bytes**) in an **ASCII string format** by translating the data into a radix-64 representation.
  - A binary-to-text encoding is **encoding of data in plain text**.
  - （引用自維基百科）Encoding、編碼是一種「資訊從一種形式轉換為另一種形式」的過程；解碼則是編碼的逆過程。
- 維基百科：一種基於 64 個可列印字元來**表示二進位資料**的表示方法。
- From [elmah.io](https://elmah.io/tools/base64-image-encoder/): Base64 is an encoding algorithm that **converts any characters, binary data, and even images or sound files into a readable string**, which can be saved or transported over the network without data loss. The characters generated from Base64 encoding consist of Latin letters, digits, plus, and slash.

> 小結論：base64 是一種編碼方式，可以把二進位資料轉換成純文字；透過 base64 編碼後得到的純文字串，可以再解碼變回二進位資料。

### base64 要解決什麼問題？

- Wiki:
  - Base64 is designed **to carry data** stored in binary formats **across channels that only reliably support text content**.
  - Base64 is particularly prevalent on the World Wide Web where its uses include the ability **to embed image files** (or other binary assets) **inside textual assets** such as **HTML** and **CSS files**.
  - Base64 is also widely used for **sending e-mail attachments**. This is required because SMTP (in its **original form**) was designed to transport **7-bit ASCII characters only**.
- Text-based protocols (according to [Wiki](https://en.wikipedia.org/wiki/Binary_protocol)):
  - IRC, old versions of SMTP, HTTP/1.1

- [elmah.io](https://elmah.io/tools/base64-image-encoder/):
  - Base64 is most commonly used as a MIME (Multipurpose Internet Mail Extensions) transfer encoding for email.
  - Base64 **images** are primarily used to embed image data within other formats like HTML, CSS, or JSON. By including image data within an HTML document, **the browser doesn't need to make an additional web request** to fetch the file, since the image is already embedded in the HTML document. A Base64 representation of an image is larger than a separate image and the string gets very long for large images.

### 轉換範例

![Base64轉換示意圖，取自中文維基百科](/2021/base64-note/base64example.png)

1. 字母 M、a、n 先個別轉換為 ASCII 編碼，得到十進位數字 77、97 與 110
2. 再將這三個十進位數字各自轉為二進位數字後，得到`01001101`、`01100001`與`01101110`，合併為`010011010110000101101110`，總計為 24 位元的資料
3. 將`010011010110000101101110`分拆為 4 組各為 6 位元的資料：`010011`、`101011`、`000101`與`101110`
4. 上述 4 組二進位數字轉回十進位，再對照 ASCII，得到英文單字 T、W、F、u
5. 單字`Man`透過 base64 編碼後，得到字串`TWFu`

### 補充

- Wiki: This encoding causes **an overhead of 33–36%** (33% by the encoding itself; up to 3% more by the inserted line breaks). 進行 base64 編碼後，檔案大小會上升
- Wiki: The data URI scheme can use Base64 to represent file contents. For instance, background images and fonts can be specified in a CSS stylesheet file as `data: URIs`, instead of being supplied in separate files.
  - 參考[CSS-Tricks](https://css-tricks.com/data-uris/)：
  ```css
  /* CSS */
  li {
    background: url(data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7)
      no-repeat left center;
    padding: 5px 0 5px 25px;
  }
  ```
  ```html
  <!-- HTML img element -->
  <img
    src="data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7"
    alt="star"
    width="16"
    height="16"
  />
  ```

## 參考文件

- [Wikipedia: Base64](https://en.wikipedia.org/wiki/Base64)
- [維基百科：Base64（基底 64）](https://zh.wikipedia.org/wiki/Base64)
- [YouTube: What is Base64?](https://youtu.be/8qkxeZmKmOY)
