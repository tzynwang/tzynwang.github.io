---
title: 「Express Handlebars 取得父層變數內容」相關筆記
date: 2021-05-14 21:11:16
tag:
- [Express Handlebars]
---

## 問題描述

- 情境：在 express-handlebars 中使用原生的`each`搭配 handlebars-helpers 的`is`進行條件判斷，進而渲染出一組`<select>`
  - `<select>`中的每一個`<option>`都是一種餐廳類型（舉例：日本料理、酒吧、美式餐廳等）
  - （由`app.js`傳遞給`edit.handlebars`的變數）`categories`為餐廳類型的陣列資料，`restaurant`為物件變數，可透過`restaurant.category`來取得該餐廳的餐廳類型
  - 當`each`迴圈中`this`的值與`restaurant.category`一致時，pre-selected 該`<option>`
    ![select欄位應預設選擇該餐廳的類型](/2021/express-handlebars-access-variable-in-parent-scope/pre-selected.png)
- 問題：檢查最終的 DOM 內容，發現並**沒有**渲染出應該要預先被選擇的`<option>`
- 行為不如預期的原始碼：
  ```js
  // app.js端
  app.get('/restaurants/:id/edit', (req, res) => {
    const id = Number(req.params.id)
    const targetRestaurant = restaurantList.results.find((restaurant) => restaurant.id === id)
    const categories = []
    restaurantList.results.forEach(restaurant => {
      if (!categories.includes(restaurant.category)) {
        categories.push(restaurant.category)
      }
    })
    res.render('edit', { restaurant: targetRestaurant, categories })
  })
  ```
  ```html
  <!-- handlebars端 -->
  {{#each categories}}
    {{#is this restaurant.category)}}
    <option value="{{this}}" selected>{{this}}</option>
    {{else}}
    <option value="{{this}}">{{this}}</option>
    {{/is}}
  {{/each}}
  ```

## 環境

```
express-handlebars: 5.3.2
handlebars-helpers: 0.10.0
```

## 解決方式

將 handlebars 端的內容修改如下（`restaurant.category`加上`../`）：

```html
<!-- handlebars端 -->
{{#each categories}}
  {{#is this ../restaurant.category)}}
  <option value="{{this}}" selected>{{this}}</option>
  {{else}}
  <option value="{{this}}">{{this}}</option>
  {{/is}}
{{/each}}
```

參考 Handlebars 官方文件的說明：

> Some helpers like `#with` and `#each` allow you to **dive into nested objects**. When you include `../` segments in your path, Handlebars will change back into the **parent context**.

在巢狀結構中，使用`../`來取得上一層變數的內容

## 參考文件

- [Handlebars: Changing the context](https://handlebarsjs.com/guide/expressions.html#changing-the-context)
- [Access a variable outside the scope of a Handlebars.js each loop](https://stackoverflow.com/questions/13645084/access-a-variable-outside-the-scope-of-a-handlebars-js-each-loop)
- [Access properties of the parent with a Handlebars 'each' loop](https://stackoverflow.com/a/12297980/15028185)
- [Node.js 初學筆記 10: 在 express-handlebars 中輕鬆建立客製 helper(handlebars custom helpers)](https://eruditeness.news.blog/2019/08/28/node-js%E5%88%9D%E5%AD%B8%E7%AD%86%E8%A8%9810-%E5%9C%A8express-handlebars%E4%B8%AD%E8%BC%95%E9%AC%86%E5%BB%BA%E7%AB%8B%E5%AE%A2%E8%A3%BDhelperhandlebars-custom-helpers/)
