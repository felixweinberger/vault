import React from "react";
import { connect } from "react-redux";
import { Platform, StatusBar, StyleSheet, View, AppState } from "react-native";
import { AppLoading, Font, Icon } from "expo";

import AppNavigator from "../navigation/AppNavigator";
import { updateEntities } from "../redux/actions";
import fetchFxRates from "../lib/fx";
import dropboxUpload from "../lib/sync";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  }
});

class App extends React.Component {
  state = {
    isLoadingComplete: false
  };

  componentDidMount() {
    AppState.addEventListener("change", this.handleAppStateChange);
  }

  handleAppStateChange = currentState => {
    const {
      state: {
        entities: {
          expenses,
          settings: {
            dropboxAuth: { accessToken },
            automaticBackup
          }
        }
      }
    } = this.props;

    if (automaticBackup && currentState === "active") {
      try {
        dropboxUpload(accessToken, expenses);
      } catch (_) {
        // fail silently
      }
    }
  };

  updateFxRates = async () => {
    const fxRates = await fetchFxRates();
    const currencies = Object.keys(fxRates).reduce(
      (accum, currency) => ({
        ...accum,
        [currency]: {
          ...accum[currency],
          fxRatePerEuro: fxRates[currency]
        }
      }),
      this.props.state.entities.currencies
    );
    this.props.updateEntities({ currencies });
  };

  loadResourcesAsync = async () =>
    Promise.all([
      Font.loadAsync({ ...Icon.Ionicons.font }),
      this.updateFxRates()
    ]);

  handleLoadingError = error => {
    console.warn(error); // eslint-disable-line no-console
  };

  handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
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
        {Platform.OS === "ios" && <StatusBar barStyle="default" />}
        <AppNavigator />
      </View>
    );
  }
}

const mapStateToProps = state => ({ state });

const mapDispatchToProps = dispatch => ({
  updateEntities: entities => dispatch(updateEntities(entities))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
