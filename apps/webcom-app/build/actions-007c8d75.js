import { v as validationStates, c as actionTypes, d as v, h, b as useAppContext, p, s as styleInject, e as useThemeContext, f as actionTypes$1 } from './index-5b7d45bd.js';

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
  switch (status) {
    case httpStatus.credentialInvalid:
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

var css_248z = ".btn {\r\n  padding: 6px 16px;\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-box-align: center;\r\n      -ms-flex-align: center;\r\n          align-items: center;\r\n  border: none;\r\n  -webkit-box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);\r\n          box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);\r\n  min-width: 64px;\r\n  font-weight: 500;\r\n  font-size: 0.875rem;\r\n  -webkit-box-sizing: border-box;\r\n          box-sizing: border-box;\r\n}";
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

const style$1 = {
  boxShadow: `0px 3px 3px -2px rgba(0, 0, 0, 0.2),
    0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12)`,
  margin: 8,
  padding: 8
};
function Paper(props) {
  const {
    children
  } = props;
  return h("div", {
    style: style$1
  }, children);
}

function Grid(props) {
  const {
    children,
    width
  } = props;
  return h("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: `auto ${width}% auto`
    }
  }, h("div", null), h("div", null, children), h("div", null));
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

export { Button as B, Form as F, Grid as G, Input as I, Paper as P, valueChanged as a, changePassword as c, forgotPassword as f, login as l, signup as s, validationTypes as v };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9ucy0wMDdjOGQ3NS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY2xpZW50L2Zvcm0vdmFsaWRhdGlvblR5cGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vdmFsaWRhdGlvbk1lc3NhZ2VzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vdmFsaWRhdGlvblJlZ2V4LmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vY29uc3RyYWludFZhbGlkYXRvcnMuanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS9odHRwLXN0YXR1cy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL2FjdGlvbnMuanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS9pY29ucy9vcGVuRXllLnBuZyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL2ljb25zL2Nsb3NlRXllLnBuZyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL0V5ZUljb24uanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS9JbnB1dC5qcyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL0J1dHRvbi5qcyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL0Zvcm0uanMiLCIuLi8uLi8uLi9jbGllbnQvbGF5b3V0L1BhcGVyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2xheW91dC9HcmlkLmpzIiwiLi4vLi4vLi4vY2xpZW50L2F1dGgvYWN0aW9ucy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCB7XHJcbiAgLy9jb25zdHJhaW50XHJcbiAgRU1BSUxfRk9STUFUX1ZBTElEQVRJT046ICdFTUFJTF9GT1JNQVRfVkFMSURBVElPTicsXHJcbiAgUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT046ICdQQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTicsXHJcbiAgVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT046ICdVU0VSTkFNRV9GT1JNQVRfVkFMSURBVElPTicsXHJcbiAgVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT046ICdVU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTicsXHJcbiAgRU1QVFlfU1RSSU5HX1ZBTElEQVRJT046ICdFTVBUWV9TVFJJTkdfVkFMSURBVElPTicsXHJcbiAgUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT046ICdQQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTicsXHJcbiAgLy9hdXRoXHJcbiAgSU5WQUxJRF9DUkVERU5USUFMUzogJ0lOVkFMSURfQ1JFREVOVElBTFMnLFxyXG4gIFVTRVJOQU1FX1RBS0VOOiAnVVNFUk5BTUVfVEFLRU4nLFxyXG4gIFJFR0lTVEVSRURfRU1BSUw6ICdSRUdJU1RFUkVEX0VNQUlMJyxcclxuICBFTUFJTF9OT1RfUkVHSVNURVJFRDogJ0VNQUlMX05PVF9SRUdJU1RFUkVEJyxcclxuICBVU0VSTkFNRV9OT1RfUkVHSVNURVJFRDonVVNFUk5BTUVfTk9UX1JFR0lTVEVSRUQnXHJcbn07XHJcbiIsImV4cG9ydCBkZWZhdWx0IHtcclxuICBJTlZBTElEX1BBU1NXT1JEOlxyXG4gICAgJ2F0IGxlYXN0IDggY2hhcmFjdGVycywgbXVzdCBjb250YWluIGF0IGxlYXN0IDEgdXBwZXJjYXNlIGxldHRlciwgMSBsb3dlcmNhc2UgbGV0dGVyLCBDYW4gY29udGFpbiBzcGVjaWFsIGNoYXJhY3RlcnMnLFxyXG4gIElOVkFMSURfRU1BSUw6ICdlbWFpbCBmb3JtYXQgaXMgbm90IHZhbGlkJyxcclxuICBFTUFJTF9OT1RfUkVHSVNURVJFRDogJ2VtYWlsIGlzIG5vdCByZWdpc3RlcmVkJyxcclxuICBVU0VSTkFNRV9OT1RfUkVHSVNURVJFRDogJ3VzZXJuYW1lIGlzIG5vdCByZWdpc3RlcmVkJyxcclxuICBJTlZBTElEX1VTRVJOQU1FOlxyXG4gICAgJ29ubHkgTGV0dGVycyBhLXogb3IgQS1aIGFuZCB0aGUgU3ltYm9scyAtIGFuZCBfIGFyZSBhbGxvd2VkJyxcclxuICBJTlZBTElEX0VNUFRZX1NUUklORzogJ2VtcHR5IHN0cmluZyBpcyBub3QgYWxsb3dlZCcsXHJcbiAgSU5WQUxJRF9VU0VSTkFNRV9PUl9FTUFJTDogJ2VtYWlsIG9yIHVzZXJuYW1lIGlzIG5vdCB2YWxpZCcsXHJcbiAgSU5WQUxJRF9DUkVERU5USUFMUzogJ2ludmFsaWQgY3JlZGVudGlhbHMgcHJvdmlkZWQnLFxyXG4gIFVTRVJOQU1FX1RBS0VOOiAndXNlcm5hbWUgaXMgYWxyZWFkeSB0YWtlbicsXHJcbiAgUkVHSVNURVJFRF9FTUFJTDogJ2VtYWlsIGlzIGFscmVhZHkgcmVnaXN0ZXJlZCcsXHJcbiAgUEFTU1dPUkRTX0RPX05PVF9NQVRDSDogJ3Bhc3N3b3JkcyBkbyBub3QgbWF0Y2gnXHJcbn07XHJcbiIsImV4cG9ydCBjb25zdCBwYXNzd29yZFJlZ2V4ID0gL14oPz0uKlxcZCkoPz0uKlthLXpdKSg/PS4qW0EtWl0pKD89LipbYS16QS1aXSkuezgsfSQvZztcclxuXHJcbmV4cG9ydCBjb25zdCBlbWFpbFJlZ2V4ID0gL1thLXowLTkhIyQlJicqKy89P15fYHt8fX4tXSsoPzpcXC5bYS16MC05ISMkJSYnKisvPT9eX2B7fH1+LV0rKSpAKD86W2EtejAtOV0oPzpbYS16MC05LV0qW2EtejAtOV0pP1xcLikrW2EtejAtOV0oPzpbYS16MC05LV0qW2EtejAtOV0pPy9nO1xyXG5cclxuZXhwb3J0IGNvbnN0IHVzZXJuYW1lUmVnZXggPSAvW2EtekEtWl0rWy1fXSpbYS16QS1aXSsvZztcclxuIiwiaW1wb3J0IHZhbGlkYXRpb25TdGF0ZSBmcm9tICcuL3ZhbGlkYXRpb25TdGF0ZXMnO1xyXG5pbXBvcnQgdmFsaWRhdGlvblR5cGVzIGZyb20gJy4vdmFsaWRhdGlvblR5cGVzJztcclxuaW1wb3J0IHZhbGlkYXRpb25NZXNzYWdlcyBmcm9tICcuL3ZhbGlkYXRpb25NZXNzYWdlcyc7XHJcbmltcG9ydCB7IGVtYWlsUmVnZXgsIHBhc3N3b3JkUmVnZXgsIHVzZXJuYW1lUmVnZXggfSBmcm9tICcuL3ZhbGlkYXRpb25SZWdleCc7XHJcbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUVtYWlsQ29uc3RyYWludCh7IGVtYWlsIH0pIHtcclxuICBjb25zdCBlbWFpbENvbnN0cmFpbnQgPSBuZXcgUmVnRXhwKGVtYWlsUmVnZXgpO1xyXG5cclxuICBpZiAoZW1haWxDb25zdHJhaW50LnRlc3QoZW1haWwpKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLkVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogJycsXHJcbiAgICB9O1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLkVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTlZBTElELFxyXG4gICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9FTUFJTCxcclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNDbGllbnRWYWxpZGF0aW9uVHlwZSh7IHZhbGlkYXRpb25UeXBlIH0pIHtcclxuICBzd2l0Y2ggKHZhbGlkYXRpb25UeXBlKSB7XHJcbiAgICBjYXNlIHZhbGlkYXRpb25UeXBlcy5QQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTjpcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICBjYXNlIHZhbGlkYXRpb25UeXBlcy5FTUFJTF9GT1JNQVRfVkFMSURBVElPTjpcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICBjYXNlIHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTjpcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICBjYXNlIHZhbGlkYXRpb25UeXBlcy5FTVBUWV9TVFJJTkdfVkFMSURBVElPTjpcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICBjYXNlIHZhbGlkYXRpb25UeXBlcy5QQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTjpcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICBjYXNlIHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9GT1JNQVRfVkFMSURBVElPTjpcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZVBhc3N3b3JkQ29uc3RyYWludCh7IHBhc3N3b3JkIH0pIHtcclxuICBjb25zdCBwYXNzd29yZENvbnN0cmFpbnQgPSBuZXcgUmVnRXhwKHBhc3N3b3JkUmVnZXgpO1xyXG4gIGlmIChwYXNzd29yZENvbnN0cmFpbnQudGVzdChwYXNzd29yZCkpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLlZBTElELFxyXG4gICAgICBtZXNzYWdlOiAnJyxcclxuICAgIH07XHJcbiAgfVxyXG4gIGlmICghcGFzc3dvcmRDb25zdHJhaW50LnRlc3QocGFzc3dvcmQpKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTlZBTElELFxyXG4gICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9QQVNTV09SRCxcclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVVc2VyTmFtZUNvbnN0cmFpbnQoeyB1c2VybmFtZSB9KSB7XHJcbiAgY29uc3QgdXNlcm5hbWVDb25zdHJhaW50ID0gbmV3IFJlZ0V4cCh1c2VybmFtZVJlZ2V4KTtcclxuXHJcbiAgaWYgKHVzZXJuYW1lQ29uc3RyYWludC50ZXN0KHVzZXJuYW1lKSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgfTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfVVNFUk5BTUUsXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlRW1haWxPclVzZXJuYW1lKHsgdmFsdWUgfSkge1xyXG4gIGNvbnN0IGVtYWlsQ29uc3RyYWludCA9IG5ldyBSZWdFeHAoZW1haWxSZWdleCk7XHJcbiAgY29uc3QgdXNlcm5hbWVDb25zdHJhaW50ID0gbmV3IFJlZ0V4cCh1c2VybmFtZVJlZ2V4KTtcclxuXHJcbiAgaWYgKGVtYWlsQ29uc3RyYWludC50ZXN0KHZhbHVlKSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgfTtcclxuICB9IGVsc2UgaWYgKHVzZXJuYW1lQ29uc3RyYWludC50ZXN0KHZhbHVlKSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgfTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfVVNFUk5BTUVfT1JfRU1BSUwsXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlRW1wdHlTdHJpbmcoeyB2YWx1ZSB9KSB7XHJcbiAgaWYgKHZhbHVlLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5FTVBUWV9TVFJJTkdfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfRU1QVFlfU1RSSU5HLFxyXG4gICAgfTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5FTVBUWV9TVFJJTkdfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZVBhc3N3b3JkTWF0Y2goeyBhdXRoIH0pIHtcclxuXHJcbiAgY29uc3QgeyBwYXNzd29yZCwgY29uZmlybSB9ID0gYXV0aC5zdGF0ZTtcclxuXHJcbiAgaWYgKHBhc3N3b3JkID09PSAnJyB8fCBwYXNzd29yZCAhPT0gY29uZmlybSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLlBBU1NXT1JEU19ET19OT1RfTUFUQ0gsXHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT04sXHJcbiAgICB9O1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogJycsXHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT04sXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCB7XHJcbiAgLy9sb2dpblxyXG4gIGNyZWRlbnRpYWxJbnZhbGlkOiAnNDAxJyxcclxuICAvL3NpZ251cFxyXG4gIHVzZXJuYW1lSXNUYWtlbjogJzQwMicsXHJcbiAgZW1haWxJc1JlZ2lzdGVyZWQ6ICc0MDMnLFxyXG4gIHVzZXJuYW1lSW52YWxpZDogJzQwNScsXHJcbiAgcGFzc3dvcmRJbnZhbGlkOiAnNDA2JywgLy9jaGFuZ2UgcGFzc3dvcmRcclxuICBlbWFpbEludmFsaWQ6ICc0MDcnLFxyXG4gIC8vbG9naW5cclxuICBlbWFpbElzTm90UmVnaXN0ZXJlZDogJzQwOCcsXHJcbiAgZW1wdHlTdHJpbmdOb3RWYWxpZDogJzQwOScsXHJcbiAgZW1haWxvcnVzZXJuYW1lTm90VmFsaWQ6JzQxMCcsXHJcbiAgdXNlcm5hbWVJc05vdFJlZ2lzdGVyZWQ6JzQxMScsXHJcbi8vY2hhbmdlIHBhc3N3b3JkXHJcbiAgcGFzc3dvcmREb05vdE1hdGNoOic0MTInLFxyXG4gIHRva2VuRXhwaXJlZDonNDEzJyxcclxuICBzZXJ2ZXJWYWxpZGF0aW9uUmFuZ2U6IHN0YXR1cyA9PiB7XHJcbiAgICBpZiAoc3RhdHVzID49IDQwMCAmJiBzdGF0dXMgPD0gNDEwKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxufTtcclxuIiwiXHJcbmltcG9ydCAqIGFzIHZhbGlkYXRpb25zIGZyb20gJy4vY29uc3RyYWludFZhbGlkYXRvcnMnO1xyXG5pbXBvcnQgY29uc3RWYWxUeXBlcyBmcm9tICcuL3ZhbGlkYXRpb25UeXBlcyc7XHJcbmltcG9ydCB2YWxpZGF0aW9uU3RhdGVzIGZyb20gJy4vdmFsaWRhdGlvblN0YXRlcyc7XHJcbmltcG9ydCB2YWxpZGF0aW9uVHlwZXMgZnJvbSAnLi92YWxpZGF0aW9uVHlwZXMnO1xyXG5pbXBvcnQgYWN0aW9uVHlwZXMgZnJvbSAnLi9hY3Rpb25UeXBlcyc7XHJcbmltcG9ydCBodHRwU3RhdHVzIGZyb20gJy4vaHR0cC1zdGF0dXMnO1xyXG5pbXBvcnQgdmFsaWRhdGlvbk1lc3NhZ2VzIGZyb20gJy4vdmFsaWRhdGlvbk1lc3NhZ2VzJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjbGllbnRWYWxpZGF0aW9uKHsgdmFsaWRhdGlvblR5cGUsIHZhbHVlLCBhdXRoIH0pIHtcclxuICBsZXQgdmFsaWRhdGlvbiA9IG51bGw7XHJcbiAgc3dpdGNoICh2YWxpZGF0aW9uVHlwZSkge1xyXG4gICAgY2FzZSBjb25zdFZhbFR5cGVzLkVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OOlxyXG4gICAgICB2YWxpZGF0aW9uID0gdmFsaWRhdGlvbnMudmFsaWRhdGVFbWFpbENvbnN0cmFpbnQoe1xyXG4gICAgICAgIGVtYWlsOiB2YWx1ZSxcclxuICAgICAgfSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBjb25zdFZhbFR5cGVzLlVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OOlxyXG4gICAgICB2YWxpZGF0aW9uID0gdmFsaWRhdGlvbnMudmFsaWRhdGVFbWFpbE9yVXNlcm5hbWUoe1xyXG4gICAgICAgIHZhbHVlLFxyXG4gICAgICB9KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIGNvbnN0VmFsVHlwZXMuUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT046XHJcbiAgICAgIHZhbGlkYXRpb24gPSB2YWxpZGF0aW9ucy52YWxpZGF0ZVBhc3N3b3JkQ29uc3RyYWludCh7XHJcbiAgICAgICAgcGFzc3dvcmQ6IHZhbHVlLFxyXG4gICAgICB9KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIGNvbnN0VmFsVHlwZXMuVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT046XHJcbiAgICAgIHZhbGlkYXRpb24gPSB2YWxpZGF0aW9ucy52YWxpZGF0ZVVzZXJOYW1lQ29uc3RyYWludCh7XHJcbiAgICAgICAgdXNlcm5hbWU6IHZhbHVlLFxyXG4gICAgICB9KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIGNvbnN0VmFsVHlwZXMuRU1QVFlfU1RSSU5HX1ZBTElEQVRJT046XHJcbiAgICAgIHZhbGlkYXRpb24gPSB2YWxpZGF0aW9ucy52YWxpZGF0ZUVtcHR5U3RyaW5nKHsgdmFsdWUgfSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBjb25zdFZhbFR5cGVzLlBBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OOlxyXG4gICBcclxuICAgICAgdmFsaWRhdGlvbiA9IHZhbGlkYXRpb25zLnZhbGlkYXRlUGFzc3dvcmRNYXRjaCh7IGF1dGggfSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgYnJlYWs7XHJcbiAgfVxyXG5cclxuICByZXR1cm4geyB0eXBlOiBhY3Rpb25UeXBlcy5DTElFTlRfVkFMSURBVElPTiwgLi4udmFsaWRhdGlvbiB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaW5pdEZvcm1WYWxpZGF0aW9uU3RhdGUoKSB7XHJcbiAgcmV0dXJuIHsgdHlwZTogYWN0aW9uVHlwZXMuSU5JVF9GT1JNX1ZBTElEQVRJT05fU1RBVEUgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlc2V0SW5wdXRWYWxpZGF0aW9uU3RhdGUoeyB2YWxpZGF0aW9uVHlwZSB9KSB7XHJcbiAgcmV0dXJuIHsgdHlwZTogYWN0aW9uVHlwZXMuUkVTRVRfVkFMSURBVElPTl9TVEFURSwgdmFsaWRhdGlvblR5cGUgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGluY0lucHV0Q291bnQoKSB7XHJcbiAgcmV0dXJuIHsgdHlwZTogYWN0aW9uVHlwZXMuSU5DX0lOUFVUX0NPVVROIH07XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2VydmVyVmFsaWRhdGlvbih7IHN0YXR1cyA9IDAgfSkge1xyXG5cclxuICBzd2l0Y2ggKHN0YXR1cykge1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLmNyZWRlbnRpYWxJbnZhbGlkOlxyXG4gICAgXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLmVtYWlsSW52YWxpZDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLkVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX0VNQUlMLFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLnBhc3N3b3JkSW52YWxpZDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX1BBU1NXT1JELFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLnVzZXJuYW1lSW52YWxpZDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX1VTRVJOQU1FLFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLmVtYWlsSXNSZWdpc3RlcmVkOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxyXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuUkVHSVNURVJFRF9FTUFJTCxcclxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuUkVHSVNURVJFRF9FTUFJTCxcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcclxuICAgICAgfTtcclxuICAgIGNhc2UgaHR0cFN0YXR1cy5lbWFpbElzTm90UmVnaXN0ZXJlZDpcclxuICAgIFxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxyXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuRU1BSUxfTk9UX1JFR0lTVEVSRUQsXHJcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLkVNQUlMX05PVF9SRUdJU1RFUkVELFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLnVzZXJuYW1lSXNUYWtlbjpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX1RBS0VOLFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5VU0VSTkFNRV9UQUtFTixcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcclxuICAgICAgfTtcclxuICAgIGNhc2UgaHR0cFN0YXR1cy5lbXB0eVN0cmluZ05vdFZhbGlkOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxyXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuRU1QVFlfU1RSSU5HX1ZBTElEQVRJT04sXHJcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfRU1QVFlfU1RSSU5HLFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLmVtYWlsb3J1c2VybmFtZU5vdFZhbGlkOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxyXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfVVNFUk5BTUVfT1JfRU1BSUwsXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMudXNlcm5hbWVJc05vdFJlZ2lzdGVyZWQ6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9OT1RfUkVHSVNURVJFRCxcclxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuVVNFUk5BTUVfTk9UX1JFR0lTVEVSRUQsXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICAgIGNhc2UgaHR0cFN0YXR1cy5wYXNzd29yZERvTm90TWF0Y2g6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5QQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTixcclxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuUEFTU1dPUkRTX0RPX05PVF9NQVRDSCxcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcclxuICAgICAgfTtcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxufVxyXG4iLCJjb25zdCBpbWcgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBRUFBQUFCQUNBWUFBQUNxYVhIZUFBQUFDWEJJV1hNQUFBc1RBQUFMRXdFQW1wd1lBQUFDc2tsRVFWUjRuTzJhdTI0VFFSU0dQOXNLMEZnaUlnTGxJb1V1cVFOVVZPSFNtQkxlZ0hRVWdTN1BnWklPaEttSVlpaGkzc0FJQ1FwU0pLRUVDU3NHZ2tLTEpVdVJLV1lXSExPTGQrZk03dHJ4K2FTUkpXdG4vdi9ZdTdNelp3NG9pcUlvaXFJb2lqS09GRExRT0FOY0FhNERTOEJGNEFJd1pUOEJmZ0pIOXZNSHNBTzhCVDRBblF3OGV1Y1NzQWE4QWRwQTE3RzE3UmhyZHN5aHBnRGNCbXFZZjgwMTZLaldzV1BmSXBzN054RTNnRjM4QngzVmRxMW03bHdHWHBGZDRQM3RKVENmZHBCUlBFVDJmUHRxYldBMTVWaFBjQlo0N2prSUg2MXF2YVhLRFBBK3h5QUh0WGZBZEZyQnp3Rk5vY0Vtc0E1VWdBV2diTnVDL1c3ZGc4WVg2OVVyazhCSGdha0Q0RDVRaXFGVnN0ZTJCSHI3d0hsUnhEMmN3eXhHWE0xc1kvN2xwSlNCdWtDM1liMkwyUlNZZUF3VUJkcEZPNGFyL3FaQUc0QjdBdkZ0L0t6WWlzanVoTHV1d3BQQWQwZlJBOXh1K3lqS3VNOEozMndzaWFrNkNuWXhrNWh2VmdSK25pVVZ1eVlRYXhKdnRrOUtDZGtyOG1yWW9GRVQxQ09CMFRwd0xPZ2Z4VEh3V3RBL2RreXp5TGF6RllISlFWUUV2anFZbGV3Snd1NkFCOENFd09RblFkOUJmQmIwbmNERU5wQkQzSC9sTG41bi8zN0tRbStIL1FOS0ZpbW5nckFmNEtsd3pIK2VNNC9NQ3ZzL2lTc3kxcE5nQzVOcWtwaE1penVDdmpYZ2E5eUx4MlloOUQrcUFyR1JYd3FEYkRQVTRoUnNoa0MrSGZieG1zMXRPeHd3eWdtUkZ3THRQMGhUWW5WR1BDVUc1aG5hRjVocFlTYXh1RW5SRldSSjBUMDhKa1VENWpBcFoxZFRYY3hyYkFPelZsamtiMXA4MFg2M3daQ214UU5tTUljUEVvTnB0bFFQUmdMRyttaXNsMVdHNDNEMEZ4a2Zqdll5ajlrMzVCVjhqUnlQeDN0Wkp2c0NpZVZNSWt0QUFWTytza1Y2SlRKYndFMkdzRVNtbjZCSXFvRzhTS3BCaWtWU1daWEpMUkZlSmpkbHJ6a2l2RXh1aHhFdGsxTVVSVkVVUlZFVVpiajVEY2tNRmVRaHJGajlBQUFBQUVsRlRrU3VRbUNDXCI7XG4gIGV4cG9ydCBkZWZhdWx0IGltZzsiLCJjb25zdCBpbWcgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBRUFBQUFCQUNBWUFBQUNxYVhIZUFBQUFDWEJJV1hNQUFBc1RBQUFMRXdFQW1wd1lBQUFEczBsRVFWUjRuTzNiUzJoY1ZSekg4VTlhbzlJeW1vSW9TbU9xTGEwck43NXdLNEphdEpRYUZlekNpTkt0aUZCYzZOS1ZkQ09LQzFFcklvb0tvcUNDNEZ2UmpTSzFpaTVFRFdoTlVmRUZnUmlNaXpPUk5MMDNjeDV6WjJKeWYvQW5NTW1jMy8vL3pibjNudGVsVmF0V3JVN1VYc3gwWTkrUWN4bUtackRRamI4eE9keDBCcStsQU5ZbGhIMUMwY3NoM0RUTXBBYXRTUzJFV2dnM0R6T3BRYXVGWUkxREdJbjh1MGs4aTFPV2ZEYVAvWGkreDNlMzRESmMzSTFkM2MvTzdNWS8rQVUvZDM4ZXg2ZjRFSjlnTGpMSHhsWFZFK1pWOTRRTGNEZmVydmhPU3N6aWZkeUxjNW9wSzAyOUlGeU5WNFgvYW03UmRUR0hGN29lc1QyM0VkVkIrRkwvaTY2TEk3aXE2VUpYVWhXRVljU0xtR2k0MWxxdEZnaXp1S3ZoV211MVdpQXM0REJPYTdUYUdxMG1DQi9qM0tZS1BSOXZZWHZGNzJJaEhNTWhYQzljdTV2UUVjWUd1L0V3cGlQYVdTbSt4OVkrMWczT3h0ZGRnMm5wRUg3Q0ZFWWp2RGJpRHZ4UTAxWk1ITVZZYXBGMTJpeU15SllhcEVJNGtPSGJ3U3NWYmNYR2V6Zzl3L2NrUFZGamtBSmhIcmRrZUcvQVF6WCtNZkZjaHVjSjJ0L0RZRkFRU25yQ2pSbWU0RHo4R1dFd0NBZ2QrZmVFWThMa0sxbUhFMHdHQWVIT2hIeVd4NU9wWnBka21EUU5ZYU95UitTbEtXYXZaWnBNWTF0RmUvMkM4RWhtWGd0NEp0Wmt1N0xwN0xVMTdmWUR3dTZDdk9hRSsxcFBQVmhnc29EeEZkb3VoWEJSWVc0UHhKZ2NMelRwTlNFcGdkQXB6RzBtd3FNWVFNd1FOQmZDcHNMY29nQWNLalM1SXNaRUhvU0p3dHlpTG9GZGhTYTN4WmgwbFFyaGhvSzhvbStDOEhxQjBXT3hKbDJsUUNqcG5kR1BRZklHUW9zeGk3TlN6TVJCR0JXR3RibDVKUTJFQ0JzZXVXYjNwNXJwRFdHcUlKL0hNL0t4RmI5bkd2NkJuUm1lZFJBT0NJc3FPYm44cUdCeDVQWk0wd1Y4TGl5bXBLcmZhNHg3TTNMNFR5UEtMb1dYREJmQ1V4bmVKMm16c0ZtWm04UVI3TWp3TFlYd0prN044SzNVT0w0clNPWTMzS2MvVDRlWStBeG5aTlM1b3JiaDI0eGtsc2FzTUU2WUVrYU1ZOExjWVJ6WHFON21Tb1h3alliM0JvNG1KSk1hT1V2dVMrTWQ2YjBzV1IyOEhKSE1vQ0U4S203Zm9TL2FnSHVFTHIwYUlEemQveExqdEJQdlZpUTBhQWgxSjFVR29oSHMwY3dCaWY4TkJNS3E3UjY4b2Y4UUxxendXNVVRRnJVREIvR1JzdUxuaEQyKzYycDhpby93RGVLdzBSZ3V4NVhDb3VhRThEanRDR09BVVdIeTlLdHdWTzRyZkNHTUlEL0FYejNhcnp2Q2Q2dHdxR3BkcUQzYnJJV0FlZ2pyNm4ySEZvSjZDT3ZxSGFncUNGRWJJMnRKeXlHc093Q0Vici80R21EUittQ3JWcTNXbnY0RnJyY3VqMk9mUjVzQUFBQUFTVVZPUks1Q1lJST1cIjtcbiAgZXhwb3J0IGRlZmF1bHQgaW1nOyIsImltcG9ydCB7aH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHt1c2VTdGF0ZX0gZnJvbSAncHJlYWN0L2hvb2tzJ1xyXG5pbXBvcnQgb3Blbkljb24gZnJvbSAnLi9pY29ucy9vcGVuRXllLnBuZyc7XHJcbmltcG9ydCBjbG9zZUljb24gZnJvbSAnLi9pY29ucy9jbG9zZUV5ZS5wbmcnO1xyXG5mdW5jdGlvbiBJY29uU3RhdGUoeyBvcGVuIH0pIHtcclxuICBpZiAob3Blbikge1xyXG4gICAgcmV0dXJuIDxpbWcgd2lkdGg9XCIzMHB4XCIgc3JjPXtvcGVuSWNvbn0gLz47XHJcbiAgfVxyXG4gIHJldHVybiA8aW1nIHdpZHRoPVwiMzBweFwiIHNyYz17Y2xvc2VJY29ufSAvPjtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gRXllSWNvbih7b25DbGlja30pIHtcclxuICBjb25zdCBbc3RhdGUsIHNldFN0YXRlXSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuICBmdW5jdGlvbiB0b2dnbGUoKSB7XHJcbiAgICBvbkNsaWNrKClcclxuICAgIHNldFN0YXRlKHByZXYgPT4gIXByZXYpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgb25DbGljaz17dG9nZ2xlfVxyXG4gICAgICBzdHlsZT17e1xyXG4gICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcclxuICAgICAgICBqdXN0aWZ5Q29udGVudDonY2VudGVyJyxcclxuICAgICAgICBtYXJnaW46IDFcclxuICAgICAgfX1cclxuICAgID5cclxuICAgICAgPEljb25TdGF0ZSBvcGVuPXtzdGF0ZX0gLz5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgKiBhcyBhY3Rpb25zIGZyb20gJy4vYWN0aW9ucyc7XHJcbmltcG9ydCB2YWxpZGF0aW9uU3RhdGVzIGZyb20gJy4vdmFsaWRhdGlvblN0YXRlcyc7XHJcbmltcG9ydCB7IGlzQ2xpZW50VmFsaWRhdGlvblR5cGUgfSBmcm9tICcuL2NvbnN0cmFpbnRWYWxpZGF0b3JzJztcclxuaW1wb3J0IEV5ZUljb24gZnJvbSAnLi9FeWVJY29uJztcclxuaW1wb3J0IHsgdXNlQXBwQ29udGV4dCB9IGZyb20gJy4uL2FwcC1jb250ZXh0JztcclxuZnVuY3Rpb24gVmFsaWRpdHlJY29uKHsgdmFsaWQgfSkge1xyXG4gIGxldCBzdGF0ZUNvbG9yID0gJyM0ZmMzZjcnO1xyXG4gIHN3aXRjaCAodmFsaWQpIHtcclxuICAgIGNhc2UgdmFsaWRhdGlvblN0YXRlcy5WQUxJRDpcclxuICAgICAgc3RhdGVDb2xvciA9ICdncmVlbic7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQ6XHJcbiAgICAgIHN0YXRlQ29sb3IgPSAncmVkJztcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIHZhbGlkYXRpb25TdGF0ZXMuSU5BQ1RJVkU6XHJcbiAgICAgIHN0YXRlQ29sb3IgPSAnIzRmYzNmNyc7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgc3RhdGVDb2xvciA9ICcjNGZjM2Y3JztcclxuICB9XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2XHJcbiAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgZmxleDogMSxcclxuICAgICAgICBjb2xvcjogc3RhdGVDb2xvcixcclxuICAgICAgICBsaW5lSGVpZ2h0OiAyLFxyXG4gICAgICAgIHdpZHRoOiAyMCxcclxuICAgICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxyXG4gICAgICB9fVxyXG4gICAgPlxyXG4gICAgICB7dmFsaWQgPyAn4pyTJyA6ICfimJMnfVxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG5cclxuY29uc3Qgc3R5bGUgPSB7XHJcbiAgaW5wdXQ6IHtcclxuICAgIGJvcmRlcjogJzFweCBzb2xpZCcsXHJcbiAgICBwYWRkaW5nOiA4LFxyXG4gICAgZmxleDogMTAsXHJcbiAgICBib3JkZXJSYWRpdXM6IDIsXHJcbiAgfSxcclxuICByb290OiB7XHJcbiAgICBib3JkZXJSYWRpdXM6IDIsXHJcblxyXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXHJcbiAgICBiYWNrZ3JvdW5kQ29sb3I6ICd3aGl0ZScsXHJcbiAgICBib3JkZXI6ICcxcHggc29saWQgd2hpdGUnLFxyXG4gICAgbWFyZ2luQm90dG9tOiAxLFxyXG4gIH0sXHJcbiAgaW5wdXRDb250YWluZXI6IHtcclxuICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgIGZsZXg6IDEsXHJcbiAgfSxcclxuICBtZXNzYWdlOiB7XHJcbiAgICBjb2xvcjogJ3JlZCcsXHJcbiAgICBwYWRkaW5nTGVmdDogMyxcclxuICB9LFxyXG59O1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBJbnB1dCh7XHJcbiAgcGxhY2Vob2xkZXIsXHJcbiAgdHlwZSxcclxuICBuYW1lLFxyXG4gIG9uQ2hhbmdlLFxyXG4gIHZhbHVlID0gJycsXHJcbiAgdmFsaWRhdGlvblR5cGVzID0gW10sXHJcbiAgaWQsXHJcbn0pIHtcclxuICBjb25zdCB7IGZvcm0sIGF1dGggfSA9IHVzZUFwcENvbnRleHQoKTtcclxuICBjb25zdCB7IHN0YXRlLCBkaXNwYXRjaCB9ID0gZm9ybTtcclxuXHJcbiAgY29uc3QgW2lucHV0VmFsaWRhdGlvbiwgc2V0SW5wdXRWYWxpZGF0aW9uXSA9IHVzZVN0YXRlKHtcclxuICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTkFDVElWRSxcclxuICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgdmFsaWRhdGlvblR5cGU6IHVuZGVmaW5lZCxcclxuICB9KTtcclxuXHJcbiAgY29uc3QgW2lucHV0VHlwZSwgc2V0SW5wdXRUeXBlXSA9IHVzZVN0YXRlKHR5cGUpO1xyXG5cclxuICBjb25zdCBbYm9yZGVyQ29sb3IsIHNldEJvcmRlckNvbG9yXSA9IHVzZVN0YXRlKCcnKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmIChcclxuICAgICAgaW5wdXRWYWxpZGF0aW9uICYmXHJcbiAgICAgIGlucHV0VmFsaWRhdGlvbi52YWxpZGF0aW9uU3RhdGUgPT09IHZhbGlkYXRpb25TdGF0ZXMuVkFMSURcclxuICAgICkge1xyXG4gICAgICBzZXRCb3JkZXJDb2xvcignZ3JlZW4nKTtcclxuICAgIH1cclxuICAgIGlmIChcclxuICAgICAgaW5wdXRWYWxpZGF0aW9uICYmXHJcbiAgICAgIGlucHV0VmFsaWRhdGlvbi52YWxpZGF0aW9uU3RhdGUgPT09IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRFxyXG4gICAgKSB7XHJcbiAgICAgIHNldEJvcmRlckNvbG9yKCdyZWQnKTtcclxuICAgIH1cclxuICAgIGlmIChcclxuICAgICAgaW5wdXRWYWxpZGF0aW9uICYmXHJcbiAgICAgIGlucHV0VmFsaWRhdGlvbi52YWxpZGF0aW9uU3RhdGUgPT09IHZhbGlkYXRpb25TdGF0ZXMuSU5BQ1RJVkVcclxuICAgICkge1xyXG4gICAgICBzZXRCb3JkZXJDb2xvcignIzRmYzNmNycpO1xyXG4gICAgfVxyXG4gIH0sIFtpbnB1dFZhbGlkYXRpb25dKTtcclxuICBmdW5jdGlvbiBoYW5kbGVGb2N1cygpIHtcclxuICAgIHZhbGlkYXRpb25UeXBlcy5mb3JFYWNoKCh2YWxpZGF0aW9uTmFtZSkgPT4ge1xyXG4gICAgICBpZiAoc3RhdGUudmFsaWRhdGlvblt2YWxpZGF0aW9uTmFtZV0pIHtcclxuICAgICAgICBkaXNwYXRjaChcclxuICAgICAgICAgIGFjdGlvbnMucmVzZXRJbnB1dFZhbGlkYXRpb25TdGF0ZSh7IHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uTmFtZSB9KVxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuICBmdW5jdGlvbiBoYW5kbGVCbHVyKCkge1xyXG4gICAgdmFsaWRhdGlvblR5cGVzLmZvckVhY2goKHZhbGlkYXRpb25OYW1lKSA9PiB7XHJcbiAgICAgIGlmIChpc0NsaWVudFZhbGlkYXRpb25UeXBlKHsgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25OYW1lIH0pKSB7XHJcbiAgICAgICAgZGlzcGF0Y2goXHJcbiAgICAgICAgICBhY3Rpb25zLmNsaWVudFZhbGlkYXRpb24oe1xyXG4gICAgICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvbk5hbWUsXHJcbiAgICAgICAgICAgIHZhbHVlLFxyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgIGF1dGgsXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gdG9nZ2xlRXllKCkge1xyXG4gICAgaWYgKGlucHV0VHlwZSA9PT0gJ3Bhc3N3b3JkJykge1xyXG4gICAgICBzZXRJbnB1dFR5cGUoJ3RleHQnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHNldElucHV0VHlwZSgncGFzc3dvcmQnKTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3N0eWxlLnJvb3R9PlxyXG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5pbnB1dENvbnRhaW5lcn0+XHJcbiAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICBzdHlsZT17eyAuLi5zdHlsZS5pbnB1dCwgYm9yZGVyQ29sb3IgfX1cclxuICAgICAgICAgIHR5cGU9e2lucHV0VHlwZX1cclxuICAgICAgICAgIG5hbWU9e25hbWV9XHJcbiAgICAgICAgICBvbkNoYW5nZT17b25DaGFuZ2V9XHJcbiAgICAgICAgICB2YWx1ZT17dmFsdWV9XHJcbiAgICAgICAgICBvbkJsdXI9e2hhbmRsZUJsdXJ9XHJcbiAgICAgICAgICBwbGFjZWhvbGRlcj17cGxhY2Vob2xkZXJ9XHJcbiAgICAgICAgICBvbkZvY3VzPXtoYW5kbGVGb2N1c31cclxuICAgICAgICAgIGRhdGEtdGVzdGlkPXtpZH1cclxuICAgICAgICAvPlxyXG4gICAgICAgIHt2YWxpZGF0aW9uVHlwZXMubWFwKCh2YWxpZGF0aW9uTmFtZSkgPT4ge1xyXG4gICAgICAgICAgaWYgKHN0YXRlLnZhbGlkYXRpb25bdmFsaWRhdGlvbk5hbWVdKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgdmFsaWRhdGlvblN0YXRlIH0gPSBzdGF0ZS52YWxpZGF0aW9uW3ZhbGlkYXRpb25OYW1lXTtcclxuICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgIHZhbGlkYXRpb25TdGF0ZSA9PT0gdmFsaWRhdGlvblN0YXRlcy5WQUxJRCB8fFxyXG4gICAgICAgICAgICAgIHZhbGlkYXRpb25TdGF0ZSA9PT0gdmFsaWRhdGlvblN0YXRlcy5JTlZBTElEXHJcbiAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICA8VmFsaWRpdHlJY29uIGtleT17dmFsaWRhdGlvbk5hbWV9IHZhbGlkPXt2YWxpZGF0aW9uU3RhdGV9IC8+XHJcbiAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KX1cclxuICAgICAgICB7dHlwZSA9PT0gJ3Bhc3N3b3JkJyAmJiA8RXllSWNvbiBvbkNsaWNrPXt0b2dnbGVFeWV9IC8+fVxyXG4gICAgICA8L2Rpdj5cclxuICAgICAge3ZhbGlkYXRpb25UeXBlcy5tYXAoKHZhbGlkYXRpb25OYW1lKSA9PiB7XHJcbiAgICAgICAgaWYgKHN0YXRlLnZhbGlkYXRpb25bdmFsaWRhdGlvbk5hbWVdKSB7XHJcbiAgICAgICAgICBjb25zdCB7IG1lc3NhZ2UgfSA9IHN0YXRlLnZhbGlkYXRpb25bdmFsaWRhdGlvbk5hbWVdO1xyXG4gICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBrZXk9e3ZhbGlkYXRpb25OYW1lfSBzdHlsZT17c3R5bGUubWVzc2FnZX0+XHJcbiAgICAgICAgICAgICAge21lc3NhZ2UgIT09ICcnICYmIChcclxuICAgICAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgICAgcm9sZT0nbWVzc2FnZSdcclxuICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9e2BtZXNzYWdlLSR7bmFtZX1gfVxyXG4gICAgICAgICAgICAgICAgPntgKiAke21lc3NhZ2V9YH08L2Rpdj5cclxuICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KX1cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZVRoZW1lQ29udGV4dCB9IGZyb20gJy4uL3RoZW1lL3RoZW1lLWNvbnRleHQnO1xyXG5pbXBvcnQgJy4vY3NzL3N0eWxlLmNzcyc7XHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEJ1dHRvbih7XHJcbiAgb25DbGljayxcclxuICB0aXRsZSxcclxuICBkaXNhYmxlZCxcclxuICBpZCxcclxuICBjb2xvciA9ICdwcmltYXJ5JyxcclxufSkge1xyXG4gIGNvbnN0IHRoZW1lID0gdXNlVGhlbWVDb250ZXh0KCk7XHJcbiAgcmV0dXJuIChcclxuICAgIDxidXR0b25cclxuICAgICAgY2xhc3NOYW1lPSdidG4nXHJcbiAgICAgIGRhdGEtdGVzdGlkPXtpZH1cclxuICAgICAgZGlzYWJsZWQ9e2Rpc2FibGVkfVxyXG4gICAgICBzdHlsZT17eyAuLi50aGVtZVtjb2xvcl0gfX1cclxuICAgICAgb25DbGljaz17b25DbGlja31cclxuICAgID5cclxuICAgICAge3RpdGxlfVxyXG4gICAgPC9idXR0b24+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlTWVkaWFRdWVyeSB9IGZyb20gJy4uL2xheW91dC91c2VNZWRpYVF1ZXJ5JztcclxuLy9pbXBvcnQgJy4vY3NzL3N0eWxlLmNzcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBGb3JtKHsgY2hpbGRyZW4sIGZvcm1UaXRsZSwgZXJyb3IgfSkge1xyXG4gIGNvbnN0IHsgZGV2aWNlIH0gPSB1c2VNZWRpYVF1ZXJ5O1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2XHJcbiAgICAvL2NsYXNzTmFtZT1cInBhcGVyXCJcclxuICAgIC8vICBzdHlsZT17eyB3aWR0aDogZGV2aWNlID09PSAncGhvbmUnID8gJzEwMCUnIDogMzUwIH19XHJcbiAgICA+XHJcbiAgICAgIDxsZWdlbmQ+e2Zvcm1UaXRsZX06PC9sZWdlbmQ+XHJcbiAgICAgIHtjaGlsZHJlbn1cclxuICAgICAge2Vycm9yICYmIChcclxuICAgICAgICA8ZGl2XHJcbiAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICBjb2xvcjogJ3JlZCcsXHJcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJ3doaXRlJyxcclxuICAgICAgICAgICAgcGFkZGluZzogNSxcclxuICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiA1LFxyXG4gICAgICAgICAgfX1cclxuICAgICAgICA+XHJcbiAgICAgICAgICAqIHtlcnJvci5tZXNzYWdlfVxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApfVxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuXHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gIGJveFNoYWRvdzogYDBweCAzcHggM3B4IC0ycHggcmdiYSgwLCAwLCAwLCAwLjIpLFxyXG4gICAgMHB4IDNweCA0cHggMHB4IHJnYmEoMCwgMCwgMCwgMC4xNCksIDBweCAxcHggOHB4IDBweCByZ2JhKDAsIDAsIDAsIDAuMTIpYCxcclxuICBtYXJnaW46IDgsXHJcbiAgcGFkZGluZzogOCxcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBQYXBlcihwcm9wcykge1xyXG4gIGNvbnN0IHsgY2hpbGRyZW4gfSA9IHByb3BzO1xyXG4gIHJldHVybiA8ZGl2IHN0eWxlPXtzdHlsZX0+e2NoaWxkcmVufTwvZGl2PjtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBHcmlkKHByb3BzKSB7XHJcbiAgY29uc3QgeyBjaGlsZHJlbiwgd2lkdGggfSA9IHByb3BzO1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2XHJcbiAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgZGlzcGxheTogJ2dyaWQnLFxyXG4gICAgICAgIGdyaWRUZW1wbGF0ZUNvbHVtbnM6IGBhdXRvICR7d2lkdGh9JSBhdXRvYCxcclxuICAgICAgfX1cclxuICAgID5cclxuICAgICAgPGRpdj48L2Rpdj5cclxuICAgICAgPGRpdj57Y2hpbGRyZW59PC9kaXY+XHJcbiAgICAgIDxkaXY+PC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCBhY3Rpb25UeXBlcyBmcm9tICcuL2FjdGlvblR5cGVzJztcclxuaW1wb3J0IHsgc2VydmVyVmFsaWRhdGlvbiB9IGZyb20gJy4uL2Zvcm0vYWN0aW9ucyc7XHJcbmltcG9ydCBodHRwU3RhdHVzIGZyb20gJy4uL2Zvcm0vaHR0cC1zdGF0dXMnO1xyXG5leHBvcnQgZnVuY3Rpb24gdmFsdWVDaGFuZ2VkKHsgcHJvcE5hbWUsIHZhbHVlIH0pIHtcclxuICByZXR1cm4ge1xyXG4gICAgdHlwZTogYWN0aW9uVHlwZXMuVkFMVUVfQ0hBTkdFRCxcclxuICAgIHBheWxvYWQ6IHtcclxuICAgICAgcHJvcE5hbWUsXHJcbiAgICAgIHZhbHVlLFxyXG4gICAgfSxcclxuICB9O1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbG9naW4oeyBkaXNwYXRjaCwgc3RhdGUsIGZvcm1EaXNwYXRjaCB9KSB7XHJcblxyXG4gIHRyeSB7XHJcbiAgICBjb25zdCB7IGVtYWlsb3J1c2VybmFtZSwgcGFzc3dvcmQgfSA9IHN0YXRlO1xyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5MT0dJTl9TVEFSVEVEIH0pO1xyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL2F1dGgvbG9naW5gLCB7XHJcbiAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAnQ29udGVuLVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXHJcbiAgICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnOiAnKicsXHJcbiAgICAgICAgQXV0aG9yaXphdGlvbjogYEJhc2ljICR7YnRvYShgJHtlbWFpbG9ydXNlcm5hbWV9OiR7cGFzc3dvcmR9YCl9YCxcclxuICAgICAgfSxcclxuICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgIH0pO1xyXG4gXHJcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgXHJcbiAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5MT0dJTl9TVUNDRVNTLCB0b2tlbjogcmVzdWx0LnRva2VuIH0pO1xyXG4gICAgfSBlbHNlIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDQwMCkge1xyXG4gICAgXHJcbiAgICAgIGNvbnN0IHsgZXJyb3JzIH0gPSByZXN1bHQ7XHJcbiAgXHJcbiAgICAgIGVycm9ycy5mb3JFYWNoKChlcnJvcikgPT4ge1xyXG4gICAgICAgIGZvcm1EaXNwYXRjaChcclxuICAgICAgICAgIHNlcnZlclZhbGlkYXRpb24oe1xyXG4gICAgICAgICAgICBzdGF0dXM6IGVycm9yLFxyXG4gICAgICAgICAgfSlcclxuICAgICAgICApO1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignTG9naW4gZmFpbGVkJyk7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuXHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkxPR0lOX0ZBSUxFRCwgcGF5bG9hZDogeyBlcnJvciB9IH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNpZ251cCh7IGRpc3BhdGNoLCBmb3JtRGlzcGF0Y2gsIHN0YXRlIH0pIHtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNJR05VUF9TVEFSVEVEIH0pO1xyXG4gIGNvbnN0IHsgZW1haWwsIHBhc3N3b3JkLCB1c2VybmFtZSB9ID0gc3RhdGU7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYC9hdXRoL3NpZ251cGAsIHtcclxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBwYXNzd29yZCwgZW1haWwsIHVzZXJuYW1lIH0pLFxyXG4gICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgQ29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcclxuICAgICAgICBBY2NlcHQ6ICdhcHBsaWNhdGlvbi9qc29uJyxcclxuICAgICAgfSxcclxuICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICB9KTtcclxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNJR05VUF9TVUNDRVNTLCB0b2tlbjogcmVzdWx0LnRva2VuIH0pO1xyXG4gICAgfSBlbHNlIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDQwMCkge1xyXG4gICAgICBjb25zdCB7IGVycm9ycyB9ID0gcmVzdWx0O1xyXG4gICAgICBlcnJvcnMuZm9yRWFjaCgoZXJyb3IpID0+IHtcclxuICAgICAgXHJcbiAgICAgICAgZm9ybURpc3BhdGNoKFxyXG4gICAgICAgICAgc2VydmVyVmFsaWRhdGlvbih7XHJcbiAgICAgICAgICAgIHN0YXR1czogZXJyb3IsXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdTaWdudXAgZmFpbGVkJyk7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0lHTlVQX0ZBSUxFRCwgcGF5bG9hZDogeyBlcnJvciB9IH0pO1xyXG4gIH1cclxufVxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbG9nb3V0KHsgZGlzcGF0Y2gsIHN0YXRlIH0pIHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgeyB0b2tlbiB9ID0gc3RhdGU7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxyXG4gICAgICBgL2F1dGgvbG9nb3V0PyR7bmV3IFVSTFNlYXJjaFBhcmFtcyh7XHJcbiAgICAgICAgdG9rZW4sXHJcbiAgICAgIH0pfWBcclxuICAgICk7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkxPR09VVF9TVEFSVEVEIH0pO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkxPR09VVF9GQUlMRUQsIGVycm9yIH0pO1xyXG4gIH1cclxufVxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY2hhbmdlUGFzc3dvcmQoeyBkaXNwYXRjaCwgc3RhdGUsIGZvcm1EaXNwYXRjaCB9KSB7XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfU1RBUlRFRCB9KTtcclxuICB0cnkge1xyXG4gICAgY29uc3QgeyBjb25maXJtLCBwYXNzd29yZCwgdG9rZW4sIGVtYWlsb3J1c2VybmFtZSwgY3VycmVudCB9ID0gc3RhdGU7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxyXG4gICAgICBgL2F1dGgvY2hhbmdlcGFzc2AsXHJcbiAgICAgIHtcclxuICAgICAgICBtZXRob2Q6ICdwdXQnLFxyXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgIGNvbmZpcm0sXHJcbiAgICAgICAgICBwYXNzd29yZCxcclxuICAgICAgICAgIGN1cnJlbnQsXHJcbiAgICAgICAgICB0b2tlbixcclxuICAgICAgICAgIGVtYWlsb3J1c2VybmFtZSxcclxuICAgICAgICB9KSxcclxuICAgICAgfVxyXG4gICAgKTtcclxuXHJcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgZGlzcGF0Y2goe1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLkNIQU5HRV9QQVNTV09SRF9TVUNDRVNTLFxyXG4gICAgICAgIHRva2VuOiByZXN1bHQudG9rZW4sXHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDQwMCkge1xyXG4gICAgICBjb25zdCB7IGVycm9ycyB9ID0gcmVzdWx0O1xyXG4gICAgICBlcnJvcnMuZm9yRWFjaCgoZXJyb3IpID0+IHtcclxuICAgICAgICBmb3JtRGlzcGF0Y2goXHJcbiAgICAgICAgICBzZXJ2ZXJWYWxpZGF0aW9uKHtcclxuICAgICAgICAgICAgc3RhdHVzOiBlcnJvcixcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNTAwKSB7XHJcbiAgICAgIGNvbnN0IHsgZXJyb3IgfSA9IHJlc3VsdDtcclxuXHJcbiAgICAgIGRpc3BhdGNoKHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfRkFJTEVELFxyXG4gICAgICAgIGVycm9yLFxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2hhbmdpbmcgcGFzc3dvcmQgZmFpbGVkJyk7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGRpc3BhdGNoKHtcclxuICAgICAgdHlwZTogYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX0ZBSUxFRCxcclxuICAgICAgcGF5bG9hZDogeyBlcnJvciB9LFxyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZm9yZ290UGFzc3dvcmQoeyBkaXNwYXRjaCwgc3RhdGUsIGZvcm1EaXNwYXRjaCB9KSB7XHJcbiAgdHJ5IHtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuUkVRVUVTVF9QQVNTX0NIQU5HRV9TVEFSVEVEIH0pO1xyXG4gICAgY29uc3QgeyBlbWFpbCB9ID0gc3RhdGU7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxyXG4gICAgICBgL2F1dGgvcmVxdWVzdHBhc3NjaGFuZ2VgLFxyXG4gICAgICB7XHJcbiAgICAgICAgbWV0aG9kOiAncG9zdCcsXHJcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBlbWFpbCB9KSxcclxuICAgICAgfVxyXG4gICAgKTtcclxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICBkaXNwYXRjaCh7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX1NVQ0NFU1MsXHJcbiAgICAgICAgdG9rZW46IHJlc3VsdC50b2tlbixcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDAwKSB7XHJcbiAgICAgIGNvbnN0IHsgZXJyb3JzIH0gPSByZXN1bHQ7XHJcbiAgICAgIGVycm9ycy5mb3JFYWNoKChlcnJvcikgPT4ge1xyXG4gICAgICAgIGZvcm1EaXNwYXRjaChcclxuICAgICAgICAgIHNlcnZlclZhbGlkYXRpb24oe1xyXG4gICAgICAgICAgICBzdGF0dXM6IGVycm9yLFxyXG4gICAgICAgICAgfSlcclxuICAgICAgICApO1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA1MDApIHtcclxuICAgICAgY29uc3QgeyBlcnJvciB9ID0gcmVzdWx0O1xyXG5cclxuICAgICAgZGlzcGF0Y2goe1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLkNIQU5HRV9QQVNTV09SRF9GQUlMRUQsXHJcbiAgICAgICAgZXJyb3IsXHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDaGFuZ2luZyBwYXNzd29yZCBmYWlsZWQnKTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgZGlzcGF0Y2goe1xyXG4gICAgICB0eXBlOiBhY3Rpb25UeXBlcy5SRVFVRVNUX1BBU1NfQ0hBTkdFX0ZBSUxFRCxcclxuICAgICAgcGF5bG9hZDogeyBlcnJvcjogZXJyIH0sXHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRUb2tlbkZyb21VcmwoeyB0b2tlbiB9KSB7XHJcbiAgcmV0dXJuIHtcclxuICAgIHR5cGU6IGFjdGlvblR5cGVzLkdPVF9UT0tFTl9GUk9NX1VSTCxcclxuICAgIHRva2VuLFxyXG4gIH07XHJcbn1cclxuIl0sIm5hbWVzIjpbIkVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OIiwiUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT04iLCJVU0VSTkFNRV9GT1JNQVRfVkFMSURBVElPTiIsIlVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OIiwiRU1QVFlfU1RSSU5HX1ZBTElEQVRJT04iLCJQQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTiIsIklOVkFMSURfQ1JFREVOVElBTFMiLCJVU0VSTkFNRV9UQUtFTiIsIlJFR0lTVEVSRURfRU1BSUwiLCJFTUFJTF9OT1RfUkVHSVNURVJFRCIsIlVTRVJOQU1FX05PVF9SRUdJU1RFUkVEIiwiSU5WQUxJRF9QQVNTV09SRCIsIklOVkFMSURfRU1BSUwiLCJJTlZBTElEX1VTRVJOQU1FIiwiSU5WQUxJRF9FTVBUWV9TVFJJTkciLCJJTlZBTElEX1VTRVJOQU1FX09SX0VNQUlMIiwiUEFTU1dPUkRTX0RPX05PVF9NQVRDSCIsInBhc3N3b3JkUmVnZXgiLCJlbWFpbFJlZ2V4IiwidXNlcm5hbWVSZWdleCIsInZhbGlkYXRlRW1haWxDb25zdHJhaW50IiwiZW1haWwiLCJlbWFpbENvbnN0cmFpbnQiLCJSZWdFeHAiLCJ0ZXN0IiwidmFsaWRhdGlvblR5cGUiLCJ2YWxpZGF0aW9uVHlwZXMiLCJ2YWxpZGF0aW9uU3RhdGUiLCJWQUxJRCIsIm1lc3NhZ2UiLCJJTlZBTElEIiwidmFsaWRhdGlvbk1lc3NhZ2VzIiwiaXNDbGllbnRWYWxpZGF0aW9uVHlwZSIsInZhbGlkYXRlUGFzc3dvcmRDb25zdHJhaW50IiwicGFzc3dvcmQiLCJwYXNzd29yZENvbnN0cmFpbnQiLCJ2YWxpZGF0ZVVzZXJOYW1lQ29uc3RyYWludCIsInVzZXJuYW1lIiwidXNlcm5hbWVDb25zdHJhaW50IiwidmFsaWRhdGVFbWFpbE9yVXNlcm5hbWUiLCJ2YWx1ZSIsInZhbGlkYXRlRW1wdHlTdHJpbmciLCJsZW5ndGgiLCJ2YWxpZGF0ZVBhc3N3b3JkTWF0Y2giLCJhdXRoIiwiY29uZmlybSIsInN0YXRlIiwiY3JlZGVudGlhbEludmFsaWQiLCJ1c2VybmFtZUlzVGFrZW4iLCJlbWFpbElzUmVnaXN0ZXJlZCIsInVzZXJuYW1lSW52YWxpZCIsInBhc3N3b3JkSW52YWxpZCIsImVtYWlsSW52YWxpZCIsImVtYWlsSXNOb3RSZWdpc3RlcmVkIiwiZW1wdHlTdHJpbmdOb3RWYWxpZCIsImVtYWlsb3J1c2VybmFtZU5vdFZhbGlkIiwidXNlcm5hbWVJc05vdFJlZ2lzdGVyZWQiLCJwYXNzd29yZERvTm90TWF0Y2giLCJ0b2tlbkV4cGlyZWQiLCJzZXJ2ZXJWYWxpZGF0aW9uUmFuZ2UiLCJzdGF0dXMiLCJjbGllbnRWYWxpZGF0aW9uIiwidmFsaWRhdGlvbiIsImNvbnN0VmFsVHlwZXMiLCJ2YWxpZGF0aW9ucyIsInR5cGUiLCJhY3Rpb25UeXBlcyIsIkNMSUVOVF9WQUxJREFUSU9OIiwicmVzZXRJbnB1dFZhbGlkYXRpb25TdGF0ZSIsIlJFU0VUX1ZBTElEQVRJT05fU1RBVEUiLCJzZXJ2ZXJWYWxpZGF0aW9uIiwiaHR0cFN0YXR1cyIsIlNFUlZFUl9WQUxJREFUSU9OIiwidmFsaWRhdGlvblN0YXRlcyIsImltZyIsIkljb25TdGF0ZSIsIm9wZW4iLCJvcGVuSWNvbiIsImNsb3NlSWNvbiIsIkV5ZUljb24iLCJvbkNsaWNrIiwic2V0U3RhdGUiLCJ1c2VTdGF0ZSIsInRvZ2dsZSIsInByZXYiLCJkaXNwbGF5IiwiYWxpZ25JdGVtcyIsImp1c3RpZnlDb250ZW50IiwibWFyZ2luIiwiVmFsaWRpdHlJY29uIiwidmFsaWQiLCJzdGF0ZUNvbG9yIiwiSU5BQ1RJVkUiLCJmbGV4IiwiY29sb3IiLCJsaW5lSGVpZ2h0Iiwid2lkdGgiLCJ0ZXh0QWxpZ24iLCJzdHlsZSIsImlucHV0IiwiYm9yZGVyIiwicGFkZGluZyIsImJvcmRlclJhZGl1cyIsInJvb3QiLCJmbGV4RGlyZWN0aW9uIiwiYmFja2dyb3VuZENvbG9yIiwibWFyZ2luQm90dG9tIiwiaW5wdXRDb250YWluZXIiLCJwYWRkaW5nTGVmdCIsIklucHV0IiwicGxhY2Vob2xkZXIiLCJuYW1lIiwib25DaGFuZ2UiLCJpZCIsImZvcm0iLCJ1c2VBcHBDb250ZXh0IiwiZGlzcGF0Y2giLCJpbnB1dFZhbGlkYXRpb24iLCJzZXRJbnB1dFZhbGlkYXRpb24iLCJ1bmRlZmluZWQiLCJpbnB1dFR5cGUiLCJzZXRJbnB1dFR5cGUiLCJib3JkZXJDb2xvciIsInNldEJvcmRlckNvbG9yIiwidXNlRWZmZWN0IiwiaGFuZGxlRm9jdXMiLCJmb3JFYWNoIiwidmFsaWRhdGlvbk5hbWUiLCJhY3Rpb25zIiwiaGFuZGxlQmx1ciIsInRvZ2dsZUV5ZSIsIm1hcCIsIkJ1dHRvbiIsInRpdGxlIiwiZGlzYWJsZWQiLCJ0aGVtZSIsInVzZVRoZW1lQ29udGV4dCIsIkZvcm0iLCJjaGlsZHJlbiIsImZvcm1UaXRsZSIsImVycm9yIiwiYm94U2hhZG93IiwiUGFwZXIiLCJwcm9wcyIsIkdyaWQiLCJncmlkVGVtcGxhdGVDb2x1bW5zIiwidmFsdWVDaGFuZ2VkIiwicHJvcE5hbWUiLCJWQUxVRV9DSEFOR0VEIiwicGF5bG9hZCIsImxvZ2luIiwiZm9ybURpc3BhdGNoIiwiZW1haWxvcnVzZXJuYW1lIiwiTE9HSU5fU1RBUlRFRCIsInJlc3BvbnNlIiwiZmV0Y2giLCJoZWFkZXJzIiwiQXV0aG9yaXphdGlvbiIsImJ0b2EiLCJtZXRob2QiLCJyZXN1bHQiLCJqc29uIiwiTE9HSU5fU1VDQ0VTUyIsInRva2VuIiwiZXJyb3JzIiwiRXJyb3IiLCJMT0dJTl9GQUlMRUQiLCJzaWdudXAiLCJTSUdOVVBfU1RBUlRFRCIsImJvZHkiLCJKU09OIiwic3RyaW5naWZ5IiwiQ29udGVudFR5cGUiLCJBY2NlcHQiLCJTSUdOVVBfU1VDQ0VTUyIsIlNJR05VUF9GQUlMRUQiLCJjaGFuZ2VQYXNzd29yZCIsIkNIQU5HRV9QQVNTV09SRF9TVEFSVEVEIiwiY3VycmVudCIsIkNIQU5HRV9QQVNTV09SRF9TVUNDRVNTIiwiQ0hBTkdFX1BBU1NXT1JEX0ZBSUxFRCIsImZvcmdvdFBhc3N3b3JkIiwiUkVRVUVTVF9QQVNTX0NIQU5HRV9TVEFSVEVEIiwiUkVRVUVTVF9QQVNTX0NIQU5HRV9GQUlMRUQiLCJlcnIiXSwibWFwcGluZ3MiOiI7O0FBQUEsc0JBQWU7QUFDYjtBQUNBQSxFQUFBQSx1QkFBdUIsRUFBRSx5QkFGWjtBQUdiQyxFQUFBQSwwQkFBMEIsRUFBRSw0QkFIZjtBQUliQyxFQUFBQSwwQkFBMEIsRUFBRSw0QkFKZjtBQUtiQyxFQUFBQSxtQ0FBbUMsRUFBRSxxQ0FMeEI7QUFNYkMsRUFBQUEsdUJBQXVCLEVBQUUseUJBTlo7QUFPYkMsRUFBQUEsMEJBQTBCLEVBQUUsNEJBUGY7QUFRYjtBQUNBQyxFQUFBQSxtQkFBbUIsRUFBRSxxQkFUUjtBQVViQyxFQUFBQSxjQUFjLEVBQUUsZ0JBVkg7QUFXYkMsRUFBQUEsZ0JBQWdCLEVBQUUsa0JBWEw7QUFZYkMsRUFBQUEsb0JBQW9CLEVBQUUsc0JBWlQ7QUFhYkMsRUFBQUEsdUJBQXVCLEVBQUM7QUFiWCxDQUFmOztBQ0FBLHlCQUFlO0FBQ2JDLEVBQUFBLGdCQUFnQixFQUNkLHFIQUZXO0FBR2JDLEVBQUFBLGFBQWEsRUFBRSwyQkFIRjtBQUliSCxFQUFBQSxvQkFBb0IsRUFBRSx5QkFKVDtBQUtiQyxFQUFBQSx1QkFBdUIsRUFBRSw0QkFMWjtBQU1iRyxFQUFBQSxnQkFBZ0IsRUFDZCw2REFQVztBQVFiQyxFQUFBQSxvQkFBb0IsRUFBRSw2QkFSVDtBQVNiQyxFQUFBQSx5QkFBeUIsRUFBRSxnQ0FUZDtBQVViVCxFQUFBQSxtQkFBbUIsRUFBRSw4QkFWUjtBQVdiQyxFQUFBQSxjQUFjLEVBQUUsMkJBWEg7QUFZYkMsRUFBQUEsZ0JBQWdCLEVBQUUsNkJBWkw7QUFhYlEsRUFBQUEsc0JBQXNCLEVBQUU7QUFiWCxDQUFmOztBQ0FPLE1BQU1DLGFBQWEsR0FBRyxzREFBdEI7QUFFQSxNQUFNQyxVQUFVLEdBQUcsd0lBQW5CO0FBRUEsTUFBTUMsYUFBYSxHQUFHLDBCQUF0Qjs7QUNBQSxTQUFTQyx1QkFB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
