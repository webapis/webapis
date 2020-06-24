import actionTypes from '../actionTypes'
export function signUp({dispatch,state}) {
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
        console.log('User created successful with name: ' + user.get("username") + ' and email: ' + user.get("email"));

    }).catch(function(error){
        console.log("Error: " + error.code + " " + error.message);
    });
}