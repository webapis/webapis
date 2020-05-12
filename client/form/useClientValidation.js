import { useEffect } from 'preact/hooks';
import { useFormContext } from './form-context';
import { useAuthContext } from '../auth/auth-context';
import { isClientValidationType } from './constraintValidators';
import * as actions from './actions';
export function useClientValidation({ validationTypes, value, name }) {
  const { state, dispatch } = useFormContext();
  const { state: auth } = useAuthContext();

 

  function validate() {
   
    validationTypes.forEach((validationName) => {
      if (isClientValidationType({ validationType: validationName })) {
        dispatch(
          actions.clientValidation({
            validationType: validationName,
            value: auth[name],
            state,
            auth,
          })
        );
      }
    });
  }

  function resetValidationState() {
    validationTypes.forEach((validationName) => {
      if (state.validation[validationName]) {
        dispatch(
          actions.resetInputValidationState({ validationType: validationName })
        );
      }
    });
  }

  return { validate, resetValidationState };
}
