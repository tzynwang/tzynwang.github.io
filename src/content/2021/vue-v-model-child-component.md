---
title: 「Vue：在子代元件實作雙向資料綁定」相關筆記
date: 2021-10-25 12:20:09
tag:
  - [Vue]
---

## 原始問題

如何在自訂的 vue component 中做出 v-model 的功能？

## 回答

參考 vue 的官方文件，`v-model`其實就是`v-bind`加上`v-on`的語法糖，故在一個自訂元件上做出 v-model（雙向資料綁定）的效果就等同「使用 props 將資料從親代傳入自訂元件，並從元件透過 emit 將資料變動傳送回親代」

展示：[https://tzynwang.github.io/v-model-child-component-demo-HIGGS/](https://tzynwang.github.io/v-model-child-component-demo-HIGGS/)
REPO：[https://github.com/tzynwang/v-model-child-component-demo-HIGGS#vue-child-component-two-way-data-binding-demo](https://github.com/tzynwang/v-model-child-component-demo-HIGGS#vue-child-component-two-way-data-binding-demo)

## 版本與環境

```
vue: 2.6.11
```

## 筆記

<script src="https://gist.github.com/tzynwang/24f924ee7295f6c08f7b47a0759d0576.js"></script>

- 實作思路：
  - 子代元件`inputComponent.vue`從親代接收資料`componentValue`
  - 在子代發生 input 事件時（`@input`）便呼叫方法`emitValue`，將使用者輸入的內容 emit 上親代，事件名稱為`child-input-value-change`
  - 親代在`child-input-value-change`發生時，呼叫`childInputValueChange`修改`componentValue`的值
  - 資料變動，驅動畫面重新渲染

## 參考文件

- [Vue.js: Customizing Component v-model](https://vuejs.org/v2/guide/components-custom-events.html#Customizing-Component-v-model)
- [v-model for child component and v-model inside child component Vue](https://stackoverflow.com/questions/52249365/v-model-for-child-component-and-v-model-inside-child-component-vue/)
- [v-model and child components?](https://stackoverflow.com/questions/47311936/v-model-and-child-components)
