import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import * as validationActions from './actions';
import { FormProvider } from './form-context';
const style = {
  display: 'flex',
  flexDirection: 'column',
  width: 300,
};

export default function Form({ children, formTitle, error }) {
  return (
    <FormProvider>
      <fieldset style={style}>
        <legend>{formTitle}:</legend>
        {children}
        {error && (
          <div
            style={{
              color: 'red',
              backgroundColor: 'white',
              padding: 5,
              borderRadius: 5,
            }}
          >
            * {error.message}
          </div>
        )}
      </fieldset>
    </FormProvider>
  );
}
