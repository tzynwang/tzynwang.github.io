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
- 使用到的技術：
    - [Wired Elements](https://wiredjs.com/)：手繪質感的web components library
    - [Puppeteer](https://github.com/puppeteer/puppeteer#puppeteer)：用來爬取目標網站上的內容，並整理後輸出成.csv檔案
- 使用到的概念：
    - [Relative luminance](https://webaim.org/resources/contrastchecker/)：在計算顏色的對比度（contrast ratio）時會應用到此概念，並relative luminance並不是單純的亮度（lightness）


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


## 環境
```
Google Chrome: 89.0.4389.90 (Official Build) (64-bit)
os: Windows_NT 10.0.18363 win32 x64
```

## UI: Wired Elements
[Wired Elements](https://wiredjs.com/)是一套使用[Rough.js](https://roughjs.com/)來提供手繪質感的web components library。
根據官方網站的說明，Rough.js的應用範圍是「在canvas或svg元素上產生手繪線條的效果」，而Wired Elements將其與shadow DOM搭配，在每一個HTML元素中建立shadow DOM，並在shadow DOM上套用Rough.js提供的視覺效果

### 使用心得
- 優點：以非正式的練習專案來說，可以很快地替專案打造出有一致性的視覺介面，使用起來也很簡單
- 限制：專案中有使用到的兩種components（`<wired-slider>`與`<wired-button>`）皆不易調教尺寸
    - 這部分可以透過下載原始碼、修改後自行host來處理（但費工成這樣不如一開始從頭處理UI設計）
    - 最後還是只有使用`--wired-slider-knob-color`來調整slider按鈕的顏色而已


## Scrape: Puppeteer
想加點跟顏色有關的小彩蛋，搜尋後再度來到[和色大辞典](https://www.colordic.org/w)，覺得和風色票的名字都挺有質感的，且資料結構可以很簡單地透過HEX碼來做色名：色碼對應，所以⋯⋯
{% figure figure--center 2021/REB-to-HEX-review/that-it-is.jpg "'色票字典真是太方便了'" %}

但是直接複製網站的資料，其結構無法直接拿來使用：
{% figure figure--center 2021/REB-to-HEX-review/website-screenshot.jpg "''" %}
需要的部分只有漢字與HEX碼，且理想上資料結構應該是一行一組「色名：色碼」資料，讀取後處理也比較方便。
順帶一提，即使把瀏覽器的視窗寬度壓縮到極限，網站上的UI結構也沒有變成一行一組資料，沒辦法透過RDW來偷懶：
{% figure figure--center 2021/REB-to-HEX-review/RWD.png "'偷雞大失敗'" %}
{% figure figure--center 2021/REB-to-HEX-review/DOM.png "''" %}
不過DOM的結構很整齊，需要的文字資料也都放在`<a>`標籤的`title`屬性中，意思就是：
<p style="font-size: 36px; text-align: center;">可以用爬蟲處理</p>
最後，爬完取得的資料還要可以儲存成.json或.csv格式方便取用。而把JavaScript、scraping與file save等關鍵字組合起來之後：
<p style="font-size: 36px; text-align: center;"><a href="https://github.com/puppeteer/puppeteer/#puppeteer" target="_blank">Puppeteer</a></p>

完整腳本如下：
<script src="https://gist.github.com/tzynwang/b217c3f4bdccacebcc1eff2fd969e010.js"></script>


## Save to file: Node.js
- 一開始使用`appendFile`來儲存透過puppeteer爬到的資料時，在.csv檔案內總是會發現資料順序與爬蟲資料不一致的問題，於是改為使用`appendFileSync`來寫入資料
- 雖然執行速度明顯降低，但可以確保最後輸出的檔案不會有順序錯誤的問題


## HTML內容
<script src="https://gist.github.com/tzynwang/6fb9c6516f164d79a44638bf0fa3e826.js"></script>

- 在`<head>`部分就引入Wired Elements模組與自定義的CSS，以利瀏覽器渲染介面
- 因為頁面上總計只有三處用到bootstrap圖示，故`<wired-button>`直接使用`<svg>`來繪製，而不額外引入大尺寸的bootstrap模組
- `<footer>`後引入papa parse模組與自定義的JavaScript；papa parse主要是配合`main.js`來匯入.csv資料，且465筆顏色的名字不會在網頁渲染完成後馬上顯示給使用者看，故載入的優先度偏低


## JS內容
<script src="https://gist.github.com/tzynwang/e90bfbcef2570e6f051232d016143605.js"></script>

### `// import color name`
反省：其實可以連papa parse都不使用。在透過puppeteer爬資料後，使用`appendFileSync`直接輸出一行一組「色名：色碼」的.json檔案，接著使用純JavaScript來執行ajax讀取.json資料即可：
<script src="https://gist.github.com/tzynwang/51b34ecb02809aec6afb9bc2cbd0cd88.js"></script>

### `// copy button`
在grid-template-areas generator使用過的`select()`只能抓取`<textarea>`的資料，而本次要複製的文字是在`<span>`裡面，故需要換個方式來複製內容，程式碼參考[How to copy text from a div to clipboard](https://stackoverflow.com/a/48020189)

### `// lucky button`
使用`Math.random()`搭配`Math.floor()`來取0-255之間的整數亂數，取得顏色資料後再依序更新slider與`<span>`展示區的內容

### `// reset button`
反省：reset功能最底部的`textColorAdjust()`其實沒有必要（因為HEX碼確定為`#000000`），直接重設`.output`的背景顏色為黑色即可

### `setBackgroundColor()`與`setTextColor()`
純粹是為了讓上半部的JavaScript原始碼更整潔一點，所以使用function來包住兩個設定背景顏色、顏色的指令

### `rgbToHex()`
將傳入的數字（資料型態是string）使用`parseInt`轉為十進位的number資料後，再透過`toString(16)`轉換為十六進位的string，最後在string.length未滿2的時候，在左邊補0

### `lookupName()`
比對傳入的HEX碼是否在colorWithName物件中有一份副本。使用`Object.values(colorWithName).indexOf(hexCode)`查詢index是否存在。在回傳的值大於-1的情況下代表colorWithName包含該HEX碼，此時再更新`colorNameSpan`的文字內容即可。

### `luminanceCalculate()`與`textColorAdjust()`
`luminanceCalculate()`的程式碼是向 [Building your own color contrast checker](https://dev.to/alvaromontoro/building-your-own-color-contrast-checker-4j7o) 與 [How to programmatically calculate the contrast ratio between two colors?](https://stackoverflow.com/questions/9733288/how-to-programmatically-calculate-the-contrast-ratio-between-two-colors/9733420#9733420) 借來的。`luminanceCalculate()`計算完顏色的relative luminance後，傳入`textColorAdjust()`來計算「白色」與「該顏色」的相對亮度倍率，在倍率小於4時，`#hexCode`的文字顏色要轉換為黑色（`rgb(0, 0, 0)`）


## CSS內容
<script src="https://gist.github.com/tzynwang/a181d23bcae1e1c3e8a88859cc1394e1.js"></script>

搜尋日文字體的關鍵字為：「Japanese font style CC0」
使用的網站服務是：[FREE JAPANESE FONTS](https://www.freejapanesefont.com/tag/commercial-use-ok/)
最後選定的日文字體為：[Shirokuma](https://www.freejapanesefont.com/shirokuma-font-download/)、[しろくまは冬眠したい](https://www.lazypolarbear.com/entry/font-shirokuma)（作者發布字體的初始頁面）


## 其他參考文件
- [W3C: Relative luminance](https://www.w3.org/WAI/GL/wiki/Relative_luminance)
- [WebAIM: Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [卡斯伯：爬蟲、E2E 測試兩相宜的好工具 - Puppeteer](https://wcc723.github.io/development/2020/03/01/puppeteer/)
- [Using Puppeteer to Transform HTML content into JSON](https://www.tgwilkins.co.uk/using-puppeteer-to-transform-html-content-into-json.html)：參考其三元運算子的寫法
- [How to check if a value exists in an object using JavaScript](https://stackoverflow.com/questions/35948669/how-to-check-if-a-value-exists-in-an-object-using-javascript)
- [Get element of JS object with an index](https://stackoverflow.com/questions/14802481/get-element-of-js-object-with-an-index)
- [Bootstrap Glyphicons Not Showing on Local URL](https://stackoverflow.com/questions/27976282/bootstrap-glyphicons-not-showing-on-local-url)：最初原本打算連Bootstrap icon都要採取自行host的形式，故下載了原始碼且拖曳到專案的資料夾中。重整頁面後發現圖示皆無法正常顯示，搜尋後知道Bootstrap icon需與其字型檔案搭配才可正常使用（但字型檔案實在太大，且本次只有使用到三個圖示，故改用`<svg>`直接繪製）