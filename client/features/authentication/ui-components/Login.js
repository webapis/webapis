import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import TextInput from 'controls/text-input';
import AsyncButton from 'controls/async-button'
import { useAuthContext } from '../state/auth-context';
import { useMediaQuery } from 'components/layout/useMediaQuery';
import {useAppRoute} from 'components/app-route'
import { Paper } from 'components/layout/Paper';
import { Grid } from 'components/layout/Grid';
import * as actions from '../state/actions';

export default function Login({login}) {
  const {onAppRoute} = useAppRoute();

  const { device } = useMediaQuery();
  const {state, dispatch} = useAuthContext();
  const {dispatch:formDispatch}=useFormContext()

  const { emailorusername, password, error,loading } =state;

  useEffect(() => {
    if (state.user&& state.user.token) {
    
      onAppRoute({featureRoute: '/',route:'/'});
    }
  }, [state.user]);

  function handleRoute(e) {
    e.preventDefault();
   
    onAppRoute({featureRoute: '/forgotpassword',route:'/auth'});
  }

  function handleChange(e) {
    const { name, value } = e.target;
    dispatch(
      actions.valueChanged({
        propName: name,
        value,
        dispatch,
        state,
      })
    );
  }
 

  return (


 
    <Grid width={device === 'phone' ? 100 :50}>
      <Paper>
      
          <TextInput
            value={emailorusername}
            onChange={handleChange}
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
            value={password}
            onChange={handleChange}
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
            onClick={login}
            loading={loading}
          >
            LOGIN
          </AsyncButton>
          <a href='/' onClick={handleRoute} id='forgotpassword' data-testid='forgotpassword'>
            Forgot Password!
          </a>
  
      </Paper>
    </Grid>
  );
}
