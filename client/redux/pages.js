const defaultPages = {
  summaryScreen: {
    expensesByDate: [],
    expensesByCategory: [],
  },
};

const pages = (state = defaultPages, action) => {
  if (!action.pages) return state;

  // return {
  //   ...state,
  //   summaryScreen: {
  //     expensesByDate: {
  //       ...action.expensesByDate.map(expense => expense.id),
  //     },
  //     expensesByCategory: {
  //       ...action.expensesByCategory.map(expense => expense.id),
  //     },
  //   },
  // };

  return state;
};

export default pages;
