---
title: 2022 第26週 工作筆記：在 React App 中的 mediator pattern
date: 2022-07-02 13:01:26
categories:
- [Design Patterns]
- [React]
tags:
---

## 總結

最近為手上的專案加裝純文字複製與格式複製功能，與前輩討論後發現適合使用 mediator pattern 來管理此功能的相關邏輯

## 筆記
### 什麼是 mediator pattern

> patterns.dev: Use a central mediator object to handle communication between components

> refactoring.guru: Mediator is a behavioral design pattern that lets you **reduce chaotic dependencies** between objects. 

- 核心概念：此模式類似現實中的機場塔台與飛機；飛機們不會直接與彼此溝通，而是只會與塔台聯繫，塔台負責將資訊整理給各飛機
- 優點：將資料的流動單純化
  - 只會透過中央元件來處理資料（邏輯）
  - 其他需要執行特定操作的元件，只負責發送需求，不負責處理邏輯實作
  - 如果要 debug 也只需要集中檢查中央元件的內容即可，不需要將每一個元件的內容都挑出來檢查
- 缺點：有可能會造出 God Object
  - 在沒有審慎分類功能的情況下，將不相干的資料都保存在同一個 class 中
  - [Wikipedia](https://en.wikipedia.org/wiki/God_object): In object-oriented programming, a God object is an object that references a large number of distinct types, **has too many unrelated or un-categorized methods**, or some combination of both.

### 如何應用在 React App 中

- mediator pattern 在 React 可以解決的問題：集中管理，避免實作的 code 散落（重複）於 App 各處
- 應用解說：
  - 假設一個 React App 中有複數個位置可以執行「複製」行為，直觀的解決方式是在「每一個需要執行複製的元件」中實作複製邏輯
  - mediator 風味的解決方式是，將複製邏輯實作在一個沒有外觀的 Layer (middleware) 元件中，此元件負責監聽、處理 App 裡所有的複製需求；而此元件本身沒有（也不需要）視覺外觀
  - 而負責提供「複製功能」這個外觀的元件（比如一個按鈕），在使用者與元件互動（比如點了此按鈕）後，即發送「複製事件」，觸發 Layer (middleware) 的一連串行為


### 何謂無外觀元件

<script src="https://gist.github.com/tzynwang/6ad8892dbfd4fdd2b0105d2d2494cfed.js"></script>

參考上方範例，元件本身不提供視覺效果，僅包覆 children ，由 children 元件來處理與使用者互動的視覺


## 參考文件
- [patterns.dev: Mediator/Middleware Pattern](https://www.patterns.dev/posts/mediator-pattern/)
- [refactoring.guru: Mediator](https://refactoring.guru/design-patterns/mediator)