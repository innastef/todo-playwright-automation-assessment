import { test, type Locator, type Page } from '@playwright/test';

export class TodoPage {
  readonly page: Page;
  readonly newTodoInput: Locator;
  readonly todoItems: Locator;
  readonly todoCounter: Locator;
  readonly toggleAllLabel: Locator;
  readonly clearCompletedButton: Locator;
  readonly allFilter: Locator;
  readonly activeFilter: Locator;
  readonly completedFilter: Locator;

  constructor(page: Page) {
    this.page = page;

    this.newTodoInput = page.getByPlaceholder(
      'What needs to be done?'
    );

    this.todoItems = page.locator('.todo-list li');

    this.todoCounter = page.locator('.todo-count');

    this.toggleAllLabel = page.locator(
      'label[for="toggle-all"]'
    );

    this.clearCompletedButton = page.getByRole(
      'button',
      { name: 'Clear completed' }
    );

    this.allFilter = page.getByRole(
      'link',
      { name: 'All', exact: true }
    );

    this.activeFilter = page.getByRole(
      'link',
      { name: 'Active', exact: true }
    );

    this.completedFilter = page.getByRole(
      'link',
      { name: 'Completed', exact: true }
    );
  }

  async open(): Promise<void> {
    await test.step('Open Todo application', async () => {
      await this.page.goto('/todo');
    });
  }

  todoItem(title: string): Locator {
    return this.todoItems.filter({
      has: this.page.getByText(title, {
        exact: true,
      }),
    });
  }

  todoCheckbox(title: string): Locator {
    return this.todoItem(title).locator('.toggle');
  }

  async addTodo(title: string): Promise<void> {
    await test.step(`Add Todo: "${title}"`, async () => {
      await this.newTodoInput.fill(title);
      await this.newTodoInput.press('Enter');
    });
  }

  async completeTodo(title: string): Promise<void> {
    await test.step(`Complete Todo: "${title}"`, async () => {
      await this.todoCheckbox(title).check();
    });
  }

  async reopenTodo(title: string): Promise<void> {
    await test.step(`Reopen Todo: "${title}"`, async () => {
      await this.todoCheckbox(title).uncheck();
    });
  }

  async editTodo(
    currentTitle: string,
    newTitle: string
  ): Promise<void> {
    await test.step(
      `Edit Todo: "${currentTitle}" to "${newTitle}"`,
      async () => {
        const todoItem = this.todoItem(currentTitle);
        const todoLabel = todoItem.locator('label');
        const editInput = todoItem.locator('input.edit');

        await todoLabel.dblclick();
        await editInput.fill(newTitle);
        await editInput.press('Enter');
      }
    );
  }

  async cancelTodoEditing(
    currentTitle: string,
    temporaryTitle: string
  ): Promise<void> {
    await test.step(
      `Cancel editing Todo: "${currentTitle}"`,
      async () => {
        const todoItem = this.todoItem(currentTitle);
        const todoLabel = todoItem.locator('label');
        const editInput = todoItem.locator('input.edit');

        await todoLabel.dblclick();
        await editInput.fill(temporaryTitle);
        await editInput.press('Escape');
      }
    );
  }

  async deleteTodo(title: string): Promise<void> {
    await test.step(`Delete Todo: "${title}"`, async () => {
      const todoItem = this.todoItem(title);
      const deleteButton = todoItem.locator('button.destroy');

      await todoItem.hover();
      await deleteButton.click();
    });
  }

  async toggleAllTodos(): Promise<void> {
    await test.step('Toggle all Todos', async () => {
      await this.toggleAllLabel.click();
    });
  }

  async clearCompletedTodos(): Promise<void> {
    await test.step('Clear completed Todos', async () => {
      await this.clearCompletedButton.click();
    });
  }

  async selectAllFilter(): Promise<void> {
    await test.step('Select All filter', async () => {
      await this.allFilter.click();
    });
  }

  async selectActiveFilter(): Promise<void> {
    await test.step('Select Active filter', async () => {
      await this.activeFilter.click();
    });
  }

  async selectCompletedFilter(): Promise<void> {
    await test.step('Select Completed filter', async () => {
      await this.completedFilter.click();
    });
  }
}