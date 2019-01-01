import { h, y, p } from './index-c370a65f.js';
import { B as Button } from './Button-15dbbe18.js';
import { L as Layout } from './Layout-7b1e4ce4.js';
import { M as Message } from './Message-a0c0fa74.js';

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGFuZ2NoYXQtYzVmYTRlZmYuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9tZXNzYWdlLXVpL01lc3NhZ2VFZGl0b3IuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvbWVzc2FnZS11aS9CbG9ja2VyTWVzc2FnZS5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9tZXNzYWdlLXVpL0Jsb2NrZWRNZXNzYWdlLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL21lc3NhZ2UtdWkvTWVzc2FnZXMuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUtdWkvSGFuZ2NoYXQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyBUZXh0SW5wdXQgfSBmcm9tICcuLi8uLi9sYXlvdXQvVGV4dElucHV0JztcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4uLy4uL2xheW91dC9CdXR0b24nO1xuY29uc3Qgc3R5bGVzID0ge1xuICByb290OiB7XG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICB9LFxuICBpbnB1dDoge1xuICAgIC8vbWFyZ2luOjBcbiAgICBwYWRkaW5nOiA1LFxuICAgIG1hcmdpbkxlZnQ6IDgsXG4gICAgbWFyZ2luUmlnaHQ6IDgsXG4gICAgbWFyZ2luVG9wOiA4LFxuICAgIG1hcmdpbkJvdHRvbTogOCxcbiAgICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcbiAgICBmbGV4OiAxLFxuICAgIFxuICB9LFxuICBidG46e1xuICAgIHBhZGRpbmc6IDgsXG5cbiAgICBtYXJnaW5SaWdodDogMTYsXG4gICAgbWFyZ2luVG9wOiA4LFxuICAgIG1hcmdpbkJvdHRvbTogOCxcbiAgICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcbiAgICBmbGV4OiAxLFxuICB9XG59O1xuZXhwb3J0IGZ1bmN0aW9uIE1lc3NhZ2VFZGl0b3IoeyBtZXNzYWdlVGV4dCwgb25NZXNzYWdlVGV4dCwgb25NZXNzYWdlLGhhbmdvdXQgfSkge1xuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3N0eWxlcy5yb290fT5cbiAgICAgXG4gICAgICA8aW5wdXQgc3R5bGU9e3N0eWxlcy5pbnB1dH0gZGlzYWJsZWQ9e2hhbmdvdXQgJiZoYW5nb3V0LnN0YXRlPT09J0JMT0NLRUQnfSAgdHlwZT1cInRleHRcIiBvbkNoYW5nZT17b25NZXNzYWdlVGV4dH0gIGRhdGEtdGVzdGlkPVwibWVzc2FnZS1pbnB1dFwiIHZhbHVlPXttZXNzYWdlVGV4dH0vPlxuICAgICAgXG4gICAgICA8ZGl2PlxuICAgICAgICA8QnV0dG9uIGRpc2FibGVkPXtoYW5nb3V0ICYmaGFuZ291dC5zdGF0ZT09PSdCTE9DS0VEJ30gIHN0eWxlPXtzdHlsZXMuYnRufSAgdGl0bGU9XCJzZW5kXCIgaWQ9J01FU1NBR0UnIG9uQ2xpY2s9e29uTWVzc2FnZX0gZGF0YS10ZXN0aWQ9J3NlbmQtYnRuJy8+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnXG5jb25zdCBzdHlsZSA9IHtcbiAgICBjb2xvcjogJ3JlZCcsXG4gICAgZmxvYXQ6ICdyaWdodCcsXG4gICAgd2lkdGg6ICcxMDAlJyxcbiAgICBmb250U2l6ZTogMTYsXG4gICAgdGV4dEFsaWduOiAnZW5kJ1xufVxuZXhwb3J0IGZ1bmN0aW9uIEJsb2NrZXJNZXNzYWdlKHsgbWVzc2FnZSB9KSB7XG4gICAgcmV0dXJuIDxkaXYgc3R5bGU9e3N0eWxlfSBkYXRhLXRlc3RpZD1cImJsb2NrZXItbWVzc2FnZVwiPnttZXNzYWdlLnRleHR9PC9kaXY+XG59IiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCdcbmNvbnN0IHN0eWxlID0ge1xuICAgIGNvbG9yOiAncmVkJyxcbiAgICBmbG9hdDogJ3JpZ2h0JyxcbiAgICB3aWR0aDogJzEwMCUnLFxuICAgIGZvbnRTaXplOiAxNixcbiAgICB0ZXh0QWxpZ246ICdlbmQnXG59XG5leHBvcnQgZnVuY3Rpb24gQmxvY2tlZE1lc3NhZ2UoeyBtZXNzYWdlLG9uTmF2aWdhdGlvbiB9KSB7XG4gICAgZnVuY3Rpb24gaGFuZGxlTmF2aWdhdGlvbihlKXtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIG9uTmF2aWdhdGlvbihlKVxuICAgIH1cbiAgICBkZWJ1Z2dlcjtcbiAgICByZXR1cm4gPGRpdiBzdHlsZT17c3R5bGV9IGRhdGEtdGVzdGlkPVwiYmxvY2tlZC1tZXNzYWdlXCI+e21lc3NhZ2UudGV4dH1cbiAgICA8YSBpZD1cIlVOQkxPQ0tcIiBkYXRhLXRlc3RpZD1cInNlZW1vcmUtYnRuXCIgaHJlZj1cIi9cIiBvbkNsaWNrPXtoYW5kbGVOYXZpZ2F0aW9ufT5zZWUgbW9yZTwvYT5cbiAgICA8L2Rpdj5cbn0iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IHVzZVJlZiwgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcbmltcG9ydCB7IE1lc3NhZ2UgfSBmcm9tICcuL01lc3NhZ2UnO1xuaW1wb3J0IHsgTWVzc2FnZUVkaXRvciB9IGZyb20gJy4vTWVzc2FnZUVkaXRvcic7XG5pbXBvcnQgeyBCbG9ja2VyTWVzc2FnZSB9IGZyb20gJy4vQmxvY2tlck1lc3NhZ2UnXG5pbXBvcnQge0Jsb2NrZWRNZXNzYWdlfSBmcm9tICcuL0Jsb2NrZWRNZXNzYWdlJ1xuY29uc3Qgc3R5bGVzID0ge1xuICBtZXNzYWdlQ29udGFpbmVyOiB7XG4gICAgLy8gd2lkdGg6ICcxMDAlJyxcbiAgICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcbiAgICBwYWRkaW5nOiAzLFxuICAvLyAgYmFja2dyb3VuZENvbG9yOiAnb3JhbmdlJyxcbiAgICBmbGV4OiAxNSxcbiAgICBvdmVyZmxvd1k6ICdhdXRvJyxcbiAgICBvdmVyZmxvd1g6IFwiaGlkZGVuXCJcblxuICB9LFxufTtcbmV4cG9ydCBmdW5jdGlvbiBNZXNzYWdlcyh7XG4gIG1lc3NhZ2VzLFxuICBvbk1lc3NhZ2UsXG4gIG9uTWVzc2FnZVRleHQsXG4gIG1lc3NhZ2VUZXh0LFxuICB1c2VybmFtZSxcbiAgaGFuZ291dCxcbiAgb25OYXZpZ2F0aW9uXG59KSB7XG4gIGNvbnN0IHNjcm9sbGVyUmVmID0gdXNlUmVmKG51bGwpO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKG1lc3NhZ2VzKSB7XG4gICAgICBzY3JvbGxlclJlZi5jdXJyZW50LnNjcm9sbFRvcCA9IHNjcm9sbGVyUmVmLmN1cnJlbnQuc2Nyb2xsSGVpZ2h0O1xuICAgIH1cbiAgfSwgW21lc3NhZ2VzXSk7XG5cbiAgZnVuY3Rpb24gb25TZW5kKGUpIHtcbiAgICBvbk1lc3NhZ2UoZSk7XG4gICAgc2Nyb2xsZXJSZWYuY3VycmVudC5zY3JvbGxUb3AgPSBzY3JvbGxlclJlZi5jdXJyZW50LnNjcm9sbEhlaWdodDtcbiAgfVxuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3sgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsIHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnLCBkaXNwbGF5OiAnZmxleCcsIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLCBwYWRkaW5nVG9wOiA2OCB9fT5cbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlcy5tZXNzYWdlQ29udGFpbmVyfSByZWY9e3Njcm9sbGVyUmVmfT5cbiAgICAgICAge21lc3NhZ2VzICYmXG4gICAgICAgICAgbWVzc2FnZXMubGVuZ3RoID4gMCAmJlxuICAgICAgICAgIGZsb2F0TWVzc2FnZXMoeyBtZXNzYWdlczogc29ydE1lc3NhZ2VzKHsgbWVzc2FnZXMgfSksIHVzZXJuYW1lIH0pLm1hcChcbiAgICAgICAgICAgIChtKSA9PiAoXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnIH19PlxuICAgICAgICAgICAgICAgIHsnICd9XG4gICAgICAgICAgICAgICAgeyFtLnR5cGUgJiYgPE1lc3NhZ2UgbWVzc2FnZT17bX0gLz59XG4gICAgICAgICAgICAgICAge20udHlwZSAmJiBtLnR5cGUgPT09ICdibG9ja2VyJyAmJiA8QmxvY2tlck1lc3NhZ2UgbWVzc2FnZT17bX0gLz59XG4gICAgICAgICAgICAgICAge20udHlwZSAmJiBtLnR5cGUgPT09ICdibG9ja2VkJyAmJiA8QmxvY2tlZE1lc3NhZ2UgbWVzc2FnZT17bX0gb25OYXZpZ2F0aW9uPXtvbk5hdmlnYXRpb259Lz59XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKVxuICAgICAgICAgICl9XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgc3R5bGU9e3sgZmxleDogMSB9fT5cbiAgICAgICAgPE1lc3NhZ2VFZGl0b3JcbiAgICAgICAgICBoYW5nb3V0PXtoYW5nb3V0fVxuICAgICAgICAgIG9uTWVzc2FnZT17b25TZW5kfVxuICAgICAgICAgIG1lc3NhZ2VUZXh0PXttZXNzYWdlVGV4dH1cbiAgICAgICAgICBvbk1lc3NhZ2VUZXh0PXtvbk1lc3NhZ2VUZXh0fVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbmZ1bmN0aW9uIGZsb2F0TWVzc2FnZXMoeyBtZXNzYWdlcywgdXNlcm5hbWUgfSkge1xuICBpZiAobWVzc2FnZXMgJiYgbWVzc2FnZXMubGVuZ3RoID4gMCAmJiB1c2VybmFtZSkge1xuICAgIHJldHVybiBtZXNzYWdlcy5tYXAoKG1zZykgPT4ge1xuICAgICAgaWYgKG1zZy51c2VybmFtZSA9PT0gdXNlcm5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHsgLi4ubXNnLCBmbG9hdDogJ3JpZ2h0JywgdXNlcm5hbWU6ICdtZScgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7IC4uLm1zZywgZmxvYXQ6ICdsZWZ0JyB9O1xuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5mdW5jdGlvbiBzb3J0TWVzc2FnZXMoeyBtZXNzYWdlcyB9KSB7XG4gIGlmIChtZXNzYWdlcykge1xuICAgIHJldHVybiBtZXNzYWdlcy5zb3J0KCk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgTWVzc2FnZXMgfSBmcm9tICcuLi9tZXNzYWdlLXVpL01lc3NhZ2VzJztcbmltcG9ydCB7IExheW91dCB9IGZyb20gJy4vTGF5b3V0JztcblxuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEhhbmdjaGF0KHtcbiAgbWVzc2FnZXMgPSBbXSxcbiAgb25NZXNzYWdlVGV4dCxcbiAgb25NZXNzYWdlLFxuICBtZXNzYWdlVGV4dCxcbiAgdXNlcm5hbWUsXG4gIGhhbmdvdXQsXG4gIG9uTmF2aWdhdGlvblxufSkge1xuICByZXR1cm4gKFxuICAgIDxMYXlvdXQgaWQ9XCJoYW5nY2hhdC11aVwiID5cbiAgICAgIDxNZXNzYWdlc1xuICAgICAgb25OYXZpZ2F0aW9uPXtvbk5hdmlnYXRpb259XG4gICAgICAgIGhhbmdvdXQ9e2hhbmdvdXR9XG4gICAgICAgIG1lc3NhZ2VzPXttZXNzYWdlc31cbiAgICAgICAgb25NZXNzYWdlPXtvbk1lc3NhZ2V9XG4gICAgICAgIG9uTWVzc2FnZVRleHQ9e29uTWVzc2FnZVRleHR9XG4gICAgICAgIG1lc3NhZ2VUZXh0ID17bWVzc2FnZVRleHR9XG4gICAgICAgIHVzZXJuYW1lPXt1c2VybmFtZX1cbiAgICAgIC8+XG4gICAgPC9MYXlvdXQ+XG4gICk7XG59XG4iXSwibmFtZXMiOlsic3R5bGVzIiwicm9vdCIsImRpc3BsYXkiLCJhbGlnbkl0ZW1zIiwiaW5wdXQiLCJwYWRkaW5nIiwibWFyZ2luTGVmdCIsIm1hcmdpblJpZ2h0IiwibWFyZ2luVG9wIiwibWFyZ2luQm90dG9tIiwiYm94U2l6aW5nIiwiZmxleCIsImJ0biIsIk1lc3NhZ2VFZGl0b3IiLCJtZXNzYWdlVGV4dCIsIm9uTWVzc2FnZVRleHQiLCJvbk1lc3NhZ2UiLCJoYW5nb3V0Iiwic3RhdGUiLCJzdHlsZSIsImNvbG9yIiwiZmxvYXQiLCJ3aWR0aCIsImZvbnRTaXplIiwidGV4dEFsaWduIiwiQmxvY2tlck1lc3NhZ2UiLCJtZXNzYWdlIiwidGV4dCIsIkJsb2NrZWRNZXNzYWdlIiwib25OYXZpZ2F0aW9uIiwiaGFuZGxlTmF2aWdhdGlvbiIsImUiLCJwcmV2ZW50RGVmYXVsdCIsIm1lc3NhZ2VDb250YWluZXIiLCJvdmVyZmxvd1kiLCJvdmVyZmxvd1giLCJNZXNzYWdlcyIsIm1lc3NhZ2VzIiwidXNlcm5hbWUiLCJzY3JvbGxlclJlZiIsInVzZVJlZiIsInVzZUVmZmVjdCIsImN1cnJlbnQiLCJzY3JvbGxUb3AiLCJzY3JvbGxIZWlnaHQiLCJvblNlbmQiLCJoZWlnaHQiLCJmbGV4RGlyZWN0aW9uIiwicGFkZGluZ1RvcCIsImxlbmd0aCIsImZsb2F0TWVzc2FnZXMiLCJzb3J0TWVzc2FnZXMiLCJtYXAiLCJtIiwidHlwZSIsIm1zZyIsInNvcnQiLCJIYW5nY2hhdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFHQSxNQUFNQSxNQUFNLEdBQUc7QUFDYkMsRUFBQUEsSUFBSSxFQUFFO0FBQ0pDLElBQUFBLE9BQU8sRUFBRSxNQURMO0FBRUpDLElBQUFBLFVBQVUsRUFBRTtBQUZSLEdBRE87QUFLYkMsRUFBQUEsS0FBSyxFQUFFO0FBQ0w7QUFDQUMsSUFBQUEsT0FBTyxFQUFFLENBRko7QUFHTEMsSUFBQUEsVUFBVSxFQUFFLENBSFA7QUFJTEMsSUFBQUEsV0FBVyxFQUFFLENBSlI7QUFLTEMsSUFBQUEsU0FBUyxFQUFFLENBTE47QUFNTEMsSUFBQUEsWUFBWSxFQUFFLENBTlQ7QUFPTEMsSUFBQUEsU0FBUyxFQUFFLFlBUE47QUFRTEMsSUFBQUEsSUFBSSxFQUFFO0FBUkQsR0FMTTtBQWdCYkMsRUFBQUEsR0FBRyxFQUFDO0FBQ0ZQLElBQUFBLE9BQU8sRUFBRSxDQURQO0FBR0ZFLElBQUFBLFdBQVcsRUFBRSxFQUhYO0FBSUZDLElBQUFB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
