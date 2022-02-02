---
title: 「React Error Boundaries」實作筆記
date: 2022-01-29 22:17:24
categories:
  - [React]
tags:
---

## 總結

使用 Error Boundary 元件捕捉 React App 內出現的錯誤
本次實作參考 React 官方文件，使用 Error Boundary 元件包覆 layout 中的各個區塊，即使個別區塊出錯也不會導致整個 App 無法運行：https://tzynwang.github.io/react-error-boundary/

{% figure figure--center 2022/react-error-boundaries/screenshot.png %}

## 筆記

> As of React 16, errors that were **not caught by any error boundary** will result in **unmounting of the whole React component tree**.

錯誤若沒有被 Error Boundary 元件捕捉，會導致整個 React App 的掛載行為被取消

### Error Boundary 元件的特徵

- A class component becomes an error boundary if it defines either (or both) of the lifecycle methods `static getDerivedStateFromError()` or `componentDidCatch()`. 注意只有 class component 可以實作 `static getDerivedStateFromError()` 或 `componentDidCatch()` 這兩種 lifecycle method（因 hooks 尚未支援），故目前還沒辦法透過 functional component 來實作 Error Boundary
- Both lifecycle (`static getDerivedStateFromError()`, `componentDidCatch()`) are invoked after an error has been thrown by a descendant component.
- Error boundaries do not catch errors for:
  - Event handlers: React doesn’t need error boundaries to recover from errors in event handlers. Unlike the render method and lifecycle methods, the **event handlers don’t happen during rendering**. So if they throw, **React still knows what to display** on the screen. 即使 Event handlers 出現錯誤，畫面也不受影響（React 依舊知道需要渲染什麼內容），所以不被 Error Boundary 元件捕捉也沒有關係
  - Asynchronous code (e.g. `setTimeout` or `requestAnimationFrame` callbacks)
  - Server side rendering
  - **Errors thrown in the error boundary itself** (rather than its children)

### static getDerivedStateFromError(error)

- `static getDerivedStateFromError(error)` receives the error that was thrown as a parameter and should **return a value to update state**. 回傳的值會直接被 `setState` 拿去更新 `this.state`
- `getDerivedStateFromError()` is called during the **render phase**, so **side-effects are not permitted**. For those use cases, use `componentDidCatch()` instead.

### componentDidCatch(error, info)

- `componentDidCatch(error, info)` receives two parameters:
  - error: The error that was thrown.
  - info: An object with a componentStack key containing information about which component threw the error.
- `componentDidCatch()` is called during the **commit phase**, so **side-effects are permitted**.
- In the event of an error, you can render a fallback UI with `componentDidCatch()` by calling `setState`, but this will be deprecated in a future release. Use `static getDerivedStateFromError()` to handle fallback rendering instead.

### 程式碼

<script src="https://gist.github.com/tzynwang/427f0181a0b6b1e749b0778457137286.js"></script>

完整：https://github.com/tzynwang/react-error-boundary/tree/master/src/components

## 參考文件

- [React: Error Boundaries](https://reactjs.org/docs/error-boundaries.html)
- [react/packages/react-devtools-shared/src/devtools/views/ErrorBoundary/ErrorBoundary.js](https://github.com/facebook/react/blob/575791925697c7e23966e6934b577e69aef736f3/packages/react-devtools-shared/src/devtools/views/ErrorBoundary/ErrorBoundary.js)
- [StackOverFlow: what's the difference between getDerivedStateFromError and componentDidCatch](https://stackoverflow.com/questions/52962851/whats-the-difference-between-getderivedstatefromerror-and-componentdidcatch)
- [StackOverFlow: Understanding Error.captureStackTrace and stack trace persistance?](https://stackoverflow.com/questions/59625425/understanding-error-capturestacktrace-and-stack-trace-persistance)
