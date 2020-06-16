import { h, y, p } from './index-dbbfe189.js';
import { B as Button } from './Button-9442c082.js';
import { L as Layout } from './Layout-7851d1a2.js';
import { M as Message } from './Message-65307b09.js';

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
  message
}) {
  return h("div", {
    style: style$1,
    "data-testid": "blocked-message"
  }, message.text);
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
  hangout
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
      paddingTop: 68
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
    message: m
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
  hangout
}) {
  return h(Layout, {
    id: "hangchat-ui"
  }, h(Messages, {
    hangout: hangout,
    messages: messages,
    onMessage: onMessage,
    onMessageText: onMessageText,
    messageText: messageText,
    username: username
  }));
}

export default Hangchat;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGFuZ2NoYXQtZTdhYWMxYTcuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9tZXNzYWdlLXVpL01lc3NhZ2VFZGl0b3IuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvbWVzc2FnZS11aS9CbG9ja2VyTWVzc2FnZS5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9tZXNzYWdlLXVpL0Jsb2NrZWRNZXNzYWdlLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL21lc3NhZ2UtdWkvTWVzc2FnZXMuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUtdWkvSGFuZ2NoYXQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IFRleHRJbnB1dCB9IGZyb20gJy4uLy4uL2xheW91dC9UZXh0SW5wdXQnO1xyXG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tICcuLi8uLi9sYXlvdXQvQnV0dG9uJztcclxuY29uc3Qgc3R5bGVzID0ge1xyXG4gIHJvb3Q6IHtcclxuICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxyXG4gIH0sXHJcbiAgaW5wdXQ6IHtcclxuICAgIC8vbWFyZ2luOjBcclxuICAgIHBhZGRpbmc6IDUsXHJcbiAgICBtYXJnaW5MZWZ0OiA4LFxyXG4gICAgbWFyZ2luUmlnaHQ6IDgsXHJcbiAgICBtYXJnaW5Ub3A6IDgsXHJcbiAgICBtYXJnaW5Cb3R0b206IDgsXHJcbiAgICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcclxuICAgIGZsZXg6IDEsXHJcbiAgICBcclxuICB9LFxyXG4gIGJ0bjp7XHJcbiAgICBwYWRkaW5nOiA4LFxyXG5cclxuICAgIG1hcmdpblJpZ2h0OiAxNixcclxuICAgIG1hcmdpblRvcDogOCxcclxuICAgIG1hcmdpbkJvdHRvbTogOCxcclxuICAgIGJveFNpemluZzogJ2JvcmRlci1ib3gnLFxyXG4gICAgZmxleDogMSxcclxuICB9XHJcbn07XHJcbmV4cG9ydCBmdW5jdGlvbiBNZXNzYWdlRWRpdG9yKHsgbWVzc2FnZVRleHQsIG9uTWVzc2FnZVRleHQsIG9uTWVzc2FnZSxoYW5nb3V0IH0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17c3R5bGVzLnJvb3R9PlxyXG4gICAgIFxyXG4gICAgICA8aW5wdXQgc3R5bGU9e3N0eWxlcy5pbnB1dH0gZGlzYWJsZWQ9e2hhbmdvdXQgJiZoYW5nb3V0LnN0YXRlPT09J0JMT0NLRUQnfSAgdHlwZT1cInRleHRcIiBvbkNoYW5nZT17b25NZXNzYWdlVGV4dH0gIGRhdGEtdGVzdGlkPVwibWVzc2FnZS1pbnB1dFwiIHZhbHVlPXttZXNzYWdlVGV4dH0vPlxyXG4gICAgICBcclxuICAgICAgPGRpdj5cclxuICAgICAgICA8QnV0dG9uIGRpc2FibGVkPXtoYW5nb3V0ICYmaGFuZ291dC5zdGF0ZT09PSdCTE9DS0VEJ30gIHN0eWxlPXtzdHlsZXMuYnRufSAgdGl0bGU9XCJzZW5kXCIgaWQ9J01FU1NBR0UnIG9uQ2xpY2s9e29uTWVzc2FnZX0gZGF0YS10ZXN0aWQ9J3NlbmQtYnRuJy8+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0J1xyXG5jb25zdCBzdHlsZSA9IHtcclxuICAgIGNvbG9yOiAncmVkJyxcclxuICAgIGZsb2F0OiAncmlnaHQnLFxyXG4gICAgd2lkdGg6ICcxMDAlJyxcclxuICAgIGZvbnRTaXplOiAxNixcclxuICAgIHRleHRBbGlnbjogJ2VuZCdcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gQmxvY2tlck1lc3NhZ2UoeyBtZXNzYWdlIH0pIHtcclxuICAgIHJldHVybiA8ZGl2IHN0eWxlPXtzdHlsZX0gZGF0YS10ZXN0aWQ9XCJibG9ja2VyLW1lc3NhZ2VcIj57bWVzc2FnZS50ZXh0fTwvZGl2PlxyXG59IiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCdcclxuY29uc3Qgc3R5bGUgPSB7XHJcbiAgICBjb2xvcjogJ3JlZCcsXHJcbiAgICBmbG9hdDogJ3JpZ2h0JyxcclxuICAgIHdpZHRoOiAnMTAwJScsXHJcbiAgICBmb250U2l6ZTogMTYsXHJcbiAgICB0ZXh0QWxpZ246ICdlbmQnXHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIEJsb2NrZWRNZXNzYWdlKHsgbWVzc2FnZSB9KSB7XHJcbiAgICByZXR1cm4gPGRpdiBzdHlsZT17c3R5bGV9IGRhdGEtdGVzdGlkPVwiYmxvY2tlZC1tZXNzYWdlXCI+e21lc3NhZ2UudGV4dH08L2Rpdj5cclxufSIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VSZWYsIHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IE1lc3NhZ2UgfSBmcm9tICcuL01lc3NhZ2UnO1xyXG5pbXBvcnQgeyBNZXNzYWdlRWRpdG9yIH0gZnJvbSAnLi9NZXNzYWdlRWRpdG9yJztcclxuaW1wb3J0IHsgQmxvY2tlck1lc3NhZ2UgfSBmcm9tICcuL0Jsb2NrZXJNZXNzYWdlJ1xyXG5pbXBvcnQge0Jsb2NrZWRNZXNzYWdlfSBmcm9tICcuL0Jsb2NrZWRNZXNzYWdlJ1xyXG5jb25zdCBzdHlsZXMgPSB7XHJcbiAgbWVzc2FnZUNvbnRhaW5lcjoge1xyXG4gICAgLy8gd2lkdGg6ICcxMDAlJyxcclxuICAgIGJveFNpemluZzogJ2JvcmRlci1ib3gnLFxyXG4gICAgcGFkZGluZzogMyxcclxuICAvLyAgYmFja2dyb3VuZENvbG9yOiAnb3JhbmdlJyxcclxuICAgIGZsZXg6IDE1LFxyXG4gICAgb3ZlcmZsb3dZOiAnYXV0bycsXHJcbiAgICBvdmVyZmxvd1g6IFwiaGlkZGVuXCJcclxuXHJcbiAgfSxcclxufTtcclxuZXhwb3J0IGZ1bmN0aW9uIE1lc3NhZ2VzKHtcclxuICBtZXNzYWdlcyxcclxuICBvbk1lc3NhZ2UsXHJcbiAgb25NZXNzYWdlVGV4dCxcclxuICBtZXNzYWdlVGV4dCxcclxuICB1c2VybmFtZSxcclxuICBoYW5nb3V0XHJcbn0pIHtcclxuICBjb25zdCBzY3JvbGxlclJlZiA9IHVzZVJlZihudWxsKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmIChtZXNzYWdlcykge1xyXG4gICAgICBzY3JvbGxlclJlZi5jdXJyZW50LnNjcm9sbFRvcCA9IHNjcm9sbGVyUmVmLmN1cnJlbnQuc2Nyb2xsSGVpZ2h0O1xyXG4gICAgfVxyXG4gIH0sIFttZXNzYWdlc10pO1xyXG5cclxuICBmdW5jdGlvbiBvblNlbmQoZSkge1xyXG4gICAgb25NZXNzYWdlKGUpO1xyXG4gICAgc2Nyb2xsZXJSZWYuY3VycmVudC5zY3JvbGxUb3AgPSBzY3JvbGxlclJlZi5jdXJyZW50LnNjcm9sbEhlaWdodDtcclxuICB9XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3sgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsIHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnLCBkaXNwbGF5OiAnZmxleCcsIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLCBwYWRkaW5nVG9wOiA2OCB9fT5cclxuICAgICAgPGRpdiBzdHlsZT17c3R5bGVzLm1lc3NhZ2VDb250YWluZXJ9IHJlZj17c2Nyb2xsZXJSZWZ9PlxyXG4gICAgICAgIHttZXNzYWdlcyAmJlxyXG4gICAgICAgICAgbWVzc2FnZXMubGVuZ3RoID4gMCAmJlxyXG4gICAgICAgICAgZmxvYXRNZXNzYWdlcyh7IG1lc3NhZ2VzOiBzb3J0TWVzc2FnZXMoeyBtZXNzYWdlcyB9KSwgdXNlcm5hbWUgfSkubWFwKFxyXG4gICAgICAgICAgICAobSkgPT4gKFxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnIH19PlxyXG4gICAgICAgICAgICAgICAgeycgJ31cclxuICAgICAgICAgICAgICAgIHshbS50eXBlICYmIDxNZXNzYWdlIG1lc3NhZ2U9e219IC8+fVxyXG4gICAgICAgICAgICAgICAge20udHlwZSAmJiBtLnR5cGUgPT09ICdibG9ja2VyJyAmJiA8QmxvY2tlck1lc3NhZ2UgbWVzc2FnZT17bX0gLz59XHJcbiAgICAgICAgICAgICAgICB7bS50eXBlICYmIG0udHlwZSA9PT0gJ2Jsb2NrZWQnICYmIDxCbG9ja2VkTWVzc2FnZSBtZXNzYWdlPXttfSAvPn1cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgKX1cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3sgZmxleDogMSB9fT5cclxuICAgICAgICA8TWVzc2FnZUVkaXRvclxyXG4gICAgICAgICAgaGFuZ291dD17aGFuZ291dH1cclxuICAgICAgICAgIG9uTWVzc2FnZT17b25TZW5kfVxyXG4gICAgICAgICAgbWVzc2FnZVRleHQ9e21lc3NhZ2VUZXh0fVxyXG4gICAgICAgICAgb25NZXNzYWdlVGV4dD17b25NZXNzYWdlVGV4dH1cclxuICAgICAgICAvPlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbmZ1bmN0aW9uIGZsb2F0TWVzc2FnZXMoeyBtZXNzYWdlcywgdXNlcm5hbWUgfSkge1xyXG4gIGlmIChtZXNzYWdlcyAmJiBtZXNzYWdlcy5sZW5ndGggPiAwICYmIHVzZXJuYW1lKSB7XHJcbiAgICByZXR1cm4gbWVzc2FnZXMubWFwKChtc2cpID0+IHtcclxuICAgICAgaWYgKG1zZy51c2VybmFtZSA9PT0gdXNlcm5hbWUpIHtcclxuICAgICAgICByZXR1cm4geyAuLi5tc2csIGZsb2F0OiAncmlnaHQnLCB1c2VybmFtZTogJ21lJyB9O1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiB7IC4uLm1zZywgZmxvYXQ6ICdsZWZ0JyB9O1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG59XHJcbmZ1bmN0aW9uIHNvcnRNZXNzYWdlcyh7IG1lc3NhZ2VzIH0pIHtcclxuICBpZiAobWVzc2FnZXMpIHtcclxuICAgIHJldHVybiBtZXNzYWdlcy5zb3J0KCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgTWVzc2FnZXMgfSBmcm9tICcuLi9tZXNzYWdlLXVpL01lc3NhZ2VzJztcclxuaW1wb3J0IHsgTGF5b3V0IH0gZnJvbSAnLi9MYXlvdXQnO1xyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBIYW5nY2hhdCh7XHJcbiAgbWVzc2FnZXMgPSBbXSxcclxuICBvbk1lc3NhZ2VUZXh0LFxyXG4gIG9uTWVzc2FnZSxcclxuICBtZXNzYWdlVGV4dCxcclxuICB1c2VybmFtZSxcclxuICBoYW5nb3V0XHJcbn0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPExheW91dCBpZD1cImhhbmdjaGF0LXVpXCIgPlxyXG4gICAgICA8TWVzc2FnZXNcclxuICAgICAgICBoYW5nb3V0PXtoYW5nb3V0fVxyXG4gICAgICAgIG1lc3NhZ2VzPXttZXNzYWdlc31cclxuICAgICAgICBvbk1lc3NhZ2U9e29uTWVzc2FnZX1cclxuICAgICAgICBvbk1lc3NhZ2VUZXh0PXtvbk1lc3NhZ2VUZXh0fVxyXG4gICAgICAgIG1lc3NhZ2VUZXh0ID17bWVzc2FnZVRleHR9XHJcbiAgICAgICAgdXNlcm5hbWU9e3VzZXJuYW1lfVxyXG4gICAgICAvPlxyXG4gICAgPC9MYXlvdXQ+XHJcbiAgKTtcclxufVxyXG4iXSwibmFtZXMiOlsic3R5bGVzIiwicm9vdCIsImRpc3BsYXkiLCJhbGlnbkl0ZW1zIiwiaW5wdXQiLCJwYWRkaW5nIiwibWFyZ2luTGVmdCIsIm1hcmdpblJpZ2h0IiwibWFyZ2luVG9wIiwibWFyZ2luQm90dG9tIiwiYm94U2l6aW5nIiwiZmxleCIsImJ0biIsIk1lc3NhZ2VFZGl0b3IiLCJtZXNzYWdlVGV4dCIsIm9uTWVzc2FnZVRleHQiLCJvbk1lc3NhZ2UiLCJoYW5nb3V0Iiwic3RhdGUiLCJzdHlsZSIsImNvbG9yIiwiZmxvYXQiLCJ3aWR0aCIsImZvbnRTaXplIiwidGV4dEFsaWduIiwiQmxvY2tlck1lc3NhZ2UiLCJtZXNzYWdlIiwidGV4dCIsIkJsb2NrZWRNZXNzYWdlIiwibWVzc2FnZUNvbnRhaW5lciIsIm92ZXJmbG93WSIsIm92ZXJmbG93WCIsIk1lc3NhZ2VzIiwibWVzc2FnZXMiLCJ1c2VybmFtZSIsInNjcm9sbGVyUmVmIiwidXNlUmVmIiwidXNlRWZmZWN0IiwiY3VycmVudCIsInNjcm9sbFRvcCIsInNjcm9sbEhlaWdodCIsIm9uU2VuZCIsImUiLCJoZWlnaHQiLCJmbGV4RGlyZWN0aW9uIiwicGFkZGluZ1RvcCIsImxlbmd0aCIsImZsb2F0TWVzc2FnZXMiLCJzb3J0TWVzc2FnZXMiLCJtYXAiLCJtIiwidHlwZSIsIm1zZyIsInNvcnQiLCJIYW5nY2hhdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFHQSxNQUFNQSxNQUFNLEdBQUc7QUFDYkMsRUFBQUEsSUFBSSxFQUFFO0FBQ0pDLElBQUFBLE9BQU8sRUFBRSxNQURMO0FBRUpDLElBQUFBLFVBQVUsRUFBRTtBQUZSLEdBRE87QUFLYkMsRUFBQUEsS0FBSyxFQUFFO0FBQ0w7QUFDQUMsSUFBQUEsT0FBTyxFQUFFLENBRko7QUFHTEMsSUFBQUEsVUFBVSxFQUFFLENBSFA7QUFJTEMsSUFBQUEsV0FBVyxFQUFFLENBSlI7QUFLTEMsSUFBQUEsU0FBUyxFQUFFLENBTE47QUFNTEMsSUFBQUEsWUFBWSxFQUFFLENBTlQ7QUFPTEMsSUFBQUEsU0FBUyxFQUFFLFlBUE47QUFRTEMsSUFBQUEsSUFBSSxFQUFFO0FBUkQsR0FMTTtBQWdCYkMsRUFBQUEsR0FBRyxFQUFDO0FBQ0ZQLElBQUFBLE9BQU8sRUFBRSxDQURQO0FBR0ZFLElBQUFBLFdBQVcsRUFBRSxFQUhYO0FBSUZDLElBQUFBLFNBQVMsRUFBRSxDQUpUO0FBS0ZDLElBQUFBLFlB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
