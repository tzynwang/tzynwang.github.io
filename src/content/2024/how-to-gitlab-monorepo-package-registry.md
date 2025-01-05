---
title: 工作筆記：GitLab monorepo package registry/install
date: 2024-12-07 13:14:52
tag:
- [GitLab]
- [monorepo]
banner: /2024/how-to-gitlab-monorepo-package-registry/falco-negenman-nipCGHE-M98-unsplash.jpg
summary: 記錄一下將 monorepo 的其中一個 package 發布成私人 GitLab 套件，以及安裝私人 GitLab 套件的步驟。
draft: 
---

提醒：

1. 完整教學請參考官方文件 [npm packages in the package registry](https://docs.gitlab.com/ee/user/packages/npm_registry/index.html?tab=.npmrc+file)，這篇主要是給未來的我的懶人包 🌚
2. 雖然發布套件的指令是 `npm publish`，但「將套件發布到 GitLab」的關鍵字是 package registry，故搜尋時推薦餵 `GitLab package registry` 而不是 `GitLab package publish`

## 將套件發布到私人 GitLab

假設一個叫 `@my-repo` 的 monorepo 結構如下：

```bash
libs
  tool1
  tool2
apps
  service1
  service2
```

而我的目的是「只將 `@my-repo/tool1` 發佈到私人 GitLab」，那麽流程會是：

1. 在 `@my-repo` 的根目錄位置新增 `.npmrc`
2. 在 `@my-repo/tool1` 的 `package.json` 設定 `publishConfig.registry`
3. 在 `@my-repo/tool1` （即 `libs/tool1` 這個資料夾）的位置執行 `npm publish`

第一步的 `.npmrc` 內容如下：

```bash
//<domain_name>/api/v4/projects/<project_id>/packages/npm/:_authToken=<your_auth_token>
```

- `<domain_name>` 換成 GitLab 網域名稱
- `<project_id>` 換成該 GitLab 專案的 id，可參考 [Access a project by using the project ID](https://docs.gitlab.com/ee/user/project/working_with_projects.html#access-a-project-by-using-the-project-id) 來查看
- `<your_auth_token>` 換成 PAT，可參考 [Create a personal access token](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html#create-a-personal-access-token) 來取得

第二步的 `package.json` 設定如下：

```bash
{
  "publishConfig": {
    "registry": "https://<domain_name>/api/v4/projects/<project_id>/packages/npm/"
  }
}
```

`<domain_name>` 和 `<project_id>` 的替換規則如前述。

## 安裝來自私人 GitLab 的套件

記得要在專案根目錄新增 `.npmrc` 並填入以下內容：

```bash
<package_name>:registry=https://<domain_name>/api/v4/projects/<project_id>/packages/npm/
//<domain_name>/api/v4/projects/<project_id>/packages/npm/:_authToken=<your_auth_token>
```

- `<package_name>` 替換成要安裝的套件的名稱（以本篇筆記為例，如果我要安裝 `@my-repo/tool1` 這個發布到私人 GitLab 的套件，這裏就填入 `@my-repo/tool1`）
- `<domain_name>` / `<project_id>` / `<your_auth_token>` 的替換規則如前述

## 參考文件

- [npm packages in the package registry](https://docs.gitlab.com/ee/user/packages/npm_registry/index.html?tab=.npmrc+file)
- [Monorepo package management workflows](https://docs.gitlab.com/ee/user/packages/workflows/working_with_monorepos.html)
- [[教學] 建立與使用 GitLab 私人 npm package registry](https://xenby.com/b/288-%E6%95%99%E5%AD%B8-%E5%BB%BA%E7%AB%8B%E8%88%87%E4%BD%BF%E7%94%A8-gitlab-%E7%A7%81%E4%BA%BA-npm-package-registry)
