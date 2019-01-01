import { v as validationStates, a as actionTypes, b as v, h, u as useAppContext, p, s as styleInject, c as useThemeContext, d as actionTypes$1 } from './index-e8d41a01.js';

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
  auth
}) {
  const {
    password,
    confirm
  } = auth.state;

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
  auth
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
        auth
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
    form,
    auth
  } = useAppContext();
  const {
    state,
    dispatch
  } = form;
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
          state,
          auth
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

var css_248z = ".btn {\n  padding: 6px 16px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  border: none;\n  -webkit-box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);\n          box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);\n  min-width: 64px;\n  font-weight: 500;\n  font-size: 0.875rem;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n}";
styleInject(css_248z);

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
  return h("div", null, h("legend", null, formTitle, ":"), children, error && h("div", {
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
  debugger;

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
    debugger;
    const result = await response.json();
    debugger;

    if (response.status === 200) {
      dispatch({
        type: actionTypes$1.LOGIN_SUCCESS,
        token: result.token
      });
    } else if (response.status === 400) {
      debugger;
      const {
        errors
      } = result;
      debugger;
      errors.forEach(error => {
        formDispatch(serverValidation({
          status: error
        }));
      });
    } else {
      throw new Error('Login failed');
    }
  } catch (error) {
    debugger;
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
  state,
  formDispatch
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9ucy0wNDE5YzUxZC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY2xpZW50L2Zvcm0vdmFsaWRhdGlvblR5cGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vdmFsaWRhdGlvbk1lc3NhZ2VzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vdmFsaWRhdGlvblJlZ2V4LmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vY29uc3RyYWludFZhbGlkYXRvcnMuanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS9odHRwLXN0YXR1cy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL2FjdGlvbnMuanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS9pY29ucy9vcGVuRXllLnBuZyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL2ljb25zL2Nsb3NlRXllLnBuZyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL0V5ZUljb24uanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS9JbnB1dC5qcyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL0J1dHRvbi5qcyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL0Zvcm0uanMiLCIuLi8uLi8uLi9jbGllbnQvYXV0aC9hY3Rpb25zLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IHtcbiAgLy9jb25zdHJhaW50XG4gIEVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OOiAnRU1BSUxfRk9STUFUX1ZBTElEQVRJT04nLFxuICBQQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTjogJ1BBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OJyxcbiAgVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT046ICdVU0VSTkFNRV9GT1JNQVRfVkFMSURBVElPTicsXG4gIFVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OOiAnVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT04nLFxuICBFTVBUWV9TVFJJTkdfVkFMSURBVElPTjogJ0VNUFRZX1NUUklOR19WQUxJREFUSU9OJyxcbiAgUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT046ICdQQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTicsXG4gIC8vYXV0aFxuICBJTlZBTElEX0NSRURFTlRJQUxTOiAnSU5WQUxJRF9DUkVERU5USUFMUycsXG4gIFVTRVJOQU1FX1RBS0VOOiAnVVNFUk5BTUVfVEFLRU4nLFxuICBSRUdJU1RFUkVEX0VNQUlMOiAnUkVHSVNURVJFRF9FTUFJTCcsXG4gIEVNQUlMX05PVF9SRUdJU1RFUkVEOiAnRU1BSUxfTk9UX1JFR0lTVEVSRUQnLFxuICBVU0VSTkFNRV9OT1RfUkVHSVNURVJFRDonVVNFUk5BTUVfTk9UX1JFR0lTVEVSRUQnXG59O1xuIiwiZXhwb3J0IGRlZmF1bHQge1xuICBJTlZBTElEX1BBU1NXT1JEOlxuICAgICdhdCBsZWFzdCA4IGNoYXJhY3RlcnMsIG11c3QgY29udGFpbiBhdCBsZWFzdCAxIHVwcGVyY2FzZSBsZXR0ZXIsIDEgbG93ZXJjYXNlIGxldHRlciwgQ2FuIGNvbnRhaW4gc3BlY2lhbCBjaGFyYWN0ZXJzJyxcbiAgSU5WQUxJRF9FTUFJTDogJ2VtYWlsIGZvcm1hdCBpcyBub3QgdmFsaWQnLFxuICBFTUFJTF9OT1RfUkVHSVNURVJFRDogJ2VtYWlsIGlzIG5vdCByZWdpc3RlcmVkJyxcbiAgVVNFUk5BTUVfTk9UX1JFR0lTVEVSRUQ6ICd1c2VybmFtZSBpcyBub3QgcmVnaXN0ZXJlZCcsXG4gIElOVkFMSURfVVNFUk5BTUU6XG4gICAgJ29ubHkgTGV0dGVycyBhLXogb3IgQS1aIGFuZCB0aGUgU3ltYm9scyAtIGFuZCBfIGFyZSBhbGxvd2VkJyxcbiAgSU5WQUxJRF9FTVBUWV9TVFJJTkc6ICdlbXB0eSBzdHJpbmcgaXMgbm90IGFsbG93ZWQnLFxuICBJTlZBTElEX1VTRVJOQU1FX09SX0VNQUlMOiAnZW1haWwgb3IgdXNlcm5hbWUgaXMgbm90IHZhbGlkJyxcbiAgSU5WQUxJRF9DUkVERU5USUFMUzogJ2ludmFsaWQgY3JlZGVudGlhbHMgcHJvdmlkZWQnLFxuICBVU0VSTkFNRV9UQUtFTjogJ3VzZXJuYW1lIGlzIGFscmVhZHkgdGFrZW4nLFxuICBSRUdJU1RFUkVEX0VNQUlMOiAnZW1haWwgaXMgYWxyZWFkeSByZWdpc3RlcmVkJyxcbiAgUEFTU1dPUkRTX0RPX05PVF9NQVRDSDogJ3Bhc3N3b3JkcyBkbyBub3QgbWF0Y2gnXG59O1xuIiwiZXhwb3J0IGNvbnN0IHBhc3N3b3JkUmVnZXggPSAvXig/PS4qXFxkKSg/PS4qW2Etel0pKD89LipbQS1aXSkoPz0uKlthLXpBLVpdKS57OCx9JC9nO1xuXG5leHBvcnQgY29uc3QgZW1haWxSZWdleCA9IC9bYS16MC05ISMkJSYnKisvPT9eX2B7fH1+LV0rKD86XFwuW2EtejAtOSEjJCUmJyorLz0/Xl9ge3x9fi1dKykqQCg/OlthLXowLTldKD86W2EtejAtOS1dKlthLXowLTldKT9cXC4pK1thLXowLTldKD86W2EtejAtOS1dKlthLXowLTldKT8vZztcblxuZXhwb3J0IGNvbnN0IHVzZXJuYW1lUmVnZXggPSAvW2EtekEtWl0rWy1fXSpbYS16QS1aXSsvZztcbiIsImltcG9ydCB2YWxpZGF0aW9uU3RhdGUgZnJvbSAnLi92YWxpZGF0aW9uU3RhdGVzJztcbmltcG9ydCB2YWxpZGF0aW9uVHlwZXMgZnJvbSAnLi92YWxpZGF0aW9uVHlwZXMnO1xuaW1wb3J0IHZhbGlkYXRpb25NZXNzYWdlcyBmcm9tICcuL3ZhbGlkYXRpb25NZXNzYWdlcyc7XG5pbXBvcnQgeyBlbWFpbFJlZ2V4LCBwYXNzd29yZFJlZ2V4LCB1c2VybmFtZVJlZ2V4IH0gZnJvbSAnLi92YWxpZGF0aW9uUmVnZXgnO1xuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlRW1haWxDb25zdHJhaW50KHsgZW1haWwgfSkge1xuICBjb25zdCBlbWFpbENvbnN0cmFpbnQgPSBuZXcgUmVnRXhwKGVtYWlsUmVnZXgpO1xuXG4gIGlmIChlbWFpbENvbnN0cmFpbnQudGVzdChlbWFpbCkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5FTUFJTF9GT1JNQVRfVkFMSURBVElPTixcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLlZBTElELFxuICAgICAgbWVzc2FnZTogJycsXG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5FTUFJTF9GT1JNQVRfVkFMSURBVElPTixcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOVkFMSUQsXG4gICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9FTUFJTCxcbiAgICB9O1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0NsaWVudFZhbGlkYXRpb25UeXBlKHsgdmFsaWRhdGlvblR5cGUgfSkge1xuICBzd2l0Y2ggKHZhbGlkYXRpb25UeXBlKSB7XG4gICAgY2FzZSB2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT046XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICBjYXNlIHZhbGlkYXRpb25UeXBlcy5FTUFJTF9GT1JNQVRfVkFMSURBVElPTjpcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIGNhc2UgdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OOlxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgY2FzZSB2YWxpZGF0aW9uVHlwZXMuRU1QVFlfU1RSSU5HX1ZBTElEQVRJT046XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICBjYXNlIHZhbGlkYXRpb25UeXBlcy5QQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTjpcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIGNhc2UgdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX0ZPUk1BVF9WQUxJREFUSU9OOlxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlUGFzc3dvcmRDb25zdHJhaW50KHsgcGFzc3dvcmQgfSkge1xuICBjb25zdCBwYXNzd29yZENvbnN0cmFpbnQgPSBuZXcgUmVnRXhwKHBhc3N3b3JkUmVnZXgpO1xuICBpZiAocGFzc3dvcmRDb25zdHJhaW50LnRlc3QocGFzc3dvcmQpKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT04sXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5WQUxJRCxcbiAgICAgIG1lc3NhZ2U6ICcnLFxuICAgIH07XG4gIH1cbiAgaWYgKCFwYXNzd29yZENvbnN0cmFpbnQudGVzdChwYXNzd29yZCkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5QQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTixcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOVkFMSUQsXG4gICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9QQVNTV09SRCxcbiAgICB9O1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZVVzZXJOYW1lQ29uc3RyYWludCh7IHVzZXJuYW1lIH0pIHtcbiAgY29uc3QgdXNlcm5hbWVDb25zdHJhaW50ID0gbmV3IFJlZ0V4cCh1c2VybmFtZVJlZ2V4KTtcblxuICBpZiAodXNlcm5hbWVDb25zdHJhaW50LnRlc3QodXNlcm5hbWUpKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT04sXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5WQUxJRCxcbiAgICAgIG1lc3NhZ2U6ICcnLFxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT04sXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTlZBTElELFxuICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfVVNFUk5BTUUsXG4gICAgfTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVFbWFpbE9yVXNlcm5hbWUoeyB2YWx1ZSB9KSB7XG4gIGNvbnN0IGVtYWlsQ29uc3RyYWludCA9IG5ldyBSZWdFeHAoZW1haWxSZWdleCk7XG4gIGNvbnN0IHVzZXJuYW1lQ29uc3RyYWludCA9IG5ldyBSZWdFeHAodXNlcm5hbWVSZWdleCk7XG5cbiAgaWYgKGVtYWlsQ29uc3RyYWludC50ZXN0KHZhbHVlKSkge1xuICAgIHJldHVybiB7XG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OLFxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuVkFMSUQsXG4gICAgICBtZXNzYWdlOiAnJyxcbiAgICB9O1xuICB9IGVsc2UgaWYgKHVzZXJuYW1lQ29uc3RyYWludC50ZXN0KHZhbHVlKSkge1xuICAgIHJldHVybiB7XG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OLFxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuVkFMSUQsXG4gICAgICBtZXNzYWdlOiAnJyxcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB7XG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OLFxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5WQUxJRCxcbiAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX1VTRVJOQU1FX09SX0VNQUlMLFxuICAgIH07XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlRW1wdHlTdHJpbmcoeyB2YWx1ZSB9KSB7XG4gIGlmICh2YWx1ZS5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4ge1xuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5FTVBUWV9TVFJJTkdfVkFMSURBVElPTixcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOVkFMSUQsXG4gICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9FTVBUWV9TVFJJTkcsXG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5FTVBUWV9TVFJJTkdfVkFMSURBVElPTixcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLlZBTElELFxuICAgICAgbWVzc2FnZTogJycsXG4gICAgfTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVQYXNzd29yZE1hdGNoKHsgYXV0aCB9KSB7XG5cbiAgY29uc3QgeyBwYXNzd29yZCwgY29uZmlybSB9ID0gYXV0aC5zdGF0ZTtcblxuICBpZiAocGFzc3dvcmQgPT09ICcnIHx8IHBhc3N3b3JkICE9PSBjb25maXJtKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOVkFMSUQsXG4gICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuUEFTU1dPUkRTX0RPX05PVF9NQVRDSCxcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT04sXG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuVkFMSUQsXG4gICAgICBtZXNzYWdlOiAnJyxcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT04sXG4gICAgfTtcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQge1xuICAvL2xvZ2luXG4gIGNyZWRlbnRpYWxJbnZhbGlkOiAnNDAxJyxcbiAgLy9zaWdudXBcbiAgdXNlcm5hbWVJc1Rha2VuOiAnNDAyJyxcbiAgZW1haWxJc1JlZ2lzdGVyZWQ6ICc0MDMnLFxuICB1c2VybmFtZUludmFsaWQ6ICc0MDUnLFxuICBwYXNzd29yZEludmFsaWQ6ICc0MDYnLCAvL2NoYW5nZSBwYXNzd29yZFxuICBlbWFpbEludmFsaWQ6ICc0MDcnLFxuICAvL2xvZ2luXG4gIGVtYWlsSXNOb3RSZWdpc3RlcmVkOiAnNDA4JyxcbiAgZW1wdHlTdHJpbmdOb3RWYWxpZDogJzQwOScsXG4gIGVtYWlsb3J1c2VybmFtZU5vdFZhbGlkOic0MTAnLFxuICB1c2VybmFtZUlzTm90UmVnaXN0ZXJlZDonNDExJyxcbi8vY2hhbmdlIHBhc3N3b3JkXG4gIHBhc3N3b3JkRG9Ob3RNYXRjaDonNDEyJyxcbiAgdG9rZW5FeHBpcmVkOic0MTMnLFxuICBzZXJ2ZXJWYWxpZGF0aW9uUmFuZ2U6IHN0YXR1cyA9PiB7XG4gICAgaWYgKHN0YXR1cyA+PSA0MDAgJiYgc3RhdHVzIDw9IDQxMCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufTtcbiIsIlxuaW1wb3J0ICogYXMgdmFsaWRhdGlvbnMgZnJvbSAnLi9jb25zdHJhaW50VmFsaWRhdG9ycyc7XG5pbXBvcnQgY29uc3RWYWxUeXBlcyBmcm9tICcuL3ZhbGlkYXRpb25UeXBlcyc7XG5pbXBvcnQgdmFsaWRhdGlvblN0YXRlcyBmcm9tICcuL3ZhbGlkYXRpb25TdGF0ZXMnO1xuaW1wb3J0IHZhbGlkYXRpb25UeXBlcyBmcm9tICcuL3ZhbGlkYXRpb25UeXBlcyc7XG5pbXBvcnQgYWN0aW9uVHlwZXMgZnJvbSAnLi9hY3Rpb25UeXBlcyc7XG5pbXBvcnQgaHR0cFN0YXR1cyBmcm9tICcuL2h0dHAtc3RhdHVzJztcbmltcG9ydCB2YWxpZGF0aW9uTWVzc2FnZXMgZnJvbSAnLi92YWxpZGF0aW9uTWVzc2FnZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gY2xpZW50VmFsaWRhdGlvbih7IHZhbGlkYXRpb25UeXBlLCB2YWx1ZSwgYXV0aCB9KSB7XG4gIGxldCB2YWxpZGF0aW9uID0gbnVsbDtcbiAgc3dpdGNoICh2YWxpZGF0aW9uVHlwZSkge1xuICAgIGNhc2UgY29uc3RWYWxUeXBlcy5FTUFJTF9GT1JNQVRfVkFMSURBVElPTjpcbiAgICAgIHZhbGlkYXRpb24gPSB2YWxpZGF0aW9ucy52YWxpZGF0ZUVtYWlsQ29uc3RyYWludCh7XG4gICAgICAgIGVtYWlsOiB2YWx1ZSxcbiAgICAgIH0pO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBjb25zdFZhbFR5cGVzLlVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OOlxuICAgICAgdmFsaWRhdGlvbiA9IHZhbGlkYXRpb25zLnZhbGlkYXRlRW1haWxPclVzZXJuYW1lKHtcbiAgICAgICAgdmFsdWUsXG4gICAgICB9KTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgY29uc3RWYWxUeXBlcy5QQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTjpcbiAgICAgIHZhbGlkYXRpb24gPSB2YWxpZGF0aW9ucy52YWxpZGF0ZVBhc3N3b3JkQ29uc3RyYWludCh7XG4gICAgICAgIHBhc3N3b3JkOiB2YWx1ZSxcbiAgICAgIH0pO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBjb25zdFZhbFR5cGVzLlVTRVJOQU1FX0ZPUk1BVF9WQUxJREFUSU9OOlxuICAgICAgdmFsaWRhdGlvbiA9IHZhbGlkYXRpb25zLnZhbGlkYXRlVXNlck5hbWVDb25zdHJhaW50KHtcbiAgICAgICAgdXNlcm5hbWU6IHZhbHVlLFxuICAgICAgfSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIGNvbnN0VmFsVHlwZXMuRU1QVFlfU1RSSU5HX1ZBTElEQVRJT046XG4gICAgICB2YWxpZGF0aW9uID0gdmFsaWRhdGlvbnMudmFsaWRhdGVFbXB0eVN0cmluZyh7IHZhbHVlIH0pO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBjb25zdFZhbFR5cGVzLlBBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OOlxuICAgXG4gICAgICB2YWxpZGF0aW9uID0gdmFsaWRhdGlvbnMudmFsaWRhdGVQYXNzd29yZE1hdGNoKHsgYXV0aCB9KTtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICBicmVhaztcbiAgfVxuXG4gIHJldHVybiB7IHR5cGU6IGFjdGlvblR5cGVzLkNMSUVOVF9WQUxJREFUSU9OLCAuLi52YWxpZGF0aW9uIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0Rm9ybVZhbGlkYXRpb25TdGF0ZSgpIHtcbiAgcmV0dXJuIHsgdHlwZTogYWN0aW9uVHlwZXMuSU5JVF9GT1JNX1ZBTElEQVRJT05fU1RBVEUgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlc2V0SW5wdXRWYWxpZGF0aW9uU3RhdGUoeyB2YWxpZGF0aW9uVHlwZSB9KSB7XG4gIHJldHVybiB7IHR5cGU6IGFjdGlvblR5cGVzLlJFU0VUX1ZBTElEQVRJT05fU1RBVEUsIHZhbGlkYXRpb25UeXBlIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbmNJbnB1dENvdW50KCkge1xuICByZXR1cm4geyB0eXBlOiBhY3Rpb25UeXBlcy5JTkNfSU5QVVRfQ09VVE4gfTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gc2VydmVyVmFsaWRhdGlvbih7IHN0YXR1cyA9IDAgfSkge1xuICBkZWJ1Z2dlcjtcbiAgc3dpdGNoIChzdGF0dXMpIHtcbiAgICBjYXNlIGh0dHBTdGF0dXMuY3JlZGVudGlhbEludmFsaWQ6XG4gICAgICBkZWJ1Z2dlcjtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLklOVkFMSURfQ1JFREVOVElBTFMsXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX0NSRURFTlRJQUxTLFxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcbiAgICAgIH07XG4gICAgY2FzZSBodHRwU3RhdHVzLmVtYWlsSW52YWxpZDpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLkVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OLFxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9FTUFJTCxcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXG4gICAgICB9O1xuICAgIGNhc2UgaHR0cFN0YXR1cy5wYXNzd29yZEludmFsaWQ6XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5QQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTixcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfUEFTU1dPUkQsXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxuICAgICAgfTtcbiAgICBjYXNlIGh0dHBTdGF0dXMudXNlcm5hbWVJbnZhbGlkOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT04sXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX1VTRVJOQU1FLFxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcbiAgICAgIH07XG4gICAgY2FzZSBodHRwU3RhdHVzLmVtYWlsSXNSZWdpc3RlcmVkOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuUkVHSVNURVJFRF9FTUFJTCxcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLlJFR0lTVEVSRURfRU1BSUwsXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxuICAgICAgfTtcbiAgICBjYXNlIGh0dHBTdGF0dXMuZW1haWxJc05vdFJlZ2lzdGVyZWQ6XG4gICAgICBkZWJ1Z2dlcjtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLkVNQUlMX05PVF9SRUdJU1RFUkVELFxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuRU1BSUxfTk9UX1JFR0lTVEVSRUQsXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxuICAgICAgfTtcbiAgICBjYXNlIGh0dHBTdGF0dXMudXNlcm5hbWVJc1Rha2VuOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfVEFLRU4sXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5VU0VSTkFNRV9UQUtFTixcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXG4gICAgICB9O1xuICAgIGNhc2UgaHR0cFN0YXR1cy5lbXB0eVN0cmluZ05vdFZhbGlkOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuRU1QVFlfU1RSSU5HX1ZBTElEQVRJT04sXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX0VNUFRZX1NUUklORyxcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXG4gICAgICB9O1xuICAgIGNhc2UgaHR0cFN0YXR1cy5lbWFpbG9ydXNlcm5hbWVOb3RWYWxpZDpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OLFxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9VU0VSTkFNRV9PUl9FTUFJTCxcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXG4gICAgICB9O1xuICAgIGNhc2UgaHR0cFN0YXR1cy51c2VybmFtZUlzTm90UmVnaXN0ZXJlZDpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX05PVF9SRUdJU1RFUkVELFxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuVVNFUk5BTUVfTk9UX1JFR0lTVEVSRUQsXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxuICAgICAgfTtcbiAgICAgIGNhc2UgaHR0cFN0YXR1cy5wYXNzd29yZERvTm90TWF0Y2g6XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5QQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTixcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLlBBU1NXT1JEU19ET19OT1RfTUFUQ0gsXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxuICAgICAgfTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cbiIsImNvbnN0IGltZyA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFFQUFBQUJBQ0FZQUFBQ3FhWEhlQUFBQUNYQklXWE1BQUFzVEFBQUxFd0VBbXB3WUFBQUNza2xFUVZSNG5PMmF1MjRUUVJTR1A5c0swRmdpSWdMbElvVXVxUU5VVk9IU21CTGVnSFFVZ1M3UGdaSU9oS21JWWloaTNzQUlDUXBTSktFRUNTc0dna0tMSlV1UktXWVdITE9MZCtmTTd0cngrYVNSSld0bi92L1l1N016Wnc0b2lxSW9pcUlvaWpLT0ZETFFPQU5jQWE0RFM4QkY0QUl3WlQ4QmZnSkg5dk1Ic0FPOEJUNEFuUXc4ZXVjU3NBYThBZHBBMTdHMTdSaHJkc3locGdEY0JtcVlmODAxNktqV3NXUGZJcHM3TnhFM2dGMzhCeDNWZHExbTdsd0dYcEZkNFAzdEpUQ2ZkcEJSUEVUMmZQdHFiV0ExNVZoUGNCWjQ3amtJSDYxcXZhWEtEUEEreHlBSHRYZkFkRnJCendGTm9jRW1zQTVVZ0FXZ2JOdUMvVzdkZzhZWDY5VXJrOEJIZ2FrRDRENVFpcUZWc3RlMkJIcjd3SGxSeEQyY3d5eEdYTTFzWS83bHBKU0J1a0MzWWIyTDJSU1llQXdVQmRwRk80YXIvcVpBRzRCN0F2RnQvS3pZaXNqdWhMdXV3cFBBZDBmUkE5eHUreWpLdU04SjMyd3NpYWs2Q25ZeGs1aHZWZ1IrbmlVVnV5WVFheEp2dGs5S0Nka3I4bXJZb0ZFVDFDT0IwVHB3TE9nZnhUSHdXdEEvZGt5enlMYXpGWUhKUVZRRXZqcVlsZXdKd3U2QUI4Q0V3T1FuUWQ5QmZCYjBuY0RFTnBCRDNIL2xMbjVuLzM3S1FtK0gvUU5LRmltbmdyQWY0S2x3ekgrZU00L01DdnMvaVNzeTFwTmdDNU5xa3BoTWl6dUN2alhnYTl5THgyWWg5RCtxQXJHUlh3cURiRFBVNGhSc2hrQytIZmJ4bXMxdE94d3d5Z21SRndMdFAwaFRZblZHUENVRzVobmFGNWhwWVNheHVFblJGV1JKMFQwOEprVUQ1akFwWjFkVFhjeHJiQU96Vmxqa2IxcDgwWDYzd1pDbXhRTm1NSWNQRW9OcHRsUVBSZ0xHK21pc2wxV0c0M0QwRnhrZmp2WXlqOWszNUJWOGpSeVB4M3RaSnZzQ2llVk1Ja3RBQVZPK3NrVjZKVEpid0UyR3NFU21uNkJJcW9HOFNLcEJpa1ZTV1pYSkxSRmVKamRscnpraXZFeHVoeEV0azFNVVJWRVVSVkVVWmJqNURja01GZVFockZqOUFBQUFBRWxGVGtTdVFtQ0NcIjtcbiAgZXhwb3J0IGRlZmF1bHQgaW1nOyIsImNvbnN0IGltZyA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFFQUFBQUJBQ0FZQUFBQ3FhWEhlQUFBQUNYQklXWE1BQUFzVEFBQUxFd0VBbXB3WUFBQURzMGxFUVZSNG5PM2JTMmhjVlJ6SDhVOWFvOUl5bW9Jb1NtT3FMYTByTjc1d0s0SmF0SlFhRmV6Q2lOS3RpRkJjNk5LVmRDT0tDMUVySW9vS29xQ0M0RnZSalNLMWlpNUVEV2hOVWZFRmdSaU1pek9STkwwM2N4NXpaMkp5Zi9Bbk1NbWMzLy8vemJuM250ZWxWYXRXclU3VVhzeDBZOStRY3htS1pyRFFqYjh4T2R4MEJxK2xBTllsaEgxQzBjc2gzRFRNcEFhdFNTMkVXZ2czRHpPcFFhdUZZSTFER0luOHUwazhpMU9XZkRhUC9YaSt4M2UzNERKYzNJMWQzYy9PN01ZLytBVS9kMzhleDZmNEVKOWdMakxIeGxYVkUrWlY5NFFMY0RmZXJ2aE9Tc3ppZmR5TGM1b3BLMDI5SUZ5TlY0WC9hbTdSZFRHSEY3b2VzVDIzRWRWQitGTC9pNjZMSTdpcTZVSlhVaFdFWWNTTG1HaTQxbHF0RmdpenVLdmhXbXUxV2lBczREQk9hN1RhR3EwbUNCL2ozS1lLUFI5dllYdkY3MkloSE1NaFhDOWN1NXZRRWNZR3UvRXdwaVBhV1NtK3g5WSsxZzNPeHRkZGcybnBFSDdDRkVZanZEYmlEdnhRMDFaTUhNVllhcEYxMml5TXlKWWFwRUk0a09IYndTc1ZiY1hHZXpnOXcvY2tQVkZqa0FKaEhyZGtlRy9BUXpYK01mRmNodWNKMnQvRFlGQVFTbnJDalJtZTREejhHV0V3Q0FnZCtmZUVZOExrSzFtSEUwd0dBZUhPaEh5V3g1T3BacGRrbURRTllhT3lSK1NsS1dhdlpacE1ZMXRGZS8yQzhFaG1YZ3Q0SnRaa3U3THA3TFUxN2ZZRHd1NkN2T2FFKzFwUFBWaGdzb0R4RmRvdWhYQlJZVzRQeEpnY0x6VHBOU0VwZ2RBcHpHMG13cU1ZUU13UU5CZkNwc0xjb2dBY0tqUzVJc1pFSG9TSnd0eWlMb0ZkaFNhM3haaDBsUXJoaG9LOG9tK0M4SHFCMFdPeEpsMmxRQ2pwbmRHUFFmSUdRb3N4aTdOU3pNUkJHQldHdGJsNUpRMkVDQnNldVdiM3A1cnBEV0dxSUovSE0vS3hGYjluR3Y2Qm5SbWVkUkFPQ0lzcU9ibjhxR0J4NVBaTTB3VjhMaXltcEtyZmE0eDdNM0w0VHlQS0xvV1hEQmZDVXhuZUoybXpzRm1abThRUjdNandMWVh3Sms3TjhLM1VPTDRyU09ZMzNLYy9UNGVZK0F4blpOUzVvcmJoMjR4a2xzYXNNRTZZRWthTVk4TGNZUnpYcU43bVNvWHdqWWIzQm80bUpKTWFPVXZ1UytNZDZiMHNXUjI4SEpITW9DRThLbTdmb1MvYWdIdUVMcjBhSUR6ZC94TGp0QlB2VmlRMGFBaDFKMVVHb2hIczBjd0JpZjhOQk1LcTdSNjhvZjhRTHF6d1c1VVFGclVEQi9HUnN1TG5oRDIrNjJwOGlvL3dEZUt3MFJndXg1WENvdWFFOERqdENHT0FVV0h5OUt0d1ZPNHJmQ0dNSUQvQVh6M2FyenZDZDZ0d3FHcGRxRDNicklXQWVnanI2bjJIRm9KNkNPdnFIYWdxQ0ZFYkkydEp5eUdzT3dDRWJyLzRHbURSK21DclZxM1dudjRGcnJjdWoyT2ZSNXNBQUFBQVNVVk9SSzVDWUlJPVwiO1xuICBleHBvcnQgZGVmYXVsdCBpbWc7IiwiaW1wb3J0IHtofSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHt1c2VTdGF0ZX0gZnJvbSAncHJlYWN0L2hvb2tzJ1xuaW1wb3J0IG9wZW5JY29uIGZyb20gJy4vaWNvbnMvb3BlbkV5ZS5wbmcnO1xuaW1wb3J0IGNsb3NlSWNvbiBmcm9tICcuL2ljb25zL2Nsb3NlRXllLnBuZyc7XG5mdW5jdGlvbiBJY29uU3RhdGUoeyBvcGVuIH0pIHtcbiAgaWYgKG9wZW4pIHtcbiAgICByZXR1cm4gPGltZyB3aWR0aD1cIjMwcHhcIiBzcmM9e29wZW5JY29ufSAvPjtcbiAgfVxuICByZXR1cm4gPGltZyB3aWR0aD1cIjMwcHhcIiBzcmM9e2Nsb3NlSWNvbn0gLz47XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEV5ZUljb24oe29uQ2xpY2t9KSB7XG4gIGNvbnN0IFtzdGF0ZSwgc2V0U3RhdGVdID0gdXNlU3RhdGUoZmFsc2UpO1xuICBmdW5jdGlvbiB0b2dnbGUoKSB7XG4gICAgb25DbGljaygpXG4gICAgc2V0U3RhdGUocHJldiA9PiAhcHJldik7XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIG9uQ2xpY2s9e3RvZ2dsZX1cbiAgICAgIHN0eWxlPXt7XG4gICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgIGp1c3RpZnlDb250ZW50OidjZW50ZXInLFxuICAgICAgICBtYXJnaW46IDFcbiAgICAgIH19XG4gICAgPlxuICAgICAgPEljb25TdGF0ZSBvcGVuPXtzdGF0ZX0gLz5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XG5pbXBvcnQgKiBhcyBhY3Rpb25zIGZyb20gJy4vYWN0aW9ucyc7XG5pbXBvcnQgdmFsaWRhdGlvblN0YXRlcyBmcm9tICcuL3ZhbGlkYXRpb25TdGF0ZXMnO1xuaW1wb3J0IHsgaXNDbGllbnRWYWxpZGF0aW9uVHlwZSB9IGZyb20gJy4vY29uc3RyYWludFZhbGlkYXRvcnMnO1xuaW1wb3J0IEV5ZUljb24gZnJvbSAnLi9FeWVJY29uJztcbmltcG9ydCB7IHVzZUFwcENvbnRleHQgfSBmcm9tICcuLi9hcHAtY29udGV4dCc7XG5mdW5jdGlvbiBWYWxpZGl0eUljb24oeyB2YWxpZCB9KSB7XG4gIGxldCBzdGF0ZUNvbG9yID0gJyM0ZmMzZjcnO1xuICBzd2l0Y2ggKHZhbGlkKSB7XG4gICAgY2FzZSB2YWxpZGF0aW9uU3RhdGVzLlZBTElEOlxuICAgICAgc3RhdGVDb2xvciA9ICdncmVlbic7XG4gICAgICBicmVhaztcbiAgICBjYXNlIHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRDpcbiAgICAgIHN0YXRlQ29sb3IgPSAncmVkJztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgdmFsaWRhdGlvblN0YXRlcy5JTkFDVElWRTpcbiAgICAgIHN0YXRlQ29sb3IgPSAnIzRmYzNmNyc7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgc3RhdGVDb2xvciA9ICcjNGZjM2Y3JztcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgc3R5bGU9e3tcbiAgICAgICAgZmxleDogMSxcbiAgICAgICAgY29sb3I6IHN0YXRlQ29sb3IsXG4gICAgICAgIGxpbmVIZWlnaHQ6IDIsXG4gICAgICAgIHdpZHRoOiAyMCxcbiAgICAgICAgdGV4dEFsaWduOiAnY2VudGVyJyxcbiAgICAgIH19XG4gICAgPlxuICAgICAge3ZhbGlkID8gJ+KckycgOiAn4piTJ31cbiAgICA8L2Rpdj5cbiAgKTtcbn1cblxuY29uc3Qgc3R5bGUgPSB7XG4gIGlucHV0OiB7XG4gICAgYm9yZGVyOiAnMXB4IHNvbGlkJyxcbiAgICBwYWRkaW5nOiA4LFxuICAgIGZsZXg6IDEwLFxuICAgIGJvcmRlclJhZGl1czogMixcbiAgfSxcbiAgcm9vdDoge1xuICAgIGJvcmRlclJhZGl1czogMixcblxuICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6ICd3aGl0ZScsXG4gICAgYm9yZGVyOiAnMXB4IHNvbGlkIHdoaXRlJyxcbiAgICBtYXJnaW5Cb3R0b206IDEsXG4gIH0sXG4gIGlucHV0Q29udGFpbmVyOiB7XG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIGZsZXg6IDEsXG4gIH0sXG4gIG1lc3NhZ2U6IHtcbiAgICBjb2xvcjogJ3JlZCcsXG4gICAgcGFkZGluZ0xlZnQ6IDMsXG4gIH0sXG59O1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSW5wdXQoe1xuICBwbGFjZWhvbGRlcixcbiAgdHlwZSxcbiAgbmFtZSxcbiAgb25DaGFuZ2UsXG4gIHZhbHVlID0gJycsXG4gIHZhbGlkYXRpb25UeXBlcyA9IFtdLFxuICBpZCxcbn0pIHtcbiAgY29uc3QgeyBmb3JtLCBhdXRoIH0gPSB1c2VBcHBDb250ZXh0KCk7XG4gIGNvbnN0IHsgc3RhdGUsIGRpc3BhdGNoIH0gPSBmb3JtO1xuXG4gIGNvbnN0IFtpbnB1dFZhbGlkYXRpb24sIHNldElucHV0VmFsaWRhdGlvbl0gPSB1c2VTdGF0ZSh7XG4gICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOQUNUSVZFLFxuICAgIG1lc3NhZ2U6ICcnLFxuICAgIHZhbGlkYXRpb25UeXBlOiB1bmRlZmluZWQsXG4gIH0pO1xuXG4gIGNvbnN0IFtpbnB1dFR5cGUsIHNldElucHV0VHlwZV0gPSB1c2VTdGF0ZSh0eXBlKTtcblxuICBjb25zdCBbYm9yZGVyQ29sb3IsIHNldEJvcmRlckNvbG9yXSA9IHVzZVN0YXRlKCcnKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChcbiAgICAgIGlucHV0VmFsaWRhdGlvbiAmJlxuICAgICAgaW5wdXRWYWxpZGF0aW9uLnZhbGlkYXRpb25TdGF0ZSA9PT0gdmFsaWRhdGlvblN0YXRlcy5WQUxJRFxuICAgICkge1xuICAgICAgc2V0Qm9yZGVyQ29sb3IoJ2dyZWVuJyk7XG4gICAgfVxuICAgIGlmIChcbiAgICAgIGlucHV0VmFsaWRhdGlvbiAmJlxuICAgICAgaW5wdXRWYWxpZGF0aW9uLnZhbGlkYXRpb25TdGF0ZSA9PT0gdmFsaWRhdGlvblN0YXRlcy5JTlZBTElEXG4gICAgKSB7XG4gICAgICBzZXRCb3JkZXJDb2xvcigncmVkJyk7XG4gICAgfVxuICAgIGlmIChcbiAgICAgIGlucHV0VmFsaWRhdGlvbiAmJlxuICAgICAgaW5wdXRWYWxpZGF0aW9uLnZhbGlkYXRpb25TdGF0ZSA9PT0gdmFsaWRhdGlvblN0YXRlcy5JTkFDVElWRVxuICAgICkge1xuICAgICAgc2V0Qm9yZGVyQ29sb3IoJyM0ZmMzZjcnKTtcbiAgICB9XG4gIH0sIFtpbnB1dFZhbGlkYXRpb25dKTtcbiAgZnVuY3Rpb24gaGFuZGxlRm9jdXMoKSB7XG4gICAgdmFsaWRhdGlvblR5cGVzLmZvckVhY2goKHZhbGlkYXRpb25OYW1lKSA9PiB7XG4gICAgICBpZiAoc3RhdGUudmFsaWRhdGlvblt2YWxpZGF0aW9uTmFtZV0pIHtcbiAgICAgICAgZGlzcGF0Y2goXG4gICAgICAgICAgYWN0aW9ucy5yZXNldElucHV0VmFsaWRhdGlvblN0YXRlKHsgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25OYW1lIH0pXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgZnVuY3Rpb24gaGFuZGxlQmx1cigpIHtcbiAgICB2YWxpZGF0aW9uVHlwZXMuZm9yRWFjaCgodmFsaWRhdGlvbk5hbWUpID0+IHtcbiAgICAgIGlmIChpc0NsaWVudFZhbGlkYXRpb25UeXBlKHsgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25OYW1lIH0pKSB7XG4gICAgICAgIGRpc3BhdGNoKFxuICAgICAgICAgIGFjdGlvbnMuY2xpZW50VmFsaWRhdGlvbih7XG4gICAgICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvbk5hbWUsXG4gICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgIHN0YXRlLFxuICAgICAgICAgICAgIGF1dGgsXG4gICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRvZ2dsZUV5ZSgpIHtcbiAgICBpZiAoaW5wdXRUeXBlID09PSAncGFzc3dvcmQnKSB7XG4gICAgICBzZXRJbnB1dFR5cGUoJ3RleHQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2V0SW5wdXRUeXBlKCdwYXNzd29yZCcpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3N0eWxlLnJvb3R9PlxuICAgICAgPGRpdiBzdHlsZT17c3R5bGUuaW5wdXRDb250YWluZXJ9PlxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICBzdHlsZT17eyAuLi5zdHlsZS5pbnB1dCwgYm9yZGVyQ29sb3IgfX1cbiAgICAgICAgICB0eXBlPXtpbnB1dFR5cGV9XG4gICAgICAgICAgbmFtZT17bmFtZX1cbiAgICAgICAgICBvbkNoYW5nZT17b25DaGFuZ2V9XG4gICAgICAgICAgdmFsdWU9e3ZhbHVlfVxuICAgICAgICAgIG9uQmx1cj17aGFuZGxlQmx1cn1cbiAgICAgICAgICBwbGFjZWhvbGRlcj17cGxhY2Vob2xkZXJ9XG4gICAgICAgICAgb25Gb2N1cz17aGFuZGxlRm9jdXN9XG4gICAgICAgICAgZGF0YS10ZXN0aWQ9e2lkfVxuICAgICAgICAvPlxuICAgICAgICB7dmFsaWRhdGlvblR5cGVzLm1hcCgodmFsaWRhdGlvbk5hbWUpID0+IHtcbiAgICAgICAgICBpZiAoc3RhdGUudmFsaWRhdGlvblt2YWxpZGF0aW9uTmFtZV0pIHtcbiAgICAgICAgICAgIGNvbnN0IHsgdmFsaWRhdGlvblN0YXRlIH0gPSBzdGF0ZS52YWxpZGF0aW9uW3ZhbGlkYXRpb25OYW1lXTtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgdmFsaWRhdGlvblN0YXRlID09PSB2YWxpZGF0aW9uU3RhdGVzLlZBTElEIHx8XG4gICAgICAgICAgICAgIHZhbGlkYXRpb25TdGF0ZSA9PT0gdmFsaWRhdGlvblN0YXRlcy5JTlZBTElEXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8VmFsaWRpdHlJY29uIGtleT17dmFsaWRhdGlvbk5hbWV9IHZhbGlkPXt2YWxpZGF0aW9uU3RhdGV9IC8+XG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgIH0pfVxuICAgICAgICB7dHlwZSA9PT0gJ3Bhc3N3b3JkJyAmJiA8RXllSWNvbiBvbkNsaWNrPXt0b2dnbGVFeWV9IC8+fVxuICAgICAgPC9kaXY+XG4gICAgICB7dmFsaWRhdGlvblR5cGVzLm1hcCgodmFsaWRhdGlvbk5hbWUpID0+IHtcbiAgICAgICAgaWYgKHN0YXRlLnZhbGlkYXRpb25bdmFsaWRhdGlvbk5hbWVdKSB7XG4gICAgICAgICAgY29uc3QgeyBtZXNzYWdlIH0gPSBzdGF0ZS52YWxpZGF0aW9uW3ZhbGlkYXRpb25OYW1lXTtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBrZXk9e3ZhbGlkYXRpb25OYW1lfSBzdHlsZT17c3R5bGUubWVzc2FnZX0+XG4gICAgICAgICAgICAgIHttZXNzYWdlICE9PSAnJyAmJiAoXG4gICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgcm9sZT0nbWVzc2FnZSdcbiAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPXtgbWVzc2FnZS0ke25hbWV9YH1cbiAgICAgICAgICAgICAgICA+e2AqICR7bWVzc2FnZX1gfTwvZGl2PlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfSl9XG4gICAgPC9kaXY+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IHVzZVRoZW1lQ29udGV4dCB9IGZyb20gJy4uL3RoZW1lL3RoZW1lLWNvbnRleHQnO1xuaW1wb3J0ICcuL2Nzcy9zdHlsZS5jc3MnO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQnV0dG9uKHtcbiAgb25DbGljayxcbiAgdGl0bGUsXG4gIGRpc2FibGVkLFxuICBpZCxcbiAgY29sb3IgPSAncHJpbWFyeScsXG59KSB7XG4gIGNvbnN0IHRoZW1lID0gdXNlVGhlbWVDb250ZXh0KCk7XG4gIHJldHVybiAoXG4gICAgPGJ1dHRvblxuICAgICAgY2xhc3NOYW1lPSdidG4nXG4gICAgICBkYXRhLXRlc3RpZD17aWR9XG4gICAgICBkaXNhYmxlZD17ZGlzYWJsZWR9XG4gICAgICBzdHlsZT17eyAuLi50aGVtZVtjb2xvcl0gfX1cbiAgICAgIG9uQ2xpY2s9e29uQ2xpY2t9XG4gICAgPlxuICAgICAge3RpdGxlfVxuICAgIDwvYnV0dG9uPlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyB1c2VNZWRpYVF1ZXJ5IH0gZnJvbSAnLi4vbGF5b3V0L3VzZU1lZGlhUXVlcnknO1xuLy9pbXBvcnQgJy4vY3NzL3N0eWxlLmNzcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEZvcm0oeyBjaGlsZHJlbiwgZm9ybVRpdGxlLCBlcnJvciB9KSB7XG4gIGNvbnN0IHsgZGV2aWNlIH0gPSB1c2VNZWRpYVF1ZXJ5O1xuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAvL2NsYXNzTmFtZT1cInBhcGVyXCJcbiAgICAvLyAgc3R5bGU9e3sgd2lkdGg6IGRldmljZSA9PT0gJ3Bob25lJyA/ICcxMDAlJyA6IDM1MCB9fVxuICAgID5cbiAgICAgIDxsZWdlbmQ+e2Zvcm1UaXRsZX06PC9sZWdlbmQ+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgICB7ZXJyb3IgJiYgKFxuICAgICAgICA8ZGl2XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIGNvbG9yOiAncmVkJyxcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJ3doaXRlJyxcbiAgICAgICAgICAgIHBhZGRpbmc6IDUsXG4gICAgICAgICAgICBib3JkZXJSYWRpdXM6IDUsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgICoge2Vycm9yLm1lc3NhZ2V9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiIsImltcG9ydCBhY3Rpb25UeXBlcyBmcm9tICcuL2FjdGlvblR5cGVzJztcbmltcG9ydCB7IHNlcnZlclZhbGlkYXRpb24gfSBmcm9tICcuLi9mb3JtL2FjdGlvbnMnO1xuaW1wb3J0IGh0dHBTdGF0dXMgZnJvbSAnLi4vZm9ybS9odHRwLXN0YXR1cyc7XG5leHBvcnQgZnVuY3Rpb24gdmFsdWVDaGFuZ2VkKHsgcHJvcE5hbWUsIHZhbHVlIH0pIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBhY3Rpb25UeXBlcy5WQUxVRV9DSEFOR0VELFxuICAgIHBheWxvYWQ6IHtcbiAgICAgIHByb3BOYW1lLFxuICAgICAgdmFsdWUsXG4gICAgfSxcbiAgfTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxvZ2luKHsgZGlzcGF0Y2gsIHN0YXRlLCBmb3JtRGlzcGF0Y2ggfSkge1xuICBkZWJ1Z2dlcjtcbiAgdHJ5IHtcbiAgICBjb25zdCB7IGVtYWlsb3J1c2VybmFtZSwgcGFzc3dvcmQgfSA9IHN0YXRlO1xuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTE9HSU5fU1RBUlRFRCB9KTtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAvYXV0aC9sb2dpbmAsIHtcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgJ0NvbnRlbi1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6ICcqJyxcbiAgICAgICAgQXV0aG9yaXphdGlvbjogYEJhc2ljICR7YnRvYShgJHtlbWFpbG9ydXNlcm5hbWV9OiR7cGFzc3dvcmR9YCl9YCxcbiAgICAgIH0sXG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgIH0pO1xuICAgIGRlYnVnZ2VyO1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICBkZWJ1Z2dlcjtcbiAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAyMDApIHtcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTE9HSU5fU1VDQ0VTUywgdG9rZW46IHJlc3VsdC50b2tlbiB9KTtcbiAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDAwKSB7XG4gICAgICBkZWJ1Z2dlcjtcbiAgICAgIGNvbnN0IHsgZXJyb3JzIH0gPSByZXN1bHQ7XG4gICAgICBkZWJ1Z2dlcjtcbiAgICAgIGVycm9ycy5mb3JFYWNoKChlcnJvcikgPT4ge1xuICAgICAgICBmb3JtRGlzcGF0Y2goXG4gICAgICAgICAgc2VydmVyVmFsaWRhdGlvbih7XG4gICAgICAgICAgICBzdGF0dXM6IGVycm9yLFxuICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdMb2dpbiBmYWlsZWQnKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gZGVidWdnZXI7XG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5MT0dJTl9GQUlMRUQsIHBheWxvYWQ6IHsgZXJyb3IgfSB9KTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2lnbnVwKHsgZGlzcGF0Y2gsIGZvcm1EaXNwYXRjaCwgc3RhdGUgfSkge1xuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNJR05VUF9TVEFSVEVEIH0pO1xuICBjb25zdCB7IGVtYWlsLCBwYXNzd29yZCwgdXNlcm5hbWUgfSA9IHN0YXRlO1xuICB0cnkge1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYC9hdXRoL3NpZ251cGAsIHtcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgcGFzc3dvcmQsIGVtYWlsLCB1c2VybmFtZSB9KSxcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgQ29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgQWNjZXB0OiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICB9LFxuICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgfSk7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TSUdOVVBfU1VDQ0VTUywgdG9rZW46IHJlc3VsdC50b2tlbiB9KTtcbiAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDAwKSB7XG4gICAgICBjb25zdCB7IGVycm9ycyB9ID0gcmVzdWx0O1xuICAgICAgZXJyb3JzLmZvckVhY2goKGVycm9yKSA9PiB7XG4gICAgICBcbiAgICAgICAgZm9ybURpc3BhdGNoKFxuICAgICAgICAgIHNlcnZlclZhbGlkYXRpb24oe1xuICAgICAgICAgICAgc3RhdHVzOiBlcnJvcixcbiAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignU2lnbnVwIGZhaWxlZCcpO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNJR05VUF9GQUlMRUQsIHBheWxvYWQ6IHsgZXJyb3IgfSB9KTtcbiAgfVxufVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxvZ291dCh7IGRpc3BhdGNoLCBzdGF0ZSB9KSB7XG4gIHRyeSB7XG4gICAgY29uc3QgeyB0b2tlbiB9ID0gc3RhdGU7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcbiAgICAgIGAvYXV0aC9sb2dvdXQ/JHtuZXcgVVJMU2VhcmNoUGFyYW1zKHtcbiAgICAgICAgdG9rZW4sXG4gICAgICB9KX1gXG4gICAgKTtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkxPR09VVF9TVEFSVEVEIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTE9HT1VUX0ZBSUxFRCwgZXJyb3IgfSk7XG4gIH1cbn1cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjaGFuZ2VQYXNzd29yZCh7IGRpc3BhdGNoLCBzdGF0ZSwgZm9ybURpc3BhdGNoIH0pIHtcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfU1RBUlRFRCB9KTtcbiAgdHJ5IHtcbiAgICBjb25zdCB7IGNvbmZpcm0sIHBhc3N3b3JkLCB0b2tlbiwgZW1haWxvcnVzZXJuYW1lLCBjdXJyZW50IH0gPSBzdGF0ZTtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxuICAgICAgYC9hdXRoL2NoYW5nZXBhc3NgLFxuICAgICAge1xuICAgICAgICBtZXRob2Q6ICdwdXQnLFxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgY29uZmlybSxcbiAgICAgICAgICBwYXNzd29yZCxcbiAgICAgICAgICBjdXJyZW50LFxuICAgICAgICAgIHRva2VuLFxuICAgICAgICAgIGVtYWlsb3J1c2VybmFtZSxcbiAgICAgICAgfSksXG4gICAgICB9XG4gICAgKTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAyMDApIHtcbiAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX1NVQ0NFU1MsXG4gICAgICAgIHRva2VuOiByZXN1bHQudG9rZW4sXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDAwKSB7XG4gICAgICBjb25zdCB7IGVycm9ycyB9ID0gcmVzdWx0O1xuICAgICAgZXJyb3JzLmZvckVhY2goKGVycm9yKSA9PiB7XG4gICAgICAgIGZvcm1EaXNwYXRjaChcbiAgICAgICAgICBzZXJ2ZXJWYWxpZGF0aW9uKHtcbiAgICAgICAgICAgIHN0YXR1czogZXJyb3IsXG4gICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA1MDApIHtcbiAgICAgIGNvbnN0IHsgZXJyb3IgfSA9IHJlc3VsdDtcblxuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfRkFJTEVELFxuICAgICAgICBlcnJvcixcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NoYW5naW5nIHBhc3N3b3JkIGZhaWxlZCcpO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBkaXNwYXRjaCh7XG4gICAgICB0eXBlOiBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfRkFJTEVELFxuICAgICAgcGF5bG9hZDogeyBlcnJvciB9LFxuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmb3Jnb3RQYXNzd29yZCh7IGRpc3BhdGNoLCBzdGF0ZSwgZm9ybURpc3BhdGNoIH0pIHtcbiAgdHJ5IHtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlJFUVVFU1RfUEFTU19DSEFOR0VfU1RBUlRFRCB9KTtcbiAgICBjb25zdCB7IGVtYWlsIH0gPSBzdGF0ZTtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxuICAgICAgYC9hdXRoL3JlcXVlc3RwYXNzY2hhbmdlYCxcbiAgICAgIHtcbiAgICAgICAgbWV0aG9kOiAncG9zdCcsXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgZW1haWwgfSksXG4gICAgICB9XG4gICAgKTtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICBkaXNwYXRjaCh7XG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLkNIQU5HRV9QQVNTV09SRF9TVUNDRVNTLFxuICAgICAgICB0b2tlbjogcmVzdWx0LnRva2VuLFxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDQwMCkge1xuICAgICAgY29uc3QgeyBlcnJvcnMgfSA9IHJlc3VsdDtcbiAgICAgIGVycm9ycy5mb3JFYWNoKChlcnJvcikgPT4ge1xuICAgICAgICBmb3JtRGlzcGF0Y2goXG4gICAgICAgICAgc2VydmVyVmFsaWRhdGlvbih7XG4gICAgICAgICAgICBzdGF0dXM6IGVycm9yLFxuICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNTAwKSB7XG4gICAgICBjb25zdCB7IGVycm9yIH0gPSByZXN1bHQ7XG5cbiAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX0ZBSUxFRCxcbiAgICAgICAgZXJyb3IsXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDaGFuZ2luZyBwYXNzd29yZCBmYWlsZWQnKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogYWN0aW9uVHlwZXMuUkVRVUVTVF9QQVNTX0NIQU5HRV9GQUlMRUQsXG4gICAgICBwYXlsb2FkOiB7IGVycm9yOiBlcnIgfSxcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VG9rZW5Gcm9tVXJsKHsgdG9rZW4gfSkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IGFjdGlvblR5cGVzLkdPVF9UT0tFTl9GUk9NX1VSTCxcbiAgICB0b2tlbixcbiAgfTtcbn1cbiJdLCJuYW1lcyI6WyJFTUFJTF9GT1JNQVRfVkFMSURBVElPTiIsIlBBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OIiwiVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT04iLCJVU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTiIsIkVNUFRZX1NUUklOR19WQUxJREFUSU9OIiwiUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT04iLCJJTlZBTElEX0NSRURFTlRJQUxTIiwiVVNFUk5BTUVfVEFLRU4iLCJSRUdJU1RFUkVEX0VNQUlMIiwiRU1BSUxfTk9UX1JFR0lTVEVSRUQiLCJVU0VSTkFNRV9OT1RfUkVHSVNURVJFRCIsIklOVkFMSURfUEFTU1dPUkQiLCJJTlZBTElEX0VNQUlMIiwiSU5WQUxJRF9VU0VSTkFNRSIsIklOVkFMSURfRU1QVFlfU1RSSU5HIiwiSU5WQUxJRF9VU0VSTkFNRV9PUl9FTUFJTCIsIlBBU1NXT1JEU19ET19OT1RfTUFUQ0giLCJwYXNzd29yZFJlZ2V4IiwiZW1haWxSZWdleCIsInVzZXJuYW1lUmVnZXgiLCJ2YWxpZGF0ZUVtYWlsQ29uc3RyYWludCIsImVtYWlsIiwiZW1haWxDb25zdHJhaW50IiwiUmVnRXhwIiwidGVzdCIsInZhbGlkYXRpb25UeXBlIiwidmFsaWRhdGlvblR5cGVzIiwidmFsaWRhdGlvblN0YXRlIiwiVkFMSUQiLCJtZXNzYWdlIiwiSU5WQUxJRCIsInZhbGlkYXRpb25NZXNzYWdlcyIsImlzQ2xpZW50VmFsaWRhdGlvblR5cGUiLCJ2YWxpZGF0ZVBhc3N3b3JkQ29uc3RyYWludCIsInBhc3N3b3JkIiwicGFzc3dvcmRDb25zdHJhaW50IiwidmFsaWRhdGVVc2VyTmFtZUNvbnN0cmFpbnQiLCJ1c2VybmFtZSIsInVzZXJuYW1lQ29uc3RyYWludCIsInZhbGlkYXRlRW1haWxPclVzZXJuYW1lIiwidmFsdWUiLCJ2YWxpZGF0ZUVtcHR5U3RyaW5nIiwibGVuZ3RoIiwidmFsaWRhdGVQYXNzd29yZE1hdGNoIiwiYXV0aCIsImNvbmZpcm0iLCJzdGF0ZSIsImNyZWRlbnRpYWxJbnZhbGlkIiwidXNlcm5hbWVJc1Rha2VuIiwiZW1haWxJc1JlZ2lzdGVyZWQiLCJ1c2VybmFtZUludmFsaWQiLCJwYXNzd29yZEludmFsaWQiLCJlbWFpbEludmFsaWQiLCJlbWFpbElzTm90UmVnaXN0ZXJlZCIsImVtcHR5U3RyaW5nTm90VmFsaWQiLCJlbWFpbG9ydXNlcm5hbWVOb3RWYWxpZCIsInVzZXJuYW1lSXNOb3RSZWdpc3RlcmVkIiwicGFzc3dvcmREb05vdE1hdGNoIiwidG9rZW5FeHBpcmVkIiwic2VydmVyVmFsaWRhdGlvblJhbmdlIiwic3RhdHVzIiwiY2xpZW50VmFsaWRhdGlvbiIsInZhbGlkYXRpb24iLCJjb25zdFZhbFR5cGVzIiwidmFsaWRhdGlvbnMiLCJ0eXBlIiwiYWN0aW9uVHlwZXMiLCJDTElFTlRfVkFMSURBVElPTiIsInJlc2V0SW5wdXRWYWxpZGF0aW9uU3RhdGUiLCJSRVNFVF9WQUxJREFUSU9OX1NUQVRFIiwic2VydmVyVmFsaWRhdGlvbiIsImh0dHBTdGF0dXMiLCJTRVJWRVJfVkFMSURBVElPTiIsInZhbGlkYXRpb25TdGF0ZXMiLCJpbWciLCJJY29uU3RhdGUiLCJvcGVuIiwib3Blbkljb24iLCJjbG9zZUljb24iLCJFeWVJY29uIiwib25DbGljayIsInNldFN0YXRlIiwidXNlU3RhdGUiLCJ0b2dnbGUiLCJwcmV2IiwiZGlzcGxheSIsImFsaWduSXRlbXMiLCJqdXN0aWZ5Q29udGVudCIsIm1hcmdpbiIsIlZhbGlkaXR5SWNvbiIsInZhbGlkIiwic3RhdGVDb2xvciIsIklOQUNUSVZFIiwiZmxleCIsImNvbG9yIiwibGluZUhlaWdodCIsIndpZHRoIiwidGV4dEFsaWduIiwic3R5bGUiLCJpbnB1dCIsImJvcmRlciIsInBhZGRpbmciLCJib3JkZXJSYWRpdXMiLCJyb290IiwiZmxleERpcmVjdGlvbiIsImJhY2tncm91bmRDb2xvciIsIm1hcmdpbkJvdHRvbSIsImlucHV0Q29udGFpbmVyIiwicGFkZGluZ0xlZnQiLCJJbnB1dCIsInBsYWNlaG9sZGVyIiwibmFtZSIsIm9uQ2hhbmdlIiwiaWQiLCJmb3JtIiwidXNlQXBwQ29udGV4dCIsImRpc3BhdGNoIiwiaW5wdXRWYWxpZGF0aW9uIiwic2V0SW5wdXRWYWxpZGF0aW9uIiwidW5kZWZpbmVkIiwiaW5wdXRUeXBlIiwic2V0SW5wdXRUeXBlIiwiYm9yZGVyQ29sb3IiLCJzZXRCb3JkZXJDb2xvciIsInVzZUVmZmVjdCIsImhhbmRsZUZvY3VzIiwiZm9yRWFjaCIsInZhbGlkYXRpb25OYW1lIiwiYWN0aW9ucyIsImhhbmRsZUJsdXIiLCJ0b2dnbGVFeWUiLCJtYXAiLCJCdXR0b24iLCJ0aXRsZSIsImRpc2FibGVkIiwidGhlbWUiLCJ1c2VUaGVtZUNvbnRleHQiLCJGb3JtIiwiY2hpbGRyZW4iLCJmb3JtVGl0bGUiLCJlcnJvciIsInZhbHVlQ2hhbmdlZCIsInByb3BOYW1lIiwiVkFMVUVfQ0hBTkdFRCIsInBheWxvYWQiLCJsb2dpbiIsImZvcm1EaXNwYXRjaCIsImVtYWlsb3J1c2VybmFtZSIsIkxPR0lOX1NUQVJURUQiLCJyZXNwb25zZSIsImZldGNoIiwiaGVhZGVycyIsIkF1dGhvcml6YXRpb24iLCJidG9hIiwibWV0aG9kIiwicmVzdWx0IiwianNvbiIsIkxPR0lOX1NVQ0NFU1MiLCJ0b2tlbiIsImVycm9ycyIsIkVycm9yIiwiTE9HSU5fRkFJTEVEIiwic2lnbnVwIiwiU0lHTlVQX1NUQVJURUQiLCJib2R5IiwiSlNPTiIsInN0cmluZ2lmeSIsIkNvbnRlbnRUeXBlIiwiQWNjZXB0IiwiU0lHTlVQX1NVQ0NFU1MiLCJTSUdOVVBfRkFJTEVEIiwiY2hhbmdlUGFzc3dvcmQiLCJDSEFOR0VfUEFTU1dPUkRfU1RBUlRFRCIsImN1cnJlbnQiLCJDSEFOR0VfUEFTU1dPUkRfU1VDQ0VTUyIsIkNIQU5HRV9QQVNTV09SRF9GQUlMRUQiLCJmb3Jnb3RQYXNzd29yZCIsIlJFUVVFU1RfUEFTU19DSEFOR0VfU1RBUlRFRCIsIlJFUVVFU1RfUEFTU19DSEFOR0VfRkFJTEVEIiwiZXJyIl0sIm1hcHBpbmdzIjoiOztBQUFBLHNCQUFlO0FBQ2I7QUFDQUEsRUFBQUEsdUJBQXVCLEVBQUUseUJBRlo7QUFHYkMsRUFBQUEsMEJBQTBCLEVBQUUsNEJBSGY7QUFJYkMsRUFBQUEsMEJBQTBCLEVBQUUsNEJBSmY7QUFLYkMsRUFBQUEsbUNBQW1DLEVBQUUscUNBTHhCO0FBTWJDLEVBQUFBLHVCQUF1QixFQUFFLHlCQU5aO0FBT2JDLEVBQUFBLDBCQUEwQixFQUFFLDRCQVBmO0FBUWI7QUFDQUMsRUFBQUEsbUJBQW1CLEVBQUUscUJBVFI7QUFVYkMsRUFBQUEsY0FBYyxFQUFFLGdCQVZIO0FBV2JDLEVBQUFBLGdCQUFnQixFQUFFLGtCQVhMO0FBWWJDLEVBQUFBLG9CQUFvQixFQUFFLHNCQVpUO0FBYWJDLEVBQUFBLHVCQUF1QixFQUFDO0FBYlgsQ0FBZjs7QUNBQSx5QkFBZTtBQUNiQyxFQUFBQSxnQkFBZ0IsRUFDZCxxSEFGVztBQUdiQyxFQUFBQSxhQUFhLEVBQUUsMkJBSEY7QUFJYkgsRUFBQUEsb0JBQW9C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
