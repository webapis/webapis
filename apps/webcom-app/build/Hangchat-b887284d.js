import { a as h, E as d } from './index-b06e1a84.js';
import { T as TextInput } from './TextInput-b9f3d178.js';
import { B as Button } from './Button-9969c05b.js';
import { L as Layout } from './Layout-f4e41278.js';
import { M as Message } from './Message-ecdfaf58.js';

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
  }, h(TextInput, {
    onChange: onMessageText,
    value: messageText
  }), h("div", null, h(Button, {
    title: "send",
    onClick: onMessage
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
  username
}) {
  const scrollerRef = d(null);

  function onSend() {
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
    onMessage: onSend
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGFuZ2NoYXQtYjg4NzI4NGQuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy91aS9NZXNzYWdlRWRpdG9yLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3VpL01lc3NhZ2VzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlLXVpL0hhbmdjaGF0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgVGV4dElucHV0IH0gZnJvbSAnLi4vLi4vbGF5b3V0L1RleHRJbnB1dCc7XG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tICcuLi8uLi9sYXlvdXQvQnV0dG9uJztcbmNvbnN0IHN0eWxlcyA9IHtcbiAgcm9vdDoge1xuICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgfSxcbiAgaW5wdXQ6IHtcbiAgICAvL21hcmdpbjowXG4gIH0sXG59O1xuZXhwb3J0IGZ1bmN0aW9uIE1lc3NhZ2VFZGl0b3IoeyBtZXNzYWdlVGV4dCwgb25NZXNzYWdlVGV4dCwgb25NZXNzYWdlIH0pIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXtzdHlsZXMucm9vdH0+XG4gICAgICA8VGV4dElucHV0IG9uQ2hhbmdlPXtvbk1lc3NhZ2VUZXh0fSB2YWx1ZT17bWVzc2FnZVRleHR9IC8+XG4gICAgICA8ZGl2PlxuICAgICAgICA8QnV0dG9uIHRpdGxlPVwic2VuZFwiIG9uQ2xpY2s9e29uTWVzc2FnZX0vPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7dXNlUmVmfSBmcm9tICdwcmVhY3QvaG9va3MnXG5pbXBvcnQgeyBNZXNzYWdlIH0gZnJvbSAnLi9NZXNzYWdlJztcbmltcG9ydCB7TWVzc2FnZUVkaXRvcn0gZnJvbSAnLi9NZXNzYWdlRWRpdG9yJ1xuY29uc3Qgc3R5bGVzID0ge1xuICBtZXNzYWdlQ29udGFpbmVyOiB7XG4gICAgd2lkdGg6ICcxMDAlJyxcbiAgICAvLyBiYWNrZ3JvdW5kQ29sb3I6ICdvcmFuZ2UnLFxuICAgIGhlaWdodDogJzIwdmgnLFxuICAgIG92ZXJmbG93OiAnYXV0bycsXG4gIH0sXG59O1xuZXhwb3J0IGZ1bmN0aW9uIE1lc3NhZ2VzKHsgbWVzc2FnZXMsIHVzZXJuYW1lIH0pIHtcbiAgICBjb25zdCBzY3JvbGxlclJlZiA9IHVzZVJlZihudWxsKTtcbiAgICBmdW5jdGlvbiBvblNlbmQoKXtcbiAgICAgICAgc2Nyb2xsZXJSZWYuY3VycmVudC5zY3JvbGxUb3AgPSBzY3JvbGxlclJlZi5jdXJyZW50LnNjcm9sbEhlaWdodDtcbiAgICB9XG4gIHJldHVybiAoXG4gICAgICA8ZGl2PlxuXG4gICBcbiAgICA8ZGl2IHN0eWxlPXtzdHlsZXMubWVzc2FnZUNvbnRhaW5lcn0gcmVmPXtzY3JvbGxlclJlZn0+XG4gICAgICB7bWVzc2FnZXMgJiYgbWVzc2FnZXMubGVuZ3RoPjAgJiYgZmxvYXRNZXNzYWdlcyh7IG1lc3NhZ2VzOiBzb3J0TWVzc2FnZXMoeyBtZXNzYWdlcyB9KSwgdXNlcm5hbWUgfSkubWFwKFxuICAgICAgICAobSkgPT4gKFxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnIH19PlxuICAgICAgICAgICAgeycgJ31cbiAgICAgICAgICAgIDxNZXNzYWdlIG1lc3NhZ2U9e219IC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIClcbiAgICAgICl9XG4gICAgICBcbiAgICA8L2Rpdj5cbiAgICA8TWVzc2FnZUVkaXRvciBvbk1lc3NhZ2U9e29uU2VuZH0vPlxuICAgICAgIDwvZGl2PlxuICApO1xufVxuZnVuY3Rpb24gZmxvYXRNZXNzYWdlcyh7IG1lc3NhZ2VzLCB1c2VybmFtZSB9KSB7XG4gIGlmIChtZXNzYWdlcyAmJiBtZXNzYWdlcy5sZW5ndGg+MCAmJiB1c2VybmFtZSkge1xuICAgIHJldHVybiBtZXNzYWdlcy5tYXAoKG1zZykgPT4ge1xuICAgICAgaWYgKG1zZy51c2VybmFtZSA9PT0gdXNlcm5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHsgLi4ubXNnLCBmbG9hdDogJ3JpZ2h0JywgdXNlcm5hbWU6ICdtZScgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7IC4uLm1zZywgZmxvYXQ6ICdsZWZ0JyB9O1xuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cbmZ1bmN0aW9uIHNvcnRNZXNzYWdlcyh7IG1lc3NhZ2VzIH0pIHtcbiAgaWYgKG1lc3NhZ2VzKSB7XG4gICAgcmV0dXJuIG1lc3NhZ2VzLnNvcnQoKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbnVsbFxuICB9XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IE1lc3NhZ2VzIH0gZnJvbSAnLi4vdWkvTWVzc2FnZXMnO1xuaW1wb3J0IHsgTGF5b3V0IH0gZnJvbSAnLi9MYXlvdXQnO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSGFuZ2NoYXQoe1xuICBtZXNzYWdlcyA9IFtdLFxuICBvbk1lc3NhZ2VUZXh0LFxuICBvbk1lc3NhZ2UsXG4gIG1lc3NhZ2VUZXh0LFxuICB1c2VybmFtZVxufSkge1xuICByZXR1cm4gKFxuICAgIDxMYXlvdXQgaWQ9XCJoYW5nY2hhdC11aVwiPlxuICAgICAgPE1lc3NhZ2VzXG4gICAgICAgIG1lc3NhZ2VzPXttZXNzYWdlc31cbiAgICAgICAgb25NZXNzYWdlPXtvbk1lc3NhZ2V9XG4gICAgICAgIG9uTWVzc2FnZVRleHQ9e29uTWVzc2FnZVRleHR9XG4gICAgICAgIG1lc3NhZ2VUZXh0XG4gICAgICAgIHVzZXJuYW1lPXt1c2VybmFtZX1cbiAgICAgIC8+XG4gICAgPC9MYXlvdXQ+XG4gICk7XG59XG4iXSwibmFtZXMiOlsic3R5bGVzIiwicm9vdCIsImRpc3BsYXkiLCJhbGlnbkl0ZW1zIiwiaW5wdXQiLCJNZXNzYWdlRWRpdG9yIiwibWVzc2FnZVRleHQiLCJvbk1lc3NhZ2VUZXh0Iiwib25NZXNzYWdlIiwibWVzc2FnZUNvbnRhaW5lciIsIndpZHRoIiwiaGVpZ2h0Iiwib3ZlcmZsb3ciLCJNZXNzYWdlcyIsIm1lc3NhZ2VzIiwidXNlcm5hbWUiLCJzY3JvbGxlclJlZiIsInVzZVJlZiIsIm9uU2VuZCIsImN1cnJlbnQiLCJzY3JvbGxUb3AiLCJzY3JvbGxIZWlnaHQiLCJsZW5ndGgiLCJmbG9hdE1lc3NhZ2VzIiwic29ydE1lc3NhZ2VzIiwibWFwIiwibSIsIm1zZyIsImZsb2F0Iiwic29ydCIsIkhhbmdjaGF0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFHQSxNQUFNQSxNQUFNLEdBQUc7QUFDYkMsRUFBQUEsSUFBSSxFQUFFO0FBQ0pDLElBQUFBLE9BQU8sRUFBRSxNQURMO0FBRUpDLElBQUFBLFVBQVUsRUFBRTtBQUZSLEdBRE87QUFLYkMsRUFBQUEsS0FBSyxFQUFFO0FBQUE7QUFMTSxDQUFmO0FBU08sU0FBU0MsYUFBVCxDQUF1QjtBQUFFQyxFQUFBQSxXQUFGO0FBQWVDLEVBQUFBLGFBQWY7QUFBOEJDLEVBQUFBO0FBQTlCLENBQXZCLEVBQWtFO0FBQ3ZFLFNBQ0U7QUFBSyxJQUFBLEtBQUssRUFBRVIsTUFBTSxDQUFDQztBQUFuQixLQUNFLEVBQUMsU0FBRDtBQUFXLElBQUEsUUFBUSxFQUFFTSxhQUFyQjtBQUFvQyxJQUFBLEtBQUssRUFBRUQ7QUFBM0MsSUFERixFQUVFLGVBQ0UsRUFBQyxNQUFEO0FBQVEsSUFBQSxLQUFLLEVBQUMsTUFBZDtBQUFxQixJQUFBLE9BQU8sRUFBRUU7QUFBOUIsSUFERixDQUZGLENBREY7QUFRRDs7QUNqQkQsTUFBTVIsUUFBTSxHQUFHO0FBQ2JTLEVBQUFBLGdCQUFnQixFQUFFO0FBQ2hCQyxJQUFBQSxLQUFLLEVBQUUsTUFEUztBQUVoQjtBQUNBQyxJQUFBQSxNQUFNLEVBQUUsTUFIUTtBQUloQkMsSUFBQUEsUUFBUSxFQUFFO0FBSk07QUFE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
