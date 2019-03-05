/* eslint-disable no-console */

import React from 'react';
import { connect } from 'react-redux';
import {
  ScrollView, StyleSheet, View, Text, TouchableOpacity,
} from 'react-native';
import { Linking, WebBrowser } from 'expo';

import { updateEntities } from '../redux/actions';
import { OAUTH_CONFIG, DROPBOX } from '../lib/dropbox/DropboxConstants';
// import { authorize } from '../lib/dropbox/DropboxAuthenticate';


const styles = StyleSheet.create({
  option: {
    flex: 1,
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 20,
    marginRight: 20,
    alignItems: 'center',
  },
});

class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings',
  };

  state = {
    redirectData: null,
  }

  onCurrencyPress = () => {
    this.props.navigation.navigate('SelectCurrency', { isGlobalChange: true });
  };

  handleRedirect = (event) => {
    WebBrowser.dismissBrowser();
    const data = Linking.parse(event.url);
    this.setState({ redirectData: data });
    console.log(data);
  };

  onDropboxPress = async () => {
    try {
      this.addLinkingListener();
      console.log(JSON.stringify(Linking.makeUrl()));
      const stateValue = Math.random().toString();
      const result = await WebBrowser.openBrowserAsync(
        [
          DROPBOX.AUTHORIZE_URL,
          '?response_type=token',
          `&client_id=${OAUTH_CONFIG.OAUTH_CLIENT_ID}`,
          `&redirect_uri=${OAUTH_CONFIG.OAUTH_REDIRECT_URI}`,
          `&state=${stateValue}`,
        ].join(''),
      );
      // console.log(result);
      this.setState({ result });
      this.removeLinkingListener();
    } catch (error) {
      console.log(error);
    }
  };

  addLinkingListener = () => {
    Linking.addEventListener('url', this.handleRedirect);
  };

  removeLinkingListener = () => {
    Linking.removeEventListener('url', this.handleRedirect);
  };

  maybeRenderRedirectData = () => {
    if (this.state.redirectData) {
      return <Text>{JSON.stringify(this.state.redirectData)}</Text>;
    }
    return null;
  }

  render() {
    const { mainCurrency } = this.props.state.entities.settings;
    const mainCurrencySymbol = this.props.state.entities.currencies[mainCurrency].symbol;
    return (
      <ScrollView style={styles.options} contentContainerStyle={styles.optionsContainer}>
        <View style={styles.option}>
          <Text>Home Currency</Text>
          <TouchableOpacity underlayColor="white" onPress={this.onCurrencyPress}>
            <Text>{mainCurrency} ({mainCurrencySymbol})</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.option}>
          <Text>Dropbox Backup</Text>
          <TouchableOpacity underlayColor="white" onPress={this.onDropboxPress}>
            <Text>Enable</Text>
          </TouchableOpacity>
        </View>
        {this.maybeRenderRedirectData()}
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({ state });

const mapDispatchToProps = dispatch => ({
  updateEntities: entities => dispatch(updateEntities(entities)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsScreen);
