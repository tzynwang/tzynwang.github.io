---
layout: '@Components/SinglePostLayout.astro'
title: 「git stop tracking files」相關筆記
date: 2021-05-22 13:47:48
tag:
  - [git]
---

## 總結

- 如果在`.gitignore`建立前就已經讓 git 追蹤（tracking）該檔案的話，即使後來將該檔案加入`.gitignore`清單內，也**不會讓 git 自動停止追蹤該檔案**
- 可使用`git rm --cached <該檔案>`讓 git 僅停止追蹤，且不從硬碟中移除該檔案

## 環境

```
git: 2.30.0.windows.2
os: Windows_NT 10.0.18363 win32 x64
```

## 筆記

### 注意事項

- 若該檔案是在「已經被 git 追蹤」的情況下被加到.gitignore，git 不會自動停止追蹤該檔案；官方文件說明如下：

  > A gitignore file specifies intentionally untracked files that Git should ignore. **Files already tracked by Git are not affected.**

  > The purpose of gitignore files is to ensure that **certain files not tracked by Git remain untracked**. To stop tracking a file that is currently tracked, use `git rm --cached`.

- 透過`git rm --cached <不想要繼續被git追蹤的檔案>`並執行`git commit`與`git push`後，若該檔案已經被推至 GitHub 等儲存空間，該檔案會被刪除

### 流程

參考 Remove a folder from git tracking 討論串中[lukehillonline 的回覆](https://stackoverflow.com/a/54481162/15028185)，以下是「使 git 停止追蹤某檔案，但不使該檔案從硬碟中被移除」的流程：

1. 備份該檔案，並將備份移動到 git 不會追蹤到的資料夾外
1. 執行`git rm --cached <不想要繼續被git追蹤的檔案>`、`git commit`與`git push`
1. 將該檔案加入`.gitignore`清單內
1. 如果需要的話，將該檔案移動回資料夾中

### 補充

在部分討論串中看到`git rm -r --cached <filename>`的指令，其中的`-r`意義如下：

> Allow **recursive removal** when a leading directory name is given.

出處：[git official documentation: rm](https://git-scm.com/docs/git-rm#Documentation/git-rm.txt--r)

## 參考文件

- [StackOverFlow: Remove a folder from git tracking](https://stackoverflow.com/questions/24290358/remove-a-folder-from-git-tracking/)
- [git official documentation: gitignore](https://git-scm.com/docs/gitignore/2.22.0)
