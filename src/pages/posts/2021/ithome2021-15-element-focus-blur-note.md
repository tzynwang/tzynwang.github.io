---
layout: '@Components/SinglePostLayout.astro'
title: 30天挑戰：「為什麼這個input沒有觸發@blur="event"」問題解析
date: 2021-09-02 09:49:30
tag:
  - [CSS]
  - [HTML]
  - [2021鐵人賽]
---

## 原始問題

- 使用`input:checkbox`搭配`label`來製作 light/dark mode 的切換按鈕
- `input:checkbox`使用`display: none;`隱藏於畫面中，而`label`與`input`綁定，故點擊`label`可勾選（取消勾選）該`input:checkbox`
- 想要為該`input`設定`@blur`事件，但怎麼嘗試都無法讓該元素進入`blur`狀態

## 解答

> An element is focusable if the user agent's default behavior allows it to be focusable or if the element is specially focusable, but only if the element is either **being rendered** or is a descendant of a canvas element that represents embedded content.

- 一個元素要被**渲染**到畫面上，他才能被聚焦（失焦）
- 若把該元素設定為`display: none;`，他就不會被渲染到畫面上，故也不會有聚焦（失焦）行為

### 補充

User agents should make the following elements focusable, unless platform conventions dictate otherwise:

- `a` elements that have an `href` attribute
- `link` elements that have an `href` attribute
- `button` elements that are **not disabled**
- `input` elements whose type attribute are **not in the Hidden state** and that are **not disabled**
- `select` elements that are **not disabled**
- `textarea` elements that are **not disabled**
- `command` elements that do **not have a disabled attribute**
- Elements with a `draggable` attribute set, if that would enable the user agent to allow the user to begin a drag operations for those elements without the use of a pointing device
- Editing hosts
  - If an element is **editable** and its parent element is not, or if an element is editable and it has no parent element, then the element is an editing host.
  - Editable elements can be nested.
  - Editing hosts are **typically focusable** and typically form part of the tab order.
  - An editing host can contain non-editable sections, these are handled as described below.
  - An editing host can contain non-editable sections that contain further editing hosts.
- In addition, each shape that is generated for an `area` element should be focusable, unless platform conventions dictate otherwise.

## 參考文件

- [W3C HTML5 7.3.2 Focus management](https://www.w3.org/TR/2011/WD-html5-20110525/editing.html#focus-management)
- [Special Credit to TA Mike Huang from Alpha Camp](https://lighthouse.alphacamp.co/courses/119/units/25991?comment_id=127363)
