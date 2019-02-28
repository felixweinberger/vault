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
  // TODO
  const res = expense;
  return res;
};

model.deleteExpense = async (expenseId) => {
  // TODO
  const res = expenseId;
  return res;
};

model.modifyExpense = async (expense) => {
  // TODO
  const res = expense;
  return res;
};

model.changeSettings = async (expense) => {
  // TODO
  const res = expense;
  return res;
};

export default model;
