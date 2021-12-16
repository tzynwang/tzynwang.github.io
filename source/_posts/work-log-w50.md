---
title: 2021 第50週 學習記錄
date: 2021-12-14 22:46:37
categories:
  - [React]
  - [MaterialUI]
tags:
---

## 總結

TBD

## 筆記

### 換頁時維持勾選狀態

- 將已經勾選起來的項目的 id 儲存為 useState 資料：`const [checkedItem, setCheckedItem] = useState<string[]>([]);`
- 將 `checkedItem` 作為 `props` 傳入 `TablePagination` 元件，比對 `sourceList` 陣列中的項目其 `id` 是否存在 `checkedItem` 中，若有，則 `CheckBox` 設定為打勾狀態
- 如此即可在換頁時維持項目的勾選狀態，因為換頁時更換的是 `sourceList` 資料，不影響 `checkedItem` 的內容，只要檢查 `sourceList` 中的項目是否存在 `checkedItem` 即可知道該項目是否已經被勾選過

### 調整 MuiCheckBox 框線粗細

- 實際上 `MuiCheckBox` 預設在未勾選、勾選狀態下會分別顯示 `<CheckBoxOutlineBlankIcon />` 與 `<CheckBoxIcon />` 這兩種外觀，未勾選狀態下的「框線粗細」實際上是中間透明的 svg 正方形圖案，無法透過 css 直接調整
- 可透過修改 `MuiCheckBox` 的 `icon` 與 `checkedIcon` 來調整未勾選、勾選狀態下的外觀，或乾脆直接客製化整個元件

### MuiTabs 動態顯示對應內容

```JSX
const [tabsValue, setTabsValue] = useState(0);
const handleTabsChange = (e, newValue) => {
  setTabsValue(newValue);
};

const dynamicContent = useMemo(() => {
  /* 在 (tabs) value 變化時回傳不同的顯示內容  */
}, [tabsValue]);

<Tabs value={tabsValue} onChange={handleChange} aria-label="basic tabs example">
  <Tab label="一隻狐" />
  <Tab label="兩隻狐" />
  <Tab label="三隻狐" />
</Tabs>
<div> {/* 然後這邊要根據使用者點擊不同的 MuiTab 來渲染不同內容，比如 dynamicContent.map(content => {...}) */} </div>
```

- 邏輯如上，在 MuiTabs `onChange` 時修改其 `value`（`tabsValue`），再透過 `useMemo()` 訂閱 `tabsValue` 來動態產生對應使用者點選不同 tab 時應該顯示的內容

### React.useEffect with condition

> Think of `setState()` as a request rather than an immediate command to update the component. For better perceived performance, React may delay it, and then update several components in a single pass. **React does not guarantee that the state changes are applied immediately.** `setState()` does not always immediately update the component. It may batch or defer the update until later.

- 重點：`setState()` 並不是 synchronous function， 執行完 `setState()` 並不保證該 `state` 的值立刻就會更新為最新的狀態
- 如果需要在某個 `state` 更新後去執行其他操作（例：根據使用者勾選的資料類別，向後端請求「只有該類別」的資料），可以透過 `useEffect()` 去訂閱該 `state`
- `useEffect()` 接受傳入第二組參數（以下示範的 `[props.source]`），作為第一個參數傳入的 function 會在「第二個陣列參數中的資料（被訂閱的資料）改變後」才執行
  ```js
  useEffect(() => {
    const subscription = props.source.subscribe()
    return () => {
      subscription.unsubscribe()
    }
  }, [props.source])
  ```
- 解說：僅有在 `props.source` 改變時，才執行 `useEffect()` 中作為第一個參數傳入的 function

## 參考文件

- [MuiCheckBox API](https://mui.com/api/checkbox/#main-content)
- [MuiCheckBox: Customization](https://mui.com/components/checkboxes/#customization)
- [React: setState()](https://reactjs.org/docs/react-component.html#setstate)
- [React: Conditionally firing an effect](https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect)
