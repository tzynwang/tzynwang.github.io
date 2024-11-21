---
title: 透過 useAutocomplete 來處理 Material UI 5 Autocomplete 的樣式客製化需求
date: 2024-04-14 19:47:35
tag:
	- [MaterialUI]
banner: /2024/mui-use-autocomplete/torbjorn-helgesen-C4FbCe4L_pw-unsplash.jpg
summary: 如題，記錄一下如何對 MUI 5 的 Autocomplete 進行完全的樣式客製化。
draft: 
---

## 版本與環境

```bash
@mui/material: 5.15.15
```

## 使用方式

重點：過去當作 props 傳給 `Autocomplete` 元件的內容，改為 args 傳給 `useAutocomplete()`。以前的寫法是：

```tsx
const [value, setValue] = useState<string | null>(options[0]);

<Autocomplete
  value={value}
  onChange={(_, newValue: string | null) => {
    setValue(newValue);
}}
  options={options}
/>
```

改為：

```tsx
const [input, setInput] = useState(types[0]);

const {
  getRootProps,
  getInputLabelProps,
  getInputProps,
  getListboxProps,
  getOptionProps,
  groupedOptions,
} = useAutocomplete({
  getOptionLabel: (option) => option,
  onChange: (_: React.SyntheticEvent, value) => {
    if (value) setInput(value);
  },
  id,
  value: input,
  options: types,
});

const rootProps = getRootProps();
const inputLabelProps = getInputLabelProps();
const inputProps = getInputProps();
const listBoxProps = getListboxProps();

<section>
  <div {...rootProps}>
    <label {...inputLabelProps} className="label">
      UseAutocomplete
    </label>
    <input {...inputProps} className="input" />
  </div>
  {groupedOptions.length > 0 ? (
    <ul {...listBoxProps} className="listBox">
      {(groupedOptions as typeof types).map((option, index) => (
        <li {...getOptionProps({ option, index })} className="list">
          {option}
        </li>
      ))}
    </ul>
  ) : null}
</section>
```

完整的[程式碼](https://stackblitz.com/edit/react-d3vwze?file=UseAutocomplete.tsx)放這裡。

---

`useAutocomplete` 的優點：

- 完全控制 `Autocomplete` 的 HTML 元素與結構
- 最大的樣式自由度，不用擔心 MUI 先貼了什麼樣式到元件上

缺點是要從 `useAutocomplete` 回傳的 cbs 產生各層級（`root` / `inputLabel` / `input` / `listBox` / `option`）的 props 並依序傳入。程式碼讀起來確實很冗長，但個人認為瑕不掩瑜。

## 那麼 props.renderInput 呢？

心得：雞肋（使用方式可參考[官方文件](https://mui.com/material-ui/react-autocomplete/#custom-input)）。

雖然可以靠 `props.renderInput` 自定義輸入框的元素與樣式，但需要回頭靠 `props.classes` 慢慢覆蓋掉 MUI 預設的 `paper` `listbox` 與 `option` 樣式（參考[官方複雜樣式範例](https://mui.com/material-ui/react-autocomplete/#githubs-picker)）。

在需要大量樣式客製化的前提下，處理起來沒有比用 `useAutocomplete` 輕鬆。

## 參考文件

- [Material UI: useAutocomplete](https://mui.com/material-ui/react-autocomplete/#useautocomplete)
