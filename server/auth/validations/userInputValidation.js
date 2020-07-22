const {
  emailRegex,
  usernameRegex,
  passwordRegex,
} = require("./validationRegex");

module.exports.signupConstraints = function ({ username, email, password }) {
  let errors = [];
  // EMPTY_PASSWORD: 205,
  if (password === "") {
    errors.push(205);
  }
  // EMPTY_USERNAME: 207,
  if (username === "") {
    errors.push(207);
  }
  // EMPTY_EMAIL: 208,
  if (email === "") {
    errors.push(208);
  }
  // WEAK_PASSWORD: 209,
  if (password.length > 0) {
    const testPasswordConstaint = new RegExp(passwordRegex);
    if (!testPasswordConstaint.test(password)) {
      errors.push(209);
    }
  }
  // INVALID_USERNAME: 210,
  if (username.length > 0) {
    const testUsernameConstaint = new RegExp(usernameRegex);
    if (!testUsernameConstaint.test(username)) {
      errors.push(210);
    }
  }
  // INVALID_EMAIL: 211,
  if (email.length > 0) {
    const testEmailConstaint = new RegExp(emailRegex);
    if (!testEmailConstaint.test(email)) {
      errors.push(211);
    }
  }

  if (errors.length > 0) {
    return errors;
  } else {
    return null;
  }
};

module.exports.userValidation = async function userNameIsTaken(
  { username, email, collection },
  cb
) {
  try {
    const user = await collection.findOne({ username });

    if (user) {
      if (user.email === email) {
        //EMAIL_USERNAME_TAKEN: 215,
        cb({ errorCode: 215 });
      } else {
        //USERNAME_TAKEN: 213,
        cb({ errorCode: 213 });
      }
    } else {
      const user = await collection.findOne({ email });
      if (user) {
        //EMAIL_TAKEN: 214,
        cb({ errorCode: 214 });
      } else {
        cb({ errorCode: null });
      }
    }
  } catch (error) {
    throw new Error(error);
  }
};
