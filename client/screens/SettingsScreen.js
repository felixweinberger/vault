/* eslint-disable no-console */

import React from 'react';
import { connect } from 'react-redux';
import {
  ScrollView, StyleSheet, View, Text, TouchableOpacity,
} from 'react-native';
import { Linking, WebBrowser, Icon } from 'expo';
import shittyQs from 'shitty-qs';
import RNFetchBlob from 'rn-fetch-blob';
import converter from 'json-2-csv';

import { updateEntities } from '../redux/actions';
import { OAUTH_CONFIG, DROPBOX } from '../constants/Dropbox';
import Colors from '../constants/Colors';

const styles = StyleSheet.create({
  options: {
    backgroundColor: Colors.greyLight,
  },
  option: {
    flex: 1,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
  },
  optionBtn: {
    padding: 5,
    width: 80,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'grey',
  },
  sectionHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
    backgroundColor: Colors.orange6,
  },
  sectionHeader__text: {
    fontWeight: 'bold',
    color: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 16,
    marginLeft: 20,
    marginRight: 20,
  },
  sectionHeader__icon: {
    fontWeight: 'bold',
    color: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 25,
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
      const errorCode = parsedQueryString.error;
      const errorDescription = parsedQueryString.error_description;

      console.error('Dropbox OAuth error! code:', errorCode);
      console.error('Error description:', errorDescription);

      return Promise.reject(
        new Error(`Could not authorize with Dropbox. Code: ${errorCode}`),
      );
    }

    const accessToken = parsedQueryString.access_token;
    const accountId = parsedQueryString.account_id;

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
      const result = await WebBrowser.openBrowserAsync(
        [
          DROPBOX.AUTHORIZE_URL,
          '?response_type=token',
          `&client_id=${OAUTH_CONFIG.OAUTH_CLIENT_ID}`,
          `&redirect_uri=${OAUTH_CONFIG.OAUTH_REDIRECT_URI_DEV}`,
        ].join(''),
      );
      this.setState({ result });
      this.removeLinkingListener();
    } catch (error) {
      console.log(error);
    }
  };

  onDropboxUnlinkPress = async () => {
    try {
      const { accessToken } = this.props.state.entities.settings.dropboxAuth;
      if (accessToken === null) {
        throw new Error('Cannot unlink without an access token');
      }

      const response = await fetch(DROPBOX.REVOKE_TOKEN_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log('Unlink response:', response);
      if (response.status === 200) {
        return;
      }
      throw new Error(
        `Failed to revoke Dropbox token. status: ${
          response.status
        } and response: ${JSON.stringify(response)}`,
      );
    } catch (error) {
      console.log(error);
    }
  };

  onUploadPress = async () => {
    try {
      const { accessToken } = this.props.state.entities.settings.dropboxAuth;
      const { expenses } = this.props.state.entities;
      if (accessToken === null) {
        throw new Error('Cannot perform backup without an access token');
      }

      console.log('[Dropbox backup] UPLOADING and replacing DB on Dropbox: beginning.');

      const jsonArr = Object.values(expenses);
      const csvStr = await converter.json2csvAsync(jsonArr);
      const backupExpenses = btoa(csvStr);
      const response = await RNFetchBlob.fetch('POST', DROPBOX.UPLOAD_URL, {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/octet-stream',
        'Dropbox-API-Arg': JSON.stringify({
          path: '/backup.csv',
          mode: 'overwrite',
        }),
      }, backupExpenses);

      console.log('[Dropbox backup] UPLOAD to Dropbox complete!', response);
    } catch (e) {
      console.log('Error: ', e);
    }
  }

  onDownloadPress = async () => {
    try {
      const { accessToken } = this.props.state.entities.settings.dropboxAuth;
      if (accessToken === null) {
        throw new Error('Cannot perform backup without an access token');
      }

      console.log('[Dropbox backup] DOWNLOADING and applying DB from Dropbox: beginning.');

      const response = await RNFetchBlob.fetch('POST', DROPBOX.DOWNLOAD_URL, {
        Authorization: `Bearer ${accessToken}`,
        'Dropbox-API-Arg': JSON.stringify({
          path: '/backup.csv',
        }),
      });

      console.log('[Dropbox backup] DOWNLOAD from Dropbox complete!');

      const jsonArr = await converter.csv2jsonAsync(response.data);
      const expenses = {};
      jsonArr.forEach((expense) => {
        expenses[expense.id] = expense;
      });

      console.log('[Dropbox backup] CONVERSTION to json complete!');

      const oldCategories = this.props.state.entities.categories;
      const categories = Object.values(expenses).reduce((acc, el) => {
        acc[el.category] = acc[el.category] ? acc[el.category] + 1 : 1;
        return acc;
      }, oldCategories);
      this.props.updateEntities({ expenses, categories });
      console.log('[Dropbox backup] IMPORT from Dropbox complete!');
    } catch (e) {
      console.log('Error: ', e);
    }
  }

  render() {
    const { mainCurrency } = this.props.state.entities.settings;
    const mainCurrencySymbol = this.props.state.entities.currencies[mainCurrency].symbol;
    return (
      <ScrollView style={styles.options} contentContainerStyle={styles.optionsContainer}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeader__left}>
            <Text style={styles.sectionHeader__text}>
              Currency settings
            </Text>
          </View>
          <View style={styles.sectionHeader__right}>
            <Icon.Ionicons name={'ios-cash'} style={styles.sectionHeader__icon}/>
          </View>
        </View>
        <View style={styles.option}>
          <Text>Home Currency</Text>
          <TouchableOpacity style={styles.optionBtn} underlayColor='white' onPress={this.onCurrencyPress}>
            <Text>{mainCurrency} ({mainCurrencySymbol})</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeader__left}>
            <Text style={styles.sectionHeader__text}>
              Dropbox integration
            </Text>
          </View>
          <View style={styles.sectionHeader__right}>
            <Icon.Ionicons name={'logo-dropbox'} style={styles.sectionHeader__icon}/>
          </View>
        </View>
        <View style={styles.option}>
          <Text style={styles.option__text}>Link Dropbox</Text>
          <TouchableOpacity style={styles.optionBtn} underlayColor='white' onPress={this.onDropboxLinkPress}>
            <Text style={styles.option__text}>Link</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.option}>
          <Text style={styles.option__text}>Unlink Dropbox</Text>
          <TouchableOpacity style={styles.optionBtn} underlayColor='white' onPress={this.onDropboxUnlinkPress}>
            <Text style={styles.option__text}>Unlink</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.option}>
          <Text style={styles.option__text}>Export CSV to Dropbox</Text>
          <TouchableOpacity style={styles.optionBtn} underlayColor='white' onPress={this.onUploadPress}>
            <Text style={styles.option__text}>Upload</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.option}>
          <Text style={styles.option__text}>Import CSV from Dropbox</Text>
          <TouchableOpacity style={styles.optionBtn} underlayColor='white' onPress={this.onDownloadPress}>
            <Text style={styles.option__text}>Download</Text>
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
