import { x as m, l, j as h } from './index-51a8ac4e.js';

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
  }
};
function Message(props) {
  const {
    message
  } = props;
  const {
    float,
    username
  } = message;
  const [days, setDays] = m(0);
  const [hours, setHours] = m(0);
  const [minutes, setMinutes] = m(0);
  const [seconds, setSeconds] = m(0);

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

  l(() => {
    setTimeout(() => {
      convertMS(Date.now() - message.timestamp);
    }, 0);
    setInterval(() => {
      convertMS(Date.now() - message.timestamp);
    }, 60000);
  }, []);
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
    style: style.message
  }, message && message.text), h("div", {
    style: style.log
  }, h("div", {
    style: style.username
  }, username && username, ":"), h("div", null, minutes === 0 && h("div", null, "Now"), hours === 0 && minutes > 0 && h("div", null, minutes, " minutes ago "), hours > 0 && days === 0 && h("div", null, hours, " hours ", minutes, " minutes ago", ' '), days <= 10 && days > 1 && h("div", null, days, " days ago"), days > 10 && new Date(message.timestamp)))));
}

export { Message as M };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWVzc2FnZS1iMmQ0NzhiMS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3VpL01lc3NhZ2UuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcbmNvbnN0IHN0eWxlID0ge1xuICByb290OiB7XG4gICAgYm9yZGVyQ29sb3I6ICcjZWVlZWVlJyxcbiAgICBib3JkZXJTdHlsZTogJ3NvbGlkJyxcbiAgICBib3JkZXJXaWR0aDogMSxcbiAgICBib3JkZXJSYWRpdXM6IDUsXG4gICAgcGFkZGluZzogMyxcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXG4gICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgICBtaW5IZWlnaHQ6IDM1LFxuICAgIGJhY2tncm91bmRDb2xvcjogJ3doaXRlJyxcbiAgfSxcbiAgdXNlcm5hbWU6IHsgbWFyZ2luUmlnaHQ6IDggfSxcbiAgbG9nOiB7XG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIGNvbG9yOiAnIzczNzM3MycsXG4gICAgZm9udFNpemU6IDEwLFxuICB9LFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIE1lc3NhZ2UocHJvcHMpIHtcbiAgY29uc3QgeyBtZXNzYWdlIH0gPSBwcm9wcztcbiAgY29uc3QgeyBmbG9hdCwgdXNlcm5hbWUgfSA9IG1lc3NhZ2U7XG4gIGNvbnN0IFtkYXlzLCBzZXREYXlzXSA9IHVzZVN0YXRlKDApO1xuICBjb25zdCBbaG91cnMsIHNldEhvdXJzXSA9IHVzZVN0YXRlKDApO1xuICBjb25zdCBbbWludXRlcywgc2V0TWludXRlc10gPSB1c2VTdGF0ZSgwKTtcbiAgY29uc3QgW3NlY29uZHMsIHNldFNlY29uZHNdID0gdXNlU3RhdGUoMCk7XG5cbiAgZnVuY3Rpb24gY29udmVydE1TKG1zKSB7XG4gICAgdmFyIGQsIGgsIG0sIHM7XG4gICAgcyA9IE1hdGguZmxvb3IobXMgLyAxMDAwKTtcbiAgICBtID0gTWF0aC5mbG9vcihzIC8gNjApO1xuICAgIHMgPSBzICUgNjA7XG4gICAgaCA9IE1hdGguZmxvb3IobSAvIDYwKTtcbiAgICBtID0gbSAlIDYwO1xuICAgIGQgPSBNYXRoLmZsb29yKGggLyAyNCk7XG4gICAgaCA9IGggJSAyNDtcbiAgICBzZXREYXlzKGQpO1xuICAgIHNldEhvdXJzKGgpO1xuICAgIHNldE1pbnV0ZXMobSk7XG4gICAgc2V0U2Vjb25kcyhzKTtcbiAgfVxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgY29udmVydE1TKERhdGUubm93KCkgLSBtZXNzYWdlLnRpbWVzdGFtcCk7XG4gICAgfSwgMCk7XG4gICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgY29udmVydE1TKERhdGUubm93KCkgLSBtZXNzYWdlLnRpbWVzdGFtcCk7XG4gICAgfSwgNjAwMDApO1xuICB9LCBbXSk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAnMTAwJScsbWFyZ2luQm90dG9tOjMgfX0+XG4gICAgICA8ZGl2IHN0eWxlPXt7IC4uLnN0eWxlLnJvb3QsIGZsb2F0IH19PlxuICAgICAgICA8ZGl2IGRhdGEtdGVzdGlkPVwibWVzc2FnZVwiIHN0eWxlPXtzdHlsZS5tZXNzYWdlfT57bWVzc2FnZSAmJiBtZXNzYWdlLnRleHR9PC9kaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9e3N0eWxlLmxvZ30+XG4gICAgICAgICAgPGRpdiBzdHlsZT17c3R5bGUudXNlcm5hbWV9Pnt1c2VybmFtZSAmJiB1c2VybmFtZX06PC9kaXY+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIHttaW51dGVzID09PSAwICYmIDxkaXY+Tm93PC9kaXY+fVxuICAgICAgICAgICAge2hvdXJzID09PSAwICYmIG1pbnV0ZXMgPiAwICYmIDxkaXY+e21pbnV0ZXN9IG1pbnV0ZXMgYWdvIDwvZGl2Pn1cbiAgICAgICAgICAgIHtob3VycyA+IDAgJiYgZGF5cyA9PT0gMCAmJiAoXG4gICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAge2hvdXJzfSBob3VycyB7bWludXRlc30gbWludXRlcyBhZ297JyAnfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICB7ZGF5cyA8PSAxMCAmJiBkYXlzID4gMSAmJiA8ZGl2PntkYXlzfSBkYXlzIGFnbzwvZGl2Pn1cbiAgICAgICAgICAgIHtkYXlzID4gMTAgJiYgbmV3IERhdGUobWVzc2FnZS50aW1lc3RhbXApfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufVxuIl0sIm5hbWVzIjpbInN0eWxlIiwicm9vdCIsImJvcmRlckNvbG9yIiwiYm9yZGVyU3R5bGUiLCJib3JkZXJXaWR0aCIsImJvcmRlclJhZGl1cyIsInBhZGRpbmciLCJkaXNwbGF5IiwiZmxleERpcmVjdGlvbiIsImp1c3RpZnlDb250ZW50IiwibWluSGVpZ2h0IiwiYmFja2dyb3VuZENvbG9yIiwidXNlcm5hbWUiLCJtYXJnaW5SaWdodCIsImxvZyIsImNvbG9yIiwiZm9udFNpemUiLCJNZXNzYWdlIiwicHJvcHMiLCJtZXNzYWdlIiwiZmxvYXQiLCJkYXlzIiwic2V0RGF5cyIsInVzZVN0YXRlIiwiaG91cnMiLCJzZXRIb3VycyIsIm1pbnV0ZXMiLCJzZXRNaW51dGVzIiwic2Vjb25kcyIsInNldFNlY29uZHMiLCJjb252ZXJ0TVMiLCJtcyIsImQiLCJoIiwibSIsInMiLCJNYXRoIiwiZmxvb3IiLCJ1c2VFZmZlY3QiLCJzZXRUaW1lb3V0IiwiRGF0ZSIsIm5vdyIsInRpbWVzdGFtcCIsInNldEludGVydmFsIiwid2lkdGgiLCJtYXJnaW5Cb3R0b20iLCJ0ZXh0Il0sIm1hcHBpbmdzIjoiOztB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
