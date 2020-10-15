import { pubsub } from "../pubsub";
import validationMessages from "../../features/authentication/validation/validationMessages";
class AuthServiceNodejs extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    pubsub.subscribe("login", async (data) => {
      try {
        const { emailorusername, password, browserId } = data;

        const response = await fetch(`/auth/login`, {
          headers: {
            "Conten-Type": "application/json",
            "Access-Control-Allow-Headers": "*",
            Authorization: `Basic ${btoa(`${emailorusername}:${password}`)}`,
          },
          method: "POST",
          body: JSON.stringify({ browserId }),
        });

        const {
          token,
          inputValErrorCodes,
          serverError,
          email,
          username,
        } = await response.json();
        const { status, ok } = response;
        if (status === 200) {
          pubsub.publish("auth_success", { token, username, email });
        } else if (status > 200 && status < 500) {
          // //
          inputValErrorCodes.forEach((error) => {
            let validations = serverValidation({ status: error });

            if (validations.length > 0) {
              pubsub.publish("server_signin_validation_error", validations);
            }
          });
        } else if (status === 500) {
          pubsub.publish("server_error", {
            validations: [serverError],
          });
        }
      } catch (error) {
        // throw error;
      }
    });

    pubsub.subscribe("signup", async (data) => {
      try {
        const { email, username, password, browserId } = data;
        debugger;

        const response = await fetch(`/auth/signup`, {
          body: JSON.stringify({
            password,
            email,
            username,
            browserId,
          }),
          headers: {
            ContentType: "application/json",
            Accept: "application/json",
          },
          method: "POST",
        });
        const {
          token,
          inputValErrorCodes,
          serverError,
        } = await response.json();
        const { status, ok } = response;

        if (status === 200) {
          pubsub.publish("auth_success", { token, username, email });
        } else if (status > 200 && status < 500) {
          inputValErrorCodes.forEach((error) => {
            let validations = serverValidation({ status: error });

            if (validations.length > 0) {
              pubsub.publish("server_signup_validation_error", validations);
            }
          });
        } else if (status === 500) {
          pubsub.publish("server_error", {
            validations: [serverError],
          });
        }
      } catch (error) {
        // failed(error);
      }
    });

    shadowRoot.innerHTML = `<slot></slot>`;
  }
}

customElements.define("auth-service-nodejs", AuthServiceNodejs);

const httpStatus = {
  EMPTY_PASSWORD: 205,
  EMPTY_CONFIRM: 206,
  EMPTY_USERNAME: 207,
  EMPTY_EMAIL: 208,
  WEAK_PASSWORD: 209,
  INVALID_USERNAME: 210,
  INVALID_EMAIL: 211,
  INVALID_CREDENTIALS: 212,
  USERNAME_TAKEN: 213,
  EMAIL_TAKEN: 214,
  EMAIL_USERNAME_TAKEN: 215,
  CONFIRM_MISMATCH: 216,
  TOKEN_EXPIRED: 217,
  INVALID_EMAIL_OR_USERNAME: 218,
  EMPTY_EMAIL_OR_USERNAME: 219,
};
function serverValidation({ status = 0 }) {
  switch (status) {
    case httpStatus.EMPTY_PASSWORD: //205,
      return [
        {
          name: "password",
          isValid: false,
          message: validationMessages.REQUIRED_FIELD,
        },
      ];

    case httpStatus.EMPTY_CONFIRM: //206,
      return [
        {
          name: "confirm",
          isValid: false,
          message: validationMessages.REQUIRED_FIELD,
        },
      ];

    case httpStatus.EMPTY_USERNAME: //207,
      return [
        {
          name: "username",
          isValid: false,
          message: validationMessages.REQUIRED_FIELD,
        },
      ];

    case httpStatus.EMPTY_EMAIL: //208,
      return [
        {
          name: "email",
          isValid: false,
          message: validationMessages.REQUIRED_FIELD,
        },
      ];

    case httpStatus.WEAK_PASSWORD: //209,
      return [
        {
          name: "password",
          isValid: false,
          message: validationMessages.INVALID_PASSWORD,
        },
      ];

    case httpStatus.INVALID_USERNAME: //210,
      return [
        {
          name: "username",
          isValid: false,
          message: validationMessages.INVALID_USERNAME,
        },
      ];

    case httpStatus.INVALID_EMAIL: //211,
      return [
        {
          name: "email",
          isValid: false,
          message: validationMessages.INVALID_EMAIL,
        },
      ];

    case httpStatus.INVALID_CREDENTIALS: // 212,
      return [
        {
          name: "emailorusername",
          isValid: false,
          message: validationMessages.INVALID_CREDENTIALS,
        },

        {
          name: "password",
          isValid: false,
          message: validationMessages.INVALID_CREDENTIALS,
        },
      ];

    case httpStatus.USERNAME_TAKEN: //213,
      return [
        {
          name: "username",
          isValid: false,
          message: validationMessages.USERNAME_TAKEN,
        },
      ];

    case httpStatus.EMAIL_TAKEN: //214,
      return [
        {
          name: "email",
          isValid: false,
          message: validationMessages.REGISTERED_EMAIL,
        },
      ];

    case httpStatus.EMAIL_USERNAME_TAKEN: // 215,
      return [
        {
          name: "username",
          isValid: false,
          message: validationMessages.EXISTING_USER,
        },

        {
          name: "email",
          isValid: false,
          message: validationMessages.EXISTING_USER,
        },
        {
          type: actionTypes.SERVER_ERROR_RECIEVED,
          error: { message: validationMessages.EXISTING_USER },
        },
      ];

    case httpStatus.CONFIRM_MISMATCH: // 216,
      return [
        {
          name: "confirm",
          isValid: false,
          message: validationMessages.PASSWORDS_DO_NOT_MATCH,
        },
      ];

    case httpStatus.TOKEN_EXPIRED: // 217,

    case httpStatus.INVALID_EMAIL_OR_USERNAME: //218
      return [
        {
          name: "emailorusername",
          isValid: false,
          message: validationMessages.INVALID_USERNAME_OR_EMAIL,
        },
      ];

    case httpStatus.EMPTY_EMAIL_OR_USERNAME: //219
      return [
        {
          name: "emailorusername",
          isValid: false,
          message: validationMessages.REQUIRED_FIELD,
        },
      ];

    default:
      return null;
  }
}
