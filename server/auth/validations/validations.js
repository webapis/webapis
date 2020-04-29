import { emailRegex, usernameRegex, passwordRegex } from './validationRegex';

export function isValidUsername({ username }) {

  const usrname = new RegExp(usernameRegex);
  if (usrname.test(username)) {
    return true;
  } else {
    return false;
  }
}

export function isValidEmail({ email }) {

  const eml = new RegExp(emailRegex);
  if (eml.test(email)) {
    return true;
  } else {
    return false;
  }
}
export function isValidPasspword({ password }) {

  const psw = new RegExp(passwordRegex);
  if (psw.test(password)) {
 
    return true;
  } else {
  
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

  if (password === '' || password === undefined || password === null) {
    return true;
  } else {
    return false;
  }
}

export function isValidUsernameOrEmail({ emailorusername }) {

  const email = new RegExp(emailRegex);
  const username = new RegExp(usernameRegex);
  if (email.test(emailorusername) || username.test(emailorusername)) {
    return true;
  } else {
    return false;
  }
}

export async function userNameIsTaken({ username, collection }, cb) {

  try {
    const user = await collection.findOne({ username });

    if (user) {
    
      cb();
    } else {
    
      return false;
    }
  } catch (error) {
 
    throw new Error(error);
  }
}

export async function emailIsRegistered({ email, collection }, cb) {

  try {
    const user = await collection.findOne({ email });
 
    if (user) {

      cb();
    } else {
   
      return false;
    }
  } catch (error) {
  
    throw new Error(error);
  }
}
