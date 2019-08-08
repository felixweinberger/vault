import React from "react";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";

import AppContainer from "./containers/AppContainer";
import configureStore from "./redux/store";

console.disableYellowBox = true; // eslint-disable-line

// import { AsyncStorage } from "react-native";
// import { ENV } from "react-native-dotenv";
// Clear async storage for test only
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
