import { m, l, h } from './index-c8e03507.js';

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWVzc2FnZS1kZTA1ZTViNC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL21lc3NhZ2UtdWkvTWVzc2FnZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xuY29uc3Qgc3R5bGUgPSB7XG4gIHJvb3Q6IHtcbiAgICBib3JkZXJDb2xvcjogJyNlZWVlZWUnLFxuICAgIGJvcmRlclN0eWxlOiAnc29saWQnLFxuICAgIGJvcmRlcldpZHRoOiAxLFxuICAgIGJvcmRlclJhZGl1czogNSxcbiAgICBwYWRkaW5nOiAzLFxuICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcbiAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgIG1pbkhlaWdodDogMzUsXG4gICAgYmFja2dyb3VuZENvbG9yOiAnd2hpdGUnLFxuICB9LFxuICB1c2VybmFtZTogeyBtYXJnaW5SaWdodDogOCB9LFxuICBsb2c6IHtcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgY29sb3I6ICcjNzM3MzczJyxcbiAgICBmb250U2l6ZTogMTAsXG4gIH0sXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gTWVzc2FnZShwcm9wcykge1xuICBjb25zdCB7IG1lc3NhZ2UgfSA9IHByb3BzO1xuICBjb25zdCB7IGZsb2F0LCB1c2VybmFtZSB9ID0gbWVzc2FnZTtcbiAgY29uc3QgW2RheXMsIHNldERheXNdID0gdXNlU3RhdGUoMCk7XG4gIGNvbnN0IFtob3Vycywgc2V0SG91cnNdID0gdXNlU3RhdGUoMCk7XG4gIGNvbnN0IFttaW51dGVzLCBzZXRNaW51dGVzXSA9IHVzZVN0YXRlKDApO1xuICBjb25zdCBbc2Vjb25kcywgc2V0U2Vjb25kc10gPSB1c2VTdGF0ZSgwKTtcblxuICBmdW5jdGlvbiBjb252ZXJ0TVMobXMpIHtcbiAgICB2YXIgZCwgaCwgbSwgcztcbiAgICBzID0gTWF0aC5mbG9vcihtcyAvIDEwMDApO1xuICAgIG0gPSBNYXRoLmZsb29yKHMgLyA2MCk7XG4gICAgcyA9IHMgJSA2MDtcbiAgICBoID0gTWF0aC5mbG9vcihtIC8gNjApO1xuICAgIG0gPSBtICUgNjA7XG4gICAgZCA9IE1hdGguZmxvb3IoaCAvIDI0KTtcbiAgICBoID0gaCAlIDI0O1xuICAgIHNldERheXMoZCk7XG4gICAgc2V0SG91cnMoaCk7XG4gICAgc2V0TWludXRlcyhtKTtcbiAgICBzZXRTZWNvbmRzKHMpO1xuICB9XG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBjb252ZXJ0TVMoRGF0ZS5ub3coKSAtIG1lc3NhZ2UudGltZXN0YW1wKTtcbiAgICB9LCAwKTtcbiAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICBjb252ZXJ0TVMoRGF0ZS5ub3coKSAtIG1lc3NhZ2UudGltZXN0YW1wKTtcbiAgICB9LCA2MDAwMCk7XG4gIH0sIFtdKTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3sgd2lkdGg6ICcxMDAlJyxtYXJnaW5Cb3R0b206MyB9fT5cbiAgICAgIDxkaXYgc3R5bGU9e3sgLi4uc3R5bGUucm9vdCwgZmxvYXQgfX0+XG4gICAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJtZXNzYWdlXCIgc3R5bGU9e3N0eWxlLm1lc3NhZ2V9PnttZXNzYWdlICYmIG1lc3NhZ2UudGV4dH08L2Rpdj5cbiAgICAgICAgPGRpdiBzdHlsZT17c3R5bGUubG9nfT5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXtzdHlsZS51c2VybmFtZX0+e3VzZXJuYW1lICYmIHVzZXJuYW1lfTo8L2Rpdj5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAge21pbnV0ZXMgPT09IDAgJiYgPGRpdj5Ob3c8L2Rpdj59XG4gICAgICAgICAgICB7aG91cnMgPT09IDAgJiYgbWludXRlcyA+IDAgJiYgPGRpdj57bWludXRlc30gbWludXRlcyBhZ28gPC9kaXY+fVxuICAgICAgICAgICAge2hvdXJzID4gMCAmJiBkYXlzID09PSAwICYmIChcbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICB7aG91cnN9IGhvdXJzIHttaW51dGVzfSBtaW51dGVzIGFnb3snICd9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIHtkYXlzIDw9IDEwICYmIGRheXMgPiAxICYmIDxkaXY+e2RheXN9IGRheXMgYWdvPC9kaXY+fVxuICAgICAgICAgICAge2RheXMgPiAxMCAmJiBuZXcgRGF0ZShtZXNzYWdlLnRpbWVzdGFtcCl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iXSwibmFtZXMiOlsic3R5bGUiLCJyb290IiwiYm9yZGVyQ29sb3IiLCJib3JkZXJTdHlsZSIsImJvcmRlcldpZHRoIiwiYm9yZGVyUmFkaXVzIiwicGFkZGluZyIsImRpc3BsYXkiLCJmbGV4RGlyZWN0aW9uIiwianVzdGlmeUNvbnRlbnQiLCJtaW5IZWlnaHQiLCJiYWNrZ3JvdW5kQ29sb3IiLCJ1c2VybmFtZSIsIm1hcmdpblJpZ2h0IiwibG9nIiwiY29sb3IiLCJmb250U2l6ZSIsIk1lc3NhZ2UiLCJwcm9wcyIsIm1lc3NhZ2UiLCJmbG9hdCIsImRheXMiLCJzZXREYXlzIiwidXNlU3RhdGUiLCJob3VycyIsInNldEhvdXJzIiwibWludXRlcyIsInNldE1pbnV0ZXMiLCJzZWNvbmRzIiwic2V0U2Vjb25kcyIsImNvbnZlcnRNUyIsIm1zIiwiZCIsImgiLCJtIiwicyIsIk1hdGgiLCJmbG9vciIsInVzZUVmZmVjdCIsInNldFRpbWVvdXQiLCJEYXRlIiwibm93IiwidGltZXN0YW1wIiwic2V0SW50ZXJ2YWwiLCJ3aWR0aCIsIm1hcmdpbkJvdHRvbSIsInRleHQiXSwibWFwcGlu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