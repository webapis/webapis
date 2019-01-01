import { v, h, M, T, m, s, _ as _extends, p } from './index-0b41628a.js';

function styleInject(css, ref) {
  if (ref === void 0) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') {
    return;
  }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = ".auth-form {\n  background-color: #455a64;\n  padding: 5px;\n  border: 1px solid white;\n  border-radius: 5px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n}\n\n.auth-form input {\n  padding: 5px;\n  margin: 5px;\n}\n\n.auth-form button {\n  padding: 5px;\n  margin: 5px;\n}\n\n.auth-form fieldset {\n  padding: 10px;\n  color: white;\n}\n\n.auth-form a {\n  color: white;\n}\n\n.main-content {\n  background-color: #546e7a;\n  position: fixed;\n  left: 320px;\n  top: 100px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  width: 80%;\n  height: 80%;\n  padding: 5px;\n}\n\n.loading {\n  height: 100%;\n  width: 100%;\n  color: white;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n}\n\ninput:invalid {\n  -webkit-box-shadow: 0 0 5px 1px red;\n          box-shadow: 0 0 5px 1px red;\n  color: red;\n}\n\n.btn {\n  border-radius: 2px;\n  height: 33px;\n}";
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
      if (state.form.validation[validationName]) {
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
  flexDirection: 'column',
  width: 300
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

var actionTypes$1 = {
  VALUE_CHANGED: 'VALUE_CHANGED',
  LOGIN_STARTED: 'LOGIN_STARTED',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILED: 'LOGIN_FAILED',
  LOGOUT_STARTED: 'LOGOUT_STARTED',
  LOGOUT_FAILED: 'LOGOUT_FAILED',
  LOGOUT_SUCCESS: 'LOGOUT_SUCCESS',
  SIGNUP_STARTED: 'SIGNUP_STARTED',
  SIGNUP_SUCCESS: 'SIGNUP_SUCCESS',
  SIGNUP_FAILED: 'SIGNUP_FAILED',
  CHANGE_PASSWORD_STARTED: 'CHANGE_PASSWORD_STARTED',
  CHANGE_PASSWORD_SUCCESS: 'CHANGE_PASSWORD_SUCCESS',
  CHANGE_PASSWORD_FAILED: 'CHANGE_PASSWORD_FAILED',
  REQUEST_PASS_CHANGE_STARTED: 'REQUEST_PASS_CHANGE_STARTED',
  REQUEST_PASS_CHANGE_SUCCESS: 'REQUEST_PASS_CHANGE_SUCCESS',
  REQUEST_PASS_CHANGE_FAILED: 'REQUEST_PASS_CHANGE_FAILED',
  GOT_TOKEN_FROM_URL: 'GOT_TOKEN_FROM_URL'
};

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
    const response = await fetch(`${process.env.REACT_APP_XAF_SERVER_URL}/auth/login`, {
      headers: {
        'Conten-Type': 'application/json',
        'Access-Control-Allow-Headers': '*',
        Authorization: 'Basic ' + btoa(`${emailorusername}:${password}`)
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
        dispatch(serverValidation({
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
    const response = await fetch(`${process.env.REACT_APP_XAF_SERVER_URL}/auth/signup`, {
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
    const response = await fetch(`${process.env.REACT_APP_XAF_SERVER_URL}/auth/changepass`, {
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
        error: error
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
        error: error
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9ucy0xZTUxMjNiMC5qcyIsInNvdXJjZXMiOlsiLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWluamVjdC9kaXN0L3N0eWxlLWluamVjdC5lcy5qcyIsIi4uL2Zvcm0vdmFsaWRhdGlvblN0YXRlcy5qcyIsIi4uL2Zvcm0vdmFsaWRhdGlvblR5cGVzLmpzIiwiLi4vZm9ybS92YWxpZGF0aW9uTWVzc2FnZXMuanMiLCIuLi9mb3JtL3ZhbGlkYXRpb25SZWdleC5qcyIsIi4uL2Zvcm0vY29uc3RyYWludFZhbGlkYXRvcnMuanMiLCIuLi9mb3JtL2FjdGlvblR5cGVzLmpzIiwiLi4vZm9ybS9odHRwLXN0YXR1cy5qcyIsIi4uL2Zvcm0vYWN0aW9ucy5qcyIsIi4uL2Zvcm0vaWNvbnMvb3BlbkV5ZS5wbmciLCIuLi9mb3JtL2ljb25zL2Nsb3NlRXllLnBuZyIsIi4uL2Zvcm0vRXllSWNvbi5qcyIsIi4uL2Zvcm0vZm9ybVJlZHVjZXIuanMiLCIuLi9mb3JtL2Zvcm0tY29udGV4dC5qcyIsIi4uL2Zvcm0vSW5wdXQuanMiLCIuLi9mb3JtL0J1dHRvbi5qcyIsIi4uL2Zvcm0vRm9ybS5qcyIsIi4uL2F1dGgvYWN0aW9uVHlwZXMuanMiLCIuLi9hdXRoL2FjdGlvbnMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gc3R5bGVJbmplY3QoY3NzLCByZWYpIHtcbiAgaWYgKCByZWYgPT09IHZvaWQgMCApIHJlZiA9IHt9O1xuICB2YXIgaW5zZXJ0QXQgPSByZWYuaW5zZXJ0QXQ7XG5cbiAgaWYgKCFjc3MgfHwgdHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJykgeyByZXR1cm47IH1cblxuICB2YXIgaGVhZCA9IGRvY3VtZW50LmhlYWQgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgdmFyIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgc3R5bGUudHlwZSA9ICd0ZXh0L2Nzcyc7XG5cbiAgaWYgKGluc2VydEF0ID09PSAndG9wJykge1xuICAgIGlmIChoZWFkLmZpcnN0Q2hpbGQpIHtcbiAgICAgIGhlYWQuaW5zZXJ0QmVmb3JlKHN0eWxlLCBoZWFkLmZpcnN0Q2hpbGQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gIH1cblxuICBpZiAoc3R5bGUuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICBzdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBzdHlsZUluamVjdDtcbiIsImV4cG9ydCBkZWZhdWx0IHtcbiAgVkFMSUQ6ICdWQUxJRCcsXG4gIElOVkFMSUQ6ICdJTlZBTElEJyxcbiAgSU5BQ1RJVkU6ICdJTkFDVElWRSdcbn07XG4iLCJleHBvcnQgZGVmYXVsdCB7XG4gIC8vY29uc3RyYWludFxuICBFTUFJTF9GT1JNQVRfVkFMSURBVElPTjogJ0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OJyxcbiAgUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT046ICdQQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTicsXG4gIFVTRVJOQU1FX0ZPUk1BVF9WQUxJREFUSU9OOiAnVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT04nLFxuICBVU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTjogJ1VTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OJyxcbiAgRU1QVFlfU1RSSU5HX1ZBTElEQVRJT046ICdFTVBUWV9TVFJJTkdfVkFMSURBVElPTicsXG4gIFBBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OOiAnUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT04nLFxuICAvL2F1dGhcbiAgSU5WQUxJRF9DUkVERU5USUFMUzogJ0lOVkFMSURfQ1JFREVOVElBTFMnLFxuICBVU0VSTkFNRV9UQUtFTjogJ1VTRVJOQU1FX1RBS0VOJyxcbiAgUkVHSVNURVJFRF9FTUFJTDogJ1JFR0lTVEVSRURfRU1BSUwnLFxuICBFTUFJTF9OT1RfUkVHSVNURVJFRDogJ0VNQUlMX05PVF9SRUdJU1RFUkVEJyxcbiAgVVNFUk5BTUVfTk9UX1JFR0lTVEVSRUQ6J1VTRVJOQU1FX05PVF9SRUdJU1RFUkVEJ1xufTtcbiIsImV4cG9ydCBkZWZhdWx0IHtcbiAgSU5WQUxJRF9QQVNTV09SRDpcbiAgICAnYXQgbGVhc3QgOCBjaGFyYWN0ZXJzLCBtdXN0IGNvbnRhaW4gYXQgbGVhc3QgMSB1cHBlcmNhc2UgbGV0dGVyLCAxIGxvd2VyY2FzZSBsZXR0ZXIsIENhbiBjb250YWluIHNwZWNpYWwgY2hhcmFjdGVycycsXG4gIElOVkFMSURfRU1BSUw6ICdlbWFpbCBmb3JtYXQgaXMgbm90IHZhbGlkJyxcbiAgRU1BSUxfTk9UX1JFR0lTVEVSRUQ6ICdlbWFpbCBpcyBub3QgcmVnaXN0ZXJlZCcsXG4gIFVTRVJOQU1FX05PVF9SRUdJU1RFUkVEOiAndXNlcm5hbWUgaXMgbm90IHJlZ2lzdGVyZWQnLFxuICBJTlZBTElEX1VTRVJOQU1FOlxuICAgICdvbmx5IExldHRlcnMgYS16IG9yIEEtWiBhbmQgdGhlIFN5bWJvbHMgLSBhbmQgXyBhcmUgYWxsb3dlZCcsXG4gIElOVkFMSURfRU1QVFlfU1RSSU5HOiAnZW1wdHkgc3RyaW5nIGlzIG5vdCBhbGxvd2VkJyxcbiAgSU5WQUxJRF9VU0VSTkFNRV9PUl9FTUFJTDogJ2VtYWlsIG9yIHVzZXJuYW1lIGlzIG5vdCB2YWxpZCcsXG4gIElOVkFMSURfQ1JFREVOVElBTFM6ICdpbnZhbGlkIGNyZWRlbnRpYWxzIHByb3ZpZGVkJyxcbiAgVVNFUk5BTUVfVEFLRU46ICd1c2VybmFtZSBpcyBhbHJlYWR5IHRha2VuJyxcbiAgUkVHSVNURVJFRF9FTUFJTDogJ2VtYWlsIGlzIGFscmVhZHkgcmVnaXN0ZXJlZCcsXG4gIFBBU1NXT1JEU19ET19OT1RfTUFUQ0g6ICdwYXNzd29yZHMgZG8gbm90IG1hdGNoJ1xufTtcbiIsImV4cG9ydCBjb25zdCBwYXNzd29yZFJlZ2V4ID0gL14oPz0uKlxcZCkoPz0uKlthLXpdKSg/PS4qW0EtWl0pKD89LipbYS16QS1aXSkuezgsfSQvZztcblxuZXhwb3J0IGNvbnN0IGVtYWlsUmVnZXggPSAvW2EtejAtOSEjJCUmJyorLz0/Xl9ge3x9fi1dKyg/OlxcLlthLXowLTkhIyQlJicqKy89P15fYHt8fX4tXSspKkAoPzpbYS16MC05XSg/OlthLXowLTktXSpbYS16MC05XSk/XFwuKStbYS16MC05XSg/OlthLXowLTktXSpbYS16MC05XSk/L2c7XG5cbmV4cG9ydCBjb25zdCB1c2VybmFtZVJlZ2V4ID0gL1thLXpBLVpdK1stX10qW2EtekEtWl0rL2c7XG4iLCJpbXBvcnQgdmFsaWRhdGlvblN0YXRlIGZyb20gJy4vdmFsaWRhdGlvblN0YXRlcyc7XG5pbXBvcnQgdmFsaWRhdGlvblR5cGVzIGZyb20gJy4vdmFsaWRhdGlvblR5cGVzJztcbmltcG9ydCB2YWxpZGF0aW9uTWVzc2FnZXMgZnJvbSAnLi92YWxpZGF0aW9uTWVzc2FnZXMnO1xuaW1wb3J0IHsgZW1haWxSZWdleCwgcGFzc3dvcmRSZWdleCwgdXNlcm5hbWVSZWdleCB9IGZyb20gJy4vdmFsaWRhdGlvblJlZ2V4JztcbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUVtYWlsQ29uc3RyYWludCh7IGVtYWlsIH0pIHtcbiAgY29uc3QgZW1haWxDb25zdHJhaW50ID0gbmV3IFJlZ0V4cChlbWFpbFJlZ2V4KTtcblxuICBpZiAoZW1haWxDb25zdHJhaW50LnRlc3QoZW1haWwpKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuRU1BSUxfRk9STUFUX1ZBTElEQVRJT04sXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5WQUxJRCxcbiAgICAgIG1lc3NhZ2U6ICcnLFxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuRU1BSUxfRk9STUFUX1ZBTElEQVRJT04sXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTlZBTElELFxuICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfRU1BSUwsXG4gICAgfTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNDbGllbnRWYWxpZGF0aW9uVHlwZSh7IHZhbGlkYXRpb25UeXBlIH0pIHtcbiAgc3dpdGNoICh2YWxpZGF0aW9uVHlwZSkge1xuICAgIGNhc2UgdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OOlxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgY2FzZSB2YWxpZGF0aW9uVHlwZXMuRU1BSUxfRk9STUFUX1ZBTElEQVRJT046XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICBjYXNlIHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTjpcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIGNhc2UgdmFsaWRhdGlvblR5cGVzLkVNUFRZX1NUUklOR19WQUxJREFUSU9OOlxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgY2FzZSB2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT046XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICBjYXNlIHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9GT1JNQVRfVkFMSURBVElPTjpcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZVBhc3N3b3JkQ29uc3RyYWludCh7IHBhc3N3b3JkIH0pIHtcbiAgY29uc3QgcGFzc3dvcmRDb25zdHJhaW50ID0gbmV3IFJlZ0V4cChwYXNzd29yZFJlZ2V4KTtcbiAgaWYgKHBhc3N3b3JkQ29uc3RyYWludC50ZXN0KHBhc3N3b3JkKSkge1xuICAgIHJldHVybiB7XG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OLFxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuVkFMSUQsXG4gICAgICBtZXNzYWdlOiAnJyxcbiAgICB9O1xuICB9XG4gIGlmICghcGFzc3dvcmRDb25zdHJhaW50LnRlc3QocGFzc3dvcmQpKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT04sXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTlZBTElELFxuICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfUEFTU1dPUkQsXG4gICAgfTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVVc2VyTmFtZUNvbnN0cmFpbnQoeyB1c2VybmFtZSB9KSB7XG4gIGNvbnN0IHVzZXJuYW1lQ29uc3RyYWludCA9IG5ldyBSZWdFeHAodXNlcm5hbWVSZWdleCk7XG5cbiAgaWYgKHVzZXJuYW1lQ29uc3RyYWludC50ZXN0KHVzZXJuYW1lKSkge1xuICAgIHJldHVybiB7XG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX0ZPUk1BVF9WQUxJREFUSU9OLFxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuVkFMSUQsXG4gICAgICBtZXNzYWdlOiAnJyxcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB7XG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX0ZPUk1BVF9WQUxJREFUSU9OLFxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5WQUxJRCxcbiAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX1VTRVJOQU1FLFxuICAgIH07XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlRW1haWxPclVzZXJuYW1lKHsgdmFsdWUgfSkge1xuICBjb25zdCBlbWFpbENvbnN0cmFpbnQgPSBuZXcgUmVnRXhwKGVtYWlsUmVnZXgpO1xuICBjb25zdCB1c2VybmFtZUNvbnN0cmFpbnQgPSBuZXcgUmVnRXhwKHVzZXJuYW1lUmVnZXgpO1xuXG4gIGlmIChlbWFpbENvbnN0cmFpbnQudGVzdCh2YWx1ZSkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTixcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLlZBTElELFxuICAgICAgbWVzc2FnZTogJycsXG4gICAgfTtcbiAgfSBlbHNlIGlmICh1c2VybmFtZUNvbnN0cmFpbnQudGVzdCh2YWx1ZSkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTixcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLlZBTElELFxuICAgICAgbWVzc2FnZTogJycsXG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTixcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOVkFMSUQsXG4gICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9VU0VSTkFNRV9PUl9FTUFJTCxcbiAgICB9O1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUVtcHR5U3RyaW5nKHsgdmFsdWUgfSkge1xuICBpZiAodmFsdWUubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuRU1QVFlfU1RSSU5HX1ZBTElEQVRJT04sXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTlZBTElELFxuICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfRU1QVFlfU1RSSU5HLFxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuRU1QVFlfU1RSSU5HX1ZBTElEQVRJT04sXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5WQUxJRCxcbiAgICAgIG1lc3NhZ2U6ICcnLFxuICAgIH07XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlUGFzc3dvcmRNYXRjaCh7IHN0YXRlIH0pIHtcbiAgY29uc3QgeyBwYXNzd29yZCwgY29uZmlybSB9ID0gc3RhdGUuYXV0aDtcblxuICBpZiAocGFzc3dvcmQgPT09ICcnIHx8IHBhc3N3b3JkICE9PSBjb25maXJtKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOVkFMSUQsXG4gICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuUEFTU1dPUkRTX0RPX05PVF9NQVRDSCxcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT04sXG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuVkFMSUQsXG4gICAgICBtZXNzYWdlOiAnJyxcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT04sXG4gICAgfTtcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQge1xuICAgIElOSVRfRk9STV9WQUxJREFUSU9OX1NUQVRFOiAnSU5JVF9GT1JNX1ZBTElEQVRJT05fU1RBVEUnLFxuICAgIFJFU0VUX1ZBTElEQVRJT05fU1RBVEU6ICdSRVNFVF9WQUxJREFUSU9OX1NUQVRFJyxcbiAgICBJTlBVVF9CTFVSUkVEOiAnSU5QVVRfQkxVUlJFRCcsXG4gICAgSU5QVVRfRk9DVVNFRDogJ0lOUFVUX0ZPQ1VTRUQnLFxuICBcbiAgICBTRVJWRVJfVkFMSURBVElPTjogJ1NFUlZFUl9WQUxJREFUSU9OJyxcbiAgICBDTElFTlRfVkFMSURBVElPTjonQ0xJRU5UX1ZBTElEQVRJT04nLFxuICBcbiAgICBJTkNfSU5QVVRfQ09VVE4gOidJTkNfSU5QVVRfQ09VVE4nXG4gIH07XG4gICIsImV4cG9ydCBkZWZhdWx0IHtcbiAgLy9sb2dpblxuICBjcmVkZW50aWFsSW52YWxpZDogJzQwMScsXG4gIC8vc2lnbnVwXG4gIHVzZXJuYW1lSXNUYWtlbjogJzQwMicsXG4gIGVtYWlsSXNSZWdpc3RlcmVkOiAnNDAzJyxcbiAgdXNlcm5hbWVJbnZhbGlkOiAnNDA1JyxcbiAgcGFzc3dvcmRJbnZhbGlkOiAnNDA2JywgLy9jaGFuZ2UgcGFzc3dvcmRcbiAgZW1haWxJbnZhbGlkOiAnNDA3JyxcbiAgLy9sb2dpblxuICBlbWFpbElzTm90UmVnaXN0ZXJlZDogJzQwOCcsXG4gIGVtcHR5U3RyaW5nTm90VmFsaWQ6ICc0MDknLFxuICBlbWFpbG9ydXNlcm5hbWVOb3RWYWxpZDonNDEwJyxcbiAgdXNlcm5hbWVJc05vdFJlZ2lzdGVyZWQ6JzQxMScsXG4vL2NoYW5nZSBwYXNzd29yZFxuICBwYXNzd29yZERvTm90TWF0Y2g6JzQxMicsXG4gIHRva2VuRXhwaXJlZDonNDEzJyxcbiAgc2VydmVyVmFsaWRhdGlvblJhbmdlOiBzdGF0dXMgPT4ge1xuICAgIGlmIChzdGF0dXMgPj0gNDAwICYmIHN0YXR1cyA8PSA0MTApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn07XG4iLCJcbmltcG9ydCAqIGFzIHZhbGlkYXRpb25zIGZyb20gJy4vY29uc3RyYWludFZhbGlkYXRvcnMnO1xuaW1wb3J0IGNvbnN0VmFsVHlwZXMgZnJvbSAnLi92YWxpZGF0aW9uVHlwZXMnO1xuaW1wb3J0IHZhbGlkYXRpb25TdGF0ZXMgZnJvbSAnLi92YWxpZGF0aW9uU3RhdGVzJztcbmltcG9ydCB2YWxpZGF0aW9uVHlwZXMgZnJvbSAnLi92YWxpZGF0aW9uVHlwZXMnO1xuaW1wb3J0IGFjdGlvblR5cGVzIGZyb20gJy4vYWN0aW9uVHlwZXMnO1xuaW1wb3J0IGh0dHBTdGF0dXMgZnJvbSAnLi9odHRwLXN0YXR1cyc7XG5pbXBvcnQgdmFsaWRhdGlvbk1lc3NhZ2VzIGZyb20gJy4vdmFsaWRhdGlvbk1lc3NhZ2VzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNsaWVudFZhbGlkYXRpb24oeyB2YWxpZGF0aW9uVHlwZSwgdmFsdWUsIHN0YXRlIH0pIHtcbiAgbGV0IHZhbGlkYXRpb24gPSBudWxsO1xuICBzd2l0Y2ggKHZhbGlkYXRpb25UeXBlKSB7XG4gICAgY2FzZSBjb25zdFZhbFR5cGVzLkVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OOlxuICAgICAgdmFsaWRhdGlvbiA9IHZhbGlkYXRpb25zLnZhbGlkYXRlRW1haWxDb25zdHJhaW50KHtcbiAgICAgICAgZW1haWw6IHZhbHVlLFxuICAgICAgfSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIGNvbnN0VmFsVHlwZXMuVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT046XG4gICAgICB2YWxpZGF0aW9uID0gdmFsaWRhdGlvbnMudmFsaWRhdGVFbWFpbE9yVXNlcm5hbWUoe1xuICAgICAgICB2YWx1ZSxcbiAgICAgIH0pO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBjb25zdFZhbFR5cGVzLlBBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OOlxuICAgICAgdmFsaWRhdGlvbiA9IHZhbGlkYXRpb25zLnZhbGlkYXRlUGFzc3dvcmRDb25zdHJhaW50KHtcbiAgICAgICAgcGFzc3dvcmQ6IHZhbHVlLFxuICAgICAgfSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIGNvbnN0VmFsVHlwZXMuVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT046XG4gICAgICB2YWxpZGF0aW9uID0gdmFsaWRhdGlvbnMudmFsaWRhdGVVc2VyTmFtZUNvbnN0cmFpbnQoe1xuICAgICAgICB1c2VybmFtZTogdmFsdWUsXG4gICAgICB9KTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgY29uc3RWYWxUeXBlcy5FTVBUWV9TVFJJTkdfVkFMSURBVElPTjpcbiAgICAgIHZhbGlkYXRpb24gPSB2YWxpZGF0aW9ucy52YWxpZGF0ZUVtcHR5U3RyaW5nKHsgdmFsdWUgfSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIGNvbnN0VmFsVHlwZXMuUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT046XG4gICAgICBkZWJ1Z2dlcjtcbiAgICAgIHZhbGlkYXRpb24gPSB2YWxpZGF0aW9ucy52YWxpZGF0ZVBhc3N3b3JkTWF0Y2goeyBzdGF0ZSB9KTtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICBicmVhaztcbiAgfVxuXG4gIHJldHVybiB7IHR5cGU6IGFjdGlvblR5cGVzLkNMSUVOVF9WQUxJREFUSU9OLCAuLi52YWxpZGF0aW9uIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0Rm9ybVZhbGlkYXRpb25TdGF0ZSgpIHtcbiAgcmV0dXJuIHsgdHlwZTogYWN0aW9uVHlwZXMuSU5JVF9GT1JNX1ZBTElEQVRJT05fU1RBVEUgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlc2V0SW5wdXRWYWxpZGF0aW9uU3RhdGUoeyB2YWxpZGF0aW9uVHlwZSB9KSB7XG4gIHJldHVybiB7IHR5cGU6IGFjdGlvblR5cGVzLlJFU0VUX1ZBTElEQVRJT05fU1RBVEUsIHZhbGlkYXRpb25UeXBlIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbmNJbnB1dENvdW50KCkge1xuICByZXR1cm4geyB0eXBlOiBhY3Rpb25UeXBlcy5JTkNfSU5QVVRfQ09VVE4gfTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gc2VydmVyVmFsaWRhdGlvbih7IHN0YXR1cyA9IDAgfSkge1xuICBkZWJ1Z2dlcjtcbiAgc3dpdGNoIChzdGF0dXMpIHtcbiAgICBjYXNlIGh0dHBTdGF0dXMuY3JlZGVudGlhbEludmFsaWQ6XG4gICAgICBkZWJ1Z2dlcjtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLklOVkFMSURfQ1JFREVOVElBTFMsXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX0NSRURFTlRJQUxTLFxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcbiAgICAgIH07XG4gICAgY2FzZSBodHRwU3RhdHVzLmVtYWlsSW52YWxpZDpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLkVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OLFxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9FTUFJTCxcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXG4gICAgICB9O1xuICAgIGNhc2UgaHR0cFN0YXR1cy5wYXNzd29yZEludmFsaWQ6XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5QQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTixcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfUEFTU1dPUkQsXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxuICAgICAgfTtcbiAgICBjYXNlIGh0dHBTdGF0dXMudXNlcm5hbWVJbnZhbGlkOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT04sXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX1VTRVJOQU1FLFxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcbiAgICAgIH07XG4gICAgY2FzZSBodHRwU3RhdHVzLmVtYWlsSXNSZWdpc3RlcmVkOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuUkVHSVNURVJFRF9FTUFJTCxcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLlJFR0lTVEVSRURfRU1BSUwsXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxuICAgICAgfTtcbiAgICBjYXNlIGh0dHBTdGF0dXMuZW1haWxJc05vdFJlZ2lzdGVyZWQ6XG4gICAgICBkZWJ1Z2dlcjtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLkVNQUlMX05PVF9SRUdJU1RFUkVELFxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuRU1BSUxfTk9UX1JFR0lTVEVSRUQsXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxuICAgICAgfTtcbiAgICBjYXNlIGh0dHBTdGF0dXMudXNlcm5hbWVJc1Rha2VuOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfVEFLRU4sXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5VU0VSTkFNRV9UQUtFTixcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXG4gICAgICB9O1xuICAgIGNhc2UgaHR0cFN0YXR1cy5lbXB0eVN0cmluZ05vdFZhbGlkOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuRU1QVFlfU1RSSU5HX1ZBTElEQVRJT04sXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX0VNUFRZX1NUUklORyxcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXG4gICAgICB9O1xuICAgIGNhc2UgaHR0cFN0YXR1cy5lbWFpbG9ydXNlcm5hbWVOb3RWYWxpZDpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OLFxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9VU0VSTkFNRV9PUl9FTUFJTCxcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXG4gICAgICB9O1xuICAgIGNhc2UgaHR0cFN0YXR1cy51c2VybmFtZUlzTm90UmVnaXN0ZXJlZDpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX05PVF9SRUdJU1RFUkVELFxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuVVNFUk5BTUVfTk9UX1JFR0lTVEVSRUQsXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxuICAgICAgfTtcbiAgICAgIGNhc2UgaHR0cFN0YXR1cy5wYXNzd29yZERvTm90TWF0Y2g6XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5QQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTixcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLlBBU1NXT1JEU19ET19OT1RfTUFUQ0gsXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxuICAgICAgfTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cbiIsImNvbnN0IGltZyA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFFQUFBQUJBQ0FZQUFBQ3FhWEhlQUFBQUNYQklXWE1BQUFzVEFBQUxFd0VBbXB3WUFBQUNza2xFUVZSNG5PMmF1MjRUUVJTR1A5c0swRmdpSWdMbElvVXVxUU5VVk9IU21CTGVnSFFVZ1M3UGdaSU9oS21JWWloaTNzQUlDUXBTSktFRUNTc0dna0tMSlV1UktXWVdITE9MZCtmTTd0cngrYVNSSld0bi92L1l1N016Wnc0b2lxSW9pcUlvaWpLT0ZETFFPQU5jQWE0RFM4QkY0QUl3WlQ4QmZnSkg5dk1Ic0FPOEJUNEFuUXc4ZXVjU3NBYThBZHBBMTdHMTdSaHJkc3locGdEY0JtcVlmODAxNktqV3NXUGZJcHM3TnhFM2dGMzhCeDNWZHExbTdsd0dYcEZkNFAzdEpUQ2ZkcEJSUEVUMmZQdHFiV0ExNVZoUGNCWjQ3amtJSDYxcXZhWEtEUEEreHlBSHRYZkFkRnJCendGTm9jRW1zQTVVZ0FXZ2JOdUMvVzdkZzhZWDY5VXJrOEJIZ2FrRDRENVFpcUZWc3RlMkJIcjd3SGxSeEQyY3d5eEdYTTFzWS83bHBKU0J1a0MzWWIyTDJSU1llQXdVQmRwRk80YXIvcVpBRzRCN0F2RnQvS3pZaXNqdWhMdXV3cFBBZDBmUkE5eHUreWpLdU04SjMyd3NpYWs2Q25ZeGs1aHZWZ1IrbmlVVnV5WVFheEp2dGs5S0Nka3I4bXJZb0ZFVDFDT0IwVHB3TE9nZnhUSHdXdEEvZGt5enlMYXpGWUhKUVZRRXZqcVlsZXdKd3U2QUI4Q0V3T1FuUWQ5QmZCYjBuY0RFTnBCRDNIL2xMbjVuLzM3S1FtK0gvUU5LRmltbmdyQWY0S2x3ekgrZU00L01DdnMvaVNzeTFwTmdDNU5xa3BoTWl6dUN2alhnYTl5THgyWWg5RCtxQXJHUlh3cURiRFBVNGhSc2hrQytIZmJ4bXMxdE94d3d5Z21SRndMdFAwaFRZblZHUENVRzVobmFGNWhwWVNheHVFblJGV1JKMFQwOEprVUQ1akFwWjFkVFhjeHJiQU96Vmxqa2IxcDgwWDYzd1pDbXhRTm1NSWNQRW9OcHRsUVBSZ0xHK21pc2wxV0c0M0QwRnhrZmp2WXlqOWszNUJWOGpSeVB4M3RaSnZzQ2llVk1Ja3RBQVZPK3NrVjZKVEpid0UyR3NFU21uNkJJcW9HOFNLcEJpa1ZTV1pYSkxSRmVKamRscnpraXZFeHVoeEV0azFNVVJWRVVSVkVVWmJqNURja01GZVFockZqOUFBQUFBRWxGVGtTdVFtQ0NcIjtcbiAgZXhwb3J0IGRlZmF1bHQgaW1nOyIsImNvbnN0IGltZyA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFFQUFBQUJBQ0FZQUFBQ3FhWEhlQUFBQUNYQklXWE1BQUFzVEFBQUxFd0VBbXB3WUFBQURzMGxFUVZSNG5PM2JTMmhjVlJ6SDhVOWFvOUl5bW9Jb1NtT3FMYTByTjc1d0s0SmF0SlFhRmV6Q2lOS3RpRkJjNk5LVmRDT0tDMUVySW9vS29xQ0M0RnZSalNLMWlpNUVEV2hOVWZFRmdSaU1pek9STkwwM2N4NXpaMkp5Zi9Bbk1NbWMzLy8vemJuM250ZWxWYXRXclU3VVhzeDBZOStRY3htS1pyRFFqYjh4T2R4MEJxK2xBTllsaEgxQzBjc2gzRFRNcEFhdFNTMkVXZ2czRHpPcFFhdUZZSTFER0luOHUwazhpMU9XZkRhUC9YaSt4M2UzNERKYzNJMWQzYy9PN01ZLytBVS9kMzhleDZmNEVKOWdMakxIeGxYVkUrWlY5NFFMY0RmZXJ2aE9Tc3ppZmR5TGM1b3BLMDI5SUZ5TlY0WC9hbTdSZFRHSEY3b2VzVDIzRWRWQitGTC9pNjZMSTdpcTZVSlhVaFdFWWNTTG1HaTQxbHF0RmdpenVLdmhXbXUxV2lBczREQk9hN1RhR3EwbUNCL2ozS1lLUFI5dllYdkY3MkloSE1NaFhDOWN1NXZRRWNZR3UvRXdwaVBhV1NtK3g5WSsxZzNPeHRkZGcybnBFSDdDRkVZanZEYmlEdnhRMDFaTUhNVllhcEYxMml5TXlKWWFwRUk0a09IYndTc1ZiY1hHZXpnOXcvY2tQVkZqa0FKaEhyZGtlRy9BUXpYK01mRmNodWNKMnQvRFlGQVFTbnJDalJtZTREejhHV0V3Q0FnZCtmZUVZOExrSzFtSEUwd0dBZUhPaEh5V3g1T3BacGRrbURRTllhT3lSK1NsS1dhdlpacE1ZMXRGZS8yQzhFaG1YZ3Q0SnRaa3U3THA3TFUxN2ZZRHd1NkN2T2FFKzFwUFBWaGdzb0R4RmRvdWhYQlJZVzRQeEpnY0x6VHBOU0VwZ2RBcHpHMG13cU1ZUU13UU5CZkNwc0xjb2dBY0tqUzVJc1pFSG9TSnd0eWlMb0ZkaFNhM3haaDBsUXJoaG9LOG9tK0M4SHFCMFdPeEpsMmxRQ2pwbmRHUFFmSUdRb3N4aTdOU3pNUkJHQldHdGJsNUpRMkVDQnNldVdiM3A1cnBEV0dxSUovSE0vS3hGYjluR3Y2Qm5SbWVkUkFPQ0lzcU9ibjhxR0J4NVBaTTB3VjhMaXltcEtyZmE0eDdNM0w0VHlQS0xvV1hEQmZDVXhuZUoybXpzRm1abThRUjdNandMWVh3Sms3TjhLM1VPTDRyU09ZMzNLYy9UNGVZK0F4blpOUzVvcmJoMjR4a2xzYXNNRTZZRWthTVk4TGNZUnpYcU43bVNvWHdqWWIzQm80bUpKTWFPVXZ1UytNZDZiMHNXUjI4SEpITW9DRThLbTdmb1MvYWdIdUVMcjBhSUR6ZC94TGp0QlB2VmlRMGFBaDFKMVVHb2hIczBjd0JpZjhOQk1LcTdSNjhvZjhRTHF6d1c1VVFGclVEQi9HUnN1TG5oRDIrNjJwOGlvL3dEZUt3MFJndXg1WENvdWFFOERqdENHT0FVV0h5OUt0d1ZPNHJmQ0dNSUQvQVh6M2FyenZDZDZ0d3FHcGRxRDNicklXQWVnanI2bjJIRm9KNkNPdnFIYWdxQ0ZFYkkydEp5eUdzT3dDRWJyLzRHbURSK21DclZxM1dudjRGcnJjdWoyT2ZSNXNBQUFBQVNVVk9SSzVDWUlJPVwiO1xuICBleHBvcnQgZGVmYXVsdCBpbWc7IiwiaW1wb3J0IHtofSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHt1c2VTdGF0ZX0gZnJvbSAncHJlYWN0L2hvb2tzJ1xuaW1wb3J0IG9wZW5JY29uIGZyb20gJy4vaWNvbnMvb3BlbkV5ZS5wbmcnO1xuaW1wb3J0IGNsb3NlSWNvbiBmcm9tICcuL2ljb25zL2Nsb3NlRXllLnBuZyc7XG5mdW5jdGlvbiBJY29uU3RhdGUoeyBvcGVuIH0pIHtcbiAgaWYgKG9wZW4pIHtcbiAgICByZXR1cm4gPGltZyB3aWR0aD1cIjMwcHhcIiBzcmM9e29wZW5JY29ufSAvPjtcbiAgfVxuICByZXR1cm4gPGltZyB3aWR0aD1cIjMwcHhcIiBzcmM9e2Nsb3NlSWNvbn0gLz47XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEV5ZUljb24oe29uQ2xpY2t9KSB7XG4gIGNvbnN0IFtzdGF0ZSwgc2V0U3RhdGVdID0gdXNlU3RhdGUoZmFsc2UpO1xuICBmdW5jdGlvbiB0b2dnbGUoKSB7XG4gICAgb25DbGljaygpXG4gICAgc2V0U3RhdGUocHJldiA9PiAhcHJldik7XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIG9uQ2xpY2s9e3RvZ2dsZX1cbiAgICAgIHN0eWxlPXt7XG4gICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgIGp1c3RpZnlDb250ZW50OidjZW50ZXInLFxuICAgICAgICBtYXJnaW46IDFcbiAgICAgIH19XG4gICAgPlxuICAgICAgPEljb25TdGF0ZSBvcGVuPXtzdGF0ZX0gLz5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiIsImltcG9ydCBhY3Rpb25UeXBlcyBmcm9tICcuL2FjdGlvblR5cGVzJztcbmltcG9ydCB2YWxpZGF0aW9uU3RhdGUgZnJvbSAnLi92YWxpZGF0aW9uU3RhdGVzJztcblxuZXhwb3J0IGNvbnN0IGluaXRTdGF0ZSA9IHsgdmFsaWRhdGlvbjoge30gfTtcblxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1SZWR1Y2VyKHN0YXRlLCBhY3Rpb24pIHtcbiAgbGV0IG5leHRTdGF0ZSA9IG51bGw7XG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OOlxuICAgICAgbmV4dFN0YXRlID0ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgdmFsaWRhdGlvbjoge1xuICAgICAgICAgIC4uLnN0YXRlLnZhbGlkYXRpb24sXG4gICAgICAgICAgW2FjdGlvbi52YWxpZGF0aW9uVHlwZV06IHtcbiAgICAgICAgICAgIHZhbGlkYXRpb25TdGF0ZTogYWN0aW9uLnZhbGlkYXRpb25TdGF0ZSxcbiAgICAgICAgICAgIG1lc3NhZ2U6IGFjdGlvbi5tZXNzYWdlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gbmV4dFN0YXRlO1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ0xJRU5UX1ZBTElEQVRJT046XG4gICAgICBuZXh0U3RhdGUgPSB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICB2YWxpZGF0aW9uOiB7XG4gICAgICAgICAgLi4uc3RhdGUudmFsaWRhdGlvbixcblxuICAgICAgICAgIFthY3Rpb24udmFsaWRhdGlvblR5cGVdOiB7XG4gICAgICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IGFjdGlvbi52YWxpZGF0aW9uU3RhdGUsXG4gICAgICAgICAgICBtZXNzYWdlOiBhY3Rpb24ubWVzc2FnZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfTtcblxuICAgICAgcmV0dXJuIG5leHRTdGF0ZTtcblxuICAgIGNhc2UgYWN0aW9uVHlwZXMuUkVTRVRfVkFMSURBVElPTl9TVEFURTpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICB2YWxpZGF0aW9uOiB7XG4gICAgICAgICAgLi4uc3RhdGUudmFsaWRhdGlvbixcbiAgICAgICAgICBbYWN0aW9uLnZhbGlkYXRpb25UeXBlXToge1xuICAgICAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5BQ1RJVkUsXG4gICAgICAgICAgICBtZXNzYWdlOiAnJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfTtcblxuICAgIGNhc2UgYWN0aW9uVHlwZXMuSU5QVVRfRk9DVVNFRDpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICB2YWxpZGF0aW9uOiB7XG4gICAgICAgICAgLi4uc3RhdGUudmFsaWRhdGlvbixcbiAgICAgICAgICBmb3JtU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTkFDVElWRSxcbiAgICAgICAgICBbYWN0aW9uLnByb3BOYW1lXToge1xuICAgICAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5BQ1RJVkUsXG4gICAgICAgICAgICBtZXNzYWdlOiAnJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLklOSVRfRk9STV9WQUxJREFUSU9OX1NUQVRFOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIHZhbGlkYXRpb246IHtcbiAgICAgICAgICAuLi5zdGF0ZS52YWxpZGF0aW9uLFxuICAgICAgICAgIGZvcm1TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOQUNUSVZFLFxuICAgICAgICB9LFxuICAgICAgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLklOQ19JTlBVVF9DT1VUTjpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBjb3VudDogc3RhdGUuY291bnQgKyAxIH07XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyB1c2VSZWR1Y2VyLCB1c2VDb250ZXh0LCB1c2VTdGF0ZSwgdXNlTWVtbyB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XG5pbXBvcnQgeyBmb3JtUmVkdWNlciwgaW5pdFN0YXRlIH0gZnJvbSAnLi9mb3JtUmVkdWNlcic7XG5jb25zdCBGb3JtQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUZvcm1Db250ZXh0KCkge1xuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChGb3JtQ29udGV4dCk7XG4gIGlmICghY29udGV4dCkge1xuICAgIHRocm93IG5ldyBFcnJvcigndXNlRm9ybUNvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggQXBwUHJvdmlkZXInKTtcbiAgfVxuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IGNvbnRleHQ7XG5cbiAgcmV0dXJuIHsgc3RhdGUsIGRpc3BhdGNoIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBGb3JtUHJvdmlkZXIocHJvcHMpIHtcbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSB1c2VSZWR1Y2VyKGZvcm1SZWR1Y2VyLCBpbml0U3RhdGUpO1xuICBjb25zdCB2YWx1ZSA9IHVzZU1lbW8oKCkgPT4gW3N0YXRlLCBkaXNwYXRjaF0sIFtzdGF0ZV0pO1xuICByZXR1cm4gPEZvcm1Db250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0gey4uLnByb3BzfSAvPjtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XG5pbXBvcnQgKiBhcyBhY3Rpb25zIGZyb20gJy4vYWN0aW9ucyc7XG5pbXBvcnQgdmFsaWRhdGlvblN0YXRlcyBmcm9tICcuL3ZhbGlkYXRpb25TdGF0ZXMnO1xuaW1wb3J0IHsgaXNDbGllbnRWYWxpZGF0aW9uVHlwZSB9IGZyb20gJy4vY29uc3RyYWludFZhbGlkYXRvcnMnO1xuaW1wb3J0IEV5ZUljb24gZnJvbSAnLi9FeWVJY29uJztcbmltcG9ydCB7IHVzZUZvcm1Db250ZXh0IH0gZnJvbSAnLi9mb3JtLWNvbnRleHQnO1xuZnVuY3Rpb24gVmFsaWRpdHlJY29uKHsgdmFsaWQgfSkge1xuICBsZXQgc3RhdGVDb2xvciA9ICcjNGZjM2Y3JztcbiAgc3dpdGNoICh2YWxpZCkge1xuICAgIGNhc2UgdmFsaWRhdGlvblN0YXRlcy5WQUxJRDpcbiAgICAgIHN0YXRlQ29sb3IgPSAnZ3JlZW4nO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQ6XG4gICAgICBzdGF0ZUNvbG9yID0gJ3JlZCc7XG4gICAgICBicmVhaztcbiAgICBjYXNlIHZhbGlkYXRpb25TdGF0ZXMuSU5BQ1RJVkU6XG4gICAgICBzdGF0ZUNvbG9yID0gJyM0ZmMzZjcnO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHN0YXRlQ29sb3IgPSAnIzRmYzNmNyc7XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIHN0eWxlPXt7XG4gICAgICAgIGZsZXg6IDEsXG4gICAgICAgIGNvbG9yOiBzdGF0ZUNvbG9yLFxuICAgICAgICBsaW5lSGVpZ2h0OiAyLFxuICAgICAgICB3aWR0aDogMjAsXG4gICAgICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gICAgICB9fVxuICAgID5cbiAgICAgIHt2YWxpZCA/ICfinJMnIDogJ+KYkyd9XG4gICAgPC9kaXY+XG4gICk7XG59XG5cbmNvbnN0IHN0eWxlID0ge1xuICBpbnB1dDoge1xuICAgIG1hcmdpbjogMSxcbiAgICBib3JkZXI6ICcxcHggc29saWQnLFxuICAgIHBhZGRpbmc6IDgsXG4gICAgZmxleDogMTAsXG4gICAgYm9yZGVyUmFkaXVzOiAyLFxuICB9LFxuICByb290OiB7XG4gICAgYm9yZGVyUmFkaXVzOiAyLFxuICAgIG1hcmdpbjogMyxcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXG4gICAgYmFja2dyb3VuZENvbG9yOiAnd2hpdGUnLFxuICAgIGJvcmRlcjogJzFweCBzb2xpZCB3aGl0ZScsXG4gICAgbWFyZ2luQm90dG9tOiAxLFxuICB9LFxuICBpbnB1dENvbnRhaW5lcjoge1xuICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICBmbGV4OiAxLFxuICB9LFxuICBtZXNzYWdlOiB7XG4gICAgY29sb3I6ICdyZWQnLFxuICAgIHBhZGRpbmdMZWZ0OiAzLFxuICB9LFxufTtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIElucHV0KHtcbiAgcGxhY2Vob2xkZXIsXG4gIHR5cGUsXG4gIG5hbWUsXG4gIG9uQ2hhbmdlLFxuICB2YWx1ZSA9ICcnLFxuICB2YWxpZGF0aW9uVHlwZXMgPSBbXSxcbiAgaWQsXG59KSB7XG4gIGNvbnN0IHsgc3RhdGUsIGRpc3BhdGNoIH0gPSB1c2VGb3JtQ29udGV4dCgpO1xuXG4gIGNvbnN0IFtpbnB1dFZhbGlkYXRpb24sIHNldElucHV0VmFsaWRhdGlvbl0gPSB1c2VTdGF0ZSh7XG4gICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOQUNUSVZFLFxuICAgIG1lc3NhZ2U6ICcnLFxuICAgIHZhbGlkYXRpb25UeXBlOiB1bmRlZmluZWQsXG4gIH0pO1xuXG4gIGNvbnN0IFtpbnB1dFR5cGUsIHNldElucHV0VHlwZV0gPSB1c2VTdGF0ZSh0eXBlKTtcblxuICBjb25zdCBbYm9yZGVyQ29sb3IsIHNldEJvcmRlckNvbG9yXSA9IHVzZVN0YXRlKCcnKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChcbiAgICAgIGlucHV0VmFsaWRhdGlvbiAmJlxuICAgICAgaW5wdXRWYWxpZGF0aW9uLnZhbGlkYXRpb25TdGF0ZSA9PT0gdmFsaWRhdGlvblN0YXRlcy5WQUxJRFxuICAgICkge1xuICAgICAgc2V0Qm9yZGVyQ29sb3IoJ2dyZWVuJyk7XG4gICAgfVxuICAgIGlmIChcbiAgICAgIGlucHV0VmFsaWRhdGlvbiAmJlxuICAgICAgaW5wdXRWYWxpZGF0aW9uLnZhbGlkYXRpb25TdGF0ZSA9PT0gdmFsaWRhdGlvblN0YXRlcy5JTlZBTElEXG4gICAgKSB7XG4gICAgICBzZXRCb3JkZXJDb2xvcigncmVkJyk7XG4gICAgfVxuICAgIGlmIChcbiAgICAgIGlucHV0VmFsaWRhdGlvbiAmJlxuICAgICAgaW5wdXRWYWxpZGF0aW9uLnZhbGlkYXRpb25TdGF0ZSA9PT0gdmFsaWRhdGlvblN0YXRlcy5JTkFDVElWRVxuICAgICkge1xuICAgICAgc2V0Qm9yZGVyQ29sb3IoJyM0ZmMzZjcnKTtcbiAgICB9XG4gIH0sIFtpbnB1dFZhbGlkYXRpb25dKTtcbiAgZnVuY3Rpb24gaGFuZGxlRm9jdXMoKSB7XG4gICAgdmFsaWRhdGlvblR5cGVzLmZvckVhY2goKHZhbGlkYXRpb25OYW1lKSA9PiB7XG4gICAgICBpZiAoc3RhdGUuZm9ybS52YWxpZGF0aW9uW3ZhbGlkYXRpb25OYW1lXSkge1xuICAgICAgICBkaXNwYXRjaChcbiAgICAgICAgICBhY3Rpb25zLnJlc2V0SW5wdXRWYWxpZGF0aW9uU3RhdGUoeyB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvbk5hbWUgfSlcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBmdW5jdGlvbiBoYW5kbGVCbHVyKCkge1xuICAgIHZhbGlkYXRpb25UeXBlcy5mb3JFYWNoKCh2YWxpZGF0aW9uTmFtZSkgPT4ge1xuICAgICAgaWYgKGlzQ2xpZW50VmFsaWRhdGlvblR5cGUoeyB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvbk5hbWUgfSkpIHtcbiAgICAgICAgZGlzcGF0Y2goXG4gICAgICAgICAgYWN0aW9ucy5jbGllbnRWYWxpZGF0aW9uKHtcbiAgICAgICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uTmFtZSxcbiAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgc3RhdGUsXG4gICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRvZ2dsZUV5ZSgpIHtcbiAgICBpZiAoaW5wdXRUeXBlID09PSAncGFzc3dvcmQnKSB7XG4gICAgICBzZXRJbnB1dFR5cGUoJ3RleHQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2V0SW5wdXRUeXBlKCdwYXNzd29yZCcpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3N0eWxlLnJvb3R9PlxuICAgICAgPGRpdiBzdHlsZT17c3R5bGUuaW5wdXRDb250YWluZXJ9PlxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICBzdHlsZT17eyAuLi5zdHlsZS5pbnB1dCwgYm9yZGVyQ29sb3IgfX1cbiAgICAgICAgICB0eXBlPXtpbnB1dFR5cGV9XG4gICAgICAgICAgbmFtZT17bmFtZX1cbiAgICAgICAgICBvbkNoYW5nZT17b25DaGFuZ2V9XG4gICAgICAgICAgdmFsdWU9e3ZhbHVlfVxuICAgICAgICAgIG9uQmx1cj17aGFuZGxlQmx1cn1cbiAgICAgICAgICBwbGFjZWhvbGRlcj17cGxhY2Vob2xkZXJ9XG4gICAgICAgICAgb25Gb2N1cz17aGFuZGxlRm9jdXN9XG4gICAgICAgICAgZGF0YS10ZXN0aWQ9e2lkfVxuICAgICAgICAvPlxuICAgICAgICB7dmFsaWRhdGlvblR5cGVzLm1hcCgodmFsaWRhdGlvbk5hbWUpID0+IHtcbiAgICAgICAgICBpZiAoc3RhdGUudmFsaWRhdGlvblt2YWxpZGF0aW9uTmFtZV0pIHtcbiAgICAgICAgICAgIGNvbnN0IHsgdmFsaWRhdGlvblN0YXRlIH0gPSBzdGF0ZS52YWxpZGF0aW9uW3ZhbGlkYXRpb25OYW1lXTtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgdmFsaWRhdGlvblN0YXRlID09PSB2YWxpZGF0aW9uU3RhdGVzLlZBTElEIHx8XG4gICAgICAgICAgICAgIHZhbGlkYXRpb25TdGF0ZSA9PT0gdmFsaWRhdGlvblN0YXRlcy5JTlZBTElEXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8VmFsaWRpdHlJY29uIGtleT17dmFsaWRhdGlvbk5hbWV9IHZhbGlkPXt2YWxpZGF0aW9uU3RhdGV9IC8+XG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgIH0pfVxuICAgICAgICB7dHlwZSA9PT0gJ3Bhc3N3b3JkJyAmJiA8RXllSWNvbiBvbkNsaWNrPXt0b2dnbGVFeWV9IC8+fVxuICAgICAgPC9kaXY+XG4gICAgICB7dmFsaWRhdGlvblR5cGVzLm1hcCgodmFsaWRhdGlvbk5hbWUpID0+IHtcbiAgICAgICAgaWYgKHN0YXRlLnZhbGlkYXRpb25bdmFsaWRhdGlvbk5hbWVdKSB7XG4gICAgICAgICAgY29uc3QgeyBtZXNzYWdlIH0gPSBzdGF0ZS52YWxpZGF0aW9uW3ZhbGlkYXRpb25OYW1lXTtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBrZXk9e3ZhbGlkYXRpb25OYW1lfSBzdHlsZT17c3R5bGUubWVzc2FnZX0+XG4gICAgICAgICAgICAgIHttZXNzYWdlICE9PSAnJyAmJiAoXG4gICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgcm9sZT1cIm1lc3NhZ2VcIlxuICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9e2BtZXNzYWdlLSR7bmFtZX1gfVxuICAgICAgICAgICAgICAgID57YCogJHttZXNzYWdlfWB9PC9kaXY+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9KX1cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiIsImltcG9ydCB7aH0gZnJvbSAncHJlYWN0JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQnV0dG9uKHsgb25DbGljaywgdGl0bGUsIGRpc2FibGVkLCBpZCB9KSB7XG4gIHJldHVybiAoXG4gICAgPGJ1dHRvblxuICAgICAgZGF0YS10ZXN0aWQ9e2lkfVxuICAgICAgZGlzYWJsZWQ9e2Rpc2FibGVkfVxuICAgICAgc3R5bGU9e3sgYm9yZGVyUmFkaXVzOiAyLCBoZWlnaHQ6IDMzIH19XG4gICAgICBvbkNsaWNrPXtvbkNsaWNrfVxuICAgID5cbiAgICAgIHt0aXRsZX1cbiAgICA8L2J1dHRvbj5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcbmltcG9ydCAqIGFzIHZhbGlkYXRpb25BY3Rpb25zIGZyb20gJy4vYWN0aW9ucyc7XG5pbXBvcnQgeyBGb3JtUHJvdmlkZXIgfSBmcm9tICcuL2Zvcm0tY29udGV4dCc7XG5jb25zdCBzdHlsZSA9IHtcbiAgZGlzcGxheTogJ2ZsZXgnLFxuICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcbiAgd2lkdGg6IDMwMCxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEZvcm0oeyBjaGlsZHJlbiwgZm9ybVRpdGxlLCBlcnJvciB9KSB7XG4gIHJldHVybiAoXG4gICAgPEZvcm1Qcm92aWRlcj5cbiAgICAgIDxmaWVsZHNldCBzdHlsZT17c3R5bGV9PlxuICAgICAgICA8bGVnZW5kPntmb3JtVGl0bGV9OjwvbGVnZW5kPlxuICAgICAgICB7Y2hpbGRyZW59XG4gICAgICAgIHtlcnJvciAmJiAoXG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgY29sb3I6ICdyZWQnLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICd3aGl0ZScsXG4gICAgICAgICAgICAgIHBhZGRpbmc6IDUsXG4gICAgICAgICAgICAgIGJvcmRlclJhZGl1czogNSxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgKiB7ZXJyb3IubWVzc2FnZX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cbiAgICAgIDwvZmllbGRzZXQ+XG4gICAgPC9Gb3JtUHJvdmlkZXI+XG4gICk7XG59XG4iLCJleHBvcnQgZGVmYXVsdCB7XG4gIFZBTFVFX0NIQU5HRUQ6ICdWQUxVRV9DSEFOR0VEJyxcbiAgTE9HSU5fU1RBUlRFRDogJ0xPR0lOX1NUQVJURUQnLFxuICBMT0dJTl9TVUNDRVNTOiAnTE9HSU5fU1VDQ0VTUycsXG4gIExPR0lOX0ZBSUxFRDogJ0xPR0lOX0ZBSUxFRCcsXG5cbiAgTE9HT1VUX1NUQVJURUQ6ICdMT0dPVVRfU1RBUlRFRCcsXG4gIExPR09VVF9GQUlMRUQ6ICdMT0dPVVRfRkFJTEVEJyxcbiAgTE9HT1VUX1NVQ0NFU1M6ICdMT0dPVVRfU1VDQ0VTUycsXG5cbiAgU0lHTlVQX1NUQVJURUQ6ICdTSUdOVVBfU1RBUlRFRCcsXG4gIFNJR05VUF9TVUNDRVNTOiAnU0lHTlVQX1NVQ0NFU1MnLFxuICBTSUdOVVBfRkFJTEVEOiAnU0lHTlVQX0ZBSUxFRCcsXG5cbiAgQ0hBTkdFX1BBU1NXT1JEX1NUQVJURUQ6ICdDSEFOR0VfUEFTU1dPUkRfU1RBUlRFRCcsXG4gIENIQU5HRV9QQVNTV09SRF9TVUNDRVNTOiAnQ0hBTkdFX1BBU1NXT1JEX1NVQ0NFU1MnLFxuICBDSEFOR0VfUEFTU1dPUkRfRkFJTEVEOiAnQ0hBTkdFX1BBU1NXT1JEX0ZBSUxFRCcsXG5cbiAgUkVRVUVTVF9QQVNTX0NIQU5HRV9TVEFSVEVEOiAnUkVRVUVTVF9QQVNTX0NIQU5HRV9TVEFSVEVEJyxcbiAgUkVRVUVTVF9QQVNTX0NIQU5HRV9TVUNDRVNTOiAnUkVRVUVTVF9QQVNTX0NIQU5HRV9TVUNDRVNTJyxcbiAgUkVRVUVTVF9QQVNTX0NIQU5HRV9GQUlMRUQ6ICdSRVFVRVNUX1BBU1NfQ0hBTkdFX0ZBSUxFRCcsXG4gIEdPVF9UT0tFTl9GUk9NX1VSTDogJ0dPVF9UT0tFTl9GUk9NX1VSTCcsXG59O1xuIiwiaW1wb3J0IGFjdGlvblR5cGVzIGZyb20gJy4vYWN0aW9uVHlwZXMnO1xuaW1wb3J0IHsgc2VydmVyVmFsaWRhdGlvbiB9IGZyb20gJy4uL2Zvcm0vYWN0aW9ucyc7XG5pbXBvcnQgaHR0cFN0YXR1cyBmcm9tICcuLi9mb3JtL2h0dHAtc3RhdHVzJztcbmV4cG9ydCBmdW5jdGlvbiB2YWx1ZUNoYW5nZWQoeyBwcm9wTmFtZSwgdmFsdWUgfSkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IGFjdGlvblR5cGVzLlZBTFVFX0NIQU5HRUQsXG4gICAgcGF5bG9hZDoge1xuICAgICAgcHJvcE5hbWUsXG4gICAgICB2YWx1ZSxcbiAgICB9LFxuICB9O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbG9naW4oeyBkaXNwYXRjaCwgc3RhdGUgfSkge1xuICB0cnkge1xuICAgIGNvbnN0IHsgZW1haWxvcnVzZXJuYW1lLCBwYXNzd29yZCB9ID0gc3RhdGU7XG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5MT0dJTl9TVEFSVEVEIH0pO1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXG4gICAgICBgJHtwcm9jZXNzLmVudi5SRUFDVF9BUFBfWEFGX1NFUlZFUl9VUkx9L2F1dGgvbG9naW5gLFxuICAgICAge1xuICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgJ0NvbnRlbi1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJzogJyonLFxuICAgICAgICAgIEF1dGhvcml6YXRpb246ICdCYXNpYyAnICsgYnRvYShgJHtlbWFpbG9ydXNlcm5hbWV9OiR7cGFzc3dvcmR9YCksXG4gICAgICAgIH0sXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB9XG4gICAgKTtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkxPR0lOX1NVQ0NFU1MsIHRva2VuOiByZXN1bHQudG9rZW4gfSk7XG4gICAgfSBlbHNlIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDQwMCkge1xuICAgICAgY29uc3QgeyBlcnJvcnMgfSA9IHJlc3VsdDtcblxuICAgICAgZXJyb3JzLmZvckVhY2goKGVycm9yKSA9PiB7XG4gICAgICAgIGRpc3BhdGNoKFxuICAgICAgICAgIHNlcnZlclZhbGlkYXRpb24oe1xuICAgICAgICAgICAgc3RhdHVzOiBlcnJvcixcbiAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTG9naW4gZmFpbGVkJyk7XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTE9HSU5fRkFJTEVELCBwYXlsb2FkOiB7IGVycm9yIH0gfSk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNpZ251cCh7IGRpc3BhdGNoLCBzdGF0ZSB9KSB7XG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0lHTlVQX1NUQVJURUQgfSk7XG4gIGNvbnN0IHsgZW1haWwsIHBhc3N3b3JkLCB1c2VybmFtZSB9ID0gc3RhdGU7XG4gIHRyeSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcbiAgICAgIGAke3Byb2Nlc3MuZW52LlJFQUNUX0FQUF9YQUZfU0VSVkVSX1VSTH0vYXV0aC9zaWdudXBgLFxuICAgICAge1xuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IHBhc3N3b3JkLCBlbWFpbCwgdXNlcm5hbWUgfSksXG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICBDb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgIEFjY2VwdDogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICB9LFxuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIH1cbiAgICApO1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAyMDApIHtcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0lHTlVQX1NVQ0NFU1MsIHRva2VuOiByZXN1bHQudG9rZW4gfSk7XG4gICAgfSBlbHNlIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDQwMCkge1xuICAgICAgY29uc3QgeyBlcnJvcnMgfSA9IHJlc3VsdDtcbiAgICAgIGVycm9ycy5mb3JFYWNoKChlcnJvcikgPT4ge1xuICAgICAgICBkaXNwYXRjaChcbiAgICAgICAgICBzZXJ2ZXJWYWxpZGF0aW9uKHtcbiAgICAgICAgICAgIHN0YXR1czogZXJyb3IsXG4gICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NpZ251cCBmYWlsZWQnKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TSUdOVVBfRkFJTEVELCBwYXlsb2FkOiB7IGVycm9yIH0gfSk7XG4gIH1cbn1cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsb2dvdXQoeyBkaXNwYXRjaCwgc3RhdGUgfSkge1xuICB0cnkge1xuICAgIGNvbnN0IHsgdG9rZW4gfSA9IHN0YXRlO1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXG4gICAgICBgJHtwcm9jZXNzLmVudi5SRUFDVF9BUFBfWEFGX1NFUlZFUl9VUkx9L2F1dGgvbG9nb3V0P2AgK1xuICAgICAgICBuZXcgVVJMU2VhcmNoUGFyYW1zKHsgdG9rZW4gfSlcbiAgICApO1xuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTE9HT1VUX1NUQVJURUQgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5MT0dPVVRfRkFJTEVELCBlcnJvciB9KTtcbiAgfVxufVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNoYW5nZVBhc3N3b3JkKHsgZGlzcGF0Y2gsIHN0YXRlIH0pIHtcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfU1RBUlRFRCB9KTtcbiAgdHJ5IHtcbiAgICBjb25zdCB7IGNvbmZpcm0sIHBhc3N3b3JkLCB0b2tlbiwgZW1haWxvcnVzZXJuYW1lLCBjdXJyZW50IH0gPSBzdGF0ZTtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxuICAgICAgYCR7cHJvY2Vzcy5lbnYuUkVBQ1RfQVBQX1hBRl9TRVJWRVJfVVJMfS9hdXRoL2NoYW5nZXBhc3NgLFxuICAgICAge1xuICAgICAgICBtZXRob2Q6ICdwdXQnLFxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgY29uZmlybSxcbiAgICAgICAgICBwYXNzd29yZCxcbiAgICAgICAgICBjdXJyZW50LFxuICAgICAgICAgIHRva2VuLFxuICAgICAgICAgIGVtYWlsb3J1c2VybmFtZSxcbiAgICAgICAgfSksXG4gICAgICB9XG4gICAgKTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAyMDApIHtcbiAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX1NVQ0NFU1MsXG4gICAgICAgIHRva2VuOiByZXN1bHQudG9rZW4sXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDAwKSB7XG4gICAgICBjb25zdCB7IGVycm9ycyB9ID0gcmVzdWx0O1xuICAgICAgZXJyb3JzLmZvckVhY2goKGVycm9yKSA9PiB7XG4gICAgICAgIGRpc3BhdGNoKFxuICAgICAgICAgIHNlcnZlclZhbGlkYXRpb24oe1xuICAgICAgICAgICAgc3RhdHVzOiBlcnJvcixcbiAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDUwMCkge1xuICAgICAgY29uc3QgeyBlcnJvciB9ID0gcmVzdWx0O1xuXG4gICAgICBkaXNwYXRjaCh7XG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLkNIQU5HRV9QQVNTV09SRF9GQUlMRUQsXG4gICAgICAgIGVycm9yOiBlcnJvcixcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NoYW5naW5nIHBhc3N3b3JkIGZhaWxlZCcpO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBkaXNwYXRjaCh7XG4gICAgICB0eXBlOiBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfRkFJTEVELFxuICAgICAgcGF5bG9hZDogeyBlcnJvciB9LFxuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmb3Jnb3RQYXNzd29yZCh7IGRpc3BhdGNoLCBzdGF0ZSB9KSB7XG4gIHRyeSB7XG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5SRVFVRVNUX1BBU1NfQ0hBTkdFX1NUQVJURUQgfSk7XG4gICAgY29uc3QgeyBlbWFpbCB9ID0gc3RhdGU7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCgnL3JlcXVlc3RwYXNzY2hhbmdlJywge1xuICAgICAgbWV0aG9kOiAncG9zdCcsXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IGVtYWlsIH0pLFxuICAgIH0pO1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAyMDApIHtcbiAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX1NVQ0NFU1MsXG4gICAgICAgIHRva2VuOiByZXN1bHQudG9rZW4sXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDAwKSB7XG4gICAgICBjb25zdCB7IGVycm9ycyB9ID0gcmVzdWx0O1xuICAgICAgZXJyb3JzLmZvckVhY2goKGVycm9yKSA9PiB7XG4gICAgICAgIGRpc3BhdGNoKFxuICAgICAgICAgIHNlcnZlclZhbGlkYXRpb24oe1xuICAgICAgICAgICAgc3RhdHVzOiBlcnJvcixcbiAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDUwMCkge1xuICAgICAgY29uc3QgeyBlcnJvciB9ID0gcmVzdWx0O1xuXG4gICAgICBkaXNwYXRjaCh7XG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLkNIQU5HRV9QQVNTV09SRF9GQUlMRUQsXG4gICAgICAgIGVycm9yOiBlcnJvcixcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NoYW5naW5nIHBhc3N3b3JkIGZhaWxlZCcpO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBkaXNwYXRjaCh7XG4gICAgICB0eXBlOiBhY3Rpb25UeXBlcy5SRVFVRVNUX1BBU1NfQ0hBTkdFX0ZBSUxFRCxcbiAgICAgIHBheWxvYWQ6IHsgZXJyb3I6IGVyciB9LFxuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUb2tlbkZyb21VcmwoeyB0b2tlbiB9KSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogYWN0aW9uVHlwZXMuR09UX1RPS0VOX0ZST01fVVJMLFxuICAgIHRva2VuLFxuICB9O1xufVxuIl0sIm5hbWVzIjpbInN0eWxlSW5qZWN0IiwiY3NzIiwicmVmIiwiaW5zZXJ0QXQiLCJkb2N1bWVudCIsImhlYWQiLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsInN0eWxlIiwiY3JlYXRlRWxlbWVudCIsInR5cGUiLCJmaXJzdENoaWxkIiwiaW5zZXJ0QmVmb3JlIiwiYXBwZW5kQ2hpbGQiLCJzdHlsZVNoZWV0IiwiY3NzVGV4dCIsImNyZWF0ZVRleHROb2RlIiwiVkFMSUQiLCJJTlZBTElEIiwiSU5BQ1RJVkUiLCJFTUFJTF9GT1JNQVRfVkFMSURBVElPTiIsIlBBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OIiwiVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT04iLCJVU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTiIsIkVNUFRZX1NUUklOR19WQUxJREFUSU9OIiwiUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT04iLCJJTlZBTElEX0NSRURFTlRJQUxTIiwiVVNFUk5BTUVfVEFLRU4iLCJSRUdJU1RFUkVEX0VNQUlMIiwiRU1BSUxfTk9UX1JFR0lTVEVSRUQiLCJVU0VSTkFNRV9OT1RfUkVHSVNURVJFRCIsIklOVkFMSURfUEFTU1dPUkQiLCJJTlZBTElEX0VNQUlMIiwiSU5WQUxJRF9VU0VSTkFNRSIsIklOVkFMSURfRU1QVFlfU1RSSU5HIiwiSU5WQUxJRF9VU0VSTkFNRV9PUl9FTUFJTCIsIlBBU1NXT1JEU19ET19OT1RfTUFUQ0giLCJwYXNzd29yZFJlZ2V4IiwiZW1haWxSZWdleCIsInVzZXJuYW1lUmVnZXgiLCJ2YWxpZGF0ZUVtYWlsQ29uc3RyYWludCIsImVtYWlsIiwiZW1haWxDb25zdHJhaW50IiwiUmVnRXhwIiwidGVzdCIsInZhbGlkYXRpb25UeXBlIiwidmFsaWRhdGlvblR5cGVzIiwidmFsaWRhdGlvblN0YXRlIiwibWVzc2FnZSIsInZhbGlkYXRpb25NZXNzYWdlcyIsImlzQ2xpZW50VmFsaWRhdGlvblR5cGUiLCJ2YWxpZGF0ZVBhc3N3b3JkQ29uc3RyYWludCIsInBhc3N3b3JkIiwicGFzc3dvcmRDb25zdHJhaW50IiwidmFsaWRhdGVVc2VyTmFtZUNvbnN0cmFpbnQiLCJ1c2VybmFtZSIsInVzZXJuYW1lQ29uc3RyYWludCIsInZhbGlkYXRlRW1haWxPclVzZXJuYW1lIiwidmFsdWUiLCJ2YWxpZGF0ZUVtcHR5U3RyaW5nIiwibGVuZ3RoIiwidmFsaWRhdGVQYXNzd29yZE1hdGNoIiwic3RhdGUiLCJjb25maXJtIiwiYXV0aCIsIklOSVRfRk9STV9WQUxJREFUSU9OX1NUQVRFIiwiUkVTRVRfVkFMSURBVElPTl9TVEFURSIsIklOUFVUX0JMVVJSRUQiLCJJTlBVVF9GT0NVU0VEIiwiU0VSVkVSX1ZBTElEQVRJT04iLCJDTElFTlRfVkFMSURBVElPTiIsIklOQ19JTlBVVF9DT1VUTiIsImNyZWRlbnRpYWxJbnZhbGlkIiwidXNlcm5hbWVJc1Rha2VuIiwiZW1haWxJc1JlZ2lzdGVyZWQiLCJ1c2VybmFtZUludmFsaWQiLCJwYXNzd29yZEludmFsaWQiLCJlbWFpbEludmFsaWQiLCJlbWFpbElzTm90UmVnaXN0ZXJlZCIsImVtcHR5U3RyaW5nTm90VmFsaWQiLCJlbWFpbG9ydXNlcm5hbWVOb3RWYWxpZCIsInVzZXJuYW1lSXNOb3RSZWdpc3RlcmVkIiwicGFzc3dvcmREb05vdE1hdGNoIiwidG9rZW5FeHBpcmVkIiwic2VydmVyVmFsaWRhdGlvblJhbmdlIiwic3RhdHVzIiwiY2xpZW50VmFsaWRhdGlvbiIsInZhbGlkYXRpb24iLCJjb25zdFZhbFR5cGVzIiwidmFsaWRhdGlvbnMiLCJhY3Rpb25UeXBlcyIsInJlc2V0SW5wdXRWYWxpZGF0aW9uU3RhdGUiLCJzZXJ2ZXJWYWxpZGF0aW9uIiwiaHR0cFN0YXR1cyIsInZhbGlkYXRpb25TdGF0ZXMiLCJpbWciLCJJY29uU3RhdGUiLCJvcGVuIiwib3Blbkljb24iLCJjbG9zZUljb24iLCJFeWVJY29uIiwib25DbGljayIsInNldFN0YXRlIiwidXNlU3RhdGUiLCJ0b2dnbGUiLCJwcmV2IiwiZGlzcGxheSIsImFsaWduSXRlbXMiLCJqdXN0aWZ5Q29udGVudCIsIm1hcmdpbiIsImluaXRTdGF0ZSIsImZvcm1SZWR1Y2VyIiwiYWN0aW9uIiwibmV4dFN0YXRlIiwiZm9ybVN0YXRlIiwicHJvcE5hbWUiLCJjb3VudCIsIkZvcm1Db250ZXh0IiwiY3JlYXRlQ29udGV4dCIsInVzZUZvcm1Db250ZXh0IiwiY29udGV4dCIsInVzZUNvbnRleHQiLCJFcnJvciIsImRpc3BhdGNoIiwiRm9ybVByb3ZpZGVyIiwicHJvcHMiLCJ1c2VSZWR1Y2VyIiwidXNlTWVtbyIsIlZhbGlkaXR5SWNvbiIsInZhbGlkIiwic3RhdGVDb2xvciIsImZsZXgiLCJjb2xvciIsImxpbmVIZWlnaHQiLCJ3aWR0aCIsInRleHRBbGlnbiIsImlucHV0IiwiYm9yZGVyIiwicGFkZGluZyIsImJvcmRlclJhZGl1cyIsInJvb3QiLCJmbGV4RGlyZWN0aW9uIiwiYmFja2dyb3VuZENvbG9yIiwibWFyZ2luQm90dG9tIiwiaW5wdXRDb250YWluZXIiLCJwYWRkaW5nTGVmdCIsIklucHV0IiwicGxhY2Vob2xkZXIiLCJuYW1lIiwib25DaGFuZ2UiLCJpZCIsImlucHV0VmFsaWRhdGlvbiIsInNldElucHV0VmFsaWRhdGlvbiIsInVuZGVmaW5lZCIsImlucHV0VHlwZSIsInNldElucHV0VHlwZSIsImJvcmRlckNvbG9yIiwic2V0Qm9yZGVyQ29sb3IiLCJ1c2VFZmZlY3QiLCJoYW5kbGVGb2N1cyIsImZvckVhY2giLCJ2YWxpZGF0aW9uTmFtZSIsImZvcm0iLCJhY3Rpb25zIiwiaGFuZGxlQmx1ciIsInRvZ2dsZUV5ZSIsIm1hcCIsIkJ1dHRvbiIsInRpdGxlIiwiZGlzYWJsZWQiLCJoZWlnaHQiLCJGb3JtIiwiY2hpbGRyZW4iLCJmb3JtVGl0bGUiLCJlcnJvciIsIlZBTFVFX0NIQU5HRUQiLCJMT0dJTl9TVEFSVEVEIiwiTE9HSU5fU1VDQ0VTUyIsIkxPR0lOX0ZBSUxFRCIsIkxPR09VVF9TVEFSVEVEIiwiTE9HT1VUX0ZBSUxFRCIsIkxPR09VVF9TVUNDRVNTIiwiU0lHTlVQX1NUQVJURUQiLCJTSUdOVVBfU1VDQ0VTUyIsIlNJR05VUF9GQUlMRUQiLCJDSEFOR0VfUEFTU1dPUkRfU1RBUlRFRCIsIkNIQU5HRV9QQVNTV09SRF9TVUNDRVNTIiwiQ0hBTkdFX1BBU1NXT1JEX0ZBSUxFRCIsIlJFUVVFU1RfUEFTU19DSEFOR0VfU1RBUlRFRCIsIlJFUVVFU1RfUEFTU19DSEFOR0VfU1VDQ0VTUyIsIlJFUVVFU1RfUEFTU19DSEFOR0VfRkFJTEVEIiwiR09UX1RPS0VOX0ZST01fVVJMIiwidmFsdWVDaGFuZ2VkIiwicGF5bG9hZCIsImxvZ2luIiwiZW1haWxvcnVzZXJuYW1lIiwicmVzcG9uc2UiLCJmZXRjaCIsInByb2Nlc3MiLCJlbnYiLCJSRUFDVF9BUFBfWEFGX1NFUlZFUl9VUkwiLCJoZWFkZXJzIiwiQXV0aG9yaXphdGlvbiIsImJ0b2EiLCJtZXRob2QiLCJyZXN1bHQiLCJqc29uIiwidG9rZW4iLCJlcnJvcnMiLCJzaWdudXAiLCJib2R5IiwiSlNPTiIsInN0cmluZ2lmeSIsIkNvbnRlbnRUeXBlIiwiQWNjZXB0IiwiY2hhbmdlUGFzc3dvcmQiLCJjdXJyZW50IiwiZm9yZ290UGFzc3dvcmQiLCJlcnIiXSwibWFwcGluZ3MiOiI7O0FBQUEsU0FBU0EsV0FBVCxDQUFxQkMsR0FBckIsRUFBMEJDLEdBQTFCLEVBQStCO0FBQzdCLE1BQUtBLEdBQUcsS0FBSyxLQUFLLENBQWxCLEVBQXNCQSxHQUFHLEdBQUcsRUFBTjtBQUN0QixNQUFJQyxRQUFRLEdBQUdELEdBQUcsQ0FBQ0MsUUFBbkI7O0FBRUEsTUFBSSxDQUFDRixHQUFELElBQVEsT0FBT0csUUFBUCxLQUFvQixXQUFoQyxFQUE2QztBQUFFO0FBQVM7O0FBRXhELE1BQUlDLElBQUksR0FBR0QsUUFBUSxDQUFDQyxJQUFULElBQWlCRCxRQUFRLENBQUNFLG9CQUFULENBQThCLE1BQTlCLEVBQXNDLENBQXRDLENBQTVCO0FBQ0EsTUFBSUMsS0FBSyxHQUFHSCxRQUFRLENBQUNJLGFBQVQsQ0FBdUIsT0FBdkIsQ0FBWjtBQUNBRCxFQUFBQSxLQUFLLENBQUNFLElBQU4sR0FBYSxVQUFiOztBQUVBLE1BQUlOLFFBQVEsS0FBSyxLQUFqQixFQUF3QjtBQUN0QixRQUFJRSxJQUFJLENBQUNLLFVBQVQsRUFBcUI7QUFDbkJMLE1BQUFBLElBQUksQ0FBQ00sWUFBTCxDQUFrQkosS0FBbEIsRUFBeUJGLElBQUksQ0FBQ0ssVUFBOUI7QUFDRCxLQUZELE1BRU87QUFDTEwsTUFBQUEsSUFBSSxDQUFDTyxXQUFMLENBQWlCTCxLQUFqQjtBQUNEO0FBQ0YsR0FORCxNQU1PO0FBQ0xGLElBQUFBLElBQUksQ0FBQ08sV0FBTCxDQUFpQkwsS0FBakI7QUFDRDs7QUFFRCxNQUFJQSxLQUFLLENBQUNNLFVBQVYsRUFBc0I7QUFDcEJOLElBQUFBLEtBQUssQ0FBQ00sVUFBTixDQUFpQkMsT0FBakIsR0FBMkJiLEdBQTNCO0FBQ0QsR0FGRCxNQUVPO0FBQ0xNLElBQUFBLEtBQUssQ0FBQ0ssV0FBTixDQUFrQlIsUUFBUSxDQUFDVyxjQUFULENBQXdCZCxHQUF4QixDQUFsQjtBQUNEO0FBQ0Y7Ozs7O0FDekJELHVCQUFlO0FBQ2JlLEVBQUFBLEtBQUssRUFBRSxPQURNO0FBRWJDLEVBQUFBLE9BQU8sRUFBRSxTQUZJO0FBR2JDLEVBQUFBLFFBQVEsRUFBRTtBQUhHLENBQWY7O0FDQUEsc0JBQWU7QUFDYjtBQUNBQyxFQUFBQSx1QkFBdUIsRUFBRSx5QkFGWjtBQUdiQyxFQUFBQSwwQkFBMEIsRUFBRSw0QkFIZjtBQUliQyxFQUFBQSwwQkFBMEIsRUFBRSw0QkFKZjtBQUtiQyxFQUFBQSxtQ0FBbUMsRUFBRSxxQ0FMeEI7QUFNYkMsRUFBQUEsdUJBQXVCLEVBQUUseUJBTlo7QUFPYkMsRUFBQUEsMEJBQTBCLEVBQUUsNEJBUGY7QUFRYjtBQUNBQyxFQUFBQSxtQkFBbUIsRUFBRSxxQkFUUjtBQVViQyxFQUFBQSxjQUFjLEVBQUUsZ0JBVkg7QUFXYkMsRUFBQUEsZ0JBQWdCLEVBQUUsa0JBWEw7QUFZYkMsRUFBQUEsb0JBQW9CLEVBQUUsc0JBWlQ7QUFhYkMsRUFBQUEsdUJBQXVCLEVBQUM7QUFiWCxDQUFmOztBQ0FBLHlCQUFlO0FBQ2JDLEVBQUFBLGdCQUFnQixFQUNkLHFIQUZXO0FBR2JDLEVBQUFBLGFBQWEsRUFBRSwyQkFIRjtBQUliSCxFQUFBQSxvQkFBb0IsRUFBRSx5QkFKVDtBQUtiQyxFQUFBQSx1QkFBdUIsRUFBRSw0QkFMWjtBQU1iRyxFQUFBQSxnQkFBZ0IsRUFDZCw2REFQVztBQVFiQyxFQUFBQSxvQkFBb0IsRUFBRSw2QkFSVDtBQVNiQyxFQUFBQSx5QkFBeUIsRUFBRSxnQ0FUZDtBQVViVCxFQUFBQSxtQkFBbUIsRUFBRSw4QkFWUjtBQVdiQyxFQUFBQSxjQUFjLEVBQUUsMkJBWEg7QUFZYkMsRUFBQUEsZ0JBQWdCLEVBQUUsNkJBWkw7QUFhYlEsRUFBQUEsc0JBQXNCLEVBQUU7QUFiWCxDQUFmOztBQ0FPLE1BQU1DLGFBQWEsR0FBRyxzREFBdEI7QUFFQSxNQUFNQyxVQUFVLEdBQUcsd0lBQW5CO0FBRUEsTUFBTUMsYUFBYSxHQUFHLDBCQUF0Qjs7QUNBQSxTQUFTQyx1QkFBVCxDQUFpQztBQUFFQyxFQUFBQTtBQUFGLENBQWpDLEVBQTRDO0FBQ2pELFFBQU1DLGVBQWUsR0FBRyxJQUFJQyxNQUFKLENBQVdMLFVBQVgsQ0FBeEI7O0FBRUEsTUFBSUksZUFBZSxDQUFDRSxJQUFoQixDQUFxQkgsS0FBckIsQ0FBSixFQUFpQztBQUMvQixXQUFPO0FBQ0xJLE1BQUFBLGNBQWMsRUFBRUMsZUFBZSxDQUFDMUIsdUJBRDNCO0FBRUwyQixNQUFBQSxlQUFlLEVBQUVBLGdCQUFlLENBQUM5QixLQUY1QjtBQUdMK0IsTUFBQUEsT0FBTyxFQUFFO0FBSEosS0FBUDtBQUtELEdBTkQsTUFNTztBQUNMLFdBQU87QUFDTEgsTUFBQUEsY0FBYyxFQUFFQyxlQUFlLENBQUMxQix1QkFEM0I7QUFFTDJCLE1BQUFBLGVBQWUsRUFBRUEsZ0JBQWUsQ0FBQzdCLE9BRjVCO0FBR0w4QixNQUFBQSxPQUFPLEVBQUVDLGtCQUFrQixDQUFDakI7QUFIdkIsS0FBUDtBQUtEO0FBQ0Y7QUFFTSxTQUFTa0Isc0JBQVQsQ0FBZ0M7QUFBRUwsRUFBQUE7QUFBRixDQUFoQyxFQUFvRDtBQUN6RCxVQUFRQSxjQUFSO0FBQ0UsU0FBS0MsZUFBZSxDQUFDekIsMEJBQXJCO0FBQ0UsYUFBTyxJQUFQOztBQUNGLFNBQUt5QixlQUFlLENBQUMxQix1QkFBckI7QUFDRSxhQUFPLElBQVA7O0FBQ0YsU0FBSzBCLGVBQWUsQ0FBQ3ZCLG1DQUFyQjtBQUNFLGFBQU8sSUFBUDs7QUFDRixTQUFLdUIsZUFBZSxDQUFDdEIsdUJBQXJCO0FBQ0UsYUFBTyxJQUFQOztBQUNGLFNBQUtzQixlQUFlLENBQUNyQiwwQkFBckI7QUFDRSxhQUFPLElBQVA7O0FBQ0YsU0FBS3FCLGVBQWUsQ0FBQ3hCLDBCQUFyQjtBQUNFLGFBQU8sSUFBUDs7QUFDRjtBQUNFLGFBQU8sS0FBUDtBQWRKO0FBZ0JEO0FBQ00sU0FBUzZCLDBCQUFULENBQW9DO0FBQUVDLEVBQUFBO0FBQUYsQ0FBcEMsRUFBa0Q7QUFDdkQsUUFBTUMsa0JBQWtCLEdBQUcsSUFBSVYsTUFBSixDQUFXTixhQUFYLENBQTNCOztBQUNBLE1BQUlnQixrQkFBa0IsQ0FBQ1QsSUFBbkIsQ0FBd0JRLFFBQXhCLENBQUosRUFBdUM7QUFDckMsV0FBTztBQUNMUCxNQUFBQSxjQUFjLEVBQUVDLGVBQWUsQ0FBQ3pCLDBCQUQzQjtBQUVMMEIsTUFBQUEsZUFBZSxFQUFFQSxnQkFBZSxDQUFDOUIsS0FGNUI7QUFHTCtCLE1BQUFBLE9BQU8sRUFBRTtBQUhKLEtBQVA7QUFLRDs7QUFDRCxNQUFJLENBQUNLLGtCQUFrQixDQUFDVCxJQUFuQixDQUF3QlEsUUFBeEIsQ0FBTCxFQUF3QztBQUN0QyxXQUFPO0FBQ0xQLE1BQUFBLGNBQWMsRUFBRUMsZUFBZSxDQUFDekIsMEJBRDNCO0FBRUwwQixNQUFBQSxlQUFlLEVBQUVBLGdCQUFlLENBQUM3QixPQUY1QjtBQUdMOEIsTUFBQUEsT0FBTyxFQUFFQyxrQkFBa0IsQ0FBQ2xCO0FBSHZCLEtBQVA7QUFLRDtBQUNGO0FBRU0sU0FBU3VCLDBCQUFULENBQW9DO0FBQUVDLEVBQUFBO0FBQUYsQ0FBcEMsRUFBa0Q7QUFDdkQsUUFBTUMsa0JBQWtCLEdBQUcsSUFBSWIsTUFBSixDQUFXSixhQUFYLENBQTNCOztBQUVBLE1BQUlpQixrQkFBa0IsQ0FBQ1osSUFBbkIsQ0FBd0JXLFFBQXhCLENBQUosRUFBdUM7QUFDckMsV0FBTztBQUNMVixNQUFBQSxjQUFjLEVBQUVDLGVBQWUsQ0FBQ3hCLDBCQUQzQjtBQUVMeUIsTUFBQUEsZUFBZSxFQUFFQSxnQkFBZSxDQUFDOUIsS0FGNUI7QUFHTCtCLE1BQUFBLE9BQU8sRUFBRTtBQUhKLEtBQVA7QUFLRCxHQU5ELE1BTU87QUFDTCxXQUFPO0FBQ0xILE1BQUFBLGNBQWMsRUFBRUMsZUFBZSxDQUFDeEIsMEJBRDNCO0FBRUx5QixNQUFBQSxlQUFlLEVBQUVBLGdCQUFlLENBQUM3QixPQUY1QjtBQUdMOEIsTUFBQUEsT0FBTyxFQUFFQyxrQkFBa0IsQ0FBQ2hCO0FBSHZCLEtBQVA7QUFLRDtBQUNGO0FBRU0sU0FBU3dCLHVCQUFULENBQWlDO0FBQUVDLEVBQUFBO0FBQUYsQ0FBakMsRUFBNEM7QUFDakQsUUFBTWhCLGVBQWUsR0FBRyxJQUFJQyxNQUFKLENBQVdMLFVBQVgsQ0FBeEI7QUFDQSxRQUFNa0Isa0JBQWtCLEdBQUcsSUFBSWIsTUFBSixDQUFXSixhQUFYLENBQTNCOztBQUVBLE1BQUlHLGVBQWUsQ0FBQ0UsSUFBaEIsQ0FBcUJjLEtBQXJCLENBQUosRUFBaUM7QUFDL0IsV0FBTztBQUNMYixNQUFBQSxjQUFjLEVBQUVDLGVBQWUsQ0FBQ3ZCLG1DQUQzQjtBQUVMd0IsTUFBQUEsZUFBZSxFQUFFQSxnQkFBZSxDQUFDOUIsS0FGNUI7QUFHTCtCLE1BQUFBLE9BQU8sRUFBRTtBQUhKLEtBQVA7QUFLRCxHQU5ELE1BTU8sSUFBSVEsa0JBQWtCLENBQUNaLElBQW5CLENBQXdCYyxLQUF4QixDQUFKLEVBQW9DO0FBQ3pDLFdBQU87QUFDTGIsTUFBQUEsY0FBYyxFQUFFQyxlQUFlLENBQUN2QixtQ0FEM0I7QUFFTHdCLE1BQUFBLGVBQWUsRUFBRUEsZ0JBQWUsQ0FBQzlCLEtBRjVCO0FBR0wrQixNQUFBQSxPQUFPLEVBQUU7QUFISixLQUFQO0FBS0QsR0FOTSxNQU1BO0FBQ0wsV0FBTztBQUNMSCxNQUFBQSxjQUFjLEVBQUVDLGVBQWUsQ0FBQ3ZCLG1DQUQzQjtBQUVMd0IsTUFBQUEsZUFBZSxFQUFFQSxnQkFBZSxDQUFDN0IsT0FGNUI7QUFHTDhCLE1BQUFBLE9BQU8sRUFBRUMsa0JBQWtCLENBQUNkO0FBSHZCLEtBQVA7QUFLRDtBQUNGO0FBRU0sU0FBU3dCLG1CQUFULENBQTZCO0FBQUVELEVBQUFBO0FBQUYsQ0FBN0IsRUFBd0M7QUFDN0MsTUFBSUEsS0FBSyxDQUFDRSxNQUFOLEtBQWlCLENBQXJCLEVBQXdCO0FBQ3RCLFdBQU87QUFDTGYsTUFBQUEsY0FBYyxFQUFFQyxlQUFlLENBQUN0Qix1QkFEM0I7QUFFTHVCLE1BQUFBLGVBQWUsRUFBRUEsZ0JBQWUsQ0FBQzdCLE9BRjVCO0FBR0w4QixNQUFBQSxPQUFPLEVBQUVDLGtCQUFrQixDQUFDZjtBQUh2QixLQUFQO0FBS0QsR0FORCxNQU1PO0FBQ0wsV0FBTztBQUNMVyxNQUFBQSxjQUFjLEVBQUVDLGVBQWUsQ0FBQ3RCLHVCQUQzQjtBQUVMdUIsTUFBQUEsZUFBZSxFQUFFQSxnQkFBZSxDQUFDOUIsS0FGNUI7QUFHTCtCLE1BQUFBLE9BQU8sRUFBRTtBQUhKLEtBQVA7QUFLRDtBQUNGO0FBRU0sU0FBU2EscUJBQVQsQ0FBK0I7QUFBRUMsRUFBQUE7QUFBRixDQUEvQixFQUEwQztBQUMvQyxRQUFNO0FBQUVWLElBQUFBLFFBQUY7QUFBWVcsSUFBQUE7QUFBWixNQUF3QkQsS0FBSyxDQUFDRSxJQUFwQzs7QUFFQSxNQUFJWixRQUFRLEtBQUssRUFBYixJQUFtQkEsUUFBUSxLQUFLVyxPQUFwQyxFQUE2QztBQUMzQyxXQUFPO0FBQ0xoQixNQUFBQSxlQUFlLEVBQUVBLGdCQUFlLENBQUM3QixPQUQ1QjtBQUVMOEIsTUFBQUEsT0FBTyxFQUFFQyxrQkFBa0IsQ0FBQ2Isc0JBRnZCO0FBR0xTLE1BQUFBLGNBQWMsRUFBRUMsZUFBZSxDQUFDckI7QUFIM0IsS0FBUDtBQUtELEdBTkQsTUFNTztBQUNMLFdBQU87QUFDTHNCLE1BQUFBLGVBQWUsRUFBRUEsZ0JBQWUsQ0FBQzlCLEtBRDVCO0FBRUwrQixNQUFBQSxPQUFPLEVBQUUsRUFGSjtBQUdMSCxNQUFBQSxjQUFjLEVBQUVDLGVBQWUsQ0FBQ3JCO0FBSDNCLEtBQVA7QUFLRDtBQUNGOztBQ3JJRCxrQkFBZTtBQUNYd0MsRUFBQUEsMEJBQTBCLEVBQUUsNEJBRGpCO0FBRVhDLEVBQUFBLHNCQUFzQixFQUFFLHdCQUZiO0FBR1hDLEVBQUFBLGFBQWEsRUFBRSxlQUhKO0FBSVhDLEVBQUFBLGFBQWEsRUFBRSxlQUpKO0FBTVhDLEVBQUFBLGlCQUFpQixFQUFFLG1CQU5SO0FBT1hDLEVBQUFBLGlCQUFpQixFQUFDLG1CQVBQO0FBU1hDLEVBQUFBLGVBQWUsRUFBRTtBQVROLENBQWY7O0FDQUEsaUJBQWU7QUFDYjtBQUNBQyxFQUFBQSxpQkFBaUIsRUFBRSxLQUZOO0FBR2I7QUFDQUMsRUFBQUEsZUFBZSxFQUFFLEtBSko7QUFLYkMsRUFBQUEsaUJBQWlCLEVBQUUsS0FMTjtBQU1iQyxFQUFBQSxlQUFlLEVBQUUsS0FOSjtBQU9iQyxFQUFBQSxlQUFlLEVBQUUsS0FQSjtBQU9XO0FBQ3hCQyxFQUFBQSxZQUFZLEVBQUUsS0FSRDtBQVNiO0FBQ0FDLEVBQUFBLG9CQUFvQixFQUFFLEtBVlQ7QUFXYkMsRUFBQUEsbUJBQW1CLEVBQUUsS0FYUjtBQVliQyxFQUFBQSx1QkFBdUIsRUFBQyxLQVpYO0FBYWJDLEVBQUFBLHVCQUF1QixFQUFDLEtBYlg7QUFjZjtBQUNFQyxFQUFBQSxrQkFBa0IsRUFBQyxLQWZOO0FBZ0JiQyxFQUFBQSxZQUFZLEVBQUMsS0FoQkE7QUFpQmJDLEVBQUFBLHFCQUFxQixFQUFFQyxNQUFNLElBQUk7QUFDL0IsUUFBSUEsTUFBTSxJQUFJLEdBQVYsSUFBaUJBLE1BQU0sSUFBSSxHQUEvQixFQUFvQztBQUNsQyxhQUFPLElBQVA7QUFDRDs7QUFDRCxXQUFPLEtBQVA7QUFDRDtBQXRCWSxDQUFmOztBQ1NPLFNBQVNDLGdCQUFULENBQTBCO0FBQUV6QyxFQUFBQSxjQUFGO0FBQWtCYSxFQUFBQSxLQUFsQjtBQUF5QkksRUFBQUE7QUFBekIsQ0FBMUIsRUFBNEQ7QUFDakUsTUFBSXlCLFVBQVUsR0FBRyxJQUFqQjs7QUFDQSxVQUFRMUMsY0FBUjtBQUNFLFNBQUsyQyxlQUFhLENBQUNwRSx1QkFBbkI7QUFDRW1FLE1BQUFBLFVBQVUsR0FBR0UsdUJBQUEsQ0FBb0M7QUFDL0NoRCxRQUFBQSxLQUFLLEVBQUVpQjtBQUR3QyxPQUFwQyxDQUFiO0FBR0E7O0FBQ0YsU0FBSzhCLGVBQWEsQ0FBQ2pFLG1DQUFuQjtBQUNFZ0UsTUFBQUEsVUFBVSxHQUFHRSx1QkFBQSxDQUFvQztBQUMvQy9CLFFBQUFBO0FBRCtDLE9BQXBDLENBQWI7QUFHQTs7QUFDRixTQUFLOEIsZUFBYSxDQUFDbkUsMEJBQW5CO0FBQ0VrRSxNQUFBQSxVQUFVLEdBQUdFLDBCQUFBLENBQXVDO0FBQ2xEckMsUUFBQUEsUUFBUSxFQUFFTTtBQUR3QyxPQUF2QyxDQUFiO0FBR0E7O0FBQ0YsU0FBSzhCLGVBQWEsQ0FBQ2xFLDBCQUFuQjtBQUNFaUUsTUFBQUEsVUFBVSxHQUFHRSwwQkFBQSxDQUF1QztBQUNsRGxDLFFBQUFBLFFBQVEsRUFBRUc7QUFEd0MsT0FBdkMsQ0FBYjtBQUdBOztBQUNGLFNBQUs4QixlQUFhLENBQUNoRSx1QkFBbkI7QUFDRStELE1BQUFBLFVBQVUsR0FBR0UsbUJBQUEsQ0FBZ0M7QUFBRS9CLFFBQUFBO0FBQUYsT0FBaEMsQ0FBYjtBQUNBOztBQUNGLFNBQUs4QixlQUFhLENBQUMvRCwwQkFBbkI7QUFDRTtBQUNBOEQsTUFBQUEsVUFBVSxHQUFHRSxxQkFBQSxDQUFrQztBQUFFM0IsUUFBQUE7QUFBRixPQUFsQyxDQUFiO0FBQ0E7QUEzQko7O0FBZ0NBLFNBQU87QUFBRXBELElBQUFBLElBQUksRUFBRWdGLFdBQVcsQ0FBQ3BCLGlCQUFwQjtBQUF1QyxPQUFHaUI7QUFBMUMsR0FBUDtBQUNEO0FBTU0sU0FBU0kseUJBQVQsQ0FBbUM7QUFBRTlDLEVBQUFBO0FBQUYsQ0FBbkMsRUFBdUQ7QUFDNUQsU0FBTztBQUFFbkMsSUFBQUEsSUFBSSxFQUFFZ0YsV0FBVyxDQUFDeEIsc0JBQXBCO0FBQTRDckIsSUFBQUE7QUFBNUMsR0FBUDtBQUNEO0FBT00sU0FBUytDLGdCQUFULENBQTBCO0FBQUVQLEVBQUFBLE1BQU0sR0FBRztBQUFYLENBQTFCLEVBQTBDO0FBQy9DOztBQUNBLFVBQVFBLE1BQVI7QUFDRSxTQUFLUSxVQUFVLENBQUNyQixpQkFBaEI7QUFDRTtBQUNBLGFBQU87QUFDTDlELFFBQUFBLElBQUksRUFBRWdGLFdBQVcsQ0FBQ3JCLGlCQURiO0FBRUx4QixRQUFBQSxjQUFjLEVBQUVDLGVBQWUsQ0FBQ3BCLG1CQUYzQjtBQUdMc0IsUUFBQUEsT0FBTyxFQUFFQyxrQkFBa0IsQ0FBQ3ZCLG1CQUh2QjtBQUlMcUIsUUFBQUEsZUFBZSxFQUFFK0MsZ0JBQWdCLENBQUM1RTtBQUo3QixPQUFQOztBQU1GLFNBQUsyRSxVQUFVLENBQUNoQixZQUFoQjtBQUNFLGFBQU87QUFDTG5FLFFBQUFBLElBQUksRUFBRWdGLFdBQVcsQ0FBQ3JCLGlCQURiO0FBRUx4QixRQUFBQSxjQUFjLEVBQUVDLGVBQWUsQ0FBQzFCLHVCQUYzQjtBQUdMNEIsUUFBQUEsT0FBTyxFQUFFQyxrQkFBa0IsQ0FBQ2pCLGFBSHZCO0FBSUxlLFFBQUFBLGVBQWUsRUFBRStDLGdCQUFnQixDQUFDNUU7QUFKN0IsT0FBUDs7QUFNRixTQUFLMkUsVUFBVSxDQUFDakIsZUFBaEI7QUFDRSxhQUFPO0FBQ0xsRSxRQUFBQSxJQUFJLEVBQUVnRixXQUFXLENBQUNyQixpQkFEYjtBQUVMeEIsUUFBQUEsY0FBYyxFQUFFQyxlQUFlLENBQUN6QiwwQkFGM0I7QUFHTDJCLFFBQUFBLE9BQU8sRUFBRUMsa0JBQWtCLENBQUNsQixnQkFIdkI7QUFJTGdCLFFBQUFBLGVBQWUsRUFBRStDLGdCQUFnQixDQUFDNUU7QUFKN0IsT0FBUDs7QUFNRixTQUFLMkUsVUFBVSxDQUFDbEIsZUFBaEI7QUFDRSxhQUFPO0FBQ0xqRSxRQUFBQSxJQUFJLEVBQUVnRixXQUFXLENBQUNyQixpQkFEYjtBQUVMeEIsUUFBQUEsY0FBYyxFQUFFQyxlQUFlLENBQUN4QiwwQkFGM0I7QUFHTDBCLFFBQUFBLE9BQU8sRUFBRUMsa0JBQWtCLENBQUNoQixnQkFIdkI7QUFJTGMsUUFBQUEsZUFBZSxFQUFFK0MsZ0JBQWdCLENBQUM1RTtBQUo3QixPQUFQOztBQU1GLFNBQUsyRSxVQUFVLENBQUNuQixpQkFBaEI7QUFDRSxhQUFPO0FBQ0xoRSxRQUFBQSxJQUFJLEVBQUVnRixXQUFXLENBQUNyQixpQkFEYjtBQUVMeEIsUUFBQUEsY0FBYyxFQUFFQyxlQUFlLENBQUNsQixnQkFGM0I7QUFHTG9CLFFBQUFBLE9BQU8sRUFBRUMsa0JBQWtCLENBQUNyQixnQkFIdkI7QUFJTG1CLFFBQUFBLGVBQWUsRUFBRStDLGdCQUFnQixDQUFDNUU7QUFKN0IsT0FBUDs7QUFNRixTQUFLMkUsVUFBVSxDQUFDZixvQkFBaEI7QUFDRTtBQUNBLGFBQU87QUFDTHBFLFFBQUFBLElBQUksRUFBRWdGLFdBQVcsQ0FBQ3JCLGlCQURiO0FBRUx4QixRQUFBQSxjQUFjLEVBQUVDLGVBQWUsQ0FBQ2pCLG9CQUYzQjtBQUdMbUIsUUFBQUEsT0FBTyxFQUFFQyxrQkFBa0IsQ0FBQ3BCLG9CQUh2QjtBQUlMa0IsUUFBQUEsZUFBZSxFQUFFK0MsZ0JBQWdCLENBQUM1RTtBQUo3QixPQUFQOztBQU1GLFNBQUsyRSxVQUFVLENBQUNwQixlQUFoQjtBQUNFLGFBQU87QUFDTC9ELFFBQUFBLElBQUksRUFBRWdGLFdBQVcsQ0FBQ3JCLGlCQURiO0FBRUx4QixRQUFBQSxjQUFjLEVBQUVDLGVBQWUsQ0FBQ25CLGNBRjNCO0FBR0xxQixRQUFBQSxPQUFPLEVBQUVDLGtCQUFrQixDQUFDdEIsY0FIdkI7QUFJTG9CLFFBQUFBLGVBQWUsRUFBRStDLGdCQUFnQixDQUFDNUU7QUFKN0IsT0FBUDs7QUFNRixTQUFLMkUsVUFBVSxDQUFDZCxtQkFBaEI7QUFDRSxhQUFPO0FBQ0xyRSxRQUFBQSxJQUFJLEVBQUVnRixXQUFXLENBQUNyQixpQkFEYjtBQUVMeEIsUUFBQUEsY0FBYyxFQUFFQyxlQUFlLENBQUN0Qix1QkFGM0I7QUFHTHdCLFFBQUFBLE9BQU8sRUFBRUMsa0JBQWtCLENBQUNmLG9CQUh2QjtBQUlMYSxRQUFBQSxlQUFlLEVBQUUrQyxnQkFBZ0IsQ0FBQzVFO0FBSjdCLE9BQVA7O0FBTUYsU0FBSzJFLFVBQVUsQ0FBQ2IsdUJBQWhCO0FBQ0UsYUFBTztBQUNMdEUsUUFBQUEsSUFBSSxFQUFFZ0YsV0FBVyxDQUFDckIsaUJBRGI7QUFFTHhCLFFBQUFBLGNBQWMsRUFBRUMsZUFBZSxDQUFDdkIsbUNBRjNCO0FBR0x5QixRQUFBQSxPQUFPLEVBQUVDLGtCQUFrQixDQUFDZCx5QkFIdkI7QUFJTFksUUFBQUEsZUFBZSxFQUFFK0MsZ0JBQWdCLENBQUM1RTtBQUo3QixPQUFQOztBQU1GLFNBQUsyRSxVQUFVLENBQUNaLHVCQUFoQjtBQUNFLGFBQU87QUFDTHZFLFFBQUFBLElBQUksRUFBRWdGLFdBQVcsQ0FBQ3JCLGlCQURiO0FBRUx4QixRQUFBQSxjQUFjLEVBQUVDLGVBQWUsQ0FBQ2hCLHVCQUYzQjtBQUdMa0IsUUFBQUEsT0FBTyxFQUFFQyxrQkFBa0IsQ0FBQ25CLHVCQUh2QjtBQUlMaUIsUUFBQUEsZUFBZSxFQUFFK0MsZ0JBQWdCLENBQUM1RTtBQUo3QixPQUFQOztBQU1BLFNBQUsyRSxVQUFVLENBQUNYLGtCQUFoQjtBQUNBLGFBQU87QUFDTHhFLFFBQUFBLElBQUksRUFBRWdGLFdBQVcsQ0FBQ3JCLGlCQURiO0FBRUx4QixRQUFBQSxjQUFjLEVBQUVDLGVBQWUsQ0FBQ3JCLDBCQUYzQjtBQUdMdUIsUUFBQUEsT0FBTyxFQUFFQyxrQkFBa0IsQ0FBQ2Isc0JBSHZCO0FBSUxXLFFBQUFBLGVBQWUsRUFBRStDLGdCQUFnQixDQUFDNUU7QUFKN0IsT0FBUDs7QUFNRjtBQUNFLGFBQU8sSUFBUDtBQWpGSjtBQW1GRDs7QUNoSkQsTUFBTSxHQUFHLEdBQUcsd2hDQUF3aEM7O0FDQXBpQyxNQUFNNkUsS0FBRyxHQUFHLGczQ0FBZzNDOztBQ0k1M0MsU0FBU0MsU0FBVCxDQUFtQjtBQUFFQyxFQUFBQTtBQUFGLENBQW5CLEVBQTZCO0FBQzNCLE1BQUlBLElBQUosRUFBVTtBQUNSLFdBQU87QUFBSyxNQUFBLEtBQUssRUFBQyxNQUFYO0FBQWtCLE1BQUEsR0FBRyxFQUFFQztBQUF2QixNQUFQO0FBQ0Q7O0FBQ0QsU0FBTztBQUFLLElBQUEsS0FBSyxFQUFDLE1BQVg7QUFBa0IsSUFBQSxHQUFHLEVBQUVDO0FBQXZCLElBQVA7QUFDRDs7QUFFYyxTQUFTQyxPQUFULENBQWlCO0FBQUNDLEVBQUFBO0FBQUQsQ0FBakIsRUFBNEI7QUFDekMsUUFBTSxDQUFDdkMsS0FBRCxFQUFRd0MsUUFBUixJQUFvQkMsQ0FBUSxDQUFDLEtBQUQsQ0FBbEM7O0FBQ0EsV0FBU0MsTUFBVCxHQUFrQjtBQUNoQkgsSUFBQUEsT0FBTztBQUNQQyxJQUFBQSxRQUFRLENBQUNHLElBQUksSUFBSSxDQUFDQSxJQUFWLENBQVI7QUFDRDs7QUFFRCxTQUNFO0FBQ0UsSUFBQSxPQUFPLEVBQUVELE1BRFg7QUFFRSxJQUFBLEtBQUssRUFBRTtBQUNMRSxNQUFBQSxPQUFPLEVBQUUsTUFESjtBQUVMQyxNQUFBQSxVQUFVLEVBQUUsUUFGUDtBQUdMQyxNQUFBQSxjQUFjLEVBQUMsUUFIVjtBQUlMQyxNQUFBQSxNQUFNLEVBQUU7QUFKSDtBQUZULEtBU0UsRUFBQyxTQUFEO0FBQVcsSUFBQSxJQUFJLEVBQUUvQztBQUFqQixJQVRGLENBREY7QUFhRDs7QUM1Qk0sTUFBTWdELFNBQVMsR0FBRztBQUFFdkIsRUFBQUEsVUFBVSxFQUFFO0FBQWQsQ0FBbEI7QUFFQSxTQUFTd0IsV0FBVCxDQUFxQmpELEtBQXJCLEVBQTRCa0QsTUFBNUIsRUFBb0M7QUFDekMsTUFBSUMsU0FBUyxHQUFHLElBQWhCOztBQUNBLFVBQVFELE1BQU0sQ0FBQ3RHLElBQWY7QUFDRSxTQUFLZ0YsV0FBVyxDQUFDckIsaUJBQWpCO0FBQ0U0QyxNQUFBQSxTQUFTLEdBQUcsRUFDVixHQUFHbkQsS0FETztBQUVWeUIsUUFBQUEsVUFBVSxFQUFFLEVBQ1YsR0FBR3pCLEtBQUssQ0FBQ3lCLFVBREM7QUFFVixXQUFDeUIsTUFBTSxDQUFDbkUsY0FBUixHQUF5QjtBQUN2QkUsWUFBQUEsZUFBZSxFQUFFaUUsTUFBTSxDQUFDakUsZUFERDtBQUV2QkMsWUFBQUEsT0FBTyxFQUFFZ0UsTUFBTSxDQUFDaEU7QUFGTztBQUZmO0FBRkYsT0FBWjtBQVdBLGFBQU9pRSxTQUFQOztBQUNGLFNBQUt2QixXQUFXLENBQUNwQixpQkFBakI7QUFDRTJDLE1BQUFBLFNBQVMsR0FBRyxFQUNWLEdBQUduRCxLQURPO0FBRVZ5QixRQUFBQSxVQUFVLEVBQUUsRUFDVixHQUFHekIsS0FBSyxDQUFDeUIsVUFEQztBQUdWLFdBQUN5QixNQUFNLENBQUNuRSxjQUFSLEdBQXlCO0FBQ3ZCRSxZQUFBQSxlQUFlLEVBQUVpRSxNQUFNLENBQUNqRSxlQUREO0FBRXZCQyxZQUFBQSxPQUFPLEVBQUVnRSxNQUFNLENBQUNoRTtBQUZPO0FBSGY7QUFGRixPQUFaO0FBWUEsYUFBT2lFLFNBQVA7O0FBRUYsU0FBS3ZCLFdBQVcsQ0FBQ3hCLHNCQUFqQjtBQUNFLGFBQU8sRUFDTCxHQUFHSixLQURFO0FBRUx5QixRQUFBQSxVQUFVLEVBQUUsRUFDVixHQUFHekIsS0FBSyxDQUFDeUIsVUFEQztBQUVWLFdBQUN5QixNQUFNLENBQUNuRSxjQUFSLEdBQXlCO0FBQ3ZCRSxZQUFBQSxlQUFlLEVBQUVBLGdCQUFlLENBQUM1QixRQURWO0FBRXZCNkIsWUFBQUEsT0FBTyxFQUFFO0FBRmM7QUFGZjtBQUZQLE9BQVA7O0FBV0YsU0FBSzBDLFdBQVcsQ0FBQ3RCLGFBQWpCO0FBQ0UsYUFBTyxFQUNMLEdBQUdOLEtBREU7QUFFTHlCLFFBQUFBLFVBQVUsRUFBRSxFQUNWLEdBQUd6QixLQUFLLENBQUN5QixVQURDO0FBRVYyQixVQUFBQSxTQUFTLEVBQUVuRSxnQkFBZSxDQUFDNUIsUUFGakI7QUFHVixXQUFDNkYsTUFBTSxDQUFDRyxRQUFSLEdBQW1CO0FBQ2pCcEUsWUFBQUEsZUFBZSxFQUFFQSxnQkFBZSxDQUFDNUIsUUFEaEI7QUFFakI2QixZQUFBQSxPQUFPLEVBQUU7QUFGUTtBQUhUO0FBRlAsT0FBUDs7QUFXRixTQUFLMEMsV0FBVyxDQUFDekIsMEJBQWpCO0FBQ0UsYUFBTyxFQUNMLEdBQUdILEtBREU7QUFFTHlCLFFBQUFBLFVBQVUsRUFBRSxFQUNWLEdBQUd6QixLQUFLLENBQUN5QixVQURDO0FBRVYyQixVQUFBQSxTQUFTLEVBQUVuRSxnQkFBZSxDQUFDNUI7QUFGakI7QUFGUCxPQUFQOztBQU9GLFNBQUt1RSxXQUFXLENBQUNuQixlQUFqQjtBQUNFLGFBQU8sRUFBRSxHQUFHVCxLQUFMO0FBQVlzRCxRQUFBQSxLQUFLLEVBQUV0RCxLQUFLLENBQUNzRCxLQUFOLEdBQWM7QUFBakMsT0FBUDs7QUFDRjtBQUNFLGFBQU90RCxLQUFQO0FBaEVKO0FBa0VEOztBQ3RFRCxNQUFNdUQsV0FBVyxHQUFHQyxDQUFhLEVBQWpDO0FBRU8sU0FBU0MsY0FBVCxHQUEwQjtBQUMvQixRQUFNQyxPQUFPLEdBQUdDLENBQVUsQ0FBQ0osV0FBRCxDQUExQjs7QUFDQSxNQUFJLENBQUNHLE9BQUwsRUFBYztBQUNaLFVBQU0sSUFBSUUsS0FBSixDQUFVLDhDQUFWLENBQU47QUFDRDs7QUFDRCxRQUFNLENBQUM1RCxLQUFELEVBQVE2RCxRQUFSLElBQW9CSCxPQUExQjtBQUVBLFNBQU87QUFBRTFELElBQUFBLEtBQUY7QUFBUzZELElBQUFBO0FBQVQsR0FBUDtBQUNEO0FBRU0sU0FBU0MsWUFBVCxDQUFzQkMsS0FBdEIsRUFBNkI7QUFDbEMsUUFBTSxDQUFDL0QsS0FBRCxFQUFRNkQsUUFBUixJQUFvQkcsQ0FBVSxDQUFDZixXQUFELEVBQWNELFNBQWQsQ0FBcEM7QUFDQSxRQUFNcEQsS0FBSyxHQUFHcUUsQ0FBTyxDQUFDLE1BQU0sQ0FBQ2pFLEtBQUQsRUFBUTZELFFBQVIsQ0FBUCxFQUEwQixDQUFDN0QsS0FBRCxDQUExQixDQUFyQjtBQUNBLFNBQU8sRUFBQyxXQUFELENBQWEsUUFBYjtBQUFzQixJQUFBLEtBQUssRUFBRUo7QUFBN0IsS0FBd0NtRSxLQUF4QyxFQUFQO0FBQ0Q7O0FDWkQsU0FBU0csWUFBVCxDQUFzQjtBQUFFQyxFQUFBQTtBQUFGLENBQXRCLEVBQWlDO0FBQy9CLE1BQUlDLFVBQVUsR0FBRyxTQUFqQjs7QUFDQSxVQUFRRCxLQUFSO0FBQ0UsU0FBS25DLGdCQUFnQixDQUFDN0UsS0FBdEI7QUFDRWlILE1BQUFBLFVBQVUsR0FBRyxPQUFiO0FBQ0E7O0FBQ0YsU0FBS3BDLGdCQUFnQixDQUFDNUUsT0FBdEI7QUFDRWdILE1BQUFBLFVBQVUsR0FBRyxLQUFiO0FBQ0E7O0FBQ0YsU0FBS3BDLGdCQUFnQixDQUFDM0UsUUFBdEI7QUFDRStHLE1BQUFBLFVBQVUsR0FBRyxTQUFiO0FBQ0E7O0FBQ0Y7QUFDRUEsTUFBQUEsVUFBVSxHQUFHLFNBQWI7QUFYSjs7QUFjQSxTQUNFO0FBQ0UsSUFBQSxLQUFLLEVBQUU7QUFDTEMsTUFBQUEsSUFBSSxFQUFFLENBREQ7QUFFTEMsTUFBQUEsS0FBSyxFQUFFRixVQUZGO0FBR0xHLE1BQUFBLFVBQVUsRUFBRSxDQUhQO0FBSUxDLE1BQUFBLEtBQUssRUFBRSxFQUpGO0FBS0xDLE1BQUFBLFNBQVMsRUFBRTtBQUxOO0FBRFQsS0FTR04sS0FBSyxHQUFHLEdBQUgsR0FBUyxHQVRqQixDQURGO0FBYUQ7O0FBRUQsTUFBTXpILEtBQUssR0FBRztBQUNaZ0ksRUFBQUEsS0FBSyxFQUFFO0FBQ0wzQixJQUFBQSxNQUFNLEVBQUUsQ0FESDtBQUVMNEIsSUFBQUEsTUFBTSxFQUFFLFdBRkg7QUFHTEMsSUFBQUEsT0FBTyxFQUFFLENBSEo7QUFJTFAsSUFBQUEsSUFBSSxFQUFFLEVBSkQ7QUFLTFEsSUFBQUEsWUFBWSxFQUFFO0FBTFQsR0FESztBQVFaQyxFQUFBQSxJQUFJLEVBQUU7QUFDSkQsSUFBQUEsWUFBWSxFQUFFLENBRFY7QUFFSjlCLElBQUFBLE1BQU0sRUFBRSxDQUZKO0FBR0pILElBQUFBLE9BQU8sRUFBRSxNQUhMO0FBSUptQyxJQUFBQSxhQUFhLEVBQUUsUUFKWDtBQUtKQyxJQUFBQSxlQUFlLEVBQUUsT0FMYjtBQU1KTCxJQUFBQSxNQUFNLEVBQUUsaUJBTko7QUFPSk0sSUFBQUEsWUFBWSxFQUFFO0FBUFYsR0FSTTtBQWlCWkMsRUFBQUEsY0FBYyxFQUFFO0FBQ2R0QyxJQUFBQSxPQUFPLEVBQUUsTUFESztBQUVkeUIsSUFBQUEsSUFBSSxFQUFFO0FBRlEsR0FqQko7QUFxQlpuRixFQUFBQSxPQUFPLEVBQUU7QUFDUG9GLElBQUFBLEtBQUssRUFBRSxLQURBO0FBRVBhLElBQUFBLFdBQVcsRUFBRTtBQUZOO0FBckJHLENBQWQ7QUEwQmUsU0FBU0MsS0FBVCxDQUFlO0FBQzVCQyxFQUFBQSxXQUQ0QjtBQUU1QnpJLEVBQUFBLElBRjRCO0FBRzVCMEksRUFBQUEsSUFINEI7QUFJNUJDLEVBQUFBLFFBSjRCO0FBSzVCM0YsRUFBQUEsS0FBSyxHQUFHLEVBTG9CO0FBTTVCWixFQUFBQSxlQUFlLEdBQUcsRUFOVTtBQU81QndHLEVBQUFBO0FBUDRCLENBQWYsRUFRWjtBQUNELFFBQU07QUFBRXhGLElBQUFBLEtBQUY7QUFBUzZELElBQUFBO0FBQVQsTUFBc0JKLGNBQWMsRUFBMUM7QUFFQSxRQUFNLENBQUNnQyxlQUFELEVBQWtCQyxrQkFBbEIsSUFBd0NqRCxDQUFRLENBQUM7QUFDckR4RCxJQUFBQSxlQUFlLEVBQUUrQyxnQkFBZ0IsQ0FBQzNFLFFBRG1CO0FBRXJENkIsSUFBQUEsT0FBTyxFQUFFLEVBRjRDO0FBR3JESCxJQUFBQSxjQUFjLEVBQUU0RztBQUhxQyxHQUFELENBQXREO0FBTUEsUUFBTSxDQUFDQyxTQUFELEVBQVlDLFlBQVosSUFBNEJwRCxDQUFRLENBQUM3RixJQUFELENBQTFDO0FBRUEsUUFBTSxDQUFDa0osV0FBRCxFQUFjQyxjQUFkLElBQWdDdEQsQ0FBUSxDQUFDLEVBQUQsQ0FBOUM7QUFFQXVELEVBQUFBLENBQVMsQ0FBQyxNQUFNO0FBQ2QsUUFDRVAsZUFBZSxJQUNmQSxlQUFlLENBQUN4RyxlQUFoQixLQUFvQytDLGdCQUFnQixDQUFDN0UsS0FGdkQsRUFHRTtBQUNBNEksTUFBQUEsY0FBYyxDQUFDLE9BQUQsQ0FBZDtBQUNEOztBQUNELFFBQ0VOLGVBQWUsSUFDZkEsZUFBZSxDQUFDeEcsZUFBaEIsS0FBb0MrQyxnQkFBZ0IsQ0FBQzVFLE9BRnZELEVBR0U7QUFDQTJJLE1BQUFBLGNBQWMsQ0FBQyxLQUFELENBQWQ7QUFDRDs7QUFDRCxRQUNFTixlQUFlLElBQ2ZBLGVBQWUsQ0FBQ3hHLGVBQWhCLEtBQW9DK0MsZ0JBQWdCLENBQUMzRSxRQUZ2RCxFQUdFO0FBQ0EwSSxNQUFBQSxjQUFjLENBQUMsU0FBRCxDQUFkO0FBQ0Q7QUFDRixHQW5CUSxFQW1CTixDQUFDTixlQUFELENBbkJNLENBQVQ7O0FBb0JBLFdBQVNRLFdBQVQsR0FBdUI7QUFDckJqSCxJQUFBQSxlQUFlLENBQUNrSCxPQUFoQixDQUF5QkMsY0FBRCxJQUFvQjtBQUMxQyxVQUFJbkcsS0FBSyxDQUFDb0csSUFBTixDQUFXM0UsVUFBWCxDQUFzQjBFLGNBQXRCLENBQUosRUFBMkM7QUFDekN0QyxRQUFBQSxRQUFRLENBQ053Qyx5QkFBQSxDQUFrQztBQUFFdEgsVUFBQUEsY0FBYyxFQUFFb0g7QUFBbEIsU0FBbEMsQ0FETSxDQUFSO0FBR0Q7QUFDRixLQU5EO0FBT0Q7O0FBQ0QsV0FBU0csVUFBVCxHQUFzQjtBQUNwQnRILElBQUFBLGVBQWUsQ0FBQ2tILE9BQWhCLENBQXlCQyxjQUFELElBQW9CO0FBQzFDLFVBQUkvRyxzQkFBc0IsQ0FBQztBQUFFTCxRQUFBQSxjQUFjLEVBQUVvSDtBQUFsQixPQUFELENBQTFCLEVBQWdFO0FBQzlEdEMsUUFBQUEsUUFBUSxDQUNOd0MsZ0JBQUEsQ0FBeUI7QUFDdkJ0SCxVQUFBQSxjQUFjLEVBQUVvSCxjQURPO0FBRXZCdkcsVUFBQUEsS0FGdUI7QUFHdkJJLFVBQUFBO0FBSHVCLFNBQXpCLENBRE0sQ0FBUjtBQU9EO0FBQ0YsS0FWRDtBQVdEOztBQUVELFdBQVN1RyxTQUFULEdBQXFCO0FBQ25CLFFBQUlYLFNBQVMsS0FBSyxVQUFsQixFQUE4QjtBQUM1QkMsTUFBQUEsWUFBWSxDQUFDLE1BQUQsQ0FBWjtBQUNELEtBRkQsTUFFTztBQUNMQSxNQUFBQSxZQUFZLENBQUMsVUFBRCxDQUFaO0FBQ0Q7QUFDRjs7QUFDRCxTQUNFO0FBQUssSUFBQSxLQUFLLEVBQUVuSixLQUFLLENBQUNvSTtBQUFsQixLQUNFO0FBQUssSUFBQSxLQUFLLEVBQUVwSSxLQUFLLENBQUN3STtBQUFsQixLQUNFO0FBQ0UsSUFBQSxLQUFLLEVBQUUsRUFBRSxHQUFHeEksS0FBSyxDQUFDZ0ksS0FBWDtBQUFrQm9CLE1BQUFBO0FBQWxCLEtBRFQ7QUFFRSxJQUFBLElBQUksRUFBRUYsU0FGUjtBQUdFLElBQUEsSUFBSSxFQUFFTixJQUhSO0FBSUUsSUFBQSxRQUFRLEVBQUVDLFFBSlo7QUFLRSxJQUFBLEtBQUssRUFBRTNGLEtBTFQ7QUFNRSxJQUFBLE1BQU0sRUFBRTBHLFVBTlY7QUFPRSxJQUFBLFdBQVcsRUFBRWpCLFdBUGY7QUFRRSxJQUFBLE9BQU8sRUFBRVksV0FSWDtBQVNFLG1CQUFhVDtBQVRmLElBREYsRUFZR3hHLGVBQWUsQ0FBQ3dILEdBQWhCLENBQXFCTCxjQUFELElBQW9CO0FBQ3ZDLFFBQUluRyxLQUFLLENBQUN5QixVQUFOLENBQWlCMEUsY0FBakIsQ0FBSixFQUFzQztBQUNwQyxZQUFNO0FBQUVsSCxRQUFBQTtBQUFGLFVBQXNCZSxLQUFLLENBQUN5QixVQUFOLENBQWlCMEUsY0FBakIsQ0FBNUI7O0FBQ0EsVUFDRWxILGVBQWUsS0FBSytDLGdCQUFnQixDQUFDN0UsS0FBckMsSUFDQThCLGVBQWUsS0FBSytDLGdCQUFnQixDQUFDNUUsT0FGdkMsRUFHRTtBQUNBLGVBQ0UsRUFBQyxZQUFEO0FBQWMsVUFBQSxHQUFHLEVBQUUrSSxjQUFuQjtBQUFtQyxVQUFBLEtBQUssRUFBRWxIO0FBQTFDLFVBREY7QUFHRDs7QUFDRCxhQUFPLElBQVA7QUFDRDtBQUNGLEdBYkEsQ0FaSCxFQTBCR3JDLElBQUksS0FBSyxVQUFULElBQXVCLEVBQUMsT0FBRDtBQUFTLElBQUEsT0FBTyxFQUFFMko7QUFBbEIsSUExQjFCLENBREYsRUE2Qkd2SCxlQUFlLENBQUN3SCxHQUFoQixDQUFxQkwsY0FBRCxJQUFvQjtBQUN2QyxRQUFJbkcsS0FBSyxDQUFDeUIsVUFBTixDQUFpQjBFLGNBQWpCLENBQUosRUFBc0M7QUFDcEMsWUFBTTtBQUFFakgsUUFBQUE7QUFBRixVQUFjYyxLQUFLLENBQUN5QixVQUFOLENBQWlCMEUsY0FBakIsQ0FBcEI7QUFDQSxhQUNFO0FBQUssUUFBQSxHQUFHLEVBQUVBLGNBQVY7QUFBMEIsUUFBQSxLQUFLLEVBQUV6SixLQUFLLENBQUN3QztBQUF2QyxTQUNHQSxPQUFPLEtBQUssRUFBWixJQUNDO0FBQ0UsUUFBQSxJQUFJLEVBQUMsU0FEUDtBQUVFLHVCQUFjLFdBQVVvRyxJQUFLO0FBRi9CLFNBR0csS0FBSXBHLE9BQVEsRUFIZixDQUZKLENBREY7QUFVRDtBQUNGLEdBZEEsQ0E3QkgsQ0FERjtBQStDRDs7QUNwTGMsU0FBU3VILE1BQVQsQ0FBZ0I7QUFBRWxFLEVBQUFBLE9BQUY7QUFBV21FLEVBQUFBLEtBQVg7QUFBa0JDLEVBQUFBLFFBQWxCO0FBQTRCbkIsRUFBQUE7QUFBNUIsQ0FBaEIsRUFBa0Q7QUFDL0QsU0FDRTtBQUNFLG1CQUFhQSxFQURmO0FBRUUsSUFBQSxRQUFRLEVBQUVtQixRQUZaO0FBR0UsSUFBQSxLQUFLLEVBQUU7QUFBRTlCLE1BQUFBLFlBQVksRUFBRSxDQUFoQjtBQUFtQitCLE1BQUFBLE1BQU0sRUFBRTtBQUEzQixLQUhUO0FBSUUsSUFBQSxPQUFPLEVBQUVyRTtBQUpYLEtBTUdtRSxLQU5ILENBREY7QUFVRDs7QUNURCxNQUFNaEssT0FBSyxHQUFHO0FBQ1prRyxFQUFBQSxPQUFPLEVBQUUsTUFERztBQUVabUMsRUFBQUEsYUFBYSxFQUFFLFFBRkg7QUFHWlAsRUFBQUEsS0FBSyxFQUFFO0FBSEssQ0FBZDtBQU1lLFNBQVNxQyxJQUFULENBQWM7QUFBRUMsRUFBQUEsUUFBRjtBQUFZQyxFQUFBQSxTQUFaO0FBQXVCQyxFQUFBQTtBQUF2QixDQUFkLEVBQThDO0FBQzNELFNBQ0UsRUFBQyxZQUFELFFBQ0U7QUFBVSxJQUFBLEtBQUssRUFBRXRLO0FBQWpCLEtBQ0Usa0JBQVNxSyxTQUFULE1BREYsRUFFR0QsUUFGSCxFQUdHRSxLQUFLLElBQ0o7QUFDRSxJQUFBLEtBQUssRUFBRTtBQUNMMUMsTUFBQUEsS0FBSyxFQUFFLEtBREY7QUFFTFUsTUFBQUEsZUFBZSxFQUFFLE9BRlo7QUFHTEosTUFBQUEsT0FBTyxFQUFFLENBSEo7QUFJTEMsTUFBQUEsWUFBWSxFQUFFO0FBSlQ7QUFEVCxXQVFLbUMsS0FBSyxDQUFDOUgsT0FSWCxDQUpKLENBREYsQ0FERjtBQW9CRDs7QUMvQkQsb0JBQWU7QUFDYitILEVBQUFBLGFBQWEsRUFBRSxlQURGO0FBRWJDLEVBQUFBLGFBQWEsRUFBRSxlQUZGO0FBR2JDLEVBQUFBLGFBQWEsRUFBRSxlQUhGO0FBSWJDLEVBQUFBLFlBQVksRUFBRSxjQUpEO0FBTWJDLEVBQUFBLGNBQWMsRUFBRSxnQkFOSDtBQU9iQyxFQUFBQSxhQUFhLEVBQUUsZUFQRjtBQVFiQyxFQUFBQSxjQUFjLEVBQUUsZ0JBUkg7QUFVYkMsRUFBQUEsY0FBYyxFQUFFLGdCQVZIO0FBV2JDLEVBQUFBLGNBQWMsRUFBRSxnQkFYSDtBQVliQyxFQUFBQSxhQUFhLEVBQUUsZUFaRjtBQWNiQyxFQUFBQSx1QkFBdUIsRUFBRSx5QkFkWjtBQWViQyxFQUFBQSx1QkFBdUIsRUFBRSx5QkFmWjtBQWdCYkMsRUFBQUEsc0JBQXNCLEVBQUUsd0JBaEJYO0FBa0JiQyxFQUFBQSwyQkFBMkIsRUFBRSw2QkFsQmhCO0FBbUJiQyxFQUFBQSwyQkFBMkIsRUFBRSw2QkFuQmhCO0FBb0JiQyxFQUFBQSwwQkFBMEIsRUFBRSw0QkFwQmY7QUFxQmJDLEVBQUFBLGtCQUFrQixFQUFFO0FBckJQLENBQWY7O0FDR08sU0FBU0MsWUFBVCxDQUFzQjtBQUFFN0UsRUFBQUEsUUFBRjtBQUFZekQsRUFBQUE7QUFBWixDQUF0QixFQUEyQztBQUNoRCxTQUFPO0FBQ0xoRCxJQUFBQSxJQUFJLEVBQUVnRixhQUFXLENBQUNxRixhQURiO0FBRUxrQixJQUFBQSxPQUFPLEVBQUU7QUFDUDlFLE1BQUFBLFFBRE87QUFFUHpELE1BQUFBO0FBRk87QUFGSixHQUFQO0FBT0Q7QUFFTSxlQUFld0ksS0FBZixDQUFxQjtBQUFFdkUsRUFBQUEsUUFBRjtBQUFZN0QsRUFBQUE7QUFBWixDQUFyQixFQUEwQztBQUMvQyxNQUFJO0FBQ0YsVUFBTTtBQUFFcUksTUFBQUEsZUFBRjtBQUFtQi9JLE1BQUFBO0FBQW5CLFFBQWdDVSxLQUF0QztBQUNBNkQsSUFBQUEsUUFBUSxDQUFDO0FBQUVqSCxNQUFBQSxJQUFJLEVBQUVnRixhQUFXLENBQUNzRjtBQUFwQixLQUFELENBQVI7QUFDQSxVQUFNb0IsUUFBUSxHQUFHLE1BQU1DLEtBQUssQ0FDekIsR0FBRUMsT0FBTyxDQUFDQyxHQUFSLENBQVlDLHdCQUF5QixhQURkLEVBRTFCO0FBQ0VDLE1BQUFBLE9BQU8sRUFBRTtBQUNQLHVCQUFlLGtCQURSO0FBRVAsd0NBQWdDLEdBRnpCO0FBR1BDLFFBQUFBLGFBQWEsRUFBRSxXQUFXQyxJQUFJLENBQUUsR0FBRVIsZUFBZ0IsSUFBRy9JLFFBQVMsRUFBaEM7QUFIdkIsT0FEWDtBQU1Fd0osTUFBQUEsTUFBTSxFQUFFO0FBTlYsS0FGMEIsQ0FBNUI7QUFXQSxVQUFNQyxNQUFNLEdBQUcsTUFBTVQsUUFBUSxDQUFDVSxJQUFULEVBQXJCOztBQUNBLFFBQUlWLFFBQVEsQ0FBQy9HLE1BQVQsS0FBb0IsR0FBeEIsRUFBNkI7QUFDM0JzQyxNQUFBQSxRQUFRLENBQUM7QUFBRWpILFFBQUFBLElBQUksRUFBRWdGLGFBQVcsQ0FBQ3VGLGFBQXBCO0FBQW1DOEIsUUFBQUEsS0FBSyxFQUFFRixNQUFNLENBQUNFO0FBQWpELE9BQUQsQ0FBUjtBQUNELEtBRkQsTUFFTyxJQUFJWCxRQUFRLENBQUMvRyxNQUFULEtBQW9CLEdBQXhCLEVBQTZCO0FBQ2xDLFlBQU07QUFBRTJILFFBQUFBO0FBQUYsVUFBYUgsTUFBbkI7QUFFQUcsTUFBQUEsTUFBTSxDQUFDaEQsT0FBUCxDQUFnQmMsS0FBRCxJQUFXO0FBQ3hCbkQsUUFBQUEsUUFBUSxDQUNOL0IsZ0JBQWdCLENBQUM7QUFDZlAsVUFBQUEsTUFBTSxFQUFFeUY7QUFETyxTQUFELENBRFYsQ0FBUjtBQUtELE9BTkQ7QUFPRCxLQVZNLE1BVUE7QUFDTCxZQUFNLElBQUlwRCxLQUFKLENBQVUsY0FBVixDQUFOO0FBQ0Q7QUFDRixHQTlCRCxDQThCRSxPQUFPb0QsS0FBUCxFQUFjO0FBQ2RuRCxJQUFBQSxRQUFRLENBQUM7QUFBRWpILE1BQUFBLElBQUksRUFBRWdGLGFBQVcsQ0FBQ3dGLFlBQXBCO0FBQWtDZSxNQUFBQSxPQUFPLEVBQUU7QUFBRW5CLFFBQUFBO0FBQUY7QUFBM0MsS0FBRCxDQUFSO0FBQ0Q7QUFDRjtBQUVNLGVBQWVtQyxNQUFmLENBQXNCO0FBQUV0RixFQUFBQSxRQUFGO0FBQVk3RCxFQUFBQTtBQUFaLENBQXRCLEVBQTJDO0FBQ2hENkQsRUFBQUEsUUFBUSxDQUFDO0FBQUVqSCxJQUFBQSxJQUFJLEVBQUVnRixhQUFXLENBQUM0RjtBQUFwQixHQUFELENBQVI7QUFDQSxRQUFNO0FBQUU3SSxJQUFBQSxLQUFGO0FBQVNXLElBQUFBLFFBQVQ7QUFBbUJHLElBQUFBO0FBQW5CLE1BQWdDTyxLQUF0Qzs7QUFDQSxNQUFJO0FBQ0YsVUFBTXNJLFFBQVEsR0FBRyxNQUFNQyxLQUFLLENBQ3pCLEdBQUVDLE9BQU8sQ0FBQ0MsR0FBUixDQUFZQyx3QkFBeUIsY0FEZCxFQUUxQjtBQUNFVSxNQUFBQSxJQUFJLEVBQUVDLElBQUksQ0FBQ0MsU0FBTCxDQUFlO0FBQUVoSyxRQUFBQSxRQUFGO0FBQVlYLFFBQUFBLEtBQVo7QUFBbUJjLFFBQUFBO0FBQW5CLE9BQWYsQ0FEUjtBQUVFa0osTUFBQUEsT0FBTyxFQUFFO0FBQ1BZLFFBQUFBLFdBQVcsRUFBRSxrQkFETjtBQUVQQyxRQUFBQSxNQUFNLEVBQUU7QUFGRCxPQUZYO0FBTUVWLE1BQUFBLE1BQU0sRUFBRTtBQU5WLEtBRjBCLENBQTVCO0FBV0EsVUFBTUMsTUFBTSxHQUFHLE1BQU1ULFFBQVEsQ0FBQ1UsSUFBVCxFQUFyQjs7QUFDQSxRQUFJVixRQUFRLENBQUMvRyxNQUFULEtBQW9CLEdBQXhCLEVBQTZCO0FBQzNCc0MsTUFBQUEsUUFBUSxDQUFDO0FBQUVqSCxRQUFBQSxJQUFJLEVBQUVnRixhQUFXLENBQUM2RixjQUFwQjtBQUFvQ3dCLFFBQUFBLEtBQUssRUFBRUYsTUFBTSxDQUFDRTtBQUFsRCxPQUFELENBQVI7QUFDRCxLQUZELE1BRU8sSUFBSVgsUUFBUSxDQUFDL0csTUFBVCxLQUFvQixHQUF4QixFQUE2QjtBQUNsQyxZQUFNO0FBQUUySCxRQUFBQTtBQUFGLFVBQWFILE1BQW5CO0FBQ0FHLE1BQUFBLE1BQU0sQ0FBQ2hELE9BQVAsQ0FBZ0JjLEtBQUQsSUFBVztBQUN4Qm5ELFFBQUFBLFFBQVEsQ0FDTi9CLGdCQUFnQixDQUFDO0FBQ2ZQLFVBQUFBLE1BQU0sRUFBRXlGO0FBRE8sU0FBRCxDQURWLENBQVI7QUFLRCxPQU5EO0FBT0QsS0FUTSxNQVNBO0FBQ0wsWUFBTSxJQUFJcEQsS0FBSixDQUFVLGVBQVYsQ0FBTjtBQUNEO0FBQ0YsR0EzQkQsQ0EyQkUsT0FBT29ELEtBQVAsRUFBYztBQUNkbkQsSUFBQUEsUUFBUSxDQUFDO0FBQUVqSCxNQUFBQSxJQUFJLEVBQUVnRixhQUFXLENBQUM4RixhQUFwQjtBQUFtQ1MsTUFBQUEsT0FBTyxFQUFFO0FBQUVuQixRQUFBQTtBQUFGO0FBQTVDLEtBQUQsQ0FBUjtBQUNEO0FBQ0Y7QUFhTSxlQUFleUMsY0FBZixDQUE4QjtBQUFFNUYsRUFBQUEsUUFBRjtBQUFZN0QsRUFBQUE7QUFBWixDQUE5QixFQUFtRDtBQUN4RDZELEVBQUFBLFFBQVEsQ0FBQztBQUFFakgsSUFBQUEsSUFBSSxFQUFFZ0YsYUFBVyxDQUFDK0Y7QUFBcEIsR0FBRCxDQUFSOztBQUNBLE1BQUk7QUFDRixVQUFNO0FBQUUxSCxNQUFBQSxPQUFGO0FBQVdYLE1BQUFBLFFBQVg7QUFBcUIySixNQUFBQSxLQUFyQjtBQUE0QlosTUFBQUEsZUFBNUI7QUFBNkNxQixNQUFBQTtBQUE3QyxRQUF5RDFKLEtBQS9EO0FBQ0EsVUFBTXNJLFFBQVEsR0FBRyxNQUFNQyxLQUFLLENBQ3pCLEdBQUVDLE9BQU8sQ0FBQ0MsR0FBUixDQUFZQyx3QkFBeUIsa0JBRGQsRUFFMUI7QUFDRUksTUFBQUEsTUFBTSxFQUFFLEtBRFY7QUFFRU0sTUFBQUEsSUFBSSxFQUFFQyxJQUFJLENBQUNDLFNBQUwsQ0FBZTtBQUNuQnJKLFFBQUFBLE9BRG1CO0FBRW5CWCxRQUFBQSxRQUZtQjtBQUduQm9LLFFBQUFBLE9BSG1CO0FBSW5CVCxRQUFBQSxLQUptQjtBQUtuQlosUUFBQUE7QUFMbUIsT0FBZjtBQUZSLEtBRjBCLENBQTVCO0FBY0EsVUFBTVUsTUFBTSxHQUFHLE1BQU1ULFFBQVEsQ0FBQ1UsSUFBVCxFQUFyQjs7QUFDQSxRQUFJVixRQUFRLENBQUMvRyxNQUFULEtBQW9CLEdBQXhCLEVBQTZCO0FBQzNCc0MsTUFBQUEsUUFBUSxDQUFDO0FBQ1BqSCxRQUFBQSxJQUFJLEVBQUVnRixhQUFXLENBQUNnRyx1QkFEWDtBQUVQcUIsUUFBQUEsS0FBSyxFQUFFRixNQUFNLENBQUNFO0FBRlAsT0FBRCxDQUFSO0FBSUQsS0FMRCxNQUtPLElBQUlYLFFBQVEsQ0FBQy9HLE1BQVQsS0FBb0IsR0FBeEIsRUFBNkI7QUFDbEMsWUFBTTtBQUFFMkgsUUFBQUE7QUFBRixVQUFhSCxNQUFuQjtBQUNBRyxNQUFBQSxNQUFNLENBQUNoRCxPQUFQLENBQWdCYyxLQUFELElBQVc7QUFDeEJuRCxRQUFBQSxRQUFRLENBQ04vQixnQkFBZ0IsQ0FBQztBQUNmUCxVQUFBQSxNQUFNLEVBQUV5RjtBQURPLFNBQUQsQ0FEVixDQUFSO0FBS0QsT0FORDtBQU9ELEtBVE0sTUFTQSxJQUFJc0IsUUFBUSxDQUFDL0csTUFBVCxLQUFvQixHQUF4QixFQUE2QjtBQUNsQyxZQUFNO0FBQUV5RixRQUFBQTtBQUFGLFVBQVkrQixNQUFsQjtBQUVBbEYsTUFBQUEsUUFBUSxDQUFDO0FBQ1BqSCxRQUFBQSxJQUFJLEVBQUVnRixhQUFXLENBQUNpRyxzQkFEWDtBQUVQYixRQUFBQSxLQUFLLEVBQUVBO0FBRkEsT0FBRCxDQUFSO0FBSUQsS0FQTSxNQU9BO0FBQ0wsWUFBTSxJQUFJcEQsS0FBSixDQUFVLDBCQUFWLENBQU47QUFDRDtBQUNGLEdBekNELENBeUNFLE9BQU9vRCxLQUFQLEVBQWM7QUFDZG5ELElBQUFBLFFBQVEsQ0FBQztBQUNQakgsTUFBQUEsSUFBSSxFQUFFZ0YsYUFBVyxDQUFDaUcsc0JBRFg7QUFFUE0sTUFBQUEsT0FBTyxFQUFFO0FBQUVuQixRQUFBQTtBQUFGO0FBRkYsS0FBRCxDQUFSO0FBSUQ7QUFDRjtBQUVNLGVBQWUyQyxjQUFmLENBQThCO0FBQUU5RixFQUFBQSxRQUFGO0FBQVk3RCxFQUFBQTtBQUFaLENBQTlCLEVBQW1EO0FBQ3hELE1BQUk7QUFDRjZELElBQUFBLFFBQVEsQ0FBQztBQUFFakgsTUFBQUEsSUFBSSxFQUFFZ0YsYUFBVyxDQUFDa0c7QUFBcEIsS0FBRCxDQUFSO0FBQ0EsVUFBTTtBQUFFbkosTUFBQUE7QUFBRixRQUFZcUIsS0FBbEI7QUFDQSxVQUFNc0ksUUFBUSxHQUFHLE1BQU1DLEtBQUssQ0FBQyxvQkFBRCxFQUF1QjtBQUNqRE8sTUFBQUEsTUFBTSxFQUFFLE1BRHlDO0FBRWpETSxNQUFBQSxJQUFJLEVBQUVDLElBQUksQ0FBQ0MsU0FBTCxDQUFlO0FBQUUzSyxRQUFBQTtBQUFGLE9BQWY7QUFGMkMsS0FBdkIsQ0FBNUI7QUFJQSxVQUFNb0ssTUFBTSxHQUFHLE1BQU1ULFFBQVEsQ0FBQ1UsSUFBVCxFQUFyQjs7QUFDQSxRQUFJVixRQUFRLENBQUMvRyxNQUFULEtBQW9CLEdBQXhCLEVBQTZCO0FBQzNCc0MsTUFBQUEsUUFBUSxDQUFDO0FBQ1BqSCxRQUFBQSxJQUFJLEVBQUVnRixhQUFXLENBQUNnRyx1QkFEWDtBQUVQcUIsUUFBQUEsS0FBSyxFQUFFRixNQUFNLENBQUNFO0FBRlAsT0FBRCxDQUFSO0FBSUQsS0FMRCxNQUtPLElBQUlYLFFBQVEsQ0FBQy9HLE1BQVQsS0FBb0IsR0FBeEIsRUFBNkI7QUFDbEMsWUFBTTtBQUFFMkgsUUFBQUE7QUFBRixVQUFhSCxNQUFuQjtBQUNBRyxNQUFBQSxNQUFNLENBQUNoRCxPQUFQLENBQWdCYyxLQUFELElBQVc7QUFDeEJuRCxRQUFBQSxRQUFRLENBQ04vQixnQkFBZ0IsQ0FBQztBQUNmUCxVQUFBQSxNQUFNLEVBQUV5RjtBQURPLFNBQUQsQ0FEVixDQUFSO0FBS0QsT0FORDtBQU9ELEtBVE0sTUFTQSxJQUFJc0IsUUFBUSxDQUFDL0csTUFBVCxLQUFvQixHQUF4QixFQUE2QjtBQUNsQyxZQUFNO0FBQUV5RixRQUFBQTtBQUFGLFVBQVkrQixNQUFsQjtBQUVBbEYsTUFBQUEsUUFBUSxDQUFDO0FBQ1BqSCxRQUFBQSxJQUFJLEVBQUVnRixhQUFXLENBQUNpRyxzQkFEWDtBQUVQYixRQUFBQSxLQUFLLEVBQUVBO0FBRkEsT0FBRCxDQUFSO0FBSUQsS0FQTSxNQU9BO0FBQ0wsWUFBTSxJQUFJcEQsS0FBSixDQUFVLDBCQUFWLENBQU47QUFDRDtBQUNGLEdBaENELENBZ0NFLE9BQU9vRCxLQUFQLEVBQWM7QUFDZG5ELElBQUFBLFFBQVEsQ0FBQztBQUNQakgsTUFBQUEsSUFBSSxFQUFFZ0YsYUFBVyxDQUFDb0csMEJBRFg7QUFFUEcsTUFBQUEsT0FBTyxFQUFFO0FBQUVuQixRQUFBQSxLQUFLLEVBQUU0QztBQUFUO0FBRkYsS0FBRCxDQUFSO0FBSUQ7QUFDRjs7OzsifQ==
