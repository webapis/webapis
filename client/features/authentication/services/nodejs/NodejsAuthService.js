export default function NodejsAuthProvider({ children }) {
  async function signup({
    username,
    email,
    password,
    started,
    success,
    failed,
  }) {
    try {
      started();
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
      success(result);
    } catch (error) {
      const err = error;
      failed({ error });
    }
  }
  function login({ emailorusername, password, started, success, failed }) {}
  function changepassword({ confirm, password, started, success, failed }) {}
  function requestpasswordchange({ email }) {}

  return children({ signup, login, changepassword, requestpasswordchange });
}
