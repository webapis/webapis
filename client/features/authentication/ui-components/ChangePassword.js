import { h } from 'preact';
import { useEffect } from 'preact/hooks';
//import './css/style.scss';
import TextInput from 'controls/text-input';

import Button from 'controls/button';
import { useAuthContext } from '../state/auth-context';

import * as actions from '../state/actions';
import { useMediaQuery } from 'components/layout/useMediaQuery';
import { Paper } from 'components/layout/Paper';
import { Grid } from 'components/layout/Grid';
import {useAppRoute} from 'components/app-route'
import { useUserName } from '../state/useUserName';
export default function ChangePassword({changePassword}) {
  const { state, dispatch } = useAuthContext();
  const { dispatch: formDispatch } = useFormContext();
  const { token } = useUserName();
  const {onAppRoute} = useAppRoute();
  const { device } = useMediaQuery();

  const { password, confirm, error } = state;

  useEffect(() => {
    let url = new URL(window.location.href);
    var urltoken = url.searchParams.get('token');

    if (urltoken) {
      dispatch(actions.getTokenFromUrl({ token: urltoken }));
    }
  }, []);

  useEffect(() => {
    if (state.authFeedback) {
      onAppRoute({featureRoute: '/authfeedback',route:'/auth'});
    }
  }, [state.authFeedback]);

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
    <Grid width={device === 'phone' ? 100 : 25}>
      <Paper>
    
          <TextInput
            value={password}
            type='password'
            id='password'
            name='password'
            placeholder='Enter new password'
            onChange={handleChange}
          //  validationTypes={[validationTypes.PASSWORD_FORMAT_VALIDATION]}
          />
          <TextInput
            value={confirm}
            type='password'
            id='confirm'
            name='confirm'
            placeholder='Confirm new password'
            onChange={handleChange}
         //   validationTypes={[validationTypes.PASSWORDS_MATCH_VALIDATION]}
          />
          <Button
            type='button'
     
            data-testid='change-pass-btn'
            onClick={changePassword}
            
        >CHANGE</Button>
   
      </Paper>
    </Grid>
  );
}
