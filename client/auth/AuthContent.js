import { h } from 'preact';
import { useRouteContext } from '../route/router';
import { List, ListItem } from '../layout/NavList';
import userIcon from './icons/user64.png';
import { logout } from '../auth/actions';
import { useUserName } from './useUserName';
const style = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'auto 5% auto',
    justifyItems: 'center',
  },
};

export function AuthContent() {
  const { userName } = useUserName();

  const [route, setRoute] = useRouteContext();
  function handleRoute(e) {
    e.preventDefault();
    const { id } = e.target;
    setRoute(`/${id}`);
  }

  return (
    <div style={{ paddingTop: 10 }}>
      {!userName && <UnAuthedState handleRoute={handleRoute} />}
      {userName && (
        <AuthedState
          setRoute={setRoute}
          handleRoute={handleRoute}
          userName={userName}
        />
      )}
      <hr style={{ height: 1 }} />
    </div>
  );
}

export function AuthedState({ handleRoute, userName, setRoute }) {
  function handleLogOut() {
    debugger;
    setRoute('/');
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
        <ListItem onClick={handleRoute} id='changepassword'>
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
