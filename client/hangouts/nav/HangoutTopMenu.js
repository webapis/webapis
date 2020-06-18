import { h } from 'preact';
import { NavItem } from '../../nav/NavItem';
import { Message } from '../../layout/icons/Message';
import { Settings } from '../../layout/icons/Settıngs';
import { OnlineStatus } from '../../layout/icons/onlineStatus';
import { useHangouts } from '../state/useHangouts';
import { useUserName } from '../../auth/useUserName';
import { useAppRoute } from '../../app-route/AppRouteProvider';

export function HangoutTopMenu() {
  const { onAppRoute } = useAppRoute();
  const { userName } = useUserName();
  const { readyState, unreadhangouts, onNavigation, hangout } = useHangouts();

  function navToUnread() {
    onAppRoute({ featureRoute: '/UNREAD', route: '/hangouts' });
  }
  return (
    <div style={{ display: 'flex' }}>
      <NavItem>{userName}</NavItem>
      <NavItem>
        <OnlineStatus readyState={readyState} />
      </NavItem>
      <NavItem onClick={navToUnread} data-testid="nav-unreads">
        {unreadhangouts && <Message count={unreadhangouts.length} />}{' '}
      </NavItem>
      {hangout && (
        <NavItem id="configure" data-testid="nav-config">
          <Settings
            id="configure"
            fill="white"
            width="30"
            height="30"
            onClick={onNavigation}
          />
        </NavItem>
      )}
    </div>
  );
}
