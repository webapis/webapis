const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/g;

const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;

const usernameRegex = /[a-zA-Z][a-zA-Z0-9]{5,31}/g;

module.exports.isValidUsername = function ({ username }) {
  const usrname = new RegExp(usernameRegex);
  if (usrname.test(username)) {
    return true;
  } else {
    return false;
  }
};

module.exports.isValidEmail = function ({ email }) {
  const eml = new RegExp(emailRegex);
  debugger;
  if (eml.test(email)) {
    return true;
  } else {
    return false;
  }
};
module.exports.isValidPasspword = function ({ password }) {
  const psw = new RegExp(passwordRegex);
  if (psw.test(password)) {
    return true;
  } else {
    return false;
  }
};

module.exports.passwordsMatch = function ({ password, confirm }) {
  if (password !== "" && password !== confirm) {
    return false;
  } else {
    return true;
  }
};

module.exports.isEmptyEmailOrUsername = function ({ emailorusername }) {
  if (
    emailorusername === "" ||
    emailorusername === undefined ||
    emailorusername === null
  ) {
    return true;
  } else {
    return false;
  }
};

module.exports.isEmptyPassword = function ({ password }) {
  if (password === "" || password === undefined || password === null) {
    return true;
  } else {
    return false;
  }
};

module.exports.isValidUsernameOrEmail = function ({ emailorusername }) {
  const email = new RegExp(emailRegex);
  const username = new RegExp(usernameRegex);
  if (email.test(emailorusername) || username.test(emailorusername)) {
    return true;
  } else {
    return false;
  }
};

module.exports.userNameIsTaken = async function ({ username, collection }, cb) {
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
};

module.exports.emailIsRegistered = async function ({ email, collection }, cb) {
  try {
    const user = await collection.findOne({ email });

    if (user) {
      cb();
    } else {
      return false;
    }
  } catch (error) {
    const err = error;
    debugger;
    throw new Error(error);
  }
};
