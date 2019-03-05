/* eslint-disable no-console */

import React from 'react';
import { connect } from 'react-redux';
import {
  ScrollView, StyleSheet, View, Text, TouchableOpacity,
} from 'react-native';
import { Linking, WebBrowser, Icon } from 'expo';
import shittyQs from 'shitty-qs';
import { Dropbox } from 'dropbox';

import { updateEntities } from '../redux/actions';
import { OAUTH_CONFIG, DROPBOX } from '../lib/dropbox/DropboxConstants';

const styles = StyleSheet.create({
  option: {
    flex: 1,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
  },
  sectionHeader: {
    flex: 1,
    justifyContent: 'center',
    height: 80,
  },
  sectionHeader__text: {
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
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
    console.log('Deep link event!', event);

    const queryStringResult = event.url.match(/#(.*)/);
    if (queryStringResult === null || queryStringResult.length < 2) {
      return Promise.reject(
        new Error('Did not receive a query string as part of this deep link!'),
      );
    }

    const [, queryString] = queryStringResult;
    const parsedQueryString = shittyQs(queryString);
    if (parsedQueryString.error) {
      // There was an error!
      const errorCode = parsedQueryString.error;
      const errorDescription = parsedQueryString.error_description;

      console.error('Dropbox OAuth error! code:', errorCode);
      console.error('Error description:', errorDescription);

      return Promise.reject(
        new Error(`Could not authorize with Dropbox. Code: ${errorCode}`),
      );
    }

    // Otherwise: not an error!
    const accessToken = parsedQueryString.access_token;
    const accountId = parsedQueryString.account_id;

    // Persist accessToken and accountId
    return this.props.updateEntities({ settings: { dropboxAuth: { accessToken, accountId } } });
  };

  addLinkingListener = () => {
    Linking.addEventListener('url', this.handleRedirect);
  };

  removeLinkingListener = () => {
    Linking.removeEventListener('url', this.handleRedirect);
  };

  onDropboxLinkPress = async () => {
    try {
      this.addLinkingListener();
      console.log(JSON.stringify(Linking.makeUrl()));
      const result = await WebBrowser.openBrowserAsync(
        [
          DROPBOX.AUTHORIZE_URL,
          '?response_type=token',
          `&client_id=${OAUTH_CONFIG.OAUTH_CLIENT_ID}`,
          `&redirect_uri=${OAUTH_CONFIG.OAUTH_REDIRECT_URI}`,
        ].join(''),
      );
      // console.log(result);
      this.setState({ result });
      this.removeLinkingListener();
    } catch (error) {
      console.log(error);
    }
  };

  onUploadPress = async () => {
    const { accessToken } = this.props.state.entities.settings.dropboxAuth;
    if (accessToken === null) {
      throw new Error('Cannot perform backup without an access token');
    }

    const dbx = new Dropbox({ accessToken, fetch }); // eslint-disable-line no-undef
    const backupEntities = JSON.stringify(this.props.state.entities.expenses);
    dbx.filesUpload({ path: '/backup.json', contents: backupEntities, mode: 'overwrite' })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  onDownloadPress = async () => {
    const { accessToken } = this.props.state.entities.settings.dropboxAuth;
    if (accessToken === null) {
      throw new Error('Cannot perform backup without an access token');
    }

    const dbx = new Dropbox({ accessToken, fetch }); // eslint-disable-line no-undef
    const response = await dbx.filesDownload({ path: '/backup.json' });
    const text = await (new Response(response.fileBlob)).text(); // eslint-disable-line no-undef
    const expenses = JSON.parse(text);
    const oldCategories = this.props.state.entities.categories;
    const categories = Object.values(expenses).reduce((acc, el) => {
      acc[el.category] = acc[el.category] ? acc[el.category] + 1 : 1;
      return acc;
    }, oldCategories);
    this.props.updateEntities({ expenses, categories });
  }

  render() {
    const { mainCurrency } = this.props.state.entities.settings;
    const mainCurrencySymbol = this.props.state.entities.currencies[mainCurrency].symbol;
    return (
      <ScrollView style={styles.options} contentContainerStyle={styles.optionsContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeader__text}>
            Currency settings  💸
          </Text>
        </View>
        <View style={styles.option}>
          <Text>Home Currency</Text>
          <TouchableOpacity underlayColor='white' onPress={this.onCurrencyPress}>
            <Text>{mainCurrency} ({mainCurrencySymbol})</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeader__text}>
            Dropbox Integration <Icon.Ionicons name={'logo-dropbox'} size={30} />
          </Text>
        </View>
        <View style={styles.option}>
          <Text>Authorize</Text>
          <TouchableOpacity underlayColor='white' onPress={this.onDropboxLinkPress}>
            <Text>Link Dropbox</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.option}>
          <Text>Export .json</Text>
          <TouchableOpacity underlayColor='white' onPress={this.onUploadPress}>
            <Text>Upload</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.option}>
          <Text>Import .json</Text>
          <TouchableOpacity underlayColor='white' onPress={this.onDownloadPress}>
            <Text>Download</Text>
          </TouchableOpacity>
        </View>
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
