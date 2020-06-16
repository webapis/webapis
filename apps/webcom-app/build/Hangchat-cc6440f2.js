import { h, x as d, l } from './index-c0ddbc60.js';
import { B as Button } from './Button-15906247.js';
import { L as Layout } from './Layout-68ee1bdb.js';
import { M as Message } from './Message-6be65deb.js';

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
  onMessage
}) {
  return h("div", {
    style: styles.root
  }, h("input", {
    style: styles.input,
    type: "text",
    onChange: onMessageText,
    "data-testid": "message-input"
  }), h("div", null, h(Button, {
    style: styles.btn,
    title: "send",
    id: "MESSAGE",
    onClick: onMessage,
    "data-testid": "send-btn"
  })));
}

const styles$1 = {
  messageContainer: {
    // width: '100%',
    boxSizing: 'border-box',
    padding: 3,
    backgroundColor: 'orange',
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
  username
}) {
  const scrollerRef = d(null);
  l(() => {
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
  }, ' ', h(Message, {
    message: m
  })))), h("div", {
    style: {
      flex: 1
    }
  }, h(MessageEditor, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGFuZ2NoYXQtY2M2NDQwZjIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy91aS9NZXNzYWdlRWRpdG9yLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3VpL01lc3NhZ2VzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlLXVpL0hhbmdjaGF0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgVGV4dElucHV0IH0gZnJvbSAnLi4vLi4vbGF5b3V0L1RleHRJbnB1dCc7XG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tICcuLi8uLi9sYXlvdXQvQnV0dG9uJztcbmNvbnN0IHN0eWxlcyA9IHtcbiAgcm9vdDoge1xuICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgfSxcbiAgaW5wdXQ6IHtcbiAgICAvL21hcmdpbjowXG4gICAgcGFkZGluZzogNSxcbiAgICBtYXJnaW5MZWZ0OiA4LFxuICAgIG1hcmdpblJpZ2h0OiA4LFxuICAgIG1hcmdpblRvcDogOCxcbiAgICBtYXJnaW5Cb3R0b206IDgsXG4gICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXG4gICAgZmxleDogMSxcbiAgICBcbiAgfSxcbiAgYnRuOntcbiAgICBwYWRkaW5nOiA4LFxuXG4gICAgbWFyZ2luUmlnaHQ6IDE2LFxuICAgIG1hcmdpblRvcDogOCxcbiAgICBtYXJnaW5Cb3R0b206IDgsXG4gICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXG4gICAgZmxleDogMSxcbiAgfVxufTtcbmV4cG9ydCBmdW5jdGlvbiBNZXNzYWdlRWRpdG9yKHsgbWVzc2FnZVRleHQsIG9uTWVzc2FnZVRleHQsIG9uTWVzc2FnZSB9KSB7XG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17c3R5bGVzLnJvb3R9PlxuICAgICBcbiAgICAgIDxpbnB1dCBzdHlsZT17c3R5bGVzLmlucHV0fSAgdHlwZT1cInRleHRcIiBvbkNoYW5nZT17b25NZXNzYWdlVGV4dH0gIGRhdGEtdGVzdGlkPVwibWVzc2FnZS1pbnB1dFwiLz5cbiAgICAgIFxuICAgICAgXG4gICAgICA8ZGl2PlxuICAgICAgICA8QnV0dG9uICBzdHlsZT17c3R5bGVzLmJ0bn0gIHRpdGxlPVwic2VuZFwiIGlkPSdNRVNTQUdFJyBvbkNsaWNrPXtvbk1lc3NhZ2V9IGRhdGEtdGVzdGlkPSdzZW5kLWJ0bicvPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IHVzZVJlZiwgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcbmltcG9ydCB7IE1lc3NhZ2UgfSBmcm9tICcuL01lc3NhZ2UnO1xuaW1wb3J0IHsgTWVzc2FnZUVkaXRvciB9IGZyb20gJy4vTWVzc2FnZUVkaXRvcic7XG5jb25zdCBzdHlsZXMgPSB7XG4gIG1lc3NhZ2VDb250YWluZXI6IHtcbiAgIC8vIHdpZHRoOiAnMTAwJScsXG4gICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcbiAgIHBhZGRpbmc6MyxcbiAgICAgYmFja2dyb3VuZENvbG9yOiAnb3JhbmdlJyxcbiAgICBmbGV4OjE1LFxuICAgIG92ZXJmbG93WTogJ2F1dG8nLFxuICAgIG92ZXJmbG93WDogXCJoaWRkZW5cIlxuICAgIFxuICB9LFxufTtcbmV4cG9ydCBmdW5jdGlvbiBNZXNzYWdlcyh7XG4gIG1lc3NhZ2VzLFxuICBvbk1lc3NhZ2UsXG4gIG9uTWVzc2FnZVRleHQsXG4gIG1lc3NhZ2VUZXh0LFxuICB1c2VybmFtZSxcbn0pIHtcbiAgY29uc3Qgc2Nyb2xsZXJSZWYgPSB1c2VSZWYobnVsbCk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAobWVzc2FnZXMpIHtcbiAgICAgIHNjcm9sbGVyUmVmLmN1cnJlbnQuc2Nyb2xsVG9wID0gc2Nyb2xsZXJSZWYuY3VycmVudC5zY3JvbGxIZWlnaHQ7XG4gICAgfVxuICB9LCBbbWVzc2FnZXNdKTtcblxuICBmdW5jdGlvbiBvblNlbmQoZSkge1xuICAgIG9uTWVzc2FnZShlKTtcbiAgICBzY3JvbGxlclJlZi5jdXJyZW50LnNjcm9sbFRvcCA9IHNjcm9sbGVyUmVmLmN1cnJlbnQuc2Nyb2xsSGVpZ2h0O1xuICB9XG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17eyAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsd2lkdGg6JzEwMCUnLGhlaWdodDonMTAwJScsIGRpc3BsYXk6J2ZsZXgnLGZsZXhEaXJlY3Rpb246J2NvbHVtbicscGFkZGluZ1RvcDo2OH19PlxuICAgICAgPGRpdiBzdHlsZT17c3R5bGVzLm1lc3NhZ2VDb250YWluZXJ9IHJlZj17c2Nyb2xsZXJSZWZ9PlxuICAgICAgICB7bWVzc2FnZXMgJiZcbiAgICAgICAgICBtZXNzYWdlcy5sZW5ndGggPiAwICYmXG4gICAgICAgICAgZmxvYXRNZXNzYWdlcyh7IG1lc3NhZ2VzOiBzb3J0TWVzc2FnZXMoeyBtZXNzYWdlcyB9KSwgdXNlcm5hbWUgfSkubWFwKFxuICAgICAgICAgICAgKG0pID0+IChcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcgfX0+XG4gICAgICAgICAgICAgICAgeycgJ31cbiAgICAgICAgICAgICAgICA8TWVzc2FnZSBtZXNzYWdlPXttfSAvPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIClcbiAgICAgICAgICApfVxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IHN0eWxlPXt7ZmxleDoxfX0+XG4gICAgICA8TWVzc2FnZUVkaXRvclxuICAgICAgICBvbk1lc3NhZ2U9e29uU2VuZH1cbiAgICAgICAgbWVzc2FnZVRleHQ9e21lc3NhZ2VUZXh0fVxuICAgICAgICBvbk1lc3NhZ2VUZXh0PXtvbk1lc3NhZ2VUZXh0fVxuICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgXG4gICAgPC9kaXY+XG4gICk7XG59XG5mdW5jdGlvbiBmbG9hdE1lc3NhZ2VzKHsgbWVzc2FnZXMsIHVzZXJuYW1lIH0pIHtcbiAgaWYgKG1lc3NhZ2VzICYmIG1lc3NhZ2VzLmxlbmd0aCA+IDAgJiYgdXNlcm5hbWUpIHtcbiAgICByZXR1cm4gbWVzc2FnZXMubWFwKChtc2cpID0+IHtcbiAgICAgIGlmIChtc2cudXNlcm5hbWUgPT09IHVzZXJuYW1lKSB7XG4gICAgICAgIHJldHVybiB7IC4uLm1zZywgZmxvYXQ6ICdyaWdodCcsIHVzZXJuYW1lOiAnbWUnIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4geyAuLi5tc2csIGZsb2F0OiAnbGVmdCcgfTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuZnVuY3Rpb24gc29ydE1lc3NhZ2VzKHsgbWVzc2FnZXMgfSkge1xuICBpZiAobWVzc2FnZXMpIHtcbiAgICByZXR1cm4gbWVzc2FnZXMuc29ydCgpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IE1lc3NhZ2VzIH0gZnJvbSAnLi4vdWkvTWVzc2FnZXMnO1xuaW1wb3J0IHsgTGF5b3V0IH0gZnJvbSAnLi9MYXlvdXQnO1xuXG5cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSGFuZ2NoYXQoe1xuICBtZXNzYWdlcyA9IFtdLFxuICBvbk1lc3NhZ2VUZXh0LFxuICBvbk1lc3NhZ2UsXG4gIG1lc3NhZ2VUZXh0LFxuICB1c2VybmFtZVxufSkge1xuICByZXR1cm4gKFxuICAgIDxMYXlvdXQgaWQ9XCJoYW5nY2hhdC11aVwiID5cbiAgICAgIDxNZXNzYWdlc1xuICAgICAgICBtZXNzYWdlcz17bWVzc2FnZXN9XG4gICAgICAgIG9uTWVzc2FnZT17b25NZXNzYWdlfVxuICAgICAgICBvbk1lc3NhZ2VUZXh0PXtvbk1lc3NhZ2VUZXh0fVxuICAgICAgICBtZXNzYWdlVGV4dFxuICAgICAgICB1c2VybmFtZT17dXNlcm5hbWV9XG4gICAgICAvPlxuICAgIDwvTGF5b3V0PlxuICApO1xufVxuIl0sIm5hbWVzIjpbInN0eWxlcyIsInJvb3QiLCJkaXNwbGF5IiwiYWxpZ25JdGVtcyIsImlucHV0IiwicGFkZGluZyIsIm1hcmdpbkxlZnQiLCJtYXJnaW5SaWdodCIsIm1hcmdpblRvcCIsIm1hcmdpbkJvdHRvbSIsImJveFNpemluZyIsImZsZXgiLCJidG4iLCJNZXNzYWdlRWRpdG9yIiwibWVzc2FnZVRleHQiLCJvbk1lc3NhZ2VUZXh0Iiwib25NZXNzYWdlIiwibWVzc2FnZUNvbnRhaW5lciIsImJhY2tncm91bmRDb2xvciIsIm92ZXJmbG93WSIsIm92ZXJmbG93WCIsIk1lc3NhZ2VzIiwibWVzc2FnZXMiLCJ1c2VybmFtZSIsInNjcm9sbGVyUmVmIiwidXNlUmVmIiwidXNlRWZmZWN0IiwiY3VycmVudCIsInNjcm9sbFRvcCIsInNjcm9sbEhlaWdodCIsIm9uU2VuZCIsImUiLCJ3aWR0aCIsImhlaWdodCIsImZsZXhEaXJlY3Rpb24iLCJwYWRkaW5nVG9wIiwibGVuZ3RoIiwiZmxvYXRNZXNzYWdlcyIsInNvcnRNZXNzYWdlcyIsIm1hcCIsIm0iLCJtc2ciLCJmbG9hdCIsInNvcnQiLCJIYW5nY2hhdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFHQSxNQUFNQSxNQUFNLEdBQUc7QUFDYkMsRUFBQUEsSUFBSSxFQUFFO0FBQ0pDLElBQUFBLE9BQU8sRUFBRSxNQURMO0FBRUpDLElBQUFBLFVBQVUsRUFBRTtBQUZSLEdBRE87QUFLYkMsRUFBQUEsS0FBSyxFQUFFO0FBQ0w7QUFDQUMsSUFBQUEsT0FBTyxFQUFFLENBRko7QUFHTEMsSUFBQUEsVUFBVSxFQUFFLENBSFA7QUFJTEMsSUFBQUEsV0FBVyxFQUFFLENBSlI7QUFLTEMsSUFBQUEsU0FBUyxFQUFFLENBTE47QUFNTEMsSUFBQUEsWUFBWSxFQUFFLENBTlQ7QUFPTEMsSUFBQUEsU0FBUyxFQUFFLFlBUE47QUFRTEMsSUFB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
