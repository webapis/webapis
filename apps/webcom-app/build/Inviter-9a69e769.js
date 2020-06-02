import { q as m, l, a as h } from './index-4897aeed.js';
import { B as Button } from './Button-7b2d59c7.js';
import { L as Layout } from './Layout-88b8fba1.js';

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
function Message({
  message,
  username,
  float = 'left'
}) {
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
    style: { ...style.root,
      float
    }
  }, h("div", {
    style: style.message
  }, message && message.text), h("div", {
    style: style.log
  }, h("div", {
    style: style.username
  }, username && username, ":"), h("div", null, minutes === 0 && h("div", null, "Now"), hours === 0 && minutes > 0 && h("div", null, minutes, " minutes ago "), hours > 0 && days === 0 && h("div", null, hours, " hours ", minutes, " minutes ago", ' '), days <= 10 && days > 1 && h("div", null, days, " days ago"), days > 10 && new Date(message.timestamp))));
}

const style$1 = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%'
  }
};
function Inviter({
  hangout
}) {
  return h(Layout, {
    id: "inviter-ui"
  }, h("div", {
    style: style$1.root
  }, h("div", {
    style: {
      flex: 1,
      marginTop: 16,
      marginLeft: 8
    }
  }, h(Message, {
    message: hangout && hangout.message,
    username: hangout && hangout.username
  })), h("div", {
    style: {
      display: 'flex',
      padding: 8
    }
  }, h(Button, {
    title: "Ignore",
    style: {
      flex: 1,
      marginRight: 4,
      color: 'red'
    }
  }), h(Button, {
    title: "Accept",
    style: {
      flex: 1,
      marginLeft: 4,
      color: 'green'
    }
  }))));
}

export default Inviter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW52aXRlci05YTY5ZTc2OS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3VpL01lc3NhZ2UuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUtdWkvSW52aXRlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xuY29uc3Qgc3R5bGUgPSB7XG4gIHJvb3Q6IHtcbiAgICBib3JkZXJDb2xvcjogJyNlZWVlZWUnLFxuICAgIGJvcmRlclN0eWxlOiAnc29saWQnLFxuICAgIGJvcmRlcldpZHRoOiAxLFxuICAgIGJvcmRlclJhZGl1czogNSxcbiAgICBwYWRkaW5nOiAzLFxuICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcbiAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgIG1pbkhlaWdodDogMzUsXG4gICAgYmFja2dyb3VuZENvbG9yOiAnd2hpdGUnLFxuICB9LFxuICB1c2VybmFtZTogeyBtYXJnaW5SaWdodDogOCB9LFxuICBsb2c6IHtcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgY29sb3I6ICcjNzM3MzczJyxcbiAgICBmb250U2l6ZTogMTAsXG4gIH0sXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gTWVzc2FnZSh7IG1lc3NhZ2UsIHVzZXJuYW1lLCBmbG9hdCA9ICdsZWZ0JyB9KSB7XG4gIGNvbnN0IFtkYXlzLCBzZXREYXlzXSA9IHVzZVN0YXRlKDApO1xuICBjb25zdCBbaG91cnMsIHNldEhvdXJzXSA9IHVzZVN0YXRlKDApO1xuICBjb25zdCBbbWludXRlcywgc2V0TWludXRlc10gPSB1c2VTdGF0ZSgwKTtcbiAgY29uc3QgW3NlY29uZHMsIHNldFNlY29uZHNdID0gdXNlU3RhdGUoMCk7XG5cbiAgZnVuY3Rpb24gY29udmVydE1TKG1zKSB7XG4gICAgdmFyIGQsIGgsIG0sIHM7XG4gICAgcyA9IE1hdGguZmxvb3IobXMgLyAxMDAwKTtcbiAgICBtID0gTWF0aC5mbG9vcihzIC8gNjApO1xuICAgIHMgPSBzICUgNjA7XG4gICAgaCA9IE1hdGguZmxvb3IobSAvIDYwKTtcbiAgICBtID0gbSAlIDYwO1xuICAgIGQgPSBNYXRoLmZsb29yKGggLyAyNCk7XG4gICAgaCA9IGggJSAyNDtcbiAgICBzZXREYXlzKGQpO1xuICAgIHNldEhvdXJzKGgpO1xuICAgIHNldE1pbnV0ZXMobSk7XG4gICAgc2V0U2Vjb25kcyhzKTtcbiAgfVxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgY29udmVydE1TKERhdGUubm93KCkgLSBtZXNzYWdlLnRpbWVzdGFtcCk7XG4gICAgfSwgMCk7XG4gICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgY29udmVydE1TKERhdGUubm93KCkgLSBtZXNzYWdlLnRpbWVzdGFtcCk7XG4gICAgfSwgNjAwMDApO1xuICB9LCBbXSk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7IC4uLnN0eWxlLnJvb3QsIGZsb2F0IH19PlxuICAgICAgPGRpdiBzdHlsZT17c3R5bGUubWVzc2FnZX0+e21lc3NhZ2UgJiYgbWVzc2FnZS50ZXh0fTwvZGl2PlxuICAgICAgPGRpdiBzdHlsZT17c3R5bGUubG9nfT5cbiAgICAgICAgPGRpdiBzdHlsZT17c3R5bGUudXNlcm5hbWV9Pnt1c2VybmFtZSAmJiB1c2VybmFtZX06PC9kaXY+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAge21pbnV0ZXMgPT09IDAgJiYgPGRpdj5Ob3c8L2Rpdj59XG4gICAgICAgICAge2hvdXJzID09PSAwICYmIG1pbnV0ZXMgPiAwICYmIDxkaXY+e21pbnV0ZXN9IG1pbnV0ZXMgYWdvIDwvZGl2Pn1cbiAgICAgICAgICB7aG91cnMgPiAwICYmIGRheXMgPT09IDAgJiYgKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAge2hvdXJzfSBob3VycyB7bWludXRlc30gbWludXRlcyBhZ297JyAnfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKX1cbiAgICAgICAgICB7ZGF5cyA8PSAxMCAmJiBkYXlzID4gMSAmJiA8ZGl2PntkYXlzfSBkYXlzIGFnbzwvZGl2Pn1cbiAgICAgICAgICB7ZGF5cyA+IDEwICYmIG5ldyBEYXRlKG1lc3NhZ2UudGltZXN0YW1wKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAnLi4vLi4vbGF5b3V0L0J1dHRvbic7XG5pbXBvcnQgeyBNZXNzYWdlIH0gZnJvbSAnLi4vdWkvTWVzc2FnZSc7XG5pbXBvcnQgeyBMYXlvdXQgfSBmcm9tICcuLi9zdGF0ZS11aS9MYXlvdXQnO1xuY29uc3Qgc3R5bGUgPSB7XG4gIHJvb3Q6IHtcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXG4gICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEludml0ZXIoeyBoYW5nb3V0IH0pIHtcbiAgcmV0dXJuIChcbiAgICA8TGF5b3V0IGlkPSdpbnZpdGVyLXVpJz5cbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlLnJvb3R9PlxuICAgICAgICA8ZGl2IHN0eWxlPXt7IGZsZXg6IDEsIG1hcmdpblRvcDogMTYsIG1hcmdpbkxlZnQ6IDggfX0+XG4gICAgICAgICAgPE1lc3NhZ2VcbiAgICAgICAgICAgIG1lc3NhZ2U9e2hhbmdvdXQgJiYgaGFuZ291dC5tZXNzYWdlfVxuICAgICAgICAgICAgdXNlcm5hbWU9e2hhbmdvdXQgJiYgaGFuZ291dC51c2VybmFtZX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgcGFkZGluZzogOCB9fT5cbiAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICB0aXRsZT1cIklnbm9yZVwiXG4gICAgICAgICAgICBzdHlsZT17eyBmbGV4OiAxLCBtYXJnaW5SaWdodDogNCwgY29sb3I6ICdyZWQnIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICB0aXRsZT1cIkFjY2VwdFwiXG4gICAgICAgICAgICBzdHlsZT17eyBmbGV4OiAxLCBtYXJnaW5MZWZ0OiA0LCBjb2xvcjogJ2dyZWVuJyB9fVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9MYXlvdXQ+XG4gICk7XG59XG4iXSwibmFtZXMiOlsic3R5bGUiLCJyb290IiwiYm9yZGVyQ29sb3IiLCJib3JkZXJTdHlsZSIsImJvcmRlcldpZHRoIiwiYm9yZGVyUmFkaXVzIiwicGFkZGluZyIsImRpc3BsYXkiLCJmbGV4RGlyZWN0aW9uIiwianVzdGlmeUNvbnRlbnQiLCJtaW5IZWlnaHQiLCJiYWNrZ3JvdW5kQ29sb3IiLCJ1c2VybmFtZSIsIm1hcmdpblJpZ2h0IiwibG9nIiwiY29sb3IiLCJmb250U2l6ZSIsIk1lc3NhZ2UiLCJtZXNzYWdlIiwiZmxvYXQiLCJkYXlzIiwic2V0RGF5cyIsInVzZVN0YXRlIiwiaG91cnMiLCJzZXRIb3VycyIsIm1pbnV0ZXMiLCJzZXRNaW51dGVzIiwic2Vjb25kcyIsInNldFNlY29uZHMiLCJjb252ZXJ0TVMiLCJtcyIsImQiLCJoIiwibSIsInMiLCJNYXRoIiwiZmxvb3IiLCJ1c2VFZmZlY3QiLCJzZXRUaW1lb3V0IiwiRGF0ZSIsIm5vdyIsInRpbWVzdGFtcCIsInNldEludGVydmFsIiwidGV4dCIsImhlaWdodCIsIkludml0ZXIiLCJoYW5nb3V0IiwiZmxleCIsIm1h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
