import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import Input from '../form/Input';
import Form from '../form/Form';
import Button from '../form/Button';
import validationTypes from '../form/validationTypes';
import './css/style.css';
import { useAuthContext } from '../state/auth-context';
import { useFormContext } from '../form/form-context';
import * as actions from '../state/actions';
import { useMediaQuery } from '../layout/useMediaQuery';
import { Paper } from '../layout/Paper';
import { Grid } from '../layout/Grid';
import {useAppRoute} from '../app-route/AppRouteProvider'
export default function RequestPassChange({forgotPassword}) {
  const {onAppRoute}= useAppRoute();
  const { device } = useMediaQuery();
  const { dispatch, state } = useAuthContext();
  const { dispatch: formDispatch } = useFormContext();
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
        <Form formTitle='Forgot Password'>
          <Input
            value={email}
            placeholder='email'
            name='email'
            onChange={handleChange}
            type='email'
            id='email'
            validationTypes={[
              validationTypes.EMAIL_FORMAT_VALIDATION,
              validationTypes.EMAIL_NOT_REGISTERED,
            ]}
          />
          <Button
            className='btn'
            type='button'
            onClick={forgotPassword}
            id='requestpasschange-btn'
            title='Send'
          />
        </Form>
      </Paper>
    </Grid>
  );
}
