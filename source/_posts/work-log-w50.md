---
title: 2021 第50週 學習記錄
date: 2021-12-14 22:46:37
categories:
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


## 參考文件
- [MuiCheckBox API](https://mui.com/api/checkbox/#main-content)
- [MuiCheckBox: Customization](https://mui.com/components/checkboxes/#customization)