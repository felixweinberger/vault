import React from 'react';
import {
  Platform, StatusBar, StyleSheet, View,
} from 'react-native';
import {
  AppLoading, Asset, Font, Icon,
} from 'expo';
import { connect } from 'react-redux';

import AppNavigator from '../navigation/AppNavigator';
import {
  addExpense, deleteExpense, modifyExpense, modifySettings,
} from '../redux/actions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  render() {
    if (!this.state.isLoadingComplete) {
      return (
        <AppLoading
          startAsync={this.loadResourcesAsync}
          onError={this.handleLoadingError}
          onFinish={this.handleFinishLoading}
        />
      );
    }

    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <AppNavigator />
      </View>
    );
  }

  loadResourcesAsync = async () => Promise.all([
    Asset.loadAsync([
      require('../assets/images/robot-dev.png'),
      require('../assets/images/robot-prod.png'),
    ]),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Icon.Ionicons.font,
    }),
  ]);

  handleLoadingError = (error) => {
    console.warn(error); // eslint-disable-line no-console
  };

  handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const mapStateToProps = state => ({
  expenses: state.expenses,
  settings: state.settings,
});

const mapDispatchToProps = dispatch => ({
  addExpense: expense => dispatch(addExpense(expense)),
  deleteExpense: expenseId => dispatch(deleteExpense(expenseId)),
  modifyExpense: expense => dispatch(modifyExpense(expense)),
  modifySettings: settings => dispatch(modifySettings(settings)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
