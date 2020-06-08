import { a as h, E as d } from './index-0834d1ff.js';
import { B as Button } from './Button-813055b8.js';
import { L as Layout } from './Layout-e6ab316c.js';
import { M as Message } from './Message-dde1019e.js';

const styles = {
  root: {
    display: 'flex',
    alignItems: 'center'
  },
  input: {//margin:0
  }
};
function MessageEditor({
  messageText,
  onMessageText,
  onMessage
}) {
  return h("div", {
    style: styles.root
  }, h("input", {
    type: "text",
    onChange: onMessageText,
    "data-testid": "message-input"
  }), h("div", null, h(Button, {
    title: "send",
    id: "MESSAGE",
    onClick: onMessage,
    "data-testid": "send-btn"
  })));
}

const styles$1 = {
  messageContainer: {
    width: '100%',
    // backgroundColor: 'orange',
    height: '20vh',
    overflow: 'auto'
  }
};
function Messages({
  messages,
  username,
  onMessage,
  onMessageText,
  messageText
}) {
  const scrollerRef = d(null);

  function onSend(e) {
    onMessage(e);
    scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
  }

  return h("div", null, h("div", {
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
  }, ' ', h(Message, {
    message: m
  })))), h(MessageEditor, {
    onMessage: onSend,
    messageText: messageText,
    onMessageText: onMessageText
  }));
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
  username
}) {
  return h(Layout, {
    id: "hangchat-ui"
  }, h(Messages, {
    messages: messages,
    onMessage: onMessage,
    onMessageText: onMessageText,
    messageText: true,
    username: username
  }));
}

export default Hangchat;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGFuZ2NoYXQtMGEyMmMyNzguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy91aS9NZXNzYWdlRWRpdG9yLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3VpL01lc3NhZ2VzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlLXVpL0hhbmdjaGF0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgVGV4dElucHV0IH0gZnJvbSAnLi4vLi4vbGF5b3V0L1RleHRJbnB1dCc7XG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tICcuLi8uLi9sYXlvdXQvQnV0dG9uJztcbmNvbnN0IHN0eWxlcyA9IHtcbiAgcm9vdDoge1xuICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgfSxcbiAgaW5wdXQ6IHtcbiAgICAvL21hcmdpbjowXG4gIH0sXG59O1xuZXhwb3J0IGZ1bmN0aW9uIE1lc3NhZ2VFZGl0b3IoeyBtZXNzYWdlVGV4dCwgb25NZXNzYWdlVGV4dCwgb25NZXNzYWdlIH0pIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXtzdHlsZXMucm9vdH0+XG4gICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBvbkNoYW5nZT17b25NZXNzYWdlVGV4dH0gIGRhdGEtdGVzdGlkPVwibWVzc2FnZS1pbnB1dFwiLz5cbiAgICAgIDxkaXY+XG4gICAgICAgIDxCdXR0b24gdGl0bGU9XCJzZW5kXCIgaWQ9J01FU1NBR0UnIG9uQ2xpY2s9e29uTWVzc2FnZX0gZGF0YS10ZXN0aWQ9J3NlbmQtYnRuJy8+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgdXNlUmVmIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcbmltcG9ydCB7IE1lc3NhZ2UgfSBmcm9tICcuL01lc3NhZ2UnO1xuaW1wb3J0IHsgTWVzc2FnZUVkaXRvciB9IGZyb20gJy4vTWVzc2FnZUVkaXRvcic7XG5jb25zdCBzdHlsZXMgPSB7XG4gIG1lc3NhZ2VDb250YWluZXI6IHtcbiAgICB3aWR0aDogJzEwMCUnLFxuICAgIC8vIGJhY2tncm91bmRDb2xvcjogJ29yYW5nZScsXG4gICAgaGVpZ2h0OiAnMjB2aCcsXG4gICAgb3ZlcmZsb3c6ICdhdXRvJyxcbiAgfSxcbn07XG5leHBvcnQgZnVuY3Rpb24gTWVzc2FnZXMoe1xuICBtZXNzYWdlcyxcbiAgdXNlcm5hbWUsXG4gIG9uTWVzc2FnZSxcbiAgb25NZXNzYWdlVGV4dCxcbiAgbWVzc2FnZVRleHQsXG59KSB7XG4gIGNvbnN0IHNjcm9sbGVyUmVmID0gdXNlUmVmKG51bGwpO1xuICBmdW5jdGlvbiBvblNlbmQoZSkge1xuICAgIG9uTWVzc2FnZShlKTtcbiAgICBzY3JvbGxlclJlZi5jdXJyZW50LnNjcm9sbFRvcCA9IHNjcm9sbGVyUmVmLmN1cnJlbnQuc2Nyb2xsSGVpZ2h0O1xuICB9XG4gIHJldHVybiAoXG4gICAgPGRpdj5cbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlcy5tZXNzYWdlQ29udGFpbmVyfSByZWY9e3Njcm9sbGVyUmVmfT5cbiAgICAgICAge21lc3NhZ2VzICYmXG4gICAgICAgICAgbWVzc2FnZXMubGVuZ3RoID4gMCAmJlxuICAgICAgICAgIGZsb2F0TWVzc2FnZXMoeyBtZXNzYWdlczogc29ydE1lc3NhZ2VzKHsgbWVzc2FnZXMgfSksIHVzZXJuYW1lIH0pLm1hcChcbiAgICAgICAgICAgIChtKSA9PiAoXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnIH19PlxuICAgICAgICAgICAgICAgIHsnICd9XG4gICAgICAgICAgICAgICAgPE1lc3NhZ2UgbWVzc2FnZT17bX0gLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApXG4gICAgICAgICAgKX1cbiAgICAgIDwvZGl2PlxuICAgICAgPE1lc3NhZ2VFZGl0b3Igb25NZXNzYWdlPXtvblNlbmR9IG1lc3NhZ2VUZXh0PXttZXNzYWdlVGV4dH1vbk1lc3NhZ2VUZXh0PXtvbk1lc3NhZ2VUZXh0fSAvPlxuICAgIDwvZGl2PlxuICApO1xufVxuZnVuY3Rpb24gZmxvYXRNZXNzYWdlcyh7IG1lc3NhZ2VzLCB1c2VybmFtZSB9KSB7XG4gIGlmIChtZXNzYWdlcyAmJiBtZXNzYWdlcy5sZW5ndGggPiAwICYmIHVzZXJuYW1lKSB7XG4gICAgcmV0dXJuIG1lc3NhZ2VzLm1hcCgobXNnKSA9PiB7XG4gICAgICBpZiAobXNnLnVzZXJuYW1lID09PSB1c2VybmFtZSkge1xuICAgICAgICByZXR1cm4geyAuLi5tc2csIGZsb2F0OiAncmlnaHQnLCB1c2VybmFtZTogJ21lJyB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHsgLi4ubXNnLCBmbG9hdDogJ2xlZnQnIH07XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cbmZ1bmN0aW9uIHNvcnRNZXNzYWdlcyh7IG1lc3NhZ2VzIH0pIHtcbiAgaWYgKG1lc3NhZ2VzKSB7XG4gICAgcmV0dXJuIG1lc3NhZ2VzLnNvcnQoKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyBNZXNzYWdlcyB9IGZyb20gJy4uL3VpL01lc3NhZ2VzJztcbmltcG9ydCB7IExheW91dCB9IGZyb20gJy4vTGF5b3V0JztcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEhhbmdjaGF0KHtcbiAgbWVzc2FnZXMgPSBbXSxcbiAgb25NZXNzYWdlVGV4dCxcbiAgb25NZXNzYWdlLFxuICBtZXNzYWdlVGV4dCxcbiAgdXNlcm5hbWVcbn0pIHtcbiAgcmV0dXJuIChcbiAgICA8TGF5b3V0IGlkPVwiaGFuZ2NoYXQtdWlcIj5cbiAgICAgIDxNZXNzYWdlc1xuICAgICAgICBtZXNzYWdlcz17bWVzc2FnZXN9XG4gICAgICAgIG9uTWVzc2FnZT17b25NZXNzYWdlfVxuICAgICAgICBvbk1lc3NhZ2VUZXh0PXtvbk1lc3NhZ2VUZXh0fVxuICAgICAgICBtZXNzYWdlVGV4dFxuICAgICAgICB1c2VybmFtZT17dXNlcm5hbWV9XG4gICAgICAvPlxuICAgIDwvTGF5b3V0PlxuICApO1xufVxuIl0sIm5hbWVzIjpbInN0eWxlcyIsInJvb3QiLCJkaXNwbGF5IiwiYWxpZ25JdGVtcyIsImlucHV0IiwiTWVzc2FnZUVkaXRvciIsIm1lc3NhZ2VUZXh0Iiwib25NZXNzYWdlVGV4dCIsIm9uTWVzc2FnZSIsIm1lc3NhZ2VDb250YWluZXIiLCJ3aWR0aCIsImhlaWdodCIsIm92ZXJmbG93IiwiTWVzc2FnZXMiLCJtZXNzYWdlcyIsInVzZXJuYW1lIiwic2Nyb2xsZXJSZWYiLCJ1c2VSZWYiLCJvblNlbmQiLCJlIiwiY3VycmVudCIsInNjcm9sbFRvcCIsInNjcm9sbEhlaWdodCIsImxlbmd0aCIsImZsb2F0TWVzc2FnZXMiLCJzb3J0TWVzc2FnZXMiLCJtYXAiLCJtIiwibXNnIiwiZmxvYXQiLCJzb3J0IiwiSGFuZ2NoYXQiXSwibWFwcGluZ3MiOiI7Ozs7O0FBR0EsTUFBTUEsTUFBTSxHQUFHO0FBQ2JDLEVBQUFBLElBQUksRUFBRTtBQUNKQyxJQUFBQSxPQUFPLEVBQUUsTUFETDtBQUVKQyxJQUFBQSxVQUFVLEVBQUU7QUFGUixHQURPO0FBS2JDLEVBQUFBLEtBQUssRUFBRTtBQUFBO0FBTE0sQ0FBZjtBQVNPLFNBQVNDLGFBQVQsQ0FBdUI7QUFBRUMsRUFBQUEsV0FBRjtBQUFlQyxFQUFBQSxhQUFmO0FBQThCQyxFQUFBQTtBQUE5QixDQUF2QixFQUFrRTtBQUN2RSxTQUNFO0FBQUssSUFBQSxLQUFLLEVBQUVSLE1BQU0sQ0FBQ0M7QUFBbkIsS0FDRTtBQUFPLElBQUEsSUFBSSxFQUFDLE1BQVo7QUFBbUIsSUFBQSxRQUFRLEVBQUVNLGFBQTdCO0FBQTZDLG1CQUFZO0FBQXpE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
