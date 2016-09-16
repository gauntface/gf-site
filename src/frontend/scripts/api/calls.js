'use strict';

import logger from '../helpers/logger.js';

export function savePost (blogModel) {
  return performFetchRequest('/admin/api/blog/save?cache-bust=' + Date.now(),
    blogModel.getJSONData())
  .then(result => {
    if (result.data && result.data.postId) {
      return result.data.postId;
    } else if (result.data && typeof result.data.success !== 'undefined') {
      // If success is false then normally that means everything was ok
      // but there was nothing different / changed to save
      return null;
    }

    throw new Error('Unknown response from API.', result);
  });
}

export function deletePost (blogModel) {
  return performFetchRequest('/admin/api/blog/delete?cache-bust=' + Date.now(),
    blogModel.getJSONData())
  .then(function(result) {
    if (result.error) {
      throw new Error('calls.js: Unknown error from the API.', result.error);
    }

    if (result.data && typeof result.data.success !== 'undefined' &&
      result.data.success) {
      return null;
    }

    throw new Error('Unknown response from API.', result);
  });
}

export function publishPost (blogModel) {
  return performFetchRequest('/admin/api/blog/publish?cache-bust=' + Date.now(),
    blogModel.getJSONData())
  .then(function(result) {
    if (result.error) {
      throw new Error('calls.js: Unknown error from the API.', result.error);
    }

    if (result.data && typeof result.data.success !== 'undefined' &&
      result.data.success) {
      return;
    }

    throw new Error('Unknown response from API.', result);
  });
}

function performFetchRequest(endpoint, bodyObj) {
  return fetch(endpoint,
    {
      'method': 'POST',
      'body': JSON.stringify(bodyObj),
      'credentials': 'include',
      'headers': {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
  .then(statusCheck)
  .then(response => response.json())
  .then(apiResponseCheck);
}

function statusCheck (response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  throw new Error('Bad status code.');
}

function apiResponseCheck (response) {
  if (!response.error) {
    return response;
  }

  throw new Error(response.error.msg);
}
