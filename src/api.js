import request from 'request-promise';
import constants from './constants';

const headers = {
  'Accept': 'application/json'
};

export let currentUser = {};

/**
 * Handles login POST
 *
 * @export
 * @param {string} username
 * @param {string} password
 * @returns Response
 */
export async function login(username, password) {
  const res = await request.post({
    uri: `${constants.apiUrl}/login`,
    headers,
    form: {
      username, password
    }
  });
  const data = JSON.parse(res);
  // Save user state to an export variable and token into our request headers
  if (data.token) {
    headers['Authorization'] = data.token;
    currentUser = data.user;
  }
  return data;
}

/**
 * Handles sign up POST
 *
 * @export
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @param {number} org_id
 * @returns Response
 */
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

/**
 * Gets user information by ID
 *
 * @export
 * @param {number} [id=1]
 * @returns Response
 */
export async function getUser(id = 1) {
  const res = await request.get({
    uri: `${constants.apiUrl}/users${typeof id === 'number' ? `/${id}` : ''}`,
    headers
  });
  return JSON.parse(res);
}

/**
 * CRUD method for user by ID
 *
 * @export
 * @param {*} id
 * @param {string} [method='POST']
 * @param {object} [form={}]
 * @returns Response
 */
export async function setUser(id, method = 'POST', form = {}) {
  const res = await request({
    uri: `${constants.apiUrl}/users/${id}`,
    method,
    headers,
    form
  });
  const data = JSON.parse(res);
  if (id === currentUser.id) {
    currentUser = data;
  }
  return data;
}

/**
 * Handles cipher solution check POST
 *
 * @export
 * @param {string} cipher The text read by the OCR engine
 * @returns Response
 */
export async function checkCipherSolutionExists(cipher) {
  const res = await request({
    uri: `${constants.apiUrl}/solutions`,
    method: 'POST',
    headers,
    form: { cipher }
  });
  return JSON.parse(res);
}

/**
 * Handles saved solutions fetch
 *
 * @export
 * @returns Response
 */
export async function getSavedSolutions() {
  const res = await request.get({
    uri: `${constants.apiUrl}/saved_solutions`,
    headers
  });
  return JSON.parse(res);
}

/**
 * Create a new saved solution POST
 *
 * @export
 * @param {string} cipher The text returned by the OCR engine
 * @param {string} lang The two-letter language code
 * @param {string} solution The deciphered text
 * @returns Response
 */
export async function addSavedSolution(cipher, lang, solution) {
  const res = await request.post({
    uri: `${constants.apiUrl}/saved_solutions`,
    headers,
    form: {
      cipher, lang, solution, user_id: currentUser.id
    }
  });
  return JSON.parse(res);
}

/**
 * CRUD method for saved solution by ID
 *
 * @export
 * @param {number} id
 * @param {string} [method='PUT']
 * @param {object} [form={}]
 * @returns Response
 */
export async function setSavedSolution(id, method = 'PUT', form = {}) {
  const res = await request({
    uri: `${constants.apiUrl}/saved_solutions/${id}`,
    method,
    headers,
    form
  });
  return JSON.parse(res);
}

/**
 * Fetch an organization or list of organizations
 *
 * @export
 * @param {string} [name='all'] Organization name. Defaults to all
 * @returns Response
 */
export async function getOrganization(name = 'all') {
  const res = await request.get({
    uri: `${constants.apiUrl}/orgs${name !== 'all' ? `/${name}` : ''}`,
    headers
  });
  return JSON.parse(res);
}

/**
 * CRUD method for organization by name
 *
 * @export
 * @param {*} name The organization's name
 * @param {string} [method='POST']
 * @param {*} [form={}]
 * @returns Response
 */
export async function setOrganization(name, method = 'POST', form = {}) {
  const res = await request({
    uri: `${constants.apiUrl}/orgs/${name}`,
    method,
    headers,
    form
  });
  return JSON.parse(res);
}

/**
 * Handles cipher solve request POST
 *
 * @export
 * @param {string} cipher The text read by the OCR engine
 * @param {string} [lang='idk'] The language dictionary to look up with. Defaults to 'idk'
 * @returns Response
 */
export async function solveCipher(cipher, lang = 'idk') {
  const res = await request.post({
    uri: `${constants.apiUrl}/caesar`,
    headers,
    form: {
      cipher, lang
    }
  });
  return JSON.parse(res);
}

/**
 * Fetch the news by a specific query
 *
 * @export
 * @param {string} [query='_org'] The search query. Defaults to the user's organization name
 * @returns Response
 */
export async function getNews(query = '_org') {
  const res = await request.get({
    uri: `${constants.apiUrl}/news/${query === '_org' ? currentUser.organization : query.replace(/ /g, '+')}`,
    headers,
  });
  return JSON.parse(res);
}
