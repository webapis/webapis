import httpStatus from "./http-status";
import validationMessages from "./validationMessages";
import actionTypes from "../state/actionTypes";
export default function serverValidation({ status = 0, dispatch }) {
  debugger;
  switch (status) {
    case 101:
    case 200:
    case httpStatus.credentialInvalid:
    case httpStatus.emailIsNotRegistered:
    case httpStatus.emailorusernameNotValid:
    case httpStatus.usernameIsNotRegistered:
      dispatch({
        type: actionTypes.CONSTRAINT_VALIDATION,
        name: "password",
        isValid: false,
        message: validationMessages.INVALID_CREDENTIALS,
      });
      dispatch({
        type: actionTypes.CONSTRAINT_VALIDATION,
        name: "emailorusername",
        isValid: false,
        message: validationMessages.INVALID_CREDENTIALS,
      });
      break;
    case 125:
    case -3:
    case httpStatus.emailInvalid:
      dispatch({
        type: actionTypes.CONSTRAINT_VALIDATION,
        name: "email",
        isValid: false,
        message: validationMessages.INVALID_EMAIL,
      });
      break;
    case httpStatus.passwordInvalid:
    case -4:
      dispatch({
        type: actionTypes.CONSTRAINT_VALIDATION,
        name: "password",
        isValid: false,
        message: validationMessages.INVALID_PASSWORD,
      });
      break;
    case httpStatus.usernameInvalid:
      dispatch({
        type: actionTypes.CONSTRAINT_VALIDATION,
        name: "username",
        isValid: false,
        message: validationMessages.INVALID_USERNAME,
      });
      break;
    case 203:
    case httpStatus.emailIsRegistered:
      dispatch({
        type: actionTypes.CONSTRAINT_VALIDATION,
        name: "email",
        isValid: false,
        message: validationMessages.REGISTERED_EMAIL,
      });
      break;
    case 202: //parse
    case httpStatus.usernameIsTaken:
      dispatch({
        type: actionTypes.CONSTRAINT_VALIDATION,
        name: "username",
        isValid: false,
        message: validationMessages.USERNAME_TAKEN,
      });
      break;
    case httpStatus.emptyPasswordNotValid:
      dispatch({
        type: actionTypes.CONSTRAINT_VALIDATION,
        name: "password",
        isValid: false,
        message: validationMessages.REQUIRED_FIELD,
      });
      break;
    case httpStatus.passwordDoNotMatch:
      dispatch({
        type: actionTypes.CONSTRAINT_VALIDATION,
        name: "password",
        isValid: false,
        message: validationMessages.PASSWORDS_DO_NOT_MATCH,
      });
      dispatch({
        type: actionTypes.CONSTRAINT_VALIDATION,
        name: "confirm",
        isValid: false,
        message: validationMessages.PASSWORDS_DO_NOT_MATCH,
      });
      break;
    default:
      return null;
  }
}
