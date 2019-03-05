/* eslint-disable no-console */
import { AsyncStorage, Linking } from 'react-native';
import shittyQs from 'shitty-qs';

import { OAUTH_CONFIG, DROPBOX } from './DropboxConstants';

export const handleOpenURL = async (event, stateValue) => {
  console.log('Deep link event!', event);

  const queryStringResult = event.url.match(/#(.*)/);
  if (queryStringResult === null || queryStringResult.length < 2) {
    return Promise.reject(new Error('Did not receive a query string as part of this deep link!'));
  }

  const [, queryString] = queryStringResult;
  const parsedQueryString = shittyQs(queryString);
  if (parsedQueryString.error) {
    // There was an error!
    const errorCode = parsedQueryString.error;
    const errorDescription = parsedQueryString.error_description;

    console.error('Dropbox OAuth error! code:', errorCode);
    console.error('Error description:', errorDescription);

    return Promise.reject(new Error(`Could not authorize with Dropbox. Code: ${errorCode}`));
  }

  if (stateValue !== parsedQueryString.state) {
    // This value must match! This is a security feature of Dropbox's OAuth impl
    return Promise.reject(new Error('State parameter DID NOT MATCH!'));
  }

  // Otherwise: not an error!
  const accessToken = parsedQueryString.access_token;
  const accountId = parsedQueryString.account_id;

  console.log('accessToken:', accessToken, ', accountId:', accountId);

  // Persist accessToken and accountId
  return AsyncStorage.setItem(DROPBOX.ACCESS_TOKEN_STORAGE_KEY, accessToken)
    .then(() => AsyncStorage.setItem(DROPBOX.ACCOUNT_ID_STORAGE_KEY, accountId))
    .then(() => console.log('Dropbox OAuth authorization success! Account ID:', accountId));
};

export const authorize = async () => {
  console.log('Authorization starting...');

  // Generate a random string for Dropbox's state param.
  // This helps us be sure a deep link into the app is indeed related to the request
  // we made to Dropbox.
  const stateValue = Math.random().toString();

  // Open the Dropbox authorization page in the device browser
  return Linking.openURL(
    [
      DROPBOX.AUTHORIZE_URL,
      '?response_type=token',
      `&client_id=${OAUTH_CONFIG.OAUTH_CLIENT_ID}`,
      `&redirect_uri=${OAUTH_CONFIG.OAUTH_REDIRECT_URI}`,
      `&state=${stateValue}`,
    ].join(''),
  )
    .catch(err => console.error(
      'An error occurred trying to open the browser to authorize with Dropbox:',
      err,
    ))
    .then(() => console.log('connected!'))
    .then(() => new Promise((resolve, reject) => {
      // Callback for when the app is invoked via it's custom URL protocol
      const handleRedirectFromDropbox = (event) => {
        handleOpenURL(event, stateValue)
          .then(() => {
            resolve();
          })
          .catch((reason) => {
            reject(reason);
          })
          .then(() => {
            // 'Finally' block
            // Remove deep link event listener
            Linking.removeEventListener('url', handleRedirectFromDropbox);
          });
      };

      //   Add deep link event listener to catch when Dropbox sends the user back to the app.
      Linking.addEventListener('url', handleRedirectFromDropbox);
    }));
};
