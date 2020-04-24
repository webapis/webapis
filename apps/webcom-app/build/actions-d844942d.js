import { s as styleInject, v as validationStates, b as actionTypes, c as v, h, a as useFormContext, p, d as useThemeContext, e as actionTypes$1 } from './index-8c2f4ae3.js';

var css_248z = ".main-content {\n  background-color: #546e7a;\n  position: fixed;\n  left: 320px;\n  top: 100px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  width: 80%;\n  height: 80%;\n  padding: 5px;\n}\n\n.loading {\n  height: 100%;\n  width: 100%;\n  color: white;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n}\n\n.surface {\n  background-color: #f5f5f5;\n  height: 70vh;\n}";
styleInject(css_248z);

var validationTypes = {
  //constraint
  EMAIL_FORMAT_VALIDATION: 'EMAIL_FORMAT_VALIDATION',
  PASSWORD_FORMAT_VALIDATION: 'PASSWORD_FORMAT_VALIDATION',
  USERNAME_FORMAT_VALIDATION: 'USERNAME_FORMAT_VALIDATION',
  USERNAME_OR_EMAIL_FORMAT_VALIDATION: 'USERNAME_OR_EMAIL_FORMAT_VALIDATION',
  EMPTY_STRING_VALIDATION: 'EMPTY_STRING_VALIDATION',
  PASSWORDS_MATCH_VALIDATION: 'PASSWORDS_MATCH_VALIDATION',
  //auth
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  USERNAME_TAKEN: 'USERNAME_TAKEN',
  REGISTERED_EMAIL: 'REGISTERED_EMAIL',
  EMAIL_NOT_REGISTERED: 'EMAIL_NOT_REGISTERED',
  USERNAME_NOT_REGISTERED: 'USERNAME_NOT_REGISTERED'
};

var validationMessages = {
  INVALID_PASSWORD: 'at least 8 characters, must contain at least 1 uppercase letter, 1 lowercase letter, Can contain special characters',
  INVALID_EMAIL: 'email format is not valid',
  EMAIL_NOT_REGISTERED: 'email is not registered',
  USERNAME_NOT_REGISTERED: 'username is not registered',
  INVALID_USERNAME: 'only Letters a-z or A-Z and the Symbols - and _ are allowed',
  INVALID_EMPTY_STRING: 'empty string is not allowed',
  INVALID_USERNAME_OR_EMAIL: 'email or username is not valid',
  INVALID_CREDENTIALS: 'invalid credentials provided',
  USERNAME_TAKEN: 'username is already taken',
  REGISTERED_EMAIL: 'email is already registered',
  PASSWORDS_DO_NOT_MATCH: 'passwords do not match'
};

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/g;
const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
const usernameRegex = /[a-zA-Z]+[-_]*[a-zA-Z]+/g;

function validateEmailConstraint({
  email
}) {
  const emailConstraint = new RegExp(emailRegex);

  if (emailConstraint.test(email)) {
    return {
      validationType: validationTypes.EMAIL_FORMAT_VALIDATION,
      validationState: validationStates.VALID,
      message: ''
    };
  } else {
    return {
      validationType: validationTypes.EMAIL_FORMAT_VALIDATION,
      validationState: validationStates.INVALID,
      message: validationMessages.INVALID_EMAIL
    };
  }
}
function isClientValidationType({
  validationType
}) {
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
function validatePasswordConstraint({
  password
}) {
  const passwordConstraint = new RegExp(passwordRegex);

  if (passwordConstraint.test(password)) {
    return {
      validationType: validationTypes.PASSWORD_FORMAT_VALIDATION,
      validationState: validationStates.VALID,
      message: ''
    };
  }

  if (!passwordConstraint.test(password)) {
    return {
      validationType: validationTypes.PASSWORD_FORMAT_VALIDATION,
      validationState: validationStates.INVALID,
      message: validationMessages.INVALID_PASSWORD
    };
  }
}
function validateUserNameConstraint({
  username
}) {
  const usernameConstraint = new RegExp(usernameRegex);

  if (usernameConstraint.test(username)) {
    return {
      validationType: validationTypes.USERNAME_FORMAT_VALIDATION,
      validationState: validationStates.VALID,
      message: ''
    };
  } else {
    return {
      validationType: validationTypes.USERNAME_FORMAT_VALIDATION,
      validationState: validationStates.INVALID,
      message: validationMessages.INVALID_USERNAME
    };
  }
}
function validateEmailOrUsername({
  value
}) {
  const emailConstraint = new RegExp(emailRegex);
  const usernameConstraint = new RegExp(usernameRegex);

  if (emailConstraint.test(value)) {
    return {
      validationType: validationTypes.USERNAME_OR_EMAIL_FORMAT_VALIDATION,
      validationState: validationStates.VALID,
      message: ''
    };
  } else if (usernameConstraint.test(value)) {
    return {
      validationType: validationTypes.USERNAME_OR_EMAIL_FORMAT_VALIDATION,
      validationState: validationStates.VALID,
      message: ''
    };
  } else {
    return {
      validationType: validationTypes.USERNAME_OR_EMAIL_FORMAT_VALIDATION,
      validationState: validationStates.INVALID,
      message: validationMessages.INVALID_USERNAME_OR_EMAIL
    };
  }
}
function validateEmptyString({
  value
}) {
  if (value.length === 0) {
    return {
      validationType: validationTypes.EMPTY_STRING_VALIDATION,
      validationState: validationStates.INVALID,
      message: validationMessages.INVALID_EMPTY_STRING
    };
  } else {
    return {
      validationType: validationTypes.EMPTY_STRING_VALIDATION,
      validationState: validationStates.VALID,
      message: ''
    };
  }
}
function validatePasswordMatch({
  state
}) {
  debugger;
  const {
    password,
    confirm
  } = state.auth;

  if (password === '' || password !== confirm) {
    return {
      validationState: validationStates.INVALID,
      message: validationMessages.PASSWORDS_DO_NOT_MATCH,
      validationType: validationTypes.PASSWORDS_MATCH_VALIDATION
    };
  } else {
    return {
      validationState: validationStates.VALID,
      message: '',
      validationType: validationTypes.PASSWORDS_MATCH_VALIDATION
    };
  }
}

var httpStatus = {
  //login
  credentialInvalid: '401',
  //signup
  usernameIsTaken: '402',
  emailIsRegistered: '403',
  usernameInvalid: '405',
  passwordInvalid: '406',
  //change password
  emailInvalid: '407',
  //login
  emailIsNotRegistered: '408',
  emptyStringNotValid: '409',
  emailorusernameNotValid: '410',
  usernameIsNotRegistered: '411',
  //change password
  passwordDoNotMatch: '412',
  tokenExpired: '413',
  serverValidationRange: status => {
    if (status >= 400 && status <= 410) {
      return true;
    }

    return false;
  }
};

function clientValidation({
  validationType,
  value,
  state
}) {
  let validation = null;

  switch (validationType) {
    case validationTypes.EMAIL_FORMAT_VALIDATION:
      validation = validateEmailConstraint({
        email: value
      });
      break;

    case validationTypes.USERNAME_OR_EMAIL_FORMAT_VALIDATION:
      validation = validateEmailOrUsername({
        value
      });
      break;

    case validationTypes.PASSWORD_FORMAT_VALIDATION:
      validation = validatePasswordConstraint({
        password: value
      });
      break;

    case validationTypes.USERNAME_FORMAT_VALIDATION:
      validation = validateUserNameConstraint({
        username: value
      });
      break;

    case validationTypes.EMPTY_STRING_VALIDATION:
      validation = validateEmptyString({
        value
      });
      break;

    case validationTypes.PASSWORDS_MATCH_VALIDATION:
      validation = validatePasswordMatch({
        state
      });
      break;
  }

  return {
    type: actionTypes.CLIENT_VALIDATION,
    ...validation
  };
}
function resetInputValidationState({
  validationType
}) {
  return {
    type: actionTypes.RESET_VALIDATION_STATE,
    validationType
  };
}
function serverValidation({
  status = 0
}) {
  debugger;

  switch (status) {
    case httpStatus.credentialInvalid:
      debugger;
      return {
        type: actionTypes.SERVER_VALIDATION,
        validationType: validationTypes.INVALID_CREDENTIALS,
        message: validationMessages.INVALID_CREDENTIALS,
        validationState: validationStates.INVALID
      };

    case httpStatus.emailInvalid:
      return {
        type: actionTypes.SERVER_VALIDATION,
        validationType: validationTypes.EMAIL_FORMAT_VALIDATION,
        message: validationMessages.INVALID_EMAIL,
        validationState: validationStates.INVALID
      };

    case httpStatus.passwordInvalid:
      return {
        type: actionTypes.SERVER_VALIDATION,
        validationType: validationTypes.PASSWORD_FORMAT_VALIDATION,
        message: validationMessages.INVALID_PASSWORD,
        validationState: validationStates.INVALID
      };

    case httpStatus.usernameInvalid:
      return {
        type: actionTypes.SERVER_VALIDATION,
        validationType: validationTypes.USERNAME_FORMAT_VALIDATION,
        message: validationMessages.INVALID_USERNAME,
        validationState: validationStates.INVALID
      };

    case httpStatus.emailIsRegistered:
      return {
        type: actionTypes.SERVER_VALIDATION,
        validationType: validationTypes.REGISTERED_EMAIL,
        message: validationMessages.REGISTERED_EMAIL,
        validationState: validationStates.INVALID
      };

    case httpStatus.emailIsNotRegistered:
      debugger;
      return {
        type: actionTypes.SERVER_VALIDATION,
        validationType: validationTypes.EMAIL_NOT_REGISTERED,
        message: validationMessages.EMAIL_NOT_REGISTERED,
        validationState: validationStates.INVALID
      };

    case httpStatus.usernameIsTaken:
      return {
        type: actionTypes.SERVER_VALIDATION,
        validationType: validationTypes.USERNAME_TAKEN,
        message: validationMessages.USERNAME_TAKEN,
        validationState: validationStates.INVALID
      };

    case httpStatus.emptyStringNotValid:
      return {
        type: actionTypes.SERVER_VALIDATION,
        validationType: validationTypes.EMPTY_STRING_VALIDATION,
        message: validationMessages.INVALID_EMPTY_STRING,
        validationState: validationStates.INVALID
      };

    case httpStatus.emailorusernameNotValid:
      return {
        type: actionTypes.SERVER_VALIDATION,
        validationType: validationTypes.USERNAME_OR_EMAIL_FORMAT_VALIDATION,
        message: validationMessages.INVALID_USERNAME_OR_EMAIL,
        validationState: validationStates.INVALID
      };

    case httpStatus.usernameIsNotRegistered:
      return {
        type: actionTypes.SERVER_VALIDATION,
        validationType: validationTypes.USERNAME_NOT_REGISTERED,
        message: validationMessages.USERNAME_NOT_REGISTERED,
        validationState: validationStates.INVALID
      };

    case httpStatus.passwordDoNotMatch:
      return {
        type: actionTypes.SERVER_VALIDATION,
        validationType: validationTypes.PASSWORDS_MATCH_VALIDATION,
        message: validationMessages.PASSWORDS_DO_NOT_MATCH,
        validationState: validationStates.INVALID
      };

    default:
      return null;
  }
}

const img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAACsklEQVR4nO2au24TQRSGP9sK0FgiIgLlIoUuqQNUVOHSmBLegHQUgS7PgZIOhKmIYihi3sAICQpSJKEECSsGgkKLJUuRKWYWHLOLd+fM7trx+aSRJWtn/v/Yu7MzZw4oiqIoiqIoijKOFDLQOANcAa4DS8BF4AIwZT8BfgJH9vMHsAO8BT4AnQw8eucSsAa8AdpA17G17RhrdsyhpgDcBmqYf8016KjWsWPfIps7NxE3gF38Bx3Vdq1m7lwGXpFd4P3tJTCfdpBRPET2fPtqbWA15VhPcBZ47jkIH61qvaXKDPA+xyAHtXfAdFrBzwFNocEmsA5UgAWgbNuC/W7dg8YX69Urk8BHgakD4D5QiqFVste2BHr7wHlRxD2cwyxGXM1sY/7lpJSBukC3Yb2L2RSYeAwUBdpFO4ar/qZAG4B7AvFt/KzYisjuhLuuwpPAd0fRA9xu+yjKuM8J32wsiak6CnYxk5hvVgR+niUVuyYQaxJvtk9KCdkr8mrYoFET1COB0TpwLOgfxTHwWtA/dkyzyLazFYHJQVQEvjqYlewJwu6AB8CEwOQnQd9BfBb0ncDENpBD3H/lLn5n/37KQm+H/QNKFimngrAf4KlwzH+eM4/MCvs/iSsy1pNgC5NqkphMizuCvjXga9yLx2Yh9D+qArGRXwqDbDPU4hRshkC+Hfbxms1tOxwwygmRFwLtP0hTYnVGPCUG5hnaF5hpYSaxuEnRFWRJ0T08JkUD5jApZ1dTXcxrbAOzVljkb1p80X63wZCmxQNmMIcPEoNptlQPRgLG+misl1WG43D0FxkfjvYyj9k35BV8jRyPx3tZJvsCieVMIktAAVO+skV6JTJbwE2GsESmn6BIqoG8SKpBikVSWZXJLRFeJjdlrzkivExuhxEtk1MURVEURVEUZbj5DckMFeQhrFj9AAAAAElFTkSuQmCC";

const img$1 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAADs0lEQVR4nO3bS2hcVRzH8U9ao9IymoIoSmOqLa0rN75wK4JatJQaFezCiNKtiFBc6NKVdCOKC1ErIooKoqCC4FvRjSK1ii5EDWhNUfEFgRiMizORNL03cx5zZ2Jyf/AnMMmc3///zbn3ntelVatWrU7UXsx0Y9+QcxmKZrDQjb8xOdx0Bq+lANYlhH1C0csh3DTMpAatSS2EWgg3DzOpQauFYI1DGIn8u0k8i1OWfDaP/Xi+x3e34DJc3I1d3c/O7MY/+AU/d38ex6f4EJ9gLjLHxlXVE+ZV94QLcDfervhOSszifdyLc5opK029IFyNV4X/am7RdTGHF7oesT23EdVB+FL/i66LI7iq6UJXUhWEYcSLmGi41lqtFgizuKvhWmu1WiAs4DBOa7TaGq0mCB/j3KYKPR9vYXvF72IhHMMhXC9cu5vQEcYGu/EwpiPaWSm+x9Y+1g3Oxtddg2npEH7CFEYjvDbiDvxQ01ZMHMVYapF12iyMyJYapEI4kOHbwSsVbcXGezg9w/ckPVFjkAJhHrdkeG/AQzX+MfFchucJ2t/DYFAQSnrCjRme4Dz8GWEwCAgd+feEY8LkK1mHE0wGAeHOhHyWx5OpZpdkmDQNYaOyR+SlKWavZZpMY1tFe/2C8EhmXgt4JtZku7Lp7LU17fYDwu6CvOaE+1pPPVhgsoDxFdouhXBRYW4PxJgcLzTpNSEpgdApzG0mwqMYQMwQNBfCpsLcogAcKjS5IsZEHoSJwtyiLoFdhSa3xZh0lQrhhoK8om+C8HqB0WOxJl2lQCjpndGPQfIGQosxi7NSzMRBGBWGtbl5JQ2ECBseuWb3p5rpDWGqIJ/HM/KxFb9nGv6BnRmedRAOCIsqObn8qGBx5PZM0wV8LiympKrfa4x7M3L4TyPKLoWXDBfCUxneJ2mzsFmZm8QR7MjwLYXwJk7N8K3UOL4rSOY33Kc/T4eY+AxnZNS5orbh24xklsasME6YEkaMY8LcYRzXqN7mSoXwjYb3Bo4mJJMaOUvuS+Md6b0sWR28HJHMoCE8Km7foS/agHuELr0aIDzd/xLjtBPvViQ0aAh1J1UGohHs0cwBif8NBMKq7R68of8QLqzwW5UQFrUDB/GRsuLnhD2+62p8io/wDeKw0Rgux5XCouaE8DjtCGOAUWHy9KtwVO4rfCGMID/AXz3arzvCd6twqGpdqD3brIWAegjr6n2HFoJ6COvqHagqCFEbI2tJyyGsOwCEbr/4GmDR+mCrVq3Wnv4Frrcuj2OfR5sAAAAASUVORK5CYII=";

function IconState({
  open
}) {
  if (open) {
    return h("img", {
      width: "30px",
      src: img
    });
  }

  return h("img", {
    width: "30px",
    src: img$1
  });
}

function EyeIcon({
  onClick
}) {
  const [state, setState] = v(false);

  function toggle() {
    onClick();
    setState(prev => !prev);
  }

  return h("div", {
    onClick: toggle,
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: 1
    }
  }, h(IconState, {
    open: state
  }));
}

function ValidityIcon({
  valid
}) {
  let stateColor = '#4fc3f7';

  switch (valid) {
    case validationStates.VALID:
      stateColor = 'green';
      break;

    case validationStates.INVALID:
      stateColor = 'red';
      break;

    case validationStates.INACTIVE:
      stateColor = '#4fc3f7';
      break;

    default:
      stateColor = '#4fc3f7';
  }

  return h("div", {
    style: {
      flex: 1,
      color: stateColor,
      lineHeight: 2,
      width: 20,
      textAlign: 'center'
    }
  }, valid ? '✓' : '☓');
}

const style = {
  input: {
    border: '1px solid',
    padding: 8,
    flex: 10,
    borderRadius: 2
  },
  root: {
    borderRadius: 2,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    border: '1px solid white',
    marginBottom: 1
  },
  inputContainer: {
    display: 'flex',
    flex: 1
  },
  message: {
    color: 'red',
    paddingLeft: 3
  }
};
function Input({
  placeholder,
  type,
  name,
  onChange,
  value = '',
  validationTypes = [],
  id
}) {
  const {
    state,
    dispatch
  } = useFormContext();
  const [inputValidation, setInputValidation] = v({
    validationState: validationStates.INACTIVE,
    message: '',
    validationType: undefined
  });
  const [inputType, setInputType] = v(type);
  const [borderColor, setBorderColor] = v('');
  p(() => {
    if (inputValidation && inputValidation.validationState === validationStates.VALID) {
      setBorderColor('green');
    }

    if (inputValidation && inputValidation.validationState === validationStates.INVALID) {
      setBorderColor('red');
    }

    if (inputValidation && inputValidation.validationState === validationStates.INACTIVE) {
      setBorderColor('#4fc3f7');
    }
  }, [inputValidation]);

  function handleFocus() {
    validationTypes.forEach(validationName => {
      if (state.validation[validationName]) {
        dispatch(resetInputValidationState({
          validationType: validationName
        }));
      }
    });
  }

  function handleBlur() {
    validationTypes.forEach(validationName => {
      if (isClientValidationType({
        validationType: validationName
      })) {
        dispatch(clientValidation({
          validationType: validationName,
          value,
          state
        }));
      }
    });
  }

  function toggleEye() {
    if (inputType === 'password') {
      setInputType('text');
    } else {
      setInputType('password');
    }
  }

  return h("div", {
    style: style.root
  }, h("div", {
    style: style.inputContainer
  }, h("input", {
    style: { ...style.input,
      borderColor
    },
    type: inputType,
    name: name,
    onChange: onChange,
    value: value,
    onBlur: handleBlur,
    placeholder: placeholder,
    onFocus: handleFocus,
    "data-testid": id
  }), validationTypes.map(validationName => {
    if (state.validation[validationName]) {
      const {
        validationState
      } = state.validation[validationName];

      if (validationState === validationStates.VALID || validationState === validationStates.INVALID) {
        return h(ValidityIcon, {
          key: validationName,
          valid: validationState
        });
      }

      return null;
    }
  }), type === 'password' && h(EyeIcon, {
    onClick: toggleEye
  })), validationTypes.map(validationName => {
    if (state.validation[validationName]) {
      const {
        message
      } = state.validation[validationName];
      return h("div", {
        key: validationName,
        style: style.message
      }, message !== '' && h("div", {
        role: "message",
        "data-testid": `message-${name}`
      }, `* ${message}`));
    }
  }));
}

var css_248z$1 = ".btn {\n  padding: 6px 16px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  border: none;\n  -webkit-box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);\n          box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);\n  min-width: 64px;\n  font-weight: 500;\n  font-size: 0.875rem;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n}\n\n.paper {\n  -webkit-box-shadow: 0px 3px 3px -2px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12);\n          box-shadow: 0px 3px 3px -2px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12);\n  margin: 8px;\n  padding: 8px;\n}";
styleInject(css_248z$1);

function Button({
  onClick,
  title,
  disabled,
  id,
  color = 'primary'
}) {
  const theme = useThemeContext();
  return h("button", {
    className: "btn",
    "data-testid": id,
    disabled: disabled,
    style: { ...theme[color]
    },
    onClick: onClick
  }, title);
}

function Form({
  children,
  formTitle,
  error
}) {
  return h("div", {
    className: "paper"
  }, h("legend", null, formTitle, ":"), children, error && h("div", {
    style: {
      color: 'red',
      backgroundColor: 'white',
      padding: 5,
      borderRadius: 5
    }
  }, "* ", error.message));
}

function valueChanged({
  propName,
  value
}) {
  return {
    type: actionTypes$1.VALUE_CHANGED,
    payload: {
      propName,
      value
    }
  };
}
async function login({
  dispatch,
  state,
  formDispatch
}) {
  try {
    const {
      emailorusername,
      password
    } = state;
    dispatch({
      type: actionTypes$1.LOGIN_STARTED
    });
    const response = await fetch(`/auth/login`, {
      headers: {
        'Conten-Type': 'application/json',
        'Access-Control-Allow-Headers': '*',
        Authorization: `Basic ${btoa(`${emailorusername}:${password}`)}`
      },
      method: 'GET'
    });
    const result = await response.json();

    if (response.status === 200) {
      dispatch({
        type: actionTypes$1.LOGIN_SUCCESS,
        token: result.token
      });
    } else if (response.status === 400) {
      const {
        errors
      } = result;
      errors.forEach(error => {
        formDispatch(serverValidation({
          status: error
        }));
      });
    } else {
      throw new Error('Login failed');
    }
  } catch (error) {
    dispatch({
      type: actionTypes$1.LOGIN_FAILED,
      payload: {
        error
      }
    });
  }
}
async function signup({
  dispatch,
  formDispatch,
  state
}) {
  dispatch({
    type: actionTypes$1.SIGNUP_STARTED
  });
  const {
    email,
    password,
    username
  } = state;

  try {
    const response = await fetch(`/auth/signup`, {
      body: JSON.stringify({
        password,
        email,
        username
      }),
      headers: {
        ContentType: 'application/json',
        Accept: 'application/json'
      },
      method: 'POST'
    });
    const result = await response.json();

    if (response.status === 200) {
      dispatch({
        type: actionTypes$1.SIGNUP_SUCCESS,
        token: result.token
      });
    } else if (response.status === 400) {
      const {
        errors
      } = result;
      errors.forEach(error => {
        formDispatch(serverValidation({
          status: error
        }));
      });
    } else {
      throw new Error('Signup failed');
    }
  } catch (error) {
    dispatch({
      type: actionTypes$1.SIGNUP_FAILED,
      payload: {
        error
      }
    });
  }
}
async function changePassword({
  dispatch,
  state
}) {
  dispatch({
    type: actionTypes$1.CHANGE_PASSWORD_STARTED
  });

  try {
    const {
      confirm,
      password,
      token,
      emailorusername,
      current
    } = state;
    const response = await fetch(`/auth/changepass`, {
      method: 'put',
      body: JSON.stringify({
        confirm,
        password,
        current,
        token,
        emailorusername
      })
    });
    const result = await response.json();

    if (response.status === 200) {
      dispatch({
        type: actionTypes$1.CHANGE_PASSWORD_SUCCESS,
        token: result.token
      });
    } else if (response.status === 400) {
      const {
        errors
      } = result;
      errors.forEach(error => {
        dispatch(serverValidation({
          status: error
        }));
      });
    } else if (response.status === 500) {
      const {
        error
      } = result;
      dispatch({
        type: actionTypes$1.CHANGE_PASSWORD_FAILED,
        error
      });
    } else {
      throw new Error('Changing password failed');
    }
  } catch (error) {
    dispatch({
      type: actionTypes$1.CHANGE_PASSWORD_FAILED,
      payload: {
        error
      }
    });
  }
}
async function forgotPassword({
  dispatch,
  state,
  formDispatch
}) {
  try {
    dispatch({
      type: actionTypes$1.REQUEST_PASS_CHANGE_STARTED
    });
    const {
      email
    } = state;
    const response = await fetch(`/auth/requestpasschange`, {
      method: 'post',
      body: JSON.stringify({
        email
      })
    });
    const result = await response.json();

    if (response.status === 200) {
      dispatch({
        type: actionTypes$1.CHANGE_PASSWORD_SUCCESS,
        token: result.token
      });
    } else if (response.status === 400) {
      const {
        errors
      } = result;
      errors.forEach(error => {
        formDispatch(serverValidation({
          status: error
        }));
      });
    } else if (response.status === 500) {
      const {
        error
      } = result;
      dispatch({
        type: actionTypes$1.CHANGE_PASSWORD_FAILED,
        error
      });
    } else {
      throw new Error('Changing password failed');
    }
  } catch (error) {
    dispatch({
      type: actionTypes$1.REQUEST_PASS_CHANGE_FAILED,
      payload: {
        error: err
      }
    });
  }
}

export { Button as B, Form as F, Input as I, valueChanged as a, changePassword as c, forgotPassword as f, login as l, signup as s, validationTypes as v };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9ucy1kODQ0OTQyZC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY2xpZW50L2Zvcm0vdmFsaWRhdGlvblR5cGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vdmFsaWRhdGlvbk1lc3NhZ2VzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vdmFsaWRhdGlvblJlZ2V4LmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vY29uc3RyYWludFZhbGlkYXRvcnMuanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS9odHRwLXN0YXR1cy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL2FjdGlvbnMuanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS9pY29ucy9vcGVuRXllLnBuZyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL2ljb25zL2Nsb3NlRXllLnBuZyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL0V5ZUljb24uanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS9JbnB1dC5qcyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL0J1dHRvbi5qcyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL0Zvcm0uanMiLCIuLi8uLi8uLi9jbGllbnQvYXV0aC9hY3Rpb25zLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IHtcclxuICAvL2NvbnN0cmFpbnRcclxuICBFTUFJTF9GT1JNQVRfVkFMSURBVElPTjogJ0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OJyxcclxuICBQQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTjogJ1BBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OJyxcclxuICBVU0VSTkFNRV9GT1JNQVRfVkFMSURBVElPTjogJ1VTRVJOQU1FX0ZPUk1BVF9WQUxJREFUSU9OJyxcclxuICBVU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTjogJ1VTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OJyxcclxuICBFTVBUWV9TVFJJTkdfVkFMSURBVElPTjogJ0VNUFRZX1NUUklOR19WQUxJREFUSU9OJyxcclxuICBQQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTjogJ1BBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OJyxcclxuICAvL2F1dGhcclxuICBJTlZBTElEX0NSRURFTlRJQUxTOiAnSU5WQUxJRF9DUkVERU5USUFMUycsXHJcbiAgVVNFUk5BTUVfVEFLRU46ICdVU0VSTkFNRV9UQUtFTicsXHJcbiAgUkVHSVNURVJFRF9FTUFJTDogJ1JFR0lTVEVSRURfRU1BSUwnLFxyXG4gIEVNQUlMX05PVF9SRUdJU1RFUkVEOiAnRU1BSUxfTk9UX1JFR0lTVEVSRUQnLFxyXG4gIFVTRVJOQU1FX05PVF9SRUdJU1RFUkVEOidVU0VSTkFNRV9OT1RfUkVHSVNURVJFRCdcclxufTtcclxuIiwiZXhwb3J0IGRlZmF1bHQge1xyXG4gIElOVkFMSURfUEFTU1dPUkQ6XHJcbiAgICAnYXQgbGVhc3QgOCBjaGFyYWN0ZXJzLCBtdXN0IGNvbnRhaW4gYXQgbGVhc3QgMSB1cHBlcmNhc2UgbGV0dGVyLCAxIGxvd2VyY2FzZSBsZXR0ZXIsIENhbiBjb250YWluIHNwZWNpYWwgY2hhcmFjdGVycycsXHJcbiAgSU5WQUxJRF9FTUFJTDogJ2VtYWlsIGZvcm1hdCBpcyBub3QgdmFsaWQnLFxyXG4gIEVNQUlMX05PVF9SRUdJU1RFUkVEOiAnZW1haWwgaXMgbm90IHJlZ2lzdGVyZWQnLFxyXG4gIFVTRVJOQU1FX05PVF9SRUdJU1RFUkVEOiAndXNlcm5hbWUgaXMgbm90IHJlZ2lzdGVyZWQnLFxyXG4gIElOVkFMSURfVVNFUk5BTUU6XHJcbiAgICAnb25seSBMZXR0ZXJzIGEteiBvciBBLVogYW5kIHRoZSBTeW1ib2xzIC0gYW5kIF8gYXJlIGFsbG93ZWQnLFxyXG4gIElOVkFMSURfRU1QVFlfU1RSSU5HOiAnZW1wdHkgc3RyaW5nIGlzIG5vdCBhbGxvd2VkJyxcclxuICBJTlZBTElEX1VTRVJOQU1FX09SX0VNQUlMOiAnZW1haWwgb3IgdXNlcm5hbWUgaXMgbm90IHZhbGlkJyxcclxuICBJTlZBTElEX0NSRURFTlRJQUxTOiAnaW52YWxpZCBjcmVkZW50aWFscyBwcm92aWRlZCcsXHJcbiAgVVNFUk5BTUVfVEFLRU46ICd1c2VybmFtZSBpcyBhbHJlYWR5IHRha2VuJyxcclxuICBSRUdJU1RFUkVEX0VNQUlMOiAnZW1haWwgaXMgYWxyZWFkeSByZWdpc3RlcmVkJyxcclxuICBQQVNTV09SRFNfRE9fTk9UX01BVENIOiAncGFzc3dvcmRzIGRvIG5vdCBtYXRjaCdcclxufTtcclxuIiwiZXhwb3J0IGNvbnN0IHBhc3N3b3JkUmVnZXggPSAvXig/PS4qXFxkKSg/PS4qW2Etel0pKD89LipbQS1aXSkoPz0uKlthLXpBLVpdKS57OCx9JC9nO1xyXG5cclxuZXhwb3J0IGNvbnN0IGVtYWlsUmVnZXggPSAvW2EtejAtOSEjJCUmJyorLz0/Xl9ge3x9fi1dKyg/OlxcLlthLXowLTkhIyQlJicqKy89P15fYHt8fX4tXSspKkAoPzpbYS16MC05XSg/OlthLXowLTktXSpbYS16MC05XSk/XFwuKStbYS16MC05XSg/OlthLXowLTktXSpbYS16MC05XSk/L2c7XHJcblxyXG5leHBvcnQgY29uc3QgdXNlcm5hbWVSZWdleCA9IC9bYS16QS1aXStbLV9dKlthLXpBLVpdKy9nO1xyXG4iLCJpbXBvcnQgdmFsaWRhdGlvblN0YXRlIGZyb20gJy4vdmFsaWRhdGlvblN0YXRlcyc7XHJcbmltcG9ydCB2YWxpZGF0aW9uVHlwZXMgZnJvbSAnLi92YWxpZGF0aW9uVHlwZXMnO1xyXG5pbXBvcnQgdmFsaWRhdGlvbk1lc3NhZ2VzIGZyb20gJy4vdmFsaWRhdGlvbk1lc3NhZ2VzJztcclxuaW1wb3J0IHsgZW1haWxSZWdleCwgcGFzc3dvcmRSZWdleCwgdXNlcm5hbWVSZWdleCB9IGZyb20gJy4vdmFsaWRhdGlvblJlZ2V4JztcclxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlRW1haWxDb25zdHJhaW50KHsgZW1haWwgfSkge1xyXG4gIGNvbnN0IGVtYWlsQ29uc3RyYWludCA9IG5ldyBSZWdFeHAoZW1haWxSZWdleCk7XHJcblxyXG4gIGlmIChlbWFpbENvbnN0cmFpbnQudGVzdChlbWFpbCkpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuRU1BSUxfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLlZBTElELFxyXG4gICAgICBtZXNzYWdlOiAnJyxcclxuICAgIH07XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuRU1BSUxfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX0VNQUlMLFxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc0NsaWVudFZhbGlkYXRpb25UeXBlKHsgdmFsaWRhdGlvblR5cGUgfSkge1xyXG4gIHN3aXRjaCAodmFsaWRhdGlvblR5cGUpIHtcclxuICAgIGNhc2UgdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OOlxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIGNhc2UgdmFsaWRhdGlvblR5cGVzLkVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OOlxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIGNhc2UgdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OOlxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIGNhc2UgdmFsaWRhdGlvblR5cGVzLkVNUFRZX1NUUklOR19WQUxJREFUSU9OOlxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIGNhc2UgdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OOlxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIGNhc2UgdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX0ZPUk1BVF9WQUxJREFUSU9OOlxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlUGFzc3dvcmRDb25zdHJhaW50KHsgcGFzc3dvcmQgfSkge1xyXG4gIGNvbnN0IHBhc3N3b3JkQ29uc3RyYWludCA9IG5ldyBSZWdFeHAocGFzc3dvcmRSZWdleCk7XHJcbiAgaWYgKHBhc3N3b3JkQ29uc3RyYWludC50ZXN0KHBhc3N3b3JkKSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5QQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgfTtcclxuICB9XHJcbiAgaWYgKCFwYXNzd29yZENvbnN0cmFpbnQudGVzdChwYXNzd29yZCkpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX1BBU1NXT1JELFxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZVVzZXJOYW1lQ29uc3RyYWludCh7IHVzZXJuYW1lIH0pIHtcclxuICBjb25zdCB1c2VybmFtZUNvbnN0cmFpbnQgPSBuZXcgUmVnRXhwKHVzZXJuYW1lUmVnZXgpO1xyXG5cclxuICBpZiAodXNlcm5hbWVDb25zdHJhaW50LnRlc3QodXNlcm5hbWUpKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogJycsXHJcbiAgICB9O1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTlZBTElELFxyXG4gICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9VU0VSTkFNRSxcclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVFbWFpbE9yVXNlcm5hbWUoeyB2YWx1ZSB9KSB7XHJcbiAgY29uc3QgZW1haWxDb25zdHJhaW50ID0gbmV3IFJlZ0V4cChlbWFpbFJlZ2V4KTtcclxuICBjb25zdCB1c2VybmFtZUNvbnN0cmFpbnQgPSBuZXcgUmVnRXhwKHVzZXJuYW1lUmVnZXgpO1xyXG5cclxuICBpZiAoZW1haWxDb25zdHJhaW50LnRlc3QodmFsdWUpKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogJycsXHJcbiAgICB9O1xyXG4gIH0gZWxzZSBpZiAodXNlcm5hbWVDb25zdHJhaW50LnRlc3QodmFsdWUpKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogJycsXHJcbiAgICB9O1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTlZBTElELFxyXG4gICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9VU0VSTkFNRV9PUl9FTUFJTCxcclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVFbXB0eVN0cmluZyh7IHZhbHVlIH0pIHtcclxuICBpZiAodmFsdWUubGVuZ3RoID09PSAwKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLkVNUFRZX1NUUklOR19WQUxJREFUSU9OLFxyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTlZBTElELFxyXG4gICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9FTVBUWV9TVFJJTkcsXHJcbiAgICB9O1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLkVNUFRZX1NUUklOR19WQUxJREFUSU9OLFxyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogJycsXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlUGFzc3dvcmRNYXRjaCh7IHN0YXRlIH0pIHtcclxuICBkZWJ1Z2dlcjtcclxuICBjb25zdCB7IHBhc3N3b3JkLCBjb25maXJtIH0gPSBzdGF0ZS5hdXRoO1xyXG5cclxuICBpZiAocGFzc3dvcmQgPT09ICcnIHx8IHBhc3N3b3JkICE9PSBjb25maXJtKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTlZBTElELFxyXG4gICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuUEFTU1dPUkRTX0RPX05PVF9NQVRDSCxcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5QQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTixcclxuICAgIH07XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLlZBTElELFxyXG4gICAgICBtZXNzYWdlOiAnJyxcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5QQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTixcclxuICAgIH07XHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IHtcclxuICAvL2xvZ2luXHJcbiAgY3JlZGVudGlhbEludmFsaWQ6ICc0MDEnLFxyXG4gIC8vc2lnbnVwXHJcbiAgdXNlcm5hbWVJc1Rha2VuOiAnNDAyJyxcclxuICBlbWFpbElzUmVnaXN0ZXJlZDogJzQwMycsXHJcbiAgdXNlcm5hbWVJbnZhbGlkOiAnNDA1JyxcclxuICBwYXNzd29yZEludmFsaWQ6ICc0MDYnLCAvL2NoYW5nZSBwYXNzd29yZFxyXG4gIGVtYWlsSW52YWxpZDogJzQwNycsXHJcbiAgLy9sb2dpblxyXG4gIGVtYWlsSXNOb3RSZWdpc3RlcmVkOiAnNDA4JyxcclxuICBlbXB0eVN0cmluZ05vdFZhbGlkOiAnNDA5JyxcclxuICBlbWFpbG9ydXNlcm5hbWVOb3RWYWxpZDonNDEwJyxcclxuICB1c2VybmFtZUlzTm90UmVnaXN0ZXJlZDonNDExJyxcclxuLy9jaGFuZ2UgcGFzc3dvcmRcclxuICBwYXNzd29yZERvTm90TWF0Y2g6JzQxMicsXHJcbiAgdG9rZW5FeHBpcmVkOic0MTMnLFxyXG4gIHNlcnZlclZhbGlkYXRpb25SYW5nZTogc3RhdHVzID0+IHtcclxuICAgIGlmIChzdGF0dXMgPj0gNDAwICYmIHN0YXR1cyA8PSA0MTApIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG59O1xyXG4iLCJcclxuaW1wb3J0ICogYXMgdmFsaWRhdGlvbnMgZnJvbSAnLi9jb25zdHJhaW50VmFsaWRhdG9ycyc7XHJcbmltcG9ydCBjb25zdFZhbFR5cGVzIGZyb20gJy4vdmFsaWRhdGlvblR5cGVzJztcclxuaW1wb3J0IHZhbGlkYXRpb25TdGF0ZXMgZnJvbSAnLi92YWxpZGF0aW9uU3RhdGVzJztcclxuaW1wb3J0IHZhbGlkYXRpb25UeXBlcyBmcm9tICcuL3ZhbGlkYXRpb25UeXBlcyc7XHJcbmltcG9ydCBhY3Rpb25UeXBlcyBmcm9tICcuL2FjdGlvblR5cGVzJztcclxuaW1wb3J0IGh0dHBTdGF0dXMgZnJvbSAnLi9odHRwLXN0YXR1cyc7XHJcbmltcG9ydCB2YWxpZGF0aW9uTWVzc2FnZXMgZnJvbSAnLi92YWxpZGF0aW9uTWVzc2FnZXMnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNsaWVudFZhbGlkYXRpb24oeyB2YWxpZGF0aW9uVHlwZSwgdmFsdWUsIHN0YXRlIH0pIHtcclxuICBsZXQgdmFsaWRhdGlvbiA9IG51bGw7XHJcbiAgc3dpdGNoICh2YWxpZGF0aW9uVHlwZSkge1xyXG4gICAgY2FzZSBjb25zdFZhbFR5cGVzLkVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OOlxyXG4gICAgICB2YWxpZGF0aW9uID0gdmFsaWRhdGlvbnMudmFsaWRhdGVFbWFpbENvbnN0cmFpbnQoe1xyXG4gICAgICAgIGVtYWlsOiB2YWx1ZSxcclxuICAgICAgfSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBjb25zdFZhbFR5cGVzLlVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OOlxyXG4gICAgICB2YWxpZGF0aW9uID0gdmFsaWRhdGlvbnMudmFsaWRhdGVFbWFpbE9yVXNlcm5hbWUoe1xyXG4gICAgICAgIHZhbHVlLFxyXG4gICAgICB9KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIGNvbnN0VmFsVHlwZXMuUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT046XHJcbiAgICAgIHZhbGlkYXRpb24gPSB2YWxpZGF0aW9ucy52YWxpZGF0ZVBhc3N3b3JkQ29uc3RyYWludCh7XHJcbiAgICAgICAgcGFzc3dvcmQ6IHZhbHVlLFxyXG4gICAgICB9KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIGNvbnN0VmFsVHlwZXMuVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT046XHJcbiAgICAgIHZhbGlkYXRpb24gPSB2YWxpZGF0aW9ucy52YWxpZGF0ZVVzZXJOYW1lQ29uc3RyYWludCh7XHJcbiAgICAgICAgdXNlcm5hbWU6IHZhbHVlLFxyXG4gICAgICB9KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIGNvbnN0VmFsVHlwZXMuRU1QVFlfU1RSSU5HX1ZBTElEQVRJT046XHJcbiAgICAgIHZhbGlkYXRpb24gPSB2YWxpZGF0aW9ucy52YWxpZGF0ZUVtcHR5U3RyaW5nKHsgdmFsdWUgfSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBjb25zdFZhbFR5cGVzLlBBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OOlxyXG4gICBcclxuICAgICAgdmFsaWRhdGlvbiA9IHZhbGlkYXRpb25zLnZhbGlkYXRlUGFzc3dvcmRNYXRjaCh7IHN0YXRlIH0pO1xyXG4gICAgICBicmVhaztcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIGJyZWFrO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHsgdHlwZTogYWN0aW9uVHlwZXMuQ0xJRU5UX1ZBTElEQVRJT04sIC4uLnZhbGlkYXRpb24gfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGluaXRGb3JtVmFsaWRhdGlvblN0YXRlKCkge1xyXG4gIHJldHVybiB7IHR5cGU6IGFjdGlvblR5cGVzLklOSVRfRk9STV9WQUxJREFUSU9OX1NUQVRFIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZXNldElucHV0VmFsaWRhdGlvblN0YXRlKHsgdmFsaWRhdGlvblR5cGUgfSkge1xyXG4gIHJldHVybiB7IHR5cGU6IGFjdGlvblR5cGVzLlJFU0VUX1ZBTElEQVRJT05fU1RBVEUsIHZhbGlkYXRpb25UeXBlIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpbmNJbnB1dENvdW50KCkge1xyXG4gIHJldHVybiB7IHR5cGU6IGFjdGlvblR5cGVzLklOQ19JTlBVVF9DT1VUTiB9O1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNlcnZlclZhbGlkYXRpb24oeyBzdGF0dXMgPSAwIH0pIHtcclxuICBkZWJ1Z2dlcjtcclxuICBzd2l0Y2ggKHN0YXR1cykge1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLmNyZWRlbnRpYWxJbnZhbGlkOlxyXG4gICAgICBkZWJ1Z2dlcjtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLklOVkFMSURfQ1JFREVOVElBTFMsXHJcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfQ1JFREVOVElBTFMsXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMuZW1haWxJbnZhbGlkOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxyXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuRU1BSUxfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfRU1BSUwsXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMucGFzc3dvcmRJbnZhbGlkOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxyXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfUEFTU1dPUkQsXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMudXNlcm5hbWVJbnZhbGlkOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxyXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfVVNFUk5BTUUsXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMuZW1haWxJc1JlZ2lzdGVyZWQ6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5SRUdJU1RFUkVEX0VNQUlMLFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5SRUdJU1RFUkVEX0VNQUlMLFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLmVtYWlsSXNOb3RSZWdpc3RlcmVkOlxyXG4gICAgICBkZWJ1Z2dlcjtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLkVNQUlMX05PVF9SRUdJU1RFUkVELFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5FTUFJTF9OT1RfUkVHSVNURVJFRCxcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcclxuICAgICAgfTtcclxuICAgIGNhc2UgaHR0cFN0YXR1cy51c2VybmFtZUlzVGFrZW46XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9UQUtFTixcclxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuVVNFUk5BTUVfVEFLRU4sXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMuZW1wdHlTdHJpbmdOb3RWYWxpZDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLkVNUFRZX1NUUklOR19WQUxJREFUSU9OLFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX0VNUFRZX1NUUklORyxcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcclxuICAgICAgfTtcclxuICAgIGNhc2UgaHR0cFN0YXR1cy5lbWFpbG9ydXNlcm5hbWVOb3RWYWxpZDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX1VTRVJOQU1FX09SX0VNQUlMLFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLnVzZXJuYW1lSXNOb3RSZWdpc3RlcmVkOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxyXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfTk9UX1JFR0lTVEVSRUQsXHJcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLlVTRVJOQU1FX05PVF9SRUdJU1RFUkVELFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgICBjYXNlIGh0dHBTdGF0dXMucGFzc3dvcmREb05vdE1hdGNoOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxyXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT04sXHJcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLlBBU1NXT1JEU19ET19OT1RfTUFUQ0gsXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcbn1cclxuIiwiY29uc3QgaW1nID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUVBQUFBQkFDQVlBQUFDcWFYSGVBQUFBQ1hCSVdYTUFBQXNUQUFBTEV3RUFtcHdZQUFBQ3NrbEVRVlI0bk8yYXUyNFRRUlNHUDlzSzBGZ2lJZ0xsSW9VdXFRTlVWT0hTbUJMZWdIUVVnUzdQZ1pJT2hLbUlZaWhpM3NBSUNRcFNKS0VFQ1NzR2drS0xKVXVSS1dZV0hMT0xkK2ZNN3RyeCthU1JKV3RuL3YvWXU3TXpadzRvaXFJb2lxSW9paktPRkRMUU9BTmNBYTREUzhCRjRBSXdaVDhCZmdKSDl2TUhzQU84QlQ0QW5RdzhldWNTc0FhOEFkcEExN0cxN1JocmRzeWhwZ0RjQm1xWWY4MDE2S2pXc1dQZklwczdOeEUzZ0YzOEJ4M1ZkcTFtN2x3R1hwRmQ0UDN0SlRDZmRwQlJQRVQyZlB0cWJXQTE1VmhQY0JaNDdqa0lINjFxdmFYS0RQQSt4eUFIdFhmQWRGckJ6d0ZOb2NFbXNBNVVnQVdnYk51Qy9XN2RnOFlYNjlVcms4QkhnYWtENEQ1UWlxRlZzdGUyQkhyN3dIbFJ4RDJjd3l4R1hNMXNZLzdscEpTQnVrQzNZYjJMMlJTWWVBd1VCZHBGTzRhci9xWkFHNEI3QXZGdC9Lellpc2p1aEx1dXdwUEFkMGZSQTl4dSt5akt1TThKMzJ3c2lhazZDbll4azVodlZnUituaVVWdXlZUWF4SnZ0azlLQ2RrcjhtcllvRkVUMUNPQjBUcHdMT2dmeFRId1d0QS9ka3l6eUxhekZZSEpRVlFFdmpxWWxld0p3dTZBQjhDRXdPUW5RZDlCZkJiMG5jREVOcEJEM0gvbExuNW4vMzdLUW0rSC9RTktGaW1uZ3JBZjRLbHd6SCtlTTQvTUN2cy9pU3N5MXBOZ0M1TnFrcGhNaXp1Q3ZqWGdhOXlMeDJZaDlEK3FBckdSWHdxRGJEUFU0aFJzaGtDK0hmYnhtczF0T3h3d3lnbVJGd0x0UDBoVFluVkdQQ1VHNWhuYUY1aHBZU2F4dUVuUkZXUkowVDA4SmtVRDVqQXBaMWRUWGN4cmJBT3pWbGprYjFwODBYNjN3WkNteFFObU1JY1BFb05wdGxRUFJnTEcrbWlzbDFXRzQzRDBGeGtmanZZeWo5azM1QlY4alJ5UHgzdFpKdnNDaWVWTUlrdEFBVk8rc2tWNkpUSmJ3RTJHc0VTbW42Qklxb0c4U0twQmlrVlNXWlhKTFJGZUpqZGxyemtpdkV4dWh4RXRrMU1VUlZFVVJWRVVaYmo1RGNrTUZlUWhyRmo5QUFBQUFFbEZUa1N1UW1DQ1wiO1xuICBleHBvcnQgZGVmYXVsdCBpbWc7IiwiY29uc3QgaW1nID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUVBQUFBQkFDQVlBQUFDcWFYSGVBQUFBQ1hCSVdYTUFBQXNUQUFBTEV3RUFtcHdZQUFBRHMwbEVRVlI0bk8zYlMyaGNWUnpIOFU5YW85SXltb0lvU21PcUxhMHJONzV3SzRKYXRKUWFGZXpDaU5LdGlGQmM2TktWZENPS0MxRXJJb29Lb3FDQzRGdlJqU0sxaWk1RURXaE5VZkVGZ1JpTWl6T1JOTDAzY3g1eloySnlmL0FuTU1tYzMvLy96Ym4zbnRlbFZhdFdyVTdVWHN4MFk5K1FjeG1LWnJEUWpiOHhPZHgwQnErbEFOWWxoSDFDMGNzaDNEVE1wQWF0U1MyRVdnZzNEek9wUWF1RllJMURHSW44dTBrOGkxT1dmRGFQL1hpK3gzZTM0REpjM0kxZDNjL083TVkvK0FVL2QzOGV4NmY0RUo5Z0xqTEh4bFhWRStaVjk0UUxjRGZlcnZoT1NzemlmZHlMYzVvcEswMjlJRnlOVjRYL2FtN1JkVEdIRjdvZXNUMjNFZFZCK0ZML2k2NkxJN2lxNlVKWFVoV0VZY1NMbUdpNDFscXRGZ2l6dUt2aFdtdTFXaUFzNERCT2E3VGFHcTBtQ0IvajNLWUtQUjl2WVh2RjcySWhITU1oWEM5Y3U1dlFFY1lHdS9Fd3BpUGFXU20reDlZKzFnM094dGRkZzJucEVIN0NGRVlqdkRiaUR2eFEwMVpNSE1WWWFwRjEyaXlNeUpZYXBFSTRrT0hid1NzVmJjWEdlemc5dy9ja1BWRmprQUpoSHJka2VHL0FRelgrTWZGY2h1Y0oydC9EWUZBUVNuckNqUm1lNER6OEdXRXdDQWdkK2ZlRVk4TGtLMW1IRTB3R0FlSE9oSHlXeDVPcFpwZGttRFFOWWFPeVIrU2xLV2F2WlpwTVkxdEZlLzJDOEVobVhndDRKdFprdTdMcDdMVTE3ZllEd3U2Q3ZPYUUrMXBQUFZoZ3NvRHhGZG91aFhCUllXNFB4SmdjTHpUcE5TRXBnZEFwekcwbXdxTVlRTXdRTkJmQ3BzTGNvZ0FjS2pTNUlzWkVIb1NKd3R5aUxvRmRoU2EzeFpoMGxRcmhob0s4b20rQzhIcUIwV094SmwybFFDanBuZEdQUWZJR1Fvc3hpN05Tek1SQkdCV0d0Ymw1SlEyRUNCc2V1V2IzcDVycERXR3FJSi9ITS9LeEZiOW5HdjZCblJtZWRSQU9DSXNxT2JuOHFHQng1UFpNMHdWOExpeW1wS3JmYTR4N00zTDRUeVBLTG9XWERCZkNVeG5lSjJtenNGbVptOFFSN01qd0xZWHdKazdOOEszVU9MNHJTT1kzM0tjL1Q0ZVkrQXhuWk5TNW9yYmgyNHhrbHNhc01FNllFa2FNWThMY1lSelhxTjdtU29Yd2pZYjNCbzRtSkpNYU9VdnVTK01kNmIwc1dSMjhISkhNb0NFOEttN2ZvUy9hZ0h1RUxyMGFJRHpkL3hManRCUHZWaVEwYUFoMUoxVUdvaEhzMGN3QmlmOE5CTUtxN1I2OG9mOFFMcXp3VzVVUUZyVURCL0dSc3VMbmhEMis2MnA4aW8vd0RlS3cwUmd1eDVYQ291YUU4RGp0Q0dPQVVXSHk5S3R3Vk80cmZDR01JRC9BWHozYXJ6dkNkNnR3cUdwZHFEM2JySVdBZWdqcjZuMkhGb0o2Q092cUhhZ3FDRkViSTJ0Snl5R3NPd0NFYnIvNEdtRFIrbUNyVnEzV252NEZycmN1ajJPZlI1c0FBQUFBU1VWT1JLNUNZSUk9XCI7XG4gIGV4cG9ydCBkZWZhdWx0IGltZzsiLCJpbXBvcnQge2h9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7dXNlU3RhdGV9IGZyb20gJ3ByZWFjdC9ob29rcydcclxuaW1wb3J0IG9wZW5JY29uIGZyb20gJy4vaWNvbnMvb3BlbkV5ZS5wbmcnO1xyXG5pbXBvcnQgY2xvc2VJY29uIGZyb20gJy4vaWNvbnMvY2xvc2VFeWUucG5nJztcclxuZnVuY3Rpb24gSWNvblN0YXRlKHsgb3BlbiB9KSB7XHJcbiAgaWYgKG9wZW4pIHtcclxuICAgIHJldHVybiA8aW1nIHdpZHRoPVwiMzBweFwiIHNyYz17b3Blbkljb259IC8+O1xyXG4gIH1cclxuICByZXR1cm4gPGltZyB3aWR0aD1cIjMwcHhcIiBzcmM9e2Nsb3NlSWNvbn0gLz47XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEV5ZUljb24oe29uQ2xpY2t9KSB7XHJcbiAgY29uc3QgW3N0YXRlLCBzZXRTdGF0ZV0gPSB1c2VTdGF0ZShmYWxzZSk7XHJcbiAgZnVuY3Rpb24gdG9nZ2xlKCkge1xyXG4gICAgb25DbGljaygpXHJcbiAgICBzZXRTdGF0ZShwcmV2ID0+ICFwcmV2KTtcclxuICB9XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2XHJcbiAgICAgIG9uQ2xpY2s9e3RvZ2dsZX1cclxuICAgICAgc3R5bGU9e3tcclxuICAgICAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXHJcbiAgICAgICAganVzdGlmeUNvbnRlbnQ6J2NlbnRlcicsXHJcbiAgICAgICAgbWFyZ2luOiAxXHJcbiAgICAgIH19XHJcbiAgICA+XHJcbiAgICAgIDxJY29uU3RhdGUgb3Blbj17c3RhdGV9IC8+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0ICogYXMgYWN0aW9ucyBmcm9tICcuL2FjdGlvbnMnO1xyXG5pbXBvcnQgdmFsaWRhdGlvblN0YXRlcyBmcm9tICcuL3ZhbGlkYXRpb25TdGF0ZXMnO1xyXG5pbXBvcnQgeyBpc0NsaWVudFZhbGlkYXRpb25UeXBlIH0gZnJvbSAnLi9jb25zdHJhaW50VmFsaWRhdG9ycyc7XHJcbmltcG9ydCBFeWVJY29uIGZyb20gJy4vRXllSWNvbic7XHJcbmltcG9ydCB7IHVzZUZvcm1Db250ZXh0IH0gZnJvbSAnLi9mb3JtLWNvbnRleHQnO1xyXG5mdW5jdGlvbiBWYWxpZGl0eUljb24oeyB2YWxpZCB9KSB7XHJcbiAgbGV0IHN0YXRlQ29sb3IgPSAnIzRmYzNmNyc7XHJcbiAgc3dpdGNoICh2YWxpZCkge1xyXG4gICAgY2FzZSB2YWxpZGF0aW9uU3RhdGVzLlZBTElEOlxyXG4gICAgICBzdGF0ZUNvbG9yID0gJ2dyZWVuJztcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRDpcclxuICAgICAgc3RhdGVDb2xvciA9ICdyZWQnO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgdmFsaWRhdGlvblN0YXRlcy5JTkFDVElWRTpcclxuICAgICAgc3RhdGVDb2xvciA9ICcjNGZjM2Y3JztcclxuICAgICAgYnJlYWs7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICBzdGF0ZUNvbG9yID0gJyM0ZmMzZjcnO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgc3R5bGU9e3tcclxuICAgICAgICBmbGV4OiAxLFxyXG4gICAgICAgIGNvbG9yOiBzdGF0ZUNvbG9yLFxyXG4gICAgICAgIGxpbmVIZWlnaHQ6IDIsXHJcbiAgICAgICAgd2lkdGg6IDIwLFxyXG4gICAgICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXHJcbiAgICAgIH19XHJcbiAgICA+XHJcbiAgICAgIHt2YWxpZCA/ICfinJMnIDogJ+KYkyd9XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcblxyXG5jb25zdCBzdHlsZSA9IHtcclxuICBpbnB1dDoge1xyXG4gICBcclxuICAgIGJvcmRlcjogJzFweCBzb2xpZCcsXHJcbiAgICBwYWRkaW5nOiA4LFxyXG4gICAgZmxleDogMTAsXHJcbiAgICBib3JkZXJSYWRpdXM6IDIsXHJcbiAgfSxcclxuICByb290OiB7XHJcbiAgICBib3JkZXJSYWRpdXM6IDIsXHJcblxyXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXHJcbiAgICBiYWNrZ3JvdW5kQ29sb3I6ICd3aGl0ZScsXHJcbiAgICBib3JkZXI6ICcxcHggc29saWQgd2hpdGUnLFxyXG4gICAgbWFyZ2luQm90dG9tOiAxLFxyXG4gIH0sXHJcbiAgaW5wdXRDb250YWluZXI6IHtcclxuICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgIGZsZXg6IDEsXHJcbiAgfSxcclxuICBtZXNzYWdlOiB7XHJcbiAgICBjb2xvcjogJ3JlZCcsXHJcbiAgICBwYWRkaW5nTGVmdDogMyxcclxuICB9LFxyXG59O1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBJbnB1dCh7XHJcbiAgcGxhY2Vob2xkZXIsXHJcbiAgdHlwZSxcclxuICBuYW1lLFxyXG4gIG9uQ2hhbmdlLFxyXG4gIHZhbHVlID0gJycsXHJcbiAgdmFsaWRhdGlvblR5cGVzID0gW10sXHJcbiAgaWQsXHJcbn0pIHtcclxuICBjb25zdCB7IHN0YXRlLCBkaXNwYXRjaCB9ID0gdXNlRm9ybUNvbnRleHQoKTtcclxuXHJcbiAgY29uc3QgW2lucHV0VmFsaWRhdGlvbiwgc2V0SW5wdXRWYWxpZGF0aW9uXSA9IHVzZVN0YXRlKHtcclxuICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTkFDVElWRSxcclxuICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgdmFsaWRhdGlvblR5cGU6IHVuZGVmaW5lZCxcclxuICB9KTtcclxuXHJcbiAgY29uc3QgW2lucHV0VHlwZSwgc2V0SW5wdXRUeXBlXSA9IHVzZVN0YXRlKHR5cGUpO1xyXG5cclxuICBjb25zdCBbYm9yZGVyQ29sb3IsIHNldEJvcmRlckNvbG9yXSA9IHVzZVN0YXRlKCcnKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmIChcclxuICAgICAgaW5wdXRWYWxpZGF0aW9uICYmXHJcbiAgICAgIGlucHV0VmFsaWRhdGlvbi52YWxpZGF0aW9uU3RhdGUgPT09IHZhbGlkYXRpb25TdGF0ZXMuVkFMSURcclxuICAgICkge1xyXG4gICAgICBzZXRCb3JkZXJDb2xvcignZ3JlZW4nKTtcclxuICAgIH1cclxuICAgIGlmIChcclxuICAgICAgaW5wdXRWYWxpZGF0aW9uICYmXHJcbiAgICAgIGlucHV0VmFsaWRhdGlvbi52YWxpZGF0aW9uU3RhdGUgPT09IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRFxyXG4gICAgKSB7XHJcbiAgICAgIHNldEJvcmRlckNvbG9yKCdyZWQnKTtcclxuICAgIH1cclxuICAgIGlmIChcclxuICAgICAgaW5wdXRWYWxpZGF0aW9uICYmXHJcbiAgICAgIGlucHV0VmFsaWRhdGlvbi52YWxpZGF0aW9uU3RhdGUgPT09IHZhbGlkYXRpb25TdGF0ZXMuSU5BQ1RJVkVcclxuICAgICkge1xyXG4gICAgICBzZXRCb3JkZXJDb2xvcignIzRmYzNmNycpO1xyXG4gICAgfVxyXG4gIH0sIFtpbnB1dFZhbGlkYXRpb25dKTtcclxuICBmdW5jdGlvbiBoYW5kbGVGb2N1cygpIHtcclxuICAgIHZhbGlkYXRpb25UeXBlcy5mb3JFYWNoKCh2YWxpZGF0aW9uTmFtZSkgPT4ge1xyXG4gICAgICBpZiAoc3RhdGUudmFsaWRhdGlvblt2YWxpZGF0aW9uTmFtZV0pIHtcclxuICAgICAgICBkaXNwYXRjaChcclxuICAgICAgICAgIGFjdGlvbnMucmVzZXRJbnB1dFZhbGlkYXRpb25TdGF0ZSh7IHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uTmFtZSB9KVxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuICBmdW5jdGlvbiBoYW5kbGVCbHVyKCkge1xyXG4gICAgdmFsaWRhdGlvblR5cGVzLmZvckVhY2goKHZhbGlkYXRpb25OYW1lKSA9PiB7XHJcbiAgICAgIGlmIChpc0NsaWVudFZhbGlkYXRpb25UeXBlKHsgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25OYW1lIH0pKSB7XHJcbiAgICAgICAgZGlzcGF0Y2goXHJcbiAgICAgICAgICBhY3Rpb25zLmNsaWVudFZhbGlkYXRpb24oe1xyXG4gICAgICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvbk5hbWUsXHJcbiAgICAgICAgICAgIHZhbHVlLFxyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiB0b2dnbGVFeWUoKSB7XHJcbiAgICBpZiAoaW5wdXRUeXBlID09PSAncGFzc3dvcmQnKSB7XHJcbiAgICAgIHNldElucHV0VHlwZSgndGV4dCcpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc2V0SW5wdXRUeXBlKCdwYXNzd29yZCcpO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17c3R5bGUucm9vdH0+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlLmlucHV0Q29udGFpbmVyfT5cclxuICAgICAgICA8aW5wdXRcclxuICAgICAgICAgIHN0eWxlPXt7IC4uLnN0eWxlLmlucHV0LCBib3JkZXJDb2xvciB9fVxyXG4gICAgICAgICAgdHlwZT17aW5wdXRUeXBlfVxyXG4gICAgICAgICAgbmFtZT17bmFtZX1cclxuICAgICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cclxuICAgICAgICAgIHZhbHVlPXt2YWx1ZX1cclxuICAgICAgICAgIG9uQmx1cj17aGFuZGxlQmx1cn1cclxuICAgICAgICAgIHBsYWNlaG9sZGVyPXtwbGFjZWhvbGRlcn1cclxuICAgICAgICAgIG9uRm9jdXM9e2hhbmRsZUZvY3VzfVxyXG4gICAgICAgICAgZGF0YS10ZXN0aWQ9e2lkfVxyXG4gICAgICAgIC8+XHJcbiAgICAgICAge3ZhbGlkYXRpb25UeXBlcy5tYXAoKHZhbGlkYXRpb25OYW1lKSA9PiB7XHJcbiAgICAgICAgICBpZiAoc3RhdGUudmFsaWRhdGlvblt2YWxpZGF0aW9uTmFtZV0pIHtcclxuICAgICAgICAgICAgY29uc3QgeyB2YWxpZGF0aW9uU3RhdGUgfSA9IHN0YXRlLnZhbGlkYXRpb25bdmFsaWRhdGlvbk5hbWVdO1xyXG4gICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgdmFsaWRhdGlvblN0YXRlID09PSB2YWxpZGF0aW9uU3RhdGVzLlZBTElEIHx8XHJcbiAgICAgICAgICAgICAgdmFsaWRhdGlvblN0YXRlID09PSB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSURcclxuICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgIDxWYWxpZGl0eUljb24ga2V5PXt2YWxpZGF0aW9uTmFtZX0gdmFsaWQ9e3ZhbGlkYXRpb25TdGF0ZX0gLz5cclxuICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pfVxyXG4gICAgICAgIHt0eXBlID09PSAncGFzc3dvcmQnICYmIDxFeWVJY29uIG9uQ2xpY2s9e3RvZ2dsZUV5ZX0gLz59XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICB7dmFsaWRhdGlvblR5cGVzLm1hcCgodmFsaWRhdGlvbk5hbWUpID0+IHtcclxuICAgICAgICBpZiAoc3RhdGUudmFsaWRhdGlvblt2YWxpZGF0aW9uTmFtZV0pIHtcclxuICAgICAgICAgIGNvbnN0IHsgbWVzc2FnZSB9ID0gc3RhdGUudmFsaWRhdGlvblt2YWxpZGF0aW9uTmFtZV07XHJcbiAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGtleT17dmFsaWRhdGlvbk5hbWV9IHN0eWxlPXtzdHlsZS5tZXNzYWdlfT5cclxuICAgICAgICAgICAgICB7bWVzc2FnZSAhPT0gJycgJiYgKFxyXG4gICAgICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgICAgICByb2xlPSdtZXNzYWdlJ1xyXG4gICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD17YG1lc3NhZ2UtJHtuYW1lfWB9XHJcbiAgICAgICAgICAgICAgICA+e2AqICR7bWVzc2FnZX1gfTwvZGl2PlxyXG4gICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pfVxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlVGhlbWVDb250ZXh0IH0gZnJvbSAnLi4vdGhlbWUvdGhlbWUtY29udGV4dCc7XHJcbmltcG9ydCAnLi9jc3Mvc3R5bGUuY3NzJztcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQnV0dG9uKHtcclxuICBvbkNsaWNrLFxyXG4gIHRpdGxlLFxyXG4gIGRpc2FibGVkLFxyXG4gIGlkLFxyXG4gIGNvbG9yID0gJ3ByaW1hcnknLFxyXG59KSB7XHJcbiAgY29uc3QgdGhlbWUgPSB1c2VUaGVtZUNvbnRleHQoKTtcclxuICByZXR1cm4gKFxyXG4gICAgPGJ1dHRvblxyXG4gICAgICBjbGFzc05hbWU9J2J0bidcclxuICAgICAgZGF0YS10ZXN0aWQ9e2lkfVxyXG4gICAgICBkaXNhYmxlZD17ZGlzYWJsZWR9XHJcbiAgICAgIHN0eWxlPXt7IC4uLnRoZW1lW2NvbG9yXSB9fVxyXG4gICAgICBvbkNsaWNrPXtvbkNsaWNrfVxyXG4gICAgPlxyXG4gICAgICB7dGl0bGV9XHJcbiAgICA8L2J1dHRvbj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgJy4vY3NzL3N0eWxlLmNzcyc7XHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gIGRpc3BsYXk6ICdmbGV4JyxcclxuICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEZvcm0oeyBjaGlsZHJlbiwgZm9ybVRpdGxlLCBlcnJvciB9KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgY2xhc3NOYW1lPSdwYXBlcic+XHJcbiBcclxuICAgICAgICA8bGVnZW5kPntmb3JtVGl0bGV9OjwvbGVnZW5kPlxyXG4gICAgICAgIHtjaGlsZHJlbn1cclxuICAgICAgICB7ZXJyb3IgJiYgKFxyXG4gICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgIGNvbG9yOiAncmVkJyxcclxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICd3aGl0ZScsXHJcbiAgICAgICAgICAgICAgcGFkZGluZzogNSxcclxuICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IDUsXHJcbiAgICAgICAgICAgIH19XHJcbiAgICAgICAgICA+XHJcbiAgICAgICAgICAgICoge2Vycm9yLm1lc3NhZ2V9XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApfVxyXG4gICBcclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IGFjdGlvblR5cGVzIGZyb20gJy4vYWN0aW9uVHlwZXMnO1xyXG5pbXBvcnQgeyBzZXJ2ZXJWYWxpZGF0aW9uIH0gZnJvbSAnLi4vZm9ybS9hY3Rpb25zJztcclxuaW1wb3J0IGh0dHBTdGF0dXMgZnJvbSAnLi4vZm9ybS9odHRwLXN0YXR1cyc7XHJcbmV4cG9ydCBmdW5jdGlvbiB2YWx1ZUNoYW5nZWQoeyBwcm9wTmFtZSwgdmFsdWUgfSkge1xyXG4gIHJldHVybiB7XHJcbiAgICB0eXBlOiBhY3Rpb25UeXBlcy5WQUxVRV9DSEFOR0VELFxyXG4gICAgcGF5bG9hZDoge1xyXG4gICAgICBwcm9wTmFtZSxcclxuICAgICAgdmFsdWUsXHJcbiAgICB9LFxyXG4gIH07XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsb2dpbih7IGRpc3BhdGNoLCBzdGF0ZSwgZm9ybURpc3BhdGNoIH0pIHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgeyBlbWFpbG9ydXNlcm5hbWUsIHBhc3N3b3JkIH0gPSBzdGF0ZTtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTE9HSU5fU1RBUlRFRCB9KTtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYC9hdXRoL2xvZ2luYCwge1xyXG4gICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgJ0NvbnRlbi1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxyXG4gICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJzogJyonLFxyXG4gICAgICAgIEF1dGhvcml6YXRpb246IGBCYXNpYyAke2J0b2EoYCR7ZW1haWxvcnVzZXJuYW1lfToke3Bhc3N3b3JkfWApfWAsXHJcbiAgICAgIH0sXHJcbiAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICB9KTtcclxuIFxyXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkxPR0lOX1NVQ0NFU1MsIHRva2VuOiByZXN1bHQudG9rZW4gfSk7XHJcbiAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDAwKSB7XHJcbiAgICAgIGNvbnN0IHsgZXJyb3JzIH0gPSByZXN1bHQ7XHJcblxyXG4gICAgICBlcnJvcnMuZm9yRWFjaCgoZXJyb3IpID0+IHtcclxuICAgICAgICBmb3JtRGlzcGF0Y2goXHJcbiAgICAgICAgICBzZXJ2ZXJWYWxpZGF0aW9uKHtcclxuICAgICAgICAgICAgc3RhdHVzOiBlcnJvcixcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0xvZ2luIGZhaWxlZCcpO1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiBcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTE9HSU5fRkFJTEVELCBwYXlsb2FkOiB7IGVycm9yIH0gfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2lnbnVwKHsgZGlzcGF0Y2gsIGZvcm1EaXNwYXRjaCwgc3RhdGUgfSkge1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0lHTlVQX1NUQVJURUQgfSk7XHJcbiAgY29uc3QgeyBlbWFpbCwgcGFzc3dvcmQsIHVzZXJuYW1lIH0gPSBzdGF0ZTtcclxuICB0cnkge1xyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL2F1dGgvc2lnbnVwYCwge1xyXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IHBhc3N3b3JkLCBlbWFpbCwgdXNlcm5hbWUgfSksXHJcbiAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICBDb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLFxyXG4gICAgICAgIEFjY2VwdDogJ2FwcGxpY2F0aW9uL2pzb24nLFxyXG4gICAgICB9LFxyXG4gICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgIH0pO1xyXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0lHTlVQX1NVQ0NFU1MsIHRva2VuOiByZXN1bHQudG9rZW4gfSk7XHJcbiAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDAwKSB7XHJcbiAgICAgIGNvbnN0IHsgZXJyb3JzIH0gPSByZXN1bHQ7XHJcbiAgICAgIGVycm9ycy5mb3JFYWNoKChlcnJvcikgPT4ge1xyXG4gICAgICBcclxuICAgICAgICBmb3JtRGlzcGF0Y2goXHJcbiAgICAgICAgICBzZXJ2ZXJWYWxpZGF0aW9uKHtcclxuICAgICAgICAgICAgc3RhdHVzOiBlcnJvcixcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NpZ251cCBmYWlsZWQnKTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TSUdOVVBfRkFJTEVELCBwYXlsb2FkOiB7IGVycm9yIH0gfSk7XHJcbiAgfVxyXG59XHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsb2dvdXQoeyBkaXNwYXRjaCwgc3RhdGUgfSkge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCB7IHRva2VuIH0gPSBzdGF0ZTtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXHJcbiAgICAgIGAvYXV0aC9sb2dvdXQ/JHtuZXcgVVJMU2VhcmNoUGFyYW1zKHtcclxuICAgICAgICB0b2tlbixcclxuICAgICAgfSl9YFxyXG4gICAgKTtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTE9HT1VUX1NUQVJURUQgfSk7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTE9HT1VUX0ZBSUxFRCwgZXJyb3IgfSk7XHJcbiAgfVxyXG59XHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjaGFuZ2VQYXNzd29yZCh7IGRpc3BhdGNoLCBzdGF0ZSB9KSB7XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfU1RBUlRFRCB9KTtcclxuICB0cnkge1xyXG4gICAgY29uc3QgeyBjb25maXJtLCBwYXNzd29yZCwgdG9rZW4sIGVtYWlsb3J1c2VybmFtZSwgY3VycmVudCB9ID0gc3RhdGU7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxyXG4gICAgICBgL2F1dGgvY2hhbmdlcGFzc2AsXHJcbiAgICAgIHtcclxuICAgICAgICBtZXRob2Q6ICdwdXQnLFxyXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgIGNvbmZpcm0sXHJcbiAgICAgICAgICBwYXNzd29yZCxcclxuICAgICAgICAgIGN1cnJlbnQsXHJcbiAgICAgICAgICB0b2tlbixcclxuICAgICAgICAgIGVtYWlsb3J1c2VybmFtZSxcclxuICAgICAgICB9KSxcclxuICAgICAgfVxyXG4gICAgKTtcclxuXHJcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgZGlzcGF0Y2goe1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLkNIQU5HRV9QQVNTV09SRF9TVUNDRVNTLFxyXG4gICAgICAgIHRva2VuOiByZXN1bHQudG9rZW4sXHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDQwMCkge1xyXG4gICAgICBjb25zdCB7IGVycm9ycyB9ID0gcmVzdWx0O1xyXG4gICAgICBlcnJvcnMuZm9yRWFjaCgoZXJyb3IpID0+IHtcclxuICAgICAgICBkaXNwYXRjaChcclxuICAgICAgICAgIHNlcnZlclZhbGlkYXRpb24oe1xyXG4gICAgICAgICAgICBzdGF0dXM6IGVycm9yLFxyXG4gICAgICAgICAgfSlcclxuICAgICAgICApO1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA1MDApIHtcclxuICAgICAgY29uc3QgeyBlcnJvciB9ID0gcmVzdWx0O1xyXG5cclxuICAgICAgZGlzcGF0Y2goe1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLkNIQU5HRV9QQVNTV09SRF9GQUlMRUQsXHJcbiAgICAgICAgZXJyb3IsXHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDaGFuZ2luZyBwYXNzd29yZCBmYWlsZWQnKTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgZGlzcGF0Y2goe1xyXG4gICAgICB0eXBlOiBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfRkFJTEVELFxyXG4gICAgICBwYXlsb2FkOiB7IGVycm9yIH0sXHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmb3Jnb3RQYXNzd29yZCh7IGRpc3BhdGNoLCBzdGF0ZSwgZm9ybURpc3BhdGNoIH0pIHtcclxuICB0cnkge1xyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5SRVFVRVNUX1BBU1NfQ0hBTkdFX1NUQVJURUQgfSk7XHJcbiAgICBjb25zdCB7IGVtYWlsIH0gPSBzdGF0ZTtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXHJcbiAgICAgIGAvYXV0aC9yZXF1ZXN0cGFzc2NoYW5nZWAsXHJcbiAgICAgIHtcclxuICAgICAgICBtZXRob2Q6ICdwb3N0JyxcclxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IGVtYWlsIH0pLFxyXG4gICAgICB9XHJcbiAgICApO1xyXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgIGRpc3BhdGNoKHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfU1VDQ0VTUyxcclxuICAgICAgICB0b2tlbjogcmVzdWx0LnRva2VuLFxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MDApIHtcclxuICAgICAgY29uc3QgeyBlcnJvcnMgfSA9IHJlc3VsdDtcclxuICAgICAgZXJyb3JzLmZvckVhY2goKGVycm9yKSA9PiB7XHJcbiAgICAgICAgZm9ybURpc3BhdGNoKFxyXG4gICAgICAgICAgc2VydmVyVmFsaWRhdGlvbih7XHJcbiAgICAgICAgICAgIHN0YXR1czogZXJyb3IsXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDUwMCkge1xyXG4gICAgICBjb25zdCB7IGVycm9yIH0gPSByZXN1bHQ7XHJcblxyXG4gICAgICBkaXNwYXRjaCh7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX0ZBSUxFRCxcclxuICAgICAgICBlcnJvcixcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NoYW5naW5nIHBhc3N3b3JkIGZhaWxlZCcpO1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBkaXNwYXRjaCh7XHJcbiAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlJFUVVFU1RfUEFTU19DSEFOR0VfRkFJTEVELFxyXG4gICAgICBwYXlsb2FkOiB7IGVycm9yOiBlcnIgfSxcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFRva2VuRnJvbVVybCh7IHRva2VuIH0pIHtcclxuICByZXR1cm4ge1xyXG4gICAgdHlwZTogYWN0aW9uVHlwZXMuR09UX1RPS0VOX0ZST01fVVJMLFxyXG4gICAgdG9rZW4sXHJcbiAgfTtcclxufVxyXG4iXSwibmFtZXMiOlsiRU1BSUxfRk9STUFUX1ZBTElEQVRJT04iLCJQQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTiIsIlVTRVJOQU1FX0ZPUk1BVF9WQUxJREFUSU9OIiwiVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT04iLCJFTVBUWV9TVFJJTkdfVkFMSURBVElPTiIsIlBBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OIiwiSU5WQUxJRF9DUkVERU5USUFMUyIsIlVTRVJOQU1FX1RBS0VOIiwiUkVHSVNURVJFRF9FTUFJTCIsIkVNQUlMX05PVF9SRUdJU1RFUkVEIiwiVVNFUk5BTUVfTk9UX1JFR0lTVEVSRUQiLCJJTlZBTElEX1BBU1NXT1JEIiwiSU5WQUxJRF9FTUFJTCIsIklOVkFMSURfVVNFUk5BTUUiLCJJTlZBTElEX0VNUFRZX1NUUklORyIsIklOVkFMSURfVVNFUk5BTUVfT1JfRU1BSUwiLCJQQVNTV09SRFNfRE9fTk9UX01BVENIIiwicGFzc3dvcmRSZWdleCIsImVtYWlsUmVnZXgiLCJ1c2VybmFtZVJlZ2V4IiwidmFsaWRhdGVFbWFpbENvbnN0cmFpbnQiLCJlbWFpbCIsImVtYWlsQ29uc3RyYWludCIsIlJlZ0V4cCIsInRlc3QiLCJ2YWxpZGF0aW9uVHlwZSIsInZhbGlkYXRpb25UeXBlcyIsInZhbGlkYXRpb25TdGF0ZSIsIlZBTElEIiwibWVzc2FnZSIsIklOVkFMSUQiLCJ2YWxpZGF0aW9uTWVzc2FnZXMiLCJpc0NsaWVudFZhbGlkYXRpb25UeXBlIiwidmFsaWRhdGVQYXNzd29yZENvbnN0cmFpbnQiLCJwYXNzd29yZCIsInBhc3N3b3JkQ29uc3RyYWludCIsInZhbGlkYXRlVXNlck5hbWVDb25zdHJhaW50IiwidXNlcm5hbWUiLCJ1c2VybmFtZUNvbnN0cmFpbnQiLCJ2YWxpZGF0ZUVtYWlsT3JVc2VybmFtZSIsInZhbHVlIiwidmFsaWRhdGVFbXB0eVN0cmluZyIsImxlbmd0aCIsInZhbGlkYXRlUGFzc3dvcmRNYXRjaCIsInN0YXRlIiwiY29uZmlybSIsImF1dGgiLCJjcmVkZW50aWFsSW52YWxpZCIsInVzZXJuYW1lSXNUYWtlbiIsImVtYWlsSXNSZWdpc3RlcmVkIiwidXNlcm5hbWVJbnZhbGlkIiwicGFzc3dvcmRJbnZhbGlkIiwiZW1haWxJbnZhbGlkIiwiZW1haWxJc05vdFJlZ2lzdGVyZWQiLCJlbXB0eVN0cmluZ05vdFZhbGlkIiwiZW1haWxvcnVzZXJuYW1lTm90VmFsaWQiLCJ1c2VybmFtZUlzTm90UmVnaXN0ZXJlZCIsInBhc3N3b3JkRG9Ob3RNYXRjaCIsInRva2VuRXhwaXJlZCIsInNlcnZlclZhbGlkYXRpb25SYW5nZSIsInN0YXR1cyIsImNsaWVudFZhbGlkYXRpb24iLCJ2YWxpZGF0aW9uIiwiY29uc3RWYWxUeXBlcyIsInZhbGlkYXRpb25zIiwidHlwZSIsImFjdGlvblR5cGVzIiwiQ0xJRU5UX1ZBTElEQVRJT04iLCJyZXNldElucHV0VmFsaWRhdGlvblN0YXRlIiwiUkVTRVRfVkFMSURBVElPTl9TVEFURSIsInNlcnZlclZhbGlkYXRpb24iLCJodHRwU3RhdHVzIiwiU0VSVkVSX1ZBTElEQVRJT04iLCJ2YWxpZGF0aW9uU3RhdGVzIiwiaW1nIiwiSWNvblN0YXRlIiwib3BlbiIsIm9wZW5JY29uIiwiY2xvc2VJY29uIiwiRXllSWNvbiIsIm9uQ2xpY2siLCJzZXRTdGF0ZSIsInVzZVN0YXRlIiwidG9nZ2xlIiwicHJldiIsImRpc3BsYXkiLCJhbGlnbkl0ZW1zIiwianVzdGlmeUNvbnRlbnQiLCJtYXJnaW4iLCJWYWxpZGl0eUljb24iLCJ2YWxpZCIsInN0YXRlQ29sb3IiLCJJTkFDVElWRSIsImZsZXgiLCJjb2xvciIsImxpbmVIZWlnaHQiLCJ3aWR0aCIsInRleHRBbGlnbiIsInN0eWxlIiwiaW5wdXQiLCJib3JkZXIiLCJwYWRkaW5nIiwiYm9yZGVyUmFkaXVzIiwicm9vdCIsImZsZXhEaXJlY3Rpb24iLCJiYWNrZ3JvdW5kQ29sb3IiLCJtYXJnaW5Cb3R0b20iLCJpbnB1dENvbnRhaW5lciIsInBhZGRpbmdMZWZ0IiwiSW5wdXQiLCJwbGFjZWhvbGRlciIsIm5hbWUiLCJvbkNoYW5nZSIsImlkIiwiZGlzcGF0Y2giLCJ1c2VGb3JtQ29udGV4dCIsImlucHV0VmFsaWRhdGlvbiIsInNldElucHV0VmFsaWRhdGlvbiIsInVuZGVmaW5lZCIsImlucHV0VHlwZSIsInNldElucHV0VHlwZSIsImJvcmRlckNvbG9yIiwic2V0Qm9yZGVyQ29sb3IiLCJ1c2VFZmZlY3QiLCJoYW5kbGVGb2N1cyIsImZvckVhY2giLCJ2YWxpZGF0aW9uTmFtZSIsImFjdGlvbnMiLCJoYW5kbGVCbHVyIiwidG9nZ2xlRXllIiwibWFwIiwiQnV0dG9uIiwidGl0bGUiLCJkaXNhYmxlZCIsInRoZW1lIiwidXNlVGhlbWVDb250ZXh0IiwiRm9ybSIsImNoaWxkcmVuIiwiZm9ybVRpdGxlIiwiZXJyb3IiLCJ2YWx1ZUNoYW5nZWQiLCJwcm9wTmFtZSIsIlZBTFVFX0NIQU5HRUQiLCJwYXlsb2FkIiwibG9naW4iLCJmb3JtRGlzcGF0Y2giLCJlbWFpbG9ydXNlcm5hbWUiLCJMT0dJTl9TVEFSVEVEIiwicmVzcG9uc2UiLCJmZXRjaCIsImhlYWRlcnMiLCJBdXRob3JpemF0aW9uIiwiYnRvYSIsIm1ldGhvZCIsInJlc3VsdCIsImpzb24iLCJMT0dJTl9TVUNDRVNTIiwidG9rZW4iLCJlcnJvcnMiLCJFcnJvciIsIkxPR0lOX0ZBSUxFRCIsInNpZ251cCIsIlNJR05VUF9TVEFSVEVEIiwiYm9keSIsIkpTT04iLCJzdHJpbmdpZnkiLCJDb250ZW50VHlwZSIsIkFjY2VwdCIsIlNJR05VUF9TVUNDRVNTIiwiU0lHTlVQX0ZBSUxFRCIsImNoYW5nZVBhc3N3b3JkIiwiQ0hBTkdFX1BBU1NXT1JEX1NUQVJURUQiLCJjdXJyZW50IiwiQ0hBTkdFX1BBU1NXT1JEX1NVQ0NFU1MiLCJDSEFOR0VfUEFTU1dPUkRfRkFJTEVEIiwiZm9yZ290UGFzc3dvcmQiLCJSRVFVRVNUX1BBU1NfQ0hBTkdFX1NU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
