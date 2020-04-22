import { useState, useEffect } from 'preact/hooks';
import validationTypes from './validationTypes';
import validationStates from './validationStates';

const valTypes = Object.keys(validationTypes);
export default function useForm() {
  const [formState, setFormState] = useState(false);
  const state = useSelector(state => state);
  useEffect(() => {
    let currentState = true;
    valTypes.forEach(validationType => {
      if (
        state.form &&
        state.form.validation &&
        state.form.validation[validationType]
      ) {
        const validationState =
          state.form.validation[validationType].validationState;
        if (
          validationState === validationStates.INACTIVE ||
          validationState === validationStates.INVALID
        ) {
          currentState = false;
        }
      }
    });
    if (
      Object.keys(state.form.validation).length === state.form.validation.count
    ) {
      setFormState(currentState);
    }
  }, [state.form.validation]);

  return { formState };
}
