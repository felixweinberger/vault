/* eslint-disable no-console */

import React from 'react';
import { connect } from 'react-redux';
import {
  ScrollView, StyleSheet, View, Text, TouchableOpacity,
} from 'react-native';
import { Linking, WebBrowser } from 'expo';
import shittyQs from 'shitty-qs';
import fetch from 'isomorphic-fetch';
import { Dropbox } from 'dropbox';

import { updateEntities } from '../redux/actions';
import { OAUTH_CONFIG, DROPBOX } from '../lib/dropbox/DropboxConstants';

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

  backupIsCurrentlyInProgress = false;

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

  onDownloadPress = async () => {
    // todo
  }

  onUploadPress = async () => {
    const { accessToken } = this.props.state.entities.settings.dropboxAuth;

    if (accessToken === null) {
      throw new Error('Cannot perform backup without an access token');
    }

    // If a backup is already in progress, this will currently be a no-op
    if (this.backupIsCurrentlyInProgress === true) {
      throw new Error('[Dropbox backup] backup already in progress!');
    }

    console.log('[Dropbox backup] begin!');
    this.backupIsCurrentlyInProgress = true;

    // store the current redux
    const backupEntities = JSON.stringify(this.props.state.entities);

    // Kick off the remote backup to Dropbox.
    this.performBackup(backupEntities, accessToken).then(() => {
      this.backupIsCurrentlyInProgress = false;
      console.log('[Dropbox backup] BACKUP COMPLETE.');
    }).catch((reason) => {
      // Could not backup!
      console.log('[Dropbox backup] Failed prepping for backup!', reason);
      this.backupIsCurrentlyInProgress = false;
    });
  }

  performBackup = async (backupEntities, accessToken) => {
    if (accessToken === null) {
      throw new Error('Cannot perform backup without an access token');
    }

    console.log('We have an access token! Entities to be backed up:', backupEntities);

    return this.uploadToDropbox(backupEntities, accessToken);
  }

  uploadToDropbox = async (backupEntities, accessToken) => {
    const dbx = new Dropbox({ accessToken, fetch });
    dbx.filesUpload({ path: '/backup.json', contents: backupEntities })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }

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
          <TouchableOpacity underlayColor='white' onPress={this.onCurrencyPress}>
            <Text>{mainCurrency} ({mainCurrencySymbol})</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.option}>
          <Text>Dropbox Link</Text>
          <TouchableOpacity underlayColor='white' onPress={this.onDropboxLinkPress}>
            <Text>Link</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.option}>
          <Text>Dropbox Upload</Text>
          <TouchableOpacity underlayColor='white' onPress={this.onUploadPress}>
            <Text>Upload</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.option}>
          <Text>Dropbox Download</Text>
          <TouchableOpacity underlayColor='white' onPress={this.onDownloadPress}>
            <Text>Download</Text>
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
