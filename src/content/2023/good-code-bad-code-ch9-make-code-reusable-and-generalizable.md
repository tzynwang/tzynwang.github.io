---
title: 閱讀筆記：Good Code, Bad Code Chapter 9 Make code reusable and generalizable
date: 2023-04-12 19:24:18
tag:
- [Software Architecture]
---

## 總結

此篇是 Good Code, Bad Code: Think like a software engineer 第九章（Make code reusable and generalizable）的閱讀筆記。本章提出以下「可提昇程式碼複用性、泛用性」的技巧：

1. 避免假設
2. 避免全域狀態
3. 謹慎處理預設回傳內容
4. 避免非必要的參數
5. 合理使用泛型

## 筆記

### 避免假設

避免的理由：一個功能如果需要先滿足特定條件（假設）才能正常運作，代表該功能能被運用的場合會變少（相較於「沒有假設」的功能）。

更進一步來說，如果一個功能「本來就僅為了服務特定情境而生」，那麼本書建議該功能的命名最好要能讓使用者一看就知道「使用此功能需要滿足一些條件」，避免不知情者誤用。

建議：越是基礎、底層的功能，一旦未來可能被重複使用的場合越多，此類功能最好避免包含假設（或是前置條件）。

### 避免全域狀態

> Using global state can make code reuse completely unsafe. The fact that global state is used **might not be apparent to another engineer**, so if they do try to reuse the code, this might result in weird behavior and bugs. If we need to share state between different parts of a program, it’s usually safer to do this in a more controlled way using **dependency injection**.

「全域」代表一個資料可能會在各處被操作，而這個操作可能不是開發者原本在設計功能時希望發生的事情。在設計一個功能時如果想要增加其複用或泛用性，則應該避免在功能中與全域狀態互動。

全域資料的替代方案：本書建議透過依賴注入來產生獨立的狀態資料，避免資料遭到意外污染。

### 謹慎處理預設回傳內容

情境如下：一個會回傳使用者照片的功能，如果該使用者沒有提供照片，則回傳預設圖檔。

```ts
function getAvatarImageUrl(user: User) {
  return user.avatar_image_url
    ? user.avatar_image_url
    : 'asset/default_avatar_image.jpg';
}
```

現在所有呼叫 `getAvatarImageUrl` 的程式碼都必定會收到一組照片的 url，但不會知道這組 url 是使用者上傳、或是系統預設的圖片。如果在整個服務的某些地方，我們想要「根據使用者是否有上傳照片」來執行不同的行動，那麼 `getAvatarImageUrl` 就無法滿足我們的需求。

建議：撰寫功能時，如果此功能未來可能會被複用，可多加考慮回傳預設值是否合理。以上述的例子而言，讓 `getAvatarImageUrl` 在使用者未上傳照片時回傳 `null` 是個比較有彈性的設計。

### 避免非必要的參數

情境如下：一個設定 `Text` 顏色的功能，接收兩個參數 `text: Text` 與 `style: TextStyle`。

```ts
interface Text {
  content: string;
  style: TextStyle;
}

interface TextStyle {
  fontSize: number;
  fontFamily: string;
  color: Color;
}

interface Color {
  red: number;
  green: number;
  blue: number;
}

function setTextColor(text: Text, style: TextStyle) {
  const clonedText = lodash.cloneDeep(text);
  clonedText.style.color = style.color;
  return clonedText;
}
```

事實上 `setTextColor` 不需要用到完整的 `style` 物件來設定 `text` 的顏色，此功能事實上只需要 `style.color` 即可。但目前的設計會讓所有呼叫 `setTextColor` 的程式碼都需要提供一個完整的 `TextStyle` 物件才能順利修改 `text` 的顏色。

建議：盡量讓一個功能只取用真正必要的內容，會讓該功能的泛用性變的更高。以 `setTextColor` 而言，第二個參數只接收 `Color` 型別的資料即可。

### 合理使用泛型

參考以下改寫自書中的範例。下方 `Queue` 被設計成能夠容納各種類型（而不是只能保存 `string` 或 `number`，有限定類型）的資料結構。整個服務中需要此類結構的地方都可複用 `Queue`，不用擔心型別限制。

```ts
class Queue<T> {
  list: T[];

  add(newValue: T) {
    this.list.push(newValue);
  }

  getRandomlyRemoveOneItemList() {
    if (!this.list.length) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * (this.list.length + 1));
    const cloneList = cloneDeep(this.list);
    return cloneList.splice(randomIndex, 1);
  }
}
```

泛型較能對應日後各類使用情境，在設計基礎功能時，若情境允許，則可使用泛型來增加程式碼的被運用的彈性。

## 參考文件

- [Manning: Good Code, Bad Code](https://www.manning.com/books/good-code-bad-code)
