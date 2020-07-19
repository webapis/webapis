import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import ChangePassword from "features/authentication/ui-components/ChangePassword";
const validationSuccess = {
  password: { isValid: true, message: "." },
  confirm: { isValid: true, message: "." },
};
const validationError = {
  password: { isValid: false, message: "invalid password format" },
  confirm: { isValid: false, message: "invalid password format" },
};
export default function ChangePasswordStates() {
  return (
    <div className="container">
      <div className="row">
        <span className="col-md-12">
          <h5 className="text-center"> ChangePassword Validation Success</h5>
          <ChangePassword
            password="123456789"
            confirm="123456789"
            validation={validationSuccess}
          />
        </span>
      </div>
      <div className="row">
        <span className="col-md-12">
          <h5 className="text-center">ChangePassword Validation Error</h5>
          <ChangePassword validation={validationError} />
        </span>
      </div>
      <div className="row">
        <span className="col-md-12">
          <h5 className="text-center">ChangePassword in progress</h5>
          <ChangePassword
            password="123456789"
            confirm="123456789"
            validation={validationSuccess}
            loading
          />
        </span>
      </div>
      <div className="row">
        <span className="col-md-12">
          <h5 className="text-center">ChangePassword Server error</h5>
          <ChangePassword
            password="123456789"
            confirm="123456789"
            validation={validationSuccess}
            error={{ message: "Server is unavailable" }}
          />
        </span>
      </div>
    </div>
  );
}
