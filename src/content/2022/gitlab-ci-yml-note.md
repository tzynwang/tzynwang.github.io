---
title: 2022 第43週 學習筆記：.gitlab-ci.yml
date: 2022-10-28 18:02:24
tag:
- [GitLab]
---

## 總結

關於 `.gitlab-ci.yml` 基本語法與規則的自用筆記，以目前工作上有用到的內容為主。

## 筆記

> 大前提：檔案必定命名為 `.gitlab-ci.yml` 且放置在 repo 根目錄中

### 關鍵字

- [GitLab Runner](https://docs.gitlab.com/runner/): is an **application** that works with GitLab CI/CD to **run jobs in a pipeline**.
- [CI/CD Pipelines](https://docs.gitlab.com/ee/ci/pipelines/): are the top-level component of continuous integration, delivery, and deployment. Pipelines comprise:
  - Jobs, which define **what to do**. For example, jobs that compile or test code.
  - Stages, which define **when to run the jobs**. For example, stages that run tests after stages that compile the code.
- [Jobs](https://docs.gitlab.com/ee/ci/jobs/): Pipeline configuration begins with jobs. Jobs are the most fundamental element of a `.gitlab-ci.yml` file.

### 基礎語法

```yaml
stages:
  - build
  - test

build-code-job:
  stage: build
  script:
    - echo "Check the ruby version, then build some Ruby project files:"
    - ruby -v
    - rake

test-code-job1:
  stage: test
  script:
    - echo "If the files are built successfully, test some files with one command:"
    - rake test1

test-code-job2:
  stage: test
  script:
    - echo "If the files are built successfully, test other files with a different command:"
    - rake test2
```

- stages: 定義好的 stage 會從上到下依序發生
- jobs: 範例中的 `build-code-job`、`test-code-job1` 與 `test-code-job2`
  - 會先執行設定在 `stage: build` 的 `build-code-job`，如果此 job 順利結束，則 `stage test` 中的 `test-code-job1` 與 `test-code-job2` 會同時開始執行（沒有先後之分）
- script: 在此區塊設定要在 runner 中執行的指令

### 其他常見關鍵字

[artifacts](https://docs.gitlab.com/ee/ci/pipelines/job_artifacts.html): Jobs can output an archive of files and directories. This output is known as a job artifact. They are available for download in the GitLab UI if the size is smaller than the the maximum artifact size. By default, jobs in later stages **automatically download all the artifacts created by jobs in earlier stages**.

簡單來說就是 gitlab-ci 的檔案機制，且後發的 jobs 預設會下載先行 jobs 產生的 artifacts
下方範例翻成白話文即是：在 job pdf 中，透過指令 `xelatex mycv.tex` 產生 pdf 檔案，並產生出來的檔案 `mycv.pdf` 一週後過期

```yaml
pdf:
  script: xelatex mycv.tex
  artifacts:
    paths:
      - mycv.pdf
    expire_in: 1 week
```

dependencies: 指定 artifacts 來源

```yaml
build osx:
  stage: build
  script: make build:osx
  artifacts:
    paths:
      - binaries/

build linux:
  stage: build
  script: make build:linux
  artifacts:
    paths:
      - binaries/

test osx:
  stage: test
  script: make test:osx
  dependencies:
    - build osx # 在這個 job 取用 build osx 產生的檔案

test linux:
  stage: test
  script: make test:linux
  dependencies:
    - build linux # 在這個 job 取用 build linux 產生的檔案

deploy:
  stage: deploy
  script: make deploy
  environment: production
```

extends: 功能如關鍵字本身的描述，可在此定義可複用的內容，並讓其他 jobs 引用

```yaml
# 以下這個組合
.tests:
  script: rake test
  stage: test
  only:
    refs:
      - branches

rspec:
  extends: .tests
  script: rake rspec
  only:
    variables:
      - $RSPEC

# 最終的結果等同於
rspec:
  script: rake rspec
  stage: test
  only:
    refs:
      - branches
    variables:
      - $RSPEC
```

image: 指定 jobs 的執行環境，注意僅能在 `default` 或 `job` 中指名要使用的 Docker image

```yaml
default:
  image: ruby:3.0

rspec:
  script: bundle exec rspec

rspec 2.7:
  image: registry.example.com/my-group/my-project/ruby:2.7
  script: bundle exec rspec
```

variables: 定義在 `.gitlab-ci.yml` 最上方為全域變數，定義在 jobs 中則只有該 job 可以使用

```yaml
variables:
  TEST_VAR: "All jobs can use this variable's value"

job1:
  variables:
    TEST_VAR_JOB: "Only job1 can use this variable's value"
  script:
    - echo "$TEST_VAR" and "$TEST_VAR_JOB"
```

## 參考文件

- [GitLab Docs: The .gitlab-ci.yml file](https://docs.gitlab.com/ee/ci/yaml/gitlab_ci_yaml.html)
- [GitLab Docs: .gitlab-ci.yml keyword reference](https://docs.gitlab.com/ee/ci/yaml/)
- [YouTube: GitLab CI CD Tutorial for Beginners [Crash Course]](https://youtu.be/qP8kir2GUgo)
