import { test, expect } from '@playwright/test';
import { TodoPage } from '../pages/todo.page';

test.describe('Todo filters', () => {
  let todoPage: TodoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);

    await todoPage.open();

    await todoPage.addTodo('Completed task');

    await todoPage.completeTodo('Completed task');
  });

  test('displays only active Todos', async ({ page }) => {
    await todoPage.selectActiveFilter();

    await expect(
      todoPage.todoItem('Pay electric bill')
    ).toBeVisible();

    await expect(
      todoPage.todoItem('Walk the dog')
    ).toBeVisible();

    await expect(
      todoPage.todoItem('Completed task')
    ).toHaveCount(0);

    await expect(
      todoPage.todoItems
    ).toHaveCount(2);

    await expect(
      todoPage.activeFilter
    ).toHaveClass(/selected/);

    await expect(page).toHaveURL(/#\/active$/);
  });

  test('displays only completed Todos', async ({ page }) => {
    await todoPage.selectCompletedFilter();

    await expect(
      todoPage.todoItem('Completed task')
    ).toBeVisible();

    await expect(
      todoPage.todoItem('Completed task')
    ).toHaveClass(/completed/);

    await expect(
      todoPage.todoItem('Pay electric bill')
    ).toHaveCount(0);

    await expect(
      todoPage.todoItem('Walk the dog')
    ).toHaveCount(0);

    await expect(
      todoPage.todoItems
    ).toHaveCount(1);

    await expect(
      todoPage.completedFilter
    ).toHaveClass(/selected/);

    await expect(page).toHaveURL(/#\/completed$/);
  });

  test('displays all Todos after using another filter', async ({ page }) => {
    await todoPage.selectActiveFilter();

    await expect(
      todoPage.todoItems
    ).toHaveCount(2);

    await todoPage.selectAllFilter();

    await expect(
      todoPage.todoItem('Pay electric bill')
    ).toBeVisible();

    await expect(
      todoPage.todoItem('Walk the dog')
    ).toBeVisible();

    await expect(
      todoPage.todoItem('Completed task')
    ).toBeVisible();

    await expect(
      todoPage.todoItem('Completed task')
    ).toHaveClass(/completed/);

    await expect(
      todoPage.todoItems
    ).toHaveCount(3);

    await expect(
      todoPage.allFilter
    ).toHaveClass(/selected/);

    await expect(page).toHaveURL(/#\/$/);
  });
});