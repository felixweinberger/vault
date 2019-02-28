import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import AppContainer from './containers/AppContainer';
import reducers from './redux/reducers';
import model from './db/model';

/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
const store = createStore(
  reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
/* eslint-enable */

export default class App extends React.Component {
  componentDidMount() {
    model.createExpenseTable();
  }

  render() {
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    );
  }
}
