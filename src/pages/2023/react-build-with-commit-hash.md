---
layout: '@Components/pages/SinglePostLayout.astro'
title: 快速筆記：在 React app 取得最新的 git commit sha
date: 2023-06-10 10:09:07
tag:
  - [GitLab]
---

## 總結

在一些因緣際會下收到「在 React app 運行時，希望能看到最新的 git commit sha 與 commit 時間」的需求。此篇筆記會提供兩種實現方式：

1. 使用 npm package `child_process` 來實作（傳統）
2. 透過 GitLab Predefined Variables 來處理（極度簡單）

## 筆記

### 使用 `child_process` 取得 commit hash/time

需注意瀏覽器中不會有 `child_process` ，故下列程式碼需要在 React app 透過 webpack 打包或是透過 devServer 拉起來**之前**執行，再將 `{ hash, time }` 透過 `process.env` 或 webpack DefinePlugin 餵入 React app 中。

```ts
import { execSync } from 'child_process';

export default function getLatestCommitHistory() {
  try {
    const hash = execSync('git rev-parse HEAD').toString().trim();
    const time = execSync('git log -1 --date=iso --format="%ad"').toString();
    return { hash, time };
  } catch (error) {
    console.error('Error getting the latest commit history:::', error);
    return { hash: 'no data', time: 'no data' };
  }
}
```

補充說明：取 `time` 中的 `--date=iso --format="%ad"` 可參考 [git: pretty formats](https://git-scm.com/docs/pretty-formats) ，此二 flag 代表要取得 ISO 格式的 commit 時間。

### 使用 GitLab Predefined Variables

在 GitLab CI/CD pipeline 中，可以直接透過 `CI_COMMIT_SHA` 這個關鍵字來取得觸發該次 pipeline build 的 commit hash。

> GitLab Docs > CI_COMMIT_SHA: The commit revision the project is built for.

```yaml
job1:
  stage: test
  script:
    - echo "The job's commit hash is '$CI_COMMIT_SHA'"
```

## 參考文件

- [git: pretty formats](https://git-scm.com/docs/pretty-formats)
- [GitLab Docs: Predefined variables reference](https://docs.gitlab.com/ee/ci/variables/predefined_variables.html)
