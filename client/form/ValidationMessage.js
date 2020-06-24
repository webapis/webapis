import { h } from 'preact';
import { useFormContext } from './form-context';
export function ValidationMessage({ validationTypes,name }) {
  const { state } = useFormContext();
  return validationTypes.map((validationName) => {
    if (state.validation[validationName]) {
   
      const { message } = state.validation[validationName];
      return (
        <div
          key={validationName}
          style={{
            color: 'red',
            paddingLeft: 3,
          }}
        >
          {message !== '' && (
            <div
              role='message'
              data-testid={`message-${name}`}
            >{`* ${message}`}</div>
          )}
        </div>
      );
    }
  });
}
