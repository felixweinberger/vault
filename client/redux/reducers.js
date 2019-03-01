import { combineReducers } from 'redux';

const emptyExpense = {
  amount: 0,
  pretty: '0.00',
  currency: '€ EUR',
  category: null,
  tags: [],
  timestamp: null,
  dateISO: null,
  date: null,
};

const expenses = (state = [], action) => {
  switch (action.type) {
    case 'ADD_EXPENSE': {
      // TODO
      return 0;
    }
    case 'DELETE_EXPENSE': {
      // TODO
      return 0;
    }
    case 'MODIFY_EXPENSE': {
      // TODO
      return 0;
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
    case 'SUBMIT_NEW_EXPENSE': {
      // TODO
      return 0;
    }
    case 'CANCEL_NEW_EXPENSE': {
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
  expenses,
  currentExpense,
  settings,
});

export default reducers;
