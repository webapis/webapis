import { s as styleInject, v, h, M, T, m, a as s, _ as _extends, p, b as actionTypes$1 } from './index-82d4eea2.js';

var css_248z = ".auth-form {\r\n  background-color: #455a64;\r\n  padding: 5px;\r\n  border: 1px solid white;\r\n  border-radius: 5px;\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-box-orient: vertical;\r\n  -webkit-box-direction: normal;\r\n      -ms-flex-direction: column;\r\n          flex-direction: column;\r\n}\r\n\r\n.auth-form input {\r\n  padding: 5px;\r\n  margin: 5px;\r\n}\r\n\r\n.auth-form button {\r\n  padding: 5px;\r\n  margin: 5px;\r\n}\r\n\r\n.auth-form fieldset {\r\n  padding: 10px;\r\n  color: white;\r\n}\r\n\r\n.auth-form a {\r\n  color: white;\r\n}\r\n\r\n.main-content {\r\n  background-color: #546e7a;\r\n  position: fixed;\r\n  left: 320px;\r\n  top: 100px;\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  width: 80%;\r\n  height: 80%;\r\n  padding: 5px;\r\n}\r\n\r\n.loading {\r\n  height: 100%;\r\n  width: 100%;\r\n  color: white;\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-box-pack: center;\r\n      -ms-flex-pack: center;\r\n          justify-content: center;\r\n  -webkit-box-align: center;\r\n      -ms-flex-align: center;\r\n          align-items: center;\r\n}\r\n\r\ninput:invalid {\r\n  -webkit-box-shadow: 0 0 5px 1px red;\r\n          box-shadow: 0 0 5px 1px red;\r\n  color: red;\r\n}\r\n\r\n.btn {\r\n  border-radius: 2px;\r\n  height: 33px;\r\n}";
styleInject(css_248z);

var validationStates = {
  VALID: 'VALID',
  INVALID: 'INVALID',
  INACTIVE: 'INACTIVE'
};

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

var actionTypes = {
  INIT_FORM_VALIDATION_STATE: 'INIT_FORM_VALIDATION_STATE',
  RESET_VALIDATION_STATE: 'RESET_VALIDATION_STATE',
  INPUT_BLURRED: 'INPUT_BLURRED',
  INPUT_FOCUSED: 'INPUT_FOCUSED',
  SERVER_VALIDATION: 'SERVER_VALIDATION',
  CLIENT_VALIDATION: 'CLIENT_VALIDATION',
  INC_INPUT_COUTN: 'INC_INPUT_COUTN'
};

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
      debugger;
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

const initState = {
  validation: {}
};
function formReducer(state, action) {
  let nextState = null;

  switch (action.type) {
    case actionTypes.SERVER_VALIDATION:
      nextState = { ...state,
        validation: { ...state.validation,
          [action.validationType]: {
            validationState: action.validationState,
            message: action.message
          }
        }
      };
      return nextState;

    case actionTypes.CLIENT_VALIDATION:
      nextState = { ...state,
        validation: { ...state.validation,
          [action.validationType]: {
            validationState: action.validationState,
            message: action.message
          }
        }
      };
      return nextState;

    case actionTypes.RESET_VALIDATION_STATE:
      return { ...state,
        validation: { ...state.validation,
          [action.validationType]: {
            validationState: validationStates.INACTIVE,
            message: ''
          }
        }
      };

    case actionTypes.INPUT_FOCUSED:
      return { ...state,
        validation: { ...state.validation,
          formState: validationStates.INACTIVE,
          [action.propName]: {
            validationState: validationStates.INACTIVE,
            message: ''
          }
        }
      };

    case actionTypes.INIT_FORM_VALIDATION_STATE:
      return { ...state,
        validation: { ...state.validation,
          formState: validationStates.INACTIVE
        }
      };

    case actionTypes.INC_INPUT_COUTN:
      return { ...state,
        count: state.count + 1
      };

    default:
      return state;
  }
}

const FormContext = M();
function useFormContext() {
  const context = T(FormContext);

  if (!context) {
    throw new Error('useFormContext must be used with AppProvider');
  }

  const [state, dispatch] = context;
  return {
    state,
    dispatch
  };
}
function FormProvider(props) {
  const [state, dispatch] = m(formReducer, initState);
  const value = s(() => [state, dispatch], [state]);
  return h(FormContext.Provider, _extends({
    value: value
  }, props));
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
    margin: 1,
    border: '1px solid',
    padding: 8,
    flex: 10,
    borderRadius: 2
  },
  root: {
    borderRadius: 2,
    margin: 3,
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

function Button({
  onClick,
  title,
  disabled,
  id
}) {
  return h("button", {
    "data-testid": id,
    disabled: disabled,
    style: {
      borderRadius: 2,
      height: 33
    },
    onClick: onClick
  }, title);
}

const style$1 = {
  display: 'flex',
  flexDirection: 'column'
};
function Form({
  children,
  formTitle,
  error
}) {
  return h(FormProvider, null, h("fieldset", {
    style: style$1
  }, h("legend", null, formTitle, ":"), children, error && h("div", {
    style: {
      color: 'red',
      backgroundColor: 'white',
      padding: 5,
      borderRadius: 5
    }
  }, "* ", error.message)));
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
  state
}) {
  try {
    const {
      emailorusername,
      password
    } = state;
    dispatch({
      type: actionTypes$1.LOGIN_STARTED
    });
    const response = await fetch(`${"http://localhost:10001"}/auth/login`, {
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
      const {
        errors
      } = result;
      errors.forEach(error => {
        dispatch(serverValidation({
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
    const response = await fetch(`${"http://localhost:10001"}/auth/signup`, {
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
        dispatch(serverValidation({
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
    const response = await fetch(`${"http://localhost:10001"}/auth/changepass`, {
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
  state
}) {
  try {
    dispatch({
      type: actionTypes$1.REQUEST_PASS_CHANGE_STARTED
    });
    const {
      email
    } = state;
    const response = await fetch('/requestpasschange', {
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
      type: actionTypes$1.REQUEST_PASS_CHANGE_FAILED,
      payload: {
        error: err
      }
    });
  }
}

export { Button as B, Form as F, Input as I, valueChanged as a, changePassword as c, forgotPassword as f, login as l, signup as s, validationTypes as v };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9ucy0zNTRiNDBmYy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY2xpZW50L2Zvcm0vdmFsaWRhdGlvblN0YXRlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL3ZhbGlkYXRpb25UeXBlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL3ZhbGlkYXRpb25NZXNzYWdlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL3ZhbGlkYXRpb25SZWdleC5qcyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL2NvbnN0cmFpbnRWYWxpZGF0b3JzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vYWN0aW9uVHlwZXMuanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS9odHRwLXN0YXR1cy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL2FjdGlvbnMuanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS9pY29ucy9vcGVuRXllLnBuZyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL2ljb25zL2Nsb3NlRXllLnBuZyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL0V5ZUljb24uanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS9mb3JtUmVkdWNlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL2Zvcm0tY29udGV4dC5qcyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL0lucHV0LmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vQnV0dG9uLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vRm9ybS5qcyIsIi4uLy4uLy4uL2NsaWVudC9hdXRoL2FjdGlvbnMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQge1xyXG4gIFZBTElEOiAnVkFMSUQnLFxyXG4gIElOVkFMSUQ6ICdJTlZBTElEJyxcclxuICBJTkFDVElWRTogJ0lOQUNUSVZFJ1xyXG59O1xyXG4iLCJleHBvcnQgZGVmYXVsdCB7XHJcbiAgLy9jb25zdHJhaW50XHJcbiAgRU1BSUxfRk9STUFUX1ZBTElEQVRJT046ICdFTUFJTF9GT1JNQVRfVkFMSURBVElPTicsXHJcbiAgUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT046ICdQQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTicsXHJcbiAgVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT046ICdVU0VSTkFNRV9GT1JNQVRfVkFMSURBVElPTicsXHJcbiAgVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT046ICdVU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTicsXHJcbiAgRU1QVFlfU1RSSU5HX1ZBTElEQVRJT046ICdFTVBUWV9TVFJJTkdfVkFMSURBVElPTicsXHJcbiAgUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT046ICdQQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTicsXHJcbiAgLy9hdXRoXHJcbiAgSU5WQUxJRF9DUkVERU5USUFMUzogJ0lOVkFMSURfQ1JFREVOVElBTFMnLFxyXG4gIFVTRVJOQU1FX1RBS0VOOiAnVVNFUk5BTUVfVEFLRU4nLFxyXG4gIFJFR0lTVEVSRURfRU1BSUw6ICdSRUdJU1RFUkVEX0VNQUlMJyxcclxuICBFTUFJTF9OT1RfUkVHSVNURVJFRDogJ0VNQUlMX05PVF9SRUdJU1RFUkVEJyxcclxuICBVU0VSTkFNRV9OT1RfUkVHSVNURVJFRDonVVNFUk5BTUVfTk9UX1JFR0lTVEVSRUQnXHJcbn07XHJcbiIsImV4cG9ydCBkZWZhdWx0IHtcclxuICBJTlZBTElEX1BBU1NXT1JEOlxyXG4gICAgJ2F0IGxlYXN0IDggY2hhcmFjdGVycywgbXVzdCBjb250YWluIGF0IGxlYXN0IDEgdXBwZXJjYXNlIGxldHRlciwgMSBsb3dlcmNhc2UgbGV0dGVyLCBDYW4gY29udGFpbiBzcGVjaWFsIGNoYXJhY3RlcnMnLFxyXG4gIElOVkFMSURfRU1BSUw6ICdlbWFpbCBmb3JtYXQgaXMgbm90IHZhbGlkJyxcclxuICBFTUFJTF9OT1RfUkVHSVNURVJFRDogJ2VtYWlsIGlzIG5vdCByZWdpc3RlcmVkJyxcclxuICBVU0VSTkFNRV9OT1RfUkVHSVNURVJFRDogJ3VzZXJuYW1lIGlzIG5vdCByZWdpc3RlcmVkJyxcclxuICBJTlZBTElEX1VTRVJOQU1FOlxyXG4gICAgJ29ubHkgTGV0dGVycyBhLXogb3IgQS1aIGFuZCB0aGUgU3ltYm9scyAtIGFuZCBfIGFyZSBhbGxvd2VkJyxcclxuICBJTlZBTElEX0VNUFRZX1NUUklORzogJ2VtcHR5IHN0cmluZyBpcyBub3QgYWxsb3dlZCcsXHJcbiAgSU5WQUxJRF9VU0VSTkFNRV9PUl9FTUFJTDogJ2VtYWlsIG9yIHVzZXJuYW1lIGlzIG5vdCB2YWxpZCcsXHJcbiAgSU5WQUxJRF9DUkVERU5USUFMUzogJ2ludmFsaWQgY3JlZGVudGlhbHMgcHJvdmlkZWQnLFxyXG4gIFVTRVJOQU1FX1RBS0VOOiAndXNlcm5hbWUgaXMgYWxyZWFkeSB0YWtlbicsXHJcbiAgUkVHSVNURVJFRF9FTUFJTDogJ2VtYWlsIGlzIGFscmVhZHkgcmVnaXN0ZXJlZCcsXHJcbiAgUEFTU1dPUkRTX0RPX05PVF9NQVRDSDogJ3Bhc3N3b3JkcyBkbyBub3QgbWF0Y2gnXHJcbn07XHJcbiIsImV4cG9ydCBjb25zdCBwYXNzd29yZFJlZ2V4ID0gL14oPz0uKlxcZCkoPz0uKlthLXpdKSg/PS4qW0EtWl0pKD89LipbYS16QS1aXSkuezgsfSQvZztcclxuXHJcbmV4cG9ydCBjb25zdCBlbWFpbFJlZ2V4ID0gL1thLXowLTkhIyQlJicqKy89P15fYHt8fX4tXSsoPzpcXC5bYS16MC05ISMkJSYnKisvPT9eX2B7fH1+LV0rKSpAKD86W2EtejAtOV0oPzpbYS16MC05LV0qW2EtejAtOV0pP1xcLikrW2EtejAtOV0oPzpbYS16MC05LV0qW2EtejAtOV0pPy9nO1xyXG5cclxuZXhwb3J0IGNvbnN0IHVzZXJuYW1lUmVnZXggPSAvW2EtekEtWl0rWy1fXSpbYS16QS1aXSsvZztcclxuIiwiaW1wb3J0IHZhbGlkYXRpb25TdGF0ZSBmcm9tICcuL3ZhbGlkYXRpb25TdGF0ZXMnO1xyXG5pbXBvcnQgdmFsaWRhdGlvblR5cGVzIGZyb20gJy4vdmFsaWRhdGlvblR5cGVzJztcclxuaW1wb3J0IHZhbGlkYXRpb25NZXNzYWdlcyBmcm9tICcuL3ZhbGlkYXRpb25NZXNzYWdlcyc7XHJcbmltcG9ydCB7IGVtYWlsUmVnZXgsIHBhc3N3b3JkUmVnZXgsIHVzZXJuYW1lUmVnZXggfSBmcm9tICcuL3ZhbGlkYXRpb25SZWdleCc7XHJcbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUVtYWlsQ29uc3RyYWludCh7IGVtYWlsIH0pIHtcclxuICBjb25zdCBlbWFpbENvbnN0cmFpbnQgPSBuZXcgUmVnRXhwKGVtYWlsUmVnZXgpO1xyXG5cclxuICBpZiAoZW1haWxDb25zdHJhaW50LnRlc3QoZW1haWwpKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLkVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogJycsXHJcbiAgICB9O1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLkVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTlZBTElELFxyXG4gICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9FTUFJTCxcclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNDbGllbnRWYWxpZGF0aW9uVHlwZSh7IHZhbGlkYXRpb25UeXBlIH0pIHtcclxuICBzd2l0Y2ggKHZhbGlkYXRpb25UeXBlKSB7XHJcbiAgICBjYXNlIHZhbGlkYXRpb25UeXBlcy5QQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTjpcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICBjYXNlIHZhbGlkYXRpb25UeXBlcy5FTUFJTF9GT1JNQVRfVkFMSURBVElPTjpcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICBjYXNlIHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTjpcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICBjYXNlIHZhbGlkYXRpb25UeXBlcy5FTVBUWV9TVFJJTkdfVkFMSURBVElPTjpcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICBjYXNlIHZhbGlkYXRpb25UeXBlcy5QQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTjpcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICBjYXNlIHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9GT1JNQVRfVkFMSURBVElPTjpcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZVBhc3N3b3JkQ29uc3RyYWludCh7IHBhc3N3b3JkIH0pIHtcclxuICBjb25zdCBwYXNzd29yZENvbnN0cmFpbnQgPSBuZXcgUmVnRXhwKHBhc3N3b3JkUmVnZXgpO1xyXG4gIGlmIChwYXNzd29yZENvbnN0cmFpbnQudGVzdChwYXNzd29yZCkpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLlZBTElELFxyXG4gICAgICBtZXNzYWdlOiAnJyxcclxuICAgIH07XHJcbiAgfVxyXG4gIGlmICghcGFzc3dvcmRDb25zdHJhaW50LnRlc3QocGFzc3dvcmQpKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTlZBTElELFxyXG4gICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9QQVNTV09SRCxcclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVVc2VyTmFtZUNvbnN0cmFpbnQoeyB1c2VybmFtZSB9KSB7XHJcbiAgY29uc3QgdXNlcm5hbWVDb25zdHJhaW50ID0gbmV3IFJlZ0V4cCh1c2VybmFtZVJlZ2V4KTtcclxuXHJcbiAgaWYgKHVzZXJuYW1lQ29uc3RyYWludC50ZXN0KHVzZXJuYW1lKSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgfTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfVVNFUk5BTUUsXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlRW1haWxPclVzZXJuYW1lKHsgdmFsdWUgfSkge1xyXG4gIGNvbnN0IGVtYWlsQ29uc3RyYWludCA9IG5ldyBSZWdFeHAoZW1haWxSZWdleCk7XHJcbiAgY29uc3QgdXNlcm5hbWVDb25zdHJhaW50ID0gbmV3IFJlZ0V4cCh1c2VybmFtZVJlZ2V4KTtcclxuXHJcbiAgaWYgKGVtYWlsQ29uc3RyYWludC50ZXN0KHZhbHVlKSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgfTtcclxuICB9IGVsc2UgaWYgKHVzZXJuYW1lQ29uc3RyYWludC50ZXN0KHZhbHVlKSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgfTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfVVNFUk5BTUVfT1JfRU1BSUwsXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlRW1wdHlTdHJpbmcoeyB2YWx1ZSB9KSB7XHJcbiAgaWYgKHZhbHVlLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5FTVBUWV9TVFJJTkdfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfRU1QVFlfU1RSSU5HLFxyXG4gICAgfTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5FTVBUWV9TVFJJTkdfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZVBhc3N3b3JkTWF0Y2goeyBzdGF0ZSB9KSB7XHJcbiAgY29uc3QgeyBwYXNzd29yZCwgY29uZmlybSB9ID0gc3RhdGUuYXV0aDtcclxuXHJcbiAgaWYgKHBhc3N3b3JkID09PSAnJyB8fCBwYXNzd29yZCAhPT0gY29uZmlybSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLlBBU1NXT1JEU19ET19OT1RfTUFUQ0gsXHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT04sXHJcbiAgICB9O1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogJycsXHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT04sXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCB7XHJcbiAgICBJTklUX0ZPUk1fVkFMSURBVElPTl9TVEFURTogJ0lOSVRfRk9STV9WQUxJREFUSU9OX1NUQVRFJyxcclxuICAgIFJFU0VUX1ZBTElEQVRJT05fU1RBVEU6ICdSRVNFVF9WQUxJREFUSU9OX1NUQVRFJyxcclxuICAgIElOUFVUX0JMVVJSRUQ6ICdJTlBVVF9CTFVSUkVEJyxcclxuICAgIElOUFVUX0ZPQ1VTRUQ6ICdJTlBVVF9GT0NVU0VEJyxcclxuICBcclxuICAgIFNFUlZFUl9WQUxJREFUSU9OOiAnU0VSVkVSX1ZBTElEQVRJT04nLFxyXG4gICAgQ0xJRU5UX1ZBTElEQVRJT046J0NMSUVOVF9WQUxJREFUSU9OJyxcclxuICBcclxuICAgIElOQ19JTlBVVF9DT1VUTiA6J0lOQ19JTlBVVF9DT1VUTidcclxuICB9O1xyXG4gICIsImV4cG9ydCBkZWZhdWx0IHtcclxuICAvL2xvZ2luXHJcbiAgY3JlZGVudGlhbEludmFsaWQ6ICc0MDEnLFxyXG4gIC8vc2lnbnVwXHJcbiAgdXNlcm5hbWVJc1Rha2VuOiAnNDAyJyxcclxuICBlbWFpbElzUmVnaXN0ZXJlZDogJzQwMycsXHJcbiAgdXNlcm5hbWVJbnZhbGlkOiAnNDA1JyxcclxuICBwYXNzd29yZEludmFsaWQ6ICc0MDYnLCAvL2NoYW5nZSBwYXNzd29yZFxyXG4gIGVtYWlsSW52YWxpZDogJzQwNycsXHJcbiAgLy9sb2dpblxyXG4gIGVtYWlsSXNOb3RSZWdpc3RlcmVkOiAnNDA4JyxcclxuICBlbXB0eVN0cmluZ05vdFZhbGlkOiAnNDA5JyxcclxuICBlbWFpbG9ydXNlcm5hbWVOb3RWYWxpZDonNDEwJyxcclxuICB1c2VybmFtZUlzTm90UmVnaXN0ZXJlZDonNDExJyxcclxuLy9jaGFuZ2UgcGFzc3dvcmRcclxuICBwYXNzd29yZERvTm90TWF0Y2g6JzQxMicsXHJcbiAgdG9rZW5FeHBpcmVkOic0MTMnLFxyXG4gIHNlcnZlclZhbGlkYXRpb25SYW5nZTogc3RhdHVzID0+IHtcclxuICAgIGlmIChzdGF0dXMgPj0gNDAwICYmIHN0YXR1cyA8PSA0MTApIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG59O1xyXG4iLCJcclxuaW1wb3J0ICogYXMgdmFsaWRhdGlvbnMgZnJvbSAnLi9jb25zdHJhaW50VmFsaWRhdG9ycyc7XHJcbmltcG9ydCBjb25zdFZhbFR5cGVzIGZyb20gJy4vdmFsaWRhdGlvblR5cGVzJztcclxuaW1wb3J0IHZhbGlkYXRpb25TdGF0ZXMgZnJvbSAnLi92YWxpZGF0aW9uU3RhdGVzJztcclxuaW1wb3J0IHZhbGlkYXRpb25UeXBlcyBmcm9tICcuL3ZhbGlkYXRpb25UeXBlcyc7XHJcbmltcG9ydCBhY3Rpb25UeXBlcyBmcm9tICcuL2FjdGlvblR5cGVzJztcclxuaW1wb3J0IGh0dHBTdGF0dXMgZnJvbSAnLi9odHRwLXN0YXR1cyc7XHJcbmltcG9ydCB2YWxpZGF0aW9uTWVzc2FnZXMgZnJvbSAnLi92YWxpZGF0aW9uTWVzc2FnZXMnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNsaWVudFZhbGlkYXRpb24oeyB2YWxpZGF0aW9uVHlwZSwgdmFsdWUsIHN0YXRlIH0pIHtcclxuICBsZXQgdmFsaWRhdGlvbiA9IG51bGw7XHJcbiAgc3dpdGNoICh2YWxpZGF0aW9uVHlwZSkge1xyXG4gICAgY2FzZSBjb25zdFZhbFR5cGVzLkVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OOlxyXG4gICAgICB2YWxpZGF0aW9uID0gdmFsaWRhdGlvbnMudmFsaWRhdGVFbWFpbENvbnN0cmFpbnQoe1xyXG4gICAgICAgIGVtYWlsOiB2YWx1ZSxcclxuICAgICAgfSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBjb25zdFZhbFR5cGVzLlVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OOlxyXG4gICAgICB2YWxpZGF0aW9uID0gdmFsaWRhdGlvbnMudmFsaWRhdGVFbWFpbE9yVXNlcm5hbWUoe1xyXG4gICAgICAgIHZhbHVlLFxyXG4gICAgICB9KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIGNvbnN0VmFsVHlwZXMuUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT046XHJcbiAgICAgIHZhbGlkYXRpb24gPSB2YWxpZGF0aW9ucy52YWxpZGF0ZVBhc3N3b3JkQ29uc3RyYWludCh7XHJcbiAgICAgICAgcGFzc3dvcmQ6IHZhbHVlLFxyXG4gICAgICB9KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIGNvbnN0VmFsVHlwZXMuVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT046XHJcbiAgICAgIHZhbGlkYXRpb24gPSB2YWxpZGF0aW9ucy52YWxpZGF0ZVVzZXJOYW1lQ29uc3RyYWludCh7XHJcbiAgICAgICAgdXNlcm5hbWU6IHZhbHVlLFxyXG4gICAgICB9KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIGNvbnN0VmFsVHlwZXMuRU1QVFlfU1RSSU5HX1ZBTElEQVRJT046XHJcbiAgICAgIHZhbGlkYXRpb24gPSB2YWxpZGF0aW9ucy52YWxpZGF0ZUVtcHR5U3RyaW5nKHsgdmFsdWUgfSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBjb25zdFZhbFR5cGVzLlBBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OOlxyXG4gICAgICBkZWJ1Z2dlcjtcclxuICAgICAgdmFsaWRhdGlvbiA9IHZhbGlkYXRpb25zLnZhbGlkYXRlUGFzc3dvcmRNYXRjaCh7IHN0YXRlIH0pO1xyXG4gICAgICBicmVhaztcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIGJyZWFrO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHsgdHlwZTogYWN0aW9uVHlwZXMuQ0xJRU5UX1ZBTElEQVRJT04sIC4uLnZhbGlkYXRpb24gfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGluaXRGb3JtVmFsaWRhdGlvblN0YXRlKCkge1xyXG4gIHJldHVybiB7IHR5cGU6IGFjdGlvblR5cGVzLklOSVRfRk9STV9WQUxJREFUSU9OX1NUQVRFIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZXNldElucHV0VmFsaWRhdGlvblN0YXRlKHsgdmFsaWRhdGlvblR5cGUgfSkge1xyXG4gIHJldHVybiB7IHR5cGU6IGFjdGlvblR5cGVzLlJFU0VUX1ZBTElEQVRJT05fU1RBVEUsIHZhbGlkYXRpb25UeXBlIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpbmNJbnB1dENvdW50KCkge1xyXG4gIHJldHVybiB7IHR5cGU6IGFjdGlvblR5cGVzLklOQ19JTlBVVF9DT1VUTiB9O1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNlcnZlclZhbGlkYXRpb24oeyBzdGF0dXMgPSAwIH0pIHtcclxuICBkZWJ1Z2dlcjtcclxuICBzd2l0Y2ggKHN0YXR1cykge1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLmNyZWRlbnRpYWxJbnZhbGlkOlxyXG4gICAgICBkZWJ1Z2dlcjtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLklOVkFMSURfQ1JFREVOVElBTFMsXHJcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfQ1JFREVOVElBTFMsXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMuZW1haWxJbnZhbGlkOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxyXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuRU1BSUxfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfRU1BSUwsXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMucGFzc3dvcmRJbnZhbGlkOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxyXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfUEFTU1dPUkQsXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMudXNlcm5hbWVJbnZhbGlkOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxyXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfVVNFUk5BTUUsXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMuZW1haWxJc1JlZ2lzdGVyZWQ6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5SRUdJU1RFUkVEX0VNQUlMLFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5SRUdJU1RFUkVEX0VNQUlMLFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLmVtYWlsSXNOb3RSZWdpc3RlcmVkOlxyXG4gICAgICBkZWJ1Z2dlcjtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLkVNQUlMX05PVF9SRUdJU1RFUkVELFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5FTUFJTF9OT1RfUkVHSVNURVJFRCxcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcclxuICAgICAgfTtcclxuICAgIGNhc2UgaHR0cFN0YXR1cy51c2VybmFtZUlzVGFrZW46XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9UQUtFTixcclxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuVVNFUk5BTUVfVEFLRU4sXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMuZW1wdHlTdHJpbmdOb3RWYWxpZDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLkVNUFRZX1NUUklOR19WQUxJREFUSU9OLFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX0VNUFRZX1NUUklORyxcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcclxuICAgICAgfTtcclxuICAgIGNhc2UgaHR0cFN0YXR1cy5lbWFpbG9ydXNlcm5hbWVOb3RWYWxpZDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX1VTRVJOQU1FX09SX0VNQUlMLFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLnVzZXJuYW1lSXNOb3RSZWdpc3RlcmVkOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxyXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfTk9UX1JFR0lTVEVSRUQsXHJcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLlVTRVJOQU1FX05PVF9SRUdJU1RFUkVELFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgICBjYXNlIGh0dHBTdGF0dXMucGFzc3dvcmREb05vdE1hdGNoOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxyXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT04sXHJcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLlBBU1NXT1JEU19ET19OT1RfTUFUQ0gsXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcbn1cclxuIiwiY29uc3QgaW1nID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUVBQUFBQkFDQVlBQUFDcWFYSGVBQUFBQ1hCSVdYTUFBQXNUQUFBTEV3RUFtcHdZQUFBQ3NrbEVRVlI0bk8yYXUyNFRRUlNHUDlzSzBGZ2lJZ0xsSW9VdXFRTlVWT0hTbUJMZWdIUVVnUzdQZ1pJT2hLbUlZaWhpM3NBSUNRcFNKS0VFQ1NzR2drS0xKVXVSS1dZV0hMT0xkK2ZNN3RyeCthU1JKV3RuL3YvWXU3TXpadzRvaXFJb2lxSW9paktPRkRMUU9BTmNBYTREUzhCRjRBSXdaVDhCZmdKSDl2TUhzQU84QlQ0QW5RdzhldWNTc0FhOEFkcEExN0cxN1JocmRzeWhwZ0RjQm1xWWY4MDE2S2pXc1dQZklwczdOeEUzZ0YzOEJ4M1ZkcTFtN2x3R1hwRmQ0UDN0SlRDZmRwQlJQRVQyZlB0cWJXQTE1VmhQY0JaNDdqa0lINjFxdmFYS0RQQSt4eUFIdFhmQWRGckJ6d0ZOb2NFbXNBNVVnQVdnYk51Qy9XN2RnOFlYNjlVcms4QkhnYWtENEQ1UWlxRlZzdGUyQkhyN3dIbFJ4RDJjd3l4R1hNMXNZLzdscEpTQnVrQzNZYjJMMlJTWWVBd1VCZHBGTzRhci9xWkFHNEI3QXZGdC9Lellpc2p1aEx1dXdwUEFkMGZSQTl4dSt5akt1TThKMzJ3c2lhazZDbll4azVodlZnUituaVVWdXlZUWF4SnZ0azlLQ2RrcjhtcllvRkVUMUNPQjBUcHdMT2dmeFRId1d0QS9ka3l6eUxhekZZSEpRVlFFdmpxWWxld0p3dTZBQjhDRXdPUW5RZDlCZkJiMG5jREVOcEJEM0gvbExuNW4vMzdLUW0rSC9RTktGaW1uZ3JBZjRLbHd6SCtlTTQvTUN2cy9pU3N5MXBOZ0M1TnFrcGhNaXp1Q3ZqWGdhOXlMeDJZaDlEK3FBckdSWHdxRGJEUFU0aFJzaGtDK0hmYnhtczF0T3h3d3lnbVJGd0x0UDBoVFluVkdQQ1VHNWhuYUY1aHBZU2F4dUVuUkZXUkowVDA4SmtVRDVqQXBaMWRUWGN4cmJBT3pWbGprYjFwODBYNjN3WkNteFFObU1JY1BFb05wdGxRUFJnTEcrbWlzbDFXRzQzRDBGeGtmanZZeWo5azM1QlY4alJ5UHgzdFpKdnNDaWVWTUlrdEFBVk8rc2tWNkpUSmJ3RTJHc0VTbW42Qklxb0c4U0twQmlrVlNXWlhKTFJGZUpqZGxyemtpdkV4dWh4RXRrMU1VUlZFVVJWRVVaYmo1RGNrTUZlUWhyRmo5QUFBQUFFbEZUa1N1UW1DQ1wiO1xuICBleHBvcnQgZGVmYXVsdCBpbWc7IiwiY29uc3QgaW1nID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUVBQUFBQkFDQVlBQUFDcWFYSGVBQUFBQ1hCSVdYTUFBQXNUQUFBTEV3RUFtcHdZQUFBRHMwbEVRVlI0bk8zYlMyaGNWUnpIOFU5YW85SXltb0lvU21PcUxhMHJONzV3SzRKYXRKUWFGZXpDaU5LdGlGQmM2TktWZENPS0MxRXJJb29Lb3FDQzRGdlJqU0sxaWk1RURXaE5VZkVGZ1JpTWl6T1JOTDAzY3g1eloySnlmL0FuTU1tYzMvLy96Ym4zbnRlbFZhdFdyVTdVWHN4MFk5K1FjeG1LWnJEUWpiOHhPZHgwQnErbEFOWWxoSDFDMGNzaDNEVE1wQWF0U1MyRVdnZzNEek9wUWF1RllJMURHSW44dTBrOGkxT1dmRGFQL1hpK3gzZTM0REpjM0kxZDNjL083TVkvK0FVL2QzOGV4NmY0RUo5Z0xqTEh4bFhWRStaVjk0UUxjRGZlcnZoT1NzemlmZHlMYzVvcEswMjlJRnlOVjRYL2FtN1JkVEdIRjdvZXNUMjNFZFZCK0ZML2k2NkxJN2lxNlVKWFVoV0VZY1NMbUdpNDFscXRGZ2l6dUt2aFdtdTFXaUFzNERCT2E3VGFHcTBtQ0IvajNLWUtQUjl2WVh2RjcySWhITU1oWEM5Y3U1dlFFY1lHdS9Fd3BpUGFXU20reDlZKzFnM094dGRkZzJucEVIN0NGRVlqdkRiaUR2eFEwMVpNSE1WWWFwRjEyaXlNeUpZYXBFSTRrT0hid1NzVmJjWEdlemc5dy9ja1BWRmprQUpoSHJka2VHL0FRelgrTWZGY2h1Y0oydC9EWUZBUVNuckNqUm1lNER6OEdXRXdDQWdkK2ZlRVk4TGtLMW1IRTB3R0FlSE9oSHlXeDVPcFpwZGttRFFOWWFPeVIrU2xLV2F2WlpwTVkxdEZlLzJDOEVobVhndDRKdFprdTdMcDdMVTE3ZllEd3U2Q3ZPYUUrMXBQUFZoZ3NvRHhGZG91aFhCUllXNFB4SmdjTHpUcE5TRXBnZEFwekcwbXdxTVlRTXdRTkJmQ3BzTGNvZ0FjS2pTNUlzWkVIb1NKd3R5aUxvRmRoU2EzeFpoMGxRcmhob0s4b20rQzhIcUIwV094SmwybFFDanBuZEdQUWZJR1Fvc3hpN05Tek1SQkdCV0d0Ymw1SlEyRUNCc2V1V2IzcDVycERXR3FJSi9ITS9LeEZiOW5HdjZCblJtZWRSQU9DSXNxT2JuOHFHQng1UFpNMHdWOExpeW1wS3JmYTR4N00zTDRUeVBLTG9XWERCZkNVeG5lSjJtenNGbVptOFFSN01qd0xZWHdKazdOOEszVU9MNHJTT1kzM0tjL1Q0ZVkrQXhuWk5TNW9yYmgyNHhrbHNhc01FNllFa2FNWThMY1lSelhxTjdtU29Yd2pZYjNCbzRtSkpNYU9VdnVTK01kNmIwc1dSMjhISkhNb0NFOEttN2ZvUy9hZ0h1RUxyMGFJRHpkL3hManRCUHZWaVEwYUFoMUoxVUdvaEhzMGN3QmlmOE5CTUtxN1I2OG9mOFFMcXp3VzVVUUZyVURCL0dSc3VMbmhEMis2MnA4aW8vd0RlS3cwUmd1eDVYQ291YUU4RGp0Q0dPQVVXSHk5S3R3Vk80cmZDR01JRC9BWHozYXJ6dkNkNnR3cUdwZHFEM2JySVdBZWdqcjZuMkhGb0o2Q092cUhhZ3FDRkViSTJ0Snl5R3NPd0NFYnIvNEdtRFIrbUNyVnEzV252NEZycmN1ajJPZlI1c0FBQUFBU1VWT1JLNUNZSUk9XCI7XG4gIGV4cG9ydCBkZWZhdWx0IGltZzsiLCJpbXBvcnQge2h9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7dXNlU3RhdGV9IGZyb20gJ3ByZWFjdC9ob29rcydcclxuaW1wb3J0IG9wZW5JY29uIGZyb20gJy4vaWNvbnMvb3BlbkV5ZS5wbmcnO1xyXG5pbXBvcnQgY2xvc2VJY29uIGZyb20gJy4vaWNvbnMvY2xvc2VFeWUucG5nJztcclxuZnVuY3Rpb24gSWNvblN0YXRlKHsgb3BlbiB9KSB7XHJcbiAgaWYgKG9wZW4pIHtcclxuICAgIHJldHVybiA8aW1nIHdpZHRoPVwiMzBweFwiIHNyYz17b3Blbkljb259IC8+O1xyXG4gIH1cclxuICByZXR1cm4gPGltZyB3aWR0aD1cIjMwcHhcIiBzcmM9e2Nsb3NlSWNvbn0gLz47XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEV5ZUljb24oe29uQ2xpY2t9KSB7XHJcbiAgY29uc3QgW3N0YXRlLCBzZXRTdGF0ZV0gPSB1c2VTdGF0ZShmYWxzZSk7XHJcbiAgZnVuY3Rpb24gdG9nZ2xlKCkge1xyXG4gICAgb25DbGljaygpXHJcbiAgICBzZXRTdGF0ZShwcmV2ID0+ICFwcmV2KTtcclxuICB9XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2XHJcbiAgICAgIG9uQ2xpY2s9e3RvZ2dsZX1cclxuICAgICAgc3R5bGU9e3tcclxuICAgICAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXHJcbiAgICAgICAganVzdGlmeUNvbnRlbnQ6J2NlbnRlcicsXHJcbiAgICAgICAgbWFyZ2luOiAxXHJcbiAgICAgIH19XHJcbiAgICA+XHJcbiAgICAgIDxJY29uU3RhdGUgb3Blbj17c3RhdGV9IC8+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCBhY3Rpb25UeXBlcyBmcm9tICcuL2FjdGlvblR5cGVzJztcclxuaW1wb3J0IHZhbGlkYXRpb25TdGF0ZSBmcm9tICcuL3ZhbGlkYXRpb25TdGF0ZXMnO1xyXG5cclxuZXhwb3J0IGNvbnN0IGluaXRTdGF0ZSA9IHsgdmFsaWRhdGlvbjoge30gfTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmb3JtUmVkdWNlcihzdGF0ZSwgYWN0aW9uKSB7XHJcbiAgbGV0IG5leHRTdGF0ZSA9IG51bGw7XHJcbiAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTjpcclxuICAgICAgbmV4dFN0YXRlID0ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIHZhbGlkYXRpb246IHtcclxuICAgICAgICAgIC4uLnN0YXRlLnZhbGlkYXRpb24sXHJcbiAgICAgICAgICBbYWN0aW9uLnZhbGlkYXRpb25UeXBlXToge1xyXG4gICAgICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IGFjdGlvbi52YWxpZGF0aW9uU3RhdGUsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IGFjdGlvbi5tZXNzYWdlLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICB9O1xyXG5cclxuICAgICAgcmV0dXJuIG5leHRTdGF0ZTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ0xJRU5UX1ZBTElEQVRJT046XHJcbiAgICAgIG5leHRTdGF0ZSA9IHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICB2YWxpZGF0aW9uOiB7XHJcbiAgICAgICAgICAuLi5zdGF0ZS52YWxpZGF0aW9uLFxyXG5cclxuICAgICAgICAgIFthY3Rpb24udmFsaWRhdGlvblR5cGVdOiB7XHJcbiAgICAgICAgICAgIHZhbGlkYXRpb25TdGF0ZTogYWN0aW9uLnZhbGlkYXRpb25TdGF0ZSxcclxuICAgICAgICAgICAgbWVzc2FnZTogYWN0aW9uLm1lc3NhZ2UsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH07XHJcblxyXG4gICAgICByZXR1cm4gbmV4dFN0YXRlO1xyXG5cclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuUkVTRVRfVkFMSURBVElPTl9TVEFURTpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICB2YWxpZGF0aW9uOiB7XHJcbiAgICAgICAgICAuLi5zdGF0ZS52YWxpZGF0aW9uLFxyXG4gICAgICAgICAgW2FjdGlvbi52YWxpZGF0aW9uVHlwZV06IHtcclxuICAgICAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5BQ1RJVkUsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICB9O1xyXG5cclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuSU5QVVRfRk9DVVNFRDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICB2YWxpZGF0aW9uOiB7XHJcbiAgICAgICAgICAuLi5zdGF0ZS52YWxpZGF0aW9uLFxyXG4gICAgICAgICAgZm9ybVN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5BQ1RJVkUsXHJcbiAgICAgICAgICBbYWN0aW9uLnByb3BOYW1lXToge1xyXG4gICAgICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTkFDVElWRSxcclxuICAgICAgICAgICAgbWVzc2FnZTogJycsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLklOSVRfRk9STV9WQUxJREFUSU9OX1NUQVRFOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIHZhbGlkYXRpb246IHtcclxuICAgICAgICAgIC4uLnN0YXRlLnZhbGlkYXRpb24sXHJcbiAgICAgICAgICBmb3JtU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTkFDVElWRSxcclxuICAgICAgICB9LFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5JTkNfSU5QVVRfQ09VVE46XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBjb3VudDogc3RhdGUuY291bnQgKyAxIH07XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICByZXR1cm4gc3RhdGU7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VSZWR1Y2VyLCB1c2VDb250ZXh0LCB1c2VTdGF0ZSwgdXNlTWVtbyB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IGZvcm1SZWR1Y2VyLCBpbml0U3RhdGUgfSBmcm9tICcuL2Zvcm1SZWR1Y2VyJztcclxuY29uc3QgRm9ybUNvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXNlRm9ybUNvbnRleHQoKSB7XHJcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoRm9ybUNvbnRleHQpO1xyXG4gIGlmICghY29udGV4dCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VGb3JtQ29udGV4dCBtdXN0IGJlIHVzZWQgd2l0aCBBcHBQcm92aWRlcicpO1xyXG4gIH1cclxuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IGNvbnRleHQ7XHJcblxyXG4gIHJldHVybiB7IHN0YXRlLCBkaXNwYXRjaCB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gRm9ybVByb3ZpZGVyKHByb3BzKSB7XHJcbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSB1c2VSZWR1Y2VyKGZvcm1SZWR1Y2VyLCBpbml0U3RhdGUpO1xyXG4gIGNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbc3RhdGUsIGRpc3BhdGNoXSwgW3N0YXRlXSk7XHJcbiAgcmV0dXJuIDxGb3JtQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30gLz47XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgKiBhcyBhY3Rpb25zIGZyb20gJy4vYWN0aW9ucyc7XHJcbmltcG9ydCB2YWxpZGF0aW9uU3RhdGVzIGZyb20gJy4vdmFsaWRhdGlvblN0YXRlcyc7XHJcbmltcG9ydCB7IGlzQ2xpZW50VmFsaWRhdGlvblR5cGUgfSBmcm9tICcuL2NvbnN0cmFpbnRWYWxpZGF0b3JzJztcclxuaW1wb3J0IEV5ZUljb24gZnJvbSAnLi9FeWVJY29uJztcclxuaW1wb3J0IHsgdXNlRm9ybUNvbnRleHQgfSBmcm9tICcuL2Zvcm0tY29udGV4dCc7XHJcbmZ1bmN0aW9uIFZhbGlkaXR5SWNvbih7IHZhbGlkIH0pIHtcclxuICBsZXQgc3RhdGVDb2xvciA9ICcjNGZjM2Y3JztcclxuICBzd2l0Y2ggKHZhbGlkKSB7XHJcbiAgICBjYXNlIHZhbGlkYXRpb25TdGF0ZXMuVkFMSUQ6XHJcbiAgICAgIHN0YXRlQ29sb3IgPSAnZ3JlZW4nO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgdmFsaWRhdGlvblN0YXRlcy5JTlZBTElEOlxyXG4gICAgICBzdGF0ZUNvbG9yID0gJ3JlZCc7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSB2YWxpZGF0aW9uU3RhdGVzLklOQUNUSVZFOlxyXG4gICAgICBzdGF0ZUNvbG9yID0gJyM0ZmMzZjcnO1xyXG4gICAgICBicmVhaztcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHN0YXRlQ29sb3IgPSAnIzRmYzNmNyc7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdlxyXG4gICAgICBzdHlsZT17e1xyXG4gICAgICAgIGZsZXg6IDEsXHJcbiAgICAgICAgY29sb3I6IHN0YXRlQ29sb3IsXHJcbiAgICAgICAgbGluZUhlaWdodDogMixcclxuICAgICAgICB3aWR0aDogMjAsXHJcbiAgICAgICAgdGV4dEFsaWduOiAnY2VudGVyJyxcclxuICAgICAgfX1cclxuICAgID5cclxuICAgICAge3ZhbGlkID8gJ+KckycgOiAn4piTJ31cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuXHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gIGlucHV0OiB7XHJcbiAgICBtYXJnaW46IDEsXHJcbiAgICBib3JkZXI6ICcxcHggc29saWQnLFxyXG4gICAgcGFkZGluZzogOCxcclxuICAgIGZsZXg6IDEwLFxyXG4gICAgYm9yZGVyUmFkaXVzOiAyLFxyXG4gIH0sXHJcbiAgcm9vdDoge1xyXG4gICAgYm9yZGVyUmFkaXVzOiAyLFxyXG4gICAgbWFyZ2luOiAzLFxyXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXHJcbiAgICBiYWNrZ3JvdW5kQ29sb3I6ICd3aGl0ZScsXHJcbiAgICBib3JkZXI6ICcxcHggc29saWQgd2hpdGUnLFxyXG4gICAgbWFyZ2luQm90dG9tOiAxLFxyXG4gIH0sXHJcbiAgaW5wdXRDb250YWluZXI6IHtcclxuICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgIGZsZXg6IDEsXHJcbiAgfSxcclxuICBtZXNzYWdlOiB7XHJcbiAgICBjb2xvcjogJ3JlZCcsXHJcbiAgICBwYWRkaW5nTGVmdDogMyxcclxuICB9LFxyXG59O1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBJbnB1dCh7XHJcbiAgcGxhY2Vob2xkZXIsXHJcbiAgdHlwZSxcclxuICBuYW1lLFxyXG4gIG9uQ2hhbmdlLFxyXG4gIHZhbHVlID0gJycsXHJcbiAgdmFsaWRhdGlvblR5cGVzID0gW10sXHJcbiAgaWQsXHJcbn0pIHtcclxuICBjb25zdCB7IHN0YXRlLCBkaXNwYXRjaCB9ID0gdXNlRm9ybUNvbnRleHQoKTtcclxuXHJcbiAgY29uc3QgW2lucHV0VmFsaWRhdGlvbiwgc2V0SW5wdXRWYWxpZGF0aW9uXSA9IHVzZVN0YXRlKHtcclxuICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTkFDVElWRSxcclxuICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgdmFsaWRhdGlvblR5cGU6IHVuZGVmaW5lZCxcclxuICB9KTtcclxuXHJcbiAgY29uc3QgW2lucHV0VHlwZSwgc2V0SW5wdXRUeXBlXSA9IHVzZVN0YXRlKHR5cGUpO1xyXG5cclxuICBjb25zdCBbYm9yZGVyQ29sb3IsIHNldEJvcmRlckNvbG9yXSA9IHVzZVN0YXRlKCcnKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmIChcclxuICAgICAgaW5wdXRWYWxpZGF0aW9uICYmXHJcbiAgICAgIGlucHV0VmFsaWRhdGlvbi52YWxpZGF0aW9uU3RhdGUgPT09IHZhbGlkYXRpb25TdGF0ZXMuVkFMSURcclxuICAgICkge1xyXG4gICAgICBzZXRCb3JkZXJDb2xvcignZ3JlZW4nKTtcclxuICAgIH1cclxuICAgIGlmIChcclxuICAgICAgaW5wdXRWYWxpZGF0aW9uICYmXHJcbiAgICAgIGlucHV0VmFsaWRhdGlvbi52YWxpZGF0aW9uU3RhdGUgPT09IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRFxyXG4gICAgKSB7XHJcbiAgICAgIHNldEJvcmRlckNvbG9yKCdyZWQnKTtcclxuICAgIH1cclxuICAgIGlmIChcclxuICAgICAgaW5wdXRWYWxpZGF0aW9uICYmXHJcbiAgICAgIGlucHV0VmFsaWRhdGlvbi52YWxpZGF0aW9uU3RhdGUgPT09IHZhbGlkYXRpb25TdGF0ZXMuSU5BQ1RJVkVcclxuICAgICkge1xyXG4gICAgICBzZXRCb3JkZXJDb2xvcignIzRmYzNmNycpO1xyXG4gICAgfVxyXG4gIH0sIFtpbnB1dFZhbGlkYXRpb25dKTtcclxuICBmdW5jdGlvbiBoYW5kbGVGb2N1cygpIHtcclxuICAgIHZhbGlkYXRpb25UeXBlcy5mb3JFYWNoKCh2YWxpZGF0aW9uTmFtZSkgPT4ge1xyXG4gICAgICBpZiAoc3RhdGUudmFsaWRhdGlvblt2YWxpZGF0aW9uTmFtZV0pIHtcclxuICAgICAgICBkaXNwYXRjaChcclxuICAgICAgICAgIGFjdGlvbnMucmVzZXRJbnB1dFZhbGlkYXRpb25TdGF0ZSh7IHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uTmFtZSB9KVxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuICBmdW5jdGlvbiBoYW5kbGVCbHVyKCkge1xyXG4gICAgdmFsaWRhdGlvblR5cGVzLmZvckVhY2goKHZhbGlkYXRpb25OYW1lKSA9PiB7XHJcbiAgICAgIGlmIChpc0NsaWVudFZhbGlkYXRpb25UeXBlKHsgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25OYW1lIH0pKSB7XHJcbiAgICAgICAgZGlzcGF0Y2goXHJcbiAgICAgICAgICBhY3Rpb25zLmNsaWVudFZhbGlkYXRpb24oe1xyXG4gICAgICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvbk5hbWUsXHJcbiAgICAgICAgICAgIHZhbHVlLFxyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiB0b2dnbGVFeWUoKSB7XHJcbiAgICBpZiAoaW5wdXRUeXBlID09PSAncGFzc3dvcmQnKSB7XHJcbiAgICAgIHNldElucHV0VHlwZSgndGV4dCcpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc2V0SW5wdXRUeXBlKCdwYXNzd29yZCcpO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17c3R5bGUucm9vdH0+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlLmlucHV0Q29udGFpbmVyfT5cclxuICAgICAgICA8aW5wdXRcclxuICAgICAgICAgIHN0eWxlPXt7IC4uLnN0eWxlLmlucHV0LCBib3JkZXJDb2xvciB9fVxyXG4gICAgICAgICAgdHlwZT17aW5wdXRUeXBlfVxyXG4gICAgICAgICAgbmFtZT17bmFtZX1cclxuICAgICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cclxuICAgICAgICAgIHZhbHVlPXt2YWx1ZX1cclxuICAgICAgICAgIG9uQmx1cj17aGFuZGxlQmx1cn1cclxuICAgICAgICAgIHBsYWNlaG9sZGVyPXtwbGFjZWhvbGRlcn1cclxuICAgICAgICAgIG9uRm9jdXM9e2hhbmRsZUZvY3VzfVxyXG4gICAgICAgICAgZGF0YS10ZXN0aWQ9e2lkfVxyXG4gICAgICAgIC8+XHJcbiAgICAgICAge3ZhbGlkYXRpb25UeXBlcy5tYXAoKHZhbGlkYXRpb25OYW1lKSA9PiB7XHJcbiAgICAgICAgICBpZiAoc3RhdGUudmFsaWRhdGlvblt2YWxpZGF0aW9uTmFtZV0pIHtcclxuICAgICAgICAgICAgY29uc3QgeyB2YWxpZGF0aW9uU3RhdGUgfSA9IHN0YXRlLnZhbGlkYXRpb25bdmFsaWRhdGlvbk5hbWVdO1xyXG4gICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgdmFsaWRhdGlvblN0YXRlID09PSB2YWxpZGF0aW9uU3RhdGVzLlZBTElEIHx8XHJcbiAgICAgICAgICAgICAgdmFsaWRhdGlvblN0YXRlID09PSB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSURcclxuICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgIDxWYWxpZGl0eUljb24ga2V5PXt2YWxpZGF0aW9uTmFtZX0gdmFsaWQ9e3ZhbGlkYXRpb25TdGF0ZX0gLz5cclxuICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pfVxyXG4gICAgICAgIHt0eXBlID09PSAncGFzc3dvcmQnICYmIDxFeWVJY29uIG9uQ2xpY2s9e3RvZ2dsZUV5ZX0gLz59XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICB7dmFsaWRhdGlvblR5cGVzLm1hcCgodmFsaWRhdGlvbk5hbWUpID0+IHtcclxuICAgICAgICBpZiAoc3RhdGUudmFsaWRhdGlvblt2YWxpZGF0aW9uTmFtZV0pIHtcclxuICAgICAgICAgIGNvbnN0IHsgbWVzc2FnZSB9ID0gc3RhdGUudmFsaWRhdGlvblt2YWxpZGF0aW9uTmFtZV07XHJcbiAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGtleT17dmFsaWRhdGlvbk5hbWV9IHN0eWxlPXtzdHlsZS5tZXNzYWdlfT5cclxuICAgICAgICAgICAgICB7bWVzc2FnZSAhPT0gJycgJiYgKFxyXG4gICAgICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgICAgICByb2xlPSdtZXNzYWdlJ1xyXG4gICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD17YG1lc3NhZ2UtJHtuYW1lfWB9XHJcbiAgICAgICAgICAgICAgICA+e2AqICR7bWVzc2FnZX1gfTwvZGl2PlxyXG4gICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pfVxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQge2h9IGZyb20gJ3ByZWFjdCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBCdXR0b24oeyBvbkNsaWNrLCB0aXRsZSwgZGlzYWJsZWQsIGlkIH0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGJ1dHRvblxyXG4gICAgICBkYXRhLXRlc3RpZD17aWR9XHJcbiAgICAgIGRpc2FibGVkPXtkaXNhYmxlZH1cclxuICAgICAgc3R5bGU9e3sgYm9yZGVyUmFkaXVzOiAyLCBoZWlnaHQ6IDMzIH19XHJcbiAgICAgIG9uQ2xpY2s9e29uQ2xpY2t9XHJcbiAgICA+XHJcbiAgICAgIHt0aXRsZX1cclxuICAgIDwvYnV0dG9uPlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCAqIGFzIHZhbGlkYXRpb25BY3Rpb25zIGZyb20gJy4vYWN0aW9ucyc7XHJcbmltcG9ydCB7IEZvcm1Qcm92aWRlciB9IGZyb20gJy4vZm9ybS1jb250ZXh0JztcclxuY29uc3Qgc3R5bGUgPSB7XHJcbiAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxyXG5cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEZvcm0oeyBjaGlsZHJlbiwgZm9ybVRpdGxlLCBlcnJvciB9KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxGb3JtUHJvdmlkZXI+XHJcbiAgICAgIDxmaWVsZHNldCBzdHlsZT17c3R5bGV9PlxyXG4gICAgICAgIDxsZWdlbmQ+e2Zvcm1UaXRsZX06PC9sZWdlbmQ+XHJcbiAgICAgICAge2NoaWxkcmVufVxyXG4gICAgICAgIHtlcnJvciAmJiAoXHJcbiAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgY29sb3I6ICdyZWQnLFxyXG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJ3doaXRlJyxcclxuICAgICAgICAgICAgICBwYWRkaW5nOiA1LFxyXG4gICAgICAgICAgICAgIGJvcmRlclJhZGl1czogNSxcclxuICAgICAgICAgICAgfX1cclxuICAgICAgICAgID5cclxuICAgICAgICAgICAgKiB7ZXJyb3IubWVzc2FnZX1cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICl9XHJcbiAgICAgIDwvZmllbGRzZXQ+XHJcbiAgICA8L0Zvcm1Qcm92aWRlcj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCBhY3Rpb25UeXBlcyBmcm9tICcuL2FjdGlvblR5cGVzJztcclxuaW1wb3J0IHsgc2VydmVyVmFsaWRhdGlvbiB9IGZyb20gJy4uL2Zvcm0vYWN0aW9ucyc7XHJcbmltcG9ydCBodHRwU3RhdHVzIGZyb20gJy4uL2Zvcm0vaHR0cC1zdGF0dXMnO1xyXG5leHBvcnQgZnVuY3Rpb24gdmFsdWVDaGFuZ2VkKHsgcHJvcE5hbWUsIHZhbHVlIH0pIHtcclxuICByZXR1cm4ge1xyXG4gICAgdHlwZTogYWN0aW9uVHlwZXMuVkFMVUVfQ0hBTkdFRCxcclxuICAgIHBheWxvYWQ6IHtcclxuICAgICAgcHJvcE5hbWUsXHJcbiAgICAgIHZhbHVlLFxyXG4gICAgfSxcclxuICB9O1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbG9naW4oeyBkaXNwYXRjaCwgc3RhdGUgfSkge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCB7IGVtYWlsb3J1c2VybmFtZSwgcGFzc3dvcmQgfSA9IHN0YXRlO1xyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5MT0dJTl9TVEFSVEVEIH0pO1xyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcclxuICAgICAgYCR7UkVBQ1RfQVBQX1hBRl9TRVJWRVJfVVJMfS9hdXRoL2xvZ2luYCxcclxuICAgICAge1xyXG4gICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICdDb250ZW4tVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcclxuICAgICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJzogJyonLFxyXG4gICAgICAgICAgQXV0aG9yaXphdGlvbjogYEJhc2ljICR7ICBidG9hKGAke2VtYWlsb3J1c2VybmFtZX06JHtwYXNzd29yZH1gKX1gLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgfVxyXG4gICAgKTtcclxuICAgIGRlYnVnZ2VyO1xyXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgZGVidWdnZXI7XHJcbiAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5MT0dJTl9TVUNDRVNTLCB0b2tlbjogcmVzdWx0LnRva2VuIH0pO1xyXG4gICAgfSBlbHNlIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDQwMCkge1xyXG4gICAgICBjb25zdCB7IGVycm9ycyB9ID0gcmVzdWx0O1xyXG5cclxuICAgICAgZXJyb3JzLmZvckVhY2goKGVycm9yKSA9PiB7XHJcbiAgICAgICAgZGlzcGF0Y2goXHJcbiAgICAgICAgICBzZXJ2ZXJWYWxpZGF0aW9uKHtcclxuICAgICAgICAgICAgc3RhdHVzOiBlcnJvcixcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0xvZ2luIGZhaWxlZCcpO1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBkZWJ1Z2dlcjtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTE9HSU5fRkFJTEVELCBwYXlsb2FkOiB7IGVycm9yIH0gfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2lnbnVwKHsgZGlzcGF0Y2gsIHN0YXRlIH0pIHtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNJR05VUF9TVEFSVEVEIH0pO1xyXG4gIGNvbnN0IHsgZW1haWwsIHBhc3N3b3JkLCB1c2VybmFtZSB9ID0gc3RhdGU7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXHJcbiAgICAgIGAke1JFQUNUX0FQUF9YQUZfU0VSVkVSX1VSTH0vYXV0aC9zaWdudXBgLFxyXG4gICAgICB7XHJcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBwYXNzd29yZCwgZW1haWwsIHVzZXJuYW1lIH0pLFxyXG4gICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgIENvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsXHJcbiAgICAgICAgICBBY2NlcHQ6ICdhcHBsaWNhdGlvbi9qc29uJyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICB9XHJcbiAgICApO1xyXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0lHTlVQX1NVQ0NFU1MsIHRva2VuOiByZXN1bHQudG9rZW4gfSk7XHJcbiAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDAwKSB7XHJcbiAgICAgIGNvbnN0IHsgZXJyb3JzIH0gPSByZXN1bHQ7XHJcbiAgICAgIGVycm9ycy5mb3JFYWNoKChlcnJvcikgPT4ge1xyXG4gICAgICAgIGRpc3BhdGNoKFxyXG4gICAgICAgICAgc2VydmVyVmFsaWRhdGlvbih7XHJcbiAgICAgICAgICAgIHN0YXR1czogZXJyb3IsXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdTaWdudXAgZmFpbGVkJyk7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0lHTlVQX0ZBSUxFRCwgcGF5bG9hZDogeyBlcnJvciB9IH0pO1xyXG4gIH1cclxufVxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbG9nb3V0KHsgZGlzcGF0Y2gsIHN0YXRlIH0pIHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgeyB0b2tlbiB9ID0gc3RhdGU7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxyXG4gICAgICBgJHtSRUFDVF9BUFBfWEFGX1NFUlZFUl9VUkx9L2F1dGgvbG9nb3V0PyR7IFxyXG4gICAgICAgIG5ldyBVUkxTZWFyY2hQYXJhbXMoeyB0b2tlbiB9KX1gXHJcbiAgICApO1xyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5MT0dPVVRfU1RBUlRFRCB9KTtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5MT0dPVVRfRkFJTEVELCBlcnJvciB9KTtcclxuICB9XHJcbn1cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNoYW5nZVBhc3N3b3JkKHsgZGlzcGF0Y2gsIHN0YXRlIH0pIHtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkNIQU5HRV9QQVNTV09SRF9TVEFSVEVEIH0pO1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCB7IGNvbmZpcm0sIHBhc3N3b3JkLCB0b2tlbiwgZW1haWxvcnVzZXJuYW1lLCBjdXJyZW50IH0gPSBzdGF0ZTtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXHJcbiAgICAgIGAke1JFQUNUX0FQUF9YQUZfU0VSVkVSX1VSTH0vYXV0aC9jaGFuZ2VwYXNzYCxcclxuICAgICAge1xyXG4gICAgICAgIG1ldGhvZDogJ3B1dCcsXHJcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgICAgICAgY29uZmlybSxcclxuICAgICAgICAgIHBhc3N3b3JkLFxyXG4gICAgICAgICAgY3VycmVudCxcclxuICAgICAgICAgIHRva2VuLFxyXG4gICAgICAgICAgZW1haWxvcnVzZXJuYW1lLFxyXG4gICAgICAgIH0pLFxyXG4gICAgICB9XHJcbiAgICApO1xyXG5cclxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICBkaXNwYXRjaCh7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX1NVQ0NFU1MsXHJcbiAgICAgICAgdG9rZW46IHJlc3VsdC50b2tlbixcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDAwKSB7XHJcbiAgICAgIGNvbnN0IHsgZXJyb3JzIH0gPSByZXN1bHQ7XHJcbiAgICAgIGVycm9ycy5mb3JFYWNoKChlcnJvcikgPT4ge1xyXG4gICAgICAgIGRpc3BhdGNoKFxyXG4gICAgICAgICAgc2VydmVyVmFsaWRhdGlvbih7XHJcbiAgICAgICAgICAgIHN0YXR1czogZXJyb3IsXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDUwMCkge1xyXG4gICAgICBjb25zdCB7IGVycm9yIH0gPSByZXN1bHQ7XHJcblxyXG4gICAgICBkaXNwYXRjaCh7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX0ZBSUxFRCxcclxuICAgICAgICBlcnJvcixcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NoYW5naW5nIHBhc3N3b3JkIGZhaWxlZCcpO1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBkaXNwYXRjaCh7XHJcbiAgICAgIHR5cGU6IGFjdGlvblR5cGVzLkNIQU5HRV9QQVNTV09SRF9GQUlMRUQsXHJcbiAgICAgIHBheWxvYWQ6IHsgZXJyb3IgfSxcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZvcmdvdFBhc3N3b3JkKHsgZGlzcGF0Y2gsIHN0YXRlIH0pIHtcclxuICB0cnkge1xyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5SRVFVRVNUX1BBU1NfQ0hBTkdFX1NUQVJURUQgfSk7XHJcbiAgICBjb25zdCB7IGVtYWlsIH0gPSBzdGF0ZTtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goJy9yZXF1ZXN0cGFzc2NoYW5nZScsIHtcclxuICAgICAgbWV0aG9kOiAncG9zdCcsXHJcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgZW1haWwgfSksXHJcbiAgICB9KTtcclxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICBkaXNwYXRjaCh7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX1NVQ0NFU1MsXHJcbiAgICAgICAgdG9rZW46IHJlc3VsdC50b2tlbixcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDAwKSB7XHJcbiAgICAgIGNvbnN0IHsgZXJyb3JzIH0gPSByZXN1bHQ7XHJcbiAgICAgIGVycm9ycy5mb3JFYWNoKChlcnJvcikgPT4ge1xyXG4gICAgICAgIGRpc3BhdGNoKFxyXG4gICAgICAgICAgc2VydmVyVmFsaWRhdGlvbih7XHJcbiAgICAgICAgICAgIHN0YXR1czogZXJyb3IsXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDUwMCkge1xyXG4gICAgICBjb25zdCB7IGVycm9yIH0gPSByZXN1bHQ7XHJcblxyXG4gICAgICBkaXNwYXRjaCh7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX0ZBSUxFRCxcclxuICAgICAgICBlcnJvcixcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NoYW5naW5nIHBhc3N3b3JkIGZhaWxlZCcpO1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBkaXNwYXRjaCh7XHJcbiAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlJFUVVFU1RfUEFTU19DSEFOR0VfRkFJTEVELFxyXG4gICAgICBwYXlsb2FkOiB7IGVycm9yOiBlcnIgfSxcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFRva2VuRnJvbVVybCh7IHRva2VuIH0pIHtcclxuICByZXR1cm4ge1xyXG4gICAgdHlwZTogYWN0aW9uVHlwZXMuR09UX1RPS0VOX0ZST01fVVJMLFxyXG4gICAgdG9rZW4sXHJcbiAgfTtcclxufVxyXG4iXSwibmFtZXMiOlsiVkFMSUQiLCJJTlZBTElEIiwiSU5BQ1RJVkUiLCJFTUFJTF9GT1JNQVRfVkFMSURBVElPTiIsIlBBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OIiwiVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT04iLCJVU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTiIsIkVNUFRZX1NUUklOR19WQUxJREFUSU9OIiwiUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT04iLCJJTlZBTElEX0NSRURFTlRJQUxTIiwiVVNFUk5BTUVfVEFLRU4iLCJSRUdJU1RFUkVEX0VNQUlMIiwiRU1BSUxfTk9UX1JFR0lTVEVSRUQiLCJVU0VSTkFNRV9OT1RfUkVHSVNURVJFRCIsIklOVkFMSURfUEFTU1dPUkQiLCJJTlZBTElEX0VNQUlMIiwiSU5WQUxJRF9VU0VSTkFNRSIsIklOVkFMSURfRU1QVFlfU1RSSU5HIiwiSU5WQUxJRF9VU0VSTkFNRV9PUl9FTUFJTCIsIlBBU1NXT1JEU19ET19OT1RfTUFUQ0giLCJwYXNzd29yZFJlZ2V4IiwiZW1haWxSZWdleCIsInVzZXJuYW1lUmVnZXgiLCJ2YWxpZGF0ZUVtYWlsQ29uc3RyYWludCIsImVtYWlsIiwiZW1haWxDb25zdHJhaW50IiwiUmVnRXhwIiwidGVzdCIsInZhbGlkYXRpb25UeXBlIiwidmFsaWRhdGlvblR5cGVzIiwidmFsaWRhdGlvblN0YXRlIiwibWVzc2FnZSIsInZhbGlkYXRpb25NZXNzYWdlcyIsImlzQ2xpZW50VmFsaWRhdGlvblR5cGUiLCJ2YWxpZGF0ZVBhc3N3b3JkQ29uc3RyYWludCIsInBhc3N3b3JkIiwicGFzc3dvcmRDb25zdHJhaW50IiwidmFsaWRhdGVVc2VyTmFtZUNvbnN0cmFpbnQiLCJ1c2VybmFtZSIsInVzZXJuYW1lQ29uc3RyYWludCIsInZhbGlkYXRlRW1haWxPclVzZXJuYW1lIiwidmFsdWUiLCJ2YWxpZGF0ZUVtcHR5U3RyaW5nIiwibGVuZ3RoIiwidmFsaWRhdGVQYXNzd29yZE1hdGNoIiwic3RhdGUiLCJjb25maXJtIiwiYXV0aCIsIklOSVRfRk9STV9WQUxJREFUSU9OX1NUQVRFIiwiUkVTRVRfVkFMSURBVElPTl9TVEFURSIsIklOUFVUX0JMVVJSRUQiLCJJTlBVVF9GT0NVU0VEIiwiU0VSVkVSX1ZBTElEQVRJT04iLCJDTElFTlRfVkFMSURBVElPTiIsIklOQ19JTlBVVF9DT1VUTiIsImNyZWRlbnRpYWxJbnZhbGlkIiwidXNlcm5hbWVJc1Rha2VuIiwiZW1haWxJc1JlZ2lzdGVyZWQiLCJ1c2VybmFtZUludmFsaWQiLCJwYXNzd29yZEludmFsaWQiLCJlbWFpbEludmFsaWQiLCJlbWFpbElzTm90UmVnaXN0ZXJlZCIsImVtcHR5U3RyaW5nTm90VmFsaWQiLCJlbWFpbG9ydXNlcm5hbWVOb3RWYWxpZCIsInVzZXJuYW1lSXNOb3RSZWdpc3RlcmVkIiwicGFzc3dvcmREb05vdE1hdGNoIiwidG9rZW5FeHBpcmVkIiwic2VydmVyVmFsaWRhdGlvblJhbmdlIiwic3RhdHVzIiwiY2xpZW50VmFsaWRhdGlvbiIsInZhbGlkYXRpb24iLCJjb25zdFZhbFR5cGVzIiwidmFsaWRhdGlvbnMiLCJ0eXBlIiwiYWN0aW9uVHlwZXMiLCJyZXNldElucHV0VmFsaWRhdGlvblN0YXRlIiwic2VydmVyVmFsaWRhdGlvbiIsImh0dHBTdGF0dXMiLCJ2YWxpZGF0aW9uU3RhdGVzIiwiaW1nIiwiSWNvblN0YXRlIiwib3BlbiIsIm9wZW5JY29uIiwiY2xvc2VJY29uIiwiRXllSWNvbiIsIm9uQ2xpY2siLCJzZXRTdGF0ZSIsInVzZVN0YXRlIiwidG9nZ2xlIiwicHJldiIsImRpc3BsYXkiLCJhbGlnbkl0ZW1zIiwianVzdGlmeUNvbnRlbnQiLCJtYXJnaW4iLCJpbml0U3RhdGUiLCJmb3JtUmVkdWNlciIsImFjdGlvbiIsIm5leHRTdGF0ZSIsImZvcm1TdGF0ZSIsInByb3BOYW1lIiwiY291bnQiLCJGb3JtQ29udGV4dCIsImNyZWF0ZUNvbnRleHQiLCJ1c2VGb3JtQ29udGV4dCIsImNvbnRleHQiLCJ1c2VDb250ZXh0IiwiRXJyb3IiLCJkaXNwYXRjaCIsIkZvcm1Qcm92aWRlciIsInByb3BzIiwidXNlUmVkdWNlciIsInVzZU1lbW8iLCJWYWxpZGl0eUljb24iLCJ2YWxpZCIsInN0YXRlQ29sb3IiLCJmbGV4IiwiY29sb3IiLCJsaW5lSGVpZ2h0Iiwid2lkdGgiLCJ0ZXh0QWxpZ24iLCJzdHlsZSIsImlucHV0IiwiYm9yZGVyIiwicGFkZGluZyIsImJvcmRlclJhZGl1cyIsInJvb3QiLCJmbGV4RGlyZWN0aW9uIiwiYmFja2dyb3VuZENvbG9yIiwibWFyZ2luQm90dG9tIiwiaW5wdXRDb250YWluZXIiLCJwYWRkaW5nTGVmdCIsIklucHV0IiwicGxhY2Vob2xkZXIiLCJuYW1lIiwib25DaGFuZ2UiLCJpZCIsImlucHV0VmFsaWRhdGlvbiIsInNldElucHV0VmFsaWRhdGlvbiIsInVuZGVmaW5lZCIsImlucHV0VHlwZSIsInNldElucHV0VHlwZSIsImJvcmRlckNvbG9yIiwic2V0Qm9yZGVyQ29sb3IiLCJ1c2VFZmZlY3QiLCJoYW5kbGVGb2N1cyIsImZvckVhY2giLCJ2YWxpZGF0aW9uTmFtZSIsImFjdGlvbnMiLCJoYW5kbGVCbHVyIiwidG9nZ2xlRXllIiwibWFwIiwiQnV0dG9uIiwidGl0bGUiLCJkaXNhYmxlZCIsImhlaWdodCIsIkZvcm0iLCJjaGlsZHJlbiIsImZvcm1UaXRsZSIsImVycm9yIiwidmFsdWVDaGFuZ2VkIiwiVkFMVUVfQ0hBTkdFRCIsInBheWxvYWQiLCJsb2dpbiIsImVtYWlsb3J1c2VybmFtZSIsIkxPR0lOX1NUQVJURUQiLCJyZXNwb25zZSIsImZldGNoIiwiUkVBQ1RfQVBQX1hBRl9TRVJWRVJfVVJMIiwiaGVhZGVycyIsIkF1dGhvcml6YXRpb24iLCJidG9hIiwibWV0aG9kIiwicmVzdWx0IiwianNvbiIsIkxPR0lOX1NVQ0NFU1MiLCJ0b2tlbiIsImVycm9ycyIsIkxPR0lOX0ZBSUxFRCIsInNpZ251cCIsIlNJR05VUF9TVEFSVEVEIiwiYm9keSIsIkpTT04iLCJzdHJpbmdpZnkiLCJDb250ZW50VHlwZSIsIkFjY2VwdCIsIlNJR05VUF9TVUNDRVNTIiwiU0lHTlVQX0ZBSUxFRCIsImNoYW5nZVBhc3N3b3JkIiwiQ0hBTkdFX1BBU1NXT1JEX1NUQVJURUQiLCJjdXJyZW50IiwiQ0hBTkdFX1BBU1NXT1JEX1NVQ0NFU1MiLCJDSEFOR0VfUEFTU1dPUkRfRkFJTEVEIiwiZm9yZ290UGFzc3dvcmQiLCJSRVFVRVNUX1BBU1NfQ0hBTkdFX1NUQVJURUQiLCJSRVFVRVNUX1BBU1NfQ0hBTkdFX0ZBSUxFRCIsImVyciJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx1QkFBZTtBQUNiQSxFQUFBQSxLQUFLLEVBQUUsT0FETTtBQUViQyxFQUFBQSxPQUFPLEVBQUUsU0FGSTtBQUdiQyxFQUFBQSxRQUFRLEVBQUU7QUFIRyxDQUFmOztBQ0FBLHNCQUFlO0FBQ2I7QUFDQUMsRUFBQUEsdUJBQXVCLEVBQUUseUJBRlo7QUFHYkMsRUFBQUEsMEJBQTBCLEVBQUUsNEJBSGY7QUFJYkMsRUFBQUEsMEJBQTBCLEVBQUUsNEJBSmY7QUFLYkMsRUFBQUEsbUNBQW1DLEVBQUUscUNBTHhCO0FBTWJDLEVBQUFBLHVCQUF1QixFQUFFLHlCQU5aO0FBT2JDLEVBQUFBLDBCQUEwQixFQUFFLDRCQVBmO0FBUWI7QUFDQUMsRUFBQUEsbUJBQW1CLEVBQUUscUJBVFI7QUFVYkMsRUFBQUEsY0FBYyxFQUFFLGdCQVZIO0FBV2JDLEVBQUFBLGdCQUFnQixFQUFFLGtCQVhMO0FBWWJDLEVBQUFBLG9CQUFvQixFQUFFLHNCQVpUO0FBYWJDLEVBQUFBLHVCQUF1QixFQUFDO0FBYlgsQ0FBZjs7QUNBQSx5QkFBZTtBQUNiQyxFQUFBQSxnQkFBZ0IsRUFDZCxxSEFGVztBQUdiQyxFQUFBQSxhQUFhLEVBQUUsMkJBSEY7QUFJYkgsRUFBQUEsb0JBQW9CLEVBQUUseUJBSlQ7QUFLYkMsRUFBQUEsdUJBQXVCLEVBQUUsNEJBTFo7QUFNYkcsRUFBQUEsZ0JBQWdCLEVBQ2QsNkRBUFc7QUFRYkMsRUFBQUEsb0JBQW9CLEVBQUUsNkJBUlQ7QUFTYkMsRUFBQUEseUJBQXlCLEVBQUUsZ0NBVGQ7QUFVYlQsRUFBQUEsbUJBQW1C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
