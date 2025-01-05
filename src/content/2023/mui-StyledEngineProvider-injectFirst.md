---
title: 在 MUI 5 中讓自定義的 CSS 樣式擁有較高的權重
date: 2023-01-26 20:37:22
tag:
- [MaterialUI]
---

## 總結

簡單來說就是透過元件 `StyledEngineProvider` 搭配 `injectFirst` 來讓 MUI 的樣式先被注入，接著才是引入使用者自定義的 CSS 內容。如此一來可以不用把所有需要追加到 MUI 元件的樣式都放到 `styleOverrides` 中來處理、也可避免在自訂樣式中透過 `!important` 來覆蓋掉 MUI 的設定。

## 版本與環境

```
@mui/material: ^5.0.0
```

## 筆記

### 使用實例

使用方式如下：

<iframe src="https://codesandbox.io/embed/mui-styledengineprovider-injectfirst-lq5091?autoresize=1&fontsize=14&hidenavigation=1&module=%2Fdemo.tsx&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="mui-StyledEngineProvider-injectFirst"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

打開 DevTool 可看到 MUI 的樣式被提前到 head 第一順位，下方才接著是使用者自訂的 CSS 內容：

![inject first](/2023/mui-StyledEngineProvider-injectFirst/injectFirst.png)

而以下是沒有使用 `injectFirst` 的情況，可以看到使用者自定義的 h1 樣式被 MUI 的設定覆蓋掉：

<iframe src="https://codesandbox.io/embed/mui-styledengineprovider-injectfirst-forked-ro4zt9?fontsize=14&hidenavigation=1&module=%2Fdemo.tsx&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="mui-StyledEngineProvider-injectFirst (forked)"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

沒有搭配 `injectFirst` 時會讓 MUI 的設定壓軸引入，樣式權重會比使用者定義的 CSS 來得高：

![without inject first](/2023/mui-StyledEngineProvider-injectFirst/no-injectFirst.png)

### 原始碼部分

追蹤 `import { StyledEngineProvider } from "@mui/material/styles";` 會發現 `StyledEngineProvider` 的本體位在 `material-ui/packages/mui-styled-engine/src/StyledEngineProvider/StyledEngineProvider.js` 中（[repo 連結在此](https://github.com/mui/material-ui/blob/master/packages/mui-styled-engine/src/StyledEngineProvider/StyledEngineProvider.js)），而檔案中的註解也有說明：當使用者傳入 `props.injectFirst = true` 時，會讓樣式被移動到 `<head>` 的最上方。

```ts
import * as React from 'react';
import PropTypes from 'prop-types';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

// prepend: true moves MUI styles to the top of the <head> so they're loaded first.
// It allows developers to easily override MUI styles with other styling solutions, like CSS modules.
const cache = createCache({ key: 'css', prepend: true });

export default function StyledEngineProvider(props) {
  const { injectFirst, children } = props;
  return injectFirst ? (
    <CacheProvider value={cache}>{children}</CacheProvider>
  ) : (
    children
  );
}

StyledEngineProvider.propTypes = {
  /**
   * Your component tree.
   */
  children: PropTypes.node,
  /**
   * By default, the styles are injected last in the <head> element of the page.
   * As a result, they gain more specificity than any other style sheet.
   * If you want to override MUI's styles, set this prop.
   */
  injectFirst: PropTypes.bool,
};
```

查詢 `@emotion/cache` `createCache` 的[官方文件](https://emotion.sh/docs/@emotion/cache)也可看到 `prepend` 的功能：

> prepend: A `boolean` representing whether to prepend rather than append style tags into the specified container DOM node.

結論：使用 `StyledEngineProvider` 搭配 `injectFirst` 可確保使用者自訂的樣式獲得較高的權重。

## 參考文件

- [MUI: CSS injection order](https://mui.com/material-ui/guides/interoperability/#css-injection-order)
- [stackOverFlow: material ui 'new' v5.0.0 injectFirst fails to set specificity](https://stackoverflow.com/questions/69217739/material-ui-new-v5-0-0-injectfirst-fails-to-set-specificity)
