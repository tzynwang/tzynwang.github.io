---
title: 30天挑戰：CSS progress bar (stepper) 技術記錄
date: 2021-08-05 10:48:24
categories:
- CSS
tags:
---

## 總結
記錄頭尾至頂至底的進度條之HTML結構與CSS設定

<p class="codepen" data-height="300" data-theme-id="dark" data-default-tab="css,result" data-slug-hash="Pomdayv" data-user="Charlie7779" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/Charlie7779/pen/Pomdayv">
  stepper (justify-content-between) (::after line)</a> by Charlie (<a href="https://codepen.io/Charlie7779">@Charlie7779</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

## 設計圖
{% figure figure--center 2021/ithome2021-1-progress-bar/mobile.png "'手機版畫面'" %}

{% figure figure--center 2021/ithome2021-1-progress-bar/desktop.png "'桌面版畫面'" %}

- 手機版不顯示步驟文字
- 步驟圖示與文字需左右頭尾滿版
- 三個狀態階段：已完成（黑底白字配黑線）、進行中（紅底白字配紅線）、待填寫（灰框灰字配灰線條）

## HTML結構
<script src="https://gist.github.com/tzynwang/8383c1f085057180b1cf87473c7e9e31.js"></script>

- 全部stepper的HTML結構都維持一致，代表日後可改用程式碼搭配迴圈動態產生progress bar內容
- stepper的步驟數字不使用CSS偽元素，避免分散產生內容的相關邏輯
  - 補充理由：「步驟數字不建議放到偽元素裡面，因為擴展為更多步驟，變數不好塞」、「（如果數字透過偽元素處理的話，）實務上若遇到多語系需求，或是不同數字的表達方式等等，就容易傷腦筋」
- 使用`complete`、`active`與`pending`三種CSS class name來明確標註不同狀態，增加原始碼的好讀性

## CSS
<script src="https://gist.github.com/tzynwang/ad326ea498a0945085e5961e188a3c21.js"></script>

- 第9行`.step-container`：注意並**沒有**使用`justify-content: space-between;`
- 第18行`.step-item`：
  - 使用`flex: 1 1;`讓flex item佔據所有空間
  - `overflow-x: hidden;`乃是為了配合progress bar line，重要的伏筆（？）
- 第26行`.step-item:not(:first-child)`：除了第一個stepper外，其餘stepper一律使用`padding-left`往右側退`1rem`
- 第30行`.step-item:last-child`：使用`flex: none;`讓最後一個stepper完全不額外佔據任何空間
  {% figure figure--center 2021/ithome2021-1-progress-bar/flex-none-demo.gif "'套用flex none後，最後一個stepper即可靠右置底'" %}
- 第34-35行：設定`.icon`與`.content`為`display: inline-block;`，即可直接水平排列
- 第39行`.icon`：
  - 設定`flex: none;`避免圖示本身被壓縮變形
  - 使用`text-align: center;`與`line-height: 32px;`讓文字水平垂直置中
- 第53行`.step-item:not(:last-child)`：
  - 54行`.content`設定為`position: relative;`作為progress bar line的定位基準點
  - 60行`.content::after`：繪製progress bar line，設定`left: calc(100% + 1rem);`讓線條往右推移，並因為第18行已經設定`.step-item`需`overflow-x: hidden;`，所以多餘的線條長度會直接被隱藏起來
  {% figure figure--center 2021/ithome2021-1-progress-bar/progress-line-demo.gif "'以.content為定位基準，右推100%後，再補推1rem留下一點空間'" %}
  - 66行`width: 99999px;`：直接設定一個足夠長的線段數值
- 第73行`.content-text`：手機版時不顯示，故`display: none;`
- 79-106行：針對不同的狀態進行顏色調整
- 第109行：在桌面版要顯示`.content-text`，將`display: inline-block;`加回

## 參考文件
- [Ant Design Pro: 分步表單](https://preview.pro.ant.design/form/step-form)
- 特別銘謝：超感謝Red Chou助教願意撥冗給予原始碼的改善建議