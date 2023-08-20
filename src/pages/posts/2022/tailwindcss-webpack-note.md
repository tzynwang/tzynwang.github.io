---
layout: '@Components/SinglePostLayout.astro'
title: tailwindcss 與 typescript 快速試用筆記
date: 2022-05-24 19:48:53
tag:
  - [CSS]
---

## 總結

試玩心得：typescript 支援似乎不太全面，[issue #1077: Configuration file type definitions](https://github.com/tailwindlabs/tailwindcss/discussions/1077#discussioncomment-528222) 的解法沒有用，試玩時先改用自行定義的型別；但在目前商業專案固定使用 typescript 的情境下，使用 tailwindcss 的吸引力變低 🤔

但如果只是個人專案，搭配 [daisyui 與其 theme](https://daisyui.com/docs/themes/) 則是讓視覺效果變的妙不可言

## 版本與環境

```
tailwindcss: 3.0.24
webpack: 5.72.1
```

## 筆記

### 與 typescript 的搭配

<script src="https://gist.github.com/tzynwang/f6c0d91573d09f116bcca00bfebf7c5f.js"></script>

- 透過 IDE 檢查上述 `tailwindcss.App.tsx` 第 9 行中的 `theme.colors` 的型別會得到 `(property) TailwindTheme.colors?: TailwindThemeColors | undefined`
- 查看 `tailwind-config.d.ts` 會得知：
  - `export type TailwindThemeColors = TailwindThemeGetter<TailwindValuesColor>;`
  - 而 `TailwindValuesColor` 定義如下：
  ```ts
  interface TailwindValuesColor {
    readonly [key: string]: TailwindColorValue;
  }
  ```
- 為了想要在 IDE 開發時可以透過型別進行 auto-complete 故先補上自定義型別 `type Colors`（檔案 `tailwindcss.types.d.ts`），全部的顏色 keys 參考 [tailwindcss: customization/colors (v3)](https://tailwindcss.com/docs/customizing-colors)

### webpack.config

- 需注意 `module.rules` 中針對 `.css` 檔案的處理需帶入以下內容：
  ```js
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'postcss-loader',
        ],
      },
    ],
  },
  ```
- 透過 `create-react-app` 建立的專案不需擔心此問題（設定已經被 cra 處理掉），但如果是在沒有使用 `cra` 建立 React APP 的情況下需補上此規則才能正常使用 tailwindcss

## 參考文件

- [daisyui: webpack sample code](https://stackblitz.com/edit/daisyui-react-webpack?file=webpack.config.js)
