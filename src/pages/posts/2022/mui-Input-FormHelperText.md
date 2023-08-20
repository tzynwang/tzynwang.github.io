---
layout: '@Components/SinglePostLayout.astro'
title: 2022 第51週 實作筆記：視覺效果一致的 TextField 與 FormControl 拼裝版 Input
date: 2022-12-23 20:19:13
tag:
  - [JavaScript]
  - [MaterialUI]
---

## 總結

在將專案的 MaterialUI 版本從 4 升到 5 時，發現除了直接使用 `TextField` 以外，也可透過 `FormControl`、`Input` 與 `FormHelperText` 組合做出一致的視覺效果。

## 版本與環境

```
@mui/material: 5.11.0
```

## 筆記

### 元件部分

從 [mui/material-ui/TextField.js](https://github.com/mui/material-ui/blob/master/packages/mui-material/src/TextField/TextField.js) 可以觀察到 `TextField` 會根據傳入的 `props.variant` 來決定最後要使用 `Input`、`FilledInput` 或 `OutlinedInput` 元件：

```js
const variantComponent = {
  standard: Input,
  filled: FilledInput,
  outlined: OutlinedInput,
};
```

而原始碼下方的 `return` 部位也可觀察到 `TextField` 是根據 `helperText` 的有無來判定是否要顯示 `FormHelperText` 元件：

```js
{
  helperText && (
    <FormHelperText id={helperTextId} {...FormHelperTextProps}>
      {helperText}
    </FormHelperText>
  );
}
```

單純以視覺效果來說，以下兩者可以做出一致效果，但須注意 `FormControl` 拼裝版需自行設定 `id`、`htmlFor` 與 `aria-describedby`：

<iframe src="https://codesandbox.io/embed/mui-textfield-input-formcontrol-hpbhqh?fontsize=14&hidenavigation=1&module=%2Fdemo.tsx&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="mui-TextField-Input-FormControl"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

## JavaScript syntax

在原始碼中發現還有以下寫法，解構賦值的同時使用冒號來將值賦予新的變數：

```js
const {
  // ...
  id: idOverride,
  // ...
} = props;
```

白話文：將 `props.id` 的值賦予到本地變數 `idOverride` 中。

> MDN: A property can be unpacked from an object and assigned to a variable with a different name than the object property.

```js
const o = { p: 42, q: true };
const { p: foo, q: bar } = o;

console.log(foo); // 42
console.log(bar); // true
```

> MDN: Here, for example, const `{ p: foo } = o` takes from the object `o` the property named `p` and assigns it to a local variable named `foo`.

## 參考文件

- [mui/material-ui/TextField.js](https://github.com/mui/material-ui/blob/master/packages/mui-material/src/TextField/TextField.js)
- [MUI: Text Field](https://mui.com/material-ui/react-text-field/)
- [MDN: Object destructuring -- Assigning to new variable names](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#assigning_to_new_variable_names)
- [stackOverFlow: Use of Colon in object assignment destructuring Javascript](https://stackoverflow.com/questions/51959013/use-of-colon-in-object-assignment-destructuring-javascript)
