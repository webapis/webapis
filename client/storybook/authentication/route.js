import { h } from 'preact'
import { AppRoute } from 'components/app-route';
import LoginStates from './states/login.states'
import SignUpStates from './states/signup.states'
import ChangePasswordStates from './states/change-password.states'
import ForgotPasswordStates from './states/forgot-password.states'
export default function AuthDemoRoutes() {

    return (<div>
        <AppRoute path="/login-states">
            <LoginStates />
        </AppRoute>
        <AppRoute path="/signup-states">
            <SignUpStates />
        </AppRoute>
        <AppRoute path="/change-password-states">
            <ChangePasswordStates />
        </AppRoute>
        <AppRoute path="/forgot-password-states">
            <ForgotPasswordStates />
        </AppRoute>
    </div>)
}