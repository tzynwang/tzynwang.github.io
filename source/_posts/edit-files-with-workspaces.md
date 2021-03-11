---
title: 「Edit Files With Workspaces」相關筆記
categories:
  - DevTools
date: 2021-03-11 14:03:04
tags:
---

## 總結
這篇文章是在處理ALPHA Camp 學期1 S3 A11作業「試用開發者工具」時，嘗試搭配DevTools，避免作業過程中意外重新整理網頁，造成作業進度遺失的問題。

DevTools確實可以解決上述問題。
但為了要讓DevTools可以隨時儲存我的修改進度，需要先將作業範例檔案git clone回本機，然後再透過DevTools開啟作業資料夾，給予DevTools權限來記錄我對作業進行的修改。


## 版本與環境
```
Google Chrome: 89.0.4389.82 (Official Build) (x86_64)
ox: macOS Big Suf Version 11.1
```


## 流程與筆記
1. 觀察ALPHA Camp提供的作業連結（[https://alphacamp.github.io/css-facebook/](https://alphacamp.github.io/css-facebook/)），推測作業範例應該是用GitHub Pages發布的，嘗試搜尋「ALPHA Camp github」，運氣不錯，作業的repo是公開的
1. 把作業範例git clone回本機
1. 用VSCode開啟作業範例，使用VSCode的擴充套件「[Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)」讓index.html在localhost:5500動起來
1. 參考官方文件的說明（[「Set up DevTools」](https://developers.google.com/web/tools/chrome-devtools/workspaces#devtools)），開啟DevTools後，點選功能分頁中的「Sources」
1. 進入子選項「Filesystem」，點選「+ Add folder to workspace」，選擇作業所在的資料夾
    備註：在流程第二步，我選擇將作業clone回桌面的css-facebook資料夾，故在這一步，我要在DevTools中選擇開啟位在桌面的css-facebook資料夾
1. 在DevTools跳出權限請求視窗時，選擇給予DevTools權限來修改本機檔案
1. 在沒有開錯資料夾、沒有出現其他問題的情況下，Filesystem區域會出現資料夾css-facebook，點開資料夾會看到index.html與style.css兩個檔案，並style.css的檔案圖示右下角會有綠點
    {% figure figure--center 2021/edit-files-with-workspaces/file-mapping-success.png %}
1. 綠點代表現在透過DevTools對網頁做的CSS更動都會儲存到style.css中，這樣即使改到一半重新整理網頁，先前的CSS修改也不會消失

### 注意事項
在DevTools的Elements標籤下修改的HTML內容不會被保存下來，想要保存對HTML的變更，請移動到Sources標籤去修改index.html

{% figure figure--center 2021/edit-files-with-workspaces/why-it-isnt-saved.png %}

問：為什麼我在Elements修改網頁的內文不像修改CSS會被保存下來？
答：因為在Elements標籤下做的修改都是改到DOM，不是改到HTML。
瀏覽器取得HTML後，解析、並搭配CSS與JS來決定最後呈現給使用者看的內容會長什麼樣子，使用者看到、並用Elements操作（修改）的東西是DOM。
而這些DOM最終為什麼會以這些樣子呈現在網頁上，是綜合了HTML、CSS與JS互相搭配的結果，DevTools很難知道它到底該把使用者對DOM做的修改內容記錄到HTML、CSS或是JS檔案中。

更詳細的解說可參考：[Save an HTML change to disk: Why it doesn't work](https://developers.google.com/web/tools/chrome-devtools/workspaces#why)


## 參考文件
[Edit Files With Workspaces](https://developers.google.com/web/tools/chrome-devtools/workspaces)