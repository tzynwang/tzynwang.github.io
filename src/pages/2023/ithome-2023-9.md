---
layout: '@Components/pages/SinglePostLayout.astro'
title: 捨棄 create-react-app 之餘還架了個 astro blog 昭告天下：webpack 5 與 css
date: 2023-09-24 10:15:57
tag:
  - [2023鐵人賽]
  - [Frontend Infrastructure]
  - [webpack]
banner: /2023/ithome-2023-9/aneta-voborilova-c8ovzYe3z0s-unsplash.jpg
summary: 除了一般的 .css 檔案，今天也會介紹如何設定 webpack 來支援 css modules
draft:
---

今天會來介紹平常慣用的 webpack 設定，除了處理一般的 .css 檔案外，也能支援 [css modules](https://css-tricks.com/css-modules-part-1-need/)。

使用 css modules 的好處是能夠將樣式限定在一個元件內。不需要煩惱樣式撞名、也比較容易處理 [css specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity) 的問題。不過，隨著 [@layer](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer) 開始被各大瀏覽器支援，css modules 或許有退休機會 🤔 ~~webpack 設定又能再少一段~~。

有點離題了，先來看看如何在 webpack 中搞定 css 吧 =͟͟͞͞( •̀д•́)

## 設定 webpack

### 處理一般 .css 檔案

安裝完 `style-loader` 與 `css-loader` 後，在 webpack 的 `module.rules` 陣列加上以下內容：

```ts
const webpackDevelopmentConfig: WebpackConfiguration = {
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        sideEffects: true,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
```

透過 `test: /\.css$/` 與 `exclude: /\.module\.css$/` 來抓取「所有檔案名稱包含 `.css` 但不包含 `.module.css` 的檔案」，並使用 `css-loader` 與 `style-loader` 來處理之。

是的，只是要在開發環境讀取 css 檔案的話，這樣就夠了。

### 處理 css modules

追加如下，基本上僅是補上 css-loader 的 modules 功能設定：

```ts
const webpackDevelopmentConfig: WebpackConfiguration = {
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        sideEffects: true,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.module\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'local',
                localIdentName: '[file]__[local]__[hash:6]',
              },
            },
          },
        ],
      },
    ],
  },
};
```

而因為個人習慣在開發時能夠明確看出 css class 名稱，所以會透過 `localIdentName` 來指定 module css 的組合方式。以上述設定來說，最終我會在開發環境看到以下 class name：

```html
<div class="src-component-Common-Greeting-index-module-css__container__eb90c2">
  hello world
</div>
```

`src-component-Common-Greeting-index-module-css` 即為該 module css 的檔案路徑。`container` 則是該 module css 檔案中的樣式名稱。最後的 `eb90c2` 則是 `localIdentName` 中 `hash:6` 的部分。

全部可用的 template string 可以參考 css-loader 文件中[關於 localIdentName 的段落](https://webpack.js.org/loaders/css-loader/#localidentname)。

---

恭喜，今天的 webpack 部分到此結束。

## 設定 src/env.d.ts

而為了避免 TypeScript 在你 import `*.module.css` 檔案時抱怨，請開啟 `./src/env.d.ts` 並填入以下內容：

```ts
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
```

翻譯成白話文是「從 `.module.css` 取出來的資料都會是 `{ readonly [key: string]: string }` 類型的檔案」。

比如下方範例，`moduleStyle` 的型別就是 `{ readonly [key: string]: string }`，而 `moduleStyle.container` 的型別會是字串：

```tsx
import React from 'react';
import moduleStyle from './index.module.css';

function Greeting() {
  return <div className={moduleStyle.container}>hello world</div>;
}

export default Greeting;
```

## 總結

沒錯，就是這麼簡單。只要兩個 loader 跟一點點設定，你的 React app 專案就能在開發環境支援 css 與 css modules (́◉◞౪◟◉‵)
