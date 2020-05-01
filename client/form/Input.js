import { h } from 'preact';
import { useState } from 'preact/hooks';

import { ValidationMessage } from './ValidationMessage';
import { ValidityIcon } from './ValidityIcon';
import { useClientValidation } from './useClientValidation';
import EyeIcon from './EyeIcon';

const style = {
  input: {
    border: '1px solid',
    padding: 8,
    flex: 10,
    borderRadius: 2,
  },
  root: {
    borderRadius: 2,
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
  const { validate, resetValidationState } = useClientValidation({
    validationTypes,
    value,
    name,
  });
  const [focused, setFocused] = useState(false);
  const [inputType, setInputType] = useState(type);

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
  return (
    <div style={style.root}>
      <div style={style.inputContainer}>
        <input
          style={{ ...style.input }}
          type={inputType}
          name={name}
          onChange={onChange}
          value={value}
          onBlur={handleBlur}
          placeholder={placeholder}
          onFocus={handleFocus}
          data-testid={id}
        />
        <ValidityIcon validationTypes={validationTypes} />
        <EyeIcon inputType={type} onClick={toggleEye} />
      </div>
      <ValidationMessage validationTypes={validationTypes} name={name} />
    </div>
  );
}
