import actionTypes from '../actionTypes';
import {serverValidation} from '../../form/actions'
export function signUp({dispatch,state,formDispatch}) {
    const {username,password,email}=state
    dispatch({type:actionTypes.SIGNUP_STARTED})
    // Create a new instance of the user class
    var user = new Parse.User();
    user.set("username", username);
    user.set("password", password);
    user.set("email", email);
  debugger;
    // other fields can be set just like with Parse.Object
    user.signUp().then(function(user) {
        let username = user.get("username")
        let email =user.get("email")
        let token =user.get('sessionToken') 
        const us =user;
        debugger
        dispatch({type:actionTypes.SIGNUP_SUCCESS,username,email,token})
        console.log('User created successful with name: ' + user.get("username") + ' and email: ' + user.get("email"),+user.get('sessionToken'));

    }).catch(function(error){
        const err =error
        debugger;
        formDispatch(serverValidation({status:error.code}))
       
        console.log("Error: " + error.code + " " + error.message);
    });
}



export function login({dispatch,state,formDispatch}) {
    const { emailorusername, password}= state
    dispatch({type:actionTypes.LOGIN_STARTED})
    debugger;
    // Create a new instance of the user class
    var user =  Parse.User.logIn(emailorusername, password).then(function(user) {
        let username = user.get("username")
        let email =user.get("email")
        let token =user.get('sessionToken') 
        debugger;
        dispatch({type:actionTypes.LOGIN_SUCCESS,username,email,token})
            console.log('User created successful with name: ' + user.get("username") + ' and email: ' + user.get("email"));
    }).catch(function(error){
        const err =error
        debugger;
        formDispatch(serverValidation({status:error.code}))
        console.log("Error: " + error.code + " " + error.message);
    });
}


export function resetPassword() {
    Parse.User.requestPasswordReset("email@example.com").then(function() {
      console.log("Password reset request was sent successfully");
    }).catch(function(error) {
      console.log("The login failed with error: " + error.code + " " + error.message);
    });
}