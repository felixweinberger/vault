export const updateEntities = entities => ({
  type: 'UPDATE_STATE',
  entities,
});

export const deleteExpense = expenseId => ({
  type: 'DELETE_EXPENSE',
  expenseId,
});
