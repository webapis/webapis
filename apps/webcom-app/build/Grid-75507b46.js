import { d as useFormContext, h, f as validationStates, c as useAuthContext, i as isClientValidationType, g as clientValidation, r as resetInputValidationState, j as v, s as styleInject, k as useThemeContext, _ as _extends } from './index-0a9268ae.js';

function ValidationMessage({
  validationTypes,
  name
}) {
  const {
    state
  } = useFormContext();
  return validationTypes.map(validationName => {
    if (state.validation[validationName]) {
      const {
        message
      } = state.validation[validationName];
      return h("div", {
        key: validationName,
        style: {
          color: 'red',
          paddingLeft: 3
        }
      }, message !== '' && h("div", {
        role: "message",
        "data-testid": `message-${name}`
      }, `* ${message}`));
    }
  });
}

function ValidityTickState({
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

function ValidityIcon({
  validationTypes
}) {
  const {
    state
  } = useFormContext();
  return validationTypes.map(validationName => {
    if (state.validation[validationName]) {
      const {
        validationState
      } = state.validation[validationName];

      if (validationState === validationStates.VALID || validationState === validationStates.INVALID) {
        return h(ValidityTickState, {
          key: validationName,
          valid: validationState
        });
      }

      return null;
    }
  });
}

function useClientValidation({
  validationTypes,
  value,
  name
}) {
  const {
    state,
    dispatch
  } = useFormContext();
  const {
    state: auth
  } = useAuthContext();

  function validate() {
    validationTypes.forEach(validationName => {
      if (isClientValidationType({
        validationType: validationName
      })) {
        dispatch(clientValidation({
          validationType: validationName,
          value: auth[name],
          state,
          auth
        }));
      }
    });
  }

  function resetValidationState() {
    validationTypes.forEach(validationName => {
      if (state.validation[validationName]) {
        dispatch(resetInputValidationState({
          validationType: validationName
        }));
      }
    });
  }

  return {
    validate,
    resetValidationState
  };
}

const img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAACsklEQVR4nO2au24TQRSGP9sK0FgiIgLlIoUuqQNUVOHSmBLegHQUgS7PgZIOhKmIYihi3sAICQpSJKEECSsGgkKLJUuRKWYWHLOLd+fM7trx+aSRJWtn/v/Yu7MzZw4oiqIoiqIoijKOFDLQOANcAa4DS8BF4AIwZT8BfgJH9vMHsAO8BT4AnQw8eucSsAa8AdpA17G17RhrdsyhpgDcBmqYf8016KjWsWPfIps7NxE3gF38Bx3Vdq1m7lwGXpFd4P3tJTCfdpBRPET2fPtqbWA15VhPcBZ47jkIH61qvaXKDPA+xyAHtXfAdFrBzwFNocEmsA5UgAWgbNuC/W7dg8YX69Urk8BHgakD4D5QiqFVste2BHr7wHlRxD2cwyxGXM1sY/7lpJSBukC3Yb2L2RSYeAwUBdpFO4ar/qZAG4B7AvFt/KzYisjuhLuuwpPAd0fRA9xu+yjKuM8J32wsiak6CnYxk5hvVgR+niUVuyYQaxJvtk9KCdkr8mrYoFET1COB0TpwLOgfxTHwWtA/dkyzyLazFYHJQVQEvjqYlewJwu6AB8CEwOQnQd9BfBb0ncDENpBD3H/lLn5n/37KQm+H/QNKFimngrAf4KlwzH+eM4/MCvs/iSsy1pNgC5NqkphMizuCvjXga9yLx2Yh9D+qArGRXwqDbDPU4hRshkC+Hfbxms1tOxwwygmRFwLtP0hTYnVGPCUG5hnaF5hpYSaxuEnRFWRJ0T08JkUD5jApZ1dTXcxrbAOzVljkb1p80X63wZCmxQNmMIcPEoNptlQPRgLG+misl1WG43D0FxkfjvYyj9k35BV8jRyPx3tZJvsCieVMIktAAVO+skV6JTJbwE2GsESmn6BIqoG8SKpBikVSWZXJLRFeJjdlrzkivExuhxEtk1MURVEURVEUZbj5DckMFeQhrFj9AAAAAElFTkSuQmCC";

const img$1 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAADs0lEQVR4nO3bS2hcVRzH8U9ao9IymoIoSmOqLa0rN75wK4JatJQaFezCiNKtiFBc6NKVdCOKC1ErIooKoqCC4FvRjSK1ii5EDWhNUfEFgRiMizORNL03cx5zZ2Jyf/AnMMmc3///zbn3ntelVatWrU7UXsx0Y9+QcxmKZrDQjb8xOdx0Bq+lANYlhH1C0csh3DTMpAatSS2EWgg3DzOpQauFYI1DGIn8u0k8i1OWfDaP/Xi+x3e34DJc3I1d3c/O7MY/+AU/d38ex6f4EJ9gLjLHxlXVE+ZV94QLcDfervhOSszifdyLc5opK029IFyNV4X/am7RdTGHF7oesT23EdVB+FL/i66LI7iq6UJXUhWEYcSLmGi41lqtFgizuKvhWmu1WiAs4DBOa7TaGq0mCB/j3KYKPR9vYXvF72IhHMMhXC9cu5vQEcYGu/EwpiPaWSm+x9Y+1g3Oxtddg2npEH7CFEYjvDbiDvxQ01ZMHMVYapF12iyMyJYapEI4kOHbwSsVbcXGezg9w/ckPVFjkAJhHrdkeG/AQzX+MfFchucJ2t/DYFAQSnrCjRme4Dz8GWEwCAgd+feEY8LkK1mHE0wGAeHOhHyWx5OpZpdkmDQNYaOyR+SlKWavZZpMY1tFe/2C8EhmXgt4JtZku7Lp7LU17fYDwu6CvOaE+1pPPVhgsoDxFdouhXBRYW4PxJgcLzTpNSEpgdApzG0mwqMYQMwQNBfCpsLcogAcKjS5IsZEHoSJwtyiLoFdhSa3xZh0lQrhhoK8om+C8HqB0WOxJl2lQCjpndGPQfIGQosxi7NSzMRBGBWGtbl5JQ2ECBseuWb3p5rpDWGqIJ/HM/KxFb9nGv6BnRmedRAOCIsqObn8qGBx5PZM0wV8LiympKrfa4x7M3L4TyPKLoWXDBfCUxneJ2mzsFmZm8QR7MjwLYXwJk7N8K3UOL4rSOY33Kc/T4eY+AxnZNS5orbh24xklsasME6YEkaMY8LcYRzXqN7mSoXwjYb3Bo4mJJMaOUvuS+Md6b0sWR28HJHMoCE8Km7foS/agHuELr0aIDzd/xLjtBPvViQ0aAh1J1UGohHs0cwBif8NBMKq7R68of8QLqzwW5UQFrUDB/GRsuLnhD2+62p8io/wDeKw0Rgux5XCouaE8DjtCGOAUWHy9KtwVO4rfCGMID/AXz3arzvCd6twqGpdqD3brIWAegjr6n2HFoJ6COvqHagqCFEbI2tJyyGsOwCEbr/4GmDR+mCrVq3Wnv4Frrcuj2OfR5sAAAAASUVORK5CYII=";

function IconState({
  open
}) {
  if (open) {
    return h("img", {
      style: {
        width: 25
      },
      src: img
    });
  }

  return h("img", {
    style: {
      width: 25
    },
    src: img$1
  });
}

function EyeIcon({
  onClick,
  inputType
}) {
  const [state, setState] = v(false);

  function toggle() {
    onClick();
    setState(prev => !prev);
  }

  if (inputType === 'password') return h("div", {
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
  return null;
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
    validate,
    resetValidationState
  } = useClientValidation({
    validationTypes,
    value,
    name
  });
  const [focused, setFocused] = v(false);
  const [inputType, setInputType] = v(type);

  function handleFocus() {
    resetValidationState();
    setFocused(true);
  }

  function handleBlur(e) {
    if (e.target.name === name) {
      validate();
    }
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
    style: { ...style.input
    },
    type: inputType,
    name: name,
    onChange: onChange,
    value: value,
    onBlur: handleBlur,
    placeholder: placeholder,
    onFocus: handleFocus,
    "data-testid": id
  }), h(ValidityIcon, {
    validationTypes: validationTypes
  }), h(EyeIcon, {
    inputType: type,
    onClick: toggleEye
  })), h(ValidationMessage, {
    validationTypes: validationTypes,
    name: name
  }));
}

var css_248z = ".btn {\r\n  padding: 6px 16px;\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-box-align: center;\r\n      -ms-flex-align: center;\r\n          align-items: center;\r\n  border: none;\r\n  -webkit-box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);\r\n          box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);\r\n  min-width: 64px;\r\n  font-weight: 500;\r\n  font-size: 0.875rem;\r\n  -webkit-box-sizing: border-box;\r\n          box-sizing: border-box;\r\n}";
styleInject(css_248z);

function Button(props) {
  const theme = useThemeContext();
  const {
    onClick,
    title,
    disabled,
    id,
    color = 'primary'
  } = props;
  return h("button", _extends({
    className: "btn",
    "data-testid": id,
    disabled: disabled,
    style: { ...theme[color]
    },
    onClick: onClick
  }, props), title);
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

export { Button as B, Form as F, Grid as G, Input as I, Paper as P };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3JpZC03NTUwN2I0Ni5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY2xpZW50L2Zvcm0vVmFsaWRhdGlvbk1lc3NhZ2UuanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS9WYWxpZGl0eUljb24uanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS91c2VDbGllbnRWYWxpZGF0aW9uLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vaWNvbnMvb3BlbkV5ZS5wbmciLCIuLi8uLi8uLi9jbGllbnQvZm9ybS9pY29ucy9jbG9zZUV5ZS5wbmciLCIuLi8uLi8uLi9jbGllbnQvZm9ybS9FeWVJY29uLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vSW5wdXQuanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS9CdXR0b24uanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS9Gb3JtLmpzIiwiLi4vLi4vLi4vY2xpZW50L2xheW91dC9QYXBlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9sYXlvdXQvR3JpZC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlRm9ybUNvbnRleHQgfSBmcm9tICcuL2Zvcm0tY29udGV4dCc7XHJcbmV4cG9ydCBmdW5jdGlvbiBWYWxpZGF0aW9uTWVzc2FnZSh7IHZhbGlkYXRpb25UeXBlcyxuYW1lIH0pIHtcclxuICBjb25zdCB7IHN0YXRlIH0gPSB1c2VGb3JtQ29udGV4dCgpO1xyXG4gIHJldHVybiB2YWxpZGF0aW9uVHlwZXMubWFwKCh2YWxpZGF0aW9uTmFtZSkgPT4ge1xyXG4gICAgaWYgKHN0YXRlLnZhbGlkYXRpb25bdmFsaWRhdGlvbk5hbWVdKSB7XHJcbiAgIFxyXG4gICAgICBjb25zdCB7IG1lc3NhZ2UgfSA9IHN0YXRlLnZhbGlkYXRpb25bdmFsaWRhdGlvbk5hbWVdO1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXZcclxuICAgICAgICAgIGtleT17dmFsaWRhdGlvbk5hbWV9XHJcbiAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICBjb2xvcjogJ3JlZCcsXHJcbiAgICAgICAgICAgIHBhZGRpbmdMZWZ0OiAzLFxyXG4gICAgICAgICAgfX1cclxuICAgICAgICA+XHJcbiAgICAgICAgICB7bWVzc2FnZSAhPT0gJycgJiYgKFxyXG4gICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgcm9sZT0nbWVzc2FnZSdcclxuICAgICAgICAgICAgICBkYXRhLXRlc3RpZD17YG1lc3NhZ2UtJHtuYW1lfWB9XHJcbiAgICAgICAgICAgID57YCogJHttZXNzYWdlfWB9PC9kaXY+XHJcbiAgICAgICAgICApfVxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgdmFsaWRhdGlvblN0YXRlcyBmcm9tICcuL3ZhbGlkYXRpb25TdGF0ZXMnO1xyXG5pbXBvcnQgeyB1c2VGb3JtQ29udGV4dCB9IGZyb20gJy4vZm9ybS1jb250ZXh0JztcclxuZnVuY3Rpb24gVmFsaWRpdHlUaWNrU3RhdGUoeyB2YWxpZCB9KSB7XHJcbiAgbGV0IHN0YXRlQ29sb3IgPSAnIzRmYzNmNyc7XHJcbiAgc3dpdGNoICh2YWxpZCkge1xyXG4gICAgY2FzZSB2YWxpZGF0aW9uU3RhdGVzLlZBTElEOlxyXG4gICAgICBzdGF0ZUNvbG9yID0gJ2dyZWVuJztcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRDpcclxuICAgICAgc3RhdGVDb2xvciA9ICdyZWQnO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgdmFsaWRhdGlvblN0YXRlcy5JTkFDVElWRTpcclxuICAgICAgc3RhdGVDb2xvciA9ICcjNGZjM2Y3JztcclxuICAgICAgYnJlYWs7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICBzdGF0ZUNvbG9yID0gJyM0ZmMzZjcnO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgc3R5bGU9e3tcclxuICAgICAgICBmbGV4OiAxLFxyXG4gICAgICAgIGNvbG9yOiBzdGF0ZUNvbG9yLFxyXG4gICAgICAgIGxpbmVIZWlnaHQ6IDIsXHJcbiAgICAgICAgd2lkdGg6IDIwLFxyXG4gICAgICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXHJcbiAgICAgIH19XHJcbiAgICA+XHJcbiAgICAgIHt2YWxpZCA/ICfinJMnIDogJ+KYkyd9XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gVmFsaWRpdHlJY29uKHsgdmFsaWRhdGlvblR5cGVzIH0pIHtcclxuICBjb25zdCB7IHN0YXRlIH0gPSB1c2VGb3JtQ29udGV4dCgpO1xyXG4gIHJldHVybiB2YWxpZGF0aW9uVHlwZXMubWFwKCh2YWxpZGF0aW9uTmFtZSkgPT4ge1xyXG4gICAgaWYgKHN0YXRlLnZhbGlkYXRpb25bdmFsaWRhdGlvbk5hbWVdKSB7XHJcbiAgICAgIGNvbnN0IHsgdmFsaWRhdGlvblN0YXRlIH0gPSBzdGF0ZS52YWxpZGF0aW9uW3ZhbGlkYXRpb25OYW1lXTtcclxuICAgICAgaWYgKFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZSA9PT0gdmFsaWRhdGlvblN0YXRlcy5WQUxJRCB8fFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZSA9PT0gdmFsaWRhdGlvblN0YXRlcy5JTlZBTElEXHJcbiAgICAgICkge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICA8VmFsaWRpdHlUaWNrU3RhdGUga2V5PXt2YWxpZGF0aW9uTmFtZX0gdmFsaWQ9e3ZhbGlkYXRpb25TdGF0ZX0gLz5cclxuICAgICAgICApO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59XHJcbiIsImltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IHVzZUZvcm1Db250ZXh0IH0gZnJvbSAnLi9mb3JtLWNvbnRleHQnO1xyXG5pbXBvcnQgeyB1c2VBdXRoQ29udGV4dCB9IGZyb20gJy4uL2F1dGgvYXV0aC1jb250ZXh0JztcclxuaW1wb3J0IHsgaXNDbGllbnRWYWxpZGF0aW9uVHlwZSB9IGZyb20gJy4vY29uc3RyYWludFZhbGlkYXRvcnMnO1xyXG5pbXBvcnQgKiBhcyBhY3Rpb25zIGZyb20gJy4vYWN0aW9ucyc7XHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VDbGllbnRWYWxpZGF0aW9uKHsgdmFsaWRhdGlvblR5cGVzLCB2YWx1ZSwgbmFtZSB9KSB7XHJcbiAgY29uc3QgeyBzdGF0ZSwgZGlzcGF0Y2ggfSA9IHVzZUZvcm1Db250ZXh0KCk7XHJcbiAgY29uc3QgeyBzdGF0ZTogYXV0aCB9ID0gdXNlQXV0aENvbnRleHQoKTtcclxuXHJcbiBcclxuXHJcbiAgZnVuY3Rpb24gdmFsaWRhdGUoKSB7XHJcbiAgIFxyXG4gICAgdmFsaWRhdGlvblR5cGVzLmZvckVhY2goKHZhbGlkYXRpb25OYW1lKSA9PiB7XHJcbiAgICAgIGlmIChpc0NsaWVudFZhbGlkYXRpb25UeXBlKHsgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25OYW1lIH0pKSB7XHJcbiAgICAgICAgZGlzcGF0Y2goXHJcbiAgICAgICAgICBhY3Rpb25zLmNsaWVudFZhbGlkYXRpb24oe1xyXG4gICAgICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvbk5hbWUsXHJcbiAgICAgICAgICAgIHZhbHVlOiBhdXRoW25hbWVdLFxyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgYXV0aCxcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiByZXNldFZhbGlkYXRpb25TdGF0ZSgpIHtcclxuICAgIHZhbGlkYXRpb25UeXBlcy5mb3JFYWNoKCh2YWxpZGF0aW9uTmFtZSkgPT4ge1xyXG4gICAgICBpZiAoc3RhdGUudmFsaWRhdGlvblt2YWxpZGF0aW9uTmFtZV0pIHtcclxuICAgICAgICBkaXNwYXRjaChcclxuICAgICAgICAgIGFjdGlvbnMucmVzZXRJbnB1dFZhbGlkYXRpb25TdGF0ZSh7IHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uTmFtZSB9KVxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHsgdmFsaWRhdGUsIHJlc2V0VmFsaWRhdGlvblN0YXRlIH07XHJcbn1cclxuIiwiY29uc3QgaW1nID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUVBQUFBQkFDQVlBQUFDcWFYSGVBQUFBQ1hCSVdYTUFBQXNUQUFBTEV3RUFtcHdZQUFBQ3NrbEVRVlI0bk8yYXUyNFRRUlNHUDlzSzBGZ2lJZ0xsSW9VdXFRTlVWT0hTbUJMZWdIUVVnUzdQZ1pJT2hLbUlZaWhpM3NBSUNRcFNKS0VFQ1NzR2drS0xKVXVSS1dZV0hMT0xkK2ZNN3RyeCthU1JKV3RuL3YvWXU3TXpadzRvaXFJb2lxSW9paktPRkRMUU9BTmNBYTREUzhCRjRBSXdaVDhCZmdKSDl2TUhzQU84QlQ0QW5RdzhldWNTc0FhOEFkcEExN0cxN1JocmRzeWhwZ0RjQm1xWWY4MDE2S2pXc1dQZklwczdOeEUzZ0YzOEJ4M1ZkcTFtN2x3R1hwRmQ0UDN0SlRDZmRwQlJQRVQyZlB0cWJXQTE1VmhQY0JaNDdqa0lINjFxdmFYS0RQQSt4eUFIdFhmQWRGckJ6d0ZOb2NFbXNBNVVnQVdnYk51Qy9XN2RnOFlYNjlVcms4QkhnYWtENEQ1UWlxRlZzdGUyQkhyN3dIbFJ4RDJjd3l4R1hNMXNZLzdscEpTQnVrQzNZYjJMMlJTWWVBd1VCZHBGTzRhci9xWkFHNEI3QXZGdC9Lellpc2p1aEx1dXdwUEFkMGZSQTl4dSt5akt1TThKMzJ3c2lhazZDbll4azVodlZnUituaVVWdXlZUWF4SnZ0azlLQ2RrcjhtcllvRkVUMUNPQjBUcHdMT2dmeFRId1d0QS9ka3l6eUxhekZZSEpRVlFFdmpxWWxld0p3dTZBQjhDRXdPUW5RZDlCZkJiMG5jREVOcEJEM0gvbExuNW4vMzdLUW0rSC9RTktGaW1uZ3JBZjRLbHd6SCtlTTQvTUN2cy9pU3N5MXBOZ0M1TnFrcGhNaXp1Q3ZqWGdhOXlMeDJZaDlEK3FBckdSWHdxRGJEUFU0aFJzaGtDK0hmYnhtczF0T3h3d3lnbVJGd0x0UDBoVFluVkdQQ1VHNWhuYUY1aHBZU2F4dUVuUkZXUkowVDA4SmtVRDVqQXBaMWRUWGN4cmJBT3pWbGprYjFwODBYNjN3WkNteFFObU1JY1BFb05wdGxRUFJnTEcrbWlzbDFXRzQzRDBGeGtmanZZeWo5azM1QlY4alJ5UHgzdFpKdnNDaWVWTUlrdEFBVk8rc2tWNkpUSmJ3RTJHc0VTbW42Qklxb0c4U0twQmlrVlNXWlhKTFJGZUpqZGxyemtpdkV4dWh4RXRrMU1VUlZFVVJWRVVaYmo1RGNrTUZlUWhyRmo5QUFBQUFFbEZUa1N1UW1DQ1wiO1xuICBleHBvcnQgZGVmYXVsdCBpbWc7IiwiY29uc3QgaW1nID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUVBQUFBQkFDQVlBQUFDcWFYSGVBQUFBQ1hCSVdYTUFBQXNUQUFBTEV3RUFtcHdZQUFBRHMwbEVRVlI0bk8zYlMyaGNWUnpIOFU5YW85SXltb0lvU21PcUxhMHJONzV3SzRKYXRKUWFGZXpDaU5LdGlGQmM2TktWZENPS0MxRXJJb29Lb3FDQzRGdlJqU0sxaWk1RURXaE5VZkVGZ1JpTWl6T1JOTDAzY3g1eloySnlmL0FuTU1tYzMvLy96Ym4zbnRlbFZhdFdyVTdVWHN4MFk5K1FjeG1LWnJEUWpiOHhPZHgwQnErbEFOWWxoSDFDMGNzaDNEVE1wQWF0U1MyRVdnZzNEek9wUWF1RllJMURHSW44dTBrOGkxT1dmRGFQL1hpK3gzZTM0REpjM0kxZDNjL083TVkvK0FVL2QzOGV4NmY0RUo5Z0xqTEh4bFhWRStaVjk0UUxjRGZlcnZoT1NzemlmZHlMYzVvcEswMjlJRnlOVjRYL2FtN1JkVEdIRjdvZXNUMjNFZFZCK0ZML2k2NkxJN2lxNlVKWFVoV0VZY1NMbUdpNDFscXRGZ2l6dUt2aFdtdTFXaUFzNERCT2E3VGFHcTBtQ0IvajNLWUtQUjl2WVh2RjcySWhITU1oWEM5Y3U1dlFFY1lHdS9Fd3BpUGFXU20reDlZKzFnM094dGRkZzJucEVIN0NGRVlqdkRiaUR2eFEwMVpNSE1WWWFwRjEyaXlNeUpZYXBFSTRrT0hid1NzVmJjWEdlemc5dy9ja1BWRmprQUpoSHJka2VHL0FRelgrTWZGY2h1Y0oydC9EWUZBUVNuckNqUm1lNER6OEdXRXdDQWdkK2ZlRVk4TGtLMW1IRTB3R0FlSE9oSHlXeDVPcFpwZGttRFFOWWFPeVIrU2xLV2F2WlpwTVkxdEZlLzJDOEVobVhndDRKdFprdTdMcDdMVTE3ZllEd3U2Q3ZPYUUrMXBQUFZoZ3NvRHhGZG91aFhCUllXNFB4SmdjTHpUcE5TRXBnZEFwekcwbXdxTVlRTXdRTkJmQ3BzTGNvZ0FjS2pTNUlzWkVIb1NKd3R5aUxvRmRoU2EzeFpoMGxRcmhob0s4b20rQzhIcUIwV094SmwybFFDanBuZEdQUWZJR1Fvc3hpN05Tek1SQkdCV0d0Ymw1SlEyRUNCc2V1V2IzcDVycERXR3FJSi9ITS9LeEZiOW5HdjZCblJtZWRSQU9DSXNxT2JuOHFHQng1UFpNMHdWOExpeW1wS3JmYTR4N00zTDRUeVBLTG9XWERCZkNVeG5lSjJtenNGbVptOFFSN01qd0xZWHdKazdOOEszVU9MNHJTT1kzM0tjL1Q0ZVkrQXhuWk5TNW9yYmgyNHhrbHNhc01FNllFa2FNWThMY1lSelhxTjdtU29Yd2pZYjNCbzRtSkpNYU9VdnVTK01kNmIwc1dSMjhISkhNb0NFOEttN2ZvUy9hZ0h1RUxyMGFJRHpkL3hManRCUHZWaVEwYUFoMUoxVUdvaEhzMGN3QmlmOE5CTUtxN1I2OG9mOFFMcXp3VzVVUUZyVURCL0dSc3VMbmhEMis2MnA4aW8vd0RlS3cwUmd1eDVYQ291YUU4RGp0Q0dPQVVXSHk5S3R3Vk80cmZDR01JRC9BWHozYXJ6dkNkNnR3cUdwZHFEM2JySVdBZWdqcjZuMkhGb0o2Q092cUhhZ3FDRkViSTJ0Snl5R3NPd0NFYnIvNEdtRFIrbUNyVnEzV252NEZycmN1ajJPZlI1c0FBQUFBU1VWT1JLNUNZSUk9XCI7XG4gIGV4cG9ydCBkZWZhdWx0IGltZzsiLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlU3RhdGUgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgb3Blbkljb24gZnJvbSAnLi9pY29ucy9vcGVuRXllLnBuZyc7XHJcbmltcG9ydCBjbG9zZUljb24gZnJvbSAnLi9pY29ucy9jbG9zZUV5ZS5wbmcnO1xyXG5mdW5jdGlvbiBJY29uU3RhdGUoeyBvcGVuIH0pIHtcclxuICBpZiAob3Blbikge1xyXG4gICAgcmV0dXJuIDxpbWcgc3R5bGU9e3sgd2lkdGg6IDI1IH19IHNyYz17b3Blbkljb259IC8+O1xyXG4gIH1cclxuICByZXR1cm4gPGltZyBzdHlsZT17eyB3aWR0aDogMjUgfX0gc3JjPXtjbG9zZUljb259IC8+O1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBFeWVJY29uKHsgb25DbGljayxpbnB1dFR5cGUgfSkge1xyXG4gIGNvbnN0IFtzdGF0ZSwgc2V0U3RhdGVdID0gdXNlU3RhdGUoZmFsc2UpO1xyXG4gIGZ1bmN0aW9uIHRvZ2dsZSgpIHtcclxuICAgIG9uQ2xpY2soKTtcclxuICAgIHNldFN0YXRlKChwcmV2KSA9PiAhcHJldik7XHJcbiAgfVxyXG4gIGlmIChpbnB1dFR5cGUgPT09ICdwYXNzd29yZCcpXHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8ZGl2XHJcbiAgICAgICAgb25DbGljaz17dG9nZ2xlfVxyXG4gICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcclxuICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcclxuICAgICAgICAgIG1hcmdpbjogMSxcclxuICAgICAgICB9fVxyXG4gICAgICA+XHJcbiAgICAgICAgPEljb25TdGF0ZSBvcGVuPXtzdGF0ZX0gLz5cclxuICAgICAgPC9kaXY+XHJcbiAgICApO1xyXG5cclxuICByZXR1cm4gbnVsbDtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlU3RhdGUgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5cclxuaW1wb3J0IHsgVmFsaWRhdGlvbk1lc3NhZ2UgfSBmcm9tICcuL1ZhbGlkYXRpb25NZXNzYWdlJztcclxuaW1wb3J0IHsgVmFsaWRpdHlJY29uIH0gZnJvbSAnLi9WYWxpZGl0eUljb24nO1xyXG5pbXBvcnQgeyB1c2VDbGllbnRWYWxpZGF0aW9uIH0gZnJvbSAnLi91c2VDbGllbnRWYWxpZGF0aW9uJztcclxuaW1wb3J0IEV5ZUljb24gZnJvbSAnLi9FeWVJY29uJztcclxuXHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gIGlucHV0OiB7XHJcbiAgICBib3JkZXI6ICcxcHggc29saWQnLFxyXG4gICAgcGFkZGluZzogOCxcclxuICAgIGZsZXg6IDEwLFxyXG4gICAgYm9yZGVyUmFkaXVzOiAyLFxyXG4gIH0sXHJcbiAgcm9vdDoge1xyXG4gICAgYm9yZGVyUmFkaXVzOiAyLFxyXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXHJcbiAgICBiYWNrZ3JvdW5kQ29sb3I6ICd3aGl0ZScsXHJcbiAgICBib3JkZXI6ICcxcHggc29saWQgd2hpdGUnLFxyXG4gICAgbWFyZ2luQm90dG9tOiAxLFxyXG4gIH0sXHJcbiAgaW5wdXRDb250YWluZXI6IHtcclxuICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgIGZsZXg6IDEsXHJcbiAgfSxcclxufTtcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSW5wdXQoe1xyXG4gIHBsYWNlaG9sZGVyLFxyXG4gIHR5cGUsXHJcbiAgbmFtZSxcclxuICBvbkNoYW5nZSxcclxuICB2YWx1ZSA9ICcnLFxyXG4gIHZhbGlkYXRpb25UeXBlcyA9IFtdLFxyXG4gIGlkLFxyXG59KSB7XHJcbiAgY29uc3QgeyB2YWxpZGF0ZSwgcmVzZXRWYWxpZGF0aW9uU3RhdGUgfSA9IHVzZUNsaWVudFZhbGlkYXRpb24oe1xyXG4gICAgdmFsaWRhdGlvblR5cGVzLFxyXG4gICAgdmFsdWUsXHJcbiAgICBuYW1lLFxyXG4gIH0pO1xyXG4gIGNvbnN0IFtmb2N1c2VkLCBzZXRGb2N1c2VkXSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuICBjb25zdCBbaW5wdXRUeXBlLCBzZXRJbnB1dFR5cGVdID0gdXNlU3RhdGUodHlwZSk7XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZUZvY3VzKCkge1xyXG4gICAgcmVzZXRWYWxpZGF0aW9uU3RhdGUoKTtcclxuICAgIHNldEZvY3VzZWQodHJ1ZSk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIGhhbmRsZUJsdXIoZSkge1xyXG4gICAgaWYgKGUudGFyZ2V0Lm5hbWUgPT09IG5hbWUpIHtcclxuICAgIFxyXG4gICAgICB2YWxpZGF0ZSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gdG9nZ2xlRXllKCkge1xyXG4gICAgaWYgKGlucHV0VHlwZSA9PT0gJ3Bhc3N3b3JkJykge1xyXG4gICAgICBzZXRJbnB1dFR5cGUoJ3RleHQnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHNldElucHV0VHlwZSgncGFzc3dvcmQnKTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3N0eWxlLnJvb3R9PlxyXG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5pbnB1dENvbnRhaW5lcn0+XHJcbiAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICBzdHlsZT17eyAuLi5zdHlsZS5pbnB1dCB9fVxyXG4gICAgICAgICAgdHlwZT17aW5wdXRUeXBlfVxyXG4gICAgICAgICAgbmFtZT17bmFtZX1cclxuICAgICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cclxuICAgICAgICAgIHZhbHVlPXt2YWx1ZX1cclxuICAgICAgICAgIG9uQmx1cj17aGFuZGxlQmx1cn1cclxuICAgICAgICAgIHBsYWNlaG9sZGVyPXtwbGFjZWhvbGRlcn1cclxuICAgICAgICAgIG9uRm9jdXM9e2hhbmRsZUZvY3VzfVxyXG4gICAgICAgICAgZGF0YS10ZXN0aWQ9e2lkfVxyXG4gICAgICAgIC8+XHJcbiAgICAgICAgPFZhbGlkaXR5SWNvbiB2YWxpZGF0aW9uVHlwZXM9e3ZhbGlkYXRpb25UeXBlc30gLz5cclxuICAgICAgICA8RXllSWNvbiBpbnB1dFR5cGU9e3R5cGV9IG9uQ2xpY2s9e3RvZ2dsZUV5ZX0gLz5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxWYWxpZGF0aW9uTWVzc2FnZSB2YWxpZGF0aW9uVHlwZXM9e3ZhbGlkYXRpb25UeXBlc30gbmFtZT17bmFtZX0gLz5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZVRoZW1lQ29udGV4dCB9IGZyb20gJy4uL3RoZW1lL3RoZW1lLWNvbnRleHQnO1xyXG5pbXBvcnQgJy4vY3NzL3N0eWxlLmNzcyc7XHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEJ1dHRvbihwcm9wcykge1xyXG4gIGNvbnN0IHRoZW1lID0gdXNlVGhlbWVDb250ZXh0KCk7XHJcbiAgY29uc3QgeyBvbkNsaWNrLCB0aXRsZSwgZGlzYWJsZWQsIGlkLCBjb2xvciA9ICdwcmltYXJ5JyB9ID0gcHJvcHM7XHJcbiAgcmV0dXJuIChcclxuICAgIDxidXR0b25cclxuICAgICAgY2xhc3NOYW1lPSdidG4nXHJcbiAgICAgIGRhdGEtdGVzdGlkPXtpZH1cclxuICAgICAgZGlzYWJsZWQ9e2Rpc2FibGVkfVxyXG4gICAgICBzdHlsZT17eyAuLi50aGVtZVtjb2xvcl0gfX1cclxuICAgICAgb25DbGljaz17b25DbGlja31cclxuICAgICAgey4uLnByb3BzfVxyXG4gICAgPlxyXG4gICAgICB7dGl0bGV9XHJcbiAgICA8L2J1dHRvbj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VNZWRpYVF1ZXJ5IH0gZnJvbSAnLi4vbGF5b3V0L3VzZU1lZGlhUXVlcnknO1xyXG4vL2ltcG9ydCAnLi9jc3Mvc3R5bGUuY3NzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEZvcm0oeyBjaGlsZHJlbiwgZm9ybVRpdGxlLCBlcnJvciB9KSB7XHJcbiAgY29uc3QgeyBkZXZpY2UgfSA9IHVzZU1lZGlhUXVlcnk7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgIC8vY2xhc3NOYW1lPVwicGFwZXJcIlxyXG4gICAgLy8gIHN0eWxlPXt7IHdpZHRoOiBkZXZpY2UgPT09ICdwaG9uZScgPyAnMTAwJScgOiAzNTAgfX1cclxuICAgID5cclxuICAgICAgPGxlZ2VuZD57Zm9ybVRpdGxlfTo8L2xlZ2VuZD5cclxuICAgICAge2NoaWxkcmVufVxyXG4gICAgICB7ZXJyb3IgJiYgKFxyXG4gICAgICAgIDxkaXZcclxuICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgIGNvbG9yOiAncmVkJyxcclxuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnd2hpdGUnLFxyXG4gICAgICAgICAgICBwYWRkaW5nOiA1LFxyXG4gICAgICAgICAgICBib3JkZXJSYWRpdXM6IDUsXHJcbiAgICAgICAgICB9fVxyXG4gICAgICAgID5cclxuICAgICAgICAgICoge2Vycm9yLm1lc3NhZ2V9XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICl9XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5cclxuY29uc3Qgc3R5bGUgPSB7XHJcbiAgYm94U2hhZG93OiBgMHB4IDNweCAzcHggLTJweCByZ2JhKDAsIDAsIDAsIDAuMiksXHJcbiAgICAwcHggM3B4IDRweCAwcHggcmdiYSgwLCAwLCAwLCAwLjE0KSwgMHB4IDFweCA4cHggMHB4IHJnYmEoMCwgMCwgMCwgMC4xMilgLFxyXG4gIG1hcmdpbjogOCxcclxuICBwYWRkaW5nOiA4LFxyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIFBhcGVyKHByb3BzKSB7XHJcbiAgY29uc3QgeyBjaGlsZHJlbiB9ID0gcHJvcHM7XHJcbiAgcmV0dXJuIDxkaXYgc3R5bGU9e3N0eWxlfT57Y2hpbGRyZW59PC9kaXY+O1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEdyaWQocHJvcHMpIHtcclxuICBjb25zdCB7IGNoaWxkcmVuLCB3aWR0aCB9ID0gcHJvcHM7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgc3R5bGU9e3tcclxuICAgICAgICBkaXNwbGF5OiAnZ3JpZCcsXHJcbiAgICAgICAgZ3JpZFRlbXBsYXRlQ29sdW1uczogYGF1dG8gJHt3aWR0aH0lIGF1dG9gLFxyXG4gICAgICB9fVxyXG4gICAgPlxyXG4gICAgICA8ZGl2PjwvZGl2PlxyXG4gICAgICA8ZGl2PntjaGlsZHJlbn08L2Rpdj5cclxuICAgICAgPGRpdj48L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIl0sIm5hbWVzIjpbIlZhbGlkYXRpb25NZXNzYWdlIiwidmFsaWRhdGlvblR5cGVzIiwibmFtZSIsInN0YXRlIiwidXNlRm9ybUNvbnRleHQiLCJtYXAiLCJ2YWxpZGF0aW9uTmFtZSIsInZhbGlkYXRpb24iLCJtZXNzYWdlIiwiY29sb3IiLCJwYWRkaW5nTGVmdCIsIlZhbGlkaXR5VGlja1N0YXRlIiwidmFsaWQiLCJzdGF0ZUNvbG9yIiwidmFsaWRhdGlvblN0YXRlcyIsIlZBTElEIiwiSU5WQUxJRCIsIklOQUNUSVZFIiwiZmxleCIsImxpbmVIZWlnaHQiLCJ3aWR0aCIsInRleHRBbGlnbiIsIlZhbGlkaXR5SWNvbiIsInZhbGlkYXRpb25TdGF0ZSIsInVzZUNsaWVudFZhbGlkYXRpb24iLCJ2YWx1ZSIsImRpc3BhdGNoIiwiYXV0aCIsInVzZUF1dGhDb250ZXh0IiwidmFsaWRhdGUiLCJmb3JFYWNoIiwiaXNDbGllbnRWYWxpZGF0aW9uVHlwZSIsInZhbGlkYXRpb25UeXBlIiwiYWN0aW9ucyIsInJlc2V0VmFsaWRhdGlvblN0YXRlIiwiaW1nIiwiSWNvblN0YXRlIiwib3BlbiIsIm9wZW5JY29uIiwiY2xvc2VJY29uIiwiRXllSWNvbiIsIm9uQ2xpY2siLCJpbnB1dFR5cGUiLCJzZXRTdGF0ZSIsInVzZVN0YXRlIiwidG9nZ2xlIiwicHJldiIsImRpc3BsYXkiLCJhbGlnbkl0ZW1zIiwianVzdGlmeUNvbnRlbnQiLCJtYXJnaW4iLCJzdHlsZSIsImlucHV0IiwiYm9yZGVyIiwicGFkZGluZyIsImJvcmRlclJhZGl1cyIsInJvb3QiLCJmbGV4RGlyZWN0aW9uIiwiYmFja2dyb3VuZENvbG9yIiwibWFyZ2luQm90dG9tIiwiaW5wdXRDb250YWluZXIiLCJJbnB1dCIsInBsYWNlaG9sZGVyIiwidHlwZSIsIm9uQ2hhbmdlIiwiaWQiLCJmb2N1c2VkIiwic2V0Rm9jdXNlZCIsInNldElucHV0VHlwZSIsImhhbmRsZUZvY3VzIiwiaGFuZGxlQmx1ciIsImUiLCJ0YXJnZXQiLCJ0b2dnbGVFeWUiLCJCdXR0b24iLCJwcm9wcyIsInRoZW1lIiwidXNlVGhlbWVDb250ZXh0IiwidGl0bGUiLCJkaXNhYmxlZCIsIkZvcm0iLCJjaGlsZHJlbiIsImZvcm1UaXRsZSIsImVycm9yIiwiYm94U2hhZG93IiwiUGFwZXIiLCJHcmlkIiwiZ3JpZFRlbXBsYXRlQ29sdW1ucyJdLCJtYXBwaW5ncyI6Ijs7QUFFTyxTQUFTQSxpQkFBVCxDQUEyQjtBQUFFQyxFQUFBQSxlQUFGO0FBQWtCQyxFQUFBQTtBQUFsQixDQUEzQixFQUFxRDtBQUMxRCxRQUFNO0FBQUVDLElBQUFBO0FBQUYsTUFBWUMsY0FBYyxFQUFoQztBQUNBLFNBQU9ILGVBQWUsQ0FBQ0ksR0FBaEIsQ0FBcUJDLGNBQUQsSUFBb0I7QUFD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
