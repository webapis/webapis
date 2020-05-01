import { d as useFormContext, h, g as validationStates, c as useAuthContext, p, i as isClientValidationType, j as clientValidation, r as resetInputValidationState, v, s as styleInject, k as useThemeContext } from './index-00e5b76b.js';

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
  p(() => {
    if (auth.password) {
      debugger;
    }
  }, [auth]);

  function validate() {
    debugger;
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
      debugger;
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

export { Button as B, Form as F, Grid as G, Input as I };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3JpZC1lMmQ4ODRkYy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY2xpZW50L2Zvcm0vVmFsaWRhdGlvbk1lc3NhZ2UuanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS9WYWxpZGl0eUljb24uanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS91c2VDbGllbnRWYWxpZGF0aW9uLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vaWNvbnMvb3BlbkV5ZS5wbmciLCIuLi8uLi8uLi9jbGllbnQvZm9ybS9pY29ucy9jbG9zZUV5ZS5wbmciLCIuLi8uLi8uLi9jbGllbnQvZm9ybS9FeWVJY29uLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vSW5wdXQuanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS9CdXR0b24uanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS9Gb3JtLmpzIiwiLi4vLi4vLi4vY2xpZW50L2xheW91dC9HcmlkLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VGb3JtQ29udGV4dCB9IGZyb20gJy4vZm9ybS1jb250ZXh0JztcclxuZXhwb3J0IGZ1bmN0aW9uIFZhbGlkYXRpb25NZXNzYWdlKHsgdmFsaWRhdGlvblR5cGVzLG5hbWUgfSkge1xyXG4gIGNvbnN0IHsgc3RhdGUgfSA9IHVzZUZvcm1Db250ZXh0KCk7XHJcbiAgcmV0dXJuIHZhbGlkYXRpb25UeXBlcy5tYXAoKHZhbGlkYXRpb25OYW1lKSA9PiB7XHJcbiAgICBpZiAoc3RhdGUudmFsaWRhdGlvblt2YWxpZGF0aW9uTmFtZV0pIHtcclxuICAgICAgY29uc3QgeyBtZXNzYWdlIH0gPSBzdGF0ZS52YWxpZGF0aW9uW3ZhbGlkYXRpb25OYW1lXTtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2XHJcbiAgICAgICAgICBrZXk9e3ZhbGlkYXRpb25OYW1lfVxyXG4gICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgY29sb3I6ICdyZWQnLFxyXG4gICAgICAgICAgICBwYWRkaW5nTGVmdDogMyxcclxuICAgICAgICAgIH19XHJcbiAgICAgICAgPlxyXG4gICAgICAgICAge21lc3NhZ2UgIT09ICcnICYmIChcclxuICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgIHJvbGU9J21lc3NhZ2UnXHJcbiAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9e2BtZXNzYWdlLSR7bmFtZX1gfVxyXG4gICAgICAgICAgICA+e2AqICR7bWVzc2FnZX1gfTwvZGl2PlxyXG4gICAgICAgICAgKX1cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKTtcclxuICAgIH1cclxuICB9KTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHZhbGlkYXRpb25TdGF0ZXMgZnJvbSAnLi92YWxpZGF0aW9uU3RhdGVzJztcclxuaW1wb3J0IHsgdXNlRm9ybUNvbnRleHQgfSBmcm9tICcuL2Zvcm0tY29udGV4dCc7XHJcbmZ1bmN0aW9uIFZhbGlkaXR5VGlja1N0YXRlKHsgdmFsaWQgfSkge1xyXG4gIGxldCBzdGF0ZUNvbG9yID0gJyM0ZmMzZjcnO1xyXG4gIHN3aXRjaCAodmFsaWQpIHtcclxuICAgIGNhc2UgdmFsaWRhdGlvblN0YXRlcy5WQUxJRDpcclxuICAgICAgc3RhdGVDb2xvciA9ICdncmVlbic7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQ6XHJcbiAgICAgIHN0YXRlQ29sb3IgPSAncmVkJztcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIHZhbGlkYXRpb25TdGF0ZXMuSU5BQ1RJVkU6XHJcbiAgICAgIHN0YXRlQ29sb3IgPSAnIzRmYzNmNyc7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgc3RhdGVDb2xvciA9ICcjNGZjM2Y3JztcclxuICB9XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2XHJcbiAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgZmxleDogMSxcclxuICAgICAgICBjb2xvcjogc3RhdGVDb2xvcixcclxuICAgICAgICBsaW5lSGVpZ2h0OiAyLFxyXG4gICAgICAgIHdpZHRoOiAyMCxcclxuICAgICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxyXG4gICAgICB9fVxyXG4gICAgPlxyXG4gICAgICB7dmFsaWQgPyAn4pyTJyA6ICfimJMnfVxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIFZhbGlkaXR5SWNvbih7IHZhbGlkYXRpb25UeXBlcyB9KSB7XHJcbiAgY29uc3QgeyBzdGF0ZSB9ID0gdXNlRm9ybUNvbnRleHQoKTtcclxuICByZXR1cm4gdmFsaWRhdGlvblR5cGVzLm1hcCgodmFsaWRhdGlvbk5hbWUpID0+IHtcclxuICAgIGlmIChzdGF0ZS52YWxpZGF0aW9uW3ZhbGlkYXRpb25OYW1lXSkge1xyXG4gICAgICBjb25zdCB7IHZhbGlkYXRpb25TdGF0ZSB9ID0gc3RhdGUudmFsaWRhdGlvblt2YWxpZGF0aW9uTmFtZV07XHJcbiAgICAgIGlmIChcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGUgPT09IHZhbGlkYXRpb25TdGF0ZXMuVkFMSUQgfHxcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGUgPT09IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRFxyXG4gICAgICApIHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgPFZhbGlkaXR5VGlja1N0YXRlIGtleT17dmFsaWRhdGlvbk5hbWV9IHZhbGlkPXt2YWxpZGF0aW9uU3RhdGV9IC8+XHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICB9KTtcclxufVxyXG4iLCJpbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgeyB1c2VGb3JtQ29udGV4dCB9IGZyb20gJy4vZm9ybS1jb250ZXh0JztcclxuaW1wb3J0IHsgdXNlQXV0aENvbnRleHQgfSBmcm9tICcuLi9hdXRoL2F1dGgtY29udGV4dCc7XHJcbmltcG9ydCB7IGlzQ2xpZW50VmFsaWRhdGlvblR5cGUgfSBmcm9tICcuL2NvbnN0cmFpbnRWYWxpZGF0b3JzJztcclxuaW1wb3J0ICogYXMgYWN0aW9ucyBmcm9tICcuL2FjdGlvbnMnO1xyXG5leHBvcnQgZnVuY3Rpb24gdXNlQ2xpZW50VmFsaWRhdGlvbih7IHZhbGlkYXRpb25UeXBlcywgdmFsdWUsIG5hbWUgfSkge1xyXG4gIGNvbnN0IHsgc3RhdGUsIGRpc3BhdGNoIH0gPSB1c2VGb3JtQ29udGV4dCgpO1xyXG4gIGNvbnN0IHsgc3RhdGU6IGF1dGggfSA9IHVzZUF1dGhDb250ZXh0KCk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAoYXV0aC5wYXNzd29yZCkge1xyXG4gICBkZWJ1Z2dlcjtcclxuICAgIH1cclxuICB9LCBbYXV0aF0pO1xyXG5cclxuICBmdW5jdGlvbiB2YWxpZGF0ZSgpIHtcclxuICAgIGRlYnVnZ2VyO1xyXG4gICAgdmFsaWRhdGlvblR5cGVzLmZvckVhY2goKHZhbGlkYXRpb25OYW1lKSA9PiB7XHJcbiAgICAgIGlmIChpc0NsaWVudFZhbGlkYXRpb25UeXBlKHsgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25OYW1lIH0pKSB7XHJcbiAgICAgICAgZGlzcGF0Y2goXHJcbiAgICAgICAgICBhY3Rpb25zLmNsaWVudFZhbGlkYXRpb24oe1xyXG4gICAgICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvbk5hbWUsXHJcbiAgICAgICAgICAgIHZhbHVlOiBhdXRoW25hbWVdLFxyXG4gICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgYXV0aCxcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiByZXNldFZhbGlkYXRpb25TdGF0ZSgpIHtcclxuICAgIHZhbGlkYXRpb25UeXBlcy5mb3JFYWNoKCh2YWxpZGF0aW9uTmFtZSkgPT4ge1xyXG4gICAgICBpZiAoc3RhdGUudmFsaWRhdGlvblt2YWxpZGF0aW9uTmFtZV0pIHtcclxuICAgICAgICBkaXNwYXRjaChcclxuICAgICAgICAgIGFjdGlvbnMucmVzZXRJbnB1dFZhbGlkYXRpb25TdGF0ZSh7IHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uTmFtZSB9KVxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHsgdmFsaWRhdGUsIHJlc2V0VmFsaWRhdGlvblN0YXRlIH07XHJcbn1cclxuIiwiY29uc3QgaW1nID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUVBQUFBQkFDQVlBQUFDcWFYSGVBQUFBQ1hCSVdYTUFBQXNUQUFBTEV3RUFtcHdZQUFBQ3NrbEVRVlI0bk8yYXUyNFRRUlNHUDlzSzBGZ2lJZ0xsSW9VdXFRTlVWT0hTbUJMZWdIUVVnUzdQZ1pJT2hLbUlZaWhpM3NBSUNRcFNKS0VFQ1NzR2drS0xKVXVSS1dZV0hMT0xkK2ZNN3RyeCthU1JKV3RuL3YvWXU3TXpadzRvaXFJb2lxSW9paktPRkRMUU9BTmNBYTREUzhCRjRBSXdaVDhCZmdKSDl2TUhzQU84QlQ0QW5RdzhldWNTc0FhOEFkcEExN0cxN1JocmRzeWhwZ0RjQm1xWWY4MDE2S2pXc1dQZklwczdOeEUzZ0YzOEJ4M1ZkcTFtN2x3R1hwRmQ0UDN0SlRDZmRwQlJQRVQyZlB0cWJXQTE1VmhQY0JaNDdqa0lINjFxdmFYS0RQQSt4eUFIdFhmQWRGckJ6d0ZOb2NFbXNBNVVnQVdnYk51Qy9XN2RnOFlYNjlVcms4QkhnYWtENEQ1UWlxRlZzdGUyQkhyN3dIbFJ4RDJjd3l4R1hNMXNZLzdscEpTQnVrQzNZYjJMMlJTWWVBd1VCZHBGTzRhci9xWkFHNEI3QXZGdC9Lellpc2p1aEx1dXdwUEFkMGZSQTl4dSt5akt1TThKMzJ3c2lhazZDbll4azVodlZnUituaVVWdXlZUWF4SnZ0azlLQ2RrcjhtcllvRkVUMUNPQjBUcHdMT2dmeFRId1d0QS9ka3l6eUxhekZZSEpRVlFFdmpxWWxld0p3dTZBQjhDRXdPUW5RZDlCZkJiMG5jREVOcEJEM0gvbExuNW4vMzdLUW0rSC9RTktGaW1uZ3JBZjRLbHd6SCtlTTQvTUN2cy9pU3N5MXBOZ0M1TnFrcGhNaXp1Q3ZqWGdhOXlMeDJZaDlEK3FBckdSWHdxRGJEUFU0aFJzaGtDK0hmYnhtczF0T3h3d3lnbVJGd0x0UDBoVFluVkdQQ1VHNWhuYUY1aHBZU2F4dUVuUkZXUkowVDA4SmtVRDVqQXBaMWRUWGN4cmJBT3pWbGprYjFwODBYNjN3WkNteFFObU1JY1BFb05wdGxRUFJnTEcrbWlzbDFXRzQzRDBGeGtmanZZeWo5azM1QlY4alJ5UHgzdFpKdnNDaWVWTUlrdEFBVk8rc2tWNkpUSmJ3RTJHc0VTbW42Qklxb0c4U0twQmlrVlNXWlhKTFJGZUpqZGxyemtpdkV4dWh4RXRrMU1VUlZFVVJWRVVaYmo1RGNrTUZlUWhyRmo5QUFBQUFFbEZUa1N1UW1DQ1wiO1xuICBleHBvcnQgZGVmYXVsdCBpbWc7IiwiY29uc3QgaW1nID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUVBQUFBQkFDQVlBQUFDcWFYSGVBQUFBQ1hCSVdYTUFBQXNUQUFBTEV3RUFtcHdZQUFBRHMwbEVRVlI0bk8zYlMyaGNWUnpIOFU5YW85SXltb0lvU21PcUxhMHJONzV3SzRKYXRKUWFGZXpDaU5LdGlGQmM2TktWZENPS0MxRXJJb29Lb3FDQzRGdlJqU0sxaWk1RURXaE5VZkVGZ1JpTWl6T1JOTDAzY3g1eloySnlmL0FuTU1tYzMvLy96Ym4zbnRlbFZhdFdyVTdVWHN4MFk5K1FjeG1LWnJEUWpiOHhPZHgwQnErbEFOWWxoSDFDMGNzaDNEVE1wQWF0U1MyRVdnZzNEek9wUWF1RllJMURHSW44dTBrOGkxT1dmRGFQL1hpK3gzZTM0REpjM0kxZDNjL083TVkvK0FVL2QzOGV4NmY0RUo5Z0xqTEh4bFhWRStaVjk0UUxjRGZlcnZoT1NzemlmZHlMYzVvcEswMjlJRnlOVjRYL2FtN1JkVEdIRjdvZXNUMjNFZFZCK0ZML2k2NkxJN2lxNlVKWFVoV0VZY1NMbUdpNDFscXRGZ2l6dUt2aFdtdTFXaUFzNERCT2E3VGFHcTBtQ0IvajNLWUtQUjl2WVh2RjcySWhITU1oWEM5Y3U1dlFFY1lHdS9Fd3BpUGFXU20reDlZKzFnM094dGRkZzJucEVIN0NGRVlqdkRiaUR2eFEwMVpNSE1WWWFwRjEyaXlNeUpZYXBFSTRrT0hid1NzVmJjWEdlemc5dy9ja1BWRmprQUpoSHJka2VHL0FRelgrTWZGY2h1Y0oydC9EWUZBUVNuckNqUm1lNER6OEdXRXdDQWdkK2ZlRVk4TGtLMW1IRTB3R0FlSE9oSHlXeDVPcFpwZGttRFFOWWFPeVIrU2xLV2F2WlpwTVkxdEZlLzJDOEVobVhndDRKdFprdTdMcDdMVTE3ZllEd3U2Q3ZPYUUrMXBQUFZoZ3NvRHhGZG91aFhCUllXNFB4SmdjTHpUcE5TRXBnZEFwekcwbXdxTVlRTXdRTkJmQ3BzTGNvZ0FjS2pTNUlzWkVIb1NKd3R5aUxvRmRoU2EzeFpoMGxRcmhob0s4b20rQzhIcUIwV094SmwybFFDanBuZEdQUWZJR1Fvc3hpN05Tek1SQkdCV0d0Ymw1SlEyRUNCc2V1V2IzcDVycERXR3FJSi9ITS9LeEZiOW5HdjZCblJtZWRSQU9DSXNxT2JuOHFHQng1UFpNMHdWOExpeW1wS3JmYTR4N00zTDRUeVBLTG9XWERCZkNVeG5lSjJtenNGbVptOFFSN01qd0xZWHdKazdOOEszVU9MNHJTT1kzM0tjL1Q0ZVkrQXhuWk5TNW9yYmgyNHhrbHNhc01FNllFa2FNWThMY1lSelhxTjdtU29Yd2pZYjNCbzRtSkpNYU9VdnVTK01kNmIwc1dSMjhISkhNb0NFOEttN2ZvUy9hZ0h1RUxyMGFJRHpkL3hManRCUHZWaVEwYUFoMUoxVUdvaEhzMGN3QmlmOE5CTUtxN1I2OG9mOFFMcXp3VzVVUUZyVURCL0dSc3VMbmhEMis2MnA4aW8vd0RlS3cwUmd1eDVYQ291YUU4RGp0Q0dPQVVXSHk5S3R3Vk80cmZDR01JRC9BWHozYXJ6dkNkNnR3cUdwZHFEM2JySVdBZWdqcjZuMkhGb0o2Q092cUhhZ3FDRkViSTJ0Snl5R3NPd0NFYnIvNEdtRFIrbUNyVnEzV252NEZycmN1ajJPZlI1c0FBQUFBU1VWT1JLNUNZSUk9XCI7XG4gIGV4cG9ydCBkZWZhdWx0IGltZzsiLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlU3RhdGUgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgb3Blbkljb24gZnJvbSAnLi9pY29ucy9vcGVuRXllLnBuZyc7XHJcbmltcG9ydCBjbG9zZUljb24gZnJvbSAnLi9pY29ucy9jbG9zZUV5ZS5wbmcnO1xyXG5mdW5jdGlvbiBJY29uU3RhdGUoeyBvcGVuIH0pIHtcclxuICBpZiAob3Blbikge1xyXG4gICAgcmV0dXJuIDxpbWcgc3R5bGU9e3sgd2lkdGg6IDI1IH19IHNyYz17b3Blbkljb259IC8+O1xyXG4gIH1cclxuICByZXR1cm4gPGltZyBzdHlsZT17eyB3aWR0aDogMjUgfX0gc3JjPXtjbG9zZUljb259IC8+O1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBFeWVJY29uKHsgb25DbGljayxpbnB1dFR5cGUgfSkge1xyXG4gIGNvbnN0IFtzdGF0ZSwgc2V0U3RhdGVdID0gdXNlU3RhdGUoZmFsc2UpO1xyXG4gIGZ1bmN0aW9uIHRvZ2dsZSgpIHtcclxuICAgIG9uQ2xpY2soKTtcclxuICAgIHNldFN0YXRlKChwcmV2KSA9PiAhcHJldik7XHJcbiAgfVxyXG4gIGlmIChpbnB1dFR5cGUgPT09ICdwYXNzd29yZCcpXHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8ZGl2XHJcbiAgICAgICAgb25DbGljaz17dG9nZ2xlfVxyXG4gICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcclxuICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcclxuICAgICAgICAgIG1hcmdpbjogMSxcclxuICAgICAgICB9fVxyXG4gICAgICA+XHJcbiAgICAgICAgPEljb25TdGF0ZSBvcGVuPXtzdGF0ZX0gLz5cclxuICAgICAgPC9kaXY+XHJcbiAgICApO1xyXG5cclxuICByZXR1cm4gbnVsbDtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlU3RhdGUgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5cclxuaW1wb3J0IHsgVmFsaWRhdGlvbk1lc3NhZ2UgfSBmcm9tICcuL1ZhbGlkYXRpb25NZXNzYWdlJztcclxuaW1wb3J0IHsgVmFsaWRpdHlJY29uIH0gZnJvbSAnLi9WYWxpZGl0eUljb24nO1xyXG5pbXBvcnQgeyB1c2VDbGllbnRWYWxpZGF0aW9uIH0gZnJvbSAnLi91c2VDbGllbnRWYWxpZGF0aW9uJztcclxuaW1wb3J0IEV5ZUljb24gZnJvbSAnLi9FeWVJY29uJztcclxuXHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gIGlucHV0OiB7XHJcbiAgICBib3JkZXI6ICcxcHggc29saWQnLFxyXG4gICAgcGFkZGluZzogOCxcclxuICAgIGZsZXg6IDEwLFxyXG4gICAgYm9yZGVyUmFkaXVzOiAyLFxyXG4gIH0sXHJcbiAgcm9vdDoge1xyXG4gICAgYm9yZGVyUmFkaXVzOiAyLFxyXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXHJcbiAgICBiYWNrZ3JvdW5kQ29sb3I6ICd3aGl0ZScsXHJcbiAgICBib3JkZXI6ICcxcHggc29saWQgd2hpdGUnLFxyXG4gICAgbWFyZ2luQm90dG9tOiAxLFxyXG4gIH0sXHJcbiAgaW5wdXRDb250YWluZXI6IHtcclxuICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgIGZsZXg6IDEsXHJcbiAgfSxcclxufTtcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSW5wdXQoe1xyXG4gIHBsYWNlaG9sZGVyLFxyXG4gIHR5cGUsXHJcbiAgbmFtZSxcclxuICBvbkNoYW5nZSxcclxuICB2YWx1ZSA9ICcnLFxyXG4gIHZhbGlkYXRpb25UeXBlcyA9IFtdLFxyXG4gIGlkLFxyXG59KSB7XHJcbiAgY29uc3QgeyB2YWxpZGF0ZSwgcmVzZXRWYWxpZGF0aW9uU3RhdGUgfSA9IHVzZUNsaWVudFZhbGlkYXRpb24oe1xyXG4gICAgdmFsaWRhdGlvblR5cGVzLFxyXG4gICAgdmFsdWUsXHJcbiAgICBuYW1lLFxyXG4gIH0pO1xyXG4gIGNvbnN0IFtmb2N1c2VkLCBzZXRGb2N1c2VkXSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuICBjb25zdCBbaW5wdXRUeXBlLCBzZXRJbnB1dFR5cGVdID0gdXNlU3RhdGUodHlwZSk7XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZUZvY3VzKCkge1xyXG4gICAgcmVzZXRWYWxpZGF0aW9uU3RhdGUoKTtcclxuICAgIHNldEZvY3VzZWQodHJ1ZSk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIGhhbmRsZUJsdXIoZSkge1xyXG4gICAgaWYgKGUudGFyZ2V0Lm5hbWUgPT09IG5hbWUpIHtcclxuICAgICAgZGVidWdnZXI7XHJcbiAgICAgIHZhbGlkYXRlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiB0b2dnbGVFeWUoKSB7XHJcbiAgICBpZiAoaW5wdXRUeXBlID09PSAncGFzc3dvcmQnKSB7XHJcbiAgICAgIHNldElucHV0VHlwZSgndGV4dCcpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc2V0SW5wdXRUeXBlKCdwYXNzd29yZCcpO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17c3R5bGUucm9vdH0+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlLmlucHV0Q29udGFpbmVyfT5cclxuICAgICAgICA8aW5wdXRcclxuICAgICAgICAgIHN0eWxlPXt7IC4uLnN0eWxlLmlucHV0IH19XHJcbiAgICAgICAgICB0eXBlPXtpbnB1dFR5cGV9XHJcbiAgICAgICAgICBuYW1lPXtuYW1lfVxyXG4gICAgICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxyXG4gICAgICAgICAgdmFsdWU9e3ZhbHVlfVxyXG4gICAgICAgICAgb25CbHVyPXtoYW5kbGVCbHVyfVxyXG4gICAgICAgICAgcGxhY2Vob2xkZXI9e3BsYWNlaG9sZGVyfVxyXG4gICAgICAgICAgb25Gb2N1cz17aGFuZGxlRm9jdXN9XHJcbiAgICAgICAgICBkYXRhLXRlc3RpZD17aWR9XHJcbiAgICAgICAgLz5cclxuICAgICAgICA8VmFsaWRpdHlJY29uIHZhbGlkYXRpb25UeXBlcz17dmFsaWRhdGlvblR5cGVzfSAvPlxyXG4gICAgICAgIDxFeWVJY29uIGlucHV0VHlwZT17dHlwZX0gb25DbGljaz17dG9nZ2xlRXllfSAvPlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPFZhbGlkYXRpb25NZXNzYWdlIHZhbGlkYXRpb25UeXBlcz17dmFsaWRhdGlvblR5cGVzfSBuYW1lPXtuYW1lfSAvPlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlVGhlbWVDb250ZXh0IH0gZnJvbSAnLi4vdGhlbWUvdGhlbWUtY29udGV4dCc7XHJcbmltcG9ydCAnLi9jc3Mvc3R5bGUuY3NzJztcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQnV0dG9uKHtcclxuICBvbkNsaWNrLFxyXG4gIHRpdGxlLFxyXG4gIGRpc2FibGVkLFxyXG4gIGlkLFxyXG4gIGNvbG9yID0gJ3ByaW1hcnknLFxyXG59KSB7XHJcbiAgY29uc3QgdGhlbWUgPSB1c2VUaGVtZUNvbnRleHQoKTtcclxuICByZXR1cm4gKFxyXG4gICAgPGJ1dHRvblxyXG4gICAgICBjbGFzc05hbWU9J2J0bidcclxuICAgICAgZGF0YS10ZXN0aWQ9e2lkfVxyXG4gICAgICBkaXNhYmxlZD17ZGlzYWJsZWR9XHJcbiAgICAgIHN0eWxlPXt7IC4uLnRoZW1lW2NvbG9yXSB9fVxyXG4gICAgICBvbkNsaWNrPXtvbkNsaWNrfVxyXG4gICAgPlxyXG4gICAgICB7dGl0bGV9XHJcbiAgICA8L2J1dHRvbj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VNZWRpYVF1ZXJ5IH0gZnJvbSAnLi4vbGF5b3V0L3VzZU1lZGlhUXVlcnknO1xyXG4vL2ltcG9ydCAnLi9jc3Mvc3R5bGUuY3NzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEZvcm0oeyBjaGlsZHJlbiwgZm9ybVRpdGxlLCBlcnJvciB9KSB7XHJcbiAgY29uc3QgeyBkZXZpY2UgfSA9IHVzZU1lZGlhUXVlcnk7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgIC8vY2xhc3NOYW1lPVwicGFwZXJcIlxyXG4gICAgLy8gIHN0eWxlPXt7IHdpZHRoOiBkZXZpY2UgPT09ICdwaG9uZScgPyAnMTAwJScgOiAzNTAgfX1cclxuICAgID5cclxuICAgICAgPGxlZ2VuZD57Zm9ybVRpdGxlfTo8L2xlZ2VuZD5cclxuICAgICAge2NoaWxkcmVufVxyXG4gICAgICB7ZXJyb3IgJiYgKFxyXG4gICAgICAgIDxkaXZcclxuICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgIGNvbG9yOiAncmVkJyxcclxuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnd2hpdGUnLFxyXG4gICAgICAgICAgICBwYWRkaW5nOiA1LFxyXG4gICAgICAgICAgICBib3JkZXJSYWRpdXM6IDUsXHJcbiAgICAgICAgICB9fVxyXG4gICAgICAgID5cclxuICAgICAgICAgICoge2Vycm9yLm1lc3NhZ2V9XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICl9XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEdyaWQocHJvcHMpIHtcclxuICBjb25zdCB7IGNoaWxkcmVuLCB3aWR0aCB9ID0gcHJvcHM7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgc3R5bGU9e3tcclxuICAgICAgICBkaXNwbGF5OiAnZ3JpZCcsXHJcbiAgICAgICAgZ3JpZFRlbXBsYXRlQ29sdW1uczogYGF1dG8gJHt3aWR0aH0lIGF1dG9gLFxyXG4gICAgICB9fVxyXG4gICAgPlxyXG4gICAgICA8ZGl2PjwvZGl2PlxyXG4gICAgICA8ZGl2PntjaGlsZHJlbn08L2Rpdj5cclxuICAgICAgPGRpdj48L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIl0sIm5hbWVzIjpbIlZhbGlkYXRpb25NZXNzYWdlIiwidmFsaWRhdGlvblR5cGVzIiwibmFtZSIsInN0YXRlIiwidXNlRm9ybUNvbnRleHQiLCJtYXAiLCJ2YWxpZGF0aW9uTmFtZSIsInZhbGlkYXRpb24iLCJtZXNzYWdlIiwiY29sb3IiLCJwYWRkaW5nTGVmdCIsIlZhbGlkaXR5VGlja1N0YXRlIiwidmFsaWQiLCJzdGF0ZUNvbG9yIiwidmFsaWRhdGlvblN0YXRlcyIsIlZBTElEIiwiSU5WQUxJRCIsIklOQUNUSVZFIiwiZmxleCIsImxpbmVIZWlnaHQiLCJ3aWR0aCIsInRleHRBbGlnbiIsIlZhbGlkaXR5SWNvbiIsInZhbGlkYXRpb25TdGF0ZSIsInVzZUNsaWVudFZhbGlkYXRpb24iLCJ2YWx1ZSIsImRpc3BhdGNoIiwiYXV0aCIsInVzZUF1dGhDb250ZXh0IiwidXNlRWZmZWN0IiwicGFzc3dvcmQiLCJ2YWxpZGF0ZSIsImZvckVhY2giLCJpc0NsaWVudFZhbGlkYXRpb25UeXBlIiwidmFsaWRhdGlvblR5cGUiLCJhY3Rpb25zIiwicmVzZXRWYWxpZGF0aW9uU3RhdGUiLCJpbWciLCJJY29uU3RhdGUiLCJvcGVuIiwib3Blbkljb24iLCJjbG9zZUljb24iLCJFeWVJY29uIiwib25DbGljayIsImlucHV0VHlwZSIsInNldFN0YXRlIiwidXNlU3RhdGUiLCJ0b2dnbGUiLCJwcmV2IiwiZGlzcGxheSIsImFsaWduSXRlbXMiLCJqdXN0aWZ5Q29udGVudCIsIm1hcmdpbiIsInN0eWxlIiwiaW5wdXQiLCJib3JkZXIiLCJwYWRkaW5nIiwiYm9yZGVyUmFkaXVzIiwicm9vdCIsImZsZXhEaXJlY3Rpb24iLCJiYWNrZ3JvdW5kQ29sb3IiLCJtYXJnaW5Cb3R0b20iLCJpbnB1dENvbnRhaW5lciIsIklucHV0IiwicGxhY2Vob2xkZXIiLCJ0eXBlIiwib25DaGFuZ2UiLCJpZCIsImZvY3VzZWQiLCJzZXRGb2N1c2VkIiwic2V0SW5wdXRUeXBlIiwiaGFuZGxlRm9jdXMiLCJoYW5kbGVCbHVyIiwiZSIsInRhcmdldCIsInRvZ2dsZUV5ZSIsIkJ1dHRvbiIsInRpdGxlIiwiZGlzYWJsZWQiLCJ0aGVtZSIsInVzZVRoZW1lQ29udGV4dCIsIkZvcm0iLCJjaGlsZHJlbiIsImZvcm1UaXRsZSIsImVycm9yIiwiR3JpZCIsInByb3BzIiwiZ3JpZFRlbXBsYXRlQ29sdW1ucyJdLCJtYXBwaW5ncyI6Ijs7QUFFTyxTQUFTQSxpQkFBVCxDQUEyQjtBQUFFQyxFQUFBQSxlQUFGO0FBQWtCQyxFQUFBQTtBQUFsQixDQUEzQixFQUFxRDtBQUMxRCxRQUFNO0FBQUVDLElBQUFBO0FBQUYsTUFBWUMsY0FBYyxFQUFoQztBQUNBLFNBQU9ILGVBQWUsQ0FBQ0ksR0FBaEIsQ0FBcUJDLGNBQUQsSUFBb0I7QUFDN0MsUUFBSUgsS0FBSyxDQUFDSSxVQUFOLENBQWlCRCxjQUFqQixDQUFKLEVBQXNDO0FBQ3BDLFlBQU07QUFBRUUsUUFBQUE7QUFBRixVQUFjTCxLQUFLLENBQUNJLFVBQU4sQ0FBaUJELGNBQWpCLENBQXBCO0FBQ0EsYUFDRTtBQUNFLFFBQUEsR0FBRyxFQUFFQSxjQURQO0FBRUUsUUFBQSxLQUFLLEVBQUU7QUFDTEcsVUFBQUEsS0FBSyxFQUFFLEtBREY7QUFFTEMsVUFBQUEsV0FBVyxFQUFFO0FBRlI7QUFGVCxTQU9HRixPQUFPLEtBQUssRUFBWixJQUNDO0FBQ0UsUUFBQSxJQUFJLEVBQUMsU0FEUDtBQUVFLHVCQUFjLFdBQVVOLElB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
