import React from 'react';
import { connect } from 'react-redux';
import {
  Platform, StatusBar, StyleSheet, View,
} from 'react-native';
import {
  AppLoading, Font, Icon,
} from 'expo';

import AppNavigator from '../navigation/AppNavigator';
import { updateEntities } from '../redux/actions';
import fetchFxRates from '../lib/fx';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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

  updateFxRates = async () => {
    const fxRates = await fetchFxRates();
    const currencies = Object.keys(fxRates).reduce((accum, currency) => ({
      ...accum,
      [currency]: {
        ...accum[currency],
        fxRatePerEuro: fxRates[currency],
      },
    }), this.props.state.entities.currencies);
    this.props.updateEntities({ currencies });
  }

  loadResourcesAsync = async () => Promise.all([
    Font.loadAsync({ ...Icon.Ionicons.font }),
    this.updateFxRates(),
  ]);

  handleLoadingError = (error) => {
    console.warn(error); // eslint-disable-line no-console
  };

  handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const mapStateToProps = state => ({ state });

const mapDispatchToProps = dispatch => ({
  updateEntities: entities => dispatch(updateEntities(entities)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
