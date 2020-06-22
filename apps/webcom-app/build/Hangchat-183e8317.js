import { h, z as y, p, y as resetHangout } from './index-3ebec559.js';
import { B as Button } from './Button-4860f592.js';
import { L as Layout } from './Layout-0b1e0357.js';
import { M as Message } from './Message-3109acaa.js';

const styles = {
  root: {
    display: 'flex',
    alignItems: 'center'
  },
  input: {
    //margin:0
    padding: 5,
    marginLeft: 8,
    marginRight: 8,
    marginTop: 8,
    marginBottom: 8,
    boxSizing: 'border-box',
    flex: 1
  },
  btn: {
    padding: 8,
    marginRight: 16,
    marginTop: 8,
    marginBottom: 8,
    boxSizing: 'border-box',
    flex: 1
  }
};
function MessageEditor({
  messageText,
  onMessageText,
  onMessage,
  hangout
}) {
  return h("div", {
    style: styles.root
  }, h("input", {
    style: styles.input,
    disabled: hangout && hangout.state === 'BLOCKED',
    type: "text",
    onChange: onMessageText,
    "data-testid": "message-input",
    value: messageText
  }), h("div", null, h(Button, {
    disabled: hangout && hangout.state === 'BLOCKED',
    style: styles.btn,
    title: "send",
    id: "MESSAGE",
    onClick: onMessage,
    "data-testid": "send-btn"
  })));
}

const style = {
  color: 'red',
  float: 'right',
  width: '100%',
  fontSize: 16,
  textAlign: 'end'
};
function BlockerMessage({
  message
}) {
  return h("div", {
    style: style,
    "data-testid": "blocker-message"
  }, message.text);
}

const style$1 = {
  color: 'red',
  float: 'right',
  width: '100%',
  fontSize: 16,
  textAlign: 'end'
};
function BlockedMessage({
  message,
  onNavigation
}) {
  function handleNavigation(e) {
    e.preventDefault();
    onNavigation(e);
  }

  debugger;
  return h("div", {
    style: style$1,
    "data-testid": "blocked-message"
  }, message.text, h("a", {
    id: "UNBLOCK",
    "data-testid": "seemore-btn",
    href: "/",
    onClick: handleNavigation
  }, "see more"));
}

const styles$1 = {
  messageContainer: {
    // width: '100%',
    boxSizing: 'border-box',
    padding: 3,
    //  backgroundColor: 'orange',
    flex: 15,
    overflowY: 'auto',
    overflowX: "hidden"
  }
};
function Messages({
  messages,
  onMessage,
  onMessageText,
  messageText,
  username,
  hangout,
  onNavigation
}) {
  const scrollerRef = y(null);
  p(() => {
    if (messages) {
      scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
    }
  }, [messages]);

  function onSend(e) {
    onMessage(e);
    scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
  }

  return h("div", {
    style: {
      boxSizing: 'border-box',
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      paddingTop: 75
    }
  }, h("div", {
    style: styles$1.messageContainer,
    ref: scrollerRef
  }, messages && messages.length > 0 && floatMessages({
    messages: sortMessages({
      messages
    }),
    username
  }).map(m => h("div", {
    style: {
      display: 'flex'
    }
  }, ' ', !m.type && h(Message, {
    message: m
  }), m.type && m.type === 'blocker' && h(BlockerMessage, {
    message: m
  }), m.type && m.type === 'blocked' && h(BlockedMessage, {
    message: m,
    onNavigation: onNavigation
  })))), h("div", {
    style: {
      flex: 1
    }
  }, h(MessageEditor, {
    hangout: hangout,
    onMessage: onSend,
    messageText: messageText,
    onMessageText: onMessageText
  })));
}

function floatMessages({
  messages,
  username
}) {
  if (messages && messages.length > 0 && username) {
    return messages.map(msg => {
      if (msg.username === username) {
        return { ...msg,
          float: 'right',
          username: 'me'
        };
      } else {
        return { ...msg,
          float: 'left'
        };
      }
    });
  } else {
    return null;
  }
}

function sortMessages({
  messages
}) {
  if (messages) {
    return messages.sort();
  } else {
    return null;
  }
}

function Hangchat({
  messages = [],
  onMessageText,
  onMessage,
  messageText,
  username,
  hangout,
  onNavigation,
  dispatch
}) {
  p(() => {
    return () => {
      debugger;
      console.log('hangout cleared');
      resetHangout({
        dispatch
      });
    };
  }, []);
  return h(Layout, {
    id: "hangchat-ui"
  }, h(Messages, {
    onNavigation: onNavigation,
    hangout: hangout,
    messages: messages,
    onMessage: onMessage,
    onMessageText: onMessageText,
    messageText: messageText,
    username: username
  }));
}

export default Hangchat;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGFuZ2NoYXQtMTgzZTgzMTcuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9tZXNzYWdlLXVpL01lc3NhZ2VFZGl0b3IuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvbWVzc2FnZS11aS9CbG9ja2VyTWVzc2FnZS5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9tZXNzYWdlLXVpL0Jsb2NrZWRNZXNzYWdlLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL21lc3NhZ2UtdWkvTWVzc2FnZXMuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUtdWkvSGFuZ2NoYXQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IFRleHRJbnB1dCB9IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvVGV4dElucHV0JztcclxuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy9CdXR0b24nO1xyXG5jb25zdCBzdHlsZXMgPSB7XHJcbiAgcm9vdDoge1xyXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgYWxpZ25JdGVtczogJ2NlbnRlcidcclxuICB9LFxyXG4gIGlucHV0OiB7XHJcbiAgICAvL21hcmdpbjowXHJcbiAgICBwYWRkaW5nOiA1LFxyXG4gICAgbWFyZ2luTGVmdDogOCxcclxuICAgIG1hcmdpblJpZ2h0OiA4LFxyXG4gICAgbWFyZ2luVG9wOiA4LFxyXG4gICAgbWFyZ2luQm90dG9tOiA4LFxyXG4gICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXHJcbiAgICBmbGV4OiAxLFxyXG4gICAgXHJcbiAgfSxcclxuICBidG46e1xyXG4gICAgcGFkZGluZzogOCxcclxuXHJcbiAgICBtYXJnaW5SaWdodDogMTYsXHJcbiAgICBtYXJnaW5Ub3A6IDgsXHJcbiAgICBtYXJnaW5Cb3R0b206IDgsXHJcbiAgICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcclxuICAgIGZsZXg6IDEsXHJcbiAgfVxyXG59O1xyXG5leHBvcnQgZnVuY3Rpb24gTWVzc2FnZUVkaXRvcih7IG1lc3NhZ2VUZXh0LCBvbk1lc3NhZ2VUZXh0LCBvbk1lc3NhZ2UsaGFuZ291dCB9KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3N0eWxlcy5yb290fT5cclxuICAgICBcclxuICAgICAgPGlucHV0IHN0eWxlPXtzdHlsZXMuaW5wdXR9IGRpc2FibGVkPXtoYW5nb3V0ICYmaGFuZ291dC5zdGF0ZT09PSdCTE9DS0VEJ30gIHR5cGU9XCJ0ZXh0XCIgb25DaGFuZ2U9e29uTWVzc2FnZVRleHR9ICBkYXRhLXRlc3RpZD1cIm1lc3NhZ2UtaW5wdXRcIiB2YWx1ZT17bWVzc2FnZVRleHR9Lz5cclxuICAgICAgXHJcbiAgICAgIDxkaXY+XHJcbiAgICAgICAgPEJ1dHRvbiBkaXNhYmxlZD17aGFuZ291dCAmJmhhbmdvdXQuc3RhdGU9PT0nQkxPQ0tFRCd9ICBzdHlsZT17c3R5bGVzLmJ0bn0gIHRpdGxlPVwic2VuZFwiIGlkPSdNRVNTQUdFJyBvbkNsaWNrPXtvbk1lc3NhZ2V9IGRhdGEtdGVzdGlkPSdzZW5kLWJ0bicvPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCdcclxuY29uc3Qgc3R5bGUgPSB7XHJcbiAgICBjb2xvcjogJ3JlZCcsXHJcbiAgICBmbG9hdDogJ3JpZ2h0JyxcclxuICAgIHdpZHRoOiAnMTAwJScsXHJcbiAgICBmb250U2l6ZTogMTYsXHJcbiAgICB0ZXh0QWxpZ246ICdlbmQnXHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIEJsb2NrZXJNZXNzYWdlKHsgbWVzc2FnZSB9KSB7XHJcbiAgICByZXR1cm4gPGRpdiBzdHlsZT17c3R5bGV9IGRhdGEtdGVzdGlkPVwiYmxvY2tlci1tZXNzYWdlXCI+e21lc3NhZ2UudGV4dH08L2Rpdj5cclxufSIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnXHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gICAgY29sb3I6ICdyZWQnLFxyXG4gICAgZmxvYXQ6ICdyaWdodCcsXHJcbiAgICB3aWR0aDogJzEwMCUnLFxyXG4gICAgZm9udFNpemU6IDE2LFxyXG4gICAgdGV4dEFsaWduOiAnZW5kJ1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBCbG9ja2VkTWVzc2FnZSh7IG1lc3NhZ2Usb25OYXZpZ2F0aW9uIH0pIHtcclxuICAgIGZ1bmN0aW9uIGhhbmRsZU5hdmlnYXRpb24oZSl7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgb25OYXZpZ2F0aW9uKGUpXHJcbiAgICB9XHJcbiAgICBkZWJ1Z2dlcjtcclxuICAgIHJldHVybiA8ZGl2IHN0eWxlPXtzdHlsZX0gZGF0YS10ZXN0aWQ9XCJibG9ja2VkLW1lc3NhZ2VcIj57bWVzc2FnZS50ZXh0fVxyXG4gICAgPGEgaWQ9XCJVTkJMT0NLXCIgZGF0YS10ZXN0aWQ9XCJzZWVtb3JlLWJ0blwiIGhyZWY9XCIvXCIgb25DbGljaz17aGFuZGxlTmF2aWdhdGlvbn0+c2VlIG1vcmU8L2E+XHJcbiAgICA8L2Rpdj5cclxufSIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VSZWYsIHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IE1lc3NhZ2UgfSBmcm9tICcuL01lc3NhZ2UnO1xyXG5pbXBvcnQgeyBNZXNzYWdlRWRpdG9yIH0gZnJvbSAnLi9NZXNzYWdlRWRpdG9yJztcclxuaW1wb3J0IHsgQmxvY2tlck1lc3NhZ2UgfSBmcm9tICcuL0Jsb2NrZXJNZXNzYWdlJ1xyXG5pbXBvcnQge0Jsb2NrZWRNZXNzYWdlfSBmcm9tICcuL0Jsb2NrZWRNZXNzYWdlJ1xyXG5jb25zdCBzdHlsZXMgPSB7XHJcbiAgbWVzc2FnZUNvbnRhaW5lcjoge1xyXG4gICAgLy8gd2lkdGg6ICcxMDAlJyxcclxuICAgIGJveFNpemluZzogJ2JvcmRlci1ib3gnLFxyXG4gICAgcGFkZGluZzogMyxcclxuICAvLyAgYmFja2dyb3VuZENvbG9yOiAnb3JhbmdlJyxcclxuICAgIGZsZXg6IDE1LFxyXG4gICAgb3ZlcmZsb3dZOiAnYXV0bycsXHJcbiAgICBvdmVyZmxvd1g6IFwiaGlkZGVuXCJcclxuXHJcbiAgfSxcclxufTtcclxuZXhwb3J0IGZ1bmN0aW9uIE1lc3NhZ2VzKHtcclxuICBtZXNzYWdlcyxcclxuICBvbk1lc3NhZ2UsXHJcbiAgb25NZXNzYWdlVGV4dCxcclxuICBtZXNzYWdlVGV4dCxcclxuICB1c2VybmFtZSxcclxuICBoYW5nb3V0LFxyXG4gIG9uTmF2aWdhdGlvblxyXG59KSB7XHJcbiAgY29uc3Qgc2Nyb2xsZXJSZWYgPSB1c2VSZWYobnVsbCk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAobWVzc2FnZXMpIHtcclxuICAgICAgc2Nyb2xsZXJSZWYuY3VycmVudC5zY3JvbGxUb3AgPSBzY3JvbGxlclJlZi5jdXJyZW50LnNjcm9sbEhlaWdodDtcclxuICAgIH1cclxuICB9LCBbbWVzc2FnZXNdKTtcclxuXHJcbiAgZnVuY3Rpb24gb25TZW5kKGUpIHtcclxuICAgIG9uTWVzc2FnZShlKTtcclxuICAgIHNjcm9sbGVyUmVmLmN1cnJlbnQuc2Nyb2xsVG9wID0gc2Nyb2xsZXJSZWYuY3VycmVudC5zY3JvbGxIZWlnaHQ7XHJcbiAgfVxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXt7IGJveFNpemluZzogJ2JvcmRlci1ib3gnLCB3aWR0aDogJzEwMCUnLCBoZWlnaHQ6ICcxMDAlJywgZGlzcGxheTogJ2ZsZXgnLCBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJywgcGFkZGluZ1RvcDogNzUgfX0+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlcy5tZXNzYWdlQ29udGFpbmVyfSByZWY9e3Njcm9sbGVyUmVmfT5cclxuICAgICAgICB7bWVzc2FnZXMgJiZcclxuICAgICAgICAgIG1lc3NhZ2VzLmxlbmd0aCA+IDAgJiZcclxuICAgICAgICAgIGZsb2F0TWVzc2FnZXMoeyBtZXNzYWdlczogc29ydE1lc3NhZ2VzKHsgbWVzc2FnZXMgfSksIHVzZXJuYW1lIH0pLm1hcChcclxuICAgICAgICAgICAgKG0pID0+IChcclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JyB9fT5cclxuICAgICAgICAgICAgICAgIHsnICd9XHJcbiAgICAgICAgICAgICAgICB7IW0udHlwZSAmJiA8TWVzc2FnZSBtZXNzYWdlPXttfSAvPn1cclxuICAgICAgICAgICAgICAgIHttLnR5cGUgJiYgbS50eXBlID09PSAnYmxvY2tlcicgJiYgPEJsb2NrZXJNZXNzYWdlIG1lc3NhZ2U9e219IC8+fVxyXG4gICAgICAgICAgICAgICAge20udHlwZSAmJiBtLnR5cGUgPT09ICdibG9ja2VkJyAmJiA8QmxvY2tlZE1lc3NhZ2UgbWVzc2FnZT17bX0gb25OYXZpZ2F0aW9uPXtvbk5hdmlnYXRpb259Lz59XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgICl9XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8ZGl2IHN0eWxlPXt7IGZsZXg6IDEgfX0+XHJcbiAgICAgICAgPE1lc3NhZ2VFZGl0b3JcclxuICAgICAgICAgIGhhbmdvdXQ9e2hhbmdvdXR9XHJcbiAgICAgICAgICBvbk1lc3NhZ2U9e29uU2VuZH1cclxuICAgICAgICAgIG1lc3NhZ2VUZXh0PXttZXNzYWdlVGV4dH1cclxuICAgICAgICAgIG9uTWVzc2FnZVRleHQ9e29uTWVzc2FnZVRleHR9XHJcbiAgICAgICAgLz5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG5mdW5jdGlvbiBmbG9hdE1lc3NhZ2VzKHsgbWVzc2FnZXMsIHVzZXJuYW1lIH0pIHtcclxuICBpZiAobWVzc2FnZXMgJiYgbWVzc2FnZXMubGVuZ3RoID4gMCAmJiB1c2VybmFtZSkge1xyXG4gICAgcmV0dXJuIG1lc3NhZ2VzLm1hcCgobXNnKSA9PiB7XHJcbiAgICAgIGlmIChtc2cudXNlcm5hbWUgPT09IHVzZXJuYW1lKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgLi4ubXNnLCBmbG9hdDogJ3JpZ2h0JywgdXNlcm5hbWU6ICdtZScgfTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4geyAuLi5tc2csIGZsb2F0OiAnbGVmdCcgfTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxufVxyXG5mdW5jdGlvbiBzb3J0TWVzc2FnZXMoeyBtZXNzYWdlcyB9KSB7XHJcbiAgaWYgKG1lc3NhZ2VzKSB7XHJcbiAgICByZXR1cm4gbWVzc2FnZXMuc29ydCgpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7dXNlRWZmZWN0fSBmcm9tICdwcmVhY3QvaG9va3MnXHJcbmltcG9ydCB7IE1lc3NhZ2VzIH0gZnJvbSAnLi4vbWVzc2FnZS11aS9NZXNzYWdlcyc7XHJcbmltcG9ydCB7IExheW91dCB9IGZyb20gJy4vTGF5b3V0JztcclxuaW1wb3J0IHtyZXNldEhhbmdvdXR9IGZyb20gJy4uL3N0YXRlL2FjdGlvbnMnXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSGFuZ2NoYXQoe1xyXG4gIG1lc3NhZ2VzID0gW10sXHJcbiAgb25NZXNzYWdlVGV4dCxcclxuICBvbk1lc3NhZ2UsXHJcbiAgbWVzc2FnZVRleHQsXHJcbiAgdXNlcm5hbWUsXHJcbiAgaGFuZ291dCxcclxuICBvbk5hdmlnYXRpb24sXHJcbiAgZGlzcGF0Y2hcclxufSkge1xyXG5cclxuICB1c2VFZmZlY3QoKCk9PntcclxuICAgIHJldHVybiAoKT0+e1xyXG4gICAgICBkZWJ1Z2dlcjtcclxuICAgICAgY29uc29sZS5sb2coJ2hhbmdvdXQgY2xlYXJlZCcpXHJcbiAgICAgIHJlc2V0SGFuZ291dCh7ZGlzcGF0Y2h9KVxyXG4gICAgfVxyXG4gIH0sW10pXHJcbiAgcmV0dXJuIChcclxuICAgIDxMYXlvdXQgaWQ9XCJoYW5nY2hhdC11aVwiID5cclxuICAgICAgPE1lc3NhZ2VzXHJcbiAgICAgIG9uTmF2aWdhdGlvbj17b25OYXZpZ2F0aW9ufVxyXG4gICAgICAgIGhhbmdvdXQ9e2hhbmdvdXR9XHJcbiAgICAgICAgbWVzc2FnZXM9e21lc3NhZ2VzfVxyXG4gICAgICAgIG9uTWVzc2FnZT17b25NZXNzYWdlfVxyXG4gICAgICAgIG9uTWVzc2FnZVRleHQ9e29uTWVzc2FnZVRleHR9XHJcbiAgICAgICAgbWVzc2FnZVRleHQgPXttZXNzYWdlVGV4dH1cclxuICAgICAgICB1c2VybmFtZT17dXNlcm5hbWV9XHJcbiAgICAgIC8+XHJcbiAgICA8L0xheW91dD5cclxuICApO1xyXG59XHJcbiJdLCJuYW1lcyI6WyJzdHlsZXMiLCJyb290IiwiZGlzcGxheSIsImFsaWduSXRlbXMiLCJpbnB1dCIsInBhZGRpbmciLCJtYXJnaW5MZWZ0IiwibWFyZ2luUmlnaHQiLCJtYXJnaW5Ub3AiLCJtYXJnaW5Cb3R0b20iLCJib3hTaXppbmciLCJmbGV4IiwiYnRuIiwiTWVzc2FnZUVkaXRvciIsIm1lc3NhZ2VUZXh0Iiwib25NZXNzYWdlVGV4dCIsIm9uTWVzc2FnZSIsImhhbmdvdXQiLCJzdGF0ZSIsInN0eWxlIiwiY29sb3IiLCJmbG9hdCIsIndpZHRoIiwiZm9udFNpemUiLCJ0ZXh0QWxpZ24iLCJCbG9ja2VyTWVzc2FnZSIsIm1lc3NhZ2UiLCJ0ZXh0IiwiQmxvY2tlZE1lc3NhZ2UiLCJvbk5hdmlnYXRpb24iLCJoYW5kbGVOYXZpZ2F0aW9uIiwiZSIsInByZXZlbnREZWZhdWx0IiwibWVzc2FnZUNvbnRhaW5lciIsIm92ZXJmbG93WSIsIm92ZXJmbG93WCIsIk1lc3NhZ2VzIiwibWVzc2FnZXMiLCJ1c2VybmFtZSIsInNjcm9sbGVyUmVmIiwidXNlUmVmIiwidXNlRWZmZWN0IiwiY3VycmVudCIsInNjcm9sbFRvcCIsInNjcm9sbEhlaWdodCIsIm9uU2VuZCIsImhlaWdodCIsImZsZXhEaXJlY3Rpb24iLCJwYWRkaW5nVG9wIiwibGVuZ3RoIiwiZmxvYXRNZXNzYWdlcyIsInNvcnRNZXNzYWdlcyIsIm1hcCIsIm0iLCJ0eXBlIiwibXNnIiwic29ydCIsIkhhbmdjaGF0IiwiZGlzcGF0Y2giLCJjb25zb2xlIiwibG9nIiwicmVzZXRIYW5nb3V0Il0sIm1hcHBpbmdzIjoiOzs7OztBQUdBLE1BQU1BLE1BQU0sR0FBRztBQUNiQyxFQUFBQSxJQUFJLEVBQUU7QUFDSkMsSUFBQUEsT0FBTyxFQUFFLE1BREw7QUFFSkMsSUFBQUEsVUFBVSxFQUFFO0FBRlIsR0FETztBQUtiQyxFQUFBQSxLQUFLLEVBQUU7QUFDTDtBQUNBQyxJQUFBQSxPQUFPLEVBQUUsQ0FGSjtBQUdMQyxJQUFBQSxVQUFVLEVBQUUsQ0FIUDtBQUlMQyxJQUFBQSxXQUFXLEVBQUUsQ0FKUjtBQUtMQyxJQUFBQSxTQUFTLEVBQUUsQ0FMTjtBQU1MQyxJQUFBQSxZQUFZLEVBQUUsQ0FOVDtBQU9MQyxJQUFBQSxTQUFTLEVBQUUsWUFQTjtBQVFMQyxJQUFBQSxJQUFJLEVBQUU7QUFSRCxHQUxNO0FBZ0JiQyxFQUFBQSxHQUFHLEVBQUM7QUFDRlAsSUFBQUEsT0FBTyxFQUFFLENBRFA7QUFHRkUsSUFBQUEsV0FBVyxFQUFFLEVBSFg7QUFJRkMsSUFBQUEsU0FBUyxFQUFFLENBSlQ7QUFLRkMsSUFBQUEsWUFBWSxFQUFFLENBTFo7QUFNRkMsSUFBQUEsU0FBUyxFQUFFLFlBTlQ7QUFPRkMsSUFBQUEsSUFBSSxFQUFFO0FBUEo7QUFoQlMsQ0FBZjtBQTBCTyxTQUFTRSxhQUFULENBQXVCO0FBQUVDLEVBQUFBLFdBQUY7QUFBZUMsRUFBQUEsYUFBZjtBQUE4QkMsRUFBQUEsU0FBOUI7QUFBd0NDLEVBQUFBO0FBQXhDLENBQXZCLEVBQTBFO0FBQy9FLFNB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
