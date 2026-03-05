---
title: 葫蘆裡的 React：關於組件（components）與元素（elements）
date: 2024-01-08 08:05:59
tag:
  - [React]
banner: /2024/react-under-the-hood-components-elements-and-instances/luis-aguila-xLvIcAYuuMQ-unsplash.jpg
summary: 你知道嗎？對 React 來說，組件（components）、組件實例（components instances）和元素（elements）這三者是不同的東西唷 🌚
draft:
---

## 元素不是組件

組件（components）、組件實例（components instances）和元素（elements）在 React 各自代表不同的意義。

組件（components）是你透過 React 定義的 `<Button />`，它會有自己的局部狀態（local states）。而組件實例（components instances）則是指 React 幫你建立、在整個前端服務各處實際使用的 `<Button />` 們。

> For example, you may declare a **`Button` component** by creating a class. When the app is running, you may have several **instances of this component** on screen, each with its own properties and local state.

傳統的物件導向風格介面函式庫（例如 Backbone）會由組件實例直接處理 DOM 節點的增刪改。一個組件實例也要負責控制它的子代組件實例。

> Each component instance has to keep references to its DOM node and to the instances of the children components, and create, update, and destroy them when the time is right.

比如以下的虛擬碼：

```js
class Form extends TraditionalObjectOrientedView {
  render() {
    // Read some data passed to the view
    const { isSubmitted, buttonText } = this.attrs;

    if (!isSubmitted && !this.button) {
      // Form is not yet submitted. Create the button!
      this.button = new Button({
        children: buttonText,
        color: "blue",
      });
      this.el.appendChild(this.button.el);
    }

    if (this.button) {
      // The button is visible. Update its text!
      this.button.attrs.children = buttonText;
      this.button.render();
    }

    if (isSubmitted && this.button) {
      // Form was submitted. Destroy the button!
      this.el.removeChild(this.button.el);
      this.button.destroy();
    }

    if (isSubmitted && !this.message) {
      // Form was submitted. Show the success message!
      this.message = new Message({ text: "Success!" });
      this.el.appendChild(this.message.el);
    }
  }
}
```

問題是——組件的狀態越來越多，程式碼也會越來越長。且讓組件實例直接控管其子代也讓我們難以降低組件親子之間的耦合性。於是 React 透過「元素（elements）」來解決這些問題。

## 關於元素（element）

React 對元素的定義：一個描述「組件實例或 DOM 節點」的 JavaScript 物件。

此物件會記錄「組件的類型（type）」與「組件的性質（properties）」——那些要實際呈現在畫面上的內容。

元素是不可變的（immutable）。它像是電影中的一幀畫面，描述了前端服務「在某個時間點」的模樣。如果想改變畫面，唯一的方法就是建立一個新的（元素）。但請注意：元素只負責「描述」，後續是由 `react-dom` 處理**比較**新舊（元素）差異與**更新**畫面的工作。

> React DOM compares the element and its children to the previous one, and only applies the DOM updates necessary to bring the DOM to the desired state.

> React DOM takes care of updating the DOM to match the React elements.

---

元素可以描述 DOM 節點，也可以描述 React 組件。它其實就是組件最終回傳的內容。

> An element is a **plain object** describing a **component instance or DOM node** and its desired **properties**. An element is not an actual instance, it is a way to tell React **what you want to see on the screen**.

組件的類型（`type`）會是 `string` 或 `ReactClass` 型別的資料。

### DOM Element

當一個元素的組件類型資料是字串（string）時，代表此元素描述的是 DOM 節點。比如下方的元素就在描述一個 HTML 按鈕：

```js
{
  type: 'button',
  props: {
    className: 'button button-blue',
    children: {
      type: 'b',
      props: {
        children: 'OK!'
      }
    }
  }
}
```

```html
<button class="button button-blue">
  <button> OK! </b>
</button>
```

注意：我們在 `props.children` 中包了另外一個元素（`type: b`），這就是 React 記錄子代元素的方式。

### Component Element

當組件的類型是函式（function）或類（class）時，代表該元素描述的是 React 組件。這時 React 會去查詢該函式（或該類）實際上代表怎樣的 DOM 節點。

```js
{
  type: Button,
  props: {
    color: 'blue',
    children: 'OK!'
  }
}
```

以上方 snippet 中的 `type: Button` 為例，當 React 看到此元素時，它會去查詢 `Button` 究竟代表什麼東西，而 `type: Button` 會回覆以下內容：

```js
{
  type: 'button',
  props: {
    className: 'button button-blue',
    children: {
      type: 'b',
      props: {
        children: 'OK!'
      }
    }
  }
}
```

React 會重複以上的查詢流程，直到它確認完元素內的所有內容。

#### 透過 props.children 解除耦合

我們能在 `props.children` 中混合使用 DOM 節點與 React 組件：

```jsx
const DeleteAccount = () => ({
  type: 'div',
  props: {
    children: [{
      type: 'p',
      props: {
        children: 'Are you sure?'
      }
    }, {
      type: DangerButton,
      props: {
        children: 'Yep'
      }
    }, {
      type: Button,
      props: {
        color: 'blue',
        children: 'Cancel'
      }
   }]
});

// the above is equivalent to:
const DeleteAccount = () => (
  <div>
    <p>Are you sure?</p>
    <DangerButton>Yep</DangerButton>
    <Button color='blue'>Cancel</Button>
  </div>
);
```

這解決了組件親子耦合的問題，因為元素是透過 `props.children` 來描述組件之間的關係。我們不用在這邊關注實際的 DOM 結構。

> This lets you compose independent parts of UI **without relying on their internal DOM structure**.

## 關於組件（component）

組件收受參數（稱為 `props`），回傳元素（element）。且 React 組件必須遵從純函式（pure function）的規則——它不能修改收到的 `props`。

本篇筆記最上方的物件導向風味 `Form` 如果是一個 React 組件，那它就會回傳以下~~大幅簡化過的~~內容：

```js
const Form = ({ isSubmitted, buttonText }) => {
  if (isSubmitted) {
    // Form submitted! Return a message element.
    return {
      type: Message,
      props: {
        text: "Success!",
      },
    };
  }

  // Form is still visible! Return a button element.
  return {
    type: Button,
    props: {
      children: buttonText,
      color: "blue",
    },
  };
};
```

## React 的工作

當我們使用 React 時，實際上發生的事情如下：

1. 我們定義組件（components）
2. 組件回傳元素（elements）
3. 由 React 負責增刪改（管理）組件實例（instances）

> We let React create, update, and destroy instances. We describe them with elements we return from the components, and **React takes care of managing the instances**.

## 參考文件

- [Glossary of React Terms](https://legacy.reactjs.org/docs/glossary.html)
- [React Components, Elements, and Instances](https://legacy.reactjs.org/blog/2015/12/18/react-components-elements-and-instances.html)
- [Rendering Elements](https://legacy.reactjs.org/docs/rendering-elements.html)
- [Components and Props](https://legacy.reactjs.org/docs/components-and-props.html)
