import actionTypes from '../../state/actionTypes';


export async function signUp({dispatch,state,formDispatch}) {
  try {
    const {username,password,email}=state
    if(email===''){
      formDispatch(serverValidation({status:-3}))
      throw new Error('Email cannot be emty')
    }
    else   if(password===''){
     // formDispatch(serverValidation({status:-4}))
      throw new Error('Password cannot be emty')
    }
    debugger
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
        objectId:success.id
      })
    );
   
    const HangoutUser = Parse.Object.extend("HangoutUser");
    const hangoutUser = new HangoutUser();
    hangoutUser.set('username',username)
    hangoutUser.set('email',email)
    hangoutUser.set('userid',success.id)
    await  hangoutUser.save()
    dispatch({type:actionTypes.SIGNUP_SUCCESS,user:{username,email,token:success.get('sessionToken'),objectId:success.id}})
  } catch (error) {
    debugger
   // formDispatch(serverValidation({status:error.code}))
  }
  
}



export function login({dispatch,state,formDispatch}) {
    const { emailorusername, password}= state
    dispatch({type:actionTypes.LOGIN_STARTED})
      debugger
    // Create a new instance of the user class
       Parse.User.logIn(emailorusername, password).then(function(user) {
        let username = user.get("username")
        let email =user.get("email")
        let token =user.get('sessionToken') 
        window.localStorage.setItem(
            'webcom',
            JSON.stringify({
              token,
              username,
              email,
              objectId:user.id
            })
          );
      
        dispatch({type:actionTypes.LOGIN_SUCCESS,user:{username,email,token,objectId:user.id}})
            console.log('User created successful with name: ' + user.get("username") + ' and email: ' + user.get("email"));
    }).catch(function(error){
       
        debugger;
       // formDispatch(serverValidation({status:error.code}))

    });
}


export function forgotPassword({dispatch, state, formDispatch}) {
    dispatch({ type: actionTypes.REQUEST_PASS_CHANGE_STARTED });
    const { email } = state;
    
    Parse.User.requestPasswordReset(email).then(function(result) {
        
        dispatch({
            type: actionTypes.REQUEST_PASS_CHANGE_SUCCESS,
            token: result.token,
            message: `A link for password change  has been sent to, ${email}! `,
          });
      console.log("Password reset request was sent successfully");
    }).catch(function(error) {
     // formDispatch(serverValidation({status:error.code}))
        
      console.log("The login failed with error: " + error.code + " " + error.message);
    });
}