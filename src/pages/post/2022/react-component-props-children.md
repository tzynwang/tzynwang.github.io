---
layout: '@Components/pages/SinglePostLayout.astro'
title: TypeScript 觀摩筆記：React.PropsWithChildren 與 React.FC
date: 2022-09-09 20:22:41
tag:
  - [React]
  - [TypeScript]
---

## 總結

在準備鐵人賽寫作時觀摩了一些 component libs 以及各路前輩的原始碼，發現除了直接在元件 props interface 中列出 `children: React.ReactNode` 外，Type definitions for React 17.0 提供了另外兩種「當元件包含 children 時」的型別定義寫法：`React.FC<T>` 與 `React.PropsWithChildren<T>`

<iframe src="https://codesandbox.io/embed/react-propswithchildren-60j1vv?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="React.PropsWithChildren"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

## 筆記

### React.PropsWithChildren<T>

`children` 由 `React.PropsWithChildren` 提供（且定義為 optional），children 以外的型別定義內容直接傳入 `T` 即可

```tsx
import React, { memo } from 'react';
import type { Property } from 'csstype';

type BaseButton = {
  color: Property.Color;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;
type ButtonProps = React.PropsWithChildren<BaseButton>;

function Button(props: ButtonProps): React.ReactElement {
  /* States */
  const { color, children, type = 'button', ...rest } = props;

  /* Main */
  return (
    <button style={{ color }} type={type} {...rest}>
      {children}
    </button>
  );
}

export default memo(Button);
```

### React.FC<T>

參考 DefinitelyTyped 的型別定義文件可得知 `type FC<P = {}> = FunctionComponent<P>`，兩者可互換

```tsx
import React from 'react';
import type { Property } from 'csstype';

type ButtonProps = {
  color: Property.Color;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
  /* States */
  const { color, type = 'button', children, ...rest } = props;

  /* Main */
  return (
    <button style={{ color }} type={type} {...rest}>
      {children}
    </button>
  );
};

export default Button;
```

注意事項：

- 無法使用 declaration 的形式來宣告元件
- 無法傳入 generic type（參考 [Remove React.FC from Typescript template #8177](https://github.com/facebook/create-react-app/pull/8177)）

## 參考文件

- [DefinitelyTyped/types/react/index.d.ts](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/d076add9f29db350a19bd94c37b197729cc02f87/types/react/index.d.ts)
- [stackOverFlow: TypeScript React.FC<Props> confusion](https://stackoverflow.com/questions/59988667/typescript-react-fcprops-confusion)
