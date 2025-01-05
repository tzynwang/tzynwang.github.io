---
title: 快速筆記：透過 GitLab 執行 ci/cd 時，取得測試覆蓋率的方法
date: 2023-10-20 21:06:53
tag:
- [GitLab]
- [Testing]
banner: /2023/gitlab-ci-coverage/no-revisions-oQEVnA7D3Uk-unsplash.jpg
summary: GitLab 有提供關鍵字 `coverage` 來收集 job output 中的測試覆蓋率數據，這篇筆記會解說使用方式
draft:
---

## 簡介

最近在為公司專案們的 GitLab ci/cd 工作（jobs）增加「取得測試覆蓋率」的相關指令。簡單來說，就是 GitLab 支援透過關鍵字 `coverage` 搭配 regex 來取得工作輸出（job output）中的覆蓋率數據。

## 實作方式

以下是專案執行測試的工作腳本。簡單來說這段工作是：當觸發 mr 以及合併目標是 develop/main/master 分支時，使用 docker image node:20 版，執行套件安裝（`yarn install --frozen-lockfile --production=false`）與測試（`yarn jest`）工作。

```yml
test:
  stage: test
  image: node:20
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    - if: $CI_COMMIT_BRANCH == "develop"
    - if: $CI_COMMIT_BRANCH == "main"
    - if: $CI_COMMIT_BRANCH == "master"
    - when: never
  script:
    - yarn install --frozen-lockfile --production=false
    - yarn jest
  coverage: /All files[^|]*\|[^|]*\s+([\d\.]+)/
  tags:
    - docker
```

而 `coverage: /All files[^|]*\|[^|]*\s+([\d\.]+)/` 這行的目的則是「透過 regex 比對工作的輸出內容，進而取得測試覆蓋率數據，並顯示在 GitLab 介面上」。

> GitLab docs: Use `coverage` with a custom regular expression to configure **how code coverage is extracted from the job output**. The coverage is shown in the UI if at least one line in the job output matches the regular expression.

可參考下圖，使用 `/All files[^|]*\|[^|]*\s+([\d\.]+)/` 就能取得工作輸出內容中描述測試覆蓋率的資料，並顯示在 GitLab 介面上。

![GitLab ci/cd job result](/2023/gitlab-ci-coverage/job-result.png)

![GitLab show test coverage](/2023/gitlab-ci-coverage/show-doverage.png)

以上就是在 GitLab ci/cd 取得特定工作測試覆蓋率的方式。

## jest.config

而為了能讓 jest 輸出測試覆蓋率相關資訊，以下是個人使用的 `jest.config` 內容。與測試覆蓋數據相關的設定為 `coverageReporters` / `collectCoverage` / `collectCoverageFrom`

```js
/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  coverageReporters: ['text', 'text-summary'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/(model|tool)/**/*.ts',
    '!src/(model|tool)/**/*.(d|test).ts',
    '!src/model/General*.ts',
    '!**/node_modules/**',
  ],
  maxWorkers: '25%',
  moduleNameMapper: {
    '@/jest.config': '<rootDir>/jest.config.js',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {}],
    '^.+\\.ts?$': ['ts-jest', {}],
  },
};

module.exports = config;
```

- [coverageReporters](https://jestjs.io/docs/configuration#coveragereporters-arraystring--string-options)：指定 `text` 與 `text-summary` 讓 jest 在終端輸出測試覆蓋率的資料
- [collectCoverage](https://jestjs.io/docs/configuration#collectcoverage-boolean)：設定為 `true` 來收集測試覆蓋率
- [collectCoverageFrom](https://jestjs.io/docs/configuration#collectcoveragefrom-array)：指定覆蓋率要根據哪些檔案來計算，這邊的比對規則翻譯成白話文即是「計算 `src/model` 與 `src/tool` 中，所有不是 `.d.ts` 與 `.test.ts` 類檔案的測試覆蓋率；並排除純粹宣告資料用的 `General` 類檔案」

目前僅針對較易執行單元測試的 `src/model` 與 `src/tool` 執行測試覆蓋率計算，除了目前較少針對畫面元件撰寫測試外，也避免計算範圍太廣而導致效能不佳的問題。

## 參考文件

- [.gitlab-ci.yml keyword reference: `coverage`](https://docs.gitlab.com/ee/ci/yaml/?query=coverage)
- [GitLab docs: Code coverage >> Test coverage examples](https://docs.gitlab.com/ee/ci/testing/code_coverage.html#test-coverage-examples)
- [Configuring Jest](https://jestjs.io/docs/configuration)
