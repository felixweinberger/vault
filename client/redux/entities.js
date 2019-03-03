const defaultExpense = {
  id: null,
  amount: 0,
  currency: 'EUR',
  inMainCurrency: 0,
  mainCurrency: 'EUR',
  category: null,
  tags: [],
  comment: null,
  date: null,
};

const defaultEntities = {
  current: Object.assign(defaultExpense),
  expenses: {},
  currencies: {},
  categories: {},
  tags: {},
  settings: {},
  fxrates: {},
};

const entities = (state = defaultEntities, action) => {
  if (action.type === 'DELETE_EXPENSE') {
    const newExpenses = { ...state.expenses };
    delete newExpenses[action.expenseId];

    return {
      ...state,
      expenses: { ...newExpenses },
    };
  }

  if (!action.entities) return state;
  return {
    ...state,
    current: { ...state.current, ...action.entities.current },
    expenses: { ...state.expenses, ...action.entities.expenses },
    currencies: { ...state.currencies, ...action.entities.currencies },
    categories: { ...state.categories, ...action.entities.categories },
    tags: { ...state.tags, ...action.entities.tags },
    settings: { ...state.settings, ...action.entities.settings },
    fxrates: { ...state.fxrates, ...action.entities.fxrates },
  };
};

export default entities;
