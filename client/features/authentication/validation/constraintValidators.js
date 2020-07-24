import validationMessages from "./validationMessages";
import { emailRegex, passwordRegex, usernameRegex } from "./validationRegex";
export function validateEmailConstraint({ email }) {
  const emailConstraint = new RegExp(emailRegex);
  if (email === "") {
    return {
      isValid: false,
      message: validationMessages.REQUIRED_FIELD,
    };
  } else if (!emailConstraint.test(email)) {
    return {
      isValid: false,
      message: validationMessages.INVALID_EMAIL,
    };
  } else {
    return {
      isValid: true,
      message: "",
    };
  }
}

export function validatePasswordConstraint({ password }) {
  const passwordConstraint = new RegExp(passwordRegex);
  if (password === "") {
    return {
      isValid: false,
      message: validationMessages.REQUIRED_FIELD,
    };
  } else if (!passwordConstraint.test(password)) {
    return {
      isValid: false,
      message: validationMessages.INVALID_PASSWORD,
    };
  } else {
    return {
      isValid: true,
      message: "",
    };
  }
}

export function validateUserNameConstraint({ username }) {
  const usernameConstraint = new RegExp(usernameRegex);
  if (username === "") {
    return {
      isValid: false,
      message: validationMessages.REQUIRED_FIELD,
    };
  } else if (!usernameConstraint.test(username)) {
    return {
      isValid: false,
      message: validationMessages.INVALID_USERNAME,
    };
  } else {
    return {
      isValid: true,
      message: "",
    };
  }
}

export function validateEmailOrUsername({ value }) {
  const emailConstraint = new RegExp(emailRegex);
  const usernameConstraint = new RegExp(usernameRegex);
  const emailTest = emailConstraint.test(value);
  const usernameTest = usernameConstraint.test(value);
  if (value === "") {
    return {
      isValid: false,
      message: validationMessages.REQUIRED_FIELD,
    };
  } else if (emailTest) {
    return {
      isValid: true,
      message: "",
    };
  } else if (usernameTest) {
    return {
      isValid: true,
      message: "",
    };
  } else {
    return {
      isValid: false,
      message: validationMessages.INVALID_USERNAME_OR_EMAIL,
    };
  }
}

export function validatePasswordMatch({ auth }) {
  const { password, confirm } = auth;

  if (password === "" || password !== confirm) {
    return {
      message: validationMessages.PASSWORDS_DO_NOT_MATCH,
      isValid: false,
    };
  } else {
    return {
      isValid: true,
      message: "",
    };
  }
}

export function validateEmptyString({ value }) {
  if (value.length === 0) {
    return {
      message: validationMessages.REQUIRED_FIELD,
      isValid: false,
    };
  } else {
    return {
      message: "",
      isValid: true,
    };
  }
}
