---
title: 2023 第4週 實作筆記：使用 Makefile 搭配 vite 處理 GitHub Pages 部署
date: 2023-01-27 11:10:18
tag:
- [make]
---

## 總結

準備將 vite React App 部署到 GitHub Pages 時發現腳本略長，塞到 `package.json` 的 `scripts` 欄位中不易閱讀，故選擇試用 make 來管理腳本。

## 版本與環境

```
os: macOS Ventura Version 13.0
```

## 筆記

### 關於 make

首次出現在 1976 年的軟體，會讀取特定檔案 `Makefile` 中的內容來建置程式。

> Wikipedia: In software development, Make is a **build automation tool** that automatically builds executable programs and libraries from source code by reading files called `Makefile` which specify how to derive the target program. Though integrated development environments and language-specific compiler features can also be used to manage a build process, Make remains widely used, especially in Unix and Unix-like operating systems.

在前端專案的其中一種應用：可以讓 `package.json` 中的 `scripts` 部分變得簡潔。參考以下內容：

```json
{
  "scripts": {
    "dev": "make dev",
    "build": "make build",
    "preview": "make preview",
    "deploy": "make deploy"
  }
}
```

在終端輸入 `npm run dev` 或是 `make dev` 都能觸發 `dev` 的效果。

原本就簡短的指令（比如 vite template ts-react 中的 `dev` 與 `build` 分別只是 `vite` 與 `tsc && vite build` 這種短組合）換成 `make` 可能沒有什麼顯著優化。但以本次的使用情境（將 vite React App 部署為 GitHub Pages）來說，使用 `Makefile` 來管理腳本的話，就能夠分行撰寫指令，也能從 `.env` 引入變數，提升程式碼的可讀性與維護性。

程式碼與相關說明可參考本文下一段。

### 搭配 vite 部署 GitHub Pages

`Makefile` 放在專案根目錄，部署相關的腳本參考 [vite: Deploying a Static Site](https://vitejs.dev/guide/static-deploy.html#github-pages) 進行改編：

```bash
include .env

# open vite dev server
.PHONY: dev
dev:
	npx vite

# build vite app with production setting
.PHONY: build
build:
	npx tsc && npx vite build

# preview build result locally
.PHONY: preview
preview:
	npx vite preview

# remove build folder and its content
.PHONY: clean
clean:
	rm -rf $(VITE_BUILD_OUTDIR)

# deploy build result to gitHub repo as branch "gh-pages"
.PHONY: deploy
deploy: build
	cd $(VITE_BUILD_OUTDIR) && \
	git init && \
	git remote -v | grep -w origin || git remote add origin git@github.com:<GitHub Account>/<GitHub Repository Name>.git && \
	git branch -m gh-pages && \
	git add -A && \
	git commit -m "[feat] deploy as gh-pages `date +'%Y-%m-%d %H:%M:%S'`" && \
	git push -u origin gh-pages -f
```

`Makefile` 相關解說：

- `include .env`：引入 `.env` 中的環境變數設定，上述程式碼中的 `VITE_BUILD_OUTDIR` 都是在借用環境變數中的內容。
  - [stackOverFlow: How to get a shell environment variable in a makefile?](https://stackoverflow.com/questions/28890634/how-to-get-a-shell-environment-variable-in-a-makefile)
  - [stackOverFlow: How to load and export variables from an .env file in Makefile?](https://stackoverflow.com/questions/44628206/how-to-load-and-export-variables-from-an-env-file-in-makefile)
- `.PHONY`：關鍵字，可避免在執行 `make` 指令時撞名。比如執行 `make dev` 時，預計要執行的是 `dev` 指令，但如果資料夾中有個檔案也叫 `dev` 的話，執行的就會是該 `dev` 檔案。而 `.PHONY` 可確保在跑 `make` 時做的事情是執行指令（而不是執行同名檔案）。

> [gnu.org](https://www.gnu.org/software/make/manual/html_node/Phony-Targets.html): A phony target is one that is not really the name of a file; rather it is just **a name for a recipe to be executed** when you make an explicit request. There are two reasons to use a phony target: to **avoid a conflict with a file of the same name**, and to **improve performance**.

- `deploy: build`：當一個 make target 後面使用冒號串接其他 target 時，則代表「先執行冒號後的 target，再執行冒號前的 target」。在這裡代表執行 `build` 前要先跑完 `build`。

> [Makefile Cheat Sheet](https://bytes.usc.edu/cs104/wiki/makefile/): Dependencies can **either be other targets or file names**; if a target depends on another target, it guarantees that target will be run prior, and if a target depends on a file, it will check to see if that file has changed to avoid executing redundantly. Finally, commands can be anything you could run on your command line.

其他補充：

- 指令分行（比如 `deploy`）：透過 `\` 符號換行，再加上 `&&` 來確保指令會相繼執行，可參考 [stackOverFlow: How do I write the 'cd' command in a makefile?](https://stackoverflow.com/questions/1789594/how-do-i-write-the-cd-command-in-a-makefile)
- `git remote -v | grep -w origin || git remote add origin git@github.com:<GitHub Account>/<GitHub Repository Name>.git` 的意思是：如果 git remote 清單中沒有名為 `origin` 的 remote，則追加此 git remote 且命名為 `origin`，參考 [Add git remote only if it doesn't exist](https://stackoverflow.com/questions/57935486/add-git-remote-only-if-it-doesnt-exist)
- 在 git message 中插入當下時間（`date +'%Y-%m-%d %H:%M:%S'`）的完整說明可參考 [stackOverFlow: How to set current date as git commit message](https://stackoverflow.com/questions/4654437/how-to-set-current-date-as-git-commit-message)

## 參考文件

- [GNU Make](https://www.gnu.org/software/make/)
- [Wikipedia: Make (software)](<https://en.wikipedia.org/wiki/Make_(software)>)
- [freeCodeCamp: Want to know the easiest way to save time? Use `make`!](https://www.freecodecamp.org/news/want-to-know-the-easiest-way-to-save-time-use-make-eec453adf7fe/)
- [medium: Makefiles for Frontend](https://medium.com/finn-no/makefiles-for-frontend-1779be46461b)
- [marmelab: Self-Documented Makefile](https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html)
