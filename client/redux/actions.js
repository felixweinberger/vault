export const updateEntities = entities => ({
  type: 'UPDATE_STATE',
  entities,
});

export const deleteExpense = expenseId => ({
  type: 'DELETE_EXPENSE',
  expenseId,
});

export const modifySettings = settings => ({
  type: 'MODIFY_SETTINGS',
  settings,
});
