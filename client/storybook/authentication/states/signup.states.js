import { h } from "preact";
import Signup from "features/authentication/ui-components/signup";
const validationSuccess = {
  username: { isValid: true, message: "." },
  password: { isValid: true, message: "." },
  email: { isValid: true, message: "." },
};
const validationError = {
  username: { isValid: false, message: "Username is not valid" },
  password: { isValid: false, message: "Pasword is not valid" },
  email: { isValid: false, message: "Email is not valid" },
};
export default function SignupStates() {
  return (
    <div className="container">
      <div className="row">
        <span className="col-md-12">
          <h5 className="text-center">Signup Validation Success</h5>
          <Signup
            username="testuser"
            email="test@gmail.com"
            password="123456789"
            validation={validationSuccess}
          />
        </span>
      </div>
      <div className="row">
        <span className="col-md-12">
          <h5 className="text-center">Signup Validation Error</h5>
          <Signup
            username="testuser"
            email="test@gmail.com"
            password="123456789"
            validation={validationError}
          />
        </span>
      </div>

      <div className="row">
        <span className="col-md-12">
          <h5 className="text-center">Signing up</h5>
          <Signup
            username="testuser"
            email="test@gmail.com"
            password="123456789"
            validation={validationSuccess}
            loading
          />
        </span>
      </div>
      <div className="row">
        <span className="col-md-12">
          <h5 className="text-center">Signing Sever error</h5>
          <Signup
            username="testuser"
            email="test@gmail.com"
            password="123456789"
            validation={validationSuccess}
            error={{ message: "Server is unavailable" }}
          />
        </span>
      </div>
    </div>
  );
}
