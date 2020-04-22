import { v, h, M, T, m, s, _ as _extends, p } from './index-bed87f77.js';

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9ucy05ZTYwM2ZjOC5qcyIsInNvdXJjZXMiOlsiLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWluamVjdC9kaXN0L3N0eWxlLWluamVjdC5lcy5qcyIsIi4uL2Zvcm0vdmFsaWRhdGlvblN0YXRlcy5qcyIsIi4uL2Zvcm0vdmFsaWRhdGlvblR5cGVzLmpzIiwiLi4vZm9ybS92YWxpZGF0aW9uTWVzc2FnZXMuanMiLCIuLi9mb3JtL3ZhbGlkYXRpb25SZWdleC5qcyIsIi4uL2Zvcm0vY29uc3RyYWludFZhbGlkYXRvcnMuanMiLCIuLi9mb3JtL2FjdGlvblR5cGVzLmpzIiwiLi4vZm9ybS9odHRwLXN0YXR1cy5qcyIsIi4uL2Zvcm0vYWN0aW9ucy5qcyIsIi4uL2Zvcm0vaWNvbnMvb3BlbkV5ZS5wbmciLCIuLi9mb3JtL2ljb25zL2Nsb3NlRXllLnBuZyIsIi4uL2Zvcm0vRXllSWNvbi5qcyIsIi4uL2Zvcm0vZm9ybVJlZHVjZXIuanMiLCIuLi9mb3JtL2Zvcm0tY29udGV4dC5qcyIsIi4uL2Zvcm0vSW5wdXQuanMiLCIuLi9mb3JtL0J1dHRvbi5qcyIsIi4uL2Zvcm0vRm9ybS5qcyIsIi4uL2F1dGgvYWN0aW9uVHlwZXMuanMiLCIuLi9hdXRoL2FjdGlvbnMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gc3R5bGVJbmplY3QoY3NzLCByZWYpIHtcbiAgaWYgKCByZWYgPT09IHZvaWQgMCApIHJlZiA9IHt9O1xuICB2YXIgaW5zZXJ0QXQgPSByZWYuaW5zZXJ0QXQ7XG5cbiAgaWYgKCFjc3MgfHwgdHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJykgeyByZXR1cm47IH1cblxuICB2YXIgaGVhZCA9IGRvY3VtZW50LmhlYWQgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgdmFyIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgc3R5bGUudHlwZSA9ICd0ZXh0L2Nzcyc7XG5cbiAgaWYgKGluc2VydEF0ID09PSAndG9wJykge1xuICAgIGlmIChoZWFkLmZpcnN0Q2hpbGQpIHtcbiAgICAgIGhlYWQuaW5zZXJ0QmVmb3JlKHN0eWxlLCBoZWFkLmZpcnN0Q2hpbGQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gIH1cblxuICBpZiAoc3R5bGUuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICBzdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBzdHlsZUluamVjdDtcbiIsImV4cG9ydCBkZWZhdWx0IHtcclxuICBWQUxJRDogJ1ZBTElEJyxcclxuICBJTlZBTElEOiAnSU5WQUxJRCcsXHJcbiAgSU5BQ1RJVkU6ICdJTkFDVElWRSdcclxufTtcclxuIiwiZXhwb3J0IGRlZmF1bHQge1xyXG4gIC8vY29uc3RyYWludFxyXG4gIEVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OOiAnRU1BSUxfRk9STUFUX1ZBTElEQVRJT04nLFxyXG4gIFBBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OOiAnUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT04nLFxyXG4gIFVTRVJOQU1FX0ZPUk1BVF9WQUxJREFUSU9OOiAnVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT04nLFxyXG4gIFVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OOiAnVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT04nLFxyXG4gIEVNUFRZX1NUUklOR19WQUxJREFUSU9OOiAnRU1QVFlfU1RSSU5HX1ZBTElEQVRJT04nLFxyXG4gIFBBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OOiAnUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT04nLFxyXG4gIC8vYXV0aFxyXG4gIElOVkFMSURfQ1JFREVOVElBTFM6ICdJTlZBTElEX0NSRURFTlRJQUxTJyxcclxuICBVU0VSTkFNRV9UQUtFTjogJ1VTRVJOQU1FX1RBS0VOJyxcclxuICBSRUdJU1RFUkVEX0VNQUlMOiAnUkVHSVNURVJFRF9FTUFJTCcsXHJcbiAgRU1BSUxfTk9UX1JFR0lTVEVSRUQ6ICdFTUFJTF9OT1RfUkVHSVNURVJFRCcsXHJcbiAgVVNFUk5BTUVfTk9UX1JFR0lTVEVSRUQ6J1VTRVJOQU1FX05PVF9SRUdJU1RFUkVEJ1xyXG59O1xyXG4iLCJleHBvcnQgZGVmYXVsdCB7XHJcbiAgSU5WQUxJRF9QQVNTV09SRDpcclxuICAgICdhdCBsZWFzdCA4IGNoYXJhY3RlcnMsIG11c3QgY29udGFpbiBhdCBsZWFzdCAxIHVwcGVyY2FzZSBsZXR0ZXIsIDEgbG93ZXJjYXNlIGxldHRlciwgQ2FuIGNvbnRhaW4gc3BlY2lhbCBjaGFyYWN0ZXJzJyxcclxuICBJTlZBTElEX0VNQUlMOiAnZW1haWwgZm9ybWF0IGlzIG5vdCB2YWxpZCcsXHJcbiAgRU1BSUxfTk9UX1JFR0lTVEVSRUQ6ICdlbWFpbCBpcyBub3QgcmVnaXN0ZXJlZCcsXHJcbiAgVVNFUk5BTUVfTk9UX1JFR0lTVEVSRUQ6ICd1c2VybmFtZSBpcyBub3QgcmVnaXN0ZXJlZCcsXHJcbiAgSU5WQUxJRF9VU0VSTkFNRTpcclxuICAgICdvbmx5IExldHRlcnMgYS16IG9yIEEtWiBhbmQgdGhlIFN5bWJvbHMgLSBhbmQgXyBhcmUgYWxsb3dlZCcsXHJcbiAgSU5WQUxJRF9FTVBUWV9TVFJJTkc6ICdlbXB0eSBzdHJpbmcgaXMgbm90IGFsbG93ZWQnLFxyXG4gIElOVkFMSURfVVNFUk5BTUVfT1JfRU1BSUw6ICdlbWFpbCBvciB1c2VybmFtZSBpcyBub3QgdmFsaWQnLFxyXG4gIElOVkFMSURfQ1JFREVOVElBTFM6ICdpbnZhbGlkIGNyZWRlbnRpYWxzIHByb3ZpZGVkJyxcclxuICBVU0VSTkFNRV9UQUtFTjogJ3VzZXJuYW1lIGlzIGFscmVhZHkgdGFrZW4nLFxyXG4gIFJFR0lTVEVSRURfRU1BSUw6ICdlbWFpbCBpcyBhbHJlYWR5IHJlZ2lzdGVyZWQnLFxyXG4gIFBBU1NXT1JEU19ET19OT1RfTUFUQ0g6ICdwYXNzd29yZHMgZG8gbm90IG1hdGNoJ1xyXG59O1xyXG4iLCJleHBvcnQgY29uc3QgcGFzc3dvcmRSZWdleCA9IC9eKD89LipcXGQpKD89LipbYS16XSkoPz0uKltBLVpdKSg/PS4qW2EtekEtWl0pLns4LH0kL2c7XHJcblxyXG5leHBvcnQgY29uc3QgZW1haWxSZWdleCA9IC9bYS16MC05ISMkJSYnKisvPT9eX2B7fH1+LV0rKD86XFwuW2EtejAtOSEjJCUmJyorLz0/Xl9ge3x9fi1dKykqQCg/OlthLXowLTldKD86W2EtejAtOS1dKlthLXowLTldKT9cXC4pK1thLXowLTldKD86W2EtejAtOS1dKlthLXowLTldKT8vZztcclxuXHJcbmV4cG9ydCBjb25zdCB1c2VybmFtZVJlZ2V4ID0gL1thLXpBLVpdK1stX10qW2EtekEtWl0rL2c7XHJcbiIsImltcG9ydCB2YWxpZGF0aW9uU3RhdGUgZnJvbSAnLi92YWxpZGF0aW9uU3RhdGVzJztcclxuaW1wb3J0IHZhbGlkYXRpb25UeXBlcyBmcm9tICcuL3ZhbGlkYXRpb25UeXBlcyc7XHJcbmltcG9ydCB2YWxpZGF0aW9uTWVzc2FnZXMgZnJvbSAnLi92YWxpZGF0aW9uTWVzc2FnZXMnO1xyXG5pbXBvcnQgeyBlbWFpbFJlZ2V4LCBwYXNzd29yZFJlZ2V4LCB1c2VybmFtZVJlZ2V4IH0gZnJvbSAnLi92YWxpZGF0aW9uUmVnZXgnO1xyXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVFbWFpbENvbnN0cmFpbnQoeyBlbWFpbCB9KSB7XHJcbiAgY29uc3QgZW1haWxDb25zdHJhaW50ID0gbmV3IFJlZ0V4cChlbWFpbFJlZ2V4KTtcclxuXHJcbiAgaWYgKGVtYWlsQ29uc3RyYWludC50ZXN0KGVtYWlsKSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5FTUFJTF9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgfTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5FTUFJTF9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfRU1BSUwsXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzQ2xpZW50VmFsaWRhdGlvblR5cGUoeyB2YWxpZGF0aW9uVHlwZSB9KSB7XHJcbiAgc3dpdGNoICh2YWxpZGF0aW9uVHlwZSkge1xyXG4gICAgY2FzZSB2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT046XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgY2FzZSB2YWxpZGF0aW9uVHlwZXMuRU1BSUxfRk9STUFUX1ZBTElEQVRJT046XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgY2FzZSB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT046XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgY2FzZSB2YWxpZGF0aW9uVHlwZXMuRU1QVFlfU1RSSU5HX1ZBTElEQVRJT046XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgY2FzZSB2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT046XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgY2FzZSB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT046XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxufVxyXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVQYXNzd29yZENvbnN0cmFpbnQoeyBwYXNzd29yZCB9KSB7XHJcbiAgY29uc3QgcGFzc3dvcmRDb25zdHJhaW50ID0gbmV3IFJlZ0V4cChwYXNzd29yZFJlZ2V4KTtcclxuICBpZiAocGFzc3dvcmRDb25zdHJhaW50LnRlc3QocGFzc3dvcmQpKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogJycsXHJcbiAgICB9O1xyXG4gIH1cclxuICBpZiAoIXBhc3N3b3JkQ29uc3RyYWludC50ZXN0KHBhc3N3b3JkKSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5QQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfUEFTU1dPUkQsXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlVXNlck5hbWVDb25zdHJhaW50KHsgdXNlcm5hbWUgfSkge1xyXG4gIGNvbnN0IHVzZXJuYW1lQ29uc3RyYWludCA9IG5ldyBSZWdFeHAodXNlcm5hbWVSZWdleCk7XHJcblxyXG4gIGlmICh1c2VybmFtZUNvbnN0cmFpbnQudGVzdCh1c2VybmFtZSkpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLlZBTElELFxyXG4gICAgICBtZXNzYWdlOiAnJyxcclxuICAgIH07XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX1VTRVJOQU1FLFxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUVtYWlsT3JVc2VybmFtZSh7IHZhbHVlIH0pIHtcclxuICBjb25zdCBlbWFpbENvbnN0cmFpbnQgPSBuZXcgUmVnRXhwKGVtYWlsUmVnZXgpO1xyXG4gIGNvbnN0IHVzZXJuYW1lQ29uc3RyYWludCA9IG5ldyBSZWdFeHAodXNlcm5hbWVSZWdleCk7XHJcblxyXG4gIGlmIChlbWFpbENvbnN0cmFpbnQudGVzdCh2YWx1ZSkpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLlZBTElELFxyXG4gICAgICBtZXNzYWdlOiAnJyxcclxuICAgIH07XHJcbiAgfSBlbHNlIGlmICh1c2VybmFtZUNvbnN0cmFpbnQudGVzdCh2YWx1ZSkpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLlZBTElELFxyXG4gICAgICBtZXNzYWdlOiAnJyxcclxuICAgIH07XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX1VTRVJOQU1FX09SX0VNQUlMLFxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUVtcHR5U3RyaW5nKHsgdmFsdWUgfSkge1xyXG4gIGlmICh2YWx1ZS5sZW5ndGggPT09IDApIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuRU1QVFlfU1RSSU5HX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX0VNUFRZX1NUUklORyxcclxuICAgIH07XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuRU1QVFlfU1RSSU5HX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLlZBTElELFxyXG4gICAgICBtZXNzYWdlOiAnJyxcclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVQYXNzd29yZE1hdGNoKHsgc3RhdGUgfSkge1xyXG4gIGNvbnN0IHsgcGFzc3dvcmQsIGNvbmZpcm0gfSA9IHN0YXRlLmF1dGg7XHJcblxyXG4gIGlmIChwYXNzd29yZCA9PT0gJycgfHwgcGFzc3dvcmQgIT09IGNvbmZpcm0pIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5QQVNTV09SRFNfRE9fTk9UX01BVENILFxyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OLFxyXG4gICAgfTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OLFxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQge1xyXG4gICAgSU5JVF9GT1JNX1ZBTElEQVRJT05fU1RBVEU6ICdJTklUX0ZPUk1fVkFMSURBVElPTl9TVEFURScsXHJcbiAgICBSRVNFVF9WQUxJREFUSU9OX1NUQVRFOiAnUkVTRVRfVkFMSURBVElPTl9TVEFURScsXHJcbiAgICBJTlBVVF9CTFVSUkVEOiAnSU5QVVRfQkxVUlJFRCcsXHJcbiAgICBJTlBVVF9GT0NVU0VEOiAnSU5QVVRfRk9DVVNFRCcsXHJcbiAgXHJcbiAgICBTRVJWRVJfVkFMSURBVElPTjogJ1NFUlZFUl9WQUxJREFUSU9OJyxcclxuICAgIENMSUVOVF9WQUxJREFUSU9OOidDTElFTlRfVkFMSURBVElPTicsXHJcbiAgXHJcbiAgICBJTkNfSU5QVVRfQ09VVE4gOidJTkNfSU5QVVRfQ09VVE4nXHJcbiAgfTtcclxuICAiLCJleHBvcnQgZGVmYXVsdCB7XHJcbiAgLy9sb2dpblxyXG4gIGNyZWRlbnRpYWxJbnZhbGlkOiAnNDAxJyxcclxuICAvL3NpZ251cFxyXG4gIHVzZXJuYW1lSXNUYWtlbjogJzQwMicsXHJcbiAgZW1haWxJc1JlZ2lzdGVyZWQ6ICc0MDMnLFxyXG4gIHVzZXJuYW1lSW52YWxpZDogJzQwNScsXHJcbiAgcGFzc3dvcmRJbnZhbGlkOiAnNDA2JywgLy9jaGFuZ2UgcGFzc3dvcmRcclxuICBlbWFpbEludmFsaWQ6ICc0MDcnLFxyXG4gIC8vbG9naW5cclxuICBlbWFpbElzTm90UmVnaXN0ZXJlZDogJzQwOCcsXHJcbiAgZW1wdHlTdHJpbmdOb3RWYWxpZDogJzQwOScsXHJcbiAgZW1haWxvcnVzZXJuYW1lTm90VmFsaWQ6JzQxMCcsXHJcbiAgdXNlcm5hbWVJc05vdFJlZ2lzdGVyZWQ6JzQxMScsXHJcbi8vY2hhbmdlIHBhc3N3b3JkXHJcbiAgcGFzc3dvcmREb05vdE1hdGNoOic0MTInLFxyXG4gIHRva2VuRXhwaXJlZDonNDEzJyxcclxuICBzZXJ2ZXJWYWxpZGF0aW9uUmFuZ2U6IHN0YXR1cyA9PiB7XHJcbiAgICBpZiAoc3RhdHVzID49IDQwMCAmJiBzdGF0dXMgPD0gNDEwKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxufTtcclxuIiwiXHJcbmltcG9ydCAqIGFzIHZhbGlkYXRpb25zIGZyb20gJy4vY29uc3RyYWludFZhbGlkYXRvcnMnO1xyXG5pbXBvcnQgY29uc3RWYWxUeXBlcyBmcm9tICcuL3ZhbGlkYXRpb25UeXBlcyc7XHJcbmltcG9ydCB2YWxpZGF0aW9uU3RhdGVzIGZyb20gJy4vdmFsaWRhdGlvblN0YXRlcyc7XHJcbmltcG9ydCB2YWxpZGF0aW9uVHlwZXMgZnJvbSAnLi92YWxpZGF0aW9uVHlwZXMnO1xyXG5pbXBvcnQgYWN0aW9uVHlwZXMgZnJvbSAnLi9hY3Rpb25UeXBlcyc7XHJcbmltcG9ydCBodHRwU3RhdHVzIGZyb20gJy4vaHR0cC1zdGF0dXMnO1xyXG5pbXBvcnQgdmFsaWRhdGlvbk1lc3NhZ2VzIGZyb20gJy4vdmFsaWRhdGlvbk1lc3NhZ2VzJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjbGllbnRWYWxpZGF0aW9uKHsgdmFsaWRhdGlvblR5cGUsIHZhbHVlLCBzdGF0ZSB9KSB7XHJcbiAgbGV0IHZhbGlkYXRpb24gPSBudWxsO1xyXG4gIHN3aXRjaCAodmFsaWRhdGlvblR5cGUpIHtcclxuICAgIGNhc2UgY29uc3RWYWxUeXBlcy5FTUFJTF9GT1JNQVRfVkFMSURBVElPTjpcclxuICAgICAgdmFsaWRhdGlvbiA9IHZhbGlkYXRpb25zLnZhbGlkYXRlRW1haWxDb25zdHJhaW50KHtcclxuICAgICAgICBlbWFpbDogdmFsdWUsXHJcbiAgICAgIH0pO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgY29uc3RWYWxUeXBlcy5VU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTjpcclxuICAgICAgdmFsaWRhdGlvbiA9IHZhbGlkYXRpb25zLnZhbGlkYXRlRW1haWxPclVzZXJuYW1lKHtcclxuICAgICAgICB2YWx1ZSxcclxuICAgICAgfSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBjb25zdFZhbFR5cGVzLlBBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OOlxyXG4gICAgICB2YWxpZGF0aW9uID0gdmFsaWRhdGlvbnMudmFsaWRhdGVQYXNzd29yZENvbnN0cmFpbnQoe1xyXG4gICAgICAgIHBhc3N3b3JkOiB2YWx1ZSxcclxuICAgICAgfSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBjb25zdFZhbFR5cGVzLlVTRVJOQU1FX0ZPUk1BVF9WQUxJREFUSU9OOlxyXG4gICAgICB2YWxpZGF0aW9uID0gdmFsaWRhdGlvbnMudmFsaWRhdGVVc2VyTmFtZUNvbnN0cmFpbnQoe1xyXG4gICAgICAgIHVzZXJuYW1lOiB2YWx1ZSxcclxuICAgICAgfSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBjb25zdFZhbFR5cGVzLkVNUFRZX1NUUklOR19WQUxJREFUSU9OOlxyXG4gICAgICB2YWxpZGF0aW9uID0gdmFsaWRhdGlvbnMudmFsaWRhdGVFbXB0eVN0cmluZyh7IHZhbHVlIH0pO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgY29uc3RWYWxUeXBlcy5QQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTjpcclxuICAgICAgZGVidWdnZXI7XHJcbiAgICAgIHZhbGlkYXRpb24gPSB2YWxpZGF0aW9ucy52YWxpZGF0ZVBhc3N3b3JkTWF0Y2goeyBzdGF0ZSB9KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICBicmVhaztcclxuICB9XHJcblxyXG4gIHJldHVybiB7IHR5cGU6IGFjdGlvblR5cGVzLkNMSUVOVF9WQUxJREFUSU9OLCAuLi52YWxpZGF0aW9uIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpbml0Rm9ybVZhbGlkYXRpb25TdGF0ZSgpIHtcclxuICByZXR1cm4geyB0eXBlOiBhY3Rpb25UeXBlcy5JTklUX0ZPUk1fVkFMSURBVElPTl9TVEFURSB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVzZXRJbnB1dFZhbGlkYXRpb25TdGF0ZSh7IHZhbGlkYXRpb25UeXBlIH0pIHtcclxuICByZXR1cm4geyB0eXBlOiBhY3Rpb25UeXBlcy5SRVNFVF9WQUxJREFUSU9OX1NUQVRFLCB2YWxpZGF0aW9uVHlwZSB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaW5jSW5wdXRDb3VudCgpIHtcclxuICByZXR1cm4geyB0eXBlOiBhY3Rpb25UeXBlcy5JTkNfSU5QVVRfQ09VVE4gfTtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXJ2ZXJWYWxpZGF0aW9uKHsgc3RhdHVzID0gMCB9KSB7XHJcbiAgZGVidWdnZXI7XHJcbiAgc3dpdGNoIChzdGF0dXMpIHtcclxuICAgIGNhc2UgaHR0cFN0YXR1cy5jcmVkZW50aWFsSW52YWxpZDpcclxuICAgICAgZGVidWdnZXI7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLmVtYWlsSW52YWxpZDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLkVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX0VNQUlMLFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLnBhc3N3b3JkSW52YWxpZDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX1BBU1NXT1JELFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLnVzZXJuYW1lSW52YWxpZDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX1VTRVJOQU1FLFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLmVtYWlsSXNSZWdpc3RlcmVkOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxyXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuUkVHSVNURVJFRF9FTUFJTCxcclxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuUkVHSVNURVJFRF9FTUFJTCxcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcclxuICAgICAgfTtcclxuICAgIGNhc2UgaHR0cFN0YXR1cy5lbWFpbElzTm90UmVnaXN0ZXJlZDpcclxuICAgICAgZGVidWdnZXI7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5FTUFJTF9OT1RfUkVHSVNURVJFRCxcclxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuRU1BSUxfTk9UX1JFR0lTVEVSRUQsXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMudXNlcm5hbWVJc1Rha2VuOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxyXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfVEFLRU4sXHJcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLlVTRVJOQU1FX1RBS0VOLFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLmVtcHR5U3RyaW5nTm90VmFsaWQ6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5FTVBUWV9TVFJJTkdfVkFMSURBVElPTixcclxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9FTVBUWV9TVFJJTkcsXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMuZW1haWxvcnVzZXJuYW1lTm90VmFsaWQ6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9VU0VSTkFNRV9PUl9FTUFJTCxcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcclxuICAgICAgfTtcclxuICAgIGNhc2UgaHR0cFN0YXR1cy51c2VybmFtZUlzTm90UmVnaXN0ZXJlZDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX05PVF9SRUdJU1RFUkVELFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5VU0VSTkFNRV9OT1RfUkVHSVNURVJFRCxcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcclxuICAgICAgfTtcclxuICAgICAgY2FzZSBodHRwU3RhdHVzLnBhc3N3b3JkRG9Ob3RNYXRjaDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OLFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5QQVNTV09SRFNfRE9fTk9UX01BVENILFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG59XHJcbiIsImNvbnN0IGltZyA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFFQUFBQUJBQ0FZQUFBQ3FhWEhlQUFBQUNYQklXWE1BQUFzVEFBQUxFd0VBbXB3WUFBQUNza2xFUVZSNG5PMmF1MjRUUVJTR1A5c0swRmdpSWdMbElvVXVxUU5VVk9IU21CTGVnSFFVZ1M3UGdaSU9oS21JWWloaTNzQUlDUXBTSktFRUNTc0dna0tMSlV1UktXWVdITE9MZCtmTTd0cngrYVNSSld0bi92L1l1N016Wnc0b2lxSW9pcUlvaWpLT0ZETFFPQU5jQWE0RFM4QkY0QUl3WlQ4QmZnSkg5dk1Ic0FPOEJUNEFuUXc4ZXVjU3NBYThBZHBBMTdHMTdSaHJkc3locGdEY0JtcVlmODAxNktqV3NXUGZJcHM3TnhFM2dGMzhCeDNWZHExbTdsd0dYcEZkNFAzdEpUQ2ZkcEJSUEVUMmZQdHFiV0ExNVZoUGNCWjQ3amtJSDYxcXZhWEtEUEEreHlBSHRYZkFkRnJCendGTm9jRW1zQTVVZ0FXZ2JOdUMvVzdkZzhZWDY5VXJrOEJIZ2FrRDRENVFpcUZWc3RlMkJIcjd3SGxSeEQyY3d5eEdYTTFzWS83bHBKU0J1a0MzWWIyTDJSU1llQXdVQmRwRk80YXIvcVpBRzRCN0F2RnQvS3pZaXNqdWhMdXV3cFBBZDBmUkE5eHUreWpLdU04SjMyd3NpYWs2Q25ZeGs1aHZWZ1IrbmlVVnV5WVFheEp2dGs5S0Nka3I4bXJZb0ZFVDFDT0IwVHB3TE9nZnhUSHdXdEEvZGt5enlMYXpGWUhKUVZRRXZqcVlsZXdKd3U2QUI4Q0V3T1FuUWQ5QmZCYjBuY0RFTnBCRDNIL2xMbjVuLzM3S1FtK0gvUU5LRmltbmdyQWY0S2x3ekgrZU00L01DdnMvaVNzeTFwTmdDNU5xa3BoTWl6dUN2alhnYTl5THgyWWg5RCtxQXJHUlh3cURiRFBVNGhSc2hrQytIZmJ4bXMxdE94d3d5Z21SRndMdFAwaFRZblZHUENVRzVobmFGNWhwWVNheHVFblJGV1JKMFQwOEprVUQ1akFwWjFkVFhjeHJiQU96Vmxqa2IxcDgwWDYzd1pDbXhRTm1NSWNQRW9OcHRsUVBSZ0xHK21pc2wxV0c0M0QwRnhrZmp2WXlqOWszNUJWOGpSeVB4M3RaSnZzQ2llVk1Ja3RBQVZPK3NrVjZKVEpid0UyR3NFU21uNkJJcW9HOFNLcEJpa1ZTV1pYSkxSRmVKamRscnpraXZFeHVoeEV0azFNVVJWRVVSVkVVWmJqNURja01GZVFockZqOUFBQUFBRWxGVGtTdVFtQ0NcIjtcbiAgZXhwb3J0IGRlZmF1bHQgaW1nOyIsImNvbnN0IGltZyA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFFQUFBQUJBQ0FZQUFBQ3FhWEhlQUFBQUNYQklXWE1BQUFzVEFBQUxFd0VBbXB3WUFBQURzMGxFUVZSNG5PM2JTMmhjVlJ6SDhVOWFvOUl5bW9Jb1NtT3FMYTByTjc1d0s0SmF0SlFhRmV6Q2lOS3RpRkJjNk5LVmRDT0tDMUVySW9vS29xQ0M0RnZSalNLMWlpNUVEV2hOVWZFRmdSaU1pek9STkwwM2N4NXpaMkp5Zi9Bbk1NbWMzLy8vemJuM250ZWxWYXRXclU3VVhzeDBZOStRY3htS1pyRFFqYjh4T2R4MEJxK2xBTllsaEgxQzBjc2gzRFRNcEFhdFNTMkVXZ2czRHpPcFFhdUZZSTFER0luOHUwazhpMU9XZkRhUC9YaSt4M2UzNERKYzNJMWQzYy9PN01ZLytBVS9kMzhleDZmNEVKOWdMakxIeGxYVkUrWlY5NFFMY0RmZXJ2aE9Tc3ppZmR5TGM1b3BLMDI5SUZ5TlY0WC9hbTdSZFRHSEY3b2VzVDIzRWRWQitGTC9pNjZMSTdpcTZVSlhVaFdFWWNTTG1HaTQxbHF0RmdpenVLdmhXbXUxV2lBczREQk9hN1RhR3EwbUNCL2ozS1lLUFI5dllYdkY3MkloSE1NaFhDOWN1NXZRRWNZR3UvRXdwaVBhV1NtK3g5WSsxZzNPeHRkZGcybnBFSDdDRkVZanZEYmlEdnhRMDFaTUhNVllhcEYxMml5TXlKWWFwRUk0a09IYndTc1ZiY1hHZXpnOXcvY2tQVkZqa0FKaEhyZGtlRy9BUXpYK01mRmNodWNKMnQvRFlGQVFTbnJDalJtZTREejhHV0V3Q0FnZCtmZUVZOExrSzFtSEUwd0dBZUhPaEh5V3g1T3BacGRrbURRTllhT3lSK1NsS1dhdlpacE1ZMXRGZS8yQzhFaG1YZ3Q0SnRaa3U3THA3TFUxN2ZZRHd1NkN2T2FFKzFwUFBWaGdzb0R4RmRvdWhYQlJZVzRQeEpnY0x6VHBOU0VwZ2RBcHpHMG13cU1ZUU13UU5CZkNwc0xjb2dBY0tqUzVJc1pFSG9TSnd0eWlMb0ZkaFNhM3haaDBsUXJoaG9LOG9tK0M4SHFCMFdPeEpsMmxRQ2pwbmRHUFFmSUdRb3N4aTdOU3pNUkJHQldHdGJsNUpRMkVDQnNldVdiM3A1cnBEV0dxSUovSE0vS3hGYjluR3Y2Qm5SbWVkUkFPQ0lzcU9ibjhxR0J4NVBaTTB3VjhMaXltcEtyZmE0eDdNM0w0VHlQS0xvV1hEQmZDVXhuZUoybXpzRm1abThRUjdNandMWVh3Sms3TjhLM1VPTDRyU09ZMzNLYy9UNGVZK0F4blpOUzVvcmJoMjR4a2xzYXNNRTZZRWthTVk4TGNZUnpYcU43bVNvWHdqWWIzQm80bUpKTWFPVXZ1UytNZDZiMHNXUjI4SEpITW9DRThLbTdmb1MvYWdIdUVMcjBhSUR6ZC94TGp0QlB2VmlRMGFBaDFKMVVHb2hIczBjd0JpZjhOQk1LcTdSNjhvZjhRTHF6d1c1VVFGclVEQi9HUnN1TG5oRDIrNjJwOGlvL3dEZUt3MFJndXg1WENvdWFFOERqdENHT0FVV0h5OUt0d1ZPNHJmQ0dNSUQvQVh6M2FyenZDZDZ0d3FHcGRxRDNicklXQWVnanI2bjJIRm9KNkNPdnFIYWdxQ0ZFYkkydEp5eUdzT3dDRWJyLzRHbURSK21DclZxM1dudjRGcnJjdWoyT2ZSNXNBQUFBQVNVVk9SSzVDWUlJPVwiO1xuICBleHBvcnQgZGVmYXVsdCBpbWc7IiwiaW1wb3J0IHtofSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQge3VzZVN0YXRlfSBmcm9tICdwcmVhY3QvaG9va3MnXHJcbmltcG9ydCBvcGVuSWNvbiBmcm9tICcuL2ljb25zL29wZW5FeWUucG5nJztcclxuaW1wb3J0IGNsb3NlSWNvbiBmcm9tICcuL2ljb25zL2Nsb3NlRXllLnBuZyc7XHJcbmZ1bmN0aW9uIEljb25TdGF0ZSh7IG9wZW4gfSkge1xyXG4gIGlmIChvcGVuKSB7XHJcbiAgICByZXR1cm4gPGltZyB3aWR0aD1cIjMwcHhcIiBzcmM9e29wZW5JY29ufSAvPjtcclxuICB9XHJcbiAgcmV0dXJuIDxpbWcgd2lkdGg9XCIzMHB4XCIgc3JjPXtjbG9zZUljb259IC8+O1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBFeWVJY29uKHtvbkNsaWNrfSkge1xyXG4gIGNvbnN0IFtzdGF0ZSwgc2V0U3RhdGVdID0gdXNlU3RhdGUoZmFsc2UpO1xyXG4gIGZ1bmN0aW9uIHRvZ2dsZSgpIHtcclxuICAgIG9uQ2xpY2soKVxyXG4gICAgc2V0U3RhdGUocHJldiA9PiAhcHJldik7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdlxyXG4gICAgICBvbkNsaWNrPXt0b2dnbGV9XHJcbiAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxyXG4gICAgICAgIGp1c3RpZnlDb250ZW50OidjZW50ZXInLFxyXG4gICAgICAgIG1hcmdpbjogMVxyXG4gICAgICB9fVxyXG4gICAgPlxyXG4gICAgICA8SWNvblN0YXRlIG9wZW49e3N0YXRlfSAvPlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgYWN0aW9uVHlwZXMgZnJvbSAnLi9hY3Rpb25UeXBlcyc7XHJcbmltcG9ydCB2YWxpZGF0aW9uU3RhdGUgZnJvbSAnLi92YWxpZGF0aW9uU3RhdGVzJztcclxuXHJcbmV4cG9ydCBjb25zdCBpbml0U3RhdGUgPSB7IHZhbGlkYXRpb246IHt9IH07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZm9ybVJlZHVjZXIoc3RhdGUsIGFjdGlvbikge1xyXG4gIGxldCBuZXh0U3RhdGUgPSBudWxsO1xyXG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT046XHJcbiAgICAgIG5leHRTdGF0ZSA9IHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICB2YWxpZGF0aW9uOiB7XHJcbiAgICAgICAgICAuLi5zdGF0ZS52YWxpZGF0aW9uLFxyXG4gICAgICAgICAgW2FjdGlvbi52YWxpZGF0aW9uVHlwZV06IHtcclxuICAgICAgICAgICAgdmFsaWRhdGlvblN0YXRlOiBhY3Rpb24udmFsaWRhdGlvblN0YXRlLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBhY3Rpb24ubWVzc2FnZSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHJldHVybiBuZXh0U3RhdGU7XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkNMSUVOVF9WQUxJREFUSU9OOlxyXG4gICAgICBuZXh0U3RhdGUgPSB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgdmFsaWRhdGlvbjoge1xyXG4gICAgICAgICAgLi4uc3RhdGUudmFsaWRhdGlvbixcclxuXHJcbiAgICAgICAgICBbYWN0aW9uLnZhbGlkYXRpb25UeXBlXToge1xyXG4gICAgICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IGFjdGlvbi52YWxpZGF0aW9uU3RhdGUsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IGFjdGlvbi5tZXNzYWdlLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICB9O1xyXG5cclxuICAgICAgcmV0dXJuIG5leHRTdGF0ZTtcclxuXHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlJFU0VUX1ZBTElEQVRJT05fU1RBVEU6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgdmFsaWRhdGlvbjoge1xyXG4gICAgICAgICAgLi4uc3RhdGUudmFsaWRhdGlvbixcclxuICAgICAgICAgIFthY3Rpb24udmFsaWRhdGlvblR5cGVdOiB7XHJcbiAgICAgICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOQUNUSVZFLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiAnJyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgfTtcclxuXHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLklOUFVUX0ZPQ1VTRUQ6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgdmFsaWRhdGlvbjoge1xyXG4gICAgICAgICAgLi4uc3RhdGUudmFsaWRhdGlvbixcclxuICAgICAgICAgIGZvcm1TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOQUNUSVZFLFxyXG4gICAgICAgICAgW2FjdGlvbi5wcm9wTmFtZV06IHtcclxuICAgICAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5BQ1RJVkUsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5JTklUX0ZPUk1fVkFMSURBVElPTl9TVEFURTpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICB2YWxpZGF0aW9uOiB7XHJcbiAgICAgICAgICAuLi5zdGF0ZS52YWxpZGF0aW9uLFxyXG4gICAgICAgICAgZm9ybVN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5BQ1RJVkUsXHJcbiAgICAgICAgfSxcclxuICAgICAgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuSU5DX0lOUFVUX0NPVVROOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgY291bnQ6IHN0YXRlLmNvdW50ICsgMSB9O1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlUmVkdWNlciwgdXNlQ29udGV4dCwgdXNlU3RhdGUsIHVzZU1lbW8gfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgeyBmb3JtUmVkdWNlciwgaW5pdFN0YXRlIH0gZnJvbSAnLi9mb3JtUmVkdWNlcic7XHJcbmNvbnN0IEZvcm1Db250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVzZUZvcm1Db250ZXh0KCkge1xyXG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KEZvcm1Db250ZXh0KTtcclxuICBpZiAoIWNvbnRleHQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcigndXNlRm9ybUNvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggQXBwUHJvdmlkZXInKTtcclxuICB9XHJcbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSBjb250ZXh0O1xyXG5cclxuICByZXR1cm4geyBzdGF0ZSwgZGlzcGF0Y2ggfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEZvcm1Qcm92aWRlcihwcm9wcykge1xyXG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlUmVkdWNlcihmb3JtUmVkdWNlciwgaW5pdFN0YXRlKTtcclxuICBjb25zdCB2YWx1ZSA9IHVzZU1lbW8oKCkgPT4gW3N0YXRlLCBkaXNwYXRjaF0sIFtzdGF0ZV0pO1xyXG4gIHJldHVybiA8Rm9ybUNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfSB7Li4ucHJvcHN9IC8+O1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0ICogYXMgYWN0aW9ucyBmcm9tICcuL2FjdGlvbnMnO1xyXG5pbXBvcnQgdmFsaWRhdGlvblN0YXRlcyBmcm9tICcuL3ZhbGlkYXRpb25TdGF0ZXMnO1xyXG5pbXBvcnQgeyBpc0NsaWVudFZhbGlkYXRpb25UeXBlIH0gZnJvbSAnLi9jb25zdHJhaW50VmFsaWRhdG9ycyc7XHJcbmltcG9ydCBFeWVJY29uIGZyb20gJy4vRXllSWNvbic7XHJcbmltcG9ydCB7IHVzZUZvcm1Db250ZXh0IH0gZnJvbSAnLi9mb3JtLWNvbnRleHQnO1xyXG5mdW5jdGlvbiBWYWxpZGl0eUljb24oeyB2YWxpZCB9KSB7XHJcbiAgbGV0IHN0YXRlQ29sb3IgPSAnIzRmYzNmNyc7XHJcbiAgc3dpdGNoICh2YWxpZCkge1xyXG4gICAgY2FzZSB2YWxpZGF0aW9uU3RhdGVzLlZBTElEOlxyXG4gICAgICBzdGF0ZUNvbG9yID0gJ2dyZWVuJztcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRDpcclxuICAgICAgc3RhdGVDb2xvciA9ICdyZWQnO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgdmFsaWRhdGlvblN0YXRlcy5JTkFDVElWRTpcclxuICAgICAgc3RhdGVDb2xvciA9ICcjNGZjM2Y3JztcclxuICAgICAgYnJlYWs7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICBzdGF0ZUNvbG9yID0gJyM0ZmMzZjcnO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgc3R5bGU9e3tcclxuICAgICAgICBmbGV4OiAxLFxyXG4gICAgICAgIGNvbG9yOiBzdGF0ZUNvbG9yLFxyXG4gICAgICAgIGxpbmVIZWlnaHQ6IDIsXHJcbiAgICAgICAgd2lkdGg6IDIwLFxyXG4gICAgICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXHJcbiAgICAgIH19XHJcbiAgICA+XHJcbiAgICAgIHt2YWxpZCA/ICfinJMnIDogJ+KYkyd9XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcblxyXG5jb25zdCBzdHlsZSA9IHtcclxuICBpbnB1dDoge1xyXG4gICAgbWFyZ2luOiAxLFxyXG4gICAgYm9yZGVyOiAnMXB4IHNvbGlkJyxcclxuICAgIHBhZGRpbmc6IDgsXHJcbiAgICBmbGV4OiAxMCxcclxuICAgIGJvcmRlclJhZGl1czogMixcclxuICB9LFxyXG4gIHJvb3Q6IHtcclxuICAgIGJvcmRlclJhZGl1czogMixcclxuICAgIG1hcmdpbjogMyxcclxuICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxyXG4gICAgYmFja2dyb3VuZENvbG9yOiAnd2hpdGUnLFxyXG4gICAgYm9yZGVyOiAnMXB4IHNvbGlkIHdoaXRlJyxcclxuICAgIG1hcmdpbkJvdHRvbTogMSxcclxuICB9LFxyXG4gIGlucHV0Q29udGFpbmVyOiB7XHJcbiAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICBmbGV4OiAxLFxyXG4gIH0sXHJcbiAgbWVzc2FnZToge1xyXG4gICAgY29sb3I6ICdyZWQnLFxyXG4gICAgcGFkZGluZ0xlZnQ6IDMsXHJcbiAgfSxcclxufTtcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSW5wdXQoe1xyXG4gIHBsYWNlaG9sZGVyLFxyXG4gIHR5cGUsXHJcbiAgbmFtZSxcclxuICBvbkNoYW5nZSxcclxuICB2YWx1ZSA9ICcnLFxyXG4gIHZhbGlkYXRpb25UeXBlcyA9IFtdLFxyXG4gIGlkLFxyXG59KSB7XHJcbiAgY29uc3QgeyBzdGF0ZSwgZGlzcGF0Y2ggfSA9IHVzZUZvcm1Db250ZXh0KCk7XHJcblxyXG4gIGNvbnN0IFtpbnB1dFZhbGlkYXRpb24sIHNldElucHV0VmFsaWRhdGlvbl0gPSB1c2VTdGF0ZSh7XHJcbiAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5BQ1RJVkUsXHJcbiAgICBtZXNzYWdlOiAnJyxcclxuICAgIHZhbGlkYXRpb25UeXBlOiB1bmRlZmluZWQsXHJcbiAgfSk7XHJcblxyXG4gIGNvbnN0IFtpbnB1dFR5cGUsIHNldElucHV0VHlwZV0gPSB1c2VTdGF0ZSh0eXBlKTtcclxuXHJcbiAgY29uc3QgW2JvcmRlckNvbG9yLCBzZXRCb3JkZXJDb2xvcl0gPSB1c2VTdGF0ZSgnJyk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAoXHJcbiAgICAgIGlucHV0VmFsaWRhdGlvbiAmJlxyXG4gICAgICBpbnB1dFZhbGlkYXRpb24udmFsaWRhdGlvblN0YXRlID09PSB2YWxpZGF0aW9uU3RhdGVzLlZBTElEXHJcbiAgICApIHtcclxuICAgICAgc2V0Qm9yZGVyQ29sb3IoJ2dyZWVuJyk7XHJcbiAgICB9XHJcbiAgICBpZiAoXHJcbiAgICAgIGlucHV0VmFsaWRhdGlvbiAmJlxyXG4gICAgICBpbnB1dFZhbGlkYXRpb24udmFsaWRhdGlvblN0YXRlID09PSB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSURcclxuICAgICkge1xyXG4gICAgICBzZXRCb3JkZXJDb2xvcigncmVkJyk7XHJcbiAgICB9XHJcbiAgICBpZiAoXHJcbiAgICAgIGlucHV0VmFsaWRhdGlvbiAmJlxyXG4gICAgICBpbnB1dFZhbGlkYXRpb24udmFsaWRhdGlvblN0YXRlID09PSB2YWxpZGF0aW9uU3RhdGVzLklOQUNUSVZFXHJcbiAgICApIHtcclxuICAgICAgc2V0Qm9yZGVyQ29sb3IoJyM0ZmMzZjcnKTtcclxuICAgIH1cclxuICB9LCBbaW5wdXRWYWxpZGF0aW9uXSk7XHJcbiAgZnVuY3Rpb24gaGFuZGxlRm9jdXMoKSB7XHJcbiAgICB2YWxpZGF0aW9uVHlwZXMuZm9yRWFjaCgodmFsaWRhdGlvbk5hbWUpID0+IHtcclxuICAgICAgaWYgKHN0YXRlLmZvcm0udmFsaWRhdGlvblt2YWxpZGF0aW9uTmFtZV0pIHtcclxuICAgICAgICBkaXNwYXRjaChcclxuICAgICAgICAgIGFjdGlvbnMucmVzZXRJbnB1dFZhbGlkYXRpb25TdGF0ZSh7IHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uTmFtZSB9KVxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuICBmdW5jdGlvbiBoYW5kbGVCbHVyKCkge1xyXG4gICAgdmFsaWRhdGlvblR5cGVzLmZvckVhY2goKHZhbGlkYXRpb25OYW1lKSA9PiB7XHJcbiAgICAgIGlmIChpc0NsaWVudFZhbGlkYXRpb25UeXBlKHsgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25OYW1lIH0pKSB7XHJcbiAgICAgICAgZGlzcGF0Y2goXHJcbiAgICAgICAgICBhY3Rpb25zLmNsaWVudFZhbGlkYXRpb24oe1xyXG4gICAgICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvbk5hbWUsXHJcbiAgICAgICAgICAgIHZhbHVlLFxyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiB0b2dnbGVFeWUoKSB7XHJcbiAgICBpZiAoaW5wdXRUeXBlID09PSAncGFzc3dvcmQnKSB7XHJcbiAgICAgIHNldElucHV0VHlwZSgndGV4dCcpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc2V0SW5wdXRUeXBlKCdwYXNzd29yZCcpO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17c3R5bGUucm9vdH0+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlLmlucHV0Q29udGFpbmVyfT5cclxuICAgICAgICA8aW5wdXRcclxuICAgICAgICAgIHN0eWxlPXt7IC4uLnN0eWxlLmlucHV0LCBib3JkZXJDb2xvciB9fVxyXG4gICAgICAgICAgdHlwZT17aW5wdXRUeXBlfVxyXG4gICAgICAgICAgbmFtZT17bmFtZX1cclxuICAgICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cclxuICAgICAgICAgIHZhbHVlPXt2YWx1ZX1cclxuICAgICAgICAgIG9uQmx1cj17aGFuZGxlQmx1cn1cclxuICAgICAgICAgIHBsYWNlaG9sZGVyPXtwbGFjZWhvbGRlcn1cclxuICAgICAgICAgIG9uRm9jdXM9e2hhbmRsZUZvY3VzfVxyXG4gICAgICAgICAgZGF0YS10ZXN0aWQ9e2lkfVxyXG4gICAgICAgIC8+XHJcbiAgICAgICAge3ZhbGlkYXRpb25UeXBlcy5tYXAoKHZhbGlkYXRpb25OYW1lKSA9PiB7XHJcbiAgICAgICAgICBpZiAoc3RhdGUudmFsaWRhdGlvblt2YWxpZGF0aW9uTmFtZV0pIHtcclxuICAgICAgICAgICAgY29uc3QgeyB2YWxpZGF0aW9uU3RhdGUgfSA9IHN0YXRlLnZhbGlkYXRpb25bdmFsaWRhdGlvbk5hbWVdO1xyXG4gICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgdmFsaWRhdGlvblN0YXRlID09PSB2YWxpZGF0aW9uU3RhdGVzLlZBTElEIHx8XHJcbiAgICAgICAgICAgICAgdmFsaWRhdGlvblN0YXRlID09PSB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSURcclxuICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgIDxWYWxpZGl0eUljb24ga2V5PXt2YWxpZGF0aW9uTmFtZX0gdmFsaWQ9e3ZhbGlkYXRpb25TdGF0ZX0gLz5cclxuICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pfVxyXG4gICAgICAgIHt0eXBlID09PSAncGFzc3dvcmQnICYmIDxFeWVJY29uIG9uQ2xpY2s9e3RvZ2dsZUV5ZX0gLz59XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICB7dmFsaWRhdGlvblR5cGVzLm1hcCgodmFsaWRhdGlvbk5hbWUpID0+IHtcclxuICAgICAgICBpZiAoc3RhdGUudmFsaWRhdGlvblt2YWxpZGF0aW9uTmFtZV0pIHtcclxuICAgICAgICAgIGNvbnN0IHsgbWVzc2FnZSB9ID0gc3RhdGUudmFsaWRhdGlvblt2YWxpZGF0aW9uTmFtZV07XHJcbiAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGtleT17dmFsaWRhdGlvbk5hbWV9IHN0eWxlPXtzdHlsZS5tZXNzYWdlfT5cclxuICAgICAgICAgICAgICB7bWVzc2FnZSAhPT0gJycgJiYgKFxyXG4gICAgICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgICAgICByb2xlPVwibWVzc2FnZVwiXHJcbiAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPXtgbWVzc2FnZS0ke25hbWV9YH1cclxuICAgICAgICAgICAgICAgID57YCogJHttZXNzYWdlfWB9PC9kaXY+XHJcbiAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgfSl9XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7aH0gZnJvbSAncHJlYWN0JztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEJ1dHRvbih7IG9uQ2xpY2ssIHRpdGxlLCBkaXNhYmxlZCwgaWQgfSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8YnV0dG9uXHJcbiAgICAgIGRhdGEtdGVzdGlkPXtpZH1cclxuICAgICAgZGlzYWJsZWQ9e2Rpc2FibGVkfVxyXG4gICAgICBzdHlsZT17eyBib3JkZXJSYWRpdXM6IDIsIGhlaWdodDogMzMgfX1cclxuICAgICAgb25DbGljaz17b25DbGlja31cclxuICAgID5cclxuICAgICAge3RpdGxlfVxyXG4gICAgPC9idXR0b24+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0ICogYXMgdmFsaWRhdGlvbkFjdGlvbnMgZnJvbSAnLi9hY3Rpb25zJztcclxuaW1wb3J0IHsgRm9ybVByb3ZpZGVyIH0gZnJvbSAnLi9mb3JtLWNvbnRleHQnO1xyXG5jb25zdCBzdHlsZSA9IHtcclxuICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXHJcbiAgd2lkdGg6IDMwMCxcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEZvcm0oeyBjaGlsZHJlbiwgZm9ybVRpdGxlLCBlcnJvciB9KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxGb3JtUHJvdmlkZXI+XHJcbiAgICAgIDxmaWVsZHNldCBzdHlsZT17c3R5bGV9PlxyXG4gICAgICAgIDxsZWdlbmQ+e2Zvcm1UaXRsZX06PC9sZWdlbmQ+XHJcbiAgICAgICAge2NoaWxkcmVufVxyXG4gICAgICAgIHtlcnJvciAmJiAoXHJcbiAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgY29sb3I6ICdyZWQnLFxyXG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJ3doaXRlJyxcclxuICAgICAgICAgICAgICBwYWRkaW5nOiA1LFxyXG4gICAgICAgICAgICAgIGJvcmRlclJhZGl1czogNSxcclxuICAgICAgICAgICAgfX1cclxuICAgICAgICAgID5cclxuICAgICAgICAgICAgKiB7ZXJyb3IubWVzc2FnZX1cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICl9XHJcbiAgICAgIDwvZmllbGRzZXQ+XHJcbiAgICA8L0Zvcm1Qcm92aWRlcj5cclxuICApO1xyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IHtcclxuICBWQUxVRV9DSEFOR0VEOiAnVkFMVUVfQ0hBTkdFRCcsXHJcbiAgTE9HSU5fU1RBUlRFRDogJ0xPR0lOX1NUQVJURUQnLFxyXG4gIExPR0lOX1NVQ0NFU1M6ICdMT0dJTl9TVUNDRVNTJyxcclxuICBMT0dJTl9GQUlMRUQ6ICdMT0dJTl9GQUlMRUQnLFxyXG5cclxuICBMT0dPVVRfU1RBUlRFRDogJ0xPR09VVF9TVEFSVEVEJyxcclxuICBMT0dPVVRfRkFJTEVEOiAnTE9HT1VUX0ZBSUxFRCcsXHJcbiAgTE9HT1VUX1NVQ0NFU1M6ICdMT0dPVVRfU1VDQ0VTUycsXHJcblxyXG4gIFNJR05VUF9TVEFSVEVEOiAnU0lHTlVQX1NUQVJURUQnLFxyXG4gIFNJR05VUF9TVUNDRVNTOiAnU0lHTlVQX1NVQ0NFU1MnLFxyXG4gIFNJR05VUF9GQUlMRUQ6ICdTSUdOVVBfRkFJTEVEJyxcclxuXHJcbiAgQ0hBTkdFX1BBU1NXT1JEX1NUQVJURUQ6ICdDSEFOR0VfUEFTU1dPUkRfU1RBUlRFRCcsXHJcbiAgQ0hBTkdFX1BBU1NXT1JEX1NVQ0NFU1M6ICdDSEFOR0VfUEFTU1dPUkRfU1VDQ0VTUycsXHJcbiAgQ0hBTkdFX1BBU1NXT1JEX0ZBSUxFRDogJ0NIQU5HRV9QQVNTV09SRF9GQUlMRUQnLFxyXG5cclxuICBSRVFVRVNUX1BBU1NfQ0hBTkdFX1NUQVJURUQ6ICdSRVFVRVNUX1BBU1NfQ0hBTkdFX1NUQVJURUQnLFxyXG4gIFJFUVVFU1RfUEFTU19DSEFOR0VfU1VDQ0VTUzogJ1JFUVVFU1RfUEFTU19DSEFOR0VfU1VDQ0VTUycsXHJcbiAgUkVRVUVTVF9QQVNTX0NIQU5HRV9GQUlMRUQ6ICdSRVFVRVNUX1BBU1NfQ0hBTkdFX0ZBSUxFRCcsXHJcbiAgR09UX1RPS0VOX0ZST01fVVJMOiAnR09UX1RPS0VOX0ZST01fVVJMJyxcclxufTtcclxuIiwiaW1wb3J0IGFjdGlvblR5cGVzIGZyb20gJy4vYWN0aW9uVHlwZXMnO1xyXG5pbXBvcnQgeyBzZXJ2ZXJWYWxpZGF0aW9uIH0gZnJvbSAnLi4vZm9ybS9hY3Rpb25zJztcclxuaW1wb3J0IGh0dHBTdGF0dXMgZnJvbSAnLi4vZm9ybS9odHRwLXN0YXR1cyc7XHJcbmV4cG9ydCBmdW5jdGlvbiB2YWx1ZUNoYW5nZWQoeyBwcm9wTmFtZSwgdmFsdWUgfSkge1xyXG4gIHJldHVybiB7XHJcbiAgICB0eXBlOiBhY3Rpb25UeXBlcy5WQUxVRV9DSEFOR0VELFxyXG4gICAgcGF5bG9hZDoge1xyXG4gICAgICBwcm9wTmFtZSxcclxuICAgICAgdmFsdWUsXHJcbiAgICB9LFxyXG4gIH07XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsb2dpbih7IGRpc3BhdGNoLCBzdGF0ZSB9KSB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHsgZW1haWxvcnVzZXJuYW1lLCBwYXNzd29yZCB9ID0gc3RhdGU7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkxPR0lOX1NUQVJURUQgfSk7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxyXG4gICAgICBgJHtwcm9jZXNzLmVudi5SRUFDVF9BUFBfWEFGX1NFUlZFUl9VUkx9L2F1dGgvbG9naW5gLFxyXG4gICAgICB7XHJcbiAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgJ0NvbnRlbi1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxyXG4gICAgICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnOiAnKicsXHJcbiAgICAgICAgICBBdXRob3JpemF0aW9uOiAnQmFzaWMgJyArIGJ0b2EoYCR7ZW1haWxvcnVzZXJuYW1lfToke3Bhc3N3b3JkfWApLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgfVxyXG4gICAgKTtcclxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkxPR0lOX1NVQ0NFU1MsIHRva2VuOiByZXN1bHQudG9rZW4gfSk7XHJcbiAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDAwKSB7XHJcbiAgICAgIGNvbnN0IHsgZXJyb3JzIH0gPSByZXN1bHQ7XHJcblxyXG4gICAgICBlcnJvcnMuZm9yRWFjaCgoZXJyb3IpID0+IHtcclxuICAgICAgICBkaXNwYXRjaChcclxuICAgICAgICAgIHNlcnZlclZhbGlkYXRpb24oe1xyXG4gICAgICAgICAgICBzdGF0dXM6IGVycm9yLFxyXG4gICAgICAgICAgfSlcclxuICAgICAgICApO1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignTG9naW4gZmFpbGVkJyk7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTE9HSU5fRkFJTEVELCBwYXlsb2FkOiB7IGVycm9yIH0gfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2lnbnVwKHsgZGlzcGF0Y2gsIHN0YXRlIH0pIHtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNJR05VUF9TVEFSVEVEIH0pO1xyXG4gIGNvbnN0IHsgZW1haWwsIHBhc3N3b3JkLCB1c2VybmFtZSB9ID0gc3RhdGU7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXHJcbiAgICAgIGAke3Byb2Nlc3MuZW52LlJFQUNUX0FQUF9YQUZfU0VSVkVSX1VSTH0vYXV0aC9zaWdudXBgLFxyXG4gICAgICB7XHJcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBwYXNzd29yZCwgZW1haWwsIHVzZXJuYW1lIH0pLFxyXG4gICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgIENvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsXHJcbiAgICAgICAgICBBY2NlcHQ6ICdhcHBsaWNhdGlvbi9qc29uJyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICB9XHJcbiAgICApO1xyXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0lHTlVQX1NVQ0NFU1MsIHRva2VuOiByZXN1bHQudG9rZW4gfSk7XHJcbiAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDAwKSB7XHJcbiAgICAgIGNvbnN0IHsgZXJyb3JzIH0gPSByZXN1bHQ7XHJcbiAgICAgIGVycm9ycy5mb3JFYWNoKChlcnJvcikgPT4ge1xyXG4gICAgICAgIGRpc3BhdGNoKFxyXG4gICAgICAgICAgc2VydmVyVmFsaWRhdGlvbih7XHJcbiAgICAgICAgICAgIHN0YXR1czogZXJyb3IsXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdTaWdudXAgZmFpbGVkJyk7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0lHTlVQX0ZBSUxFRCwgcGF5bG9hZDogeyBlcnJvciB9IH0pO1xyXG4gIH1cclxufVxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbG9nb3V0KHsgZGlzcGF0Y2gsIHN0YXRlIH0pIHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgeyB0b2tlbiB9ID0gc3RhdGU7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxyXG4gICAgICBgJHtwcm9jZXNzLmVudi5SRUFDVF9BUFBfWEFGX1NFUlZFUl9VUkx9L2F1dGgvbG9nb3V0P2AgK1xyXG4gICAgICAgIG5ldyBVUkxTZWFyY2hQYXJhbXMoeyB0b2tlbiB9KVxyXG4gICAgKTtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTE9HT1VUX1NUQVJURUQgfSk7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTE9HT1VUX0ZBSUxFRCwgZXJyb3IgfSk7XHJcbiAgfVxyXG59XHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjaGFuZ2VQYXNzd29yZCh7IGRpc3BhdGNoLCBzdGF0ZSB9KSB7XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfU1RBUlRFRCB9KTtcclxuICB0cnkge1xyXG4gICAgY29uc3QgeyBjb25maXJtLCBwYXNzd29yZCwgdG9rZW4sIGVtYWlsb3J1c2VybmFtZSwgY3VycmVudCB9ID0gc3RhdGU7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxyXG4gICAgICBgJHtwcm9jZXNzLmVudi5SRUFDVF9BUFBfWEFGX1NFUlZFUl9VUkx9L2F1dGgvY2hhbmdlcGFzc2AsXHJcbiAgICAgIHtcclxuICAgICAgICBtZXRob2Q6ICdwdXQnLFxyXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgIGNvbmZpcm0sXHJcbiAgICAgICAgICBwYXNzd29yZCxcclxuICAgICAgICAgIGN1cnJlbnQsXHJcbiAgICAgICAgICB0b2tlbixcclxuICAgICAgICAgIGVtYWlsb3J1c2VybmFtZSxcclxuICAgICAgICB9KSxcclxuICAgICAgfVxyXG4gICAgKTtcclxuXHJcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgZGlzcGF0Y2goe1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLkNIQU5HRV9QQVNTV09SRF9TVUNDRVNTLFxyXG4gICAgICAgIHRva2VuOiByZXN1bHQudG9rZW4sXHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDQwMCkge1xyXG4gICAgICBjb25zdCB7IGVycm9ycyB9ID0gcmVzdWx0O1xyXG4gICAgICBlcnJvcnMuZm9yRWFjaCgoZXJyb3IpID0+IHtcclxuICAgICAgICBkaXNwYXRjaChcclxuICAgICAgICAgIHNlcnZlclZhbGlkYXRpb24oe1xyXG4gICAgICAgICAgICBzdGF0dXM6IGVycm9yLFxyXG4gICAgICAgICAgfSlcclxuICAgICAgICApO1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA1MDApIHtcclxuICAgICAgY29uc3QgeyBlcnJvciB9ID0gcmVzdWx0O1xyXG5cclxuICAgICAgZGlzcGF0Y2goe1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLkNIQU5HRV9QQVNTV09SRF9GQUlMRUQsXHJcbiAgICAgICAgZXJyb3I6IGVycm9yLFxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2hhbmdpbmcgcGFzc3dvcmQgZmFpbGVkJyk7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGRpc3BhdGNoKHtcclxuICAgICAgdHlwZTogYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX0ZBSUxFRCxcclxuICAgICAgcGF5bG9hZDogeyBlcnJvciB9LFxyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZm9yZ290UGFzc3dvcmQoeyBkaXNwYXRjaCwgc3RhdGUgfSkge1xyXG4gIHRyeSB7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlJFUVVFU1RfUEFTU19DSEFOR0VfU1RBUlRFRCB9KTtcclxuICAgIGNvbnN0IHsgZW1haWwgfSA9IHN0YXRlO1xyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCgnL3JlcXVlc3RwYXNzY2hhbmdlJywge1xyXG4gICAgICBtZXRob2Q6ICdwb3N0JyxcclxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBlbWFpbCB9KSxcclxuICAgIH0pO1xyXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgIGRpc3BhdGNoKHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfU1VDQ0VTUyxcclxuICAgICAgICB0b2tlbjogcmVzdWx0LnRva2VuLFxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MDApIHtcclxuICAgICAgY29uc3QgeyBlcnJvcnMgfSA9IHJlc3VsdDtcclxuICAgICAgZXJyb3JzLmZvckVhY2goKGVycm9yKSA9PiB7XHJcbiAgICAgICAgZGlzcGF0Y2goXHJcbiAgICAgICAgICBzZXJ2ZXJWYWxpZGF0aW9uKHtcclxuICAgICAgICAgICAgc3RhdHVzOiBlcnJvcixcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNTAwKSB7XHJcbiAgICAgIGNvbnN0IHsgZXJyb3IgfSA9IHJlc3VsdDtcclxuXHJcbiAgICAgIGRpc3BhdGNoKHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfRkFJTEVELFxyXG4gICAgICAgIGVycm9yOiBlcnJvcixcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NoYW5naW5nIHBhc3N3b3JkIGZhaWxlZCcpO1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBkaXNwYXRjaCh7XHJcbiAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlJFUVVFU1RfUEFTU19DSEFOR0VfRkFJTEVELFxyXG4gICAgICBwYXlsb2FkOiB7IGVycm9yOiBlcnIgfSxcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFRva2VuRnJvbVVybCh7IHRva2VuIH0pIHtcclxuICByZXR1cm4ge1xyXG4gICAgdHlwZTogYWN0aW9uVHlwZXMuR09UX1RPS0VOX0ZST01fVVJMLFxyXG4gICAgdG9rZW4sXHJcbiAgfTtcclxufVxyXG4iXSwibmFtZXMiOlsic3R5bGVJbmplY3QiLCJjc3MiLCJyZWYiLCJpbnNlcnRBdCIsImRvY3VtZW50IiwiaGVhZCIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwic3R5bGUiLCJjcmVhdGVFbGVtZW50IiwidHlwZSIsImZpcnN0Q2hpbGQiLCJpbnNlcnRCZWZvcmUiLCJhcHBlbmRDaGlsZCIsInN0eWxlU2hlZXQiLCJjc3NUZXh0IiwiY3JlYXRlVGV4dE5vZGUiLCJWQUxJRCIsIklOVkFMSUQiLCJJTkFDVElWRSIsIkVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OIiwiUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT04iLCJVU0VSTkFNRV9GT1JNQVRfVkFMSURBVElPTiIsIlVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OIiwiRU1QVFlfU1RSSU5HX1ZBTElEQVRJT04iLCJQQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTiIsIklOVkFMSURfQ1JFREVOVElBTFMiLCJVU0VSTkFNRV9UQUtFTiIsIlJFR0lTVEVSRURfRU1BSUwiLCJFTUFJTF9OT1RfUkVHSVNURVJFRCIsIlVTRVJOQU1FX05PVF9SRUdJU1RFUkVEIiwiSU5WQUxJRF9QQVNTV09SRCIsIklOVkFMSURfRU1BSUwiLCJJTlZBTElEX1VTRVJOQU1FIiwiSU5WQUxJRF9FTVBUWV9TVFJJTkciLCJJTlZBTElEX1VTRVJOQU1FX09SX0VNQUlMIiwiUEFTU1dPUkRTX0RPX05PVF9NQVRDSCIsInBhc3N3b3JkUmVnZXgiLCJlbWFpbFJlZ2V4IiwidXNlcm5hbWVSZWdleCIsInZhbGlkYXRlRW1haWxDb25zdHJhaW50IiwiZW1haWwiLCJlbWFpbENvbnN0cmFpbnQiLCJSZWdFeHAiLCJ0ZXN0IiwidmFsaWRhdGlvblR5cGUiLCJ2YWxpZGF0aW9uVHlwZXMiLCJ2YWxpZGF0aW9uU3RhdGUiLCJtZXNzYWdlIiwidmFsaWRhdGlvbk1lc3NhZ2VzIiwiaXNDbGllbnRWYWxpZGF0aW9uVHlwZSIsInZhbGlkYXRlUGFzc3dvcmRDb25zdHJhaW50IiwicGFzc3dvcmQiLCJwYXNzd29yZENvbnN0cmFpbnQiLCJ2YWxpZGF0ZVVzZXJOYW1lQ29uc3RyYWludCIsInVzZXJuYW1lIiwidXNlcm5hbWVDb25zdHJhaW50IiwidmFsaWRhdGVFbWFpbE9yVXNlcm5hbWUiLCJ2YWx1ZSIsInZhbGlkYXRlRW1wdHlTdHJpbmciLCJsZW5ndGgiLCJ2YWxpZGF0ZVBhc3N3b3JkTWF0Y2giLCJzdGF0ZSIsImNvbmZpcm0iLCJhdXRoIiwiSU5JVF9GT1JNX1ZBTElEQVRJT05fU1RBVEUiLCJSRVNFVF9WQUxJREFUSU9OX1NUQVRFIiwiSU5QVVRfQkxVUlJFRCIsIklOUFVUX0ZPQ1VTRUQiLCJTRVJWRVJfVkFMSURBVElPTiIsIkNMSUVOVF9WQUxJREFUSU9OIiwiSU5DX0lOUFVUX0NPVVROIiwiY3JlZGVudGlhbEludmFsaWQiLCJ1c2VybmFtZUlzVGFrZW4iLCJlbWFpbElzUmVnaXN0ZXJlZCIsInVzZXJuYW1lSW52YWxpZCIsInBhc3N3b3JkSW52YWxpZCIsImVtYWlsSW52YWxpZCIsImVtYWlsSXNOb3RSZWdpc3RlcmVkIiwiZW1wdHlTdHJpbmdOb3RWYWxpZCIsImVtYWlsb3J1c2VybmFtZU5vdFZhbGlkIiwidXNlcm5hbWVJc05vdFJlZ2lzdGVyZWQiLCJwYXNzd29yZERvTm90TWF0Y2giLCJ0b2tlbkV4cGlyZWQiLCJzZXJ2ZXJWYWxpZGF0aW9uUmFuZ2UiLCJzdGF0dXMiLCJjbGllbnRWYWxpZGF0aW9uIiwidmFsaWRhdGlvbiIsImNvbnN0VmFsVHlwZXMiLCJ2YWxpZGF0aW9ucyIsImFjdGlvblR5cGVzIiwicmVzZXRJbnB1dFZhbGlkYXRpb25TdGF0ZSIsInNlcnZlclZhbGlkYXRpb24iLCJodHRwU3RhdHVzIiwidmFsaWRhdGlvblN0YXRlcyIsImltZyIsIkljb25TdGF0ZSIsIm9wZW4iLCJvcGVuSWNvbiIsImNsb3NlSWNvbiIsIkV5ZUljb24iLCJvbkNsaWNrIiwic2V0U3RhdGUiLCJ1c2VTdGF0ZSIsInRvZ2dsZSIsInByZXYiLCJkaXNwbGF5IiwiYWxpZ25JdGVtcyIsImp1c3RpZnlDb250ZW50IiwibWFyZ2luIiwiaW5pdFN0YXRlIiwiZm9ybVJlZHVjZXIiLCJhY3Rpb24iLCJuZXh0U3RhdGUiLCJmb3JtU3RhdGUiLCJwcm9wTmFtZSIsImNvdW50IiwiRm9ybUNvbnRleHQiLCJjcmVhdGVDb250ZXh0IiwidXNlRm9ybUNvbnRleHQiLCJjb250ZXh0IiwidXNlQ29udGV4dCIsIkVycm9yIiwiZGlzcGF0Y2giLCJGb3JtUHJvdmlkZXIiLCJwcm9wcyIsInVzZVJlZHVjZXIiLCJ1c2VNZW1vIiwiVmFsaWRpdHlJY29uIiwidmFsaWQiLCJzdGF0ZUNvbG9yIiwiZmxleCIsImNvbG9yIiwibGluZUhlaWdodCIsIndpZHRoIiwidGV4dEFsaWduIiwiaW5wdXQiLCJib3JkZXIiLCJwYWRkaW5nIiwiYm9yZGVyUmFkaXVzIiwicm9vdCIsImZsZXhEaXJlY3Rpb24iLCJiYWNrZ3JvdW5kQ29sb3IiLCJtYXJnaW5Cb3R0b20iLCJpbnB1dENvbnRhaW5lciIsInBhZGRpbmdMZWZ0IiwiSW5wdXQiLCJwbGFjZWhvbGRlciIsIm5hbWUiLCJvbkNoYW5nZSIsImlkIiwiaW5wdXRWYWxpZGF0aW9uIiwic2V0SW5wdXRWYWxpZGF0aW9uIiwidW5kZWZpbmVkIiwiaW5wdXRUeXBlIiwic2V0SW5wdXRUeXBlIiwiYm9yZGVyQ29sb3IiLCJzZXRCb3JkZXJDb2xvciIsInVzZUVmZmVjdCIsImhhbmRsZUZvY3VzIiwiZm9yRWFjaCIsInZhbGlkYXRpb25OYW1lIiwiZm9ybSIsImFjdGlvbnMiLCJoYW5kbGVCbHVyIiwidG9nZ2xlRXllIiwibWFwIiwiQnV0dG9uIiwidGl0bGUiLCJkaXNhYmxlZCIsImhlaWdodCIsIkZvcm0iLCJjaGlsZHJlbiIsImZvcm1UaXRsZSIsImVycm9yIiwiVkFMVUVfQ0hBTkdFRCIsIkxPR0lOX1NUQVJURUQiLCJMT0dJTl9TVUNDRVNTIiwiTE9HSU5fRkFJTEVEIiwiTE9HT1VUX1NUQVJURUQiLCJMT0dPVVRfRkFJTEVEIiwiTE9HT1VUX1NVQ0NFU1MiLCJTSUdOVVBfU1RBUlRFRCIsIlNJR05VUF9TVUNDRVNTIiwiU0lHTlVQX0ZBSUxFRCIsIkNIQU5HRV9QQVNTV09SRF9TVEFSVEVEIiwiQ0hBTkdFX1BBU1NXT1JEX1NVQ0NFU1MiLCJDSEFOR0VfUEFTU1dPUkRfRkFJTEVEIiwiUkVRVUVTVF9QQVNTX0NIQU5HRV9TVEFSVEVEIiwiUkVRVUVTVF9QQVNTX0NIQU5HRV9TVUNDRVNTIiwiUkVRVUVTVF9QQVNTX0NIQU5HRV9GQUlMRUQiLCJHT1RfVE9LRU5fRlJPTV9VUkwiLCJ2YWx1ZUNoYW5nZWQiLCJwYXlsb2FkIiwibG9naW4iLCJlbWFpbG9ydXNlcm5hbWUiLCJyZXNwb25zZSIsImZldGNoIiwicHJvY2VzcyIsImVudiIsIlJFQUNUX0FQUF9YQUZfU0VSVkVSX1VSTCIsImhlYWRlcnMiLCJBdXRob3JpemF0aW9uIiwiYnRvYSIsIm1ldGhvZCIsInJlc3VsdCIsImpzb24iLCJ0b2tlbiIsImVycm9ycyIsInNpZ251cCIsImJvZHkiLCJKU09OIiwic3RyaW5naWZ5IiwiQ29udGVudFR5cGUiLCJBY2NlcHQiLCJjaGFuZ2VQYXNzd29yZCIsImN1cnJlbnQiLCJmb3Jnb3RQYXNzd29yZCIsImVyciJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxTQUFTQSxXQUFULENBQXFCQyxHQUFyQixFQUEwQkMsR0FBMUIsRUFBK0I7QUFDN0IsTUFBS0EsR0FBRyxLQUFLLEtBQUssQ0FBbEIsRUFBc0JBLEdBQUcsR0FBRyxFQUFOO0FBQ3RCLE1BQUlDLFFBQVEsR0FBR0QsR0FBRyxDQUFDQyxRQUFuQjs7QUFFQSxNQUFJLENBQUNGLEdBQUQsSUFBUSxPQUFPRyxRQUFQLEtBQW9CLFdBQWhDLEVBQTZDO0FBQUU7QUFBUzs7QUFFeEQsTUFBSUMsSUFBSSxHQUFHRCxRQUFRLENBQUNDLElBQVQsSUFBaUJELFFBQVEsQ0FBQ0Usb0JBQVQsQ0FBOEIsTUFBOUIsRUFBc0MsQ0FBdEMsQ0FBNUI7QUFDQSxNQUFJQyxLQUFLLEdBQUdILFFBQVEsQ0FBQ0ksYUFBVCxDQUF1QixPQUF2QixDQUFaO0FBQ0FELEVBQUFBLEtBQUssQ0FBQ0UsSUFBTixHQUFhLFVBQWI7O0FBRUEsTUFBSU4sUUFBUSxLQUFLLEtBQWpCLEVBQXdCO0FBQ3RCLFFBQUlFLElBQUksQ0FBQ0ssVUFBVCxFQUFxQjtBQUNuQkwsTUFBQUEsSUFBSSxDQUFDTSxZQUFMLENBQWtCSixLQUFsQixFQUF5QkYsSUFBSSxDQUFDSyxVQUE5QjtBQUNELEtBRkQsTUFFTztBQUNMTCxNQUFBQSxJQUFJLENBQUNPLFdBQUwsQ0FBaUJMLEtBQWpCO0FBQ0Q7QUFDRixHQU5ELE1BTU87QUFDTEYsSUFBQUEsSUFBSSxDQUFDTyxXQUFMLENBQWlCTCxLQUFqQjtBQUNEOztBQUVELE1BQUlBLEtBQUssQ0FBQ00sVUFBVixFQUFzQjtBQUNwQk4sSUFBQUEsS0FBSyxDQUFDTSxVQUFOLENBQWlCQyxPQUFqQixHQUEyQmIsR0FBM0I7QUFDRCxHQUZELE1BRU87QUFDTE0sSUFBQUEsS0FBSyxDQUFDSyxX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
