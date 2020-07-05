import * as actions from './actions'
import { useAuthContext } from '../../state/auth-context'
export function useNodeAuth() {
    const { state, dispatch } = useAuthContext()
    function login() {
        actions.login({ dispatch, state })
    }

    function signup() {
        actions.signup({ dispatch, state })
    }
    function forgotPassword() {
        actions.forgotPassword({ dispatch, state })
    }

    function changePassword() {
        actions.changePassword({ dispatch, state, formDispatch })
    }

   
  

    return { signup, login, forgotPassword, changePassword }

}