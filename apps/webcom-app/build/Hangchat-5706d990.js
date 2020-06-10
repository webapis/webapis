import { h, x as d } from './index-3d395169.js';
import { B as Button } from './Button-927a87fd.js';
import { L as Layout } from './Layout-8b1706e2.js';
import { M as Message } from './Message-1453a718.js';

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
  onMessage,
  onMessageText,
  messageText,
  username
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGFuZ2NoYXQtNTcwNmQ5OTAuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy91aS9NZXNzYWdlRWRpdG9yLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3VpL01lc3NhZ2VzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlLXVpL0hhbmdjaGF0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgVGV4dElucHV0IH0gZnJvbSAnLi4vLi4vbGF5b3V0L1RleHRJbnB1dCc7XG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tICcuLi8uLi9sYXlvdXQvQnV0dG9uJztcbmNvbnN0IHN0eWxlcyA9IHtcbiAgcm9vdDoge1xuICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgfSxcbiAgaW5wdXQ6IHtcbiAgICAvL21hcmdpbjowXG4gIH0sXG59O1xuZXhwb3J0IGZ1bmN0aW9uIE1lc3NhZ2VFZGl0b3IoeyBtZXNzYWdlVGV4dCwgb25NZXNzYWdlVGV4dCwgb25NZXNzYWdlIH0pIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXtzdHlsZXMucm9vdH0+XG4gICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBvbkNoYW5nZT17b25NZXNzYWdlVGV4dH0gIGRhdGEtdGVzdGlkPVwibWVzc2FnZS1pbnB1dFwiLz5cbiAgICAgIDxkaXY+XG4gICAgICAgIDxCdXR0b24gdGl0bGU9XCJzZW5kXCIgaWQ9J01FU1NBR0UnIG9uQ2xpY2s9e29uTWVzc2FnZX0gZGF0YS10ZXN0aWQ9J3NlbmQtYnRuJy8+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgdXNlUmVmIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcbmltcG9ydCB7IE1lc3NhZ2UgfSBmcm9tICcuL01lc3NhZ2UnO1xuaW1wb3J0IHsgTWVzc2FnZUVkaXRvciB9IGZyb20gJy4vTWVzc2FnZUVkaXRvcic7XG5jb25zdCBzdHlsZXMgPSB7XG4gIG1lc3NhZ2VDb250YWluZXI6IHtcbiAgICB3aWR0aDogJzEwMCUnLFxuICAgIC8vIGJhY2tncm91bmRDb2xvcjogJ29yYW5nZScsXG4gICAgaGVpZ2h0OiAnMjB2aCcsXG4gICAgb3ZlcmZsb3c6ICdhdXRvJyxcbiAgfSxcbn07XG5leHBvcnQgZnVuY3Rpb24gTWVzc2FnZXMoe1xuICBtZXNzYWdlcyxcbiAgb25NZXNzYWdlLFxuICBvbk1lc3NhZ2VUZXh0LFxuICBtZXNzYWdlVGV4dCxcbiAgdXNlcm5hbWUsXG59KSB7XG4gIGNvbnN0IHNjcm9sbGVyUmVmID0gdXNlUmVmKG51bGwpO1xuICBmdW5jdGlvbiBvblNlbmQoZSkge1xuICAgIG9uTWVzc2FnZShlKTtcbiAgICBzY3JvbGxlclJlZi5jdXJyZW50LnNjcm9sbFRvcCA9IHNjcm9sbGVyUmVmLmN1cnJlbnQuc2Nyb2xsSGVpZ2h0O1xuICB9XG4gIHJldHVybiAoXG4gICAgPGRpdj5cbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlcy5tZXNzYWdlQ29udGFpbmVyfSByZWY9e3Njcm9sbGVyUmVmfT5cbiAgICAgICAge21lc3NhZ2VzICYmXG4gICAgICAgICAgbWVzc2FnZXMubGVuZ3RoID4gMCAmJlxuICAgICAgICAgIGZsb2F0TWVzc2FnZXMoeyBtZXNzYWdlczogc29ydE1lc3NhZ2VzKHsgbWVzc2FnZXMgfSksIHVzZXJuYW1lIH0pLm1hcChcbiAgICAgICAgICAgIChtKSA9PiAoXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnIH19PlxuICAgICAgICAgICAgICAgIHsnICd9XG4gICAgICAgICAgICAgICAgPE1lc3NhZ2UgbWVzc2FnZT17bX0gLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApXG4gICAgICAgICAgKX1cbiAgICAgIDwvZGl2PlxuICAgICAgPE1lc3NhZ2VFZGl0b3JcbiAgICAgICAgb25NZXNzYWdlPXtvblNlbmR9XG4gICAgICAgIG1lc3NhZ2VUZXh0PXttZXNzYWdlVGV4dH1cbiAgICAgICAgb25NZXNzYWdlVGV4dD17b25NZXNzYWdlVGV4dH1cbiAgICAgIC8+XG4gICAgPC9kaXY+XG4gICk7XG59XG5mdW5jdGlvbiBmbG9hdE1lc3NhZ2VzKHsgbWVzc2FnZXMsIHVzZXJuYW1lIH0pIHtcbiAgaWYgKG1lc3NhZ2VzICYmIG1lc3NhZ2VzLmxlbmd0aCA+IDAgJiYgdXNlcm5hbWUpIHtcbiAgICByZXR1cm4gbWVzc2FnZXMubWFwKChtc2cpID0+IHtcbiAgICAgIGlmIChtc2cudXNlcm5hbWUgPT09IHVzZXJuYW1lKSB7XG4gICAgICAgIHJldHVybiB7IC4uLm1zZywgZmxvYXQ6ICdyaWdodCcsIHVzZXJuYW1lOiAnbWUnIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4geyAuLi5tc2csIGZsb2F0OiAnbGVmdCcgfTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuZnVuY3Rpb24gc29ydE1lc3NhZ2VzKHsgbWVzc2FnZXMgfSkge1xuICBpZiAobWVzc2FnZXMpIHtcbiAgICByZXR1cm4gbWVzc2FnZXMuc29ydCgpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IE1lc3NhZ2VzIH0gZnJvbSAnLi4vdWkvTWVzc2FnZXMnO1xuaW1wb3J0IHsgTGF5b3V0IH0gZnJvbSAnLi9MYXlvdXQnO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSGFuZ2NoYXQoe1xuICBtZXNzYWdlcyA9IFtdLFxuICBvbk1lc3NhZ2VUZXh0LFxuICBvbk1lc3NhZ2UsXG4gIG1lc3NhZ2VUZXh0LFxuICB1c2VybmFtZVxufSkge1xuICByZXR1cm4gKFxuICAgIDxMYXlvdXQgaWQ9XCJoYW5nY2hhdC11aVwiPlxuICAgICAgPE1lc3NhZ2VzXG4gICAgICAgIG1lc3NhZ2VzPXttZXNzYWdlc31cbiAgICAgICAgb25NZXNzYWdlPXtvbk1lc3NhZ2V9XG4gICAgICAgIG9uTWVzc2FnZVRleHQ9e29uTWVzc2FnZVRleHR9XG4gICAgICAgIG1lc3NhZ2VUZXh0XG4gICAgICAgIHVzZXJuYW1lPXt1c2VybmFtZX1cbiAgICAgIC8+XG4gICAgPC9MYXlvdXQ+XG4gICk7XG59XG4iXSwibmFtZXMiOlsic3R5bGVzIiwicm9vdCIsImRpc3BsYXkiLCJhbGlnbkl0ZW1zIiwiaW5wdXQiLCJNZXNzYWdlRWRpdG9yIiwibWVzc2FnZVRleHQiLCJvbk1lc3NhZ2VUZXh0Iiwib25NZXNzYWdlIiwibWVzc2FnZUNvbnRhaW5lciIsIndpZHRoIiwiaGVpZ2h0Iiwib3ZlcmZsb3ciLCJNZXNzYWdlcyIsIm1lc3NhZ2VzIiwidXNlcm5hbWUiLCJzY3JvbGxlclJlZiIsInVzZVJlZiIsIm9uU2VuZCIsImUiLCJjdXJyZW50Iiwic2Nyb2xsVG9wIiwic2Nyb2xsSGVpZ2h0IiwibGVuZ3RoIiwiZmxvYXRNZXNzYWdlcyIsInNvcnRNZXNzYWdlcyIsIm1hcCIsIm0iLCJtc2ciLCJmbG9hdCIsInNvcnQiLCJIYW5nY2hhdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFHQSxNQUFNQSxNQUFNLEdBQUc7QUFDYkMsRUFBQUEsSUFBSSxFQUFFO0FBQ0pDLElBQUFBLE9BQU8sRUFBRSxNQURMO0FBRUpDLElBQUFBLFVBQVUsRUFBRTtBQUZSLEdBRE87QUFLYkMsRUFBQUEsS0FBSyxFQUFFO0FBQUE7QUFMTSxDQUFmO0FBU08sU0FBU0MsYUFBVCxDQUF1QjtBQUFFQyxFQUFBQSxXQUFGO0FBQWVDLEVBQUFBLGFBQWY7QUFBOEJDLEVBQUFBO0FBQTlCLENBQXZCLEVBQWtFO0FBQ3ZFLFNBQ0U7QUFBSyxJQUFBLEtBQUssRUFBRVIsTUFBTSxDQUFDQztBQUFuQixLQUNFO0FBQU8sSUFBQSxJQUFJLEVBQUMsTUFBWjtBQUFtQixJQUFB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
