import React from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {
  AppLoading,
  Asset,
  Font,
  Icon,
} from 'expo';
import AppNavigator from '../navigation/AppNavigator';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default class App extends React.Component {
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

// const mapStateToProps = (state) => ({
//   events: state.events,
// });

// const mapDispatchToProps = (dispatch) => ({
//   updateEvents: events => dispatch(updateEvents(events)),
//   addEvent: event => dispatch(addEvent(event)),
// });

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(App);
