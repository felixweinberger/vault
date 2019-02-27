import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import AppContainer from './AppContainer';
import reducers from './redux/reducers';

const store = createStore(reducers, {});

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    );
  }
}
