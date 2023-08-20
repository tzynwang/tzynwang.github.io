---
layout: '@Components/SinglePostLayout.astro'
title: 「用TS改寫幼兒難度的React App」相關筆記
date: 2021-11-05 13:00:44
tag:
  - [React]
  - [TypeScript]
---

## 總結

快速入門 React 後，將其 JS 部分改為 TypeScript，記錄下相關筆記以及轉換途中遇到的坑
另外因為已經學過 Vue，故以下筆記會包含一些與 Vue 類似或相異的比較

JS 版原始碼：[https://github.com/tzynwang/react-practice/tree/speed-converter](https://github.com/tzynwang/react-practice/tree/speed-converter)
TS 版原始碼：[https://github.com/tzynwang/react-practice/tree/speed-converter-ts](https://github.com/tzynwang/react-practice/tree/speed-converter-ts)

教材內容取自：[從 Hooks 開始，讓你的網頁 React 起來](https://ithelp.ithome.com.tw/users/20103315/ironman/2668)

## 版本

```
react: 17.0.2
typescript: 4.4.4
```

## React 部分

- React components are regular JavaScript functions, but their **names must start with a capital letter** or they won’t work! 作為**元件**的 function 其名稱一定要**大寫開頭**

### JSX

- 基本上接收任何資料（strings, numbers, and other **JavaScript expressions**），需注意在進行條件判斷的時候只能使用 expressions

  ```jsx
  App = () => {
    const [userInput, setUserInput] = useState(0);
    const handleUserInput = (e) => {
      setUserInput(e.target.value);
    };

    return (
      <div className="container">
        <div className="card-header">Network Speed Converter</div>
        <div className="card-body">
          <UnitControl />
          <UnitConverter
            userInput={userInput}
            handleUserInput={handleUserInput}
          />
        </div>
        <CardFooter userInput={userInput} />
      </div>
    );
  };
  ```

  ```jsx
  const UnitConverter = ({ userInput, handleUserInput }) => {
    return (
      {/* 略 */}
      <input
        type="number"
        className="input-number"
        min="0"
        value={userInput}
        autoFocus
        onChange={handleUserInput}
      />
      {/* 略 */}
    )
  }
  ```

  `handleUserInput`透過 props 傳給`UnitConverter`元件，`UnitConverter`在 onChange 事件發生時，即可透過`handleUserInput`修改`userInput`的值

- 放 CSS Object 的話就多包一層`{}`
  ```jsx
  const TodoList = () => {
    return (
      <ul
        style={{
          backgroundColor: 'black',
          color: 'pink',
        }}
      >
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    );
  };
  ```
- JSX looks like HTML, but under the hood it is transformed into **plain JavaScript objects**. You can’t return two objects from a function without wrapping them into an array. This explains why you also can’t return two JSX tags without wrapping them into another tag or a fragment. 每個 react 元件只能回傳單一內容，超過一個元素請用`<></>`包起來；不能回傳超過一個元素是因為這些元件最後會被轉為 JS Object，複數個元素在 return 時一定要打包成單一元素
- JSX requires tags to be explicitly closed: self-closing tags like `<img>` must become `<img />`, and wrapping tags like `<li>oranges` must be written as `<li>oranges</li>`. 所有的**HTML 元素一定要 closed**（舉例：`<br>`要改寫為`<br />`）
- JSX turns into JavaScript and **attributes written in JSX become keys** of JavaScript objects.

### useState()

- Returns a stateful value, and **a function to update it**.
- 放到`useState(...)`裡的變數才會被 React 追蹤，概念類似資料要放在`data()`中才會被 Vue 追蹤、修改後才會跟著驅動畫面更新

## 改裝為 TS

### 將 TS 加入專案中

透過以下手續將原本是 JS 的 React 專案改為 TS 版本：

1. `npm install --save typescript @types/node @types/react @types/react-dom @types/jest`
1. package.json 中的`scripts/build`內容改為`tsc`
1. `npx tsc --init`
1. 根據實際情況調整 tsconfig.json 中`rootDir`與`rootDir`的設定（官方文件預設為`src`與`build`）
1. 設定`jsx`為`preserve`（參考討論串：[Error when opening TSX file: Cannot use JSX unless '--jsx' flag is provided](https://github.com/Microsoft/vscode/issues/15814)）
1. `.js`副檔名改為`.ts`或`.tsx`（enable JSX with TypeScript，參考[TS 官方文件](https://www.typescriptlang.org/docs/handbook/jsx.html)）

完整說明參考 React 官方文件：[Adding TypeScript to a Project](https://reactjs.org/docs/static-type-checking.html#adding-typescript-to-a-project)
備註：如果是要從零開始一個 React+TS 專案的話，直接`npx create-react-app <app-name> --template typescript`即可

### 將原始碼改為 TS

- 偷吃步：在 vs code 中如果不知道該 event 的類型，可以在`{}`中寫出 e 然後透過滑鼠 hover 來查看 event 類型
  ![peek event type](/2021/react-app-to-typescript/peek-event-type.png)
- 需注意：在透過`e.target.value`取使用者輸入的值（`value`）的時候，取到的`value`會是`string`型態資料
  - [MDN `<input>` element value](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-value): It can be altered or retrieved at any time using JavaScript to **access the respective `HTMLInputElement` object's value property**.
  - [MDN `HTMLInputElement` value property](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement): It is **string**, returns / sets the current value of the control.
  - 所以`handleUserInput`在改寫成 TS 版加上的 type 必須為`string`：
  ```jsx
  const handleUserInput = (e: ChangeEvent<{ value: string }>) => {
    const rawInput = Number(e.target.value);
    if (isNaN(rawInput)) return;
    setUserInput(rawInput);
  };
  ```
- 在將 function `handleUserInput`透過 props 傳給元件`UnitConverter`的時候想不通「function 的類型究竟是什麼」，透過關鍵字搜尋後發現與其說是 function 的「type」是什麼，不如說是告訴 TS「這個 function 的 shape 是什麼形狀」

  ```jsx
  // in UnitConverter.tsx

  interface propsType {
    userInput: number
    // handleUserInput的形狀是：接受e做為參數傳入，並「不回傳」任何值，所以 => void
    handleUserInput: (e: ChangeEvent<{ value: string }>) => void
  }

  const UnitConverter = ({ userInput, handleUserInput }: propsType) => {
    return (
      {/* 略 */}
      <input
        type="number"
        className="input-number"
        min="0"
        value={userInput}
        autoFocus
        onChange={handleUserInput}
      />
      {/* 略 */}
    )
  }
  ```

  參考討論串：「[How to define type for a function callback (as any function type, not universal any) used in a method parameter](https://stackoverflow.com/questions/29689966/how-to-define-type-for-a-function-callback-as-any-function-type-not-universal)」

- 使用 deconstruct 技巧處理 props 又必須給予 type 時，可使用以下寫法：

  ```jsx
  const CardFooter = (props: { userInput: number }) => {
    /* 略 */
  };
  ```

  或是這樣：

  ```jsx
  const CardFooter = ({ userInput }: { userInput: number }) => {
    /* 略 */
  };
  ```

  或是這樣：

  ```jsx
  interface userInputType {
    userInput: number;
  }

  const CardFooter = ({ userInput }: userInputType) => {
    /* 略 */
  };
  ```

  以上做的都是「設定 props 中 userInput 的類型為`number`」同一件事情

### 關於 React.FC

參考 React+TypeScript Cheatsheets，小總結：不建議使用`React.FC`，可改用`React.VFC`；`React.FC`與一般 function 不同的部分如下列：

- `React.FunctionComponent` is **explicit about the return type**, while the normal function version is implicit (or else needs additional annotation).
- 引用自 PJ：`React.FC`會明確定義 Function Component 回傳的型別一定要是`JSX.Element`或`null`而不能是`undefined`。
- It **provides typechecking and autocomplete** for static properties like `displayName`, `propTypes`, and `defaultProps`. Note that there are some known issues using `defaultProps` with `React.FunctionComponent`.
- It provides an implicit definition of children - however there are some issues with the implicit children type (e.g. DefinitelyTyped#33006), and it might be better to be explicit about components that consume children, anyway.
- 引用自 PJ：`React.FC`會自動接受`children`作為可以傳入的 props，即使在這個 React 元件中並不會使用到`children`。

## 補充

### named export, default export

- If a module defines a **default export**, then you can import that default export by **omitting the curly braces**.
  ```javascript
  // foo.js
  export default function foo() {
    console.log('hello!');
  }
  ```
  ```javascript
  import foo from 'foo';
  foo(); // hello!
  ```
- A file can have **no more than one _default_ export**, but it can have **as many _named_ exports as you like**. export default 只能有一個，但 named exports 可以有無數個
- When you write a **_default_ import**, you can put **any name** you want after `import`. For example, you could write `import Banana from './button.js'` instead and it would still provide you with the same default export.
- In contrast, with **named imports, the name has to match on both sides**. That’s why they are called _named_ imports!

![export](/2021/react-app-to-typescript/export.jpg)

## 參考文件

- [[掘竅] 了解這些，更快掌握 TypeScript 在 React 中的使用（Using TypeScript in React）](https://pjchender.blogspot.com/2020/07/typescript-react-using-typescript-in.html)
- [React+TypeScript Cheatsheets](https://github.com/typescript-cheatsheets/react#readme)
- [transform HTML to JSX](https://transform.tools/html-to-jsx)
