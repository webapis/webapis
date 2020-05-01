import { h } from 'preact';
import validationStates from './validationStates';
import { useFormContext } from './form-context';
function ValidityTickState({ valid }) {
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

export function ValidityIcon({ validationTypes }) {
  const { state } = useFormContext();
  return validationTypes.map((validationName) => {
    if (state.validation[validationName]) {
      const { validationState } = state.validation[validationName];
      if (
        validationState === validationStates.VALID ||
        validationState === validationStates.INVALID
      ) {
        return (
          <ValidityTickState key={validationName} valid={validationState} />
        );
      }
      return null;
    }
  });
}
