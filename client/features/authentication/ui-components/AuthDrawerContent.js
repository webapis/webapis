
import { h } from 'preact';
import { useAppRoute } from 'components/app-route'
import List, { ListItem } from 'controls/list';
import userIcon from '../icons/user64.png';
import { logout } from '../state/actions';
import { useAuthContext } from '../state/auth-context';
import { useMediaQuery } from 'components/layout/useMediaQuery'
const style = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'auto 5% auto',
    justifyItems: 'center',
    padding: 16
  },
};

export function AuthDrawerContent({ toggleDrawer }) {
  const { device } = useMediaQuery()
  const { state } = useAuthContext();
  const { onAppRoute } = useAppRoute();

  function handleRoute(e) {
    e.preventDefault();
    const { id } = e.target;
    onAppRoute({ featureRoute: `/${id}`, route: '/auth' });
    if (device === 'phone') {
      toggleDrawer()
    }
  }

  return (
    <div style={{ paddingTop: 10 }}>
      {!state.user && <UnAuthedState handleRoute={handleRoute} />}
      {state.user && (
        <AuthedState
          onAppRoute={onAppRoute}
          handleRoute={handleRoute}
          userName={state.user.username}
        />
      )}
      <hr style={{ height: 1 }} />
    </div>
  );
}

export function AuthedState({ handleRoute, userName, onAppRoute }) {
  function handleLogOut() {

    onAppRoute({ featureRoute: '/', route: '/home' });
    logout();
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div>
          <img src={userIcon} style={{ paddingRight: 5 }} />
        </div>

        <div>
          <a href='/' onClick={handleLogOut} id='logout' data-testid='logout'>
            Logout
          </a>
        </div>
      </div>
      <div style={{ marginBottom: 8 }}>Welcome, {userName}</div>
      <List>
        <ListItem onClick={handleRoute} id='changepassword' data-testid='changepassword'>
          Change Password
        </ListItem>
      </List>
    </div>
  );
}

export function UnAuthedState({ handleRoute }) {
  return (
    <div>
      <div style={style.grid}>
        <a href='/' onClick={handleRoute} id='login' data-testid='login'>
          Login
        </a>
        <div>|</div>
        <a href='/' onClick={handleRoute} id='signup' data-testid='signup'>
          Signup
        </a>
      </div>
    </div>
  );
}
