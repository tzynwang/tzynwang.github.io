---
title: ALPHA Camp 履歷網頁作業：內容解析
date: 2021-03-20 21:06:49
categories:
- CSS
tags:
---

## 總結
記錄在2021年ALPHA Camp學期一、三月班第三週履歷網頁作業使用到的技術、思路與開發流程。


## 版本與環境
```
Google Chrome: 89.0.4389.90 (Official Build) (64-bit)
os: Windows_NT 10.0.18363 win32 x64
```

## 流程
1. 雖然課程還沒有要求成品需有RDW效果，但因為已經知道原理、也在之前做過的微型專案實作過RDW，故本次作業要求自己做出（至少）手機與桌機兩種版面
1. 還沒有實際使用純CSS做出一鍵切換「亮色／暗色模式」的效果，但已經知道原理，決定在本次作業中實踐此功能
1. 將視覺動線統一為F字形（由上到下、從左到右）。且因網站內容基本上都是英語，橫向三欄平分畫面寬度後，寬度可能不足、導致內文頻繁換行，故不採用示範網站使用的三欄並排排版
1. 對自己配色沒自信，決定直接到課程中提到的 [Adobe Color: EXPLORE](https://color.adobe.com/explore) 搜尋以紅色為主的色票。最後挑了藍＋紅（配合作業用照片的印象）且彩度較低的組合：[Cadmium Red Deep](https://color.adobe.com/Cadmium%20Red%20Deep-color-theme-10212225)
1. 使用Figma勾勒出[wireframe](https://www.figma.com/file/cfK4C3Jt8CgvVqEZiXlRaX/S4-A14-%E7%82%BA%E5%AE%A2%E6%88%B6%E6%89%93%E9%80%A0%E5%B1%A5%E6%AD%B7%E7%B6%B2%E9%A0%81-wireframe?node-id=0%3A1)，桌機的版面配置與手機橫放後一樣，故沒有特別畫出桌機的wireframe

## HTML架構
- 照片、姓名與連結組合放在`<header>`區塊
- 自我介紹文字、技能與工作經驗放在`<main>`區塊
- 底部`<footer>`區塊
- 在所有的裝置上，`<footer>`都會在畫面的最底部，但手機直持或橫持會影響`<header>`與`<main>`要垂直還是水平排列，故外加了一個`<div class="container">`來打包`<header>`與`<main>`，並使用`flex-direction`來控制`<header>`與`<main>`在不同裝置上的排列方向
- 為配合CSS選取器的邏輯，控制「亮色／暗色模式」的`<input>`、`<label>`組放在`<div class="container">`上方（`<input>`、`<label>`組的階層與`<div class="container">`一致）

最終`<body>`內容如下：
<script src="https://gist.github.com/tzynwang/bac46a0e8166ded1cc18d837c816c718.js"></script>

## CSS內容解析

### 通用樣式
<script src="https://gist.github.com/tzynwang/d21d76dc229a53dad1c956d255b8fb38.js"></script>

- 字體
  - 因作業會上傳到codepen，故不採取self-host，而是直接`@import`由Google提供的字體服務
  - 履歷內容文字多，並想呈現較專業的感覺，故挑選有襯線的`Newsreader`作為主字體
    - `Newsreader`的[說明](https://fonts.google.com/specimen/Newsreader?preview.text_type=custom#about)也提到字體本身適合應用在需要閱讀的情境：primarily intended for continuous on-screen reading in content-rich environments.
  - 姓名的部分挑選`Kristi`，想營造手動簽名的視覺效果
- 全預設定（`*`）
  - 手動重設`margin`與`padding`為`0`、`box-sizing`設定為`border-box`，避免干擾後續排版作業
  - 考量到後續可能會更改用色，選擇使用關鍵字來處理色票（color tickets）
- `<div class="container">`：一般狀態下使用淺色背景（`var(--light)`）搭配深色文字（`var(--dark)`）
- `header`：使用`padding`將內容往內推移，避免文字過於靠近邊緣，降低易讀性
- `main`：除了`padding`之外，加上`max-width`限制文字不會因為螢幕較寬而延伸到底
- `h2`：因有多個`h2`出現在網頁上，且樣式不會配合畫面改變尺寸或`margin`、`padding`等，故放在通用樣式區域宣告

### `header`
<script src="https://gist.github.com/tzynwang/702cfae7a67818c5ba0153f2358229f6.js"></script>

- `header`與`.avatar`：為了在各種版面下都能簡單的處理水平置中，直接使用`display: flex;`搭配`flex-direction: column;`與`align-items: center;`來做讓`header`與`.avatar`下所有的內容都呈現水平置中
- `img`：與wireframe的設計不同，最後決定拿掉履歷照片的`border-radius: 50%;`，因為最終成品一眼望過去只有照片是圓形反而覺得有點突兀
- `h1`：加上`transform: rotate(-5deg);`讓文字稍微向右上角抬起，增加一點活躍感；並配合`margin-bottom: 8px;`來製造空間，稍稍推開下方的連結組合
- `header ul`：使用`list-style: none;`移除預設的圓點樣式；加上`display: flex;`讓連結們水平排列；使用`header ul`選取器是因為整份履歷中還有其他部位使用到`ul`元件，不加上`header`會導致其他區塊的`ul`排版走山
- `header ul li`：使用`display: inline-block;`讓連結們能撐開Y軸（高度），加上`margin: 16px;`來讓按鈕之間保持距離
- `header ul li:last-child`：`display: none;`讓連結群組最尾端的印表機圖示預設為不顯示，再往下的CSS設定會配合`@media`讓印表機圖示在適當的裝置上呈現出來
- `a`：因為有三種顏色狀態，故加上`transition: 0.3s;`讓換色過程有0.3秒的漸變時間
- `a:link`、`a:visited`、`a:hover`、`a:active`：剛好可以使用色票中的主、輔與亮點顏色；樣式撰寫的順序為LVHA的理由參考之前記錄過的<a href="https://tzynwang.github.io/2021/css-specificity/" target="_blank">CSS Specificity 相關筆記</a>

### `main`
<script src="https://gist.github.com/tzynwang/ed13c13882860c3133090b37a5734b18.js"></script>

- `main section`：首先對`<main>`包含的三個`<section>`加上`margin-bottom: 16px;`，製造區塊之間的距離
- `.about p, .skills p, .experiences ul li`：一口氣撐開三個區塊的文字與清單排版的行高，偷懶一點可寫成`main p, main ul li`，不過，因為想維持樣式表內容撰寫的一致性，最後還是選擇統一使用「.class HTML元素」的寫法
- `.skills span`：在技能區塊中使用`<span>`包裹住想要上色的文字
- `.experiences div`：工作經驗區塊中總計有三項子項目，因為只是要處理排版，沒有到語意上需要使用`<section>`的程度，故使用`<div>`將三個項目各自包起來，並給予`margin-bottom: 8px;`撐開項目之間的距離
- `.experiences p`：工作經驗中「任職公司」的部分使用`<p>`來處理（職稱與負責項目分別屬於`<span>`與`<li>`），稍微放大字體，並套用主色、讓其凸顯於其他文字內容之上
- `.experiences span`：職稱部分使用`display: inline-block;`搭配`padding: 2px 8px;`來撐開`<span>`的Y軸高，做成徽章樣式；另外、因為每一項工作經驗只有一個職稱，故使用`margin: 4px 0px;`移除X軸空間，但保持與上下HTML元素的距離
- `.experiences ul li`：使用`"\21A0  "`設定清單項目的樣式，並透過`inside`讓清單項目不外擴

### `footer`
<script src="https://gist.github.com/tzynwang/1d2b5895b99b8e4bce98f673669cfe8e.js"></script>

- `<footer>`是block物件，直接使用`height`撐開高度後，配合`display: flex;`、`justify-content: center;`與`align-items: center;`讓裡面的文字XY軸置中；並使用`background-color: var(--primary);`填色

### 手機橫持的排版
<script src="https://gist.github.com/tzynwang/1ccc83d8adc6299c68c39a10365b9662.js"></script>

`min-width: 568px`是iPhone SE橫持的寬度，以此為基準，開始處理第二種版面
- `.container`：使用`display: flex;`讓`<header>`與`<main>`水平排列，並總高度設定為「螢幕視高（100vh）扣掉`<footer>`的36px」，把`<footer>`固定在畫面最底
- `header`與`main`則各佔據4成與6成的寬度，並使用`overflow: auto;`在「內容超出容器高度後，出現捲軸，可透過捲動來瀏覽超出容器高度的內容」
- `h1`：稍微縮小字體，避免姓名過大造成版面在視覺上的不平衡

### 平板的排版
<script src="https://gist.github.com/tzynwang/c9dc2bf49e03e48e10a501966c42e145.js"></script>

`min-width: 768px`是iPad直立的寬度，以此為基準，開始處理第三種版面
將`header`與`main`的寬度比例改為3比7；並因為顯示區域變大，所以稍微增加內容內推的距離，`padding`提高為32px、`h1`稍稍放大（4rem）

### 桌上裝置顯示印表機圖示
<script src="https://gist.github.com/tzynwang/47d368d116e011d2d075c7042807fb9e.js"></script>

設定`min-width: 768px`以上後要顯示連結群組最尾端的印表機圖示，小缺點是這個break point會讓橫持的iPad Pro也看得到印表機……（ ˘･з･）

### 亮色／暗色模式
<script src="https://gist.github.com/tzynwang/8facdb6989a9e4e4441ff5b6fddf9a71.js"></script>

簡短說明如何使用純CSS做出「亮色／暗色模式」切換的效果：
1. 使用`<input type="checkbox">`搭配`<label>`並使用`position: fixed;`固定位置，`<input>`放在可視畫面之外，`<label>`留在畫面右下角（小版面）或右上方（中型以上版面）讓使用者點擊
1. `<label>`被點擊後，使用CSS選取器`:checked`搭配`filter: invert(100%);`來為畫面上的顏色套上負片效果
1. 關於`filter: invert(100%);`的視覺效果，可參考之前做過的微型專案：<a href="https://tzynwang.github.io/CSS-filter-property/" target="_blank">CSS filter Property</a>


較詳細說明如下：
- `#dark, #darkLabel`：使用`position: fixed;`固定`<input type="checkbox" id="dark">`與`<label for="dark" id="darkLabel">`的位置
- `#dark`：幫`<label>`和`<input>`定位時，這兩項元素的位置是參考`<body>`來偏移，所以將`<input>`的位置設定為`top: -2rem;`、`left: -2rem;`來把核取方塊推到視覺範圍之外
  - 入門可參考YouTube影片：[金魚都能懂網頁設計入門 : Fixed 定位](https://www.youtube.com/watch?v=6jwl-XEpXLk&list=PLqivELodHt3iL9PgGHg0_EF86FwdiqCre&index=13)
  - [MDN對`fixed`的說明](https://developer.mozilla.org/en-US/docs/Web/CSS/position#values)：It is positioned relative to the initial containing block established by the viewport, except when one of its ancestors has a transform, perspective, or filter property set to something other than none, in which case that ancestor behaves as the containing block. 而因為`<label>`和`<input>`之上就是`<body>`了，所以在這份作業中不用擔心其他元素會被拿來當作定位參考的問題
- `#darkLabel`：使用`opacity: 0.8;`讓按鈕在視覺上不要那麼厚重；加上`z-index: 1;`確保按鈕不會被其他元素覆蓋掉；而因為在亮色／暗色之間切換時會改變按鈕顏色，故補上`transition: 0.3s;`讓顏色轉換的過程不要太突兀；而`display: flex;`、`justify-content: center;`與`align-items: center;`讓按鈕中的圖示XY軸置中
- `#darkLabel svg`：按鈕中的圖示用`fill: var(--light);`來填入顏色
- `#dark:checked~#darkLabel`：在`<input type="checkbox" id="dark">`被勾選後，`<label for="dark" id="darkLabel">`按鈕本身的顏色要變淺（`background-color: var(--medium);`），並按鈕陰影因為整體畫面的背景顏色變深，所以也要改的亮一點（`box-shadow: 0px 0px 8px var(--light);`）
- `#dark:checked~#darkLabel svg`：原理同上，按鈕本身顏色變淺的話，按鈕內的圖示顏色要加深（`fill: var(--dark);`）
- `#dark:checked~#darkLabel svg path`：用選取器抓取`<svg>`圖示裡面的`<path>`元素，修改其`d`值讓圖示形狀從月亮變為太陽
  - 參考：[CSS change d property of <path> - Stack Overflow](https://stackoverflow.com/questions/42227012/css-change-d-property-of-path)
- `#dark:checked~.container, #dark:checked~footer`：使用`filter: invert(100%);`來讓`.container`與`footer`元素的顏色負片化，而`hue-rotate(180deg)`讓顏色在負片化之後讓色相「轉回」原點
- `#dark:checked~.container header .avatar img, #dark:checked~footer p span`：把「不要負片」的元素選取起來，套用`filter: hue-rotate(-180deg) invert(100%);`把顏色負片回去（抵銷掉負片效果）
- 上述CSS原始碼第51行開始：使用`@media`讓切換「亮色／暗色模式」的按鈕在手機橫持以上的版面停留在畫面右上方（`top: 0;`與`right: 60px;`），並修改`width`與`height`讓按鈕變成窄長方形


## 參考文件
- [Pure CSS3 Dark Mode Effects For Website | CSS Only Night mode](https://youtu.be/5aJTVV-rlBw)
- [Full Dark Mode with only 1 CSS PROPERTY?!](https://youtu.be/qimopjP6YoM)