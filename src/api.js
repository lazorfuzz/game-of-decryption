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

export async function signup(username, email, password, org_id) {
  const res = await request.post({
    uri: `${constants.apiUrl}/create_account`,
    headers,
    form: {
      username, password, email, role: 'standard', org_id
    }
  });
  const data = JSON.parse(res);
  return data;
}

export async function getUser(id = 1) {
  const res = await request.get({
    uri: `${constants.apiUrl}/users${typeof id === 'number' ? `/${id}` : ''}`,
    headers
  });
  const data = JSON.parse(res);
  return data;
}

export async function setUser(id, method = 'POST', form = {}) {
  const res = await request({
    uri: `${constants.apiUrl}/users/${id}`,
    method,
    headers,
    form
  });
  const data = JSON.parse(res);
  return data;
}

export async function getOrganization(name = 'all') {
  const res = await request.get({
    uri: `${constants.apiUrl}/orgs${name !== 'all' ? `/${name}` : ''}`,
    headers
  });
  const data = JSON.parse(res);
  return data;
}

export async function setOrganization(name, method = 'POST', form = {}) {
  const res = await request({
    uri: `${constants.apiUrl}/orgs/${name}`,
    method,
    headers,
    form
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
