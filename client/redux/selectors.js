
export const getAllExpenses = state => state.entities.expenses.allIds
  .map(id => state.entities.expenses.byId[id]);

export const getAllCurrencies = state => state.entities.currencies.allIds
  .map(id => state.entities.currencies.byId[id]);
