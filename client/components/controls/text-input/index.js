import { h } from "preact";

export default function TextInput(props) {
  const { label, name, type, isValid, message } = props;
  return (
    <div className="form-group p-0">
      <label for={name}>{label}</label>
      <input
        type={type}
        className={`form-control ${isValid && "is-valid"} ${
          !isValid && isValid !== undefined && "is-invalid"
        }`}
        id={name}
        aria-describedby={name}
        {...props}
      />
      {!isValid && (
        <small
          id="emailHelp"
          className={`${!isValid && "invalid-feedback"}`}
          data-testid={`message-${name}`}
        >
          {message}
        </small>
      )}
    </div>
  );
}
