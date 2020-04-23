import actionTypes from './actionTypes';
import validationState from './validationStates';

export const initState = { validation: {} };

export function formReducer(state, action) {
  debugger;
  let nextState = null;
  switch (action.type) {
    case actionTypes.SERVER_VALIDATION:
      nextState = {
        ...state,
        validation: {
          ...state.validation,
          [action.validationType]: {
            validationState: action.validationState,
            message: action.message,
          },
        },
      };
debugger;
      return nextState;
    case actionTypes.CLIENT_VALIDATION:
      nextState = {
        ...state,
        validation: {
          ...state.validation,

          [action.validationType]: {
            validationState: action.validationState,
            message: action.message,
          },
        },
      };

      return nextState;

    case actionTypes.RESET_VALIDATION_STATE:
      return {
        ...state,
        validation: {
          ...state.validation,
          [action.validationType]: {
            validationState: validationState.INACTIVE,
            message: '',
          },
        },
      };

    case actionTypes.INPUT_FOCUSED:
      return {
        ...state,
        validation: {
          ...state.validation,
          formState: validationState.INACTIVE,
          [action.propName]: {
            validationState: validationState.INACTIVE,
            message: '',
          },
        },
      };
    case actionTypes.INIT_FORM_VALIDATION_STATE:
      return {
        ...state,
        validation: {
          ...state.validation,
          formState: validationState.INACTIVE,
        },
      };
    case actionTypes.INC_INPUT_COUTN:
      return { ...state, count: state.count + 1 };
    default:
      return state;
  }
}
