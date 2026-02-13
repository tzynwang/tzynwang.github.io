---
title: 「從零開始React Todo List with TypeScript」相關筆記
date: 2021-11-12 14:52:46
tag:
  - [React]
---

## 總結

從零開始使用 TypeScript 建立 React Todo APP，搭配 Firebase（資料 CRUD）與 Chakra UI（明暗模式）

- React: useState, useRef, useMemo, useEffect
- Chakra UI: ChakraProvider, ColorModeScript, useColorMode

Firebase 免費流量一下就玩爆了，故未部署上 GitHub Page，repo 如右：[https://github.com/tzynwang/react-todo](https://github.com/tzynwang/react-todo)

## 版本

```
react: 17.0.2
typescript: 4.4.4
firebase: 9.4.0
@chakra-ui/react: 1.6.12
```

## 建立流程

1. `npx create-react-app <app-name> --template typescript`
1. 確認 tsconfig.json 的`strict`設定為`true`

- [strict](https://www.typescriptlang.org/tsconfig#strict): The `strict` flag enables a wide range of type checking behavior that results in stronger guarantees of program correctness. Turning this on is equivalent to **enabling all of the strict mode family options**.
- `strictBindCallApply`, `strictFunctionTypes`, `strictNullChecks`, `strictPropertyInitialization`, `useUnknownInCatchVariables`, `alwaysStrict`, `noImplicitAny`, `noImplicitThis`

1. 本次一併練習朋友推薦的 Chakra UI，安裝指令如右：`npm i @chakra-ui/react @emotion/react@^11 @emotion/styled@^11 framer-motion@^4`
1. 透過 React Icons 使用 Material Design icons，安裝指令如右：`npm install react-icons`，import statement 為`import { IconName } from "react-icons/md";`
1. 追加 Firebase 來進行資料 CRUD 時的安裝指令如右（版本參考[官方文件](https://firebase.google.com/docs/firestore/quickstart#set_up_your_development_environment)）：`npm install firebase@9.4.1 --save`

## Chakra light/dark mode

- `ChakraProvider`與`ColorModeScript`放在`index.tsx`中

  ```ts
  // index.tsx
  // 前略
  import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
  import theme from './theme';

  ReactDOM.render(
    <React.StrictMode>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <App />
      </ChakraProvider>
    </React.StrictMode>,
    document.getElementById('root')
  );
  ```

- `theme.ts`內容如下：

  ```ts
  // theme.ts
  import { extendTheme, ThemeConfig } from "@chakra-ui/react";

  const config: ThemeConfig = {
    initialColorMode: "light",
    useSystemColorMode: false,
  };
  const theme = extendTheme({ config });

  export default theme;
  ```

- `App.tsx`中實作 light/dark mode 切換如下，直接 import `useColorMode`後呼叫`toggleColorMode`來執行 mode switch：

  ```ts
  // App.tsx
  import { useColorMode } from '@chakra-ui/react';

  const App = () => {
    // 前略
    const { colorMode, toggleColorMode } = useColorMode();

    // 中略
    return (
      <IconButton
        aria-label="Switch theme"
        isRound={true}
        icon={colorMode === 'light' ? <MdModeNight /> : <MdLightMode />}
        onClick={toggleColorMode}
      />
    );
  };
  ```

- [Chakra Color Mode](https://chakra-ui.com/docs/features/color-mode): To get dark mode working correctly, you need to do two things:
  1. **Update your theme config** to determine how Chakra should manage color mode updates.
  1. **Add the `ColorModeScript` to your application**, and set the initial color mode your application should start with to either `light`, `dark` or `system`. It is `light` by default. For Create React App, you need to **add the `ColorModeScript` to the `index.js` file**.
- [Chakra useColorMode](https://chakra-ui.com/docs/features/color-mode#usecolormode): `useColorMode` is a React hook that gives you **access to the current color mode**, and **a function to toggle the color mode**.

## React 部分

### useRef

- 用來處理「使用者新增完一筆 todo 後，需自動 focus 回輸入框」的行為
- 相關段落如下：

  ```ts
  // App.tsx
  const inputEl = useRef<null | HTMLInputElement>(null);

  const handleTodos = async () => {
    if (userInput.trim().length) {
      setTodos([
        ...todos,
        { id: uuidv4(), content: userInput, edit: false, done: false },
      ]);

      setUserInput('');
      if (inputEl.current) inputEl.current.focus();

      await addDoc(firebaseTodoRef, {
        content: userInput,
        edit: false,
        done: false,
      });
    }
  };

  return (
    // 部分略
    <TodoInput
      userInput={userInput}
      handleUserInput={handleUserInput}
      inputEl={inputEl}
      handleTodos={handleTodos}
    />
  );
  ```

  ```ts
  // TodoInput.tsx
  import {
    VStack,
    InputGroup,
    Input,
    InputRightElement,
    Button,
  } from '@chakra-ui/react';

  const TodoInput = ({
    userInput,
    inputEl,
    handleUserInput,
    handleTodos,
  }: {
    userInput: string;
    inputEl: React.MutableRefObject<HTMLInputElement | null>;
    handleUserInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleTodos: () => void;
  }) => {
    return (
      <VStack py={6}>
        <InputGroup>
          <Input
            placeholder="to do?"
            value={userInput}
            onChange={handleUserInput}
            ref={inputEl}
            autoFocus
          />
          <InputRightElement w="6rem">
            <Button size="sm" onClick={handleTodos}>
              Add todo
            </Button>
          </InputRightElement>
        </InputGroup>
      </VStack>
    );
  };

  export default TodoInput;
  ```

### useMemo

- [Official docs](https://reactjs.org/docs/hooks-reference.html#usememo):
  `const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);`
  - Returns a memoized value.
  - Pass a “create” function and an array of dependencies. `useMemo` will only **recompute the memoized value when one of the dependencies has changed**. This optimization helps to avoid expensive calculations on every render.
- 用來計算 todos 的陣列長度，判斷是否需顯示「全部做完」或「未有任何待辦事項」的相關提示訊息；感覺與 Vue 的 computed 類似
- 相關段落如下：

  ```ts
  // App.tsx
  // number of pending todos
  const left = useMemo(
    () => todos.filter((todo) => todo.done !== true).length,
    [todos]
  )

  // number of total todos
  const qty = useMemo(() => todos.length, [todos])

  const status = useMemo(() => {
    // all todos are done
    if (!left && qty) {
      return 'success'
    }
    // no todos
    if (!qty) {
      return 'warning'
    }
  }, [left, qty])

  const message = useMemo(() => {
    if (!left && qty) {
      return 'All todos are done!'
    }
    if (!qty) {
      return 'Nothing todo.'
    }
  }, [left, qty])

  return (
  // 部分略
    {status && (
      <Alert status={status} mb={6}>
        <AlertIcon />
        {message}
      </Alert>
    )}
  )
  ```

### useEffect

- [React AJAX and APIs](https://reactjs.org/docs/faq-ajax.html): You should populate data with AJAX calls in the `componentDidMount` lifecycle method; equivalent with `useEffect`
- 在與 Firebase 連線處理 CRUD 後，於 useEffect 內抓取資料（與 Firebase 連線前直接透過 useState 解決）
- 相關段落如下：

  ```ts
  // App.tsx
  const firebaseTodoRef = collection(db, "todos");
  useEffect(() => {
    const getFirebaseTodo = async () => {
      try {
        const snapshots = await getDocs(firebaseTodoRef);
        const results: {
          id: string;
          content: string;
          edit: boolean;
          done: boolean;
        }[] = snapshots.docs.map((doc) => ({
          id: doc.id,
          content: doc.data().content,
          edit: doc.data().edit,
          done: doc.data().done,
        }));
        setTodos(results);
      } catch (e) {
        console.error(e);
      }
    };
    getFirebaseTodo();
  }, [firebaseTodoRef]);
  ```

  ```ts
  // service/firebase.ts
  import { initializeApp } from "firebase/app";
  import { getFirestore } from "firebase/firestore/lite";

  const firebaseConfig = {
    apiKey: "xxx",
    // skip the data parts...
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  export default db;
  ```

## 參考文件

- [React Hooks API Reference](https://reactjs.org/docs/hooks-reference.html)
- [Get started with Cloud Firestore](https://firebase.google.com/docs/firestore/quickstart)
- [YouTube: CRUD Tutorial Using React + Firebase | Firebase 9 and Firestore Tutorial](https://www.youtube.com/watch?v=jCY6DH8F4oc&t=1420s)
