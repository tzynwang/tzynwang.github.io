---
title: 「Edit Files With Workspaces」相關筆記
date: 2021-03-11 14:03:04
tag:
- [DevTools]
---

## 總結

這篇文章是在處理 ALPHA Camp 學期 1 S3 A11 作業「試用開發者工具」時，嘗試搭配 DevTools，避免作業過程中意外重新整理網頁，造成作業進度遺失的問題。

DevTools 確實可以解決上述問題。
但為了要讓 DevTools 可以隨時儲存我的修改進度，需要先將作業範例檔案 git clone 回本機，然後再透過 DevTools 開啟作業資料夾，給予 DevTools 權限來記錄我對作業進行的修改。

## 版本與環境

```
Google Chrome: 89.0.4389.82 (Official Build) (x86_64)
ox: macOS Big Suf Version 11.1
```

## 流程與筆記

1. 觀察 ALPHA Camp 提供的作業連結（[https://alphacamp.github.io/css-facebook/](https://alphacamp.github.io/css-facebook/)），推測作業範例應該是用 GitHub Pages 發布的，嘗試搜尋「ALPHA Camp github」，運氣不錯，作業的 repo 是公開的
1. 把作業範例 git clone 回本機
1. 用 VSCode 開啟作業範例，使用 VSCode 的擴充套件「[Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)」讓 index.html 在 localhost:5500 動起來
1. 參考官方文件的說明（[「Set up DevTools」](https://developers.google.com/web/tools/chrome-devtools/workspaces#devtools)），開啟 DevTools 後，點選功能分頁中的「Sources」
1. 進入子選項「Filesystem」，點選「+ Add folder to workspace」，選擇作業所在的資料夾
   備註：在流程第二步，我選擇將作業 clone 回桌面的 css-facebook 資料夾，故在這一步，我要在 DevTools 中選擇開啟位在桌面的 css-facebook 資料夾
1. 在 DevTools 跳出權限請求視窗時，選擇給予 DevTools 權限來修改本機檔案
1. 在沒有開錯資料夾、沒有出現其他問題的情況下，Filesystem 區域會出現資料夾 css-facebook，點開資料夾會看到 index.html 與 style.css 兩個檔案，並 style.css 的檔案圖示右下角會有綠點

   ![demo](/2021/edit-files-with-workspaces/file-mapping-success.png)

1. 綠點代表現在透過 DevTools 對網頁做的 CSS 更動都會儲存到 style.css 中，這樣即使改到一半重新整理網頁，先前的 CSS 修改也不會消失

### 注意事項

在 DevTools 的 Elements 標籤下修改的 HTML 內容不會被保存下來，想要保存對 HTML 的變更，請移動到 Sources 標籤去修改 index.html

![demo](/2021/edit-files-with-workspaces/why-it-isnt-saved.png)

問：為什麼我在 Elements 修改網頁的內文不像修改 CSS 會被保存下來？
答：因為在 Elements 標籤下做的修改都是改到 DOM，不是改到 HTML。
瀏覽器取得 HTML 後，解析、並搭配 CSS 與 JS 來決定最後呈現給使用者看的內容會長什麼樣子，使用者看到、並用 Elements 操作（修改）的東西是 DOM。
而這些 DOM 最終為什麼會以這些樣子呈現在網頁上，是綜合了 HTML、CSS 與 JS 互相搭配的結果，DevTools 很難知道它到底該把使用者對 DOM 做的修改內容記錄到 HTML、CSS 或是 JS 檔案中。

更詳細的解說可參考：[Save an HTML change to disk: Why it doesn't work](https://developers.google.com/web/tools/chrome-devtools/workspaces#why)

## 參考文件

[Edit Files With Workspaces](https://developers.google.com/web/tools/chrome-devtools/workspaces)
