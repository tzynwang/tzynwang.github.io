---
title: 30天挑戰：「CSS 多行文字溢出後改為顯示刪節號」技術記錄
date: 2021-08-11 10:01:26
categories:
- [CSS]
- [2021鐵人賽]
tags:
---

## 總結
`text-overflow: ellipsis;`僅能處理單行文字，若想要讓多行文字的尾端改為顯示刪節號，需使用`-webkit-line-clamp`

<p class="codepen" data-height="400" data-theme-id="dark" data-default-tab="css,result" data-slug-hash="poPGJPx" data-user="Charlie7779" style="height: 400px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/Charlie7779/pen/poPGJPx">
  text-overflow ellipsis</a> by Charlie (<a href="https://codepen.io/Charlie7779">@Charlie7779</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

應用（卡片標題與內文）：
{% figure figure--center 2021/ithome2021-4-text-overflow-ellipsis/demo.gif "'效果展示'" %}

展示位置：https://tzynwang.github.io/ac_challenge_2-3F_profile-card/
原始碼：https://github.com/tzynwang/ac_challenge_2-3F_profile-card


## 筆記
### 單行文字
> MDN: The text-overflow property **doesn't force an overflow to occur**. To make text overflow its container you have to set other CSS properties: `overflow` and `white-space`.

- 務必搭配`overflow: hidden;`與`white-space: nowrap;`


### 多行文字
> MDN: It only works in combination with the **display property** set to `-webkit-box` or `-webkit-inline-box`, and the `-webkit-box-orient` property set to **vertical**.

> MDN: In most cases you will also want to set `overflow` to **hidden**, otherwise the **contents won't be clipped but an ellipsis will still be shown** after the specified number of lines.

- `-webkit-line-clamp`需搭配`display: -webkit-box;`（或`display: -webkit-inline-box;`）與`-webkit-box-orient: vertical;`
- `-webkit-line-clamp`的數值代表顯示在畫面上的行數
- 最後補上`overflow: hidden;`與`text-overflow: ellipsis;`來讓溢出的文字改顯示為刪節號；沒有設定`overflow: hidden;`的話，文字末端的刪節號還是會出現，但是超出`-webkit-line-clamp`的文字行也會跟著顯示出來


## 參考文件
- [MDN: text-overflow](https://developer.mozilla.org/en-US/docs/Web/CSS/text-overflow)
- [MDN: box-orient](https://developer.mozilla.org/en-US/docs/Web/CSS/box-orient)
- [MDN: -webkit-line-clamp](https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-line-clamp)
- [Limit text length to n lines using CSS](https://stackoverflow.com/questions/3922739/limit-text-length-to-n-lines-using-css)
- [Applying an ellipsis to multiline text](https://stackoverflow.com/questions/33058004/applying-an-ellipsis-to-multiline-text/41137262)