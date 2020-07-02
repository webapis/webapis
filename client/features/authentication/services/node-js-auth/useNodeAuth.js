import * as actions from './actions'
import { useAuthContext } from '../../state/auth-context'
export function useNodeAuth() {
    const { state, dispatch } = useAuthContext()
    const { dispatch: formDispatch } = useFormContext()
    function login() {
        actions.login({ dispatch, state, formDispatch })
    }

    function signup() {
        actions.signup({ dispatch, formDispatch, state })
    }
    function forgotPassword() {
        actions.forgotPassword({ dispatch, state, formDispatch })
    }

    function changePassword() {
        actions.changePassword({ dispatch, state, formDispatch })
    }

   
  

    return { signup, login, forgotPassword, changePassword }

}