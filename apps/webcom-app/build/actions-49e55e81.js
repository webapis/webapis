import { v, h, M, T, m, s, _ as _extends, p } from './index-26ac3126.js';

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9ucy00OWU1NWU4MS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWluamVjdC9kaXN0L3N0eWxlLWluamVjdC5lcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL3ZhbGlkYXRpb25TdGF0ZXMuanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS92YWxpZGF0aW9uVHlwZXMuanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS92YWxpZGF0aW9uTWVzc2FnZXMuanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS92YWxpZGF0aW9uUmVnZXguanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS9jb25zdHJhaW50VmFsaWRhdG9ycy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL2FjdGlvblR5cGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vaHR0cC1zdGF0dXMuanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS9hY3Rpb25zLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vaWNvbnMvb3BlbkV5ZS5wbmciLCIuLi8uLi8uLi9jbGllbnQvZm9ybS9pY29ucy9jbG9zZUV5ZS5wbmciLCIuLi8uLi8uLi9jbGllbnQvZm9ybS9FeWVJY29uLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vZm9ybVJlZHVjZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS9mb3JtLWNvbnRleHQuanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS9JbnB1dC5qcyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL0J1dHRvbi5qcyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL0Zvcm0uanMiLCIuLi8uLi8uLi9jbGllbnQvYXV0aC9hY3Rpb25UeXBlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9hdXRoL2FjdGlvbnMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gc3R5bGVJbmplY3QoY3NzLCByZWYpIHtcbiAgaWYgKCByZWYgPT09IHZvaWQgMCApIHJlZiA9IHt9O1xuICB2YXIgaW5zZXJ0QXQgPSByZWYuaW5zZXJ0QXQ7XG5cbiAgaWYgKCFjc3MgfHwgdHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJykgeyByZXR1cm47IH1cblxuICB2YXIgaGVhZCA9IGRvY3VtZW50LmhlYWQgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgdmFyIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgc3R5bGUudHlwZSA9ICd0ZXh0L2Nzcyc7XG5cbiAgaWYgKGluc2VydEF0ID09PSAndG9wJykge1xuICAgIGlmIChoZWFkLmZpcnN0Q2hpbGQpIHtcbiAgICAgIGhlYWQuaW5zZXJ0QmVmb3JlKHN0eWxlLCBoZWFkLmZpcnN0Q2hpbGQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gIH1cblxuICBpZiAoc3R5bGUuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICBzdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBzdHlsZUluamVjdDtcbiIsImV4cG9ydCBkZWZhdWx0IHtcclxuICBWQUxJRDogJ1ZBTElEJyxcclxuICBJTlZBTElEOiAnSU5WQUxJRCcsXHJcbiAgSU5BQ1RJVkU6ICdJTkFDVElWRSdcclxufTtcclxuIiwiZXhwb3J0IGRlZmF1bHQge1xyXG4gIC8vY29uc3RyYWludFxyXG4gIEVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OOiAnRU1BSUxfRk9STUFUX1ZBTElEQVRJT04nLFxyXG4gIFBBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OOiAnUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT04nLFxyXG4gIFVTRVJOQU1FX0ZPUk1BVF9WQUxJREFUSU9OOiAnVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT04nLFxyXG4gIFVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OOiAnVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT04nLFxyXG4gIEVNUFRZX1NUUklOR19WQUxJREFUSU9OOiAnRU1QVFlfU1RSSU5HX1ZBTElEQVRJT04nLFxyXG4gIFBBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OOiAnUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT04nLFxyXG4gIC8vYXV0aFxyXG4gIElOVkFMSURfQ1JFREVOVElBTFM6ICdJTlZBTElEX0NSRURFTlRJQUxTJyxcclxuICBVU0VSTkFNRV9UQUtFTjogJ1VTRVJOQU1FX1RBS0VOJyxcclxuICBSRUdJU1RFUkVEX0VNQUlMOiAnUkVHSVNURVJFRF9FTUFJTCcsXHJcbiAgRU1BSUxfTk9UX1JFR0lTVEVSRUQ6ICdFTUFJTF9OT1RfUkVHSVNURVJFRCcsXHJcbiAgVVNFUk5BTUVfTk9UX1JFR0lTVEVSRUQ6J1VTRVJOQU1FX05PVF9SRUdJU1RFUkVEJ1xyXG59O1xyXG4iLCJleHBvcnQgZGVmYXVsdCB7XHJcbiAgSU5WQUxJRF9QQVNTV09SRDpcclxuICAgICdhdCBsZWFzdCA4IGNoYXJhY3RlcnMsIG11c3QgY29udGFpbiBhdCBsZWFzdCAxIHVwcGVyY2FzZSBsZXR0ZXIsIDEgbG93ZXJjYXNlIGxldHRlciwgQ2FuIGNvbnRhaW4gc3BlY2lhbCBjaGFyYWN0ZXJzJyxcclxuICBJTlZBTElEX0VNQUlMOiAnZW1haWwgZm9ybWF0IGlzIG5vdCB2YWxpZCcsXHJcbiAgRU1BSUxfTk9UX1JFR0lTVEVSRUQ6ICdlbWFpbCBpcyBub3QgcmVnaXN0ZXJlZCcsXHJcbiAgVVNFUk5BTUVfTk9UX1JFR0lTVEVSRUQ6ICd1c2VybmFtZSBpcyBub3QgcmVnaXN0ZXJlZCcsXHJcbiAgSU5WQUxJRF9VU0VSTkFNRTpcclxuICAgICdvbmx5IExldHRlcnMgYS16IG9yIEEtWiBhbmQgdGhlIFN5bWJvbHMgLSBhbmQgXyBhcmUgYWxsb3dlZCcsXHJcbiAgSU5WQUxJRF9FTVBUWV9TVFJJTkc6ICdlbXB0eSBzdHJpbmcgaXMgbm90IGFsbG93ZWQnLFxyXG4gIElOVkFMSURfVVNFUk5BTUVfT1JfRU1BSUw6ICdlbWFpbCBvciB1c2VybmFtZSBpcyBub3QgdmFsaWQnLFxyXG4gIElOVkFMSURfQ1JFREVOVElBTFM6ICdpbnZhbGlkIGNyZWRlbnRpYWxzIHByb3ZpZGVkJyxcclxuICBVU0VSTkFNRV9UQUtFTjogJ3VzZXJuYW1lIGlzIGFscmVhZHkgdGFrZW4nLFxyXG4gIFJFR0lTVEVSRURfRU1BSUw6ICdlbWFpbCBpcyBhbHJlYWR5IHJlZ2lzdGVyZWQnLFxyXG4gIFBBU1NXT1JEU19ET19OT1RfTUFUQ0g6ICdwYXNzd29yZHMgZG8gbm90IG1hdGNoJ1xyXG59O1xyXG4iLCJleHBvcnQgY29uc3QgcGFzc3dvcmRSZWdleCA9IC9eKD89LipcXGQpKD89LipbYS16XSkoPz0uKltBLVpdKSg/PS4qW2EtekEtWl0pLns4LH0kL2c7XHJcblxyXG5leHBvcnQgY29uc3QgZW1haWxSZWdleCA9IC9bYS16MC05ISMkJSYnKisvPT9eX2B7fH1+LV0rKD86XFwuW2EtejAtOSEjJCUmJyorLz0/Xl9ge3x9fi1dKykqQCg/OlthLXowLTldKD86W2EtejAtOS1dKlthLXowLTldKT9cXC4pK1thLXowLTldKD86W2EtejAtOS1dKlthLXowLTldKT8vZztcclxuXHJcbmV4cG9ydCBjb25zdCB1c2VybmFtZVJlZ2V4ID0gL1thLXpBLVpdK1stX10qW2EtekEtWl0rL2c7XHJcbiIsImltcG9ydCB2YWxpZGF0aW9uU3RhdGUgZnJvbSAnLi92YWxpZGF0aW9uU3RhdGVzJztcclxuaW1wb3J0IHZhbGlkYXRpb25UeXBlcyBmcm9tICcuL3ZhbGlkYXRpb25UeXBlcyc7XHJcbmltcG9ydCB2YWxpZGF0aW9uTWVzc2FnZXMgZnJvbSAnLi92YWxpZGF0aW9uTWVzc2FnZXMnO1xyXG5pbXBvcnQgeyBlbWFpbFJlZ2V4LCBwYXNzd29yZFJlZ2V4LCB1c2VybmFtZVJlZ2V4IH0gZnJvbSAnLi92YWxpZGF0aW9uUmVnZXgnO1xyXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVFbWFpbENvbnN0cmFpbnQoeyBlbWFpbCB9KSB7XHJcbiAgY29uc3QgZW1haWxDb25zdHJhaW50ID0gbmV3IFJlZ0V4cChlbWFpbFJlZ2V4KTtcclxuXHJcbiAgaWYgKGVtYWlsQ29uc3RyYWludC50ZXN0KGVtYWlsKSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5FTUFJTF9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgfTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5FTUFJTF9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfRU1BSUwsXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzQ2xpZW50VmFsaWRhdGlvblR5cGUoeyB2YWxpZGF0aW9uVHlwZSB9KSB7XHJcbiAgc3dpdGNoICh2YWxpZGF0aW9uVHlwZSkge1xyXG4gICAgY2FzZSB2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT046XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgY2FzZSB2YWxpZGF0aW9uVHlwZXMuRU1BSUxfRk9STUFUX1ZBTElEQVRJT046XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgY2FzZSB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT046XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgY2FzZSB2YWxpZGF0aW9uVHlwZXMuRU1QVFlfU1RSSU5HX1ZBTElEQVRJT046XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgY2FzZSB2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT046XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgY2FzZSB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT046XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxufVxyXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVQYXNzd29yZENvbnN0cmFpbnQoeyBwYXNzd29yZCB9KSB7XHJcbiAgY29uc3QgcGFzc3dvcmRDb25zdHJhaW50ID0gbmV3IFJlZ0V4cChwYXNzd29yZFJlZ2V4KTtcclxuICBpZiAocGFzc3dvcmRDb25zdHJhaW50LnRlc3QocGFzc3dvcmQpKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogJycsXHJcbiAgICB9O1xyXG4gIH1cclxuICBpZiAoIXBhc3N3b3JkQ29uc3RyYWludC50ZXN0KHBhc3N3b3JkKSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5QQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfUEFTU1dPUkQsXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlVXNlck5hbWVDb25zdHJhaW50KHsgdXNlcm5hbWUgfSkge1xyXG4gIGNvbnN0IHVzZXJuYW1lQ29uc3RyYWludCA9IG5ldyBSZWdFeHAodXNlcm5hbWVSZWdleCk7XHJcblxyXG4gIGlmICh1c2VybmFtZUNvbnN0cmFpbnQudGVzdCh1c2VybmFtZSkpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLlZBTElELFxyXG4gICAgICBtZXNzYWdlOiAnJyxcclxuICAgIH07XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX1VTRVJOQU1FLFxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUVtYWlsT3JVc2VybmFtZSh7IHZhbHVlIH0pIHtcclxuICBjb25zdCBlbWFpbENvbnN0cmFpbnQgPSBuZXcgUmVnRXhwKGVtYWlsUmVnZXgpO1xyXG4gIGNvbnN0IHVzZXJuYW1lQ29uc3RyYWludCA9IG5ldyBSZWdFeHAodXNlcm5hbWVSZWdleCk7XHJcblxyXG4gIGlmIChlbWFpbENvbnN0cmFpbnQudGVzdCh2YWx1ZSkpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLlZBTElELFxyXG4gICAgICBtZXNzYWdlOiAnJyxcclxuICAgIH07XHJcbiAgfSBlbHNlIGlmICh1c2VybmFtZUNvbnN0cmFpbnQudGVzdCh2YWx1ZSkpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLlZBTElELFxyXG4gICAgICBtZXNzYWdlOiAnJyxcclxuICAgIH07XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX1VTRVJOQU1FX09SX0VNQUlMLFxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUVtcHR5U3RyaW5nKHsgdmFsdWUgfSkge1xyXG4gIGlmICh2YWx1ZS5sZW5ndGggPT09IDApIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuRU1QVFlfU1RSSU5HX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX0VNUFRZX1NUUklORyxcclxuICAgIH07XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuRU1QVFlfU1RSSU5HX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLlZBTElELFxyXG4gICAgICBtZXNzYWdlOiAnJyxcclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVQYXNzd29yZE1hdGNoKHsgc3RhdGUgfSkge1xyXG4gIGNvbnN0IHsgcGFzc3dvcmQsIGNvbmZpcm0gfSA9IHN0YXRlLmF1dGg7XHJcblxyXG4gIGlmIChwYXNzd29yZCA9PT0gJycgfHwgcGFzc3dvcmQgIT09IGNvbmZpcm0pIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5QQVNTV09SRFNfRE9fTk9UX01BVENILFxyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OLFxyXG4gICAgfTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OLFxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQge1xyXG4gICAgSU5JVF9GT1JNX1ZBTElEQVRJT05fU1RBVEU6ICdJTklUX0ZPUk1fVkFMSURBVElPTl9TVEFURScsXHJcbiAgICBSRVNFVF9WQUxJREFUSU9OX1NUQVRFOiAnUkVTRVRfVkFMSURBVElPTl9TVEFURScsXHJcbiAgICBJTlBVVF9CTFVSUkVEOiAnSU5QVVRfQkxVUlJFRCcsXHJcbiAgICBJTlBVVF9GT0NVU0VEOiAnSU5QVVRfRk9DVVNFRCcsXHJcbiAgXHJcbiAgICBTRVJWRVJfVkFMSURBVElPTjogJ1NFUlZFUl9WQUxJREFUSU9OJyxcclxuICAgIENMSUVOVF9WQUxJREFUSU9OOidDTElFTlRfVkFMSURBVElPTicsXHJcbiAgXHJcbiAgICBJTkNfSU5QVVRfQ09VVE4gOidJTkNfSU5QVVRfQ09VVE4nXHJcbiAgfTtcclxuICAiLCJleHBvcnQgZGVmYXVsdCB7XHJcbiAgLy9sb2dpblxyXG4gIGNyZWRlbnRpYWxJbnZhbGlkOiAnNDAxJyxcclxuICAvL3NpZ251cFxyXG4gIHVzZXJuYW1lSXNUYWtlbjogJzQwMicsXHJcbiAgZW1haWxJc1JlZ2lzdGVyZWQ6ICc0MDMnLFxyXG4gIHVzZXJuYW1lSW52YWxpZDogJzQwNScsXHJcbiAgcGFzc3dvcmRJbnZhbGlkOiAnNDA2JywgLy9jaGFuZ2UgcGFzc3dvcmRcclxuICBlbWFpbEludmFsaWQ6ICc0MDcnLFxyXG4gIC8vbG9naW5cclxuICBlbWFpbElzTm90UmVnaXN0ZXJlZDogJzQwOCcsXHJcbiAgZW1wdHlTdHJpbmdOb3RWYWxpZDogJzQwOScsXHJcbiAgZW1haWxvcnVzZXJuYW1lTm90VmFsaWQ6JzQxMCcsXHJcbiAgdXNlcm5hbWVJc05vdFJlZ2lzdGVyZWQ6JzQxMScsXHJcbi8vY2hhbmdlIHBhc3N3b3JkXHJcbiAgcGFzc3dvcmREb05vdE1hdGNoOic0MTInLFxyXG4gIHRva2VuRXhwaXJlZDonNDEzJyxcclxuICBzZXJ2ZXJWYWxpZGF0aW9uUmFuZ2U6IHN0YXR1cyA9PiB7XHJcbiAgICBpZiAoc3RhdHVzID49IDQwMCAmJiBzdGF0dXMgPD0gNDEwKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxufTtcclxuIiwiXHJcbmltcG9ydCAqIGFzIHZhbGlkYXRpb25zIGZyb20gJy4vY29uc3RyYWludFZhbGlkYXRvcnMnO1xyXG5pbXBvcnQgY29uc3RWYWxUeXBlcyBmcm9tICcuL3ZhbGlkYXRpb25UeXBlcyc7XHJcbmltcG9ydCB2YWxpZGF0aW9uU3RhdGVzIGZyb20gJy4vdmFsaWRhdGlvblN0YXRlcyc7XHJcbmltcG9ydCB2YWxpZGF0aW9uVHlwZXMgZnJvbSAnLi92YWxpZGF0aW9uVHlwZXMnO1xyXG5pbXBvcnQgYWN0aW9uVHlwZXMgZnJvbSAnLi9hY3Rpb25UeXBlcyc7XHJcbmltcG9ydCBodHRwU3RhdHVzIGZyb20gJy4vaHR0cC1zdGF0dXMnO1xyXG5pbXBvcnQgdmFsaWRhdGlvbk1lc3NhZ2VzIGZyb20gJy4vdmFsaWRhdGlvbk1lc3NhZ2VzJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjbGllbnRWYWxpZGF0aW9uKHsgdmFsaWRhdGlvblR5cGUsIHZhbHVlLCBzdGF0ZSB9KSB7XHJcbiAgbGV0IHZhbGlkYXRpb24gPSBudWxsO1xyXG4gIHN3aXRjaCAodmFsaWRhdGlvblR5cGUpIHtcclxuICAgIGNhc2UgY29uc3RWYWxUeXBlcy5FTUFJTF9GT1JNQVRfVkFMSURBVElPTjpcclxuICAgICAgdmFsaWRhdGlvbiA9IHZhbGlkYXRpb25zLnZhbGlkYXRlRW1haWxDb25zdHJhaW50KHtcclxuICAgICAgICBlbWFpbDogdmFsdWUsXHJcbiAgICAgIH0pO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgY29uc3RWYWxUeXBlcy5VU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTjpcclxuICAgICAgdmFsaWRhdGlvbiA9IHZhbGlkYXRpb25zLnZhbGlkYXRlRW1haWxPclVzZXJuYW1lKHtcclxuICAgICAgICB2YWx1ZSxcclxuICAgICAgfSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBjb25zdFZhbFR5cGVzLlBBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OOlxyXG4gICAgICB2YWxpZGF0aW9uID0gdmFsaWRhdGlvbnMudmFsaWRhdGVQYXNzd29yZENvbnN0cmFpbnQoe1xyXG4gICAgICAgIHBhc3N3b3JkOiB2YWx1ZSxcclxuICAgICAgfSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBjb25zdFZhbFR5cGVzLlVTRVJOQU1FX0ZPUk1BVF9WQUxJREFUSU9OOlxyXG4gICAgICB2YWxpZGF0aW9uID0gdmFsaWRhdGlvbnMudmFsaWRhdGVVc2VyTmFtZUNvbnN0cmFpbnQoe1xyXG4gICAgICAgIHVzZXJuYW1lOiB2YWx1ZSxcclxuICAgICAgfSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBjb25zdFZhbFR5cGVzLkVNUFRZX1NUUklOR19WQUxJREFUSU9OOlxyXG4gICAgICB2YWxpZGF0aW9uID0gdmFsaWRhdGlvbnMudmFsaWRhdGVFbXB0eVN0cmluZyh7IHZhbHVlIH0pO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgY29uc3RWYWxUeXBlcy5QQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTjpcclxuICAgICAgZGVidWdnZXI7XHJcbiAgICAgIHZhbGlkYXRpb24gPSB2YWxpZGF0aW9ucy52YWxpZGF0ZVBhc3N3b3JkTWF0Y2goeyBzdGF0ZSB9KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICBicmVhaztcclxuICB9XHJcblxyXG4gIHJldHVybiB7IHR5cGU6IGFjdGlvblR5cGVzLkNMSUVOVF9WQUxJREFUSU9OLCAuLi52YWxpZGF0aW9uIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpbml0Rm9ybVZhbGlkYXRpb25TdGF0ZSgpIHtcclxuICByZXR1cm4geyB0eXBlOiBhY3Rpb25UeXBlcy5JTklUX0ZPUk1fVkFMSURBVElPTl9TVEFURSB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVzZXRJbnB1dFZhbGlkYXRpb25TdGF0ZSh7IHZhbGlkYXRpb25UeXBlIH0pIHtcclxuICByZXR1cm4geyB0eXBlOiBhY3Rpb25UeXBlcy5SRVNFVF9WQUxJREFUSU9OX1NUQVRFLCB2YWxpZGF0aW9uVHlwZSB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaW5jSW5wdXRDb3VudCgpIHtcclxuICByZXR1cm4geyB0eXBlOiBhY3Rpb25UeXBlcy5JTkNfSU5QVVRfQ09VVE4gfTtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXJ2ZXJWYWxpZGF0aW9uKHsgc3RhdHVzID0gMCB9KSB7XHJcbiAgZGVidWdnZXI7XHJcbiAgc3dpdGNoIChzdGF0dXMpIHtcclxuICAgIGNhc2UgaHR0cFN0YXR1cy5jcmVkZW50aWFsSW52YWxpZDpcclxuICAgICAgZGVidWdnZXI7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLmVtYWlsSW52YWxpZDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLkVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX0VNQUlMLFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLnBhc3N3b3JkSW52YWxpZDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX1BBU1NXT1JELFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLnVzZXJuYW1lSW52YWxpZDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX1VTRVJOQU1FLFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLmVtYWlsSXNSZWdpc3RlcmVkOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxyXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuUkVHSVNURVJFRF9FTUFJTCxcclxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuUkVHSVNURVJFRF9FTUFJTCxcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcclxuICAgICAgfTtcclxuICAgIGNhc2UgaHR0cFN0YXR1cy5lbWFpbElzTm90UmVnaXN0ZXJlZDpcclxuICAgICAgZGVidWdnZXI7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5FTUFJTF9OT1RfUkVHSVNURVJFRCxcclxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuRU1BSUxfTk9UX1JFR0lTVEVSRUQsXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMudXNlcm5hbWVJc1Rha2VuOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxyXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfVEFLRU4sXHJcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLlVTRVJOQU1FX1RBS0VOLFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLmVtcHR5U3RyaW5nTm90VmFsaWQ6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5FTVBUWV9TVFJJTkdfVkFMSURBVElPTixcclxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9FTVBUWV9TVFJJTkcsXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMuZW1haWxvcnVzZXJuYW1lTm90VmFsaWQ6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9VU0VSTkFNRV9PUl9FTUFJTCxcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcclxuICAgICAgfTtcclxuICAgIGNhc2UgaHR0cFN0YXR1cy51c2VybmFtZUlzTm90UmVnaXN0ZXJlZDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX05PVF9SRUdJU1RFUkVELFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5VU0VSTkFNRV9OT1RfUkVHSVNURVJFRCxcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcclxuICAgICAgfTtcclxuICAgICAgY2FzZSBodHRwU3RhdHVzLnBhc3N3b3JkRG9Ob3RNYXRjaDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OLFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5QQVNTV09SRFNfRE9fTk9UX01BVENILFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG59XHJcbiIsImNvbnN0IGltZyA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFFQUFBQUJBQ0FZQUFBQ3FhWEhlQUFBQUNYQklXWE1BQUFzVEFBQUxFd0VBbXB3WUFBQUNza2xFUVZSNG5PMmF1MjRUUVJTR1A5c0swRmdpSWdMbElvVXVxUU5VVk9IU21CTGVnSFFVZ1M3UGdaSU9oS21JWWloaTNzQUlDUXBTSktFRUNTc0dna0tMSlV1UktXWVdITE9MZCtmTTd0cngrYVNSSld0bi92L1l1N016Wnc0b2lxSW9pcUlvaWpLT0ZETFFPQU5jQWE0RFM4QkY0QUl3WlQ4QmZnSkg5dk1Ic0FPOEJUNEFuUXc4ZXVjU3NBYThBZHBBMTdHMTdSaHJkc3locGdEY0JtcVlmODAxNktqV3NXUGZJcHM3TnhFM2dGMzhCeDNWZHExbTdsd0dYcEZkNFAzdEpUQ2ZkcEJSUEVUMmZQdHFiV0ExNVZoUGNCWjQ3amtJSDYxcXZhWEtEUEEreHlBSHRYZkFkRnJCendGTm9jRW1zQTVVZ0FXZ2JOdUMvVzdkZzhZWDY5VXJrOEJIZ2FrRDRENVFpcUZWc3RlMkJIcjd3SGxSeEQyY3d5eEdYTTFzWS83bHBKU0J1a0MzWWIyTDJSU1llQXdVQmRwRk80YXIvcVpBRzRCN0F2RnQvS3pZaXNqdWhMdXV3cFBBZDBmUkE5eHUreWpLdU04SjMyd3NpYWs2Q25ZeGs1aHZWZ1IrbmlVVnV5WVFheEp2dGs5S0Nka3I4bXJZb0ZFVDFDT0IwVHB3TE9nZnhUSHdXdEEvZGt5enlMYXpGWUhKUVZRRXZqcVlsZXdKd3U2QUI4Q0V3T1FuUWQ5QmZCYjBuY0RFTnBCRDNIL2xMbjVuLzM3S1FtK0gvUU5LRmltbmdyQWY0S2x3ekgrZU00L01DdnMvaVNzeTFwTmdDNU5xa3BoTWl6dUN2alhnYTl5THgyWWg5RCtxQXJHUlh3cURiRFBVNGhSc2hrQytIZmJ4bXMxdE94d3d5Z21SRndMdFAwaFRZblZHUENVRzVobmFGNWhwWVNheHVFblJGV1JKMFQwOEprVUQ1akFwWjFkVFhjeHJiQU96Vmxqa2IxcDgwWDYzd1pDbXhRTm1NSWNQRW9OcHRsUVBSZ0xHK21pc2wxV0c0M0QwRnhrZmp2WXlqOWszNUJWOGpSeVB4M3RaSnZzQ2llVk1Ja3RBQVZPK3NrVjZKVEpid0UyR3NFU21uNkJJcW9HOFNLcEJpa1ZTV1pYSkxSRmVKamRscnpraXZFeHVoeEV0azFNVVJWRVVSVkVVWmJqNURja01GZVFockZqOUFBQUFBRWxGVGtTdVFtQ0NcIjtcbiAgZXhwb3J0IGRlZmF1bHQgaW1nOyIsImNvbnN0IGltZyA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFFQUFBQUJBQ0FZQUFBQ3FhWEhlQUFBQUNYQklXWE1BQUFzVEFBQUxFd0VBbXB3WUFBQURzMGxFUVZSNG5PM2JTMmhjVlJ6SDhVOWFvOUl5bW9Jb1NtT3FMYTByTjc1d0s0SmF0SlFhRmV6Q2lOS3RpRkJjNk5LVmRDT0tDMUVySW9vS29xQ0M0RnZSalNLMWlpNUVEV2hOVWZFRmdSaU1pek9STkwwM2N4NXpaMkp5Zi9Bbk1NbWMzLy8vemJuM250ZWxWYXRXclU3VVhzeDBZOStRY3htS1pyRFFqYjh4T2R4MEJxK2xBTllsaEgxQzBjc2gzRFRNcEFhdFNTMkVXZ2czRHpPcFFhdUZZSTFER0luOHUwazhpMU9XZkRhUC9YaSt4M2UzNERKYzNJMWQzYy9PN01ZLytBVS9kMzhleDZmNEVKOWdMakxIeGxYVkUrWlY5NFFMY0RmZXJ2aE9Tc3ppZmR5TGM1b3BLMDI5SUZ5TlY0WC9hbTdSZFRHSEY3b2VzVDIzRWRWQitGTC9pNjZMSTdpcTZVSlhVaFdFWWNTTG1HaTQxbHF0RmdpenVLdmhXbXUxV2lBczREQk9hN1RhR3EwbUNCL2ozS1lLUFI5dllYdkY3MkloSE1NaFhDOWN1NXZRRWNZR3UvRXdwaVBhV1NtK3g5WSsxZzNPeHRkZGcybnBFSDdDRkVZanZEYmlEdnhRMDFaTUhNVllhcEYxMml5TXlKWWFwRUk0a09IYndTc1ZiY1hHZXpnOXcvY2tQVkZqa0FKaEhyZGtlRy9BUXpYK01mRmNodWNKMnQvRFlGQVFTbnJDalJtZTREejhHV0V3Q0FnZCtmZUVZOExrSzFtSEUwd0dBZUhPaEh5V3g1T3BacGRrbURRTllhT3lSK1NsS1dhdlpacE1ZMXRGZS8yQzhFaG1YZ3Q0SnRaa3U3THA3TFUxN2ZZRHd1NkN2T2FFKzFwUFBWaGdzb0R4RmRvdWhYQlJZVzRQeEpnY0x6VHBOU0VwZ2RBcHpHMG13cU1ZUU13UU5CZkNwc0xjb2dBY0tqUzVJc1pFSG9TSnd0eWlMb0ZkaFNhM3haaDBsUXJoaG9LOG9tK0M4SHFCMFdPeEpsMmxRQ2pwbmRHUFFmSUdRb3N4aTdOU3pNUkJHQldHdGJsNUpRMkVDQnNldVdiM3A1cnBEV0dxSUovSE0vS3hGYjluR3Y2Qm5SbWVkUkFPQ0lzcU9ibjhxR0J4NVBaTTB3VjhMaXltcEtyZmE0eDdNM0w0VHlQS0xvV1hEQmZDVXhuZUoybXpzRm1abThRUjdNandMWVh3Sms3TjhLM1VPTDRyU09ZMzNLYy9UNGVZK0F4blpOUzVvcmJoMjR4a2xzYXNNRTZZRWthTVk4TGNZUnpYcU43bVNvWHdqWWIzQm80bUpKTWFPVXZ1UytNZDZiMHNXUjI4SEpITW9DRThLbTdmb1MvYWdIdUVMcjBhSUR6ZC94TGp0QlB2VmlRMGFBaDFKMVVHb2hIczBjd0JpZjhOQk1LcTdSNjhvZjhRTHF6d1c1VVFGclVEQi9HUnN1TG5oRDIrNjJwOGlvL3dEZUt3MFJndXg1WENvdWFFOERqdENHT0FVV0h5OUt0d1ZPNHJmQ0dNSUQvQVh6M2FyenZDZDZ0d3FHcGRxRDNicklXQWVnanI2bjJIRm9KNkNPdnFIYWdxQ0ZFYkkydEp5eUdzT3dDRWJyLzRHbURSK21DclZxM1dudjRGcnJjdWoyT2ZSNXNBQUFBQVNVVk9SSzVDWUlJPVwiO1xuICBleHBvcnQgZGVmYXVsdCBpbWc7IiwiaW1wb3J0IHtofSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQge3VzZVN0YXRlfSBmcm9tICdwcmVhY3QvaG9va3MnXHJcbmltcG9ydCBvcGVuSWNvbiBmcm9tICcuL2ljb25zL29wZW5FeWUucG5nJztcclxuaW1wb3J0IGNsb3NlSWNvbiBmcm9tICcuL2ljb25zL2Nsb3NlRXllLnBuZyc7XHJcbmZ1bmN0aW9uIEljb25TdGF0ZSh7IG9wZW4gfSkge1xyXG4gIGlmIChvcGVuKSB7XHJcbiAgICByZXR1cm4gPGltZyB3aWR0aD1cIjMwcHhcIiBzcmM9e29wZW5JY29ufSAvPjtcclxuICB9XHJcbiAgcmV0dXJuIDxpbWcgd2lkdGg9XCIzMHB4XCIgc3JjPXtjbG9zZUljb259IC8+O1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBFeWVJY29uKHtvbkNsaWNrfSkge1xyXG4gIGNvbnN0IFtzdGF0ZSwgc2V0U3RhdGVdID0gdXNlU3RhdGUoZmFsc2UpO1xyXG4gIGZ1bmN0aW9uIHRvZ2dsZSgpIHtcclxuICAgIG9uQ2xpY2soKVxyXG4gICAgc2V0U3RhdGUocHJldiA9PiAhcHJldik7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdlxyXG4gICAgICBvbkNsaWNrPXt0b2dnbGV9XHJcbiAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxyXG4gICAgICAgIGp1c3RpZnlDb250ZW50OidjZW50ZXInLFxyXG4gICAgICAgIG1hcmdpbjogMVxyXG4gICAgICB9fVxyXG4gICAgPlxyXG4gICAgICA8SWNvblN0YXRlIG9wZW49e3N0YXRlfSAvPlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgYWN0aW9uVHlwZXMgZnJvbSAnLi9hY3Rpb25UeXBlcyc7XHJcbmltcG9ydCB2YWxpZGF0aW9uU3RhdGUgZnJvbSAnLi92YWxpZGF0aW9uU3RhdGVzJztcclxuXHJcbmV4cG9ydCBjb25zdCBpbml0U3RhdGUgPSB7IHZhbGlkYXRpb246IHt9IH07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZm9ybVJlZHVjZXIoc3RhdGUsIGFjdGlvbikge1xyXG4gIGxldCBuZXh0U3RhdGUgPSBudWxsO1xyXG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT046XHJcbiAgICAgIG5leHRTdGF0ZSA9IHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICB2YWxpZGF0aW9uOiB7XHJcbiAgICAgICAgICAuLi5zdGF0ZS52YWxpZGF0aW9uLFxyXG4gICAgICAgICAgW2FjdGlvbi52YWxpZGF0aW9uVHlwZV06IHtcclxuICAgICAgICAgICAgdmFsaWRhdGlvblN0YXRlOiBhY3Rpb24udmFsaWRhdGlvblN0YXRlLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBhY3Rpb24ubWVzc2FnZSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHJldHVybiBuZXh0U3RhdGU7XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkNMSUVOVF9WQUxJREFUSU9OOlxyXG4gICAgICBuZXh0U3RhdGUgPSB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgdmFsaWRhdGlvbjoge1xyXG4gICAgICAgICAgLi4uc3RhdGUudmFsaWRhdGlvbixcclxuXHJcbiAgICAgICAgICBbYWN0aW9uLnZhbGlkYXRpb25UeXBlXToge1xyXG4gICAgICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IGFjdGlvbi52YWxpZGF0aW9uU3RhdGUsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IGFjdGlvbi5tZXNzYWdlLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICB9O1xyXG5cclxuICAgICAgcmV0dXJuIG5leHRTdGF0ZTtcclxuXHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlJFU0VUX1ZBTElEQVRJT05fU1RBVEU6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgdmFsaWRhdGlvbjoge1xyXG4gICAgICAgICAgLi4uc3RhdGUudmFsaWRhdGlvbixcclxuICAgICAgICAgIFthY3Rpb24udmFsaWRhdGlvblR5cGVdOiB7XHJcbiAgICAgICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOQUNUSVZFLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiAnJyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgfTtcclxuXHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLklOUFVUX0ZPQ1VTRUQ6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgdmFsaWRhdGlvbjoge1xyXG4gICAgICAgICAgLi4uc3RhdGUudmFsaWRhdGlvbixcclxuICAgICAgICAgIGZvcm1TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOQUNUSVZFLFxyXG4gICAgICAgICAgW2FjdGlvbi5wcm9wTmFtZV06IHtcclxuICAgICAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5BQ1RJVkUsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5JTklUX0ZPUk1fVkFMSURBVElPTl9TVEFURTpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICB2YWxpZGF0aW9uOiB7XHJcbiAgICAgICAgICAuLi5zdGF0ZS52YWxpZGF0aW9uLFxyXG4gICAgICAgICAgZm9ybVN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5BQ1RJVkUsXHJcbiAgICAgICAgfSxcclxuICAgICAgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuSU5DX0lOUFVUX0NPVVROOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgY291bnQ6IHN0YXRlLmNvdW50ICsgMSB9O1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlUmVkdWNlciwgdXNlQ29udGV4dCwgdXNlU3RhdGUsIHVzZU1lbW8gfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgeyBmb3JtUmVkdWNlciwgaW5pdFN0YXRlIH0gZnJvbSAnLi9mb3JtUmVkdWNlcic7XHJcbmNvbnN0IEZvcm1Db250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVzZUZvcm1Db250ZXh0KCkge1xyXG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KEZvcm1Db250ZXh0KTtcclxuICBpZiAoIWNvbnRleHQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcigndXNlRm9ybUNvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggQXBwUHJvdmlkZXInKTtcclxuICB9XHJcbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSBjb250ZXh0O1xyXG5cclxuICByZXR1cm4geyBzdGF0ZSwgZGlzcGF0Y2ggfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEZvcm1Qcm92aWRlcihwcm9wcykge1xyXG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlUmVkdWNlcihmb3JtUmVkdWNlciwgaW5pdFN0YXRlKTtcclxuICBjb25zdCB2YWx1ZSA9IHVzZU1lbW8oKCkgPT4gW3N0YXRlLCBkaXNwYXRjaF0sIFtzdGF0ZV0pO1xyXG4gIHJldHVybiA8Rm9ybUNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfSB7Li4ucHJvcHN9IC8+O1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0ICogYXMgYWN0aW9ucyBmcm9tICcuL2FjdGlvbnMnO1xyXG5pbXBvcnQgdmFsaWRhdGlvblN0YXRlcyBmcm9tICcuL3ZhbGlkYXRpb25TdGF0ZXMnO1xyXG5pbXBvcnQgeyBpc0NsaWVudFZhbGlkYXRpb25UeXBlIH0gZnJvbSAnLi9jb25zdHJhaW50VmFsaWRhdG9ycyc7XHJcbmltcG9ydCBFeWVJY29uIGZyb20gJy4vRXllSWNvbic7XHJcbmltcG9ydCB7IHVzZUZvcm1Db250ZXh0IH0gZnJvbSAnLi9mb3JtLWNvbnRleHQnO1xyXG5mdW5jdGlvbiBWYWxpZGl0eUljb24oeyB2YWxpZCB9KSB7XHJcbiAgbGV0IHN0YXRlQ29sb3IgPSAnIzRmYzNmNyc7XHJcbiAgc3dpdGNoICh2YWxpZCkge1xyXG4gICAgY2FzZSB2YWxpZGF0aW9uU3RhdGVzLlZBTElEOlxyXG4gICAgICBzdGF0ZUNvbG9yID0gJ2dyZWVuJztcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRDpcclxuICAgICAgc3RhdGVDb2xvciA9ICdyZWQnO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgdmFsaWRhdGlvblN0YXRlcy5JTkFDVElWRTpcclxuICAgICAgc3RhdGVDb2xvciA9ICcjNGZjM2Y3JztcclxuICAgICAgYnJlYWs7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICBzdGF0ZUNvbG9yID0gJyM0ZmMzZjcnO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgc3R5bGU9e3tcclxuICAgICAgICBmbGV4OiAxLFxyXG4gICAgICAgIGNvbG9yOiBzdGF0ZUNvbG9yLFxyXG4gICAgICAgIGxpbmVIZWlnaHQ6IDIsXHJcbiAgICAgICAgd2lkdGg6IDIwLFxyXG4gICAgICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXHJcbiAgICAgIH19XHJcbiAgICA+XHJcbiAgICAgIHt2YWxpZCA/ICfinJMnIDogJ+KYkyd9XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcblxyXG5jb25zdCBzdHlsZSA9IHtcclxuICBpbnB1dDoge1xyXG4gICAgbWFyZ2luOiAxLFxyXG4gICAgYm9yZGVyOiAnMXB4IHNvbGlkJyxcclxuICAgIHBhZGRpbmc6IDgsXHJcbiAgICBmbGV4OiAxMCxcclxuICAgIGJvcmRlclJhZGl1czogMixcclxuICB9LFxyXG4gIHJvb3Q6IHtcclxuICAgIGJvcmRlclJhZGl1czogMixcclxuICAgIG1hcmdpbjogMyxcclxuICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxyXG4gICAgYmFja2dyb3VuZENvbG9yOiAnd2hpdGUnLFxyXG4gICAgYm9yZGVyOiAnMXB4IHNvbGlkIHdoaXRlJyxcclxuICAgIG1hcmdpbkJvdHRvbTogMSxcclxuICB9LFxyXG4gIGlucHV0Q29udGFpbmVyOiB7XHJcbiAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICBmbGV4OiAxLFxyXG4gIH0sXHJcbiAgbWVzc2FnZToge1xyXG4gICAgY29sb3I6ICdyZWQnLFxyXG4gICAgcGFkZGluZ0xlZnQ6IDMsXHJcbiAgfSxcclxufTtcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSW5wdXQoe1xyXG4gIHBsYWNlaG9sZGVyLFxyXG4gIHR5cGUsXHJcbiAgbmFtZSxcclxuICBvbkNoYW5nZSxcclxuICB2YWx1ZSA9ICcnLFxyXG4gIHZhbGlkYXRpb25UeXBlcyA9IFtdLFxyXG4gIGlkLFxyXG59KSB7XHJcbiAgY29uc3QgeyBzdGF0ZSwgZGlzcGF0Y2ggfSA9IHVzZUZvcm1Db250ZXh0KCk7XHJcblxyXG4gIGNvbnN0IFtpbnB1dFZhbGlkYXRpb24sIHNldElucHV0VmFsaWRhdGlvbl0gPSB1c2VTdGF0ZSh7XHJcbiAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5BQ1RJVkUsXHJcbiAgICBtZXNzYWdlOiAnJyxcclxuICAgIHZhbGlkYXRpb25UeXBlOiB1bmRlZmluZWQsXHJcbiAgfSk7XHJcblxyXG4gIGNvbnN0IFtpbnB1dFR5cGUsIHNldElucHV0VHlwZV0gPSB1c2VTdGF0ZSh0eXBlKTtcclxuXHJcbiAgY29uc3QgW2JvcmRlckNvbG9yLCBzZXRCb3JkZXJDb2xvcl0gPSB1c2VTdGF0ZSgnJyk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAoXHJcbiAgICAgIGlucHV0VmFsaWRhdGlvbiAmJlxyXG4gICAgICBpbnB1dFZhbGlkYXRpb24udmFsaWRhdGlvblN0YXRlID09PSB2YWxpZGF0aW9uU3RhdGVzLlZBTElEXHJcbiAgICApIHtcclxuICAgICAgc2V0Qm9yZGVyQ29sb3IoJ2dyZWVuJyk7XHJcbiAgICB9XHJcbiAgICBpZiAoXHJcbiAgICAgIGlucHV0VmFsaWRhdGlvbiAmJlxyXG4gICAgICBpbnB1dFZhbGlkYXRpb24udmFsaWRhdGlvblN0YXRlID09PSB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSURcclxuICAgICkge1xyXG4gICAgICBzZXRCb3JkZXJDb2xvcigncmVkJyk7XHJcbiAgICB9XHJcbiAgICBpZiAoXHJcbiAgICAgIGlucHV0VmFsaWRhdGlvbiAmJlxyXG4gICAgICBpbnB1dFZhbGlkYXRpb24udmFsaWRhdGlvblN0YXRlID09PSB2YWxpZGF0aW9uU3RhdGVzLklOQUNUSVZFXHJcbiAgICApIHtcclxuICAgICAgc2V0Qm9yZGVyQ29sb3IoJyM0ZmMzZjcnKTtcclxuICAgIH1cclxuICB9LCBbaW5wdXRWYWxpZGF0aW9uXSk7XHJcbiAgZnVuY3Rpb24gaGFuZGxlRm9jdXMoKSB7XHJcbiAgICB2YWxpZGF0aW9uVHlwZXMuZm9yRWFjaCgodmFsaWRhdGlvbk5hbWUpID0+IHtcclxuICAgICAgaWYgKHN0YXRlLmZvcm0udmFsaWRhdGlvblt2YWxpZGF0aW9uTmFtZV0pIHtcclxuICAgICAgICBkaXNwYXRjaChcclxuICAgICAgICAgIGFjdGlvbnMucmVzZXRJbnB1dFZhbGlkYXRpb25TdGF0ZSh7IHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uTmFtZSB9KVxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuICBmdW5jdGlvbiBoYW5kbGVCbHVyKCkge1xyXG4gICAgdmFsaWRhdGlvblR5cGVzLmZvckVhY2goKHZhbGlkYXRpb25OYW1lKSA9PiB7XHJcbiAgICAgIGlmIChpc0NsaWVudFZhbGlkYXRpb25UeXBlKHsgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25OYW1lIH0pKSB7XHJcbiAgICAgICAgZGlzcGF0Y2goXHJcbiAgICAgICAgICBhY3Rpb25zLmNsaWVudFZhbGlkYXRpb24oe1xyXG4gICAgICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvbk5hbWUsXHJcbiAgICAgICAgICAgIHZhbHVlLFxyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiB0b2dnbGVFeWUoKSB7XHJcbiAgICBpZiAoaW5wdXRUeXBlID09PSAncGFzc3dvcmQnKSB7XHJcbiAgICAgIHNldElucHV0VHlwZSgndGV4dCcpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc2V0SW5wdXRUeXBlKCdwYXNzd29yZCcpO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17c3R5bGUucm9vdH0+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlLmlucHV0Q29udGFpbmVyfT5cclxuICAgICAgICA8aW5wdXRcclxuICAgICAgICAgIHN0eWxlPXt7IC4uLnN0eWxlLmlucHV0LCBib3JkZXJDb2xvciB9fVxyXG4gICAgICAgICAgdHlwZT17aW5wdXRUeXBlfVxyXG4gICAgICAgICAgbmFtZT17bmFtZX1cclxuICAgICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cclxuICAgICAgICAgIHZhbHVlPXt2YWx1ZX1cclxuICAgICAgICAgIG9uQmx1cj17aGFuZGxlQmx1cn1cclxuICAgICAgICAgIHBsYWNlaG9sZGVyPXtwbGFjZWhvbGRlcn1cclxuICAgICAgICAgIG9uRm9jdXM9e2hhbmRsZUZvY3VzfVxyXG4gICAgICAgICAgZGF0YS10ZXN0aWQ9e2lkfVxyXG4gICAgICAgIC8+XHJcbiAgICAgICAge3ZhbGlkYXRpb25UeXBlcy5tYXAoKHZhbGlkYXRpb25OYW1lKSA9PiB7XHJcbiAgICAgICAgICBpZiAoc3RhdGUudmFsaWRhdGlvblt2YWxpZGF0aW9uTmFtZV0pIHtcclxuICAgICAgICAgICAgY29uc3QgeyB2YWxpZGF0aW9uU3RhdGUgfSA9IHN0YXRlLnZhbGlkYXRpb25bdmFsaWRhdGlvbk5hbWVdO1xyXG4gICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgdmFsaWRhdGlvblN0YXRlID09PSB2YWxpZGF0aW9uU3RhdGVzLlZBTElEIHx8XHJcbiAgICAgICAgICAgICAgdmFsaWRhdGlvblN0YXRlID09PSB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSURcclxuICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgIDxWYWxpZGl0eUljb24ga2V5PXt2YWxpZGF0aW9uTmFtZX0gdmFsaWQ9e3ZhbGlkYXRpb25TdGF0ZX0gLz5cclxuICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pfVxyXG4gICAgICAgIHt0eXBlID09PSAncGFzc3dvcmQnICYmIDxFeWVJY29uIG9uQ2xpY2s9e3RvZ2dsZUV5ZX0gLz59XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICB7dmFsaWRhdGlvblR5cGVzLm1hcCgodmFsaWRhdGlvbk5hbWUpID0+IHtcclxuICAgICAgICBpZiAoc3RhdGUudmFsaWRhdGlvblt2YWxpZGF0aW9uTmFtZV0pIHtcclxuICAgICAgICAgIGNvbnN0IHsgbWVzc2FnZSB9ID0gc3RhdGUudmFsaWRhdGlvblt2YWxpZGF0aW9uTmFtZV07XHJcbiAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGtleT17dmFsaWRhdGlvbk5hbWV9IHN0eWxlPXtzdHlsZS5tZXNzYWdlfT5cclxuICAgICAgICAgICAgICB7bWVzc2FnZSAhPT0gJycgJiYgKFxyXG4gICAgICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgICAgICByb2xlPVwibWVzc2FnZVwiXHJcbiAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPXtgbWVzc2FnZS0ke25hbWV9YH1cclxuICAgICAgICAgICAgICAgID57YCogJHttZXNzYWdlfWB9PC9kaXY+XHJcbiAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgfSl9XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7aH0gZnJvbSAncHJlYWN0JztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEJ1dHRvbih7IG9uQ2xpY2ssIHRpdGxlLCBkaXNhYmxlZCwgaWQgfSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8YnV0dG9uXHJcbiAgICAgIGRhdGEtdGVzdGlkPXtpZH1cclxuICAgICAgZGlzYWJsZWQ9e2Rpc2FibGVkfVxyXG4gICAgICBzdHlsZT17eyBib3JkZXJSYWRpdXM6IDIsIGhlaWdodDogMzMgfX1cclxuICAgICAgb25DbGljaz17b25DbGlja31cclxuICAgID5cclxuICAgICAge3RpdGxlfVxyXG4gICAgPC9idXR0b24+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0ICogYXMgdmFsaWRhdGlvbkFjdGlvbnMgZnJvbSAnLi9hY3Rpb25zJztcclxuaW1wb3J0IHsgRm9ybVByb3ZpZGVyIH0gZnJvbSAnLi9mb3JtLWNvbnRleHQnO1xyXG5jb25zdCBzdHlsZSA9IHtcclxuICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXHJcbiAgd2lkdGg6IDMwMCxcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEZvcm0oeyBjaGlsZHJlbiwgZm9ybVRpdGxlLCBlcnJvciB9KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxGb3JtUHJvdmlkZXI+XHJcbiAgICAgIDxmaWVsZHNldCBzdHlsZT17c3R5bGV9PlxyXG4gICAgICAgIDxsZWdlbmQ+e2Zvcm1UaXRsZX06PC9sZWdlbmQ+XHJcbiAgICAgICAge2NoaWxkcmVufVxyXG4gICAgICAgIHtlcnJvciAmJiAoXHJcbiAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgY29sb3I6ICdyZWQnLFxyXG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJ3doaXRlJyxcclxuICAgICAgICAgICAgICBwYWRkaW5nOiA1LFxyXG4gICAgICAgICAgICAgIGJvcmRlclJhZGl1czogNSxcclxuICAgICAgICAgICAgfX1cclxuICAgICAgICAgID5cclxuICAgICAgICAgICAgKiB7ZXJyb3IubWVzc2FnZX1cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICl9XHJcbiAgICAgIDwvZmllbGRzZXQ+XHJcbiAgICA8L0Zvcm1Qcm92aWRlcj5cclxuICApO1xyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IHtcclxuICBWQUxVRV9DSEFOR0VEOiAnVkFMVUVfQ0hBTkdFRCcsXHJcbiAgTE9HSU5fU1RBUlRFRDogJ0xPR0lOX1NUQVJURUQnLFxyXG4gIExPR0lOX1NVQ0NFU1M6ICdMT0dJTl9TVUNDRVNTJyxcclxuICBMT0dJTl9GQUlMRUQ6ICdMT0dJTl9GQUlMRUQnLFxyXG5cclxuICBMT0dPVVRfU1RBUlRFRDogJ0xPR09VVF9TVEFSVEVEJyxcclxuICBMT0dPVVRfRkFJTEVEOiAnTE9HT1VUX0ZBSUxFRCcsXHJcbiAgTE9HT1VUX1NVQ0NFU1M6ICdMT0dPVVRfU1VDQ0VTUycsXHJcblxyXG4gIFNJR05VUF9TVEFSVEVEOiAnU0lHTlVQX1NUQVJURUQnLFxyXG4gIFNJR05VUF9TVUNDRVNTOiAnU0lHTlVQX1NVQ0NFU1MnLFxyXG4gIFNJR05VUF9GQUlMRUQ6ICdTSUdOVVBfRkFJTEVEJyxcclxuXHJcbiAgQ0hBTkdFX1BBU1NXT1JEX1NUQVJURUQ6ICdDSEFOR0VfUEFTU1dPUkRfU1RBUlRFRCcsXHJcbiAgQ0hBTkdFX1BBU1NXT1JEX1NVQ0NFU1M6ICdDSEFOR0VfUEFTU1dPUkRfU1VDQ0VTUycsXHJcbiAgQ0hBTkdFX1BBU1NXT1JEX0ZBSUxFRDogJ0NIQU5HRV9QQVNTV09SRF9GQUlMRUQnLFxyXG5cclxuICBSRVFVRVNUX1BBU1NfQ0hBTkdFX1NUQVJURUQ6ICdSRVFVRVNUX1BBU1NfQ0hBTkdFX1NUQVJURUQnLFxyXG4gIFJFUVVFU1RfUEFTU19DSEFOR0VfU1VDQ0VTUzogJ1JFUVVFU1RfUEFTU19DSEFOR0VfU1VDQ0VTUycsXHJcbiAgUkVRVUVTVF9QQVNTX0NIQU5HRV9GQUlMRUQ6ICdSRVFVRVNUX1BBU1NfQ0hBTkdFX0ZBSUxFRCcsXHJcbiAgR09UX1RPS0VOX0ZST01fVVJMOiAnR09UX1RPS0VOX0ZST01fVVJMJyxcclxufTtcclxuIiwiaW1wb3J0IGFjdGlvblR5cGVzIGZyb20gJy4vYWN0aW9uVHlwZXMnO1xyXG5pbXBvcnQgeyBzZXJ2ZXJWYWxpZGF0aW9uIH0gZnJvbSAnLi4vZm9ybS9hY3Rpb25zJztcclxuaW1wb3J0IGh0dHBTdGF0dXMgZnJvbSAnLi4vZm9ybS9odHRwLXN0YXR1cyc7XHJcbmV4cG9ydCBmdW5jdGlvbiB2YWx1ZUNoYW5nZWQoeyBwcm9wTmFtZSwgdmFsdWUgfSkge1xyXG4gIHJldHVybiB7XHJcbiAgICB0eXBlOiBhY3Rpb25UeXBlcy5WQUxVRV9DSEFOR0VELFxyXG4gICAgcGF5bG9hZDoge1xyXG4gICAgICBwcm9wTmFtZSxcclxuICAgICAgdmFsdWUsXHJcbiAgICB9LFxyXG4gIH07XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsb2dpbih7IGRpc3BhdGNoLCBzdGF0ZSB9KSB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHsgZW1haWxvcnVzZXJuYW1lLCBwYXNzd29yZCB9ID0gc3RhdGU7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkxPR0lOX1NUQVJURUQgfSk7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxyXG4gICAgICBgJHtwcm9jZXNzLmVudi5SRUFDVF9BUFBfWEFGX1NFUlZFUl9VUkx9L2F1dGgvbG9naW5gLFxyXG4gICAgICB7XHJcbiAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgJ0NvbnRlbi1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxyXG4gICAgICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnOiAnKicsXHJcbiAgICAgICAgICBBdXRob3JpemF0aW9uOiBgQmFzaWMgJHsgIGJ0b2EoYCR7ZW1haWxvcnVzZXJuYW1lfToke3Bhc3N3b3JkfWApfWAsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICB9XHJcbiAgICApO1xyXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTE9HSU5fU1VDQ0VTUywgdG9rZW46IHJlc3VsdC50b2tlbiB9KTtcclxuICAgIH0gZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MDApIHtcclxuICAgICAgY29uc3QgeyBlcnJvcnMgfSA9IHJlc3VsdDtcclxuXHJcbiAgICAgIGVycm9ycy5mb3JFYWNoKChlcnJvcikgPT4ge1xyXG4gICAgICAgIGRpc3BhdGNoKFxyXG4gICAgICAgICAgc2VydmVyVmFsaWRhdGlvbih7XHJcbiAgICAgICAgICAgIHN0YXR1czogZXJyb3IsXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdMb2dpbiBmYWlsZWQnKTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5MT0dJTl9GQUlMRUQsIHBheWxvYWQ6IHsgZXJyb3IgfSB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzaWdudXAoeyBkaXNwYXRjaCwgc3RhdGUgfSkge1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0lHTlVQX1NUQVJURUQgfSk7XHJcbiAgY29uc3QgeyBlbWFpbCwgcGFzc3dvcmQsIHVzZXJuYW1lIH0gPSBzdGF0ZTtcclxuICB0cnkge1xyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcclxuICAgICAgYCR7cHJvY2Vzcy5lbnYuUkVBQ1RfQVBQX1hBRl9TRVJWRVJfVVJMfS9hdXRoL3NpZ251cGAsXHJcbiAgICAgIHtcclxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IHBhc3N3b3JkLCBlbWFpbCwgdXNlcm5hbWUgfSksXHJcbiAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgQ29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcclxuICAgICAgICAgIEFjY2VwdDogJ2FwcGxpY2F0aW9uL2pzb24nLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgIH1cclxuICAgICk7XHJcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TSUdOVVBfU1VDQ0VTUywgdG9rZW46IHJlc3VsdC50b2tlbiB9KTtcclxuICAgIH0gZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MDApIHtcclxuICAgICAgY29uc3QgeyBlcnJvcnMgfSA9IHJlc3VsdDtcclxuICAgICAgZXJyb3JzLmZvckVhY2goKGVycm9yKSA9PiB7XHJcbiAgICAgICAgZGlzcGF0Y2goXHJcbiAgICAgICAgICBzZXJ2ZXJWYWxpZGF0aW9uKHtcclxuICAgICAgICAgICAgc3RhdHVzOiBlcnJvcixcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NpZ251cCBmYWlsZWQnKTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TSUdOVVBfRkFJTEVELCBwYXlsb2FkOiB7IGVycm9yIH0gfSk7XHJcbiAgfVxyXG59XHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsb2dvdXQoeyBkaXNwYXRjaCwgc3RhdGUgfSkge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCB7IHRva2VuIH0gPSBzdGF0ZTtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXHJcbiAgICAgIGAke3Byb2Nlc3MuZW52LlJFQUNUX0FQUF9YQUZfU0VSVkVSX1VSTH0vYXV0aC9sb2dvdXQ/JHsgXHJcbiAgICAgICAgbmV3IFVSTFNlYXJjaFBhcmFtcyh7IHRva2VuIH0pfWBcclxuICAgICk7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkxPR09VVF9TVEFSVEVEIH0pO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkxPR09VVF9GQUlMRUQsIGVycm9yIH0pO1xyXG4gIH1cclxufVxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY2hhbmdlUGFzc3dvcmQoeyBkaXNwYXRjaCwgc3RhdGUgfSkge1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX1NUQVJURUQgfSk7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHsgY29uZmlybSwgcGFzc3dvcmQsIHRva2VuLCBlbWFpbG9ydXNlcm5hbWUsIGN1cnJlbnQgfSA9IHN0YXRlO1xyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcclxuICAgICAgYCR7cHJvY2Vzcy5lbnYuUkVBQ1RfQVBQX1hBRl9TRVJWRVJfVVJMfS9hdXRoL2NoYW5nZXBhc3NgLFxyXG4gICAgICB7XHJcbiAgICAgICAgbWV0aG9kOiAncHV0JyxcclxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgICBjb25maXJtLFxyXG4gICAgICAgICAgcGFzc3dvcmQsXHJcbiAgICAgICAgICBjdXJyZW50LFxyXG4gICAgICAgICAgdG9rZW4sXHJcbiAgICAgICAgICBlbWFpbG9ydXNlcm5hbWUsXHJcbiAgICAgICAgfSksXHJcbiAgICAgIH1cclxuICAgICk7XHJcblxyXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgIGRpc3BhdGNoKHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfU1VDQ0VTUyxcclxuICAgICAgICB0b2tlbjogcmVzdWx0LnRva2VuLFxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MDApIHtcclxuICAgICAgY29uc3QgeyBlcnJvcnMgfSA9IHJlc3VsdDtcclxuICAgICAgZXJyb3JzLmZvckVhY2goKGVycm9yKSA9PiB7XHJcbiAgICAgICAgZGlzcGF0Y2goXHJcbiAgICAgICAgICBzZXJ2ZXJWYWxpZGF0aW9uKHtcclxuICAgICAgICAgICAgc3RhdHVzOiBlcnJvcixcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNTAwKSB7XHJcbiAgICAgIGNvbnN0IHsgZXJyb3IgfSA9IHJlc3VsdDtcclxuXHJcbiAgICAgIGRpc3BhdGNoKHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfRkFJTEVELFxyXG4gICAgICAgIGVycm9yLFxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2hhbmdpbmcgcGFzc3dvcmQgZmFpbGVkJyk7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGRpc3BhdGNoKHtcclxuICAgICAgdHlwZTogYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX0ZBSUxFRCxcclxuICAgICAgcGF5bG9hZDogeyBlcnJvciB9LFxyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZm9yZ290UGFzc3dvcmQoeyBkaXNwYXRjaCwgc3RhdGUgfSkge1xyXG4gIHRyeSB7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlJFUVVFU1RfUEFTU19DSEFOR0VfU1RBUlRFRCB9KTtcclxuICAgIGNvbnN0IHsgZW1haWwgfSA9IHN0YXRlO1xyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCgnL3JlcXVlc3RwYXNzY2hhbmdlJywge1xyXG4gICAgICBtZXRob2Q6ICdwb3N0JyxcclxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBlbWFpbCB9KSxcclxuICAgIH0pO1xyXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgIGRpc3BhdGNoKHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfU1VDQ0VTUyxcclxuICAgICAgICB0b2tlbjogcmVzdWx0LnRva2VuLFxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MDApIHtcclxuICAgICAgY29uc3QgeyBlcnJvcnMgfSA9IHJlc3VsdDtcclxuICAgICAgZXJyb3JzLmZvckVhY2goKGVycm9yKSA9PiB7XHJcbiAgICAgICAgZGlzcGF0Y2goXHJcbiAgICAgICAgICBzZXJ2ZXJWYWxpZGF0aW9uKHtcclxuICAgICAgICAgICAgc3RhdHVzOiBlcnJvcixcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNTAwKSB7XHJcbiAgICAgIGNvbnN0IHsgZXJyb3IgfSA9IHJlc3VsdDtcclxuXHJcbiAgICAgIGRpc3BhdGNoKHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfRkFJTEVELFxyXG4gICAgICAgIGVycm9yLFxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2hhbmdpbmcgcGFzc3dvcmQgZmFpbGVkJyk7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGRpc3BhdGNoKHtcclxuICAgICAgdHlwZTogYWN0aW9uVHlwZXMuUkVRVUVTVF9QQVNTX0NIQU5HRV9GQUlMRUQsXHJcbiAgICAgIHBheWxvYWQ6IHsgZXJyb3I6IGVyciB9LFxyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0VG9rZW5Gcm9tVXJsKHsgdG9rZW4gfSkge1xyXG4gIHJldHVybiB7XHJcbiAgICB0eXBlOiBhY3Rpb25UeXBlcy5HT1RfVE9LRU5fRlJPTV9VUkwsXHJcbiAgICB0b2tlbixcclxuICB9O1xyXG59XHJcbiJdLCJuYW1lcyI6WyJzdHlsZUluamVjdCIsImNzcyIsInJlZiIsImluc2VydEF0IiwiZG9jdW1lbnQiLCJoZWFkIiwiZ2V0RWxlbWVudHNCeVRhZ05hbWUiLCJzdHlsZSIsImNyZWF0ZUVsZW1lbnQiLCJ0eXBlIiwiZmlyc3RDaGlsZCIsImluc2VydEJlZm9yZSIsImFwcGVuZENoaWxkIiwic3R5bGVTaGVldCIsImNzc1RleHQiLCJjcmVhdGVUZXh0Tm9kZSIsIlZBTElEIiwiSU5WQUxJRCIsIklOQUNUSVZFIiwiRU1BSUxfRk9STUFUX1ZBTElEQVRJT04iLCJQQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTiIsIlVTRVJOQU1FX0ZPUk1BVF9WQUxJREFUSU9OIiwiVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT04iLCJFTVBUWV9TVFJJTkdfVkFMSURBVElPTiIsIlBBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OIiwiSU5WQUxJRF9DUkVERU5USUFMUyIsIlVTRVJOQU1FX1RBS0VOIiwiUkVHSVNURVJFRF9FTUFJTCIsIkVNQUlMX05PVF9SRUdJU1RFUkVEIiwiVVNFUk5BTUVfTk9UX1JFR0lTVEVSRUQiLCJJTlZBTElEX1BBU1NXT1JEIiwiSU5WQUxJRF9FTUFJTCIsIklOVkFMSURfVVNFUk5BTUUiLCJJTlZBTElEX0VNUFRZX1NUUklORyIsIklOVkFMSURfVVNFUk5BTUVfT1JfRU1BSUwiLCJQQVNTV09SRFNfRE9fTk9UX01BVENIIiwicGFzc3dvcmRSZWdleCIsImVtYWlsUmVnZXgiLCJ1c2VybmFtZVJlZ2V4IiwidmFsaWRhdGVFbWFpbENvbnN0cmFpbnQiLCJlbWFpbCIsImVtYWlsQ29uc3RyYWludCIsIlJlZ0V4cCIsInRlc3QiLCJ2YWxpZGF0aW9uVHlwZSIsInZhbGlkYXRpb25UeXBlcyIsInZhbGlkYXRpb25TdGF0ZSIsIm1lc3NhZ2UiLCJ2YWxpZGF0aW9uTWVzc2FnZXMiLCJpc0NsaWVudFZhbGlkYXRpb25UeXBlIiwidmFsaWRhdGVQYXNzd29yZENvbnN0cmFpbnQiLCJwYXNzd29yZCIsInBhc3N3b3JkQ29uc3RyYWludCIsInZhbGlkYXRlVXNlck5hbWVDb25zdHJhaW50IiwidXNlcm5hbWUiLCJ1c2VybmFtZUNvbnN0cmFpbnQiLCJ2YWxpZGF0ZUVtYWlsT3JVc2VybmFtZSIsInZhbHVlIiwidmFsaWRhdGVFbXB0eVN0cmluZyIsImxlbmd0aCIsInZhbGlkYXRlUGFzc3dvcmRNYXRjaCIsInN0YXRlIiwiY29uZmlybSIsImF1dGgiLCJJTklUX0ZPUk1fVkFMSURBVElPTl9TVEFURSIsIlJFU0VUX1ZBTElEQVRJT05fU1RBVEUiLCJJTlBVVF9CTFVSUkVEIiwiSU5QVVRfRk9DVVNFRCIsIlNFUlZFUl9WQUxJREFUSU9OIiwiQ0xJRU5UX1ZBTElEQVRJT04iLCJJTkNfSU5QVVRfQ09VVE4iLCJjcmVkZW50aWFsSW52YWxpZCIsInVzZXJuYW1lSXNUYWtlbiIsImVtYWlsSXNSZWdpc3RlcmVkIiwidXNlcm5hbWVJbnZhbGlkIiwicGFzc3dvcmRJbnZhbGlkIiwiZW1haWxJbnZhbGlkIiwiZW1haWxJc05vdFJlZ2lzdGVyZWQiLCJlbXB0eVN0cmluZ05vdFZhbGlkIiwiZW1haWxvcnVzZXJuYW1lTm90VmFsaWQiLCJ1c2VybmFtZUlzTm90UmVnaXN0ZXJlZCIsInBhc3N3b3JkRG9Ob3RNYXRjaCIsInRva2VuRXhwaXJlZCIsInNlcnZlclZhbGlkYXRpb25SYW5nZSIsInN0YXR1cyIsImNsaWVudFZhbGlkYXRpb24iLCJ2YWxpZGF0aW9uIiwiY29uc3RWYWxUeXBlcyIsInZhbGlkYXRpb25zIiwiYWN0aW9uVHlwZXMiLCJyZXNldElucHV0VmFsaWRhdGlvblN0YXRlIiwic2VydmVyVmFsaWRhdGlvbiIsImh0dHBTdGF0dXMiLCJ2YWxpZGF0aW9uU3RhdGVzIiwiaW1nIiwiSWNvblN0YXRlIiwib3BlbiIsIm9wZW5JY29uIiwiY2xvc2VJY29uIiwiRXllSWNvbiIsIm9uQ2xpY2siLCJzZXRTdGF0ZSIsInVzZVN0YXRlIiwidG9nZ2xlIiwicHJldiIsImRpc3BsYXkiLCJhbGlnbkl0ZW1zIiwianVzdGlmeUNvbnRlbnQiLCJtYXJnaW4iLCJpbml0U3RhdGUiLCJmb3JtUmVkdWNlciIsImFjdGlvbiIsIm5leHRTdGF0ZSIsImZvcm1TdGF0ZSIsInByb3BOYW1lIiwiY291bnQiLCJGb3JtQ29udGV4dCIsImNyZWF0ZUNvbnRleHQiLCJ1c2VGb3JtQ29udGV4dCIsImNvbnRleHQiLCJ1c2VDb250ZXh0IiwiRXJyb3IiLCJkaXNwYXRjaCIsIkZvcm1Qcm92aWRlciIsInByb3BzIiwidXNlUmVkdWNlciIsInVzZU1lbW8iLCJWYWxpZGl0eUljb24iLCJ2YWxpZCIsInN0YXRlQ29sb3IiLCJmbGV4IiwiY29sb3IiLCJsaW5lSGVpZ2h0Iiwid2lkdGgiLCJ0ZXh0QWxpZ24iLCJpbnB1dCIsImJvcmRlciIsInBhZGRpbmciLCJib3JkZXJSYWRpdXMiLCJyb290IiwiZmxleERpcmVjdGlvbiIsImJhY2tncm91bmRDb2xvciIsIm1hcmdpbkJvdHRvbSIsImlucHV0Q29udGFpbmVyIiwicGFkZGluZ0xlZnQiLCJJbnB1dCIsInBsYWNlaG9sZGVyIiwibmFtZSIsIm9uQ2hhbmdlIiwiaWQiLCJpbnB1dFZhbGlkYXRpb24iLCJzZXRJbnB1dFZhbGlkYXRpb24iLCJ1bmRlZmluZWQiLCJpbnB1dFR5cGUiLCJzZXRJbnB1dFR5cGUiLCJib3JkZXJDb2xvciIsInNldEJvcmRlckNvbG9yIiwidXNlRWZmZWN0IiwiaGFuZGxlRm9jdXMiLCJmb3JFYWNoIiwidmFsaWRhdGlvbk5hbWUiLCJmb3JtIiwiYWN0aW9ucyIsImhhbmRsZUJsdXIiLCJ0b2dnbGVFeWUiLCJtYXAiLCJCdXR0b24iLCJ0aXRsZSIsImRpc2FibGVkIiwiaGVpZ2h0IiwiRm9ybSIsImNoaWxkcmVuIiwiZm9ybVRpdGxlIiwiZXJyb3IiLCJWQUxVRV9DSEFOR0VEIiwiTE9HSU5fU1RBUlRFRCIsIkxPR0lOX1NVQ0NFU1MiLCJMT0dJTl9GQUlMRUQiLCJMT0dPVVRfU1RBUlRFRCIsIkxPR09VVF9GQUlMRUQiLCJMT0dPVVRfU1VDQ0VTUyIsIlNJR05VUF9TVEFSVEVEIiwiU0lHTlVQX1NVQ0NFU1MiLCJTSUdOVVBfRkFJTEVEIiwiQ0hBTkdFX1BBU1NXT1JEX1NUQVJURUQiLCJDSEFOR0VfUEFTU1dPUkRfU1VDQ0VTUyIsIkNIQU5HRV9QQVNTV09SRF9GQUlMRUQiLCJSRVFVRVNUX1BBU1NfQ0hBTkdFX1NUQVJURUQiLCJSRVFVRVNUX1BBU1NfQ0hBTkdFX1NVQ0NFU1MiLCJSRVFVRVNUX1BBU1NfQ0hBTkdFX0ZBSUxFRCIsIkdPVF9UT0tFTl9GUk9NX1VSTCIsInZhbHVlQ2hhbmdlZCIsInBheWxvYWQiLCJsb2dpbiIsImVtYWlsb3J1c2VybmFtZSIsInJlc3BvbnNlIiwiZmV0Y2giLCJwcm9jZXNzIiwiZW52IiwiUkVBQ1RfQVBQX1hBRl9TRVJWRVJfVVJMIiwiaGVhZGVycyIsIkF1dGhvcml6YXRpb24iLCJidG9hIiwibWV0aG9kIiwicmVzdWx0IiwianNvbiIsInRva2VuIiwiZXJyb3JzIiwic2lnbnVwIiwiYm9keSIsIkpTT04iLCJzdHJpbmdpZnkiLCJDb250ZW50VHlwZSIsIkFjY2VwdCIsImNoYW5nZVBhc3N3b3JkIiwiY3VycmVudCIsImZvcmdvdFBhc3N3b3JkIiwiZXJyIl0sIm1hcHBpbmdzIjoiOztBQUFBLFNBQVNBLFdBQVQsQ0FBcUJDLEdBQXJCLEVBQTBCQyxHQUExQixFQUErQjtBQUM3QixNQUFLQSxHQUFHLEtBQUssS0FBSyxDQUFsQixFQUFzQkEsR0FBRyxHQUFHLEVBQU47QUFDdEIsTUFBSUMsUUFBUSxHQUFHRCxHQUFHLENBQUNDLFFBQW5COztBQUVBLE1BQUksQ0FBQ0YsR0FBRCxJQUFRLE9BQU9HLFFBQVAsS0FBb0IsV0FBaEMsRUFBNkM7QUFBRTtBQUFTOztBQUV4RCxNQUFJQyxJQUFJLEdBQUdELFFBQVEsQ0FBQ0MsSUFBVCxJQUFpQkQsUUFBUSxDQUFDRSxvQkFBVCxDQUE4QixNQUE5QixFQUFzQyxDQUF0QyxDQUE1QjtBQUNBLE1BQUlDLEtBQUssR0FBR0gsUUFBUSxDQUFDSSxhQUFULENBQXVCLE9BQXZCLENBQVo7QUFDQUQsRUFBQUEsS0FBSyxDQUFDRSxJQUFOLEdBQWEsVUFBYjs7QUFFQSxNQUFJTixRQUFRLEtBQUssS0FBakIsRUFBd0I7QUFDdEIsUUFBSUUsSUFBSSxDQUFDSyxVQUFULEVBQXFCO0FBQ25CTCxNQUFBQSxJQUFJLENBQUNNLFlBQUwsQ0FBa0JKLEtBQWxCLEVBQXlCRixJQUFJLENBQUNLLFVBQTlCO0FBQ0QsS0FGRCxNQUVPO0FBQ0xM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
