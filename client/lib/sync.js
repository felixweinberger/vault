/* eslint-disable no-console */
import RNFetchBlob from 'rn-fetch-blob';
import converter from 'json-2-csv';

import { DROPBOX } from '../constants/Dropbox';

const dropboxUpload = async (accessToken, expenses) => {
  try {
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
};

export default dropboxUpload;
