---
title: 「Vue component生命週期」相關筆記
date: 2021-10-08 14:48:27
categories:
- Vue
tags:
---

## 原始問題
Vue component從建立到摧毀，會經過數個階段的生命週期；請描述以下這兩個DOM元素的生命週期發生順序為何？
```html
<header>
  <nav>
  </nav>
</header>
```


## 回答
1. 先是`header`的beforeCreate、created與beforeMount（`header`準備掛載）
1. 接著`nav`進行beforeCreate、created與beforeMount（`nav`準備掛載）
1. `nav` mounted，然後`header` mounted（掛載`nav`後，掛載`header`）
1. 準備銷毀時先`header` beforeDestroy，接著`nav` beforeDestroy（`header`準備銷毀，接著`nav`準備銷毀）
1. `nav` destroyed，最後`header` destroyed（銷毀`nav`後再銷毀`header`）

遇到資料更新時則是`beforeUpdate`接`updated`
自作純觀察用的奈米專案（結果輸出於devTool console）：[demo](https://tzynwang.github.io/vue-component-life-cycle/) | [repo](https://github.com/tzynwang/vue-component-life-cycle#readme)

{% figure figure--center 2021/vue-component-life-cycle/vue-component-life-cycle.png "''" %}


## 版本與環境
```
vue: 2.6.11
```


## 筆記
- 透過`console.log`可觀察到`this.$data`在`created`後才可取用（操作）
  - Vue.js技術揭密：可以從原始碼看到`beforeCreate`和`created`的hook分別在`initState`的前後調用，而`initState`的作用是初始化`props`、`data`、`methods`、`watch`、`computed`等屬性，所以在`beforeCreate`的hook無法取用props、data定義的值，也不能調用`methods`中的function。
- `$el`與`$ref`皆是`mounted`後才可取用
  - 重新認識Vue.js：直到`mounted`階段，Vue才正式將網頁上的DOM節點、事件都綁定至Vue的實體。也就是說，如果我們基於某些原因需要手動操作DOM API，如`querySelector`或`addEventListener`等，最好在`mounted`階段完成後進行操作，以免操作的DOM節點被Vue替換掉。
  - functions in `mounted` hook: called after the instance has been mounted, where `el` is replaced by the newly created `vm.$el`.
  - An important note about the `ref` registration timing: because the refs themselves are created as a result of the render function, you **cannot access them on the initial render** - they don’t exist yet!
- 在`beforeUpdate`階段時，資料就已經更新了，只是還未重渲染畫面；`updated`則代表「畫面已更新」
  - Vue的`$nextTick()`就是要確保其`cb()`在畫面更新後才執行
- Vue component被銷毀（`destroyed`）後，無法再透過Vue操作DOM（`$ref`的值變為`undefined`）（devTool中的Vue extension也不再顯示相關內容），但DOM元素依舊存在


## 參考文件
- [The Vue Instance: Lifecycle Diagram](https://vuejs.org/v2/guide/instance.html#Lifecycle-Diagram)
- [重新認識Vue.js：1-7 元件的生命週期與更新機制](https://book.vue.tw/CH1/1-7-lifecycle.html)
- [Vue.js技術揭密：生命週期](https://ustbhuangyi.github.io/vue-analysis/v2/components/lifecycle.html#%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F)
- [Vue生命周期](https://juejin.cn/post/6844903811094413320)