/* eslint-disable no-console */

import React from 'react';
import { connect } from 'react-redux';
import {
  ScrollView, StyleSheet, View, Text, TouchableOpacity, Switch,
} from 'react-native';
import { Linking, WebBrowser, Icon } from 'expo';
import shittyQs from 'shitty-qs';
import { Dropbox } from 'dropbox';

import { updateEntities } from '../redux/actions';
import { OAUTH_CONFIG, DROPBOX } from '../constants/DropboxConstants';
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
    borderColor: 'lightgrey',
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
          `&redirect_uri=${OAUTH_CONFIG.OAUTH_REDIRECT_URI_DEV}`,
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

    const dbx = new Dropbox({ accessToken, fetch });
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

    const dbx = new Dropbox({ accessToken, fetch });
    const response = await dbx.filesDownload({ path: '/backup.json' });
    const text = await (new Response(response.fileBlob)).text();
    const expenses = JSON.parse(text);
    const oldCategories = this.props.state.entities.categories;
    const categories = Object.values(expenses).reduce((acc, el) => {
      acc[el.category] = acc[el.category] ? acc[el.category] + 1 : 1;
      return acc;
    }, oldCategories);
    this.props.updateEntities({ expenses, categories });
  }

  onAutoBackupPress = () => {
    this.props.updateEntities(
      {
        settings:
        {
          automaticBackup: !this.props.state.entities.settings.automaticBackup,
        },
      },
    );
    console.log('pressed autobackup');
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
          <Text style={styles.option__text}>Export .json</Text>
          <TouchableOpacity style={styles.optionBtn} underlayColor='white' onPress={this.onUploadPress}>
            <Text style={styles.option__text}>Upload</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.option}>
          <Text style={styles.option__text}>Import .json</Text>
          <TouchableOpacity style={styles.optionBtn} underlayColor='white' onPress={this.onDownloadPress}>
            <Text style={styles.option__text}>Download</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.option}>
          <Text style={styles.option__text}>Automatic daily backup</Text>
          <Switch
            value={this.props.state.entities.settings.automaticBackup}
            trackColor={{ true: Colors.orange6, false: 'lightgrey' }}
            onValueChange={this.onAutoBackupPress}
          />
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
