import { useAuthContext } from './AuthProvider'
import actionTypes from './actionTypes'
export function useAuth() {
    const [state, dispatch] = useAuthContext()
    function onChange(e) {
        const {name,value}=e.target
        dispatch({type:actionTypes.VALUE_CHANGED,name,value})
     }
    function onLogin() {
        dispatch({type:actionTypes.LOGIN_STARTED})
    }
    function onSignup() {
        dispatch({type:actionTypes.SIGNUP_STARTED})
     }
    function onRequestPasswordChange() {
        dispatch({type:actionTypes.REQUEST_PASS_CHANGE_STARTED})
     }
    function onPasswordChange() { 
        dispatch({type:actionTypes.CHANGE_PASSWORD_STARTED})
    }
  
    function logout(){
        const {username}=state.user
        localStorage.removeItem(username)
        dispatch({type:actionTypes.LOGOUT_STARTED})
    }
    return { state, dispatch, onLogin, onSignup, onRequestPasswordChange, onPasswordChange, onChange,logout }
}