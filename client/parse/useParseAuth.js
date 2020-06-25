import {useAuthContext} from '../auth/auth-context'
import {useFormContext} from '../form/form-context'
import * as actions from './auth-actions'
export function useParseAuth(){
const {state,dispatch}= useAuthContext()
const {dispatch:formDispatch}= useFormContext()
    function signup(){
        actions.signUp({state,dispatch,formDispatch})
    }
    function login (){
        actions.login({state,dispatch,formDispatch})  
    }
    function forgotPassword(){
        debugger;
        actions.forgotPassword({state,dispatch,formDispatch})  
    }
    function changePassword(){

    }
   

    return {signup,login,changePassword,forgotPassword}

}