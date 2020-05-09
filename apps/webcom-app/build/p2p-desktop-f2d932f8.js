import { A as useP2PDesktopContext, h, I as InvitationDesktop } from './index-39e7257b.js';
import Contacts from './Contacts-de010e07.js';
import PeerToPeerChat from './p2p-chat-28459c9a.js';

function PeerToPeerDesktop() {
  const [state, dispatch] = useP2PDesktopContext();
  const {
    invitations,
    chats
  } = state;
  return h("div", {
    "data-testid": "p2p-desktop",
    style: {
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, h("div", {
    style: {
      flex: 1
    }
  }, h(Contacts, null)), h("div", {
    "data-testid": "chat-views",
    style: {
      flex: 3,
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }, chats.length > 0 && chats.map(chat => {
    debugger;
    return h(PeerToPeerChat, {
      chat: chat
    });
  })), h("div", {
    "data-testid": "invitation-views",
    style: {
      flex: 3,
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }, invitations.length > 0 && invitations.map(invitation => {
    debugger;
    return h(InvitationDesktop, {
      invitation: invitation
    });
  })));
}

export default PeerToPeerDesktop;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicDJwLWRlc2t0b3AtZjJkOTMyZjguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9wMnAvcDJwLWRlc2t0b3AuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCBDb250YWN0cyBmcm9tICcuLi9jb250YWN0cy9Db250YWN0cyc7XHJcbmltcG9ydCB7IEludml0YXRpb25EZXNrdG9wIH0gZnJvbSAnLi4vaW52aXRhdGlvbi9JbnZpdGF0aW9uJztcclxuaW1wb3J0IFBlZXJUb1BlZXJDaGF0IGZyb20gJy4vcDJwLWNoYXQnO1xyXG5pbXBvcnQge1xyXG4gIHVzZVAyUERlc2t0b3BDb250ZXh0LFxyXG4gIHJlbW92ZUNoYXQsXHJcbiAgcmVtb3ZlSW52aXRhdGlvbixcclxufSBmcm9tICcuL3AycC1kZXNrdG9wLWNvbnRleHQnO1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBQZWVyVG9QZWVyRGVza3RvcCgpIHtcclxuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IHVzZVAyUERlc2t0b3BDb250ZXh0KCk7XHJcbiAgY29uc3QgeyBpbnZpdGF0aW9ucywgY2hhdHMgfSA9IHN0YXRlO1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2XHJcbiAgICAgIGRhdGEtdGVzdGlkPSdwMnAtZGVza3RvcCdcclxuICAgICAgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nIH19XHJcbiAgICA+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3sgZmxleDogMSB9fT5cclxuICAgICAgICA8Q29udGFjdHMgLz5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxkaXZcclxuICAgICAgICBkYXRhLXRlc3RpZD0nY2hhdC12aWV3cydcclxuICAgICAgICBzdHlsZT17eyBmbGV4OiAzLCBkaXNwbGF5OiAnZmxleCcsIGp1c3RpZnlDb250ZW50OiAnZmxleC1lbmQnIH19XHJcbiAgICAgID5cclxuICAgICAgICB7Y2hhdHMubGVuZ3RoID4gMCAmJlxyXG4gICAgICAgICAgY2hhdHMubWFwKChjaGF0KSA9PiB7XHJcbiAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgICAgICByZXR1cm4gPFBlZXJUb1BlZXJDaGF0IGNoYXQ9e2NoYXR9IC8+O1xyXG4gICAgICAgICAgfSl9XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8ZGl2XHJcbiAgICAgICAgZGF0YS10ZXN0aWQ9J2ludml0YXRpb24tdmlld3MnXHJcbiAgICAgICAgc3R5bGU9e3sgZmxleDogMywgZGlzcGxheTogJ2ZsZXgnLCBqdXN0aWZ5Q29udGVudDogJ2ZsZXgtZW5kJyB9fVxyXG4gICAgICA+XHJcbiAgICAgICAge2ludml0YXRpb25zLmxlbmd0aCA+IDAgJiZcclxuICAgICAgICAgIGludml0YXRpb25zLm1hcCgoaW52aXRhdGlvbikgPT4ge1xyXG4gICAgICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICAgICAgcmV0dXJuIDxJbnZpdGF0aW9uRGVza3RvcCBpbnZpdGF0aW9uPXtpbnZpdGF0aW9ufSAvPjtcclxuICAgICAgICAgIH0pfVxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIl0sIm5hbWVzIjpbIlBlZXJUb1BlZXJEZXNrdG9wIiwic3RhdGUiLCJkaXNwYXRjaCIsInVzZVAyUERlc2t0b3BDb250ZXh0IiwiaW52aXRhdGlvbnMiLCJjaGF0cyIsImRpc3BsYXkiLCJqdXN0aWZ5Q29udGVudCIsImZsZXgiLCJsZW5ndGgiLCJtYXAiLCJjaGF0IiwiaW52aXRhdGlvbiJdLCJtYXBwaW5ncyI6Ijs7OztBQVNlLFNBQVNBLGlCQUFULEdBQTZCO0FBQzFDLFFBQU0sQ0FBQ0MsS0FBRCxFQUFRQyxRQUFSLElBQW9CQyxvQkFBb0IsRUFBOUM7QUFDQSxRQUFNO0FBQUVDLElBQUFBLFdBQUY7QUFBZUMsSUFBQUE7QUFBZixNQUF5QkosS0FBL0I7QUFDQSxTQUNFO0FBQ0UsbUJBQVksYUFEZDtBQUVFLElBQUEsS0FBSyxFQUFFO0FBQUVLLE1BQUFBLE9BQU8sRUFBRSxNQUFYO0FBQW1CQyxNQUFBQSxjQUFjLEVBQUU7QUFBbkM7QUFGVCxLQUlFO0FBQUssSUFBQSxLQUFLLEVBQUU7QUFBRUMsTUFBQUEsSUFBSSxFQUFFO0FBQVI7QUFBWixLQUNFLEVBQUMsUUFBRCxPQURGLENBSkYsRUFPRTtBQUNFLG1CQUFZLFlBRGQ7QUFFRSxJQUFBLEtBQUssRUFBRTtBQUFFQSxNQUFBQSxJQUFJLEVBQUUsQ0FBUjtBQUFXRixNQUFBQSxPQUFPLEVBQUUsTUFBcEI7QUFBNEJDLE1BQUFBLGNBQWMsRUFBRTtBQUE1QztBQUZULEtBSUdGLEtBQUssQ0FBQ0ksTUFBTixHQUFlLENBQWYsSUFDQ0osS0FBSyxDQUFDSyxHQUFOLENBQVdDLElBQUQsSUFBVTtBQUNsQjtBQUNBLFdBQU8sRUFBQyxjQUFEO0FBQWdCLE1BQUEsSUFBSSxFQUFFQTtBQUF0QixNQUFQO0FBQ0QsR0FIRCxDQUxKLENBUEYsRUFpQkU7QUFDRSxtQkFBWSxrQkFEZDtBQUVFLElBQUEsS0FBSyxFQUFFO0FBQUVILE1BQUFBLElBQUksRUFBRSxDQUFSO0FBQVdGLE1BQUFBLE9BQU8sRUFBRSxNQUFwQjtBQUE0QkMsTUFBQUEsY0FBYyxFQUFFO0FBQTVDO0FBRlQsS0FJR0gsV0FBVyxDQUFDSyxNQUFaLEdBQXFCLENBQXJCLElBQ0NMLFdBQVcsQ0FBQ00sR0FBWixDQUFpQkUsVUFBRCxJQUFnQjtBQUM5QjtBQUNBLFdBQU8sRUFBQyxpQkFBRDtBQUFtQixNQUFBLFVBQVUsRUFBRUE7QUFBL0IsTUFBUDtBQUNELEdBSEQsQ0FMSixDQWpCRixDQURGO0FBOEJEOzs7OyJ9
