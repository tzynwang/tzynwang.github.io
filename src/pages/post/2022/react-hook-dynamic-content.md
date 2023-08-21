---
layout: '@Components/pages/SinglePostLayout.astro'
title: 2022 第30週 工作筆記：透過 custom hook 回傳動態內容
date: 2022-07-28 18:32:00
tag:
  - [MaterialUI]
  - [React]
---

## 總結

在重構的過程中收到來自前輩的建議，在這篇筆記記錄一下兩種 react custom hook 的設計方向
需要 custom hook 完成的事情：根據條件回傳對應的元件，比如根據當下的路由替換網站 NavBar 的選單內容

原始碼：[https://github.com/tzynwang/react-content-hooks](https://github.com/tzynwang/react-content-hooks)
展示頁：[https://tzynwang.github.io/react-content-hooks/](https://tzynwang.github.io/react-content-hooks/)

## 筆記

### 作法一：將邏輯全部納入 hook 中

<script src="https://gist.github.com/tzynwang/e6cde22debcde3029e2b00382cbdbeb0.js"></script>

- 直接在需要動態內容的元件中呼叫該 hook 即可，所有的邏輯都在 hook 內處理；外層元件不進行干涉，只取用 hook 回傳的結果
- 在「只有一個關連性需要考慮」的時候，較適合使用此類設計方向
  - 舉例：如果一個網站的 NavBar 內容根據（且僅需根據）路由來產生動態變化，則可將路由作為唯一會影響動態內容的條件來實作此 hook ，參考上述程式碼第 80 行唯一的 dependency 內容
- 優點：在邏輯需要修改時，針對 hook 內容進行調整即可，不需要在修改後回頭更新引用 hook 的元件
- 缺點：在條件開始變複雜（有兩組以上的關聯性資料會影響產出）後，hook 的內容會逐漸肥大，維護與除錯難度會上升
  - 舉例：網站的 NavBar 不但在不同的路由間需呈現不同內容，且還須考慮使用者是否已經登入該網站；前述的規格中有**兩個**條件會影響 NavBar 的內容，而判斷最後產出內容的程式碼就會開始增長

### 作法二：透過參數控制 hook 回傳的內容

<script src="https://gist.github.com/tzynwang/1164af23cad63fa41e46fccf9e635ab4.js"></script>

- 呼叫 hook 時需要提供參數來影響最終內容，並產物在呼叫該 hook 的元件內可能也須搭配其他條件來計算最後是否要渲染在畫面上
  - 參考 [@Components/Common/Category](https://github.com/tzynwang/react-content-hooks/blob/master/src/components/Common/Category/index.tsx#L44) 第 44 與 45 行，透過 hook 取得按鈕元件後，再根據使用者是否登入、是否為 premium 會員來決定畫面上究竟需要渲染哪些按鈕
- 優點：因部分條件透過外部傳入的關係，讓 hook 本身的程式碼相對簡短
- 缺點：需注意在修改 hook 內容後，現行呼叫該 hook 的元件其傳入的參數是否還可沿用，或者需要調整

### bonus track: MaterialUI styled component with TypeScript

記錄一下 styled component 型別的來源，以及在根據 MUI 元件建立 styled component 時，自定義的型別要如何傳入 `styled` 中

<script src="https://gist.github.com/tzynwang/7946d03c812ea011d08359282d41abd3.js"></script>

- 從 `@emotion/styled` 取得 type `StyledComponent`
- 從 `@mui/system` 取得 type `MUIStyledCommonProps`
- 從 `@mui/material/styles` 取得 type `Theme`
- 從 `react` 取得 type `DetailedHTMLProps` 與 `HTMLAttributes`
- 在需要傳入自定義 `props` 到 MUI 元件時：
  - types.d.ts 第 3 行：先匯入該元件的 props types
  - types.d.ts 第 7 行：再 extends 一個自定義型別
  - index.tsx 第 26 行：將自定義的 `ButtonProps` 傳入 `StyledComponent`

## 參考文件

- hook 設計方向：來自前輩同事的建議
- type `StyledComponent`: [emotion/packages/styled/types/base.d.ts](https://github.com/emotion-js/emotion/blob/main/packages/styled/types/base.d.ts)
