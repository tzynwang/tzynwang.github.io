---
layout: '@Components/pages/SinglePostLayout.astro'
title: 使用 CssVarsProvider 來取得 MaterialUI 樣式的 CSS 變數
date: 2023-02-05 13:51:29
tag:
  - [MaterialUI]
---

## 總結

在一些情況下可能會選擇透過透過 CSS 變數 `var()` 來指定樣式，而 MaterialUI 的 `CssVarsProvider` 元件可讓開發者取得 CSS 變數版本的 MaterialUI 樣式設定（[theme object](https://mui.com/material-ui/customization/default-theme/)），且可搭配 `useColorScheme` 來指定取得 light 或 dark 模式的樣式。

## 版本與環境

```
@mui/material: 5.11.7
```

## 筆記

### 情境範例

比如我想直接借用 MaterialUI 預設的 dark mode 色票，且想透過 CSS Module 集中管理樣式資訊，此時即可直接透過 `var()` 將 MaterialUI 設定好的顏色變數傳入 `index.module.css` 中：

<iframe src="https://codesandbox.io/embed/mui-cssvarsprovider-xkr9h8?fontsize=14&hidenavigation=1&module=%2Fsrc%2Findex.module.css&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="mui-CssVarsProvider"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

### CssVarsProvider

透過 `import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';` 來匯入 `CssVarsProvider` 元件，使用方式基本如下：

```tsx
import * as React from 'react';
import { render } from 'react-dom';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ToggleButton from './ToggleButton';
import scopedStyle from './index.module.css';
import './styles.css';

function App() {
  /* Main */
  return (
    <CssVarsProvider>
      <CssBaseline />
      <div className="App">
        <ToggleButton />
        <ul>
          <li className={scopedStyle.muiPrimaryMain}>
            --mui-palette-primary-main
          </li>
          <li className={scopedStyle.muiSecondaryMain}>
            --mui-palette-secondary-main
          </li>
          <li className={scopedStyle.muiErrorMain}>--mui-palette-error-main</li>
          <li className={scopedStyle.muiWarningMain}>
            --mui-palette-warning-main
          </li>
          <li className={scopedStyle.muiInfoMain}>--mui-palette-info-main</li>
          <li className={scopedStyle.muiSuccessMain}>
            --mui-palette-success-main
          </li>
        </ul>
      </div>
    </CssVarsProvider>
  );
}

const rootElement = document.getElementById('root');
render(<App />, rootElement);
```

`CssVarsProvider` 會把 MaterialUI 的樣式設定透過 css 變數的形式注入到 React app 中，預設的樣式選取器是 `:root`，可以透過 `props.colorSchemeSelector` 來執行客製。下方範例即是將 CSS 變數群注入到 `#root` 選取器之下：

```tsx
<CssVarsProvider colorSchemeSelector="#root">{/* 略 */}</CssVarsProvider>
```

如果想要預設載入 dark mode 的 MaterialUI 樣式，可透過 `props.defaultMode` 來設定：

```tsx
<CssVarsProvider defaultMode="dark">{/* 略 */}</CssVarsProvider>
```

其他可使用的元件 `props` 可參考 `/material-ui/packages/mui-system/src/cssVars/createCssVarsProvider.d.ts`。

注意事項：使用 `CssVarsProvider` 的話，就不需要再為 app 加上 `import { ThemeProvider } from '@mui/material/styles';` 了。從原始碼的最終回傳結果可看到 `ThemeProvider` 是一起被打包丟出來的，不需要再手動引用。

```tsx
// 套件檔案路徑: /material-ui/packages/mui-system/src/cssVars/createCssVarsProvider.js
// 部分內容略，僅貼出回傳相關段落
const element = (
  <React.Fragment>
    {shouldGenerateStyleSheet && (
      <React.Fragment>
        <GlobalStyles styles={{ [colorSchemeSelector]: rootCss }} />
        <GlobalStyles styles={defaultColorSchemeStyleSheet} />
        <GlobalStyles styles={otherColorSchemesStyleSheet} />
      </React.Fragment>
    )}
    <ThemeProvider theme={resolveTheme ? resolveTheme(theme) : theme}>
      {children}
    </ThemeProvider>
  </React.Fragment>
);

if (nested) {
  return element;
}

return (
  <ColorSchemeContext.Provider value={contextValue}>
    {element}
  </ColorSchemeContext.Provider>
);
```

### useColorScheme

搭配 `import { useColorScheme } from '@mui/material/styles';` 即可取得當下的 MaterialUI mode 資訊。也可透過 `setMode` 直接更新 mode 設定：

```tsx
import React from 'react';
import { useColorScheme } from '@mui/material/styles';
import Button from '@mui/material/Button';

function ToggleButton() {
  const { mode, setMode } = useColorScheme();

  const updateMuiMode = () => {
    if (mode === 'light') {
      setMode('dark');
    } else {
      setMode('light');
    }
  };

  return (
    <Button onClick={updateMuiMode} variant="contained" disableElevation>
      current mode: {mode}
    </Button>
  );
}

export default ToggleButton;
```

而所有的 MaterialUI CSS 變數內容都可以透過瀏覽器的開發者工具來查詢：

![view mui var in dev tool](/2023/mui-CssVarsProvider/mui-cssVarsProvider-var-list.png)

## 參考文件

- [MaterialUI: Experimental API - css variables](https://mui.com/material-ui/experimental-api/css-variables/)
