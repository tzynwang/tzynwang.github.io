---
layout: '@Components/pages/SinglePostLayout.astro'
title: 2021 第46週 學習記錄：CSS modules、React HOC、React router、debounce 與 throttle
date: 2021-11-18 20:53:38
tag:
  - [CSS]
  - [React]
---

## 總結

記錄 2021 年第 46 週學到的新東西：CSS modules、React Router、Debounce 與 Throttle

## CSS modules

> [Adobe Magneto PWA docs](https://magento.github.io/pwa-studio/technologies/basic-concepts/css-modules/): A CSS Module is a CSS file that defines class and animation names that are **scoped locally by default**. CSS modules **do not have an official specification** nor are they a browser feature. They are part of a compilation process that executes against your project to convert scoped classes and selectors into CSS files that the browser can parse and understand. Tools such as **Webpack** are used to perform this compilation process.

- 解決了原生 CSS 沒有 scope 概念的問題
- 目前的專案使用 webpack5 處理打包流程，故直接在 React 元件中引用相對應的 module.css 檔案即可

### 相關問題

> 試圖對 MUI 元件套用自定義的 CSS 樣式，確定語法與選擇器皆有正確撰寫，但樣式卻沒有套用到畫面上

- 問題根源：在 module.css 中誤用`:local`限制了要覆蓋的 MUI CSS classes
- 解決方式：使用`:global`取代`:local`，因為要覆蓋的 MUI CSS classes 是 global 樣式，不需套用`:local`將該樣式做 scoped

## React

### Higher-Order function

> Higher-Order function 是 function 回傳 function；而 higher-order component 也可用類似邏輯理解

```js
// function return function
const add = (x) => (y) => (z) => x + y + z;
add(2)(3)(4); // 2+3+4 = 9
```

### Higher-Order Components

> [React Official Docs](https://reactjs.org/docs/higher-order-components.html): A higher-order component is a function that takes a component and **returns a new component**.

```js
// component return component
const EnhancedComponent = higherOrderComponent(WrappedComponent);
```

- You can imagine that in a large app, this **same pattern** of subscribing to `DataSource` and calling `setState` will occur over and over again. We want an abstraction that allows us to define this logic in a single place and share it across many components. This is where higher-order components excel.
  官方說明中以「render comments」與「render blog post」做範例，雖然 render 出來的內容類型完全不同，但行為都是「在`componentDidMount`時執行 data fetch，把資料丟進 setState，並將資料渲染到畫面上」；而 HOCs 可以**重複利用以上邏輯**
- The wrapped component receives all the props of the container, along with a new prop, `data`, which it uses to render its output. The **HOC isn’t concerned with how or why the data is used**, and the **wrapped component isn’t concerned with where the data came from**.
  HOCs 不管資料怎麼被子層元件使用，子層元件也不管資料怎麼來
- 簡單應用範例：

  ```js
  // remove props
  import React from 'react';

  function HocRemoveProp(WrappedComponent) {
    return class WrappingComponent extends React.Component {
      render() {
        const { user, ...otherProps } = this.props;
        return <WrappedComponent {...otherProps} />;
      }
    };
  }

  export default HocRemoveProp;
  ```

  ```js
  // remove props
  import React from 'react';

  function HocRemoveProp(WrappedComponent) {
    return class WrappingComponent extends React.Component {
      render() {
        const { user, ...otherProps } = this.props;
        return <WrappedComponent {...otherProps} />;
      }
    };
  }

  export default HocRemoveProp;
  ```

## React Router

- To use a router, just make sure it is **rendered at the root of your element hierarchy**. Typically you’ll wrap your top-level `<App>` element in a router.
  基本上會用`<BrowserRouter>`把`<App>`包起來

  ```jsx
  import React from 'react';
  import ReactDOM from 'react-dom';
  import { BrowserRouter } from 'react-router-dom';

  function App() {
    return <h1>Hello React Router</h1>;
  }

  ReactDOM.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
    document.getElementById('root')
  );
  ```

- You should put `<Route>`s with more specific (typically longer) `path`s **before** less-specific ones.
  邏輯跟 vue router 一樣，比對到就不會繼續往下找了，所以條件越嚴格的要放越上面

### strict, exact

- `exact strict`：完全符合
  ```js
  <Route exact strict path="/one/" component={About} />
  // ✅ /one/
  // 🚫 /one, /one/two
  ```
- `strict`：檢查 trailing slash
  ```js
  <Route strict path="/one/" component={About} />
  // ✅ /one/, /one/two
  // 🚫 /one
  ```
- `exact`：不限制 trailing slash，但 trailing slash 後若有內容則判定不 match
  ```js
  <Route exact path="/one" component={About} />
  // ✅ /one, /one/
  // 🚫 /one/two
  ```

## Searching Debounce, Throttle

> When a React component handles bursting events like window resize, scrolling, user typing into an input, etc. — it's wise to **soften the handlers of these events**. Otherwise, when the handlers are invoked too often you risk making the application **lagging** or even **unresponsive for a few seconds**.

- 簡單總結：「等一下再執行」
  舉例：不是每次 user input onChange 的時候就馬上搜尋內容，而是等待 xx 毫秒後再執行搜尋
- 簡單解法：
  - `_.debounce(func, [wait=0], [options={}])` ([Official docs](https://lodash.com/docs/4.17.15#debounce)): Creates a debounced function that delays invoking `func` until after `wait` milliseconds have elapsed since the last time the debounced function was invoked.
  - `_.throttle(func, [wait=0], [options={}])` ([Official docs](https://lodash.com/docs/4.17.15#throttle)): Creates a throttled function that only invokes `func` at most once per every `wait` milliseconds.
- 差異：
  - debounce: will bunch a series of sequential calls to a function **into a single call** to that function. It ensures that one notification is made for an event that fires multiple times. **最後一次被觸發、並過了指定秒數後**才執行該 cb()
  - throttle: will **delay executing** a function. It will **reduce** the notifications of an event that fires multiple times. 在**一段指定時間內最多只會執行一次**
  - 視覺參考：[http://demo.nimius.net/debounce_throttle/](http://demo.nimius.net/debounce_throttle/)

## 參考文章

- [CSS Modules](https://github.com/css-modules/css-modules)
- [(YouTube) What is a Higher Order Component? | React Tutorials](https://youtu.be/JZcKgeulFM0)
- [[react] Higher Order Component(HOC)](https://pjchender.dev/react/react-higher-order-component/)
- [当初要是看了这篇，React 高阶组件早会了](https://mp.weixin.qq.com/s/_zQZ4Gg9WIG-3byL_p13QA)
- [Usage of exact and strict props](https://stackoverflow.com/questions/52275146/usage-of-exact-and-strict-props)
- [How to Correctly Debounce and Throttle Callbacks in React](https://dmitripavlutin.com/react-throttle-debounce/)
- [Debouncing and Throttling Explained Through Examples](https://css-tricks.com/debouncing-throttling-explained-examples/)
- [Difference Between throttling and debouncing a function](https://stackoverflow.com/questions/25991367/difference-between-throttling-and-debouncing-a-function)
