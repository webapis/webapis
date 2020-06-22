import { s as styleInject, j as v, b as useMediaQuery, p, h } from './index-3ebec559.js';

var css_248z = ".message-font-phone-size {\r\n  font-size: 10px;\r\n}\r\n\r\n.message-font-tablet-size {\r\n  font-size: 15px;\r\n}\r\n\r\n.font-laptop-size {\r\n  font-size: 20px;\r\n}\r\n\r\n.message-font-desktop-size {\r\n  font-size: 30px;\r\n}";
styleInject(css_248z);

const style = {
  root: {
    borderColor: '#eeeeee',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 5,
    padding: 3,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: 35,
    backgroundColor: 'white'
  },
  username: {
    marginRight: 8
  },
  log: {
    display: 'flex',
    color: '#737373',
    fontSize: 10
  },
  message: {}
}; //

function Message(props) {
  const {
    message
  } = props;
  const {
    float,
    username,
    timestamp
  } = message;
  const [days, setDays] = v(0);
  const [hours, setHours] = v(0);
  const [minutes, setMinutes] = v(0);
  const [seconds, setSeconds] = v(0);
  const {
    device
  } = useMediaQuery();

  function convertMS(ms) {
    var d, h, m, s;
    s = Math.floor(ms / 1000);
    m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;
    d = Math.floor(h / 24);
    h = h % 24;
    setDays(d);
    setHours(h);
    setMinutes(m);
    setSeconds(s);
  }

  p(() => {
    if (timestamp) {
      setTimeout(() => {
        convertMS(Date.now() - timestamp);
      }, 0);
      setInterval(() => {
        convertMS(Date.now() - timestamp);
      }, 60000);
      debugger;
    }
  }, [timestamp]);
  return h("div", {
    style: {
      width: '100%',
      marginBottom: 3
    }
  }, h("div", {
    style: { ...style.root,
      float
    }
  }, h("div", {
    "data-testid": "message",
    style: style.message,
    className: `message-font-${device}-size`
  }, message && message.text), h("div", {
    style: style.log
  }, h("div", {
    style: style.username
  }, username && username, ":"), h("div", null, minutes, minutes === 0 && h("div", null, "Now"), hours === 0 && minutes > 0 && h("div", null, minutes, " minutes ago "), hours > 0 && days === 0 && h("div", null, hours, " hours ", minutes, " minutes ago", ' '), days <= 10 && days > 1 && h("div", null, days, " days ago"), days > 10 && new Date(message.timestamp)))));
}

export { Message as M };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWVzc2FnZS0zMTA5YWNhYS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL21lc3NhZ2UtdWkvTWVzc2FnZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IHVzZU1lZGlhUXVlcnkgfSBmcm9tICcuLi8uLi9sYXlvdXQvdXNlTWVkaWFRdWVyeSc7XHJcbmltcG9ydCAnLi9jc3Mvc3R5bGUuY3NzJztcclxuY29uc3Qgc3R5bGUgPSB7XHJcbiAgcm9vdDoge1xyXG4gICAgYm9yZGVyQ29sb3I6ICcjZWVlZWVlJyxcclxuICAgIGJvcmRlclN0eWxlOiAnc29saWQnLFxyXG4gICAgYm9yZGVyV2lkdGg6IDEsXHJcbiAgICBib3JkZXJSYWRpdXM6IDUsXHJcbiAgICBwYWRkaW5nOiAzLFxyXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXHJcbiAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxyXG4gICAgbWluSGVpZ2h0OiAzNSxcclxuICAgIGJhY2tncm91bmRDb2xvcjogJ3doaXRlJyxcclxuICB9LFxyXG4gIHVzZXJuYW1lOiB7IG1hcmdpblJpZ2h0OiA4IH0sXHJcbiAgbG9nOiB7XHJcbiAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICBjb2xvcjogJyM3MzczNzMnLFxyXG4gICAgZm9udFNpemU6IDEwLFxyXG4gIH0sXHJcbiAgbWVzc2FnZToge30sXHJcbn07XHJcbi8vXHJcbmV4cG9ydCBmdW5jdGlvbiBNZXNzYWdlKHByb3BzKSB7XHJcbiAgY29uc3QgeyBtZXNzYWdlIH0gPSBwcm9wcztcclxuICBjb25zdCB7IGZsb2F0LCB1c2VybmFtZSx0aW1lc3RhbXAgfSA9IG1lc3NhZ2U7XHJcbiAgY29uc3QgW2RheXMsIHNldERheXNdID0gdXNlU3RhdGUoMCk7XHJcbiAgY29uc3QgW2hvdXJzLCBzZXRIb3Vyc10gPSB1c2VTdGF0ZSgwKTtcclxuICBjb25zdCBbbWludXRlcywgc2V0TWludXRlc10gPSB1c2VTdGF0ZSgwKTtcclxuICBjb25zdCBbc2Vjb25kcywgc2V0U2Vjb25kc10gPSB1c2VTdGF0ZSgwKTtcclxuICBjb25zdCB7IGRldmljZSB9ID0gdXNlTWVkaWFRdWVyeSgpO1xyXG4gIGZ1bmN0aW9uIGNvbnZlcnRNUyhtcykge1xyXG4gICAgdmFyIGQsIGgsIG0sIHM7XHJcbiAgICBzID0gTWF0aC5mbG9vcihtcyAvIDEwMDApO1xyXG4gICAgbSA9IE1hdGguZmxvb3IocyAvIDYwKTtcclxuICAgIHMgPSBzICUgNjA7XHJcbiAgICBoID0gTWF0aC5mbG9vcihtIC8gNjApO1xyXG4gICAgbSA9IG0gJSA2MDtcclxuICAgIGQgPSBNYXRoLmZsb29yKGggLyAyNCk7XHJcbiAgICBoID0gaCAlIDI0O1xyXG4gICAgc2V0RGF5cyhkKTtcclxuICAgIHNldEhvdXJzKGgpO1xyXG4gICAgc2V0TWludXRlcyhtKTtcclxuICAgIHNldFNlY29uZHMocyk7XHJcbiAgfVxyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYodGltZXN0YW1wKXtcclxuICBcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgY29udmVydE1TKERhdGUubm93KCkgLSB0aW1lc3RhbXApO1xyXG4gICAgICB9LCAwKTtcclxuICAgICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgIGNvbnZlcnRNUyhEYXRlLm5vdygpIC0gdGltZXN0YW1wKTtcclxuICAgICAgfSwgNjAwMDApO1xyXG4gICAgICBkZWJ1Z2dlcjtcclxuXHJcbiAgICB9XHJcbiAgIFxyXG4gIH0sIFt0aW1lc3RhbXBdKTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3sgd2lkdGg6ICcxMDAlJywgbWFyZ2luQm90dG9tOiAzIH19PlxyXG4gICAgICA8ZGl2IHN0eWxlPXt7IC4uLnN0eWxlLnJvb3QsIGZsb2F0IH19PlxyXG4gICAgICAgIDxkaXZcclxuICAgICAgICAgIGRhdGEtdGVzdGlkPVwibWVzc2FnZVwiXHJcbiAgICAgICAgICBzdHlsZT17c3R5bGUubWVzc2FnZX1cclxuICAgICAgICAgIGNsYXNzTmFtZT17YG1lc3NhZ2UtZm9udC0ke2RldmljZX0tc2l6ZWB9XHJcbiAgICAgICAgPlxyXG4gICAgICAgICAge21lc3NhZ2UgJiYgbWVzc2FnZS50ZXh0fVxyXG4gICAgICAgIFxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgc3R5bGU9e3N0eWxlLmxvZ30+XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXtzdHlsZS51c2VybmFtZX0+e3VzZXJuYW1lICYmIHVzZXJuYW1lfTo8L2Rpdj5cclxuICAgICAgICAgIDxkaXY+e21pbnV0ZXN9XHJcbiAgICAgICAgICAgIHttaW51dGVzID09PSAwICYmIDxkaXY+Tm93PC9kaXY+fVxyXG4gICAgICAgICAgICB7aG91cnMgPT09IDAgJiYgbWludXRlcyA+IDAgJiYgPGRpdj57bWludXRlc30gbWludXRlcyBhZ28gPC9kaXY+fVxyXG4gICAgICAgICAgICB7aG91cnMgPiAwICYmIGRheXMgPT09IDAgJiYgKFxyXG4gICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICB7aG91cnN9IGhvdXJzIHttaW51dGVzfSBtaW51dGVzIGFnb3snICd9XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgIHtkYXlzIDw9IDEwICYmIGRheXMgPiAxICYmIDxkaXY+e2RheXN9IGRheXMgYWdvPC9kaXY+fVxyXG4gICAgICAgICAgICB7ZGF5cyA+IDEwICYmIG5ldyBEYXRlKG1lc3NhZ2UudGltZXN0YW1wKX1cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIl0sIm5hbWVzIjpbInN0eWxlIiwicm9vdCIsImJvcmRlckNvbG9yIiwiYm9yZGVyU3R5bGUiLCJib3JkZXJXaWR0aCIsImJvcmRlclJhZGl1cyIsInBhZGRpbmciLCJkaXNwbGF5IiwiZmxleERpcmVjdGlvbiIsImp1c3RpZnlDb250ZW50IiwibWluSGVpZ2h0IiwiYmFja2dyb3VuZENvbG9yIiwidXNlcm5hbWUiLCJtYXJnaW5SaWdodCIsImxvZyIsImNvbG9yIiwiZm9udFNpemUiLCJtZXNzYWdlIiwiTWVzc2FnZSIsInByb3BzIiwiZmxvYXQiLCJ0aW1lc3RhbXAiLCJkYXlzIiwic2V0RGF5cyIsInVzZVN0YXRlIiwiaG91cnMiLCJzZXRIb3VycyIsIm1pbnV0ZXMiLCJzZXRNaW51dGVzIiwic2Vjb25kcyIsInNldFNlY29uZHMiLCJkZXZpY2UiLCJ1c2VNZWRpYVF1ZXJ5IiwiY29udmVydE1TIiwibXMiLCJkIiwiaCIsIm0iLCJzIiwiTWF0aCIsImZsb29yIiwidXNlRWZmZWN0Iiwic2V0VGltZW91dCIsIkRhdGUiLCJub3ciLCJzZXRJbnRlcnZhbCIsIndpZHRoIiwibWFyZ2luQm90dG9tIiwidGV4dCJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFJQSxNQUFNQSxLQUFLLEdBQUc7QUFDWkMsRUFBQUEsSUFBSSxFQUFFO0FBQ0pDLElBQUFBLFdBQVcsRUFBRSxTQURUO0FBRUpDLElBQUFBLFdBQVcsRUFBRSxPQUZUO0FBR0pDLElBQUFBLFdBQVcsRUFBRSxDQUhUO0FBSUpDLElBQUFBLFlBQVksRUFBRSxDQUpWO0FBS0pDLElBQUFBLE9BQU8sRUFBRSxDQUxMO0FBTUpDLElBQUFBLE9BQU8sRUFBRSxNQU5MO0FBT0pDLElBQUFBLGFBQWEsRUFBRSxRQVBYO0FBUUpDLElBQUFBLGNBQWMsRUFBRSxlQVJaO0FBU0pDLElBQUFBLFNBQVMsRUFBRSxFQVRQO0FBVUpDLElBQUFBLGVBQWUsRUFBRTtBQVZiLEdBRE07QUFhWkMsRUFBQUEsUUFBUSxF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
