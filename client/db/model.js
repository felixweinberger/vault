import db from './db';

function executeSqlAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => tx.executeSql(
      sql,
      params,
      (_, { rows }) => resolve(rows._array), // eslint-disable-line no-underscore-dangle
      reject,
    ));
  });
}

const model = {};

model.createExpenseTable = async () => {
  const res = await executeSqlAsync(
    'create table if not exists expenses (id integer primary key not null, amount int);',
  );
  return res;
};

model.addExpense = async (expense) => {
  return expense;
};

model.deleteExpense = async (expenseId) => {
  // TODO
  return expenseId;
};

model.modifyExpense = async (expense) => {
  // TODO
  return expense;
};

model.changeSettings = async (expense) => {
  // TODO
  return expense;
};

export default model;
