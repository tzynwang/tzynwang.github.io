---
title: 2022 第49週 學習筆記：React.SyntheticEvent
date: 2022-12-09 08:03:16
categories:
  - [MaterialUI]
  - [React]
tags:
---

## 總結

在將專案的 MaterialUI 從 4 升級到 5 時需要調整一部分元件的 `onChange` `event` 型別定義，記錄一下關於 `React.SyntheticEvent` 的相關筆記。

## 筆記

### MaterialUI 4 與 5 的型別定義差別

根據 [MaterialUI: Breaking changes in v5, part two: core components](https://mui.com/material-ui/migration/v5-component-changes/#update-event-type-typescript-3) 中對於 `Select` 元件的說明：

> The event in `onChange` is now typed as a `React.SyntheticEvent` instead of a `React.ChangeEvent`.

直接來檢查一下兩代的型別定義內容，首先 4 代對 `Select` 的 `onChange` 型別定義如下：

```ts
interface SelectProps
  extends StandardProps<InputProps, SelectClassKey, 'value' | 'onChange'>,
    Pick<SelectInputProps, 'onChange'> {
  /**
   * Callback function fired when a menu item is selected.
   *
   * @param {object} event The event source of the callback.
   * You can pull out the new value by accessing `event.target.value` (any).
   * @param {object} [child] The react element that was selected when `native` is `false` (default).
   * @document
   */
  onChange?: SelectInputProps['onChange'];
}

interface SelectInputProps {
  // ...
  onChange?: (
    event: React.ChangeEvent<{ name?: string; value: unknown }>,
    child: React.ReactNode
  ) => void;
}
```

MaterialUI 4 `Select` 元件 `onChange` 的 `event` 型別為 `React.ChangeEvent<{ name?: string; value: unknown }>`；這裡的定義內容跟官方 migration 文件的說明一致。

而以下是 5 代的型別定義：

```ts
interface SelectProps<T = unknown>
  extends StandardProps<InputProps, 'value' | 'onChange'>,
    Omit<OutlinedInputProps, 'value' | 'onChange'>,
    Pick<SelectInputProps<T>, 'onChange'> {
  /**
   * Callback fired when a menu item is selected.
   *
   * @param {SelectChangeEvent<T>} event The event source of the callback.
   * You can pull out the new value by accessing `event.target.value` (any).
   * **Warning**: This is a generic event, not a change event, unless the change event is caused by browser autofill.
   * @param {object} [child] The react element that was selected when `native` is `false` (default).
   */
  onChange?: SelectInputProps<T>['onChange'];
}

export interface SelectInputProps<T = unknown> {
  // ...
  onChange?: (event: SelectChangeEvent<T>, child: React.ReactNode) => void;
  // 反而是 onClose 與 onOpen 的 event 才是直接被定義為 SyntheticEvent
  onClose?: (event: React.SyntheticEvent) => void;
  onOpen?: (event: React.SyntheticEvent) => void;
}

type SelectChangeEvent<T = string> =
  | (Event & { target: { value: T; name: string } })
  | React.ChangeEvent<HTMLInputElement>;
```

MaterialUI 5 `Select` 元件 `onChange` 的 `event` 型別可能是 `Event & { target: { value: T; name: string } }` 或 `React.ChangeEvent<HTMLInputElement>`

再追一下 `React.ChangeEvent` 到底是什麼內容，發現其實就是 `SyntheticEvent` 的延伸：

```ts
interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
  target: EventTarget & T;
}

interface SyntheticEvent<T = Element, E = Event>
  extends BaseSyntheticEvent<E, EventTarget & T, EventTarget> {}

interface BaseSyntheticEvent<E = object, C = any, T = any> {
  nativeEvent: E;
  currentTarget: C;
  target: T;
  bubbles: boolean;
  cancelable: boolean;
  defaultPrevented: boolean;
  eventPhase: number;
  isTrusted: boolean;
  preventDefault(): void;
  isDefaultPrevented(): boolean;
  stopPropagation(): void;
  isPropagationStopped(): boolean;
  persist(): void;
  timeStamp: number;
  type: string;
}
```

雖然 `React.ChangeEvent` 確實是 `React.SyntheticEvent` 的延伸，但就跟 migration 文件裡面的描述有點微妙出入，五代的 `Select` `onChange` 事件並沒有直接被定義為 `React.SyntheticEvent` 🤔

### React.SyntheticEvent

> React official: Your event handlers will be passed instances of `SyntheticEvent`, a **cross-browser wrapper** around the browser’s native event. React normalizes events so that they have consistent properties across different browsers.

為了在不同的瀏覽器之間都能有一致的事件行為，在 event handlers 收到的事件會是 React 包裝過的 `SyntheticEvent` 而非原生事件（`nativeEvent`）。

並且在 React 17 以前，`SyntheticEvent` 有 `pooling` 特性，亦即這些事件會被重複地使用：

> The `SyntheticEvent` objects are pooled. This means that the `SyntheticEvent` object will **be reused** and **all properties will be nullified** after the event handler has been called.

所以以下這種行為在 React 17 以前是行不通的：

```ts
function handleChange(e) {
  // This won't work because the event object gets reused.
  setTimeout(() => {
    console.log(e.target.value); // Too late!
  }, 100);
}
```

解決辦法是透過 `e.persist()` 來強制保留事件內容：

```ts
function handleChange(e) {
  // Prevents React from resetting its properties:
  e.persist();

  setTimeout(() => {
    console.log(e.target.value); // Works
  }, 100);
}
```

但這樣做（`e.persist()`）也會失去一開始使用 event pooling 的意義。後來這個行為也在 React 17 之後被拔掉了。

> React 17 on the web **does not** use event pooling.

╮( ˘･з･)╭

## 參考文件

- [React: SyntheticEvent](https://reactjs.org/docs/events.html)
- [React: Event Pooling](https://reactjs.org/docs/legacy-event-pooling.html)
