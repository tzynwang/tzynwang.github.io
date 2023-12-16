---
title: 2022 第44週 cypress 綜合筆記：對應元件可能不存在的情境、搭配 typescript 使用 dayjs
date: 2022-11-04 21:15:42
tag:
  - [cypress]
  - [Testing]
---

## 總結

紀錄一下這週在透過 cypress 寫 e2e 腳本時遇到的兩個問題：

- 如何在 cypress 中，將「某個元件的存在與否」作為條件來撰寫測試腳本。
- 如何在 cypress 中搭配 typescript 使用 dayjs 套件

## 版本

```
cypress: 10.6.0
```

## 筆記

### 對應元件可能不存在的情境

在 cypress 中無法直接處理「（根據條件查詢後）某個 DOM 可能不存在」的情境（查詢後如果找不到該 DOM 會直接拋錯），而如果測試情境會有「執行某操作後，根據不同的條件，畫面上可能會出現 X 或 Y 元件（即不管查詢 X 或 Y 都有可能會得到「不存在」的結果）」，這種時候可透過下列方法來確認「到底是哪一個元件出現在畫面上」：

```ts
// 先透過 cy.get() 抓取一個必定存在的 DOM
cy.get('body').then(($body) => {
  // 接著再從上一行取得的 body element 中確認目標 DOM 是否存在
  const isComponentX = !!$body.find('.here-is-the-condition').length > 0;
  if (isComponentX) {
    // 針對 component X 的測試腳本
  } else {
    // 針對 component Y 的測試腳本
  }
});
```

先透過 `cy.get('body')` 取得「必定在畫面上的容器元件」，再透過 `$body.find('...')` 來確認 `$body` （容器元件）中是否有符合某查詢條件的元件。

接下來就可透過 `isComponentX` 來撰寫針對元件 X 與 Y 的測試。

### 搭配 typescript 使用 dayjs

在 cypress `10.6.0` 版本中，開啟 `cypress/support/commands.ts` 追加以下內容：

```ts
/// <reference types="cypress" />
import dayjs from 'dayjs';

declare global {
  namespace Cypress {
    interface Chainable {
      // 這邊用不到，跳過
    }
    interface Cypress {
      // 將 dayjs 追加到 Cypress.Cypress namespace 中
      dayjs(date?: dayjs.ConfigType): dayjs.Dayjs;
    }
  }
}

// 最後將 dayjs 賦值給 Cypress.dayjs
Cypress.dayjs = dayjs;
```

之後在腳本中即可透過 `Cypress.dayjs` 使用 dayjs 功能：

```ts
/// <reference types="cypress" />

describe('[dayjs]', () => {
  it('should be able to use dayjs', () => {
    const dayjsString = Cypress.dayjs().format('YYYY-MM-DD');
    expect(dayjsString).to.equal('2022-11-05');
  });
});
```

![dayjs in cypress](/2022/cypress-note/testResult.png)

## 參考文件

- [cypress: find](https://docs.cypress.io/api/commands/find)
- [cypress: get](https://docs.cypress.io/api/commands/get)
- [cypress-example-recipes: dayjs](https://github.com/cypress-io/cypress-example-recipes/blob/cc13866e55bd28e1d1323ba6d498d85204f292b5/examples/blogs__dayjs/README.md)
- [How to check if element exists using Cypress.io](https://stackoverflow.com/questions/56145926/how-to-check-if-element-exists-using-cypress-io)
