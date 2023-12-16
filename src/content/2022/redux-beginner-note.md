---
title: 2022 第8週 學習筆記：redux 基礎與 Immer producer
date: 2022-02-26 18:52:03
tag:
  - [React]
  - [Redux]
---

## 總結

本篇筆記記錄 Redux 中 state、action 與 reducer 這三類基礎概念，以及如何搭配 immer 的 `produce(state, (draft) => void))` 來建立 reducers

## 筆記

### Redux

- state: 資料，透過 dispatch action 來建立一份當下 state 的拷貝，修改並回傳的是該份拷貝
- action: 包含 action type 與 action payload 的 plain object；type 描述該 action 要達成的事情，payload 類似參數
- reducer: 結合 state 與 action，根據 action type 來對 state 進行不同種類的加工，並回傳處理後的 state；`(state, action) => new state`
- store: 透過傳入 reducer 來建立 Redux store；可以使用 `.dispatch()` 與 `.getState()` 兩種 methods

<script src="https://gist.github.com/tzynwang/de8f671f810964b7f70d68abd43f2d7e.js"></script>

- `.getState()`: returns the current state value.
- `.dispatch()`: the only way to update the state is to call `store.dispatch()` and **pass in an action object**. The store will run its reducer function and save the new state value inside, and we can call `getState()` to retrieve the updated value.

### Immer

- gist 23-30: `produce(currentState, recipe: (draftState) => void): nextState`
  - 第一個參數 `currentState` 是現在的 state，拷貝後根據 reducer 匹配是否有對應的 action，修改拷貝的版本（`draftState`）
  - 第二組參數 `recipe` 傳入匿名函式，函式參數為拷貝後的 `currentState`
  - 最終會回傳一個新的狀態 `nextState`
- 結合 `produce()` 後依舊符合 Redux 對 reducer 的定義：最終會回傳一個新版本的 state（`(state, action) => new state`）

## 參考文件

- [Immer: produce](https://immerjs.github.io/immer/produce/)
- [Immer: Redux + Immer](https://immerjs.github.io/immer/example-setstate#redux--immer)
