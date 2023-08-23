---
layout: '@Components/pages/SinglePostLayout.astro'
title: MUI Box Style override
date: 2022-03-06 11:43:22
tag:
  - [MaterialUI]
---

## 總結

`.MuiBox` 無法直接透過 `styleOverrides` 來調整外觀樣式，需搭配 `.MuiScopedCssBaseline` 與 `ScopedCssBaseline` 元件來實現外觀客製化

## 版本與環境

```
@mui/material: 5.4.4
```

## 筆記

- 查看 `/@mui/material/styles/createTheme.d.ts` 與 `/@mui/material/styles/components.d.ts` 會發現 MuiBox 並不存在於型別定義檔案中，即使在 `createTheme()` 傳入 MuiBox 的樣式設定，也不會有任何效果
- 替代方案：將 MuiBox 的樣式設定包覆於 MuiScopedCssBaseline 之下，即可覆寫 MuiBox 的預設外觀

## 展示

<iframe src="https://codesandbox.io/embed/young-framework-22bjw1?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="young-framework-22bjw1"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

<script src="https://gist.github.com/tzynwang/402745e383a3d84b77ca1b88fc4ed224.js"></script>

## 參考文件

- [[Box] No MuiBox property defined in ThemeOptions.overrides (typescript)](https://github.com/mui/material-ui/issues/25759)
- [MUI: CSS Baseline](https://mui.com/components/css-baseline/)
