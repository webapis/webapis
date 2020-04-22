export default {
  //login
  credentialInvalid: '401',
  //signup
  usernameIsTaken: '402',
  emailIsRegistered: '403',
  usernameInvalid: '405',
  passwordInvalid: '406', //change password
  emailInvalid: '407',
  //login
  emailIsNotRegistered: '408',
  emptyStringNotValid: '409',
  emailorusernameNotValid:'410',
  usernameIsNotRegistered:'411',
//change password
  passwordDoNotMatch:'412',
  tokenExpired:'413',
  serverValidationRange: status => {
    if (status >= 400 && status <= 410) {
      return true;
    }
    return false;
  }
};
