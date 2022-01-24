---
title: 2022 第3週 學習記錄：Creational Design Patterns
date: 2022-01-22 17:39:18
categories:
  - [Design Patterns]
tags:
---

## 總結

## 筆記

### Factory Method

<iframe width="560" height="315" src="https://www.youtube.com/embed/EcFVTgRHJLM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

- Provides an interface for **creating objects in a superclass**, but allows **subclasses to alter the type of objects** that will be created. 由 superclass 定義好 interface，由 subclass 來實際進行物件的建立與回傳
- The Factory Method **separates product construction** code from the code that **actually uses the product**. For example, **to add a new product** type to the app, you’ll only need to **create a new creator subclass** and override the factory method in it.
- Use the Factory Method **when you don’t know beforehand the exact types and dependencies of the objects** your code should work with. 由 factory method 來根據情境回傳對應的物件
- Using factories provides encapsulation, and means the **code is not tied to specific classes or objects**, and thus the class hierarchy or prototypes can be changed or refactored **without needing to change code that uses them**. 不需要知道物件是根據什麼樣的邏輯或步驟被建立，只要呼叫 subclass 就可以得到需要的物件

<script src="https://gist.github.com/tzynwang/cd786a10bedf28a61043a8923ce0fdd6.js"></script>

- gist/app.tsx 第 22 行的 `generateRandomAnimal.runFactory()`，運用這段 code 的人不需要知道 Animal 是根據什麼樣的邏輯被隨機產出，只知道一旦呼叫了 `generateRandomAnimal.runFactory()` 就會得到隨機的 Animal 物件
- gist/app.tsx 第 26 行的 `generateSerialAnimal.runFactory()` 則是會以固定的順序回傳 Animal 物件，使用這段 code 的人也不需要知道 Animal 是透過哪些邏輯被依序產出
- 使用 `runFactory()`（即 `factory method`）的好處是，日後 Animal 的種類就算越變越多，使用者維持使用 `generateRandomAnimal.runFactory()` 依舊可以隨機獲得任何 Animal 物件，client code 不需進行任何調整

### Abstract Factory

<iframe width="560" height="315" src="https://www.youtube.com/embed/v-GiuMmsXj4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

- 與 Factory Method 概念類似，唯一的不同是 Factory Method 基本上是產生單一物件，但 Abstract Factory 是產出一組互相搭配的物件，比如在 light mode 或 dark mode 下使用的不同 UI 組合
- Abstract Factory 要解決的問題是：確保產出的物件會是合理的組合
- Abstract Factory can serve as **an alternative to Facade** when you only want to hide the way the subsystem objects are created from the client code.

### Builder

<iframe width="560" height="315" src="https://www.youtube.com/embed/ziQqmvfg5XE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

- 使用一連串的 method 來產生物件；舉例：透過在披薩上追加不同的配料（`methods`），會產生不同口味的披薩
- Builder focuses on **constructing complex objects step by step**. Abstract Factory specializes in creating **families of related objects**.
- Abstract Factory returns the product immediately, whereas **Builder lets you run some additional construction steps before fetching the product**.

<script src="https://gist.github.com/tzynwang/ced5f0ff99570ac61580481dae622b46.js"></script>

- gist/builder.ts 第 50 至 52 行即示範 builder pattern 的特徵：透過一系列的 steps 來建構類似但細節不同的物件

### Prototype

### Singleton

## 參考文件

- [Refactoring.Guru: Creational Design Patterns](https://refactoring.guru/design-patterns/creational-patterns)
- [dofactory: JavaScript Design Patterns](https://www.dofactory.com/javascript/design-patterns)
- [patterns](https://www.patterns.dev/posts/introduction/)
