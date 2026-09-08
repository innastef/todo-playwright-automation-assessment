# Todo Playwright Automation Assessment

Playwright TypeScript automation solution for the Todo application from the Cypress Example Kitchen Sink repository.

The project focuses exclusively on the Todo application and demonstrates functional UI test coverage, test isolation, parallel execution, CI integration, Docker execution, failure evidence, and Allure reporting with history and trends.

## Repository

https://github.com/innastef/todo-playwright-automation-assessment

## Tech Stack

- Playwright
- TypeScript
- Node.js
- Docker
- GitHub Actions
- Allure Report

## Application Under Test

The Todo application is part of the Cypress Example Kitchen Sink repository:

https://github.com/cypress-io/cypress-example-kitchensink

Application URL when running locally:

`http://127.0.0.1:8080/todo`

The original Cypress examples are not part of the submitted automation solution.

---

## Test Approach

The goal of the suite is to provide meaningful confidence in the core Todo functionality while keeping the tests maintainable, independent, and suitable for parallel execution.

### Priorities

Testing focuses primarily on user-critical Todo workflows:

1. Creating Todos
2. Completing and reopening Todos
3. Editing Todos
4. Deleting Todos
5. Bulk actions
6. Filtering
7. Persistence after reload
8. Correct Todo counter and UI state

The suite also validates important state transitions rather than only checking that elements are visible.

Examples include:

- checkbox state
- `completed` CSS state
- Todo counter updates
- filter selection
- filter URL changes
- persistence after reload

### Test Design

The tests follow several principles:

- Tests are independent and can run in parallel.
- Each test prepares the state it requires.
- Page Object Model is used to separate UI interaction logic from test assertions.
- Assertions remain in the test specifications.
- Playwright auto-waiting and web-first assertions are preferred over hard-coded waits.
- User-facing locators are preferred where practical.
- Known product defects are represented with `test.fixme()` rather than weakening the expected assertions.

---

## Test Coverage

The suite currently contains **16 test scenarios** across three specification files.

### Todo Management

- Displays the default Todos
- Adds a new Todo
- Rejects a whitespace-only Todo
- Completes and reopens a Todo
- Completes only the selected default Todo
- Edits and saves a Todo
- Cancels Todo editing
- Deletes an individual Todo
- Deletes "Walk the dog" without affecting other Todos
- Marks all Todos as completed and active
- Clears completed Todos
- Clears all completed default Todos

### Todo Filters

- Displays only active Todos
- Displays only completed Todos
- Displays all Todos after using another filter

### Todo Persistence

- Preserves Todo changes after page reload

At the time of submission:

- **12 tests pass**
- **4 tests are marked as `fixme` due to reproducible product defects**

The `fixme` tests preserve the expected behavior and document why the scenarios cannot currently pass.

---

## Known Quality Findings

During exploratory testing and automation implementation, several issues were identified around the default Todo items.

Examples include:

- Completing "Walk the dog" can incorrectly affect the state of "Pay electric bill".
- Deleting "Walk the dog" removes "Pay electric bill" instead.
- Toggle All does not correctly complete all default Todos.
- Clearing completed default Todos can leave "Walk the dog" behind.

Some symptoms may share the same underlying root cause, so they should not automatically be treated as separate defects without further investigation.

The most relevant finding has been documented as a GitHub Issue:

**Deleting "Walk the dog" removes the wrong Todo**

https://github.com/innastef/todo-playwright-automation-assessment/issues/1

The corresponding expected behavior remains covered by an automated test marked with `test.fixme()`.

---

## Project Structure

```text
todo-playwright-automation-assessment/
├── .github/
│   └── workflows/
│       └── playwright.yml
├── app/
├── scripts/
├── tests/
│   ├── pages/
│   │   └── todo.page.ts
│   └── specs/
│       ├── todo-management.spec.ts
│       ├── todo-filters.spec.ts
│       └── todo-persistence.spec.ts
├── .dockerignore
├── .gitignore
├── Dockerfile
├── package.json
├── package-lock.json
├── playwright.config.ts
├── tsconfig.json
└── README.md
```

---

## Prerequisites

For local execution:

- Node.js
- npm

For containerized execution:

- Docker

---

## Installation

Clone the repository:

```bash
git clone https://github.com/innastef/todo-playwright-automation-assessment.git
cd todo-playwright-automation-assessment
```

Install dependencies:

```bash
npm ci
```

Install Chromium:

```bash
npx playwright install chromium
```

---

## Running the Tests

Run the complete suite:

```bash
npm test
```

The application does not need to be started manually when running the Playwright suite.

The Playwright `webServer` configuration automatically starts the application and waits until the Todo application is available before executing the tests.

### TypeScript validation

```bash
npm run typecheck
```

### Headed execution

```bash
npm run test:headed
```

### Playwright UI mode

```bash
npm run test:ui
```

### List tests

```bash
npm run test:list
```

---

## Parallel Execution

The Playwright configuration uses:

```ts
fullyParallel: true
```

Tests are designed to be independent so they can safely execute concurrently.

In CI, the worker count is explicitly controlled to keep execution predictable:

```ts
workers: process.env.CI ? 2 : undefined
```

For debugging, tests can also be executed serially:

```bash
npx playwright test --workers=1
```

---

## Reporting

Allure is used as the primary test report instead of relying only on Playwright's default HTML report.

It was selected because the assessment requires:

- understandable test results
- failure information
- evidence
- historical execution data
- trends
- CI availability

Playwright also retains additional debugging evidence on failure:

- trace
- screenshot
- video

The configuration uses:

```ts
trace: 'retain-on-failure'
screenshot: 'only-on-failure'
video: 'retain-on-failure'
```

### Allure Report

The latest CI-generated Allure report is available through GitHub Pages:

https://innastef.github.io/todo-playwright-automation-assessment

### Generate Allure report locally

First execute the tests:

```bash
npm test
```

Generate the report:

```bash
npm run allure:generate
```

Open it:

```bash
npm run allure:open
```

Raw Allure results are generated in:

```text
allure-results/
```

The generated report is stored in:

```text
allure-report/
```

---

## CI/CD

GitHub Actions executes the assessment suite automatically on pushes and pull requests targeting `main`.

The CI pipeline:

1. Checks out the repository
2. Sets up Node.js
3. Installs dependencies using `npm ci`
4. Installs Chromium and required system dependencies
5. Runs TypeScript validation
6. Executes the Playwright suite
7. Restores previous Allure history when available
8. Generates the Allure report
9. Uploads Allure results and report artifacts
10. Uploads Playwright failure evidence
11. Publishes the Allure report through GitHub Pages

Allure history from previous CI executions is preserved so historical results and trends can be built across runs.

Artifacts are uploaded even when test execution fails so failure evidence remains available for investigation.

---

## Docker

The project includes a Docker image containing the application, Playwright tests, Node dependencies, browser dependencies, and required runtime environment.

Build the image:

```bash
docker build -t todo-playwright-tests .
```

Run the assessment suite inside the container:

```bash
docker run --rm todo-playwright-tests
```

The container executes the Playwright suite by default.

The Playwright Docker image version is aligned with the Playwright package version used by the project to avoid browser/runtime compatibility issues.

---

## Assumptions

The following assumptions were used when designing the suite:

- Chromium is sufficient for the scope of this assessment.
- The two Todos available on initial load are demo/default application data.
- Todo state is expected to persist through browser reload using client-side storage.
- Whitespace-only Todo titles should not create a Todo.
- Duplicate Todo titles are considered valid unless product requirements state otherwise.
- The Todo counter represents the number of active Todos.
- Tests should remain independent and suitable for parallel execution.

---

## Scope and Exclusions

### In Scope

- Core Todo CRUD behavior
- Complete/reopen behavior
- Bulk actions
- Filtering
- Todo counter
- UI state consistency
- Persistence after reload
- Parallel execution
- CI execution
- Docker execution
- Reporting and failure evidence

### Out of Scope

For the scope and time constraints of the assessment, the following areas were not exhaustively covered:

- Cross-browser testing beyond Chromium
- Visual regression testing
- Accessibility testing
- Performance testing
- Very long Todo titles
- Duplicate-title edge cases
- Leading/trailing whitespace normalization beyond whitespace-only input
- Empty-title behavior during editing
- Persistence after every possible operation
- Browser back/forward navigation behavior
- Extensive zero-state scenarios

These would be candidates for additional coverage based on product risk and requirements.

---

## Technical Decisions

### Page Object Model

UI interaction logic is centralized in `TodoPage`.

This reduces locator duplication and keeps the specification files focused on behavior and expected results.

Assertions remain in the tests rather than inside the Page Object so that test intent remains explicit.

### Test Isolation

Tests do not depend on execution order or state created by another test.

This enables reliable parallel execution and reduces cascading failures.

### Known Defects

When automation exposed reproducible product defects, the expected assertions were kept intact and the affected scenarios were marked with `test.fixme()`.

This makes the limitation visible without changing the expected behavior simply to make the suite pass.

### CI Dependency Installation

CI uses:

```bash
npm ci
```

rather than `npm install` to ensure dependency installation follows the committed lock file and remains reproducible.

### Chromium-only Execution

Chromium was selected as the assessment browser to keep the suite focused and execution time reasonable.

The framework can be extended with additional Playwright browser projects if cross-browser coverage becomes a requirement.

---

## What I Would Improve With More Time

With additional time, I would:

- Extend coverage to additional edge cases and validation scenarios.
- Add Firefox and WebKit execution where cross-browser risk justifies it.
- Investigate the shared root cause behind the defects affecting the default Todo items.
- Add accessibility checks for critical user flows.
- Add targeted visual regression coverage where UI regressions present meaningful risk.
- Improve test-data setup so application state can be created more directly and efficiently where appropriate.
- Expand reporting metadata with clearer feature/severity categorization.
- Review CI execution metrics over multiple runs and optimize workers/retries based on observed stability rather than assumptions.

---

## Source Application

The application under test originates from the Cypress Example Kitchen Sink project.

Original repository:

https://github.com/cypress-io/cypress-example-kitchensink

The source application is retained for assessment purposes, while the submitted test automation, CI, Docker, reporting, and documentation are focused specifically on the Todo application.

The original project license is retained in the repository.