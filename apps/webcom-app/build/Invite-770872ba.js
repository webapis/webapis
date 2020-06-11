import { h } from './index-c963e65a.js';
import { T as TextInput } from './TextInput-06766ecd.js';
import { B as Button } from './Button-b8a283e5.js';
import { L as Layout } from './Layout-956d454f.js';
import { C as Center } from './Center-cabb0f0b.js';

function PersonAddIcon({
  height = 24,
  width = 24,
  color = 'black',
  fill = 'white',
  style
}) {
  return h("svg", {
    height: height,
    viewBox: "0 0 24 24",
    width: width,
    style: style
  }, h("path", {
    d: "M0 0h24v24H0z",
    fill: fill
  }), h("path", {
    fill: color,
    d: "M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
  }));
}

const style = {
  layout: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  }
};
function Invite({
  hangout,
  onInvite,
  onMessageText,
  messageText,
  value
}) {
  return h(Layout, {
    style: style.layout,
    id: "invite-ui"
  }, h(Center, null, h(PersonAddIcon, {
    color: "green"
  })), h(Center, null, "Start Conversation with ", h("b", null, hangout && hangout.email)), h(TextInput, {
    id: "messageTextInput",
    onChange: onMessageText,
    value: messageText
  }), h(Center, null, h(Button, {
    title: "Send Invite",
    id: "INVITE",
    onClick: onInvite,
    "data-testid": "oninvite-btn"
  })));
}

export default Invite;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW52aXRlLTc3MDg3MmJhLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9jbGllbnQvbGF5b3V0L2ljb25zL1BlcnNvbkFkZC5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS11aS9JbnZpdGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFBlcnNvbkFkZEljb24oe1xyXG4gIGhlaWdodCA9IDI0LFxyXG4gIHdpZHRoID0gMjQsXHJcbiAgY29sb3IgPSAnYmxhY2snLFxyXG4gIGZpbGwgPSAnd2hpdGUnLFxyXG4gIHN0eWxlLFxyXG59KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxzdmcgaGVpZ2h0PXtoZWlnaHR9IHZpZXdCb3g9JzAgMCAyNCAyNCcgd2lkdGg9e3dpZHRofSBzdHlsZT17c3R5bGV9PlxyXG4gICAgICA8cGF0aCBkPSdNMCAwaDI0djI0SDB6JyBmaWxsPXtmaWxsfSAvPlxyXG4gICAgICA8cGF0aFxyXG4gICAgICAgIGZpbGw9e2NvbG9yfVxyXG4gICAgICAgIGQ9J00xNSAxMmMyLjIxIDAgNC0xLjc5IDQtNHMtMS43OS00LTQtNC00IDEuNzktNCA0IDEuNzkgNCA0IDR6bS05LTJWN0g0djNIMXYyaDN2M2gydi0zaDN2LTJINnptOSA0Yy0yLjY3IDAtOCAxLjM0LTggNHYyaDE2di0yYzAtMi42Ni01LjMzLTQtOC00eidcclxuICAgICAgLz5cclxuICAgIDwvc3ZnPlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCBQZXJzb25BZGQgZnJvbSAnLi4vLi4vbGF5b3V0L2ljb25zL1BlcnNvbkFkZCc7XHJcbmltcG9ydCB7IFRleHRJbnB1dCB9IGZyb20gJy4uLy4uL2xheW91dC9UZXh0SW5wdXQnO1xyXG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tICcuLi8uLi9sYXlvdXQvQnV0dG9uJztcclxuaW1wb3J0IHsgQ2VudGVyIH0gZnJvbSAnLi4vLi4vbGF5b3V0L0NlbnRlcic7XHJcbmltcG9ydCB7IExheW91dCB9IGZyb20gJy4uL3N0YXRlLXVpL0xheW91dCc7XHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gIGxheW91dDoge1xyXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXHJcbiAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXHJcbiAgfSxcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEludml0ZSh7IGhhbmdvdXQsIG9uSW52aXRlLCBvbk1lc3NhZ2VUZXh0LG1lc3NhZ2VUZXh0LCB2YWx1ZSB9KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxMYXlvdXQgc3R5bGU9e3N0eWxlLmxheW91dH1pZD1cImludml0ZS11aVwiPlxyXG4gICAgICA8Q2VudGVyPlxyXG4gICAgICAgIDxQZXJzb25BZGQgY29sb3I9XCJncmVlblwiIC8+XHJcbiAgICAgIDwvQ2VudGVyPlxyXG4gICAgICA8Q2VudGVyPlxyXG4gICAgICAgIFN0YXJ0IENvbnZlcnNhdGlvbiB3aXRoIDxiPntoYW5nb3V0ICYmIGhhbmdvdXQuZW1haWx9PC9iPlxyXG4gICAgICA8L0NlbnRlcj5cclxuICAgICAgPFRleHRJbnB1dCBpZD1cIm1lc3NhZ2VUZXh0SW5wdXRcIiBvbkNoYW5nZT17b25NZXNzYWdlVGV4dH0gdmFsdWU9e21lc3NhZ2VUZXh0fSAvPlxyXG4gICAgICA8Q2VudGVyPlxyXG4gICAgICAgIDxCdXR0b24gdGl0bGU9XCJTZW5kIEludml0ZVwiIGlkPVwiSU5WSVRFXCIgb25DbGljaz17b25JbnZpdGV9IGRhdGEtdGVzdGlkPSdvbmludml0ZS1idG4nIC8+XHJcbiAgICAgIDwvQ2VudGVyPlxyXG4gICAgPC9MYXlvdXQ+XHJcbiAgKTtcclxufVxyXG4iXSwibmFtZXMiOlsiUGVyc29uQWRkSWNvbiIsImhlaWdodCIsIndpZHRoIiwiY29sb3IiLCJmaWxsIiwic3R5bGUiLCJsYXlvdXQiLCJkaXNwbGF5IiwiZmxleERpcmVjdGlvbiIsImp1c3RpZnlDb250ZW50IiwiSW52aXRlIiwiaGFuZ291dCIsIm9uSW52aXRlIiwib25NZXNzYWdlVGV4dCIsIm1lc3NhZ2VUZXh0IiwidmFsdWUiLCJQZXJzb25BZGQiLCJlbWFpbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ2UsU0FBU0EsYUFBVCxDQUF1QjtBQUNwQ0MsRUFBQUEsTUFBTSxHQUFHLEVBRDJCO0FBRXBDQyxFQUFBQSxLQUFLLEdBQUcsRUFGNEI7QUFHcENDLEVBQUFBLEtBQUssR0FBRyxPQUg0QjtBQUlwQ0MsRUFBQUEsSUFBSSxHQUFHLE9BSjZCO0FBS3BDQyxFQUFBQTtBQUxvQyxDQUF2QixFQU1aO0FBQ0QsU0FDRTtBQUFLLElBQUEsTUFBTSxFQUFFSixNQUFiO0FBQXFCLElBQUEsT0FBTyxFQUFDLFdBQTdCO0FBQXlDLElBQUEsS0FBSyxFQUFFQyxLQUFoRDtBQUF1RCxJQUFBLEtBQUssRUFBRUc7QUFBOUQsS0FDRTtBQUFNLElBQUEsQ0FBQyxFQUFDLGVBQVI7QUFBd0IsSUFBQSxJQUFJLEVBQUVEO0FBQTlCLElBREYsRUFFRTtBQUNFLElBQUEsSUFBSSxFQUFFRCxLQURSO0FBRUUsSUFBQSxDQUFDLEVBQUM7QUFGSixJQUZGLENBREY7QUFTRDs7QUNYRCxNQUFNRSxLQUFLLEdBQUc7QUFDWkMsRUFBQUEsTUFBTSxFQUFFO0FBQ05DLElBQUFBLE9BQU8sRUFBRSxNQURIO0FBRU5DLElBQUFBLGFBQWEsRUFBRSxRQUZUO0FBR05DLElBQUFBLGNBQWMsRUFBRTtBQUhWO0FBREksQ0FBZDtBQVFlLFNBQVNDLE1BQVQsQ0FBZ0I7QUFBRUMsRUFBQUEsT0FBRjtBQUFXQyxFQUFBQSxRQUFYO0FBQXFCQyxFQUFBQSxhQUFyQjtBQUFtQ0MsRUFBQUEsV0FBbkM7QUFBZ0RDLEVBQUFBO0FBQWhELENBQWhCLEVBQXlFO0FBQ3RGLFNBQ0UsRUFBQyxNQUFEO0FBQVEsSUFBQSxLQUFLLEVBQUVWLEtBQUssQ0FBQ0MsTUFBckI7QUFBNEIsSUFBQSxFQUFFLEVBQUM7QUFBL0IsS0FDRSxFQUFDLE1BQUQsUUFDRSxFQUFDVSxhQUFEO0FBQVcsSUFBQSxLQUFLLEVBQUM7QUFBakIsSUFERixDQURGLEVBSUUsRUFBQyxNQUFELG9DQUMwQixhQUFJTCxPQUFPLElBQUlBLE9BQU8sQ0FBQ00sS0FBdkIsQ0FEMUIsQ0FKRixFQU9FLEVBQUMsU0FBRDtBQUFXLElBQUEsRUFBRSxFQUFDLGtCQUFkO0FBQWlDLElBQUEsUUFBUSxFQUFFSixhQUEzQztBQUEwRCxJQUFBLEtBQUssRUFBRUM7QUFBakUsSUFQRixFQVFFLEVBQUMsTUFBRCxRQUNFLEVBQUMsTUFBRDtBQUFRLElBQUEsS0FBSyxFQUFDLGFBQWQ7QUFBNEIsSUFBQSxFQUFFLEVBQUMsUUFBL0I7QUFBd0MsSUFBQSxPQUFPLEVBQUVGLFFBQWpEO0FBQTJELG1CQUFZO0FBQXZFLElBREYsQ0FSRixDQURGO0FBY0Q7Ozs7In0=
