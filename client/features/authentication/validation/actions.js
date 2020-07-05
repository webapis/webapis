
import * as validations from './constraintValidators';
import constValTypes from './validationTypes';
import validationStates from './validationStates';
import validationTypes from './validationTypes';
import actionTypes from './actionTypes';
import httpStatus from './http-status';
import validationMessages from './validationMessages';

export function clientValidation({ validationType, value, state,auth }) {

  let validation = null;
  switch (validationType) {
    case constValTypes.EMAIL_FORMAT_VALIDATION:
      validation = validations.validateEmailConstraint({
        email: value,
      });
      break;
    case constValTypes.USERNAME_OR_EMAIL_FORMAT_VALIDATION:
      validation = validations.validateEmailOrUsername({
        value,
      });
      break;
    case constValTypes.PASSWORD_FORMAT_VALIDATION:
      validation = validations.validatePasswordConstraint({
        password: value,
      });
      break;
    case constValTypes.USERNAME_FORMAT_VALIDATION:
      validation = validations.validateUserNameConstraint({
        username: value,
      });
      break;
    case constValTypes.EMPTY_STRING_VALIDATION:
      validation = validations.validateEmptyString({ value });
      break;
    case constValTypes.PASSWORDS_MATCH_VALIDATION:
   
      validation = validations.validatePasswordMatch({ auth });
      break;
    default:
      break;
  }

  return { type: actionTypes.CLIENT_VALIDATION, ...validation };
}

export function initFormValidationState() {
  return { type: actionTypes.INIT_FORM_VALIDATION_STATE };
}

export function resetInputValidationState({ validationType }) {
  return { type: actionTypes.RESET_VALIDATION_STATE, validationType };
}

export function incInputCount() {
  return { type: actionTypes.INC_INPUT_COUTN };
}


export function serverValidation({ status = 0 }) {
debugger
  switch (status) {
    case 101:
    case httpStatus.credentialInvalid:
      return {
        type: actionTypes.SERVER_VALIDATION,
        validationType: validationTypes.INVALID_CREDENTIALS,
        message: validationMessages.INVALID_CREDENTIALS,
        validationState: validationStates.INVALID,
      };
    case 125:
      case -3:
    case httpStatus.emailInvalid:
      return {
        type: actionTypes.SERVER_VALIDATION,
        validationType: validationTypes.EMAIL_FORMAT_VALIDATION,
        message: validationMessages.INVALID_EMAIL,
        validationState: validationStates.INVALID,
      };
    case httpStatus.passwordInvalid:
      case  -4:
      return {
        type: actionTypes.SERVER_VALIDATION,
        validationType: validationTypes.PASSWORD_FORMAT_VALIDATION,
        message: validationMessages.INVALID_PASSWORD,
        validationState: validationStates.INVALID,
      };
    case httpStatus.usernameInvalid:
      return {
        type: actionTypes.SERVER_VALIDATION,
        validationType: validationTypes.USERNAME_FORMAT_VALIDATION,
        message: validationMessages.INVALID_USERNAME,
        validationState: validationStates.INVALID,
      };
      case 203:
    case httpStatus.emailIsRegistered:
      return {
        type: actionTypes.SERVER_VALIDATION,
        validationType: validationTypes.REGISTERED_EMAIL,
        message: validationMessages.REGISTERED_EMAIL,
        validationState: validationStates.INVALID,
      };
    case httpStatus.emailIsNotRegistered:
 
      return {
        type: actionTypes.SERVER_VALIDATION,
        validationType: validationTypes.EMAIL_NOT_REGISTERED,
        message: validationMessages.EMAIL_NOT_REGISTERED,
        validationState: validationStates.INVALID,
      };
    case 202:
    case httpStatus.usernameIsTaken:
      return {
        type: actionTypes.SERVER_VALIDATION,
        validationType: validationTypes.USERNAME_TAKEN,
        message: validationMessages.USERNAME_TAKEN,
        validationState: validationStates.INVALID,
      };
    case httpStatus.emptyStringNotValid:
      case -1:
      case 201:
      return {
        type: actionTypes.SERVER_VALIDATION,
        validationType: validationTypes.EMPTY_STRING_VALIDATION,
        message: validationMessages.INVALID_EMPTY_STRING,
        validationState: validationStates.INVALID,
      };
      case 200:
      
    case httpStatus.emailorusernameNotValid:
      return {
        type: actionTypes.SERVER_VALIDATION,
        validationType: validationTypes.USERNAME_OR_EMAIL_FORMAT_VALIDATION,
        message: validationMessages.INVALID_USERNAME_OR_EMAIL,
        validationState: validationStates.INVALID,
      };
    case httpStatus.usernameIsNotRegistered:
      return {
        type: actionTypes.SERVER_VALIDATION,
        validationType: validationTypes.USERNAME_NOT_REGISTERED,
        message: validationMessages.USERNAME_NOT_REGISTERED,
        validationState: validationStates.INVALID,
      };
      case httpStatus.passwordDoNotMatch:
      return {
        type: actionTypes.SERVER_VALIDATION,
        validationType: validationTypes.PASSWORDS_MATCH_VALIDATION,
        message: validationMessages.PASSWORDS_DO_NOT_MATCH,
        validationState: validationStates.INVALID,
      };
    default:
      return null;
  }
}