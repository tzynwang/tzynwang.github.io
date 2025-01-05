---
title: 30天挑戰：「設定input autofill樣式」技術記錄
date: 2021-08-15 09:29:23
tag:
- [CSS]
- [2021鐵人賽]
---

## 總結

並非透過`background-color`，而是`box-shadow`來調整 input 在 autofill 狀態下的背景顏色

## 樣式套用前

![Chrome預設樣式](/2021/ithome2021-6-css-input-autofill/browser-default-input-autofill.png)

- 透過 autofill 選擇要填入表單的內容後，發現 input 欄位呈現出瀏覽器預設的文字與背景顏色，且無法透過`color`與`background-color`來修改其設定
- 解決方式：
  - 選取偽類`:-webkit-autofill`、`:-webkit-autofill:hover`與`:-webkit-autofill:focus`
  - 文字顏色透過`-webkit-text-fill-color`來設定
  - input 背景色使用`box-shadow`來實作
  ```css
  -webkit-text-fill-color: var(--dark);
  box-shadow: inset 0 0 0 1000px var(--white);
  /* 使用內陰影，模糊程度為0，並設定散播1000px */
  ```

## 樣式修改後

![樣式套用後](/2021/ithome2021-6-css-input-autofill/set-autofill-style.png)
![不影響autofill選單樣式](/2021/ithome2021-6-css-input-autofill/menu.png)

## 參考文件

- [Change Autocomplete Styles in WebKit Browsers](https://css-tricks.com/snippets/css/change-autocomplete-styles-webkit-browsers/)
- [chrome 浏览器中自带 input 样式 input:-internal-autofill-selected（修改 input 背景色）](https://blog.csdn.net/lys20000913/article/details/104529698)
- [CSS（一）chrome 浏览器表单自动填充默认样式-autofill](https://blog.csdn.net/zhengjie0722/article/details/90319321)
