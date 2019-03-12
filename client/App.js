import React from 'react';
import { AsyncStorage } from 'react-native';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { ENV } from 'react-native-dotenv';

import AppContainer from './containers/AppContainer';
import configureStore from './redux/store';

// Clear async storage for dev only
if (ENV === 'dev') {
  const clearAsyncStorage = async () => {
    AsyncStorage.clear();
  };
  clearAsyncStorage();
}

const { store, persistor } = configureStore();

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppContainer />
        </PersistGate>
      </Provider>
    );
  }
}
