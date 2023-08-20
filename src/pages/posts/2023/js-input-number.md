---
layout: '@Components/pages/SinglePostLayout.astro'
title: 工作筆記：使用 JavaScript 控制輸入內容僅限於數字
date: 2023-07-15 12:36:42
tag:
  - [JavaScript]
---

## 總結

最近負責的產品在跑 QA 時才注意到 FireFox 瀏覽器「並不會限制 `<input type="number">` 元件只能輸入數字內容」🤯！

為了實現「元件僅能允許使用者輸入數字」的需求，工程師要額外補上一些 JavaScript 來達成這個目的。這篇筆記會提供：

- 限制輸入僅能為數字的方法
- 驗證輸入內容是否為合法正整數的方法

## 筆記

### 程式碼

限制使用者只能對一個 input 元件鍵入數字：

```tsx
/* Function */
const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!/^\d*$/.test(e.target.value || '')) return;
  // TODO...
  // 已經確保使用者無法輸入非數字內容，剩下就根據實作需要來處理 e.target.value
};

/* Component */
<input value={userInput} onChange={onInputChange} />;
```

注意事項：不需要使用 `<input type="number">` ，實測時發現 FireFox 的 `<input type="number">` 無法正常觸發 `onInputChange` 效果，拔掉 `type="number"` 才能正常阻擋使用者鍵入數字以外的內容。可在 FireFox 開啟下方 code sand box 實測：

<iframe src="https://codesandbox.io/embed/input-type-number-onchange-limitation-not-working-in-firefox-m6dl25?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="Input type=&quot;number&quot; onChange limitation not working in FireFox"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

使用 `type="number"` 會讓手機裝置預設提供輸入數字用的虛擬鍵盤（參考下方引文），但為了能夠在 Firefox 也能限制使用者的輸入內容，最後還是決定拔掉 `type="number"` 的設定。

> MDN: Mobile browsers further help with the user experience by showing a special keyboard more suited for entering numbers when the user tries to enter a value.

---

檢驗使用者輸入的內容是否為大於零的整數：

```ts
function isValidInteger(str: string) {
  return Number.isInteger(+str) && +str > 0;
}
```

注意不需要使用 `Number.isSafeInteger()` ，使用 `isSafeInteger` 會導致使用者在輸入過大的數字時產生錯誤。

> MDN: The safe integers consist of all integers from `-(2^53 - 1)` to `2^53 - 1`, inclusive (`±9,007,199,254,740,991`).

### 補充資訊

> MDN: Logically, **you should not be able to enter characters inside a number input other than numbers**. Some browsers allow invalid characters, others do not; see [Firefox bug 1398528](https://bugzilla.mozilla.org/show_bug.cgi?id=1398528).

FireFox 允許使用者對 `type="number"` 輸入數字以外的內容是個已知六年的 bug 🤷 但 browser compatibility 並沒有標註 FireFox 不支援 `<input type="number">`

## 參考文件

- [MDN: `<input type="number">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number)
- [Bugzilla: HTML `<input type=number>` should not allow users to type in characters that are not part of a number](https://bugzilla.mozilla.org/show_bug.cgi?id=1398528)
- [mdn/browser-compat-data: html.elements.input.type_number - Under browser compatibility it says supported by firefox. This is incorrect.](https://github.com/mdn/browser-compat-data/issues/18050)
