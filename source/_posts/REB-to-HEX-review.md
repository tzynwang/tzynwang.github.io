---
title: 專案「RGB to HEX converter」技術記錄
date: 2021-04-01 15:28:09
categories:
tags:
- ALPHA Camp作業
- Side Project
---

## 總結
將ALPHA Camp學期二之一的期末考與想要研究的技術結合起來一起練習。
本次使用到的新技術：
- [Wired Elements](https://wiredjs.com/)：手繪質感的web components API
- [Puppeteer](https://github.com/puppeteer/puppeteer#puppeteer)：用來爬取目標網站上的內容，並整理後輸出成.csv檔案


## 成品
純網頁展示版：[點我](https://tzynwang.github.io/RGB-to-HEX/)
{% figure figure--center 2021/REB-to-HEX-review/demo-img.png "'三個按鈕由左至右分別是「複製顏色代碼」、「重置回預設狀態」與「隨機產生顏色」'" %}
彩蛋：其中有465種顏色有名字，發現機率是465 / 255^3，大約是0.003%。
全部的名字來源參考：[和色大辞典](https://www.colordic.org/w)

codepen展示：
<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="js,result" data-user="Charlie7779" data-slug-hash="NWdRPKa" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="wired-elements">
  <span>See the Pen <a href="https://codepen.io/Charlie7779/pen/NWdRPKa">
  wired-elements</a> by Charlie (<a href="https://codepen.io/Charlie7779">@Charlie7779</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>
因為codepen免費版不支援hosting，故此版本並沒有名字彩蛋。


## 環境
```
Google Chrome: 89.0.4389.90 (Official Build) (64-bit)
os: Windows_NT 10.0.18363 win32 x64
```

## UI: Wired Elements


## Scrape: Puppeteer


## Save to file: Node.js


## JS內容


## CSS內容


## 參考文件
- [cdnjs](https://cdnjs.com/)：移植到codepen時使用的cdn服務
- https://www.tgwilkins.co.uk/using-puppeteer-to-transform-html-content-into-json.html
- https://stackoverflow.com/questions/35948669/how-to-check-if-a-value-exists-in-an-object-using-javascript
- https://stackoverflow.com/questions/14802481/get-element-of-js-object-with-an-index
- https://stackoverflow.com/questions/27976282/bootstrap-glyphicons-not-showing-on-local-url
- https://www.nodejsera.com/snippets/nodejs/appendfile-sync.html：解決輸出亂飄的問題