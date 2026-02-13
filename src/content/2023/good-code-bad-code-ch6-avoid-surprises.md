---
title: 閱讀筆記：Good Code, Bad Code Chapter 6 Avoid surprises
date: 2023-03-29 19:15:27
tag:
  - [Software Architecture]
---

## 總結

此篇文章是 Good Code, Bad Code: Think like a software engineer 第六章（Avoid surprises）的閱讀筆記，並摘錄了書中一些關於「減少程式碼對使用者造成驚喜（驚嚇）」的實作技巧。

## 筆記

### 如何避免驚喜（驚嚇）

本章總結：避免驚嚇（驚喜）最好的辦法，就是讓程式碼的使用者明確意識到「這段程式碼運作之後，會發生什麼事情」。

> Avoiding surprises is often about **being explicit**. If a function sometimes returns nothing or there is a special scenario that needs handling then we should **make sure other engineers are aware of this**.

### 實作方式

#### 避免使用 magic value

`Array.prototype.findIndex()` 就是一個使用 magic value 的例子。當 `findIndex()` 無法在該陣列中找到符合條件的項目時，此功能不是回傳 `null` 或 `undefined`，而是回傳 `-1`。

這麼做的缺點是：

1. TypeScript 對回傳值的型別檢查失效，使用者一定要手動檢查回傳的值是否大於 `-1` 才能知道「到底有沒有找到符合條件的項目」
2. 如果使用者沒有查閱 `Array.prototype.findIndex()` 的文件，他不會知道這個功能是透過「回傳 `-1`」來代表「找不到符合條件的項目」

有鑒於以上的不便性，工程師在開發一個 function 時應選擇避免使用 magic value。

以 TypeScript 開發來說，上述功能如果改為「找不到對應項目時，回傳 `null` 或 `undefined`」的話，使用此功能的工程師即可透過「檢查回傳值的型別」來知道該功能究竟有沒有找到對應項目。

#### 謹慎使用 null object

以下列功能為例，呼叫 `getUserInfo` 後必定會取得一個符合 `UserInfo` 型態的資料，但變數 `userInfo` 卻不保證包含有效資訊，如果在呼叫 API 時發生錯誤，這個 `userInfo` 就會是一個空殼物件。

```ts
async function getUserInfo(user_id: string): UserInfo {
  try {
    const results = await api.user.getInfo(user_id);
    const userInfo = {
      user_id,
      display_name: results.data.payload.display_name,
      email: results.data.payload.email,
      is_validate: results.data.payload.is_validate,
    };
  } catch (error) {
    return {
      user_id: "",
      display_name: "",
      email: "",
      is_validate: false,
    };
  }
}

const userInfo = getUserInfo("id_1");
```

若有一個工程師不做任何檢查，直接使用變數 `userInfo` 來渲染畫面的話，就會遇到「呼叫 API 失敗時，畫面上會缺少使用者的相關資訊」的狀況。

除非 `getUserInfo` 的使用者知道這個功能的實作細節，不然以上的設計方式可能會給程式碼的使用者帶來驚喜（驚嚇）。比較好的做法是在呼叫 API 失敗時直接拋錯、或是回傳 `null` 物件。

雖然這樣會讓 `getUserInfo` 的使用者需要額外撰寫一段 `if (userInfo !== null) { ... }` 的檢查邏輯，但這可以確保 `getUserInfo` 的使用者意識到「此功能可能不是每次都會回傳有效內容」，進而避免過於大意的使用方式。

#### 避免無預期的 side effects

產生 side effect 是撰寫程式中不可或缺的一環，但本書作者想強調的事情是：

- 如果一個功能會產生 side effect，則必須讓該功能的使用者意識到「呼叫此功能會產生 side effect」
  - 建議：透過 function name 明示一個功能會產生 side effect
  - 避免：使用者需要透過註解或文件才會知道一個功能帶有 side effect（參考本書第三章）
- 如果 side effect 並非必要，那麼就把會產生 side effect 的邏輯自該功能中移除掉

> Not causing a side effect in the first place is the best way to avoid a surprise, but this is not always practical. When a side effect is unavoidable, **naming things appropriately** can be a very effective way to make it obvious.

#### 避免修改參數

在無法保證傳入一個功能的參數是否有可能被其他功能使用時，比較好的做法是複製一份參數後，再對該副本進行修改。如果是較複雜的巢狀結構物件，可搭配 `lodash/cloneDeep` 來執行深拷貝。

#### 謹慎對應 enum

重點：工程師需意識到一個 `enum` 有可能在日後繼續增加項目

> When you do have to handle an enum, it’s often important to remember that more values may be added to the enum in the future. If you write code that ignores this fact, then you may cause some nasty surprises for yourself or other engineers.

撰寫程式碼時如果需要根據 `enum` 來進行條件分支，本書建議使用 `switch()` 來明確列出、處理每一個 `enum` 項目。並且若語言有支援的話，讓程式碼在「沒有處理到所有 `enum` 項目時拋錯、或無法進行編譯」。

TypeScript 目前尚未支援「檢查是否所有的 enum 項目都有被 `switch() case` 使用」，一種做法是在 `default` 分支中進行例外處理：

```ts
enum user_action {
  set_user_info = "set_user_info",
  logout_user = "logout_user",
}

function reduxUserReducer(state, action) {
  switch (action.type) {
    case user_action.set_user_info:
      return { ...state };
    case user_action.logout_user:
      return { ...state };
    default:
      throw new Error(`un-handled user_action::: ${action.type}`);
  }
}
```

## 參考文件

- [Manning: Good Code, Bad Code](https://www.manning.com/books/good-code-bad-code)
- [Lodash](https://lodash.com/)
