import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
//import { useMediaQuery } from "../../components/layout/useMediaQuery";
const html = htm.bind(h);

export default function AuthMockService({ children }) {
  async function signup({
    username,
    email,
    password,
    browserId,
    success,
    failed,
  }) {
    try {
      const response = await fetch("/mock/auth/signup", {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
      });
      const { token, inputValErrorCodes } = await response.json();
      const { status, ok } = response;
      //debugger;
      success({ token, inputValErrorCodes, ok, status });
    } catch (error) {
      failed(error);
    }
  }
  async function login({
    emailorusername,
    password,
    success,
    failed,
    browserId,
  }) {
    try {
      const response = await fetch(`/mock/auth/login`, {
        headers: {
          "Conten-Type": "application/json",
          "Access-Control-Allow-Headers": "*",
          Authorization: `Basic ${btoa(`${emailorusername}:${password}`)}`,
        },
        method: "POST",
        body: JSON.stringify({ browserId }),
      });
      const { token, inputValErrorCodes } = await response.json();
      const { status, ok } = response;

      success({ token, inputValErrorCodes, ok, status });
    } catch (error) {
      failed(error);
    }
  }
  function changepassword() {}
  function forgotpassword() {}
  return children({ signup, login, changepassword, forgotpassword });
}
