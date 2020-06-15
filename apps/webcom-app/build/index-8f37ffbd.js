import { u as useHangouts, h, F as FeatureRoute, U, L } from './index-6bf9bf3c.js';

const Hangouts = L(() => import('./Hangout-bc8fe9ce.js'));
const Block = L(() => import('./Block-691a3923.js'));
const Blocked = L(() => import('./Blocked-b0d58abd.js'));
const Configure = L(() => import('./Configure-dc73f91a.js'));
const Hangchat = L(() => import('./Hangchat-d2526ce9.js'));
const Invite = L(() => import('./Invite-918d0b04.js'));
const Invitee = L(() => import('./Invitee-42536b79.js'));
const Inviter = L(() => import('./Inviter-2466b647.js'));
const UnreadHangouts = L(() => import('./UnreadHangouts-b28f7b9b.js'));
function Mobile() {
  const {
    hangout,
    hangouts,
    onHangout,
    onSelectHangout,
    onSelectUser,
    onSearch,
    users,
    search,
    onStartSearch,
    onMessageText,
    messageText,
    username,
    messages,
    dispatch,
    unreadhangouts,
    onSelectUnread
  } = useHangouts();
  return h("div", {
    style: {
      height: '100%',
      width: '100%'
    }
  }, h(FeatureRoute, {
    path: "/hangouts"
  }, h(U, {
    fallback: h("div", null, "Loading...")
  }, h(Hangouts, {
    dispatch: dispatch,
    username: username,
    search: search,
    hangouts: hangouts,
    onSelectHangout: onSelectHangout,
    onSelectUser: onSelectUser,
    onSearch: onSearch,
    onStartSearch: onStartSearch
  }))), h(FeatureRoute, {
    path: "/BLOCK"
  }, h(U, {
    fallback: h("div", null, "Loading...")
  }, h(Block, {
    hangout: hangout,
    onBlock: onHangout
  }))), h(FeatureRoute, {
    path: "/BLOCKED"
  }, h(U, {
    fallback: h("div", null, "Loading...")
  }, h(Blocked, {
    hangout: hangout,
    onUnblock: onHangout
  }))), h(FeatureRoute, {
    path: "/configure"
  }, h(U, {
    fallback: h("div", null, "Loading...")
  }, h(Configure, {
    hangout: hangout
  }))), h(FeatureRoute, {
    paths: ["/ACCEPTED", "/ACCEPTER", "/MESSANGER", "/MESSAGED"]
  }, h(U, {
    fallback: h("div", null, "Loading...")
  }, h(Hangchat, {
    onMessageText: onMessageText,
    onMessage: onHangout,
    messages: messages,
    username: username
  }))), h(FeatureRoute, {
    path: "/INVITE"
  }, h(U, {
    fallback: h("div", null, "Loading...")
  }, h(Invite, {
    hangout: hangout,
    onInvite: onHangout,
    onMessageText: onMessageText,
    messageText: messageText
  }))), h(FeatureRoute, {
    path: "/INVITED"
  }, h(U, {
    fallback: h("div", null, "Loading...")
  }, h(Invitee, {
    hangout: hangout
  }))), h(FeatureRoute, {
    path: "/INVITER"
  }, h(U, {
    fallback: h("div", null, "Loading...")
  }, h(Inviter, {
    hangout: hangout,
    onAccept: onHangout
  }))), h(FeatureRoute, {
    path: "/UNREAD"
  }, h(U, {
    fallback: h("div", null, "Loading...")
  }, h(UnreadHangouts, {
    unreadhangouts: unreadhangouts,
    onSelectUnread: onSelectUnread
  }))));
}

function index () {
  return h(Mobile, null);
}

export default index;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtOGYzN2ZmYmQuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9tb2JpbGUuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IGxhenksIFN1c3BlbnNlIH0gZnJvbSAncHJlYWN0L2NvbXBhdCc7XHJcbmltcG9ydCB7IEZlYXR1cmVSb3V0ZSB9IGZyb20gJy4uL2FwcC1yb3V0ZS9BcHBSb3V0ZVByb3ZpZGVyJztcclxuXHJcbmltcG9ydCB7IHVzZUhhbmdvdXRzIH0gZnJvbSAnLi9zdGF0ZS91c2VIYW5nb3V0cyc7XHJcbmNvbnN0IEhhbmdvdXRzID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vSGFuZ291dCcpKTtcclxuY29uc3QgQmxvY2sgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9zdGF0ZS11aS9CbG9jaycpKTtcclxuY29uc3QgQmxvY2tlZCA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL3N0YXRlLXVpL0Jsb2NrZWQnKSk7XHJcbmNvbnN0IENvbmZpZ3VyZSA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL3N0YXRlLXVpL0NvbmZpZ3VyZScpKTtcclxuY29uc3QgSGFuZ2NoYXQgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9zdGF0ZS11aS9IYW5nY2hhdCcpKTtcclxuY29uc3QgSW52aXRlID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vc3RhdGUtdWkvSW52aXRlJykpO1xyXG5jb25zdCBJbnZpdGVlID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vc3RhdGUtdWkvSW52aXRlZScpKTtcclxuY29uc3QgSW52aXRlciA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL3N0YXRlLXVpL0ludml0ZXInKSk7XHJcbmNvbnN0IFVucmVhZEhhbmdvdXRzID1sYXp5KCgpID0+IGltcG9ydCgnLi9VbnJlYWRIYW5nb3V0cycpKTtcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTW9iaWxlKCkge1xyXG4gIGNvbnN0IHtcclxuICAgIGhhbmdvdXQsXHJcbiAgICBoYW5nb3V0cyxcclxuICAgIG9uSGFuZ291dCxcclxuICAgIG9uU2VsZWN0SGFuZ291dCxcclxuICAgIG9uU2VsZWN0VXNlcixcclxuICAgIG9uU2VhcmNoLFxyXG4gICAgdXNlcnMsXHJcbiAgICBzZWFyY2gsXHJcbiAgICBvblN0YXJ0U2VhcmNoLFxyXG4gICAgb25NZXNzYWdlVGV4dCxcclxuICAgIG1lc3NhZ2VUZXh0LFxyXG4gICAgdXNlcm5hbWUsXHJcbiAgICBtZXNzYWdlcyxcclxuICAgIGRpc3BhdGNoLFxyXG4gICAgdW5yZWFkaGFuZ291dHMsXHJcbiAgICBvblNlbGVjdFVucmVhZFxyXG4gIH0gPSB1c2VIYW5nb3V0cygpO1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17eyBoZWlnaHQ6ICcxMDAlJyx3aWR0aDonMTAwJScgfX0+XHJcbiAgICAgIDxGZWF0dXJlUm91dGUgcGF0aD1cIi9oYW5nb3V0c1wiPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxIYW5nb3V0c1xyXG4gICAgICAgICAgZGlzcGF0Y2g9e2Rpc3BhdGNofVxyXG4gICAgICAgICAgICB1c2VybmFtZT17dXNlcm5hbWV9XHJcbiAgICAgICAgICAgIHNlYXJjaD17c2VhcmNofVxyXG4gICAgICAgICAgICBoYW5nb3V0cz17aGFuZ291dHN9XHJcbiAgICAgICAgICAgIG9uU2VsZWN0SGFuZ291dD17b25TZWxlY3RIYW5nb3V0fVxyXG4gICAgICAgICAgICBvblNlbGVjdFVzZXI9e29uU2VsZWN0VXNlcn1cclxuICAgICAgICAgICAgb25TZWFyY2g9e29uU2VhcmNofVxyXG4gICAgICAgICAgICBvblN0YXJ0U2VhcmNoPXtvblN0YXJ0U2VhcmNofVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L0ZlYXR1cmVSb3V0ZT5cclxuICAgICAgPEZlYXR1cmVSb3V0ZSBwYXRoPVwiL0JMT0NLXCI+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPEJsb2NrIGhhbmdvdXQ9e2hhbmdvdXR9IG9uQmxvY2s9e29uSGFuZ291dH0gLz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L0ZlYXR1cmVSb3V0ZT5cclxuICAgICAgPEZlYXR1cmVSb3V0ZSBwYXRoPVwiL0JMT0NLRURcIj5cclxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+TG9hZGluZy4uLjwvZGl2Pn0+XHJcbiAgICAgICAgICA8QmxvY2tlZCBoYW5nb3V0PXtoYW5nb3V0fSBvblVuYmxvY2s9e29uSGFuZ291dH0gLz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L0ZlYXR1cmVSb3V0ZT5cclxuICAgICAgPEZlYXR1cmVSb3V0ZSBwYXRoPVwiL2NvbmZpZ3VyZVwiPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxDb25maWd1cmUgaGFuZ291dD17aGFuZ291dH0gLz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L0ZlYXR1cmVSb3V0ZT5cclxuICAgICAgPEZlYXR1cmVSb3V0ZSBwYXRocz17W1wiL0FDQ0VQVEVEXCIsXCIvQUNDRVBURVJcIixcIi9NRVNTQU5HRVJcIixcIi9NRVNTQUdFRFwiXX0+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPEhhbmdjaGF0XHJcbiAgICAgICAgICAgIG9uTWVzc2FnZVRleHQ9e29uTWVzc2FnZVRleHR9XHJcbiAgICAgICAgICAgIG9uTWVzc2FnZT17b25IYW5nb3V0fVxyXG4gICAgICAgICAgICBtZXNzYWdlcz17bWVzc2FnZXN9XHJcbiAgICAgICAgICAgIHVzZXJuYW1lPXt1c2VybmFtZX1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9GZWF0dXJlUm91dGU+XHJcbiAgICBcclxuICAgICAgPEZlYXR1cmVSb3V0ZSBwYXRoPVwiL0lOVklURVwiPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxJbnZpdGVcclxuICAgICAgICAgICAgaGFuZ291dD17aGFuZ291dH1cclxuICAgICAgICAgICAgb25JbnZpdGU9e29uSGFuZ291dH1cclxuICAgICAgICAgICAgb25NZXNzYWdlVGV4dD17b25NZXNzYWdlVGV4dH1cclxuICAgICAgICAgICAgbWVzc2FnZVRleHQ9e21lc3NhZ2VUZXh0fVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L0ZlYXR1cmVSb3V0ZT5cclxuICAgICAgPEZlYXR1cmVSb3V0ZSBwYXRoPVwiL0lOVklURURcIj5cclxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+TG9hZGluZy4uLjwvZGl2Pn0+XHJcbiAgICAgICAgICA8SW52aXRlZSBoYW5nb3V0PXtoYW5nb3V0fSAvPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgIDwvRmVhdHVyZVJvdXRlPlxyXG4gICAgICA8RmVhdHVyZVJvdXRlIHBhdGg9XCIvSU5WSVRFUlwiPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxJbnZpdGVyIGhhbmdvdXQ9e2hhbmdvdXR9IG9uQWNjZXB0PXtvbkhhbmdvdXR9IC8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9GZWF0dXJlUm91dGU+XHJcbiAgICAgIDxGZWF0dXJlUm91dGUgcGF0aD1cIi9VTlJFQURcIj5cclxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+TG9hZGluZy4uLjwvZGl2Pn0+XHJcbiAgICAgICAgICA8VW5yZWFkSGFuZ291dHMgdW5yZWFkaGFuZ291dHM9e3VucmVhZGhhbmdvdXRzfSBvblNlbGVjdFVucmVhZD17b25TZWxlY3RVbnJlYWR9IC8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9GZWF0dXJlUm91dGU+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgTW9iaWxlIGZyb20gJy4vbW9iaWxlJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gPE1vYmlsZSAvPjtcclxufVxyXG4iXSwibmFtZXMiOlsiSGFuZ291dHMiLCJsYXp5IiwiQmxvY2siLCJCbG9ja2VkIiwiQ29uZmlndXJlIiwiSGFuZ2NoYXQiLCJJbnZpdGUiLCJJbnZpdGVlIiwiSW52aXRlciIsIlVucmVhZEhhbmdvdXRzIiwiTW9iaWxlIiwiaGFuZ291dCIsImhhbmdvdXRzIiwib25IYW5nb3V0Iiwib25TZWxlY3RIYW5nb3V0Iiwib25TZWxlY3RVc2VyIiwib25TZWFyY2giLCJ1c2VycyIsInNlYXJjaCIsIm9uU3RhcnRTZWFyY2giLCJvbk1lc3NhZ2VUZXh0IiwibWVzc2FnZVRleHQiLCJ1c2VybmFtZSIsIm1lc3NhZ2VzIiwiZGlzcGF0Y2giLCJ1bnJlYWRoYW5nb3V0cyIsIm9uU2VsZWN0VW5yZWFkIiwidXNlSGFuZ291dHMiLCJoZWlnaHQiLCJ3aWR0aCIsIlN1c3BlbnNlIl0sIm1hcHBpbmdzIjoiOztBQU1BLE1BQU1BLFFBQVEsR0FBR0MsQ0FBSSxDQUFDLE1BQU0sT0FBTyx1QkFBUCxDQUFQLENBQXJCO0FBQ0EsTUFBTUMsS0FBSyxHQUFHRCxDQUFJLENBQUMsTUFBTSxPQUFP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
