import actionTypes from '../auth/actionTypes';
import {serverValidation} from '../form/actions'
Parse.initialize("zttpnqTr8refktBWNekZhZxSxwPaAAnElQ9k7CuA","Q7SHSFLG618izbySMpAsFAqgnOLaYgxNlwfFhOAr"); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
Parse.serverURL = `https://${ip}:1337/parse`
Parse.liveQueryServerURL = `https://${ip}:1337/parse`
//Parse.serverURL = 'https://parseapi.back4app.com/'
export async function signUp({dispatch,state,formDispatch}) {
  try {
    const {username,password,email}=state
    dispatch({type:actionTypes.SIGNUP_STARTED})
    // Create a new instance of the user class
    var user = new Parse.User();
    user.set("username", username);
    user.set("password", password);
    user.set("email", email);
    let success = await user.signUp()
    window.localStorage.setItem(
      'webcom',
      JSON.stringify({
        token :success.get('sessionToken'),
        username,
        email,
      })
    );
    const HangoutUser = Parse.Object.extend("HangoutUser");
    const hangoutUser = new HangoutUser();
    hangoutUser.set('username',username)
    hangoutUser.set('email',email)
    hangoutUser.set('userid',success.id)
    await  hangoutUser.save()
    dispatch({type:actionTypes.SIGNUP_SUCCESS,user:{username,email,token:success.get('sessionToken')}})
  } catch (error) {
    formDispatch(serverValidation({status:error.code}))
  }
  
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
        window.localStorage.setItem(
            'webcom',
            JSON.stringify({
              token,
              username,
              email,
            })
          );
        dispatch({type:actionTypes.LOGIN_SUCCESS,user:{username,email,token}})
            console.log('User created successful with name: ' + user.get("username") + ' and email: ' + user.get("email"));
    }).catch(function(error){
        const err =error
        debugger;
        formDispatch(serverValidation({status:error.code}))
        console.log("Error: " + error.code + " " + error.message);
    });
}


export function forgotPassword({dispatch, state, formDispatch}) {
    dispatch({ type: actionTypes.REQUEST_PASS_CHANGE_STARTED });
    const { email } = state;
    debugger;
    Parse.User.requestPasswordReset(email).then(function() {
        debugger;
        dispatch({
            type: actionTypes.REQUEST_PASS_CHANGE_SUCCESS,
            token: result.token,
            message: `A link for password change  has been sent to, ${email}! `,
          });
      console.log("Password reset request was sent successfully");
    }).catch(function(error) {
        const err=error;
        debugger;
      console.log("The login failed with error: " + error.code + " " + error.message);
    });
}