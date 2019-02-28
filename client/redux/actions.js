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

export const submitNewAmount = expenseAmount => ({
  type: 'SUBMIT_NEW_AMOUNT',
  expenseAmount,
});

export const submitNewExpense = expense => ({
  type: 'SUBMIT_NEW_EXPENSE',
  expense,
});

export const cancelNewExpense = () => ({
  type: 'CANCEL_NEW_EXPENSE',
});
