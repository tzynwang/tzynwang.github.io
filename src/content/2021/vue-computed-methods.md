---
title: 「Vue computed與methods之差異，以及getter/setter」相關筆記
date: 2021-07-25 18:02:30
tag:
  - [Vue]
  - [JavaScript]
---

## 總結

此篇為參考 Vue.js 官方文件與其他網路資源後，記錄 computed 與 methods 差異、以及 getter/setter 相關筆記

## 環境

```
Vue.js: 2.X
```

## 筆記

### computed

- Computed properties are **cached** based on their **reactive dependencies**.
- A computed property will **only re-evaluate** when some of its **reactive dependencies have changed**.
- This also means the following computed property **will never update**, because `Date.now()` is **not a reactive dependency**.
  ```js
  computed: {
    now () {
      return Date.now()
    }
  }
  ```

小總結：

- 除非 computed 依存的變數內容有變，不然 computed 不會重新運算
- 只有在 computed 依存的變數改變時，computed 才會重新計算／回傳結果
- 上述示範的`now()`永遠不會更新其回傳的內容，因為`now()`中的`Date.now()`並非 reactive dependency

### reactive dependency

```js
const vm = new Vue({
  data: {
    a: 1
  }
})
// vm.a is reactive

vm.b = 2
// vm.b is NOT reactive
```

A property must **be present in the data object** in order for Vue to convert it and make it **reactive**.

```js
const vm = new Vue({
  data: {
    // declare message with an empty value
    message: ''
  },
  template: '<div>{{ message }}</div>'
})
// set `message` later
vm.message = 'Hello!'
```

Vue doesn’t allow dynamically adding root-level reactive properties, you have to initialize Vue instances by **declaring all root-level reactive data properties upfront**, even with an empty value.

小總結：需要由 Vue 監視其內容是否改變的資料，一定要放在 Vue instance 的 data 物件中

### computed VS methods

- A computed property will **only re-evaluate when some of its reactive dependencies have changed**.
- A method invocation will **always run** the function whenever a **re-render** happens.

參考[Method vs Computed in Vue 討論串中 Giulio Bambini 的答案](https://stackoverflow.com/a/48151401/15028185)，可以觀察到「即使互動的按鈕僅更新到`data.a`的值，`addToBmethod`也會被呼叫」
而 computed property 依存的變數若沒有被更新，computed property 會直接回傳 cache 中的值，不會進行重運算

### getter/setter (JavaScript Accessors)

```html
<div id="demo">{{ fullName }}</div>
```

```js
data: {
  firstName: 'Hello',
  lastName: 'World',
  fullName: 'Hello World'
},
computed: {
  fullName: {
    // getter
    get: function () {
      return this.firstName + ' ' + this.lastName
    },
    // setter
    set: function (newValue) {
      var names = newValue.split(' ')
      this.firstName = names[0]
      this.lastName = names[names.length - 1]
    }
  }
}
```

- getter：提供計算後的值
- setter：設值，在以上範例中做的事情即是在`fullName`的值**被修改時**，把`fullName`的值拆開並**設定`firstName`與`firstName`的值**

MDN 對 getter/setter 的定義：

- [getter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get): the `get` syntax binds an object property to a function that will be called **when that property is looked up**.
  - Sometimes it is desirable to allow access to a property that **returns a dynamically computed value**, or you may want to reflect the status of an internal variable without requiring the use of explicit method calls.
  - In JavaScript, this can be accomplished with the use of a getter.
- [setter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set): the `set` syntax binds an object property to a function to be called when **there is an attempt to set that property**.
  - In JavaScript, a setter can be used to execute a function whenever a specified property is **attempted to be changed**.

[W3Schools 的範例](https://www.w3schools.com/js/js_object_accessors.asp)：

```js
const obj = { counter : 0 }

// Define setters
Object.defineProperty(obj, "reset", {
  get: function () { this.counter = 0 }
})
Object.defineProperty(obj, "increment", {
  get: function () { this.counter++ }
})
Object.defineProperty(obj, "decrement", {
  get: function () { this.counter-- }
})
Object.defineProperty(obj, "add", {
  set: function (value) { this.counter += value }
})
Object.defineProperty(obj, "subtract", {
  set: function (value) { this.counter -= value }
})

obj.reset         // { counter : 0 }
obj.add = 5       // { counter : 5 }
obj.subtract = 1  // { counter : 4 }
obj.increment     // { counter : 5 }
obj.decrement     // { counter : 4 }
```

## 參考文件

- Vue.js 官方文件
  - [Computed Properties and Watchers](https://vuejs.org/v2/guide/computed.html)
  - [Reactivity in Depth](https://vuejs.org/v2/guide/reactivity.html)
- 其他資源
  - [YouTube: Getter & Setter Computed Properties - Vue.js 2.0 Fundamentals](https://youtu.be/PuxdMnk-u5k)
  - [StackOverFlow: Method vs Computed in Vue](https://stackoverflow.com/questions/44350862/method-vs-computed-in-vue)
  - [JavaScript Object properties: getters and setters](https://javascript.info/property-accessors)
