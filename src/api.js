import request from 'request-promise';
import constants from './constants';

const headers = {
  'Accept': 'application/json'
};

export let currentUser = {};

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
    headers['Authorization'] = data.token;
    currentUser = data.user;
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
  return JSON.parse(res);
}

export async function getUser(id = 1) {
  const res = await request.get({
    uri: `${constants.apiUrl}/users${typeof id === 'number' ? `/${id}` : ''}`,
    headers
  });
  return JSON.parse(res);
}

export async function setUser(id, method = 'POST', form = {}) {
  const res = await request({
    uri: `${constants.apiUrl}/users/${id}`,
    method,
    headers,
    form
  });
  return JSON.parse(res);
}

export async function checkCipherSolutionExists(cipher) {
  const res = await request({
    uri: `${constants.apiUrl}/solutions`,
    method: 'POST',
    headers,
    form: { cipher }
  });
  return JSON.parse(res);
}

export async function getSavedSolutions() {
  const res = await request.get({
    uri: `${constants.apiUrl}/saved_solutions`,
    headers
  });
  return JSON.parse(res);
}

export async function setSavedSolution(cipher, lang, solution) {
  const res = await request.post({
    uri: `${constants.apiUrl}/saved_solutions`,
    headers,
    form: {
      cipher, lang, solution, user_id: currentUser.id
    }
  });
  return JSON.parse(res);
}

export async function getOrganization(name = 'all') {
  const res = await request.get({
    uri: `${constants.apiUrl}/orgs${name !== 'all' ? `/${name}` : ''}`,
    headers
  });
  return JSON.parse(res);
}

export async function setOrganization(name, method = 'POST', form = {}) {
  const res = await request({
    uri: `${constants.apiUrl}/orgs/${name}`,
    method,
    headers,
    form
  });
  return JSON.parse(res);
}

export async function solveCipher(cipher, lang = 'en') {
  const res = await request.post({
    uri: `${constants.apiUrl}/caesar`,
    headers,
    form: {
      cipher, lang
    }
  });
  return JSON.parse(res);
}

export async function getNews(query = '_org') {
  const res = await request.get({
    uri: `${constants.apiUrl}/news/${query === '_org' ? currentUser.organization : query.replace(/ /g, '+')}`,
    headers,
  });
  return JSON.parse(res);
}
