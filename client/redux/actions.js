export const addExpense = expense => ({
  type: 'ADD_EXPENSE',
  expense,
});

export const deleteExpense = expenseId => ({
  type: 'DELETE_EXPENSE',
  expenseId,
});

export const modifyExpense = expense => ({
  type: 'MODIFY_EXPENSE',
  expense,
});

export const modifySettings = settings => ({
  type: 'MODIFY_SETTINGS',
  settings,
});

export const submitNewAmount = expense => ({
  type: 'SUBMIT_NEW_AMOUNT',
  expense,
});

export const clearNewExpense = () => ({
  type: 'CLEAR_NEW_EXPENSE',
});
