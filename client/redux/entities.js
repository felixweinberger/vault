import { defaultExpense, defaultCurrencies, defaultSettings } from './defaults';

const defaultEntities = {
  current: { ...defaultExpense },
  expenses: {},
  categories: {},
  tags: {},
  settings: { ...defaultSettings },
  currencies: { ...defaultCurrencies },
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
  };
};

export default entities;
