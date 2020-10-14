class AuthServiceNodejs extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    this.addEventListener("login", async (e) => {
      this.dispatchEvent(
        new CustomEvent("server", {
          detail: { inputValErrorCodes: 201 },
          //   cancelable:true,
          //bubbles: false,
          //   cancelBubble:true

          //composed: true,
        })
      );
      try {
        const { emailorusername, password, browserId } = e.detail;

        console.log("login event recieved", e);
        const response = await fetch(`/auth/login`, {
          headers: {
            "Conten-Type": "application/json",
            "Access-Control-Allow-Headers": "*",
            Authorization: `Basic ${btoa(`${emailorusername}:${password}`)}`,
          },
          method: "POST",
          body: JSON.stringify({ browserId }),
        });

        const {
          token,
          inputValErrorCodes,
          email,
          username,
        } = await response.json();
        const { status, ok } = response;
        if (status === 200) {
          // dispatch({
          //   type: actionTypes.SIGNUP_SUCCESS,
          //   user: { token, username, email },
          // });
          this.dispatchEvent(
            new CustomEvent("login_succes", {
              detail: { token, username, email },
              bubbles: true,
              composed: true,
            })
          );
        } else if (status > 200 && status < 500) {
          // //
          // inputValErrorCodes.forEach((error) => {
          //   serverValidation({ status: error, dispatch });
          // });
          // dispatch({ type: actionTypes.SIGNUP_FAILED });
          this.dispatchEvent(
            new CustomEvent("server_validation_error", {
              detail: { inputValErrorCodes },
              //   cancelable:true,
              bubbles: false,
              //   cancelBubble:true

              //composed: true,
            })
          );
        } else if (status === 500) {
          // dispatch({
          //   type: actionTypes.SERVER_ERROR_RECIEVED,
          //   error: serverError,
          // });
          // dispatch({ type: actionTypes.SIGNUP_FAILED, error: serverError });
        }
      } catch (error) {
        throw error;
      }
      //   success({ token, inputValErrorCodes, ok, status, email, username });
    });

    shadowRoot.innerHTML = `<slot></slot>`;
  }
}

customElements.define("auth-service-nodejs", AuthServiceNodejs);
