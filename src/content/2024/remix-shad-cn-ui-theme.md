---
title: 工作筆記：在 remix 中根據系統外觀（system appearance）更新 shadcn/ui 的主題（theme）
date: 2024-12-21 19:06:33
tag:
  - [Remix]
banner: /2024/remix-shad-cn-ui-theme/jim-niakaris-f62RBhbXn8M-unsplash.jpg
summary: 這篇筆記說明了如何在 remix app 中預設 shadcn/ui 參照系統外觀，並在使用者切換系統外觀時同步切換整個介面的主題。
draft:
---

最近開始研究如何在服務中導入 shadcn/ui 來搭配 tailwind，研究途中順便記錄一下如何讓 shadcn/ui 元件能對應系統外觀進行淺、深色模式變化。~~我自己是覺得[官方版本的 Remix 實作說明](https://ui.shadcn.com/docs/dark-mode/remix)複雜的有點沒必要啦~~ 🌚

懶人包：

- 透過 `window.matchMedia` 監聽使用者是否切換了系統外觀
- 透過 react 的 `createContext` 將 shadcn/ui 的 theme 傳遞給整個 app

## 程式碼

### useShadCnTheme

這個 custom hook 的目的是「當使用者切換系統外觀時，同步更新 shadcn/ui 的主題」。

在第一個 `useEffect` 中，監聽 `window.matchMedia` 的 `change` 事件來得知使用者是否切換了系統外觀；捕捉到切換事件時，則根據當下的系統外觀更新局部變數 `theme` 的值。而第二個 `useEffect` 會在 `theme` 變化時，設定 `window.document.documentElement.classList` 為 `light` 或 `dark`；比如當使用者將系統外觀切換為深色模式時，文件根節點就會變成 `<html lang="zh-hant-TW" class="dark">`。

最後此 hook 會將 `theme` 回傳出來，以便和 `createContext()` 建立的 `ThemeProviderContext` 搭配使用。

```tsx
import { createContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

export default function useShadCnTheme() {
  /* data */
  const [theme, setTheme] = useState<Theme>("system");
  /* hook */
  useEffect(() => {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        setTheme(e.matches ? "dark" : "light");
      });
  }, []);
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
      return;
    }
    root.classList.add(theme);
  }, [theme]);
  /* main */
  return theme;
}

type ThemeProviderState = {
  theme: Theme;
};

export const ThemeProviderContext = createContext<ThemeProviderState>({
  theme: "system",
});
```

### root.tsx

這裡要做的事情很簡單，把 `useShadCnTheme` 回傳的 `theme` 餵給 `ThemeProviderContext.Provider` 即可。之後當使用者切換系統外觀時，整個 app 的 shadcn/ui 元件顏色也會跟著調整。

```tsx
import { Outlet } from "@remix-run/react";
import useShadCnTheme, {
  ThemeProviderContext,
} from "app/hooks/use_shad_cn_theme";

export default function App() {
  /* data */
  const theme = useShadCnTheme();
  /* main */
  return (
    <ThemeProviderContext.Provider value={{ theme }}>
      <Outlet />
    </ThemeProviderContext.Provider>
  );
}
```

## 其他設定

`tailwind.css` 大概長這樣（`:root` 和 `.dark` 的變數是在 [ui.shadcn.com/themes](https://ui.shadcn.com/themes) 產生的，選擇的主色是 `violet`）：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 224 71.4% 4.1%;
    --card: 0 0% 100%;
    --card-foreground: 224 71.4% 4.1%;
    --popover: 0 0% 100%;
    --popover-foreground: 224 71.4% 4.1%;
    --primary: 262.1 83.3% 57.8%;
    --primary-foreground: 210 20% 98%;
    --secondary: 220 14.3% 95.9%;
    --secondary-foreground: 220.9 39.3% 11%;
    --muted: 220 14.3% 95.9%;
    --muted-foreground: 220 8.9% 46.1%;
    --accent: 220 14.3% 95.9%;
    --accent-foreground: 220.9 39.3% 11%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 20% 98%;
    --border: 220 13% 91%;
    --input: 220 13% 91%;
    --ring: 262.1 83.3% 57.8%;
    --radius: 0rem;
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
  }

  .dark {
    --background: 224 71.4% 4.1%;
    --foreground: 210 20% 98%;
    --card: 224 71.4% 4.1%;
    --card-foreground: 210 20% 98%;
    --popover: 224 71.4% 4.1%;
    --popover-foreground: 210 20% 98%;
    --primary: 263.4 70% 50.4%;
    --primary-foreground: 210 20% 98%;
    --secondary: 215 27.9% 16.9%;
    --secondary-foreground: 210 20% 98%;
    --muted: 215 27.9% 16.9%;
    --muted-foreground: 217.9 10.6% 64.9%;
    --accent: 215 27.9% 16.9%;
    --accent-foreground: 210 20% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 20% 98%;
    --border: 215 27.9% 16.9%;
    --input: 215 27.9% 16.9%;
    --ring: 263.4 70% 50.4%;
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
  }
}

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground font-sans antialiased;
  }
}

html,
body {
  @media (prefers-color-scheme: dark) {
    color-scheme: dark;
  }
}
```

然後作為 shadcn/ui 設定檔的 `components.json` 長這樣（注意 `baseColor` 有搭配 `tailwind.css` 的 `:root` / `.dark` 變數同步改為 `violet`）：

```json
{
  "style": "default",
  "rsc": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "app/tailwind.css",
    "baseColor": "violet",
    "cssVariables": true
  }
}
```

## 參考文件

- [shadch/ui Dark mode: Vite](https://ui.shadcn.com/docs/dark-mode/vite)
- [shadch/ui Theming](https://ui.shadcn.com/docs/theming)
