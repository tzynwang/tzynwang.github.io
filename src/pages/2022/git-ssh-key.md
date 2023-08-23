---
layout: '@Components/pages/SinglePostLayout.astro'
title: SSH Keys for GitHub
date: 2022-02-22 20:01:32
tag:
  - [git]
---

## 總結

> GitHub Docs About SSH: With SSH keys, you can connect to GitHub without supplying your username and personal access token at each visit.

使用 SSH key 可以在不輸入 username 與密碼的情況下操作 GitHub/GitLab 的 repo
本篇筆記乃為記錄在 Mac 產生 SSH key 的流程

## 步驟

1. 開啟 terminal 後，輸入 `ssh-keygen -t ed25519 -C "your@email.here"`

   - `ed25519` 是產生 SSH key 的演算法
   - 若不需要搭配 email 產生 key 則 `-C "your@email.here"` 此 flag 與 email 一起移除

2. 出現 `"Enter a file in which to save the key,”` 訊息後，可直接按下 Enter 使用預設的檔案名稱保存 SSH key 或輸入自訂的檔案名稱來進行儲存
3. `secure passphrase` 可選擇略過不輸入
4. `cd ~/.ssh` 後 `ls` 查看資料夾內容，應會有一組檔案 `id_ed25519` 與 `id_ed25519.pub` 以及 `config`，若沒有 `config` 則輸入 `touch ~/.ssh/config` 建立一個
   - `id_ed25519` 的內容是私鑰，而 `.pub` 檔案裡面保存的則是公鑰
   - [Pro Git book](https://git-scm.com/book/en/v2/Git-on-the-Server-Generating-Your-SSH-Public-Key): The `.pub` file is your public key, and the other file is the corresponding private key.
5. 在 terminal 輸入 `open ~/.ssh/config` 後，於檔案內貼入以下內容，注意最後一行的 `IdentityFile` 檔案名稱（`id_ed25519`）要與前面步驟建立的 SSH key 檔案名稱一致

   ```
   Host *
     AddKeysToAgent yes
     IdentityFile ~/.ssh/id_ed25519
   ```

6. 於 terminal 輸入 `cat ~/.ssh/id_ed25519.pub`  檢視公鑰內容並將 SSH key 複製起來，或也可輸入 `pbcopy < ~/.ssh/id_ed25519.pub` 直接複製 SSH key 內容；注意「`id_ed25519.pub`」要與前面步驟建立的 SSH key 檔案名稱一致
7. 把 SSH key 貼到 GitHub/GitLab SSH Key 中，並注意之後需使用 GitHub/GitLab 的 SSH url 來 clone 或是 push 等指令（而非使用 HTTPS url）

![use SSH url to clone the repo](/2022/git-ssh-key/git-clone-ssh.png)

## 參考文章

- [GitHub Docs: About SSH](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/about-ssh)
- [Pro Git book 4.3 Git on the Server - Generating Your SSH Public Key](https://git-scm.com/book/en/v2/Git-on-the-Server-Generating-Your-SSH-Public-Key)
- [GitHub Docs: Generating a new SSH key and adding it to the ssh-agent](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)
- [GitHub Docs: Adding a new SSH key to your GitHub account](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)
