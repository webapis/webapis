import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import './css/style.css';
import Input from '../form/Input';
import Form from '../form/Form';
import Button from '../form/Button';
import validationTypes from '../form/validationTypes';
import { useAuthContext } from './auth-context';
import { useFormContext } from '../form/form-context';
import * as actions from './actions';
import { useMediaQuery } from '../layout/useMediaQuery';
import { Paper } from '../layout/Paper';
import { Grid } from '../layout/Grid';
import { useRouteContext } from '../route/router';
import { useUserName } from './useUserName';
export default function ChangePassword() {
  const { state, dispatch } = useAuthContext();
  const { dispatch: formDispatch } = useFormContext();
  const { token } = useUserName();
  const [route, setRoute] = useRouteContext();
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
      setRoute('/authfeedback');
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
  function handleChangePass() {
    dispatch(
      actions.changePassword({
        dispatch,
        state,
        token,
        formDispatch,
      })
    );
  }
  return (
    <Grid width={device === 'phone' ? 100 : 25}>
      <Paper>
        <Form formTitle='Change Password' error={error}>
          <Input
            value={password}
            type='password'
            id='password'
            name='password'
            placeholder='Enter new password'
            onChange={handleChange}
            validationTypes={[validationTypes.PASSWORD_FORMAT_VALIDATION]}
          />
          <Input
            value={confirm}
            type='password'
            id='confirm'
            name='confirm'
            placeholder='Confirm new password'
            onChange={handleChange}
            validationTypes={[validationTypes.PASSWORDS_MATCH_VALIDATION]}
          />
          <Button
            type='button'
            id='change-pass-btn'
            data-testid='change-pass-btn'
            onClick={handleChangePass}
            title='Change'
          />
        </Form>
      </Paper>
    </Grid>
  );
}