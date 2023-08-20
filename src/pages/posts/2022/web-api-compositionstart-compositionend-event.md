---
layout: '@Components/SinglePostLayout.astro'
title: 2022 第50週 實作筆記：透過 compositionstart/compositionend 來暫停驗證輸入內容
date: 2022-12-16 21:32:29
tag:
  - [React]
---

## 總結

日前實做了一個「僅允許使用者輸入中文字」的 input 欄位，而實際使用時，發現在鍵入注音的過程中會頻繁跳出「輸入內容無效」的提示；最後透過 web api `compositionstart` 以及 `compositionend` 的搭配來達成「使用者輸入注音時，暫停檢查內容」的機制。

![demo](/2022/web-api-compositionstart-compositionend-event/compositionstart-compositionend-demo.gif)

試玩：[DEMO](https://tzynwang.github.io/react-compositionstart-compositionend/)
原始碼：[tzynwang/react-compositionstart-compositionend](https://github.com/tzynwang/react-compositionstart-compositionend/tree/main)

## 筆記

實作上的邏輯非常簡單，僅是「偵測到 `compositionstart` 時，暫停驗證行為；反之當輸入完成（偵測到 `compositionend` 事件後），再透過 `String.prototype.match()` 來判定輸入的內容是否有效。

```tsx
import React, { memo, useRef, useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';

// INFO: 定義好有效字元的 regex，以下內容是允許「所有的中文字元」
const VALID_CHARS_REGEX =
  /^[\u2E80-\u2FD5\u3190-\u319f\u3400-\u4DBF\u4E00-\u9FCC\uF900-\uFAAD]*$/;

function Input1(): React.ReactElement {
  /* States */
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [canVerify, setCanVerify] = useState<boolean>(true);
  const [userInput, setUserInput] = useState<string>('');
  // INFO: 只有在應該要開始驗證的時候，才回傳字元驗證結果，否則一律回傳 true 讓輸入欄位不要出現錯誤與提示文字
  const isValidInput = canVerify ? !!userInput.match(VALID_CHARS_REGEX) : true;

  /* Functions */
  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setUserInput(e.target.value);
  };
  const startVerify = (): void => {
    setCanVerify(true);
  };
  const stopVerify = (): void => {
    setCanVerify(false);
  };

  /* Hooks */
  useEffect(() => {
    const ref = inputRef.current;
    // INFO: 偵測到 compositionstart 時，停止驗證；反之當 compositionend 時，開始內容驗證
    ref?.addEventListener('compositionstart', stopVerify);
    ref?.addEventListener('compositionend', startVerify);
    return () => {
      ref?.removeEventListener('compositionstart', stopVerify);
      ref?.removeEventListener('compositionend', startVerify);
    };
  }, []);

  /* Main */
  return (
    <TextField
      error={!isValidInput}
      fullWidth
      helperText={isValidInput ? '' : '只能輸入中文字'}
      label="輸入一些中文（在你輸入注音時，不會進行內容判定）"
      margin="normal"
      onChange={handleUserInput}
      ref={inputRef}
      value={userInput}
      variant="standard"
    />
  );
}

export default memo(Input1);
```

簡單，但能提升使用者進行中文輸入的體驗。

## 參考文件

- [MDN: Element: compositionstart event](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionstart_event)
- [MDN: Element: compositionend event](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionend_event)
- [String.prototype.match()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match)
