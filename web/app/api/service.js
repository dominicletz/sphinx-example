import { hashHistory } from 'react-router';
import store from '../store';

function getFetchObject(method, opts) {
  const { token } = store;
  const fetchObj = {
    method,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      Authorization: `token ${token}`,
    },
    ...opts,
  };
  fetchObj.headers = {
    Accept: 'application/json',
    Authorization: `token ${token}`,
    'Content-Type': 'application/json',
    ...(opts || {}).headers
  };
  return fetchObj;
}

export function handleResponse(response) {
  if (response.status >= 200 && response.status < 300 || response.status === 304) {
    const contentType = response.headers.get('Content-Type').split(';')[0].toLowerCase();
    if (contentType === 'application/json') {
      return response.json().then(body => {
        response.payload = body;
        return response;
      });
    }
    return response.text().then(body => {
      response.payload = body;
      console.log('payload is ', body);
      return response;
    });
  }

  const err = new Error(response.statusText || response.status);
  err.response = response;

  if (response.status === 401 || response.status === 403) {
    hashHistory.replace('/login');
    return Promise.reject(err);
  }

  return response.text()
  .catch(() => {
    return Promise.reject(err);
  })
  .then(body => {
    err.response.payload = body;
    console.error('error payload is ', body);
    return Promise.reject(err);
  });
}

export function get(path, options) {
  const obj = getFetchObject('GET', options);
  return fetch(`${API_BASE_URL}${path}`, obj).then(handleResponse);
}

export function post(path, body, options) {
  const obj = getFetchObject('POST', options);
  obj.body = JSON.stringify(body);
  return fetch(`${API_BASE_URL}${path}`, obj).then(handleResponse);
}

export function put(path, body, options) {
  const obj = getFetchObject('PUT', options);
  obj.body = JSON.stringify(body);
  return fetch(`${API_BASE_URL}${path}`, obj).then(handleResponse);
}

export default {
  get,
  post,
  put,
};
