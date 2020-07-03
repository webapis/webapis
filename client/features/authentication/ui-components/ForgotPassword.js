import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import TextInput from 'controls/text-input';

import Button from 'controls/button';
//import './css/style.css';
import { useAuthContext } from '../state/auth-context';
import * as actions from '../state/actions';
import { useMediaQuery } from 'components/layout/useMediaQuery';
import { Paper } from 'components/layout/Paper';
import { Grid } from 'components/layout/Grid';
import {useAppRoute} from 'components/app-route'
export default function RequestPassChange({forgotPassword}) {
  const {onAppRoute}= useAppRoute();
  const { device } = useMediaQuery();
  const { dispatch, state } = useAuthContext();
  const { email } = state;

 
  function handleChange(e) {
    const { name, value } = e.target;
    dispatch(actions.valueChanged({ propName: name, value, dispatch, state }));
  }

  useEffect(() => {
    if (state.authFeedback) {
      debugger;
      onAppRoute({featureRoute: '/authfeedback',route:'/auth'});
    }
  }, [state.authFeedback]);

  return (
    <Grid width={device === 'phone' ? 100 : 25}>
      <Paper>
     
          <TextInput
            value={email}
            placeholder='email'
            name='email'
            onChange={handleChange}
            type='email'
            id='email'
            // validationTypes={[
            //   validationTypes.EMAIL_FORMAT_VALIDATION,
            //   validationTypes.EMAIL_NOT_REGISTERED,
            // ]}
          />
          <Button
            className='btn'
            type='button'
            onClick={forgotPassword}
  
            data-testid="requestpasschange-btn"
          >
            SEND
          </Button>
    
      </Paper>
    </Grid>
  );
}
