import actionTypes from "../../state/actionTypes";
import serverValidation from "../../validation/serverErrorActions";
import * as cv from "../../validation/constraintValidators";
export async function signup({ dispatch, state }) {
  debugger;
  const { username, password, email } = state;
  if (
    username &&
    password &&
    email &&
    cv.validateUserNameConstraint({ username }) &&
    cv.validateEmailConstraint({ email }) &&
    cv.validatePasswordConstraint({ password })
  ) {
    try {
      debugger;
      // Create a new instance of the user class
      var user = new Parse.User();
      user.set("username", username);
      user.set("password", password);
      user.set("email", email);
      let success = await user.signUp();
      window.localStorage.setItem(
        "webcom",
        JSON.stringify({
          token: success.get("sessionToken"),
          username,
          email,
          objectId: success.id,
        })
      );

      const HangoutUser = Parse.Object.extend("HangoutUser");
      const hangoutUser = new HangoutUser();
      hangoutUser.set("username", username);
      hangoutUser.set("email", email);
      hangoutUser.set("userid", success.id);
      await hangoutUser.save();
      dispatch({
        type: actionTypes.SIGNUP_SUCCESS,
        user: {
          username,
          email,
          token: success.get("sessionToken"),
          objectId: success.id,
        },
      });
    } catch (error) {
      debugger;
      serverValidation({ status: error.code, dispatch });
      dispatch({ type: actionTypes.SERVER_ERROR_RECIEVED, error });
      dispatch({ type: actionTypes.SIGNUP_FAILED });
    }
  } else {
    debugger;
    dispatch({
      type: actionTypes.CONSTRAINT_VALIDATION,
      name: "username",
      ...cv.validateUserNameConstraint({ username }),
    });
    dispatch({
      type: actionTypes.CONSTRAINT_VALIDATION,
      name: "email",
      ...cv.validateEmailConstraint({ email }),
    });
    dispatch({
      type: actionTypes.CONSTRAINT_VALIDATION,
      name: "password",
      ...cv.validatePasswordConstraint({ password }),
    });
    dispatch({ type: actionTypes.SIGNUP_FAILED });
  }
}

export function login({ dispatch, state }) {
  const { emailorusername, password } = state;

  if (emailorusername && password) {
    debugger;
    // Create a new instance of the user class
    Parse.User.logIn(emailorusername, password)
      .then(function (user) {
        let username = user.get("username");
        let email = user.get("email");
        let token = user.get("sessionToken");
        window.localStorage.setItem(
          "webcom",
          JSON.stringify({
            token,
            username,
            email,
            objectId: user.id,
          })
        );

        dispatch({
          type: actionTypes.LOGIN_SUCCESS,
          user: { username, email, token, objectId: user.id },
        });
        console.log(
          "User created successful with name: " +
            user.get("username") +
            " and email: " +
            user.get("email")
        );
      })
      .catch(function (error) {
        debugger;
        serverValidation({ status: error.code, dispatch });
        dispatch({ type: actionTypes.SERVER_ERROR_RECIEVED, error });
        dispatch({ type: actionTypes.LOGIN_FAILED });
      });
  } else {
    //empty emailorusername or password
    dispatch({
      type: actionTypes.CONSTRAINT_VALIDATION,
      name: "emailorusername",
      ...cv.validateEmptyString({ value: emailorusername }),
    });
    dispatch({
      type: actionTypes.CONSTRAINT_VALIDATION,
      name: "password",
      ...cv.validateEmptyString({ value: password }),
    });
    dispatch({ type: actionTypes.LOGIN_FAILED });
  }
}

export function forgotPassword({ dispatch, state, formDispatch }) {
  dispatch({ type: actionTypes.REQUEST_PASS_CHANGE_STARTED });
  const { email } = state;

  Parse.User.requestPasswordReset(email)
    .then(function (result) {
      dispatch({
        type: actionTypes.REQUEST_PASS_CHANGE_SUCCESS,
        token: result.token,
        message: `A link for password change  has been sent to, ${email}! `,
      });
      console.log("Password reset request was sent successfully");
    })
    .catch(function (error) {
      // formDispatch(serverValidation({status:error.code}))

      console.log(
        "The login failed with error: " + error.code + " " + error.message
      );
    });
}
