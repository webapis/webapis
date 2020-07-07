import { h } from "preact";
import Login from "features/authentication/ui-components/Login";
const validationSuccess = {
  emailorusername: { isValid: true, message: "." },
  password: { isValid: true, message: "." },
};
const validationError = {
  emailorusername: { isValid: false, message: "invalid credentials" },
  password: { isValid: false, message: "invalid credentials" },
};
export default function LoginStates() {
  return (
    <div className="container">
      <div className="row">
        <span className="col-md-12">
          <h5 className="text-center"> Login Validation Success</h5>

          <Login
            emailorusername="testuser"
            password="123456789"
            validation={validationSuccess}
          />
        </span>
      </div>
      <div className="row">
        <span className="col-md-12">
          <h5 className="text-center">Login Validation Error</h5>

          <Login
            emailorusername="testuser"
            password="123456789"
            validation={validationError}
          />
        </span>
      </div>
      <div className="row">
        <span className="col-md-12">
          <h5 className="text-center">Logging in</h5>
          <Login
            emailorusername="testuser"
            password="123456789"
            validation={validationSuccess}
            loading
          />
        </span>
      </div>
      <div className="row">
        <span className="col-md-12">
          <h5 className="text-center">Logging Server error</h5>
          <Login
            emailorusername="testuser"
            password="123456789"
            validation={validationSuccess}
            error={{ message: "Server is unavailable" }}
          />
        </span>
      </div>
    </div>
  );
}
