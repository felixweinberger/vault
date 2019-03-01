import { combineReducers } from 'redux';

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

const currentExpense = (state = {
  amount: 0,
  pretty: '0.00',
  currency: '€ EUR',
  category: null,
  tags: [],
  timestamp: null,
  date: null,
}, action) => {
  switch (action.type) {
    case 'SUBMIT_NEW_AMOUNT': {
      const newState = {
        amount: action.expenseAmount.amount,
        pretty: action.expenseAmount.pretty,
        currency: action.expenseAmount.currency,
      };
      return newState;
    }
    case 'SUBMIT_NEW_EXPENSE': {
      // TODO
      return 0;
    }
    case 'CANCEL_NEW_EXPENSE': {
      return {
        amount: 0,
        pretty: '0.00',
        currency: '€ EUR',
        category: null,
        tags: [],
        timestamp: null,
        date: null,
      };
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
