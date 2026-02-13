---
title: 30天挑戰：「信用卡資料的inputmode設定」 相關筆記
date: 2021-08-25 15:01:04
tag:
  - [HTML]
  - [2021鐵人賽]
---

## 總結

- 透過`input`的`inputmode`設定來控制呼叫出來的鍵盤樣式
- 如果是為了接受信用卡資料的話，設定為`type="tel"`搭配`inputmode="numeric"`可以在 iPhone Chrome 叫出僅有數字鍵的鍵盤
- CodePen 實驗頁：[https://codepen.io/Charlie7779/pen/OJgPWJa](https://codepen.io/Charlie7779/pen/OJgPWJa)

## 環境

```
Google Chrome (iOS/WebKit): 92.0.4515.90
```

## 實測結果

![各種inputmode呼叫的鍵盤樣式](/2021/ithome2021-11-input-for-credit-card/inputmode.png)

- `none`：不會呼叫任何鍵盤
- `tel`：點選左下角`+*#`鍵可切換為符號鍵盤
- `decimal`：點選左下角`.`鍵可直接輸入`.`號，不會切換為符號鍵盤
- `numeric`：僅提供數字鍵盤
- `text`：呼叫一般鍵盤
- `search`：右下角的「換行」鍵改為「前往」（英文鍵盤為「go」）
- `email`：空白鍵右側追加`@`與`.`鍵
- `url`：空白鍵右側追加`/`與`.`鍵

## 參考文件

- [MDN: inputmode](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inputmode)
- [What is the correct input type for credit card numbers?](https://stackoverflow.com/questions/48534229/what-is-the-correct-input-type-for-credit-card-numbers)
