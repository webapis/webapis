import { emailRegex, usernameRegex, passwordRegex } from './validationRegex';

export function isValidUsername({ username }) {
  debugger;
  const usrname = new RegExp(usernameRegex);
  if (usrname.test(username)) {
    return true;
  } else {
    return false;
  }
}

export function isValidEmail({ email }) {
  debugger;
  const eml = new RegExp(emailRegex);
  if (eml.test(email)) {
    return true;
  } else {
    return false;
  }
}
export function isValidPasspword({ password }) {
  debugger;
  const psw = new RegExp(passwordRegex);
  if (psw.test(password)) {
    debugger;
    return true;
  } else {
    debugger;
    return false;
  }
}

export function passwordsMatch({ password, confirm }) {
  if (password !== '' && password !== confirm) {
    return false;
  } else {
    return true;
  }
}

export function isEmptyEmailOrUsername({ emailorusername }) {
  debugger;
  if (
    emailorusername === '' ||
    emailorusername === undefined ||
    emailorusername === null
  ) {
    return true;
  } else {
    return false;
  }
}

export function isEmptyPassword({ password }) {
  debugger;
  if (password === '' || password === undefined || password === null) {
    return true;
  } else {
    return false;
  }
}

export function isValidUsernameOrEmail({ emailorusername }) {
  debugger;
  const email = new RegExp(emailRegex);
  const username = new RegExp(usernameRegex);
  if (email.test(emailorusername) || username.test(emailorusername)) {
    return true;
  } else {
    return false;
  }
}

export async function userNameIsTaken({ username, collection }, cb) {
  debugger;
  try {
    const user = await collection.findOne({ username });
    debugger;
    if (user) {
      debugger;
      cb();
    } else {
      debugger;
      return false;
    }
  } catch (error) {
    debugger;
    throw new Error(error);
  }
}

export async function emailIsRegistered({ email, collection }, cb) {
  debugger;
  try {
    const user = await collection.findOne({ email });
    debugger;
    if (user) {
      debugger;
      cb();
    } else {
      debugger;
      return false;
    }
  } catch (error) {
    debugger;
    throw new Error(error);
  }
}
