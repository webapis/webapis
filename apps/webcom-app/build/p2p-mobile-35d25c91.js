import { u as useContactsContext, b as useRouteContext, a as useMediaQuery, p, h, U, B as Route, L } from './index-06a1a953.js';

function PeerToPeerMobileContext({
  children
}) {
  const [state, dispatch] = useContactsContext();
  const [route, setRoute] = useRouteContext();
  const {
    width
  } = useMediaQuery();
  const {
    contact
  } = state;
  p(() => {
    if (width < 800) {
      if (contact && contact.room) {
        debugger;
        setRoute('/p2p-chat');
      } else if (contact && !contact.room) {
        setRoute('/invitation');
      } else {
        setRoute('/contacts');
      }
    }
  }, [contact]);
  return children;
}

function PeerToPeerInvitationMobile({
  invitation
}) {
  return h("div", {
    "data-testid": "p2p-invitation-mobile"
  }, invitation && invitation.username, ", Invitation");
}

function Messaging() {
  return h("div", null, "Messaging");
}

const Contacts = L(() => import('./Contacts-e780115f.js'));
const PeerToPeerChat = L(() => import('./p2p-chat-mobile-a0d0431d.js'));
function PeerToPeerMobile() {
  const [state, dispatch] = useContactsContext();
  const [route, setRoute] = useRouteContext();
  const {
    contact
  } = state;
  const {
    width
  } = useMediaQuery();
  p(() => {
    if (width < 800) {
      setRoute('/contacts');
    }
  }, []);
  return h(PeerToPeerMobileContext, null, h(Route, {
    path: "/contacts"
  }, h(U, {
    fallback: h("div", null, "loading...")
  }, h(Contacts, null))), h(Route, {
    path: "/invitation"
  }, h(U, {
    fallback: h("div", null, "loading...")
  }, h(PeerToPeerInvitationMobile, {
    invitation: contact
  }))), h(Route, {
    path: "/messaging"
  }, h(U, {
    fallback: h("div", null, "loading...")
  }, h(Messaging, null))), h(Route, {
    path: "/p2p-chat"
  }, h(U, {
    fallback: h("div", null, "loading...")
  }, h(PeerToPeerChat, {
    chat: contact
  }))));
}

export default PeerToPeerMobile;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicDJwLW1vYmlsZS0zNWQyNWM5MS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY2xpZW50L3AycC9tb2JpbGUvcDJwLW1vYmlsZS1jb250ZXh0LmpzIiwiLi4vLi4vLi4vY2xpZW50L3AycC9tb2JpbGUvcDJwLWludml0YXRpb24tbW9iaWxlLmpzIiwiLi4vLi4vLi4vY2xpZW50L21lc3NhZ2luZy9NZXNzYWdpbmcuanMiLCIuLi8uLi8uLi9jbGllbnQvcDJwL21vYmlsZS9wMnAtbW9iaWxlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQge1xyXG4gIHVzZUNvbnRhY3RzQ29udGV4dFxyXG59IGZyb20gJy4uLy4uL2NvbnRhY3RzL2NvbnRhY3QtY29udGV4dCc7XHJcbmltcG9ydCB7IHVzZU1lZGlhUXVlcnkgfSBmcm9tICcuLi8uLi9sYXlvdXQvdXNlTWVkaWFRdWVyeSc7XHJcbmltcG9ydCB7IHVzZVJvdXRlQ29udGV4dCB9IGZyb20gJy4uLy4uL3JvdXRlL3JvdXRlcic7XHJcbmV4cG9ydCBmdW5jdGlvbiBQZWVyVG9QZWVyTW9iaWxlQ29udGV4dCh7IGNoaWxkcmVuIH0pIHtcclxuXHJcbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSB1c2VDb250YWN0c0NvbnRleHQoKTtcclxuICBjb25zdCBbcm91dGUsIHNldFJvdXRlXSA9IHVzZVJvdXRlQ29udGV4dCgpO1xyXG4gIGNvbnN0IHsgd2lkdGggfSA9IHVzZU1lZGlhUXVlcnkoKTtcclxuICBjb25zdCB7IGNvbnRhY3QgfSA9IHN0YXRlO1xyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAod2lkdGggPCA4MDApIHtcclxuICAgICAgaWYgKGNvbnRhY3QgJiYgY29udGFjdC5yb29tKSB7XHJcbiAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgc2V0Um91dGUoJy9wMnAtY2hhdCcpO1xyXG4gICAgICB9IGVsc2UgaWYgKGNvbnRhY3QgJiYgIWNvbnRhY3Qucm9vbSkge1xyXG4gICAgICAgIHNldFJvdXRlKCcvaW52aXRhdGlvbicpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHNldFJvdXRlKCcvY29udGFjdHMnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sIFtjb250YWN0XSk7XHJcblxyXG5cclxuXHJcbiAgcmV0dXJuIGNoaWxkcmVuO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIFBlZXJUb1BlZXJJbnZpdGF0aW9uTW9iaWxlKHsgaW52aXRhdGlvbiB9KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgZGF0YS10ZXN0aWQ9J3AycC1pbnZpdGF0aW9uLW1vYmlsZSc+XHJcbiAgICAgIHtpbnZpdGF0aW9uICYmIGludml0YXRpb24udXNlcm5hbWV9LCBJbnZpdGF0aW9uXHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTWVzc2FnaW5nKCkge1xyXG4gIHJldHVybiA8ZGl2Pk1lc3NhZ2luZzwvZGl2PjtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgU3VzcGVuc2UsIGxhenkgfSBmcm9tICdwcmVhY3QvY29tcGF0JztcclxuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgdXNlUm91dGVDb250ZXh0IH0gZnJvbSAnLi4vLi4vcm91dGUvcm91dGVyJztcclxuaW1wb3J0IHsgdXNlTWVkaWFRdWVyeSB9IGZyb20gJy4uLy4uL2xheW91dC91c2VNZWRpYVF1ZXJ5JztcclxuaW1wb3J0IHsgUm91dGUgfSBmcm9tICcuLi8uLi9yb3V0ZS9yb3V0ZXInO1xyXG5pbXBvcnQgeyBQZWVyVG9QZWVyTW9iaWxlQ29udGV4dCB9IGZyb20gJy4vcDJwLW1vYmlsZS1jb250ZXh0JztcclxuaW1wb3J0IHsgUGVlclRvUGVlckludml0YXRpb25Nb2JpbGUgfSBmcm9tICcuL3AycC1pbnZpdGF0aW9uLW1vYmlsZSc7XHJcbmltcG9ydCBNZXNzYWdpbmcgZnJvbSAnLi4vLi4vbWVzc2FnaW5nL01lc3NhZ2luZyc7XHJcbmltcG9ydCB7IHVzZUNvbnRhY3RzQ29udGV4dCB9IGZyb20gJy4uLy4uL2NvbnRhY3RzL2NvbnRhY3QtY29udGV4dCc7XHJcbmNvbnN0IENvbnRhY3RzID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4uLy4uL2NvbnRhY3RzL0NvbnRhY3RzJykpO1xyXG5jb25zdCBQZWVyVG9QZWVyQ2hhdCA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL3AycC1jaGF0LW1vYmlsZScpKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFBlZXJUb1BlZXJNb2JpbGUoKSB7XHJcbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSB1c2VDb250YWN0c0NvbnRleHQoKTtcclxuICBjb25zdCBbcm91dGUsIHNldFJvdXRlXSA9IHVzZVJvdXRlQ29udGV4dCgpO1xyXG4gIGNvbnN0IHsgY29udGFjdCB9ID0gc3RhdGU7XHJcbiAgY29uc3QgeyB3aWR0aCB9ID0gdXNlTWVkaWFRdWVyeSgpO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKHdpZHRoIDwgODAwKSB7XHJcbiAgICAgIHNldFJvdXRlKCcvY29udGFjdHMnKTtcclxuICAgIH1cclxuICB9LCBbXSk7XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8UGVlclRvUGVlck1vYmlsZUNvbnRleHQ+XHJcbiAgICAgIDxSb3V0ZSBwYXRoPScvY29udGFjdHMnPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxDb250YWN0cyAvPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgIDwvUm91dGU+XHJcblxyXG4gICAgICA8Um91dGUgcGF0aD0nL2ludml0YXRpb24nPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxQZWVyVG9QZWVySW52aXRhdGlvbk1vYmlsZSBpbnZpdGF0aW9uPXtjb250YWN0fSAvPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgIDwvUm91dGU+XHJcbiAgICAgIDxSb3V0ZSBwYXRoPScvbWVzc2FnaW5nJz5cclxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+bG9hZGluZy4uLjwvZGl2Pn0+XHJcbiAgICAgICAgICA8TWVzc2FnaW5nIC8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9Sb3V0ZT5cclxuICAgICAgPFJvdXRlIHBhdGg9Jy9wMnAtY2hhdCc+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PmxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPFBlZXJUb1BlZXJDaGF0IGNoYXQ9e2NvbnRhY3R9IC8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9Sb3V0ZT5cclxuICAgIDwvUGVlclRvUGVlck1vYmlsZUNvbnRleHQ+XHJcbiAgKTtcclxufVxyXG4iXSwibmFtZXMiOlsiUGVlclRvUGVlck1vYmlsZUNvbnRleHQiLCJjaGlsZHJlbiIsInN0YXRlIiwiZGlzcGF0Y2giLCJ1c2VDb250YWN0c0NvbnRleHQiLCJyb3V0ZSIsInNldFJvdXRlIiwidXNlUm91dGVDb250ZXh0Iiwid2lkdGgiLCJ1c2VNZWRpYVF1ZXJ5IiwiY29udGFjdCIsInVzZUVmZmVjdCIsInJvb20iLCJQZWVyVG9QZWVySW52aXRhdGlvbk1vYmlsZSIsImludml0YXRpb24iLCJ1c2VybmFtZSIsIk1lc3NhZ2luZyIsIkNvbnRhY3RzIiwibGF6eSIsIlBlZXJUb1BlZXJD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
