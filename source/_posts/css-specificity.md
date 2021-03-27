---
title: 「CSS Specificity」相關筆記
date: 2021-03-18 20:52:44
categories:
- CSS
tags:
---

## 重點整理
- 有重複的CSS樣式規則套用到同一個HTML元素上的時候，權重（specificity）高的樣式會覆蓋權重低的樣式設定。
- 原始碼中位置越下方（後發）的CSS樣式會複寫先寫出來的樣式。
- 樣式規則有衝突的時候，權重較高的樣式會覆蓋權重低的樣式。衝突規則的權重一樣大的時候，後發的樣式會覆蓋先寫的樣式。


## Specificity
Specificity（以降以「權重」稱之）的高低影響哪一些CSS樣式會發生作用。
設定好的CSS沒有作用，可能就是CSS樣式的權重沒有妥善安排，導致編寫好的CSS樣式沒有如預期般套用到HTML元素上。

權重從低至高順位分組如下：
1. universal selector與inherited style：使用`*`選取「全部」與繼承得來的樣式，兩者的權重皆為`0-0-0-0-0`；最低的權重
1. element selector、::pseudo-element selector：選取HTML元素或偽元素，權重為`0-0-0-0-1`
    - HTML元素：html、body、section、div、p……等HTML元素（element）
    - 偽元素：
    > A CSS pseudo-element is a keyword added to a selector that lets you style a specific **part** of the selected element(s).
    
    參考[MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements)，偽元素指的是HTML元素的「某一個部份」，較常見的大概是`::after`、`::before`與`::first-letter`
1. .class selector、:pseudo-class selector、[attribute] selector：選取class、偽類或具有特定屬性（attribute）的HTML元素，權重為`0-0-0-1-0`
    - 偽類：
    > A CSS pseudo-class is a keyword added to a selector that specifies a special **state** of the selected element(s).
    
    參考[MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes)，偽類指的是HTML元素的「某一種狀態」，最常見的大概是`:hover`
    - 屬性：參考[MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes)，以`input[type="checkbox"]`為例，就是「選取所有是checkbox特性的input元素」
1. #id selector：選取擁有某id的HTML元素，權重是`0-0-1-0-0`
1. inline style（比如`<p style="color: red;">text</p>`）：權重是`0-1-0-0-0`，不過這樣會讓原始碼的維護性變差，所以還是避免使用吧
1. `!important`：擁有最大的權重`1-0-0-0-0`，而後發的`!important`會壓過先寫出來的`!important`


### 權重的計算方式
參考以上劃分的六種權重分組，將選取器中屬於同一組的選擇器條件相加後進行比大小。
舉個🌰，假設以下兩種`color`的樣式設定位在同一份原始碼裡面：
```CSS
#blue { /* 第一組樣式 */
  color: blue;
}

div p { /* 第二組樣式 */
  color: red;
}
```
而HTML內容如下：
```HTML
<div>
  <p id="blue">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consectetur, magnam!</p>
</div>
```
第一組樣式的選取器為#id一個，權重為：0-0-1-0-0
第二組樣式的選取器為HTML元素兩個，權重為：0-0-0-0-2
第一組樣式的權重大於第二組，故以上的`<p>`會是藍色：
<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="html,result" data-user="Charlie7779" data-slug-hash="vYyqpLy" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="css specificity">
  <span>See the Pen <a href="https://codepen.io/Charlie7779/pen/vYyqpLy">
  css specificity</a> by Charlie (<a href="https://codepen.io/Charlie7779">@Charlie7779</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

需注意的是，CSS的權重並**不是十進位制**，選取五十個.class做出來的CSS樣式也比不過選取一個#id宣告出來的樣式。
舉個🌰，假設以下兩種`background-color`的樣式設定位在同一份原始碼裡面：
```CSS
#yellow {
  background-color: yellow;
}

.c1 .c2 .c3 .c4 .c5 .c6 .c7 .c8 .c9 .c10 .c11 {
  background-color: green;
}
```
而HTML內容如下：
```HTML
<div class="c1">
  <div class="c2">
    <div class="c3">
      <div class="c4">
        <div class="c5">
          <div class="c6">
            <div class="c7">
              <div class="c8">
                <div class="c9">
                  <div class="c10">
                    <div class="c11" id="yellow"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```
那麼該`<div>`的背景顏色會是黃色：
<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="html,result" data-user="Charlie7779" data-slug-hash="vYywoqR" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="css specificity">
  <span>See the Pen <a href="https://codepen.io/Charlie7779/pen/vYywoqR">
  css specificity</a> by Charlie (<a href="https://codepen.io/Charlie7779">@Charlie7779</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

在CSS Specificity的宇宙裡，團結起來的五十個`.筷子`還是會被`#●門`夾爆的。


### 快速判別樣式的權重
- `!important`最大，有複數個`!important`就看哪一段樣式最後被執行
- element贏不過.class與[attribute]，.class與[attribute]贏不過#id
- 使用人家寫好的計算機：[Specificity Calculator](https://specificity.keegan.st/)

{% figure figure--center 2021/css-specificity/fullhouse.jpg "在CSS Specificity的宇宙裡，就算你爸變兔子.class也打不過#id''" %}


## 權重相等時，後發覆蓋先寫的樣式
假設`style.css`的內容如下：
```CSS
p {
  color: blue;
}
```
而HTML內容如下：
```HTML
<!DOCTYPE html>
<html lang="en">

<head>
  <link rel="stylesheet" href="./style.css">
  <style>
    p {
      color: green;
    }
  </style>
</head>

<body>
  <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consectetur, magnam!</p>
</body>

</html>
```
因為`<style>`比`<link rel="stylesheet" href="./style.css">`晚執行，所以`<p>`會是綠色（按下<span style="color: #21a243;">▶</span>執行程式碼看結果）：
<iframe height="400px" width="100%" src="https://replit.com/@Charlie7779/css-specificity-style-after-link?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

而如果調換`<style>`與`<link rel="stylesheet" href="./style.css">`的順序：
```HTML
<!DOCTYPE html>
<html lang="en">

<head>
  <style>
    p {
      color: green;
    }
  </style>
  <link rel="stylesheet" href="./style.css">
</head>

<body>
  <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consectetur, magnam!</p>
</body>

</html>
```
`<p>`就會是藍色（按下<span style="color: #21a243;">▶</span>執行程式碼看結果）：
<iframe height="400px" width="100%" src="https://replit.com/@Charlie7779/css-specificity-link-after-style?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>


### LVHA
問：為什麼超連結的CSS樣式最好以「link-visited-hover-active」的順序從上到下書寫？
答：因為樣式權重相等的時候，後發的樣式會覆蓋先寫的內容。
假設使用「link-hover-active-visited」的順序來設定CSS樣式：
```CSS
a:link {
  color: blue;
}
a:hover {
  color: aqua;
}
a:active {
  color: red;
}
a:visited {
  color: purple;
}
```
那一個被點擊過的（`:visited`）超連結，即使在`:hover`或`:active`的狀態，也不會被套上`:hover`或`:active`的樣式，因為`:hover`與`:active`通通被`:visited`的樣式蓋過去了。
點擊過以下範例的超連結後，即使把游標停留在連結上，文字也不會變為水藍色：
<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="css,result" data-user="Charlie7779" data-slug-hash="abBgEQN" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="LHAV">
  <span>See the Pen <a href="https://codepen.io/Charlie7779/pen/abBgEQN">
  LHAV</a> by Charlie (<a href="https://codepen.io/Charlie7779">@Charlie7779</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

但如果把樣式順序修改如下：
```CSS
a:link {
  color: blue;
}
a:visited {
  color: purple;
}
a:hover {
  color: aqua;
}
a:active {
  color: red;
}
```
這個超連結就可以表現出四種不同狀態的樣式。
先點擊以下範例的超連結，超連結的文字會變成紫色，但因為`:hover`與`:active`的樣式順序在`:visited`以下，所以當游標停留在連結上（狀態為`:hover`）時，文字會變成水藍色；而點下超連結（狀態為`:active`）時，文字會變成紅色：
<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="css,result" data-user="Charlie7779" data-slug-hash="xxRopME" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="LVHA">
  <span>See the Pen <a href="https://codepen.io/Charlie7779/pen/xxRopME">
  LVHA</a> by Charlie (<a href="https://codepen.io/Charlie7779">@Charlie7779</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>


## 規則衝突時，後發覆蓋先寫的樣式
舉個🌰，假設以下兩種針對`<p>`的樣式設定位在同一份原始碼裡面：
```CSS
p {
  color: red;
  background: blue;
}

p {
  color: yellow;
}
```
衝突的規則只有`color`，`background`不受影響，所以最後`<p>`的樣式會是「藍色背景、黃色文字」：
<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="html,result" data-user="Charlie7779" data-slug-hash="PobrEQQ" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="css specificity">
  <span>See the Pen <a href="https://codepen.io/Charlie7779/pen/PobrEQQ">
  css specificity</a> by Charlie (<a href="https://codepen.io/Charlie7779">@Charlie7779</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>


## 透過繼承得到的樣式，權重是0-0-0-0-0
舉個🌰，假設以下兩種樣式設定位在同一份原始碼裡面：
```CSS
#parent {
  color: green;
}

h1 {
  color: red;
}
```
而HTML內容如下：
```HTML
<html>
  <body id="parent">
    <h1>A Title</h1>
  </body>
</html>
```
`<h1>`從`<body id="parent">`繼承到的文字色彩樣式會被CSS樣式表中的`h1`覆蓋掉（樣式`h1`的權重是0-0-0-0-1），`<h1>A Title</h1>`會是紅色：
<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="html,result" data-user="Charlie7779" data-slug-hash="vYyqRXo" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="inherited styles">
  <span>See the Pen <a href="https://codepen.io/Charlie7779/pen/vYyqRXo">
  inherited styles</a> by Charlie (<a href="https://codepen.io/Charlie7779">@Charlie7779</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>


## 參考文件
- [CSS Specificity: Things You Should Know](https://www.smashingmagazine.com/2007/07/css-specificity-things-you-should-know/)
- [Link Specificity: I tried to apply CSS to my hyperlinks and the hovering didn't work](https://meyerweb.com/eric/css/link-specificity.html)
- [MDN: Directly targeted elements vs. inherited styles](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity#directly_targeted_elements_vs._inherited_styles)
- [CSS Specificity with icons inspired by "The Shining"](https://cssspecificity.com/)