import React from "react";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";

import AppContainer from "./containers/AppContainer";
import configureStore from "./redux/store";

console.disableYellowBox = true; // eslint-disable-line

// Clear async storage for test only
// import { AsyncStorage } from "react-native";
// const clearAsyncStorage = async () => {
//   AsyncStorage.clear();
// };
// clearAsyncStorage();

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
