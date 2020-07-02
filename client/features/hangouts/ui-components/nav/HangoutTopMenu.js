import { h } from 'preact';
import { NavItem } from 'controls/navigation/NavItem';
import { Message } from 'icons/Message';
import { Settings } from 'icons/Settings';
import { OnlineStatus } from 'icons/onlineStatus';
import { useHangouts } from '../../state/useHangouts';
import { useUserName } from 'features/authentication/state/useUserName';
import { useAppRoute } from 'components/app-route';

export function HangoutTopMenu() {
  const { onAppRoute } = useAppRoute();
  const { username } = useUserName();
  const { readyState, unreadhangouts, onNavigation, hangout } = useHangouts();

  function navToUnread() {
    onAppRoute({ featureRoute: '/UNREAD', route: '/hangouts' });
  }
  return (
    <div style={{ display: 'flex' }}>
      <NavItem>{username}</NavItem>
      <NavItem>
        <OnlineStatus readyState={readyState} />
      </NavItem>
      <NavItem onClick={navToUnread} data-testid="nav-unreads">
        {unreadhangouts && <Message count={unreadhangouts.filter(f=>f.read===false).length} />}{' '}
      </NavItem>
      {hangout && (
        <NavItem    onClick={onNavigation} data-testid="nav-config" id="configure" >
          <Settings
            fill="white"
            width="30"
            height="30"
         
          />
        </NavItem>
      )}
    </div>
  );
}
//
