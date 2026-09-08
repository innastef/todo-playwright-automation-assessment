import { test, expect } from '@playwright/test';
import { TodoPage } from '../pages/todo.page';

test.describe('Todo persistence', () => {
  test('preserves Todo changes after page reload', async ({ page }) => {
    const todoPage = new TodoPage(page);
    const todoTitle = 'Persistent task';

    await todoPage.open();

    await todoPage.addTodo(todoTitle);
    await todoPage.completeTodo(todoTitle);

    await expect(
      todoPage.todoItem(todoTitle)
    ).toBeVisible();

    await expect(
      todoPage.todoCheckbox(todoTitle)
    ).toBeChecked();

    await page.reload();

    await expect(
      todoPage.todoItem(todoTitle)
    ).toBeVisible();

    await expect(
      todoPage.todoCheckbox(todoTitle)
    ).toBeChecked();

    await expect(
      todoPage.todoItem(todoTitle)
    ).toHaveClass(/completed/);

    await expect(
      todoPage.todoItem('Pay electric bill')
    ).toBeVisible();

    await expect(
      todoPage.todoItem('Walk the dog')
    ).toBeVisible();

    await expect(
      todoPage.todoItems
    ).toHaveCount(3);

    await expect(
      todoPage.todoCounter
    ).toHaveText('2 items left');
  });
});