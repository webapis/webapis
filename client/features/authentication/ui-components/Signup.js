import { h } from 'preact';
import { useEffect } from 'preact/hooks';


import Button from 'controls/button'
import TextInput from 'controls/text-input'
export default function Signup(props) {
  const { username, password, email,loading,onSignup,onChange,validation } = props;
  return (
<div className="col-md-4 border mx-auto rounded" style={{margin:15, padding:16}}>
{loading &&  <div className="progress" style="height: 5px;">
  <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div>
</div>}
          <TextInput
            label="Username"
            value={username}
            onChange={onChange}
            type='text'
            data-testid='username'
            name='username'
            placeholder='username'
            isValid={validation && validation['username'].isValid}
            message={validation && validation['username'].message}
            // validationTypes={[
            //   validationTypes.USERNAME_FORMAT_VALIDATION,
            //   validationTypes.USERNAME_TAKEN,
            //   validationTypes.EMPTY_STRING_VALIDATION,
            // ]}
          />
          <TextInput
            label="Email"
            onChange={onChange}
            value={email}
            placeholder='email'
            type='email'
            data-testid='email'
            name='email'
            isValid={validation && validation['email'].isValid}
            message={validation && validation['email'].message}
            // validationTypes={[
            //   validationTypes.EMAIL_FORMAT_VALIDATION,
            //   validationTypes.REGISTERED_EMAIL,
             
            // ]}
          />
          <TextInput
            label="Password"
            onChange={onChange}
            value={password}
            placeholder='password'
            type='password'
            data-testid='password'
            name='password'
            isValid={validation && validation['password'].isValid}
            message={validation && validation['password'].message}
            // validationTypes={[validationTypes.PASSWORD_FORMAT_VALIDATION]}
          />
          <Button
          
            type='button'
            onClick={onSignup}
            id='signup-btn'
            data-testid="signup-btn"
            loading={loading}
            title="Signup"
            bg="primary"
          />
         
          
  
          </div>
  );
}
