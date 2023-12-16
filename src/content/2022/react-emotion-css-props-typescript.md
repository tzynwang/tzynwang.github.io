---
title: 2022 第35週 實作筆記：為 typescript react 專案設定 @emotion/react 的 css props
date: 2022-09-01 22:21:40
tag:
  - [CSS]
  - [React]
  - [TypeScript]
---

## 總結

在透過 create-react-app 建立的 typescript react 專案中，使用 `@emotion/react` 時遇到兩個問題：

1. 試圖在元件上套用 props `css` 設定樣式時，ts 報錯：Property 'css' does not exist...（下略）
2. 透過 `localhost:3000` 測試專案時，元件的 class 出現的樣式是 `[object, object]` 而非編譯好的 class name

此篇筆記記錄一下如何解決這些狀況

![筆記本體很短，所以用 @emotion/react 的 css props 做了可愛步驟頁（？）](/2022/react-emotion-css-props-typescript/steps.png)

## 版本與環境

```
@emotion/babel-preset-css-prop: 11.10.0
@emotion/react: 11.10.4
create-react-app: 5.0.1
react: 18.2.0
typescript: 4.8.2
```

## 解決方法

### TS 錯誤訊息

在專案的 tsconfig.json 加上以下設定，有使用到 props `css` 的元件檔案不再需要手動將 `/** @jsxImportSource @emotion/react */` 放到檔案最上方：

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@emotion/react"
  }
}
```

### 元件樣式名稱錯誤

1. 先對專案執行 `npm run eject` 注入 `create-react-app` 封裝起來的設定
2. 執行 `npm i @emotion/babel-preset-css-prop` 安裝此套件
3. 打開 config/webpack.config.js 檔案，移動到 Babel 加工 `/\.(js|mjs|jsx|ts|tsx)$/` 類型檔案的段落，將 `@emotion/babel-preset-css-prop` 加到 `presets` 中

```js
// 以 create-react-app 5 來說，以下這段內容落在 410 到 425 之間
// 此段的註解說明是 'Process application JS with Babel.'

{
  test: /\.(js|mjs|jsx|ts|tsx)$/,
  include: paths.appSrc,
  options: {
    presets: [
      require.resolve('@emotion/babel-preset-css-prop'), // 加上這行
      [
        require.resolve('babel-preset-react-app'),
        {
          runtime: hasJsxRuntime ? 'automatic' : 'classic',
        },
      ],
    ],
  },
},
```

1. 完成，重啟專案就能看到樣式有被正確地套用了

## 參考文件

- [TS2322: Property 'css' does not exist...](https://github.com/emotion-js/emotion/issues/1249)
- [css prop returns [object, object]](https://github.com/emotion-js/emotion/issues/1122)
- [開版步驟頁連結](https://tzynwang.github.io/emotion-react-props-css-typescript/)
