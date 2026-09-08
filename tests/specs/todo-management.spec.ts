import { test, expect } from '@playwright/test';
import { TodoPage } from '../pages/todo.page';

test.describe('Todo management', () => {
  let todoPage: TodoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.open();
  });

  test('displays the default Todos', async () => {
    await expect(todoPage.todoItems).toHaveCount(2);
  });

  test('adds a new Todo', async () => {
    const newTodoTitle = 'Buy milk';

    await todoPage.addTodo(newTodoTitle);

    await expect(
      todoPage.todoItem(newTodoTitle)
    ).toBeVisible();

    await expect(
      todoPage.todoItems
    ).toHaveCount(3);

    await expect(
      todoPage.todoItems.last()
    ).toContainText(newTodoTitle);

    await expect(
      todoPage.todoCounter
    ).toHaveText('3 items left');
  });

  test('does not create a whitespace-only Todo', async () => {
    await todoPage.addTodo('     ');

    await expect(
      todoPage.todoItems
    ).toHaveCount(2);

    await expect(
      todoPage.todoCounter
    ).toHaveText('2 items left');
  });

  test('completes and reopens a Todo', async () => {
    const todoTitle = 'Task to complete';

    await todoPage.addTodo(todoTitle);

    const todoItem = todoPage.todoItem(todoTitle);
    const todoCheckbox = todoPage.todoCheckbox(todoTitle);

    await expect(
      todoPage.todoCounter
    ).toHaveText('3 items left');

    await todoPage.completeTodo(todoTitle);

    await expect(todoCheckbox).toBeChecked();
    await expect(todoItem).toHaveClass(/completed/);

    await expect(
      todoPage.todoCounter
    ).toHaveText('2 items left');

    await todoPage.reopenTodo(todoTitle);

    await expect(todoCheckbox).not.toBeChecked();
    await expect(todoItem).not.toHaveClass(/completed/);

    await expect(
      todoPage.todoCounter
    ).toHaveText('3 items left');
  });

  test('completes only the selected default Todo', async () => {
    test.fixme(
      true,
      'Blocked by a known defect: completing "Walk the dog" incorrectly marks "Pay electric bill" as completed.'
    );

    const selectedTodo =
      todoPage.todoItem('Walk the dog');

    const selectedCheckbox =
      todoPage.todoCheckbox('Walk the dog');

    const otherTodo =
      todoPage.todoItem('Pay electric bill');

    const otherCheckbox =
      todoPage.todoCheckbox('Pay electric bill');

    await todoPage.completeTodo('Walk the dog');

    await expect(
      selectedCheckbox
    ).toBeChecked();

    await expect(
      selectedTodo
    ).toHaveClass(/completed/);

    await expect(
      otherCheckbox
    ).not.toBeChecked();

    await expect(
      otherTodo
    ).not.toHaveClass(/completed/);

    await expect(
      todoPage.todoCounter
    ).toHaveText('1 item left');

    await expect(
      todoPage.clearCompletedButton
    ).toBeVisible();
  });

  test('edits and saves a Todo', async () => {
    const originalTitle = 'Editable task';
    const newTitle = 'Updated task';

    await todoPage.addTodo(originalTitle);

    await todoPage.editTodo(
      originalTitle,
      newTitle
    );

    await expect(
      todoPage.todoItem(newTitle)
    ).toBeVisible();

    await expect(
      todoPage.todoItem(originalTitle)
    ).toHaveCount(0);

    await expect(
      todoPage.todoItems
    ).toHaveCount(3);

    await expect(
      todoPage.todoCounter
    ).toHaveText('3 items left');
  });

  test('cancels Todo editing', async () => {
    const originalTitle = 'Editable task';
    const temporaryTitle = 'Temporary title';

    await todoPage.addTodo(originalTitle);

    await todoPage.cancelTodoEditing(
      originalTitle,
      temporaryTitle
    );

    await expect(
      todoPage.todoItem(originalTitle)
    ).toBeVisible();

    await expect(
      todoPage.todoItem(temporaryTitle)
    ).toHaveCount(0);

    await expect(
      todoPage.todoItems
    ).toHaveCount(3);

    await expect(
      todoPage.todoCounter
    ).toHaveText('3 items left');
  });

  test('deletes an individual Todo', async () => {
    const todoTitle = 'Task to delete';

    await todoPage.addTodo(todoTitle);

    await expect(
      todoPage.todoItem(todoTitle)
    ).toBeVisible();

    await expect(
      todoPage.todoItems
    ).toHaveCount(3);

    await todoPage.deleteTodo(todoTitle);

    await expect(
      todoPage.todoItem(todoTitle)
    ).toHaveCount(0);

    await expect(
      todoPage.todoItem('Pay electric bill')
    ).toBeVisible();

    await expect(
      todoPage.todoItem('Walk the dog')
    ).toBeVisible();

    await expect(
      todoPage.todoItems
    ).toHaveCount(2);

    await expect(
      todoPage.todoCounter
    ).toHaveText('2 items left');
  });

  test('deletes "Walk the dog" without affecting other Todos', async () => {
    test.fixme(
      true,
      'Blocked by a known defect: deleting "Walk the dog" removes "Pay electric bill" instead.'
    );

    await todoPage.deleteTodo('Walk the dog');

    await expect(
      todoPage.todoItem('Walk the dog')
    ).toHaveCount(0);

    await expect(
      todoPage.todoItem('Pay electric bill')
    ).toBeVisible();

    await expect(
      todoPage.todoItems
    ).toHaveCount(1);

    await expect(
      todoPage.todoCounter
    ).toHaveText('1 item left');
  });

  test('marks all Todos as completed and active', async () => {
    test.fixme(
      true,
      'Blocked by a known defect: Toggle All does not complete all default Todos.'
    );

    const firstTodoCheckbox =
      todoPage.todoCheckbox('Pay electric bill');

    const secondTodoCheckbox =
      todoPage.todoCheckbox('Walk the dog');

    await todoPage.toggleAllTodos();

    await expect(
      firstTodoCheckbox
    ).toBeChecked();

    await expect(
      secondTodoCheckbox
    ).toBeChecked();

    await expect(
      todoPage.todoCounter
    ).toHaveText('0 items left');

    await todoPage.toggleAllTodos();

    await expect(
      firstTodoCheckbox
    ).not.toBeChecked();

    await expect(
      secondTodoCheckbox
    ).not.toBeChecked();

    await expect(
      todoPage.todoCounter
    ).toHaveText('2 items left');
  });

  test('clears completed Todos', async () => {
    const completedTodoTitle = 'Completed task';

    await todoPage.addTodo(completedTodoTitle);

    await todoPage.completeTodo(completedTodoTitle);

    await expect(
      todoPage.todoItem(completedTodoTitle)
    ).toHaveClass(/completed/);

    await expect(
      todoPage.clearCompletedButton
    ).toBeVisible();

    await todoPage.clearCompletedTodos();

    await expect(
      todoPage.todoItem(completedTodoTitle)
    ).toHaveCount(0);

    await expect(
      todoPage.todoItem('Pay electric bill')
    ).toBeVisible();

    await expect(
      todoPage.todoItem('Walk the dog')
    ).toBeVisible();

    await expect(
      todoPage.todoItems
    ).toHaveCount(2);

    await expect(
      todoPage.todoCounter
    ).toHaveText('2 items left');

    await expect(
      todoPage.clearCompletedButton
    ).toHaveCount(0);
  });

  test('clears all completed default Todos', async () => {
    test.fixme(
      true,
      'Blocked by a known defect: Clear completed does not remove all completed default Todos; "Walk the dog" remains.'
    );

    await todoPage.completeTodo('Pay electric bill');
    await todoPage.completeTodo('Walk the dog');

    await expect(
      todoPage.todoCheckbox('Pay electric bill')
    ).toBeChecked();

    await expect(
      todoPage.todoCheckbox('Walk the dog')
    ).toBeChecked();

    await expect(
      todoPage.clearCompletedButton
    ).toBeVisible();

    await todoPage.clearCompletedTodos();

    await expect(
      todoPage.todoItem('Pay electric bill')
    ).toHaveCount(0);

    await expect(
      todoPage.todoItem('Walk the dog')
    ).toHaveCount(0);

    await expect(
      todoPage.todoItems
    ).toHaveCount(0);
  });
});