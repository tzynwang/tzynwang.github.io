---
title: 2022 第3週 學習記錄：Creational Design Patterns
date: 2022-01-22 17:39:18
categories:
  - [Design Patterns]
tags:
---

## 總結

## 筆記
### Factory

<iframe width="560" height="315" src="https://www.youtube.com/embed/EcFVTgRHJLM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

<iframe width="560" height="315" src="https://www.youtube.com/embed/-1YhP5IOBCI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

- Provides an interface for **creating objects in a superclass**, but allows **subclasses to alter the type of objects** that will be created. 由 superclass 定義好 interface，由 subclass 來實際進行物件的建立與回傳
- The Factory Method **separates product construction** code from the code that **actually uses the product**. For example, **to add a new product** type to the app, you’ll only need to **create a new creator subclass** and override the factory method in it.
- Use the Factory Method **when you don’t know beforehand the exact types and dependencies of the objects** your code should work with.
- Using factories instead of constructors or prototypes allows one to use polymorphism for object creation, not only object use. Specifically, using factories provides encapsulation, and means the **code is not tied to specific classes or objects**, and thus the class hierarchy or prototypes can be changed or refactored **without needing to change code that uses them** – they abstract from the class hierarchy or prototypes. 不需要知道物件是根據什麼樣的邏輯或步驟被建立，只要呼叫 subclass 就可以得到需要的物件


### Abstract Factory

### Builder

### Prototype

### Singleton


## 參考文件
- [Refactoring.Guru: Creational Design Patterns](https://refactoring.guru/design-patterns/creational-patterns)
- [dofactory: JavaScript Design Patterns](https://www.dofactory.com/javascript/design-patterns)
- [patterns](https://www.patterns.dev/posts/introduction/)
