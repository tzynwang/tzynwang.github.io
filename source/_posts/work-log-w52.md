---
title: 2021 第52週 學習記錄：前端測試
date: 2021-12-29 21:17:18
categories:
  - Testing
tags:
---

## 總結

本週以整理前端相關測試的筆記為主

## 前端測試

### Unit testing

- What is unit testing: The most basic building block for testing. It looks at individual method/function/component and ensures they work as expected.
- Why runs unit tests: The purpose is to validate that each unit of the software code performs as expected, and the most important thing is to make sure **all possible edge cases are covered and taken into account**. 確保功能在極端情境下也能提供正確產出

### Integration testing

- Why runs integration testing: To make sure that functions/components **work flawlessly together**.

### E2E testing

- What is E2E testing:
  - E2E testing refers to a software testing method that involves testing an application’s **workflow from beginning to end**. This method basically aims to **replicate real user scenarios** so that the system can be validated for integration and data integrity.
  - E2E tests are similar to integration tests in a sort of way. However, E2E tests are executed in a **real browser with a real DOM** rather than something we mock up —- we generally work with real data and a real API in E2E tests.
- Why runs E2E testing: E2E testing determines if **various dependencies of an application are working accurately**. It also checks if accurate information is being communicated between multiple system components.
- Best practice: E2E Testing is best used to **test common user scenarios**. When it comes to exceptional user scenarios, use integration testing or unit testing. E2E 腳本應以使用者會實際執行的操作為主，edge case 測試交給 unit test 或 integration test

### Visual regression testing

- What is visual regression testing: Tests the **visual structure** of application, including the visual differences produced by a change in the code. 跑測試時通常會將邏輯與畫面分開來測試，邏輯會交由 unit test  或 E2E testing 處理，而檢查專案的畫面是否持續維持正確的結構與外觀就由 visual regression testing 來處理
- Why visual regression testing: Sometimes E2E tests are insufficient to verify that the last changes to your application didn’t break the visual appearance of anything in an interface. The solution is visual regression testing, it merely take a **screenshot** of pages or components and **compare them with screenshots that were captured in previous successful tests**. If these tests find any discrepancies between the screenshots, they’ll give us some sort of notification.

## Testing best practice

### The Golden Rule

- Testing code should be dead-simple, short, abstraction-free, flat, delightful to work with, lean. One should **look at a test and get the intent instantly**. 測試內容應簡單、易理解，讓其他閱讀測試的人能夠一看就知道這份測試的目的是什麼

### The Test Anatomy

- 1.1 Include 3 parts in each test name
  - **What** is being tested? 測試目標
  - Under **what circumstances and scenario**? 測試情境
  - What is the **expected result**? 預期產出
  ```js
  //1. the unit under test
  describe('Products Service', function() {
    describe('Add new product', function() {
      //2. test scenario and 3. expectation
      it('When no price is specified, then the product status is pending approval', ()=> {
        const newProduct = new ProductService().add(...);
        expect(newProduct.status).to.equal('pendingApproval');
      });
    });
  });
  ```
- 1.2 Structure tests by the AAA pattern 測試 code 的本體建議以 Arrange-Act-Assert 的順序來撰寫
  - Arrange: All the **setup code** to bring the system to the scenario the test aims to simulate. 設定好測試環境
  - Act: **Execute** the unit under test. 執行測試
  - Assert: Ensure that the **received value satisfies the expectation**. 確認測試的產出是否符合預期
  ```js
  describe('Customer classifier', () => {
    test('When customer spent more than 500$, should be classified as premium', () => {
      //Arrange
      const customerToClassify = { spent: 505, joined: new Date(), id: 1 }
      const DBStub = sinon
        .stub(dataAccess, 'getCustomer')
        .reply({ id: 1, classification: 'regular' })

      //Act
      const receivedClassification =
        customerClassifier.classifyCustomer(customerToClassify)

      //Assert
      expect(receivedClassification).toMatch('premium')
    })
  })
  ```
- 1.3 Describe expectations in a product language: use BDD-style assertions
  - Coding your tests in a declarative-style allows the reader to get the grab instantly without spending even a single brain-CPU cycle.
  - **Code the expectation in a human-like language**, declarative BDD style using `expect` or `should` and not using custom code.
- 1.4 **Stick to black-box testing**: Test only public methods
- 1.5 Choose the right test doubles: Avoid mocks in favor of stubs and spies
  - **Test double** refers to any number of **replacement objects that make testing easier**. Test doubles stand in for software integrations or features that are not easily testable.
- 1.6 Don’t “foo”, use realistic input data
  - Use dedicated libraries like `Faker` to generate pseudo-real data that resembles the variety and form of production data.
  - All your development testing will falsely show green when you use synthetic inputs like “Foo”, but then production might turn red when a hacker passes-in a nasty string like `@3e2ddsf . ##’ 1 fdsfds . fds432 AAAA`
- 1.7 Test many input combinations using Property-based testing 使用 library 幫忙湊出所有 input 的可能性
  - **Property-based testing** is a technique that does exactly that: by sending **all the possible input combinations** to your unit under test it increases the serendipity of finding a bug.
- 1.8 If needed, use only short & inline snapshots 保存有意義的 snapshot 段落即可，不需要全部拍下來
- 1.9 Avoid global test fixtures and seeds, add data per-test
  - Each test should add and act on its own set of DB rows to prevent coupling and easily reason about the test flow.
  - Practically, make each test case explicitly add the DB records it needs and **act only on those records**.
- 1.10 Don’t catch errors, expect them
  ```js
  it("When no product name, it throws error 400", async () => {
    await expect(addNewProduct({}))
      .to.eventually.throw(AppError)
      .with.property("code", "InvalidInput");
  });
  ```
- 1.11 Tag your tests 為測試分類，各類開發階段應執行不同類型的測試
  - Different tests must run on different scenarios: quick smoke, IO-less, tests should run when a developer saves or commits a file, full end-to-end tests usually run when a new pull request is submitted, etc. This can be achieved by **tagging tests with keywords** like `#cold` `#api` `#sanity` so you can grep with your testing harness and invoke the desired subset.
- 1.12 Categorize tests under at least 2 levels
  ```js
  describe("Transfer service", () => {
    //Scenario
    describe("When no credit", () => {
      //Expectation
      test("Then the response status should decline", () => {});

      //Expectation
      test("Then it should send email to admin", () => {});
    });
  });
  ```
  {% figure figure--center 2021/work-log-w52/hierarchical-report.png %}

### Frontend Testing
- 3.1 Separate UI from functionality 跑 unit test 時就專精於檢查資料，不檢驗 UI
  ```ts
  // DON'T
  test("When flagging to show only VIP, should display only VIP members", () => {
    const allUsers = [{ id: 1, name: "Yoni Goldberg", vip: false }, { id: 2, name: "John Doe", vip: true }];
    const { getAllByTestId } = render(<UsersList users={allUsers} showOnlyVIP={true} />);
    
    // Assert - Mix UI & data in assertion
    expect(getAllByTestId("user")).toEqual('[<li data-test-id="user">John Doe</li>]');
  });
  ```
  ```ts
  // DO
  test("When users-list is flagged to show only VIP, should display only VIP members", () => {
    const allUsers = [{ id: 1, name: "Yoni Goldberg", vip: false }, { id: 2, name: "John Doe", vip: true }];
    const { getAllByTestId } = render(<UsersList users={allUsers} showOnlyVIP={true} />);
    
    // Assert - Extract the data from the UI first
    const allRenderedUsers = getAllByTestId("user").map(uiElement => uiElement.textContent);
    const allRealVIPUsers = allUsers.filter(user => user.vip).map(user => user.name);
    expect(allRenderedUsers).toEqual(allRealVIPUsers); //compare data with data, no UI here
  });
  ```
- 3.2 Query HTML elements based on attributes that are unlikely to change
  - If the designated element doesn't have such attributes, **create a dedicated test attribute** like 'test-id-submit-button'. 
  - Doing do not only ensures that your functional/logic tests never break because of look & feel changes but also it becomes clear to the entire team that **this element and attribute are utilized by tests and shouldn't get removed**.
- 3.3 Whenever possible, test with a realistic and fully rendered component
- 3.4 Don't sleep, use frameworks built-in support for `async` events. Also try to speed things up
  - 標題的 sleep 指的是使用 `setTimeout` 等方式來等待非同步的資料，但請避免此類行為，使用 async/await 或 framework 提供的功能來進行等待動作
  - When sleeping for a long time, tests will be an order of magnitude slower.
  - When trying to sleep for small numbers, test will fail when the unit under test didn't respond in a timely fashion.
- 3.5 Watch how the content is served over the network
- 3.6 Stub flaky and slow resources like backend APIs
  - The main benefit is **preventing flakiness** -- testing or staging APIs by definition are not highly stable and from time to time will fail your tests although YOUR component behaves just fine
  - 使用內容正確的假資料來進行測試的話，在實際串接 API 後若發現結果不如預期，則可明確知道問題出現在 API 部分
  - 並 fetch API 也是花費時間的行為，會造成測試時間上升
- 3.7 Have very few end-to-end tests that spans the whole system
- 3.8 Speed-up E2E tests by **reusing login credentials**
  - Login only once before the tests execution start (i.e. before-all hook), save the token in some local storage and reuse it across requests.
  - 如果專案有權限管控，就先把 token 準備好，在執行測試時直接使用該 token 而不進行重複登入的動作
- 3.9 Have one E2E smoke test that just travels across the site map 測試每一條 url 都能正常載入
- 3.10 Expose the tests as a live collaborative document
  - 讓測試文件本身就可以提供專案的規格與目標，令非開發人員也可以一看就知道專案內容
  - For example, some frameworks allow expressing the flow and expectations (i.e. tests plan) using a human-readable language so any stakeholder, including product managers, can read, approve and collaborate on the tests which just became the live requirements document. This technique is also being referred to as **'acceptance test' as it allows the customer to define his acceptance criteria in plain language**. This is **BDD (behavior-driven testing)** at its purest form.
- 3.11 Detect visual issues with automated tools
  - 除確保資料流正確之外，也需檢查最終畫面是否有如預期呈現
  - This ensures that not only the right data is prepared but also the user can conveniently see it.

## 參考文件

- [Front-End Testing is For Everyone](https://css-tricks.com/front-end-testing-is-for-everyone/)
- [End To End Testing: A Detailed Guide](https://www.browserstack.com/guide/end-to-end-testing)
- [JavaScript & Node.js Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices#section-3%EF%B8%8F%E2%83%A3-frontend-testing)
