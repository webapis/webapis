import { h } from 'preact';
import {useEffect} from 'preact/hooks'
import TextInput from 'controls/text-input';
import Button from 'controls/button'



export default function Login(props) {
  const { emailorusername, password,loading,onLogin,onChange,validation, onForgotPassword } =props;


  return (

      <div className="col-md-4 border mx-auto rounded" style={{margin:15, padding:16}}>
      {loading &&  <div className="progress" style="height: 5px;">
  <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div>
</div>}
          <TextInput
            value={emailorusername}
            onChange={onChange}
            label="Email or username"
            name='emailorusername'
            type='text'
            placeholder='Enter email or username'
            id='emailOrUsername'
            data-testid='emailOrUsername'
            message={validation && validation['emailorusername'].message}
            isValid={validation&& validation['emailorusername'].isValid}
            // validationTypes={[
            //   validationTypes.USERNAME_OR_EMAIL_FORMAT_VALIDATION,
            //   validationTypes.INVALID_CREDENTIALS,
            //   validationTypes.EMAIL_NOT_REGISTERED,
            //   validationTypes.USERNAME_NOT_REGISTERED,
            // ]}
          />

          <TextInput
            label="Password"
            value={password}
            onChange={onChange}
            name='password'
            type='password'
            placeholder='enter password'
            id='password'
            data-testid='password'
            message={validation &&  validation['password'].message}
            isValid={validation && validation['password'].isValid}
            // validationTypes={[
            //   validationTypes.EMPTY_STRING_VALIDATION,
            //   validationTypes.INVALID_CREDENTIALS,
            // ]}
          />
  <div style={{display:'flex',justifyContent:'space-between'}}>

 
          <Button
            type='button'
            id='login-btn'
            data-testid='login-btn'
            onClick={onLogin}
            loading={loading}
            title="Login"
            bg="primary"
          />
         
          <Button onClick={onForgotPassword} id='forgotpassword' data-testid='forgotpassword' outline   bg="primary" title="Forgot Password!"/>
          
          </div>
          </div>


  );
}
