import httpStatus from "./http-status";
import validationMessages from "./validationMessages";
import actionTypes from "../state/actionTypes";
export default function serverValidation({ status = 0, dispatch }) {
  switch (status) {
    case httpStatus.EMPTY_PASSWORD: //205,
      dispatch({
        type: actionTypes.CONSTRAINT_VALIDATION,
        name: "password",
        isValid: false,
        message: validationMessages.REQUIRED_FIELD,
      });
      break;
    case httpStatus.EMPTY_CONFIRM: //206,
      dispatch({
        type: actionTypes.CONSTRAINT_VALIDATION,
        name: "confirm",
        isValid: false,
        message: validationMessages.REQUIRED_FIELD,
      });
      break;
    case httpStatus.EMPTY_USERNAME: //207,
      dispatch({
        type: actionTypes.CONSTRAINT_VALIDATION,
        name: "username",
        isValid: false,
        message: validationMessages.REQUIRED_FIELD,
      });
      break;
    case httpStatus.EMPTY_EMAIL: //208,
      dispatch({
        type: actionTypes.CONSTRAINT_VALIDATION,
        name: "email",
        isValid: false,
        message: validationMessages.REQUIRED_FIELD,
      });
      break;
    case httpStatus.WEAK_PASSWORD: //209,
      dispatch({
        type: actionTypes.CONSTRAINT_VALIDATION,
        name: "password",
        isValid: false,
        message: validationMessages.INVALID_PASSWORD,
      });
      break;
    case httpStatus.INVALID_USERNAME: //210,
      dispatch({
        type: actionTypes.CONSTRAINT_VALIDATION,
        name: "username",
        isValid: false,
        message: validationMessages.INVALID_USERNAME,
      });
      break;
    case httpStatus.INVALID_EMAIL: //211,
      dispatch({
        type: actionTypes.CONSTRAINT_VALIDATION,
        name: "email",
        isValid: false,
        message: validationMessages.INVALID_EMAIL,
      });
      break;
    case httpStatus.INVALID_CREDENTIALS: // 212,
      dispatch({
        type: actionTypes.CONSTRAINT_VALIDATION,
        name: "emailorusername",
        isValid: false,
        message: validationMessages.INVALID_CREDENTIALS,
      });

      dispatch({
        type: actionTypes.CONSTRAINT_VALIDATION,
        name: "password",
        isValid: false,
        message: validationMessages.INVALID_CREDENTIALS,
      });
      break;
    case httpStatus.USERNAME_TAKEN: //213,
      dispatch({
        type: actionTypes.CONSTRAINT_VALIDATION,
        name: "username",
        isValid: false,
        message: validationMessages.USERNAME_TAKEN,
      });
      break;
    case httpStatus.EMAIL_TAKEN: //214,
      dispatch({
        type: actionTypes.CONSTRAINT_VALIDATION,
        name: "email",
        isValid: false,
        message: validationMessages.REGISTERED_EMAIL,
      });
      break;
    case httpStatus.EMAIL_USERNAME_TAKEN: // 215,
      dispatch({
        type: actionTypes.CONSTRAINT_VALIDATION,
        name: "username",
        isValid: false,
        message: validationMessages.EXISTING_USER,
      });

      dispatch({
        type: actionTypes.CONSTRAINT_VALIDATION,
        name: "email",
        isValid: false,
        message: validationMessages.EXISTING_USER,
      });
      dispatch({
        type: actionTypes.SERVER_ERROR_RECIEVED,
        error: { message: validationMessages.EXISTING_USER },
      });
      break;
    case httpStatus.CONFIRM_MISMATCH: // 216,
      dispatch({
        type: actionTypes.CONSTRAINT_VALIDATION,
        name: "confirm",
        isValid: false,
        message: validationMessages.PASSWORDS_DO_NOT_MATCH,
      });
      break;
    case httpStatus.TOKEN_EXPIRED: // 217,
      break;
    case httpStatus.INVALID_EMAIL_OR_USERNAME: //218
      dispatch({
        type: actionTypes.CONSTRAINT_VALIDATION,
        name: "emailorusername",
        isValid: false,
        message: validationMessages.INVALID_USERNAME_OR_EMAIL,
      });

      break;
    case httpStatus.EMPTY_EMAIL_OR_USERNAME: //219
      dispatch({
        type: actionTypes.CONSTRAINT_VALIDATION,
        name: "emailorusername",
        isValid: false,
        message: validationMessages.REQUIRED_FIELD,
      });
      break;
    default:
      return null;
  }
}
