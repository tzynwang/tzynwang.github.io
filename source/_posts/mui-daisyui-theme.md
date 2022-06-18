---
title: 2022 第21週 實作筆記： MaterialUI theme 一鍵換皮
date: 2022-05-29 10:55:09
categories:
- [MaterialUI]
- [React]
tags:
---

## 總結
使用 React Context 來達成一鍵切換主題的效果

{% figure figure--center 2022/mui-daisyui-theme/demo.png %}

展示：https://tzynwang.github.io/mui-daisy-theme-demo-20220529/
原始碼：https://github.com/tzynwang/mui-components/tree/demo/20220529
色票組合：使用 [daisyUI: Colors](https://daisyui.com/docs/colors/) 中的 `coffee` 、 `cupcake` 與 `retro`

## 版本與環境
```
@mui/material: 5.8.1
@mui/styles: 5.8.0
daisyui: 2.15.1
```

## 筆記
### React.createContext
- 透過 `React.createContext` 建立 `ThemeContext` 物件，並 `value={{ themeName, setThemeName }}`
- 在元件 `ThemeToggle` 中透過 `React.useContext(ThemeContext)` 取得 `context` 物件，即可在使用者選擇不同主題時更新 `ThemeKey`

### @Models/Theme
- 在建立 Theme 物件（ `new Theme()` ）時，根據 `THEME_KEYS` 載入對應的主題設定檔，並透過 MaterialUI 的 `createTheme` 建立 `MuiTheme` 物件

### @Components/App
- 使用 useEffect 監聽目前的 `themeName` ，並透過 `Theme.getTheme(themeName)` 取得對應的 `MuiTheme` 物件提供給 MaterialUI 的 `ThemeProvider`

## 關於 deepMerge()
- 官方型別定義如右： `deepmerge<T>(target: T, source: unknown, options?: DeepmergeOptions): T`
- 原始碼如下，可得知 `source` 的樣式設定會覆蓋掉 `target` 的內容，最終回傳被覆蓋後的 `target` ：
  ```js
  function deepmerge(target, source, options = {
    clone: true
  }) {
    const output = options.clone ? (0, _extends2.default)({}, target) : target;

    if (isPlainObject(target) && isPlainObject(source)) {
      Object.keys(source).forEach(key => {
        // Avoid prototype pollution
        if (key === '__proto__') {
          return;
        }

        if (isPlainObject(source[key]) && key in target && isPlainObject(target[key])) {
          // Since `output` is a clone of `target` and we have narrowed `target` in this block we can cast to the same type.
          output[key] = deepmerge(target[key], source[key], options);
        } else {
          output[key] = source[key];
        }
      });
    }

    return output;
  }  
  ```

### 備註
- 自定義的 `MuiTheme` 需由開發者自行定義 `mode: light` 與 `mode: dark` 下的顏色樣式，切換自定義 MuiTheme 的 `palette.mode` 不會自動計算出對應的 `palette`
- 參考 [MaterialUI 官方文件說明](https://mui.com/material-ui/customization/dark-mode/#dark-mode-with-a-custom-palette)： If you have a custom palette, you need to make sure that you have the correct values based on the mode. The next section explain how to do this. 

## 參考文件
- [React Official: Context](https://reactjs.org/docs/context.html)
- [React Official: useContext](https://reactjs.org/docs/hooks-reference.html#usecontext)
- [MaterialUI: Dark Mode](https://mui.com/material-ui/customization/dark-mode/)
- [Typescript derive union type from tuple/array values](https://stackoverflow.com/questions/45251664/typescript-derive-union-type-from-tuple-array-values)
- [remove null or undefined from properties of a type](https://stackoverflow.com/questions/53050011/remove-null-or-undefined-from-properties-of-a-type)