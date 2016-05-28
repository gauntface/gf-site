'use strict';

import logger from '../helpers/logger.js';

export function uploadFile(file) {
  var formData = new FormData();
  formData.append('file', file);

  return fetch('/admin/upload/image', {
    method: 'POST',
    body: formData,
    credentials: 'include'
  })
  .then(response => {
    if (response.status !== 200) {
      return response.json()
      .then(response => {
        logger(response.error.msg);
        throw new Error('Inavalid status code');
      });
    }

    return response.json();
  })
  .then(response => {
    if (response.data && response.data.url) {
      return response.data.url;
    }

    throw new Error('Bad response from server.');
  });
}
