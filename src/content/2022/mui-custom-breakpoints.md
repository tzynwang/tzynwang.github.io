---
title: 2022 第52週 實作筆記：於 MaterialUI theme 新增 custom breakpoints
date: 2022-12-30 21:01:05
tag:
  - [MaterialUI]
---

## 總結

記錄一下 Mui theme custom breakpoints 搭配 TypeScript 專案的處理方式。

- [custom breakpoints demo](https://tzynwang.github.io/mui-custom-breakpoints/)
- [repo](https://github.com/tzynwang/mui-custom-breakpoints/tree/main/src)

## 版本與環境

```
@mui/material: 5.11.2
```

## 筆記

### 實作方式

專案結構如下：

```
src
  App.tsx
  MainAppView.tsx
  theme.ts
  react-app-env.d.ts
```

重點：透過 `declare module` 對 `interface BreakpointOverrides` 傳入 custom breakpoints 設定。設定為 true 的鍵值即可在 mui theme 中使用，反之設定為 false 的鍵值會被忽略。

以下內容代表「不再使用 MUI 預設的 `xs/sm/md/lg/xl` 這五組 breakpoints，並新增 `mobile/tablet/laptop/desktop` 這四組 breakpoints」：

```ts
/// <reference types="react-scripts" />

import type { BreakpointOverrides } from "@mui/system/createTheme/createBreakpoints";

declare module "@mui/system/createTheme/createBreakpoints" {
  interface BreakpointOverrides {
    xs: false;
    sm: false;
    md: false;
    lg: false;
    xl: false;
    mobile: true;
    tablet: true;
    laptop: true;
    desktop: true;
  }
}
```

```ts
/* theme.ts */
import { useTheme } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import type { Theme } from "@mui/material/styles";

const theme = createTheme({
  breakpoints: {
    values: {
      mobile: 0,
      tablet: 640,
      laptop: 1024,
      desktop: 1200,
    },
  },
});

export { ThemeProvider, theme, useTheme, useMediaQuery, Theme };
```

定義好 `BreakpointOverrides` 後即可搭配 `useTheme` 或 `useMediaQuery` 使用：

```tsx
/* MainAppView.tsx */
import React, { memo } from "react";
import { useTheme, useMediaQuery, Theme } from "./theme";

function MainAppView(): React.ReactElement {
  /* States */
  const theme = useTheme();
  const upMobile = useMediaQuery(theme.breakpoints.up("mobile"));
  const upTablet = useMediaQuery(theme.breakpoints.up("tablet"));
  const upLapTop = useMediaQuery(theme.breakpoints.up("laptop"));
  const upDesktop = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up("desktop"),
  );

  /* Main */
  return (
    <ul>
      <li>
        {theme.breakpoints.up("mobile")}
        {`theme.breakpoints.up('mobile'): ${upMobile}`}
      </li>
      <li>
        {theme.breakpoints.up("tablet")}
        {`theme.breakpoints.up('tablet'): ${upTablet}`}
      </li>
      <li>
        {theme.breakpoints.up("laptop")}
        {`theme.breakpoints.up('laptop'): ${upLapTop}`}
      </li>
      <li>
        {theme.breakpoints.up("desktop")}
        {`theme.breakpoints.up('desktop'): ${upDesktop}`}
      </li>
    </ul>
  );
}

export default memo(MainAppView);
```

```tsx
/* App.tsx */
import React, { memo } from "react";
import MainAppView from "./MainAppView";
import { ThemeProvider, theme } from "./theme";

function App(): React.ReactElement {
  /* Main */
  return (
    <ThemeProvider theme={theme}>
      <MainAppView />
    </ThemeProvider>
  );
}

export default memo(App);
```

### 原始碼部分

首先從 `@mui/material/styles/createTheme.d.ts` 可以找到傳入 `createTheme` 的參數 options 其型別定義為 `ThemeOptions`：

```ts
export default function createTheme(
  options?: ThemeOptions,
  ...args: object[]
): Theme;
```

而同一份檔案往上翻，發現 interface `ThemeOptions` 是延伸自 `Omit<SystemThemeOptions, 'zIndex'> { ... }`：

```ts
import { ThemeOptions as SystemThemeOptions } from "@mui/system";

// 中間略

export interface ThemeOptions extends Omit<SystemThemeOptions, "zIndex"> {
  mixins?: MixinsOptions;
  components?: Components<Omit<Theme, "components">>;
  palette?: PaletteOptions;
  shadows?: Shadows;
  transitions?: TransitionsOptions;
  typography?: TypographyOptions | ((palette: Palette) => TypographyOptions);
  zIndex?: ZIndexOptions;
  unstable_strictMode?: boolean;
  unstable_sxConfig?: SxConfig;
}
```

再追蹤下去，可以在 `@mui/system/createTheme/createTheme/createTheme.d.ts` 找到 `ThemeOptions`，而 breakpoints 的型別定義為 `BreakpointsOptions`：

```ts
export interface ThemeOptions {
  shape?: ShapeOptions;
  breakpoints?: BreakpointsOptions;
  direction?: Direction;
  mixins?: unknown;
  palette?: Record<string, any>;
  shadows?: unknown;
  spacing?: SpacingOptions;
  transitions?: unknown;
  components?: Record<string, any>;
  typography?: unknown;
  zIndex?: Record<string, number>;
  unstable_sxConfig?: SxConfig;
}
```

打開 `@mui/system/createTheme/createTheme/createBreakpoints.d.ts`，發現 `BreakpointsOptions` 延伸自 `Partial<Breakpoints>`：

```ts
interface BreakpointsOptions extends Partial<Breakpoints> { ... }

export interface Breakpoints {
  keys: Breakpoint[];
  // 中間略
}
```

同一份檔案往上捲一下，會看到 `Breakpoints` 中的 `keys: Breakpoint[]` 的本體為 `OverridableStringUnion<'xs' | 'sm' | 'md' | 'lg' | 'xl', BreakpointOverrides>`：

```ts
export interface BreakpointOverrides {}

export type Breakpoint = OverridableStringUnion<
  "xs" | "sm" | "md" | "lg" | "xl",
  BreakpointOverrides
>;
```

最後來到檔案 `@mui/types/index.d.ts`，說明如下：

```ts
/**
 * Generate a set of string literal types with the given default record `T` and
 * override record `U`.
 *
 * If the property value was `true`, the property key will be added to the
 * string union.
 *
 * @internal
 */
export type OverridableStringUnion<
  T extends string | number,
  U = {},
> = GenerateStringUnion<Overwrite<Record<T, true>, U>>;
```

在執行 `declare module '@mui/system/createTheme/createBreakpoints' interface BreakpointOverrides` 時，設定為 `true` 的鍵值會被納入定義，之後在使用 custom breakpoints 時，TypeScript complier 便不會再報錯。

## 參考文件

- [MUI: Custom breakpoints](https://mui.com/material-ui/customization/breakpoints/#custom-breakpoints)
- [stackOverFlow: Adding custom breakpoints to material ui with typescript](https://stackoverflow.com/questions/61925965/adding-custom-breakpoints-to-material-ui-with-typescript)
