import request from 'request-promise';
import constants from './constants';

const headers = {
  'Content-Type': 'application/json'
};

export async function login(username, password) {
  const res = await request.post({
    uri: `${constants.apiUrl}/login`,
    headers,
    form: {
      username, password
    }
  });
  const data = JSON.parse(res);
  if (data.token) {
    headers['Auth-Token'] = data.token;
  }
  return data;
}

export async function signup(username, email, password) {
  const res = await request.post({
    uri: `${constants.apiUrl}/create_account`,
    headers,
    form: {
      username, password, email, role: 'standard'
    }
  });
  const data = JSON.parse(res);
  return data;
}

export async function solveCipher(cipher) {
  const res = await request.post({
    uri: `${constants.apiUrl}/caesar`,
    headers,
    form: {
      cipher
    }
  });
  const data = JSON.parse(res);
  return data;
}
