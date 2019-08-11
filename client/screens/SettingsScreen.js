/* eslint-disable no-console */
import React from "react";
import { connect } from "react-redux";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Switch
} from "react-native";
import { Linking, WebBrowser, Icon } from "expo";
import shittyQs from "shitty-qs";
import RNFetchBlob from "rn-fetch-blob";
import converter from "json-2-csv";

import { updateEntities } from "../redux/actions";
import { OAUTH_CONFIG, DROPBOX } from "../constants/Dropbox";
import Colors from "../constants/Colors";

const styles = StyleSheet.create({
  options: {
    backgroundColor: Colors.greyLight
  },
  defaultText: {
    fontSize: 16
  },
  option: {
    flex: 1,
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 20,
    marginRight: 20
  },
  status__text: {
    flex: 1,
    fontStyle: "italic",
    textAlign: "center",
    fontSize: 16
  },
  optionBtn: {
    padding: 5,
    width: 100,
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "grey"
  },
  sectionHeader: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 40,
    backgroundColor: Colors.orange6
  },
  sectionHeader__text: {
    fontWeight: "bold",
    color: "white",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 16,
    marginLeft: 20,
    marginRight: 20
  },
  sectionHeader__icon: {
    fontWeight: "bold",
    color: "white",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 25,
    marginLeft: 20,
    marginRight: 20
  }
});

class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: "Settings"
  };

  state = {
    redirectData: null
  };

  onCurrencyPress = () => {
    this.props.navigation.navigate("SelectCurrency", { isGlobalChange: true });
  };

  handleRedirect = event => {
    WebBrowser.dismissBrowser();
    console.log("Deep link event!", event);

    const queryStringResult = event.url.match(/#(.*)/);
    if (queryStringResult === null || queryStringResult.length < 2) {
      return Promise.reject(
        new Error("Did not receive a query string as part of this deep link!")
      );
    }

    const [, queryString] = queryStringResult;
    const parsedQueryString = shittyQs(queryString);
    if (parsedQueryString.error) {
      const errorCode = parsedQueryString.error;
      const errorDescription = parsedQueryString.error_description;

      console.log("Dropbox OAuth log! code:", errorCode);
      console.log("Error description:", errorDescription);

      return Promise.reject(
        new Error(`Could not authorize with Dropbox. Code: ${errorCode}`)
      );
    }

    const accessToken = parsedQueryString.access_token;
    const accountId = parsedQueryString.account_id;
    const isLinked = true;

    return this.props.updateEntities({
      settings: { dropboxAuth: { accessToken, accountId, isLinked } }
    });
  };

  addLinkingListener = () => {
    Linking.addEventListener("url", this.handleRedirect);
  };

  removeLinkingListener = () => {
    Linking.removeEventListener("url", this.handleRedirect);
  };

  onDropboxLinkPress = async () => {
    try {
      const { isLinked } = this.props.state.entities.settings.dropboxAuth;
      if (isLinked) {
        Alert.alert(
          "Already linked",
          "Your Dropbox account has already been linked! If you want to change your linked account, please unlink your current account first.",
          [{ text: "OK" }]
        );
        return;
      }

      this.addLinkingListener();

      const result = await WebBrowser.openBrowserAsync(
        [
          DROPBOX.AUTHORIZE_URL,
          "?response_type=token",
          `&client_id=${OAUTH_CONFIG.OAUTH_CLIENT_ID}`,
          `&redirect_uri=${OAUTH_CONFIG.OAUTH_REDIRECT_URI_DEV}`
        ].join("")
      );
      this.setState({ result });

      if (result.type === "dismiss") {
        Alert.alert(
          "Success",
          "Your Dropbox account has been successfully linked! Your expenses can now be backed up to Dropbox/Apps/vault-expenses-app/backup.csv",
          [{ text: "OK" }]
        );
      } else {
        Alert.alert("Cancelled", "Your Dropbox account has not been linked.", [
          { text: "OK" }
        ]);
      }

      this.removeLinkingListener();
    } catch (error) {
      Alert.alert(
        "Failure",
        "An error occured communicating with Dropbox. Please try again later.",
        [{ text: "OK" }]
      );
      console.log(error);
    }
  };

  onDropboxUnlinkPress = async () => {
    try {
      const { accessToken } = this.props.state.entities.settings.dropboxAuth;
      if (accessToken === null) {
        Alert.alert(
          "Dropbox not linked",
          "Vault has not been linked to Dropbox yet. There is nothing to unlink.",
          [{ text: "OK" }]
        );
        throw new Error("Cannot unlink without an access token");
      }

      const response = await fetch(DROPBOX.REVOKE_TOKEN_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      console.log("Unlink response:", response);
      if (response.status === 200) {
        this.props.updateEntities({
          settings: { dropboxAuth: { accessToken: null, accountId: null } }
        });

        this.props.updateEntities({
          settings: {
            automaticBackup: false
          }
        });

        Alert.alert(
          "Success",
          "Your Dropbox authorization has been sucessfully revoked.",
          [{ text: "OK" }]
        );
        return;
      }
      Alert.alert(
        "Failure",
        "Something went wrong revoking your Dropbox authorization. please try again later.",
        [{ text: "OK" }]
      );
      throw new Error(
        `Failed to revoke Dropbox token. status: ${
          response.status
        } and response: ${JSON.stringify(response)}`
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
        Alert.alert(
          "Dropbox not linked",
          "Vault has not been linked to Dropbox yet. There is nothing to unlink.",
          [{ text: "OK" }]
        );
        throw new Error("Cannot perform backup without an access token");
      }

      console.log(
        "[Dropbox backup] UPLOADING and replacing DB on Dropbox: beginning."
      );

      const jsonArr = Object.values(expenses);
      const csvStr = await converter.json2csvAsync(jsonArr);
      const backupExpenses = btoa(csvStr);
      const response = await RNFetchBlob.fetch(
        "POST",
        DROPBOX.UPLOAD_URL,
        {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/octet-stream",
          "Dropbox-API-Arg": JSON.stringify({
            path: "/backup.csv",
            mode: "overwrite"
          })
        },
        backupExpenses
      );

      Alert.alert(
        "Success",
        "Upload to Dropbox complete! Access your backup at Dropbox/Apps/vault-expenses-app/backup.csv",
        [{ text: "OK" }]
      );
      console.log("[Dropbox backup] UPLOAD to Dropbox complete!", response);
    } catch (e) {
      Alert.alert(
        "Failure",
        "Failed to upload your backup to Dropbox. Please try again later.",
        [{ text: "OK" }]
      );
      console.log("Error: ", e);
    }
  };

  onDownloadPress = async () => {
    try {
      const { accessToken } = this.props.state.entities.settings.dropboxAuth;
      if (accessToken === null) {
        Alert.alert(
          "Dropbox not linked",
          "Vault has not been linked to Dropbox yet.",
          [{ text: "OK" }]
        );
        return;
      }

      console.log(
        "[Dropbox backup] DOWNLOADING and applying DB from Dropbox: beginning."
      );

      const response = await RNFetchBlob.fetch("POST", DROPBOX.DOWNLOAD_URL, {
        Authorization: `Bearer ${accessToken}`,
        "Dropbox-API-Arg": JSON.stringify({
          path: "/backup.csv"
        })
      });

      console.log("[Dropbox backup] DOWNLOAD from Dropbox complete!");
      const text = response.text();

      const jsonArr = await converter.csv2jsonAsync(text);
      const expenses = {};
      jsonArr.forEach(expense => {
        expenses[expense.id] = expense;
      });

      console.log("[Dropbox backup] CONVERSION to JSON complete!");

      const oldCategories = this.props.state.entities.categories;
      const categories = Object.values(expenses).reduce((acc, el) => {
        acc[el.category] = acc[el.category] ? acc[el.category] + 1 : 1;
        return acc;
      }, oldCategories);
      this.props.updateEntities({ expenses, categories });
      Alert.alert(
        "Success",
        "Download from Dropbox complete! Your expenses now appear in the summary",
        [{ text: "OK" }]
      );
      console.log("[Dropbox backup] IMPORT from Dropbox complete!");
    } catch (e) {
      Alert.alert(
        "Failure",
        "Failed to download your backup from Dropbox. Please try again later.",
        [{ text: "OK" }]
      );
      console.log("Error: ", e);
    }
  };

  onAutoBackupPress = () => {
    try {
      const { accessToken } = this.props.state.entities.settings.dropboxAuth;
      if (accessToken === null) {
        Alert.alert(
          "Dropbox not linked",
          "Vault has not been linked to Dropbox yet. Please link your Dropbox account before enabling automatic backups.",
          [{ text: "OK" }]
        );
        return;
      }

      this.props.updateEntities({
        settings: {
          automaticBackup: !this.props.state.entities.settings.automaticBackup
        }
      });

      this.onDownloadPress();
    } catch (e) {
      Alert.alert(
        "Failure",
        "Failed to download your backup from Dropbox. Please try again later.",
        [{ text: "OK" }]
      );

      this.props.updateEntities({
        settings: {
          automaticBackup: false
        }
      });

      console.log("Error: ", e);
    }
  };

  render() {
    const {
      mainCurrency,
      dropboxAuth: { isLinked }
    } = this.props.state.entities.settings;
    const mainCurrencySymbol = this.props.state.entities.currencies[
      mainCurrency
    ].symbol;
    return (
      <ScrollView
        style={styles.options}
        contentContainerStyle={styles.optionsContainer}
      >
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeader__left}>
            <Text style={styles.sectionHeader__text}>Currency settings</Text>
          </View>
          <View style={styles.sectionHeader__right}>
            <Icon.Ionicons
              name={"ios-cash"}
              style={styles.sectionHeader__icon}
            />
          </View>
        </View>
        <View style={styles.option}>
          <Text style={styles.defaultText}>Home Currency</Text>
          <TouchableOpacity
            style={styles.optionBtn}
            underlayColor="white"
            onPress={this.onCurrencyPress}
          >
            <Text style={styles.defaultText}>
              {mainCurrency} ({mainCurrencySymbol})
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeader__left}>
            <Text style={styles.sectionHeader__text}>Dropbox integration</Text>
          </View>
          <View style={styles.sectionHeader__right}>
            <Icon.Ionicons
              name={"logo-dropbox"}
              style={styles.sectionHeader__icon}
            />
          </View>
        </View>
        <View style={styles.option}>
          <Text style={styles.defaultText}>Link Dropbox</Text>
          <TouchableOpacity
            style={styles.optionBtn}
            underlayColor="white"
            onPress={this.onDropboxLinkPress}
          >
            <Text style={styles.defaultText}>Link</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.option}>
          <Text style={styles.defaultText}>Unlink Dropbox</Text>
          <TouchableOpacity
            style={styles.optionBtn}
            underlayColor="white"
            onPress={this.onDropboxUnlinkPress}
          >
            <Text style={styles.defaultText}>Unlink</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.option}>
          <Text style={styles.defaultText}>Export CSV to Dropbox</Text>
          <TouchableOpacity
            style={styles.optionBtn}
            underlayColor="white"
            onPress={this.onUploadPress}
          >
            <Text style={styles.defaultText}>Upload</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.option}>
          <Text style={styles.defaultText}>Import CSV from Dropbox</Text>
          <TouchableOpacity
            style={styles.optionBtn}
            underlayColor="white"
            onPress={this.onDownloadPress}
          >
            <Text style={styles.defaultText}>Download</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.option}>
          <Text style={styles.defaultText}>Automatic backup</Text>
          <Switch
            value={this.props.state.entities.settings.automaticBackup}
            trackColor={{ true: Colors.orange6, false: "lightgrey" }}
            onValueChange={this.onAutoBackupPress}
          />
        </View>
        <View style={styles.option}>
          <Text style={styles.status__text}>
            Dropbox status:{" "}
            {isLinked ? (
              <Text style={[styles.defaultText, { color: "darkgreen" }]}>Linked</Text>
            ) : (
              <Text style={[styles.defaultText, { color: "darkred" }]}>Not linked</Text>
            )}
          </Text>
        </View>
      </ScrollView>
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
)(SettingsScreen);
