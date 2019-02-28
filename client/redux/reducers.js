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
  settings,
});

export default reducers;
