import uuidv4 from 'uuid/v4';
import { combineReducers } from 'redux';

const emptyExpense = {
  id: null,
  amount: 0,
  pretty: '0.00',
  currency: '€ EUR',
  inMainCurrency: null,
  mainCurrency: null,
  category: null,
  tags: [],
  comment: null,
  timestamp: null,
  date: null,
};

const expenses = (state = [], action) => {
  switch (action.type) {
    case 'ADD_EXPENSE': {
      const newExpense = {
        id: uuidv4(),
        ...action.expense,
      };
      return [...state, newExpense];
    }
    case 'DELETE_EXPENSE': {
      return state.filter(expense => expense.id !== action.expenseId);
    }
    case 'MODIFY_EXPENSE': {
      // TODO
      return state;
    }
    default: {
      return state;
    }
  }
};

const categories = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_EXPENSE': {
      const newState = { ...state };
      newState[action.expense.category] = newState[action.expense.category]
        ? newState[action.expense.category] + 1
        : 1;
      return newState;
    }
    case 'DELETE_EXPENSE': {
      const newState = { ...state };
      newState[action.expense.category] -= 1;
      return newState;
    }
    default: {
      return state;
    }
  }
};

const currentExpense = (state = emptyExpense, action) => {
  switch (action.type) {
    case 'SUBMIT_NEW_AMOUNT': {
      const newState = action.expense;
      return newState;
    }
    case 'CLEAR_NEW_EXPENSE': {
      return emptyExpense;
    }
    default: {
      return state;
    }
  }
};

const settings = (state = {}, action) => {
  switch (action.type) {
    case 'MODIFY_SETTINGS': {
      // TODO
      return 0;
    }
    default: {
      return state;
    }
  }
};

const reducers = combineReducers({
  currentExpense,
  expenses,
  categories,
  settings,
});

export default reducers;
