import {
  h,
  render,
} from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
const html = htm.bind(h);
export default function NodejsAuthProvider(props) {
  const { children } = props;

  async function signup({
    username,
    email,
    password,
    browserId,
    started,
    success,
    failed,
  }) {
    try {
      debugger;

      const response = await fetch(`/auth/signup`, {
        body: JSON.stringify({
          password,
          email,
          username,
          browserId,
        }),
        headers: {
          ContentType: "application/json",
          Accept: "application/json",
        },
        method: "POST",
      });
      const result = await response.json();
      debugger;
      success({ result, response });
    } catch (error) {
      debugger;
      failed(error);
    }
  }
  async function login({
    emailorusername,
    password,
    started,
    success,
    failed,
    hasBrowserId,
  }) {
    try {
      started();

      const response = await fetch(`/auth/login`, {
        headers: {
          "Conten-Type": "application/json",
          "Access-Control-Allow-Headers": "*",
          Authorization: `Basic ${btoa(`${emailorusername}:${password}`)}`,
        },
        method: "POST",
        body: JSON.stringify({ hasBrowserId }),
      });

      const result = await response.json();

      success(result);
    } catch (error) {
      const err = error;
      debugger;
      failed(error);
    }
  }
  async function changepassword({
    confirm,
    password,
    started,
    success,
    failed,
    token,
  }) {
    try {
      started();

      const response = await fetch(`/auth/changepass`, {
        method: "put",
        body: JSON.stringify({
          confirm,
          password,
          token,
        }),
      });

      const result = await response.json();
      success(response);
    } catch (error) {
      failed(error);
    }
  }
  async function requestpasswordchange({ email }) {
    try {
      const response = await fetch(`/auth/requestpasschange`, {
        method: "post",
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      success({ result, response });
    } catch (error) {
      failed(error);
    }
  }

  // return html `<div ...${props} signup=${signup} login=${login} changepassword=${changepassword} requestpasswordchange=${requestpasswordchange} />`;
  return children({ signup, login, changepassword, requestpasswordchange });
}
