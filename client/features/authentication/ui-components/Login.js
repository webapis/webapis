import { h } from 'preact';
import TextInput from 'controls/text-input';
import AsyncButton from 'controls/async-button'
import { Paper } from 'components/layout/Paper';


export default function Login(props) {
  const { emailorusername, password,loading,onNavigation,onLogin,onChange } =props;
  return (
      <Paper>
      <div style ={{flex:1,display:'flex', flexDirection:'column'}}>
          <TextInput
            value={emailorusername}
            onChange={onChange}
            label="Email or username"
            name='emailorusername'
            type='text'
            placeholder='Enter email or username'
            id='emailOrUsername'
            data-testid='emailOrUsername'
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
            // validationTypes={[
            //   validationTypes.EMPTY_STRING_VALIDATION,
            //   validationTypes.INVALID_CREDENTIALS,
            // ]}
          />

          <AsyncButton
            type='button'
            id='login-btn'
            data-testid='login-btn'
            onClick={onLogin}
            loading={loading}
          >
            LOGIN
          </AsyncButton>
          <a href='/' onClick={onNavigation} id='forgotpassword' data-testid='forgotpassword'>
            Forgot Password!
          </a>
          </div>
      </Paper>

  );
}
