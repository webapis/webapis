import validationState from './validationStates';
import validationTypes from './validationTypes';
import validationMessages from './validationMessages';
import { emailRegex, passwordRegex, usernameRegex } from './validationRegex';
export function validateEmailConstraint({ email }) {
  const emailConstraint = new RegExp(emailRegex);

  if (emailConstraint.test(email)) {
    return {
      validationType: validationTypes.EMAIL_FORMAT_VALIDATION,
      validationState: validationState.VALID,
      message: '',
    };
  } else {
    return {
      validationType: validationTypes.EMAIL_FORMAT_VALIDATION,
      validationState: validationState.INVALID,
      message: validationMessages.INVALID_EMAIL,
    };
  }
}

export function isClientValidationType({ validationType }) {
  switch (validationType) {
    case validationTypes.PASSWORD_FORMAT_VALIDATION:
      return true;
    case validationTypes.EMAIL_FORMAT_VALIDATION:
      return true;
    case validationTypes.USERNAME_OR_EMAIL_FORMAT_VALIDATION:
      return true;
    case validationTypes.EMPTY_STRING_VALIDATION:
      return true;
    case validationTypes.PASSWORDS_MATCH_VALIDATION:
      return true;
    case validationTypes.USERNAME_FORMAT_VALIDATION:
      return true;
    default:
      return false;
  }
}
export function validatePasswordConstraint({ password }) {
  const passwordConstraint = new RegExp(passwordRegex);
  if (passwordConstraint.test(password)) {
    return {
      validationType: validationTypes.PASSWORD_FORMAT_VALIDATION,
      validationState: validationState.VALID,
      message: '',
    };
  }
  if (!passwordConstraint.test(password)) {
    return {
      validationType: validationTypes.PASSWORD_FORMAT_VALIDATION,
      validationState: validationState.INVALID,
      message: validationMessages.INVALID_PASSWORD,
    };
  }
}

export function validateUserNameConstraint({ username }) {
  const usernameConstraint = new RegExp(usernameRegex);

  if (usernameConstraint.test(username)) {
    return {
      validationType: validationTypes.USERNAME_FORMAT_VALIDATION,
      validationState: validationState.VALID,
      message: '',
    };
  } else {
    return {
      validationType: validationTypes.USERNAME_FORMAT_VALIDATION,
      validationState: validationState.INVALID,
      message: validationMessages.INVALID_USERNAME,
    };
  }
}

export function validateEmailOrUsername({ value }) {
  const emailConstraint = new RegExp(emailRegex);
  const usernameConstraint = new RegExp(usernameRegex);

  if (emailConstraint.test(value)) {
    return {
      validationType: validationTypes.USERNAME_OR_EMAIL_FORMAT_VALIDATION,
      validationState: validationState.VALID,
      message: '',
    };
  } else if (usernameConstraint.test(value)) {
    return {
      validationType: validationTypes.USERNAME_OR_EMAIL_FORMAT_VALIDATION,
      validationState: validationState.VALID,
      message: '',
    };
  } else {
    return {
      validationType: validationTypes.USERNAME_OR_EMAIL_FORMAT_VALIDATION,
      validationState: validationState.INVALID,
      message: validationMessages.INVALID_USERNAME_OR_EMAIL,
    };
  }
}

export function validateEmptyString({ value }) {
  if (value.length === 0) {
    return {
      validationType: validationTypes.EMPTY_STRING_VALIDATION,
      validationState: validationState.INVALID,
      message: validationMessages.INVALID_EMPTY_STRING,
    };
  } else {
    return {
      validationType: validationTypes.EMPTY_STRING_VALIDATION,
      validationState: validationState.VALID,
      message: '',
    };
  }
}

export function validatePasswordMatch({ state }) {
  const { password, confirm } = state.auth;

  if (password === '' || password !== confirm) {
    return {
      validationState: validationState.INVALID,
      message: validationMessages.PASSWORDS_DO_NOT_MATCH,
      validationType: validationTypes.PASSWORDS_MATCH_VALIDATION,
    };
  } else {
    return {
      validationState: validationState.VALID,
      message: '',
      validationType: validationTypes.PASSWORDS_MATCH_VALIDATION,
    };
  }
}
