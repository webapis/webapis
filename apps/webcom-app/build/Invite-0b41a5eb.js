import { h } from './index-dfdbd144.js';
import { T as TextInput } from './TextInput-1a87788a.js';
import { B as Button } from './Button-b0037c9b.js';
import { L as Layout } from './Layout-3579662f.js';
import { C as Center } from './Center-345db2a5.js';

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW52aXRlLTBiNDFhNWViLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9jbGllbnQvbGF5b3V0L2ljb25zL1BlcnNvbkFkZC5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS11aS9JbnZpdGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFBlcnNvbkFkZEljb24oe1xyXG4gIGhlaWdodCA9IDI0LFxyXG4gIHdpZHRoID0gMjQsXHJcbiAgY29sb3IgPSAnYmxhY2snLFxyXG4gIGZpbGwgPSAnd2hpdGUnLFxyXG4gIHN0eWxlLFxyXG59KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxzdmcgaGVpZ2h0PXtoZWlnaHR9IHZpZXdCb3g9JzAgMCAyNCAyNCcgd2lkdGg9e3dpZHRofSBzdHlsZT17c3R5bGV9PlxyXG4gICAgICA8cGF0aCBkPSdNMCAwaDI0djI0SDB6JyBmaWxsPXtmaWxsfSAvPlxyXG4gICAgICA8cGF0aFxyXG4gICAgICAgIGZpbGw9e2NvbG9yfVxyXG4gICAgICAgIGQ9J00xNSAxMmMyLjIxIDAgNC0xLjc5IDQtNHMtMS43OS00LTQtNC00IDEuNzktNCA0IDEuNzkgNCA0IDR6bS05LTJWN0g0djNIMXYyaDN2M2gydi0zaDN2LTJINnptOSA0Yy0yLjY3IDAtOCAxLjM0LTggNHYyaDE2di0yYzAtMi42Ni01LjMzLTQtOC00eidcclxuICAgICAgLz5cclxuICAgIDwvc3ZnPlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgUGVyc29uQWRkIGZyb20gJy4uLy4uL2xheW91dC9pY29ucy9QZXJzb25BZGQnO1xuaW1wb3J0IHsgVGV4dElucHV0IH0gZnJvbSAnLi4vLi4vbGF5b3V0L1RleHRJbnB1dCc7XG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tICcuLi8uLi9sYXlvdXQvQnV0dG9uJztcbmltcG9ydCB7IENlbnRlciB9IGZyb20gJy4uLy4uL2xheW91dC9DZW50ZXInO1xuaW1wb3J0IHsgTGF5b3V0IH0gZnJvbSAnLi4vc3RhdGUtdWkvTGF5b3V0JztcbmNvbnN0IHN0eWxlID0ge1xuICBsYXlvdXQ6IHtcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXG4gICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSW52aXRlKHsgaGFuZ291dCwgb25JbnZpdGUsIG9uTWVzc2FnZVRleHQsbWVzc2FnZVRleHQsIHZhbHVlIH0pIHtcbiAgcmV0dXJuIChcbiAgICA8TGF5b3V0IHN0eWxlPXtzdHlsZS5sYXlvdXR9aWQ9XCJpbnZpdGUtdWlcIj5cbiAgICAgIDxDZW50ZXI+XG4gICAgICAgIDxQZXJzb25BZGQgY29sb3I9XCJncmVlblwiIC8+XG4gICAgICA8L0NlbnRlcj5cbiAgICAgIDxDZW50ZXI+XG4gICAgICAgIFN0YXJ0IENvbnZlcnNhdGlvbiB3aXRoIDxiPntoYW5nb3V0ICYmIGhhbmdvdXQuZW1haWx9PC9iPlxuICAgICAgPC9DZW50ZXI+XG4gICAgICA8VGV4dElucHV0IGlkPVwibWVzc2FnZVRleHRJbnB1dFwiIG9uQ2hhbmdlPXtvbk1lc3NhZ2VUZXh0fSB2YWx1ZT17bWVzc2FnZVRleHR9IC8+XG4gICAgICA8Q2VudGVyPlxuICAgICAgICA8QnV0dG9uIHRpdGxlPVwiU2VuZCBJbnZpdGVcIiBpZD1cIklOVklURVwiIG9uQ2xpY2s9e29uSW52aXRlfSBkYXRhLXRlc3RpZD0nb25pbnZpdGUtYnRuJyAvPlxuICAgICAgPC9DZW50ZXI+XG4gICAgPC9MYXlvdXQ+XG4gICk7XG59XG4iXSwibmFtZXMiOlsiUGVyc29uQWRkSWNvbiIsImhlaWdodCIsIndpZHRoIiwiY29sb3IiLCJmaWxsIiwic3R5bGUiLCJsYXlvdXQiLCJkaXNwbGF5IiwiZmxleERpcmVjdGlvbiIsImp1c3RpZnlDb250ZW50IiwiSW52aXRlIiwiaGFuZ291dCIsIm9uSW52aXRlIiwib25NZXNzYWdlVGV4dCIsIm1lc3NhZ2VUZXh0IiwidmFsdWUiLCJQZXJzb25BZGQiLCJlbWFpbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ2UsU0FBU0EsYUFBVCxDQUF1QjtBQUNwQ0MsRUFBQUEsTUFBTSxHQUFHLEVBRDJCO0FBRXBDQyxFQUFBQSxLQUFLLEdBQUcsRUFGNEI7QUFHcENDLEVBQUFBLEtBQUssR0FBRyxPQUg0QjtBQUlwQ0MsRUFBQUEsSUFBSSxHQUFHLE9BSjZCO0FBS3BDQyxFQUFBQTtBQUxvQyxDQUF2QixFQU1aO0FBQ0QsU0FDRTtBQUFLLElBQUEsTUFBTSxFQUFFSixNQUFiO0FBQXFCLElBQUEsT0FBTyxFQUFDLFdBQTdCO0FBQXlDLElBQUEsS0FBSyxFQUFFQyxLQUFoRDtBQUF1RCxJQUFBLEtBQUssRUFBRUc7QUFBOUQsS0FDRTtBQUFNLElBQUEsQ0FBQyxFQUFDLGVBQVI7QUFBd0IsSUFBQSxJQUFJLEVBQUVEO0FBQTlCLElBREYsRUFFRTtBQUNFLElBQUEsSUFBSSxFQUFFRCxLQURSO0FBRUUsSUFBQSxDQUFDLEVBQUM7QUFGSixJQUZGLENBREY7QUFTRDs7QUNYRCxNQUFNRSxLQUFLLEdBQUc7QUFDWkMsRUFBQUEsTUFBTSxFQUFFO0FBQ05DLElBQUFBLE9BQU8sRUFBRSxNQURIO0FBRU5DLElBQUFBLGFBQWEsRUFBRSxRQUZUO0FBR05DLElBQUFBLGNBQWMsRUFBRTtBQUhWO0FBREksQ0FBZDtBQVFlLFNBQVNDLE1BQVQsQ0FBZ0I7QUFBRUMsRUFBQUEsT0FBRjtBQUFXQyxFQUFBQSxRQUFYO0FBQXFCQyxFQUFBQSxhQUFyQjtBQUFtQ0MsRUFBQUEsV0FBbkM7QUFBZ0RDLEVBQUFBO0FBQWhELENBQWhCLEVBQXlFO0FBQ3RGLFNBQ0UsRUFBQyxNQUFEO0FBQVEsSUFBQSxLQUFLLEVBQUVWLEtBQUssQ0FBQ0MsTUFBckI7QUFBNEIsSUFBQSxFQUFFLEVBQUM7QUFBL0IsS0FDRSxFQUFDLE1BQUQsUUFDRSxFQUFDVSxhQUFEO0FBQVcsSUFBQSxLQUFLLEVBQUM7QUFBakIsSUFERixDQURGLEVBSUUsRUFBQyxNQUFELG9DQUMwQixhQUFJTCxPQUFPLElBQUlBLE9BQU8sQ0FBQ00sS0FBdkIsQ0FEMUIsQ0FKRixFQU9FLEVBQUMsU0FBRDtBQUFXLElBQUEsRUFBRSxFQUFDLGtCQUFkO0FBQWlDLElBQUEsUUFBUSxFQUFFSixhQUEzQztBQUEwRCxJQUFBLEtBQUssRUFBRUM7QUFBakUsSUFQRixFQVFFLEVBQUMsTUFBRCxRQUNFLEVBQUMsTUFBRDtBQUFRLElBQUEsS0FBSyxFQUFDLGFBQWQ7QUFBNEIsSUFBQSxFQUFFLEVBQUMsUUFBL0I7QUFBd0MsSUFBQSxPQUFPLEVBQUVGLFFBQWpEO0FBQTJELG1CQUFZO0FBQXZFLElBREYsQ0FSRixDQURGO0FBY0Q7Ozs7In0=
