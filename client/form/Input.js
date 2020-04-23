import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import * as actions from './actions';
import validationStates from './validationStates';
import { isClientValidationType } from './constraintValidators';
import EyeIcon from './EyeIcon';
import { useFormContext } from './form-context';
function ValidityIcon({ valid }) {
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

  return (
    <div
      style={{
        flex: 1,
        color: stateColor,
        lineHeight: 2,
        width: 20,
        textAlign: 'center',
      }}
    >
      {valid ? '✓' : '☓'}
    </div>
  );
}

const style = {
  input: {
    margin: 1,
    border: '1px solid',
    padding: 8,
    flex: 10,
    borderRadius: 2,
  },
  root: {
    borderRadius: 2,
    margin: 3,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    border: '1px solid white',
    marginBottom: 1,
  },
  inputContainer: {
    display: 'flex',
    flex: 1,
  },
  message: {
    color: 'red',
    paddingLeft: 3,
  },
};
export default function Input({
  placeholder,
  type,
  name,
  onChange,
  value = '',
  validationTypes = [],
  id,
}) {
  const { state, dispatch } = useFormContext();

  const [inputValidation, setInputValidation] = useState({
    validationState: validationStates.INACTIVE,
    message: '',
    validationType: undefined,
  });

  const [inputType, setInputType] = useState(type);

  const [borderColor, setBorderColor] = useState('');

  useEffect(() => {
    if (
      inputValidation &&
      inputValidation.validationState === validationStates.VALID
    ) {
      setBorderColor('green');
    }
    if (
      inputValidation &&
      inputValidation.validationState === validationStates.INVALID
    ) {
      setBorderColor('red');
    }
    if (
      inputValidation &&
      inputValidation.validationState === validationStates.INACTIVE
    ) {
      setBorderColor('#4fc3f7');
    }
  }, [inputValidation]);
  function handleFocus() {
    validationTypes.forEach((validationName) => {
      if (state.validation[validationName]) {
        dispatch(
          actions.resetInputValidationState({ validationType: validationName })
        );
      }
    });
  }
  function handleBlur() {
    validationTypes.forEach((validationName) => {
      if (isClientValidationType({ validationType: validationName })) {
        dispatch(
          actions.clientValidation({
            validationType: validationName,
            value,
            state,
          })
        );
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
  return (
    <div style={style.root}>
      <div style={style.inputContainer}>
        <input
          style={{ ...style.input, borderColor }}
          type={inputType}
          name={name}
          onChange={onChange}
          value={value}
          onBlur={handleBlur}
          placeholder={placeholder}
          onFocus={handleFocus}
          data-testid={id}
        />
        {validationTypes.map((validationName) => {
          if (state.validation[validationName]) {
            const { validationState } = state.validation[validationName];
            if (
              validationState === validationStates.VALID ||
              validationState === validationStates.INVALID
            ) {
              return (
                <ValidityIcon key={validationName} valid={validationState} />
              );
            }
            return null;
          }
        })}
        {type === 'password' && <EyeIcon onClick={toggleEye} />}
      </div>
      {validationTypes.map((validationName) => {
        if (state.validation[validationName]) {
          const { message } = state.validation[validationName];
          return (
            <div key={validationName} style={style.message}>
              {message !== '' && (
                <div
                  role='message'
                  data-testid={`message-${name}`}
                >{`* ${message}`}</div>
              )}
            </div>
          );
        }
      })}
    </div>
  );
}
