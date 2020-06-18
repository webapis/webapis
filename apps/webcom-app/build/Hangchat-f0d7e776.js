import { h, y, p } from './index-efca8ae3.js';
import { B as Button } from './Button-ad3f1a09.js';
import { L as Layout } from './Layout-b1500a04.js';
import { M as Message } from './Message-db1c86d8.js';

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
  onNavigation
}) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGFuZ2NoYXQtZjBkN2U3NzYuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9tZXNzYWdlLXVpL01lc3NhZ2VFZGl0b3IuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvbWVzc2FnZS11aS9CbG9ja2VyTWVzc2FnZS5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9tZXNzYWdlLXVpL0Jsb2NrZWRNZXNzYWdlLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL21lc3NhZ2UtdWkvTWVzc2FnZXMuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUtdWkvSGFuZ2NoYXQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IFRleHRJbnB1dCB9IGZyb20gJy4uLy4uL2xheW91dC9UZXh0SW5wdXQnO1xyXG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tICcuLi8uLi9sYXlvdXQvQnV0dG9uJztcclxuY29uc3Qgc3R5bGVzID0ge1xyXG4gIHJvb3Q6IHtcclxuICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxyXG4gIH0sXHJcbiAgaW5wdXQ6IHtcclxuICAgIC8vbWFyZ2luOjBcclxuICAgIHBhZGRpbmc6IDUsXHJcbiAgICBtYXJnaW5MZWZ0OiA4LFxyXG4gICAgbWFyZ2luUmlnaHQ6IDgsXHJcbiAgICBtYXJnaW5Ub3A6IDgsXHJcbiAgICBtYXJnaW5Cb3R0b206IDgsXHJcbiAgICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcclxuICAgIGZsZXg6IDEsXHJcbiAgICBcclxuICB9LFxyXG4gIGJ0bjp7XHJcbiAgICBwYWRkaW5nOiA4LFxyXG5cclxuICAgIG1hcmdpblJpZ2h0OiAxNixcclxuICAgIG1hcmdpblRvcDogOCxcclxuICAgIG1hcmdpbkJvdHRvbTogOCxcclxuICAgIGJveFNpemluZzogJ2JvcmRlci1ib3gnLFxyXG4gICAgZmxleDogMSxcclxuICB9XHJcbn07XHJcbmV4cG9ydCBmdW5jdGlvbiBNZXNzYWdlRWRpdG9yKHsgbWVzc2FnZVRleHQsIG9uTWVzc2FnZVRleHQsIG9uTWVzc2FnZSxoYW5nb3V0IH0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17c3R5bGVzLnJvb3R9PlxyXG4gICAgIFxyXG4gICAgICA8aW5wdXQgc3R5bGU9e3N0eWxlcy5pbnB1dH0gZGlzYWJsZWQ9e2hhbmdvdXQgJiZoYW5nb3V0LnN0YXRlPT09J0JMT0NLRUQnfSAgdHlwZT1cInRleHRcIiBvbkNoYW5nZT17b25NZXNzYWdlVGV4dH0gIGRhdGEtdGVzdGlkPVwibWVzc2FnZS1pbnB1dFwiIHZhbHVlPXttZXNzYWdlVGV4dH0vPlxyXG4gICAgICBcclxuICAgICAgPGRpdj5cclxuICAgICAgICA8QnV0dG9uIGRpc2FibGVkPXtoYW5nb3V0ICYmaGFuZ291dC5zdGF0ZT09PSdCTE9DS0VEJ30gIHN0eWxlPXtzdHlsZXMuYnRufSAgdGl0bGU9XCJzZW5kXCIgaWQ9J01FU1NBR0UnIG9uQ2xpY2s9e29uTWVzc2FnZX0gZGF0YS10ZXN0aWQ9J3NlbmQtYnRuJy8+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0J1xyXG5jb25zdCBzdHlsZSA9IHtcclxuICAgIGNvbG9yOiAncmVkJyxcclxuICAgIGZsb2F0OiAncmlnaHQnLFxyXG4gICAgd2lkdGg6ICcxMDAlJyxcclxuICAgIGZvbnRTaXplOiAxNixcclxuICAgIHRleHRBbGlnbjogJ2VuZCdcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gQmxvY2tlck1lc3NhZ2UoeyBtZXNzYWdlIH0pIHtcclxuICAgIHJldHVybiA8ZGl2IHN0eWxlPXtzdHlsZX0gZGF0YS10ZXN0aWQ9XCJibG9ja2VyLW1lc3NhZ2VcIj57bWVzc2FnZS50ZXh0fTwvZGl2PlxyXG59IiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCdcclxuY29uc3Qgc3R5bGUgPSB7XHJcbiAgICBjb2xvcjogJ3JlZCcsXHJcbiAgICBmbG9hdDogJ3JpZ2h0JyxcclxuICAgIHdpZHRoOiAnMTAwJScsXHJcbiAgICBmb250U2l6ZTogMTYsXHJcbiAgICB0ZXh0QWxpZ246ICdlbmQnXHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIEJsb2NrZWRNZXNzYWdlKHsgbWVzc2FnZSxvbk5hdmlnYXRpb24gfSkge1xyXG4gICAgZnVuY3Rpb24gaGFuZGxlTmF2aWdhdGlvbihlKXtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICBvbk5hdmlnYXRpb24oZSlcclxuICAgIH1cclxuICAgIGRlYnVnZ2VyO1xyXG4gICAgcmV0dXJuIDxkaXYgc3R5bGU9e3N0eWxlfSBkYXRhLXRlc3RpZD1cImJsb2NrZWQtbWVzc2FnZVwiPnttZXNzYWdlLnRleHR9XHJcbiAgICA8YSBpZD1cIlVOQkxPQ0tcIiBkYXRhLXRlc3RpZD1cInNlZW1vcmUtYnRuXCIgaHJlZj1cIi9cIiBvbkNsaWNrPXtoYW5kbGVOYXZpZ2F0aW9ufT5zZWUgbW9yZTwvYT5cclxuICAgIDwvZGl2PlxyXG59IiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZVJlZiwgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgTWVzc2FnZSB9IGZyb20gJy4vTWVzc2FnZSc7XHJcbmltcG9ydCB7IE1lc3NhZ2VFZGl0b3IgfSBmcm9tICcuL01lc3NhZ2VFZGl0b3InO1xyXG5pbXBvcnQgeyBCbG9ja2VyTWVzc2FnZSB9IGZyb20gJy4vQmxvY2tlck1lc3NhZ2UnXHJcbmltcG9ydCB7QmxvY2tlZE1lc3NhZ2V9IGZyb20gJy4vQmxvY2tlZE1lc3NhZ2UnXHJcbmNvbnN0IHN0eWxlcyA9IHtcclxuICBtZXNzYWdlQ29udGFpbmVyOiB7XHJcbiAgICAvLyB3aWR0aDogJzEwMCUnLFxyXG4gICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXHJcbiAgICBwYWRkaW5nOiAzLFxyXG4gIC8vICBiYWNrZ3JvdW5kQ29sb3I6ICdvcmFuZ2UnLFxyXG4gICAgZmxleDogMTUsXHJcbiAgICBvdmVyZmxvd1k6ICdhdXRvJyxcclxuICAgIG92ZXJmbG93WDogXCJoaWRkZW5cIlxyXG5cclxuICB9LFxyXG59O1xyXG5leHBvcnQgZnVuY3Rpb24gTWVzc2FnZXMoe1xyXG4gIG1lc3NhZ2VzLFxyXG4gIG9uTWVzc2FnZSxcclxuICBvbk1lc3NhZ2VUZXh0LFxyXG4gIG1lc3NhZ2VUZXh0LFxyXG4gIHVzZXJuYW1lLFxyXG4gIGhhbmdvdXQsXHJcbiAgb25OYXZpZ2F0aW9uXHJcbn0pIHtcclxuICBjb25zdCBzY3JvbGxlclJlZiA9IHVzZVJlZihudWxsKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmIChtZXNzYWdlcykge1xyXG4gICAgICBzY3JvbGxlclJlZi5jdXJyZW50LnNjcm9sbFRvcCA9IHNjcm9sbGVyUmVmLmN1cnJlbnQuc2Nyb2xsSGVpZ2h0O1xyXG4gICAgfVxyXG4gIH0sIFttZXNzYWdlc10pO1xyXG5cclxuICBmdW5jdGlvbiBvblNlbmQoZSkge1xyXG4gICAgb25NZXNzYWdlKGUpO1xyXG4gICAgc2Nyb2xsZXJSZWYuY3VycmVudC5zY3JvbGxUb3AgPSBzY3JvbGxlclJlZi5jdXJyZW50LnNjcm9sbEhlaWdodDtcclxuICB9XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3sgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsIHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnLCBkaXNwbGF5OiAnZmxleCcsIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLCBwYWRkaW5nVG9wOiA2OCB9fT5cclxuICAgICAgPGRpdiBzdHlsZT17c3R5bGVzLm1lc3NhZ2VDb250YWluZXJ9IHJlZj17c2Nyb2xsZXJSZWZ9PlxyXG4gICAgICAgIHttZXNzYWdlcyAmJlxyXG4gICAgICAgICAgbWVzc2FnZXMubGVuZ3RoID4gMCAmJlxyXG4gICAgICAgICAgZmxvYXRNZXNzYWdlcyh7IG1lc3NhZ2VzOiBzb3J0TWVzc2FnZXMoeyBtZXNzYWdlcyB9KSwgdXNlcm5hbWUgfSkubWFwKFxyXG4gICAgICAgICAgICAobSkgPT4gKFxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnIH19PlxyXG4gICAgICAgICAgICAgICAgeycgJ31cclxuICAgICAgICAgICAgICAgIHshbS50eXBlICYmIDxNZXNzYWdlIG1lc3NhZ2U9e219IC8+fVxyXG4gICAgICAgICAgICAgICAge20udHlwZSAmJiBtLnR5cGUgPT09ICdibG9ja2VyJyAmJiA8QmxvY2tlck1lc3NhZ2UgbWVzc2FnZT17bX0gLz59XHJcbiAgICAgICAgICAgICAgICB7bS50eXBlICYmIG0udHlwZSA9PT0gJ2Jsb2NrZWQnICYmIDxCbG9ja2VkTWVzc2FnZSBtZXNzYWdlPXttfSBvbk5hdmlnYXRpb249e29uTmF2aWdhdGlvbn0vPn1cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgKX1cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3sgZmxleDogMSB9fT5cclxuICAgICAgICA8TWVzc2FnZUVkaXRvclxyXG4gICAgICAgICAgaGFuZ291dD17aGFuZ291dH1cclxuICAgICAgICAgIG9uTWVzc2FnZT17b25TZW5kfVxyXG4gICAgICAgICAgbWVzc2FnZVRleHQ9e21lc3NhZ2VUZXh0fVxyXG4gICAgICAgICAgb25NZXNzYWdlVGV4dD17b25NZXNzYWdlVGV4dH1cclxuICAgICAgICAvPlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbmZ1bmN0aW9uIGZsb2F0TWVzc2FnZXMoeyBtZXNzYWdlcywgdXNlcm5hbWUgfSkge1xyXG4gIGlmIChtZXNzYWdlcyAmJiBtZXNzYWdlcy5sZW5ndGggPiAwICYmIHVzZXJuYW1lKSB7XHJcbiAgICByZXR1cm4gbWVzc2FnZXMubWFwKChtc2cpID0+IHtcclxuICAgICAgaWYgKG1zZy51c2VybmFtZSA9PT0gdXNlcm5hbWUpIHtcclxuICAgICAgICByZXR1cm4geyAuLi5tc2csIGZsb2F0OiAncmlnaHQnLCB1c2VybmFtZTogJ21lJyB9O1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiB7IC4uLm1zZywgZmxvYXQ6ICdsZWZ0JyB9O1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG59XHJcbmZ1bmN0aW9uIHNvcnRNZXNzYWdlcyh7IG1lc3NhZ2VzIH0pIHtcclxuICBpZiAobWVzc2FnZXMpIHtcclxuICAgIHJldHVybiBtZXNzYWdlcy5zb3J0KCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgTWVzc2FnZXMgfSBmcm9tICcuLi9tZXNzYWdlLXVpL01lc3NhZ2VzJztcclxuaW1wb3J0IHsgTGF5b3V0IH0gZnJvbSAnLi9MYXlvdXQnO1xyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBIYW5nY2hhdCh7XHJcbiAgbWVzc2FnZXMgPSBbXSxcclxuICBvbk1lc3NhZ2VUZXh0LFxyXG4gIG9uTWVzc2FnZSxcclxuICBtZXNzYWdlVGV4dCxcclxuICB1c2VybmFtZSxcclxuICBoYW5nb3V0LFxyXG4gIG9uTmF2aWdhdGlvblxyXG59KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxMYXlvdXQgaWQ9XCJoYW5nY2hhdC11aVwiID5cclxuICAgICAgPE1lc3NhZ2VzXHJcbiAgICAgIG9uTmF2aWdhdGlvbj17b25OYXZpZ2F0aW9ufVxyXG4gICAgICAgIGhhbmdvdXQ9e2hhbmdvdXR9XHJcbiAgICAgICAgbWVzc2FnZXM9e21lc3NhZ2VzfVxyXG4gICAgICAgIG9uTWVzc2FnZT17b25NZXNzYWdlfVxyXG4gICAgICAgIG9uTWVzc2FnZVRleHQ9e29uTWVzc2FnZVRleHR9XHJcbiAgICAgICAgbWVzc2FnZVRleHQgPXttZXNzYWdlVGV4dH1cclxuICAgICAgICB1c2VybmFtZT17dXNlcm5hbWV9XHJcbiAgICAgIC8+XHJcbiAgICA8L0xheW91dD5cclxuICApO1xyXG59XHJcbiJdLCJuYW1lcyI6WyJzdHlsZXMiLCJyb290IiwiZGlzcGxheSIsImFsaWduSXRlbXMiLCJpbnB1dCIsInBhZGRpbmciLCJtYXJnaW5MZWZ0IiwibWFyZ2luUmlnaHQiLCJtYXJnaW5Ub3AiLCJtYXJnaW5Cb3R0b20iLCJib3hTaXppbmciLCJmbGV4IiwiYnRuIiwiTWVzc2FnZUVkaXRvciIsIm1lc3NhZ2VUZXh0Iiwib25NZXNzYWdlVGV4dCIsIm9uTWVzc2FnZSIsImhhbmdvdXQiLCJzdGF0ZSIsInN0eWxlIiwiY29sb3IiLCJmbG9hdCIsIndpZHRoIiwiZm9udFNpemUiLCJ0ZXh0QWxpZ24iLCJCbG9ja2VyTWVzc2FnZSIsIm1lc3NhZ2UiLCJ0ZXh0IiwiQmxvY2tlZE1lc3NhZ2UiLCJvbk5hdmlnYXRpb24iLCJoYW5kbGVOYXZpZ2F0aW9uIiwiZSIsInByZXZlbnREZWZhdWx0IiwibWVzc2FnZUNvbnRhaW5lciIsIm92ZXJmbG93WSIsIm92ZXJmbG93WCIsIk1lc3NhZ2VzIiwibWVzc2FnZXMiLCJ1c2VybmFtZSIsInNjcm9sbGVyUmVmIiwidXNlUmVmIiwidXNlRWZmZWN0IiwiY3VycmVudCIsInNjcm9sbFRvcCIsInNjcm9sbEhlaWdodCIsIm9uU2VuZCIsImhlaWdodCIsImZsZXhEaXJlY3Rpb24iLCJwYWRkaW5nVG9wIiwibGVuZ3RoIiwiZmxvYXRNZXNzYWdlcyIsInNvcnRNZXNzYWdlcyIsIm1hcCIsIm0iLCJ0eXBlIiwibXNnIiwic29ydCIsIkhhbmdjaGF0Il0sIm1hcHBpbmdzIjoiOzs7OztBQUdBLE1BQU1BLE1BQU0sR0FBRztBQUNiQyxFQUFBQSxJQUFJLEVBQUU7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
