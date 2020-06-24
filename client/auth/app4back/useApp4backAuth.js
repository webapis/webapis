import {useAuthContext} from '../auth-context'
import {useFormContext} from '../../form/form-context'
import * as actions from './actions'
export function useApp4backAuth(){
const {state,dispatch}= useAuthContext()
const {dispatch:formDispatch}= useFormContext()
    function signup(){
        actions.signUp({state,dispatch})
    }
    function login (){}
    function changepassword(){}
    function forgotpassword(){}

    return {signup,login,changepassword,forgotpassword}

}