import { h } from './index-be0ed64e.js';
import { L as Layout } from './Layout-7da799b9.js';
import { C as Center } from './Center-4ad918d1.js';

function Done({
  height = 24,
  width = 24,
  fill = 'none',
  color = 'black',
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
    d: "M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"
  }));
}

const style = {
  layout: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  }
};
function Invitee({
  hangout
}) {
  return h(Layout, {
    style: style.layout,
    id: "invitee-ui"
  }, h(Center, null, h(Done, {
    width: "70",
    height: "70",
    color: "green"
  })), h(Center, null, h("p", null, "You will be able to chat with ", h("b", null, hangout && hangout.email), " once your invition has been accepted.")));
}

export default Invitee;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW52aXRlZS1lYTYzOWY4NS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY2xpZW50L2xheW91dC9pY29ucy9Eb25lLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlLXVpL0ludml0ZWUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gRG9uZSh7XHJcbiAgaGVpZ2h0ID0gMjQsXHJcbiAgd2lkdGggPSAyNCxcclxuICBmaWxsID0gJ25vbmUnLFxyXG4gIGNvbG9yID0gJ2JsYWNrJyxcclxuICBzdHlsZSxcclxufSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8c3ZnIGhlaWdodD17aGVpZ2h0fSB2aWV3Qm94PScwIDAgMjQgMjQnIHdpZHRoPXt3aWR0aH0gc3R5bGU9e3N0eWxlfT5cclxuICAgICAgPHBhdGggZD0nTTAgMGgyNHYyNEgweicgZmlsbD17ZmlsbH0gLz5cclxuICAgICAgPHBhdGhcclxuICAgICAgICBmaWxsPXtjb2xvcn1cclxuICAgICAgICBkPSdNOSAxNi4yTDQuOCAxMmwtMS40IDEuNEw5IDE5IDIxIDdsLTEuNC0xLjRMOSAxNi4yeidcclxuICAgICAgLz5cclxuICAgIDwvc3ZnPlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyBEb25lIH0gZnJvbSAnLi4vLi4vbGF5b3V0L2ljb25zL0RvbmUnO1xuaW1wb3J0IHsgQ2VudGVyIH0gZnJvbSAnLi4vLi4vbGF5b3V0L0NlbnRlcic7XG5pbXBvcnQgeyBMYXlvdXQgfSBmcm9tICcuLi9zdGF0ZS11aS9MYXlvdXQnO1xuXG5jb25zdCBzdHlsZSA9IHtcbiAgbGF5b3V0OiB7XG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxuICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgfSxcbn07XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBJbnZpdGVlKHsgaGFuZ291dCB9KSB7XG4gIHJldHVybiAoXG4gICAgPExheW91dCBzdHlsZT17c3R5bGUubGF5b3V0fSBpZD1cImludml0ZWUtdWlcIj5cbiAgICAgIDxDZW50ZXI+XG4gICAgICAgIDxEb25lIHdpZHRoPVwiNzBcIiBoZWlnaHQ9XCI3MFwiIGNvbG9yPVwiZ3JlZW5cIiAvPlxuICAgICAgPC9DZW50ZXI+XG4gICAgICA8Q2VudGVyPlxuICAgICAgICA8cD5cbiAgICAgICAgICBZb3Ugd2lsbCBiZSBhYmxlIHRvIGNoYXQgd2l0aCA8Yj57aGFuZ291dCAmJiBoYW5nb3V0LmVtYWlsfTwvYj4gb25jZVxuICAgICAgICAgIHlvdXIgaW52aXRpb24gaGFzIGJlZW4gYWNjZXB0ZWQuXG4gICAgICAgIDwvcD5cbiAgICAgIDwvQ2VudGVyPlxuICAgIDwvTGF5b3V0PlxuICApO1xufVxuIl0sIm5hbWVzIjpbIkRvbmUiLCJoZWlnaHQiLCJ3aWR0aCIsImZpbGwiLCJjb2xvciIsInN0eWxlIiwibGF5b3V0IiwiZGlzcGxheSIsImZsZXhEaXJlY3Rpb24iLCJqdXN0aWZ5Q29udGVudCIsIkludml0ZWUiLCJoYW5nb3V0IiwiZW1haWwiXSwibWFwcGluZ3MiOiI7Ozs7QUFFTyxTQUFTQSxJQUFULENBQWM7QUFDbkJDLEVBQUFBLE1BQU0sR0FBRyxFQURVO0FBRW5CQyxFQUFBQSxLQUFLLEdBQUcsRUFGVztBQUduQkMsRUFBQUEsSUFBSSxHQUFHLE1BSFk7QUFJbkJDLEVBQUFBLEtBQUssR0FBRyxPQUpXO0FBS25CQyxFQUFBQTtBQUxtQixDQUFkLEVBTUo7QUFDRCxTQUNFO0FBQUssSUFBQSxNQUFNLEVBQUVKLE1BQWI7QUFBcUIsSUFBQSxPQUFPLEVBQUMsV0FBN0I7QUFBeUMsSUFBQSxLQUFLLEVBQUVDLEtBQWhEO0FBQXVELElBQUEsS0FBSyxFQUFFRztBQUE5RCxLQUNFO0FBQU0sSUFBQSxDQUFDLEVBQUMsZUFBUjtBQUF3QixJQUFBLElBQUksRUFBRUY7QUFBOUIsSUFERixFQUVFO0FBQ0UsSUFBQSxJQUFJLEVBQUVDLEtBRFI7QUFFRSxJQUFBLENBQUMsRUFBQztBQUZKLElBRkYsQ0FERjtBQVNEOztBQ2JELE1BQU1DLEtBQUssR0FBRztBQUNaQyxFQUFBQSxNQUFNLEVBQUU7QUFDTkMsSUFBQUEsT0FBTyxFQUFFLE1BREg7QUFFTkMsSUFBQUEsYUFBYSxFQUFFLFFBRlQ7QUFHTkMsSUFBQUEsY0FBYyxFQUFFO0FBSFY7QUFESSxDQUFkO0FBT2UsU0FBU0MsT0FBVCxDQUFpQjtBQUFFQyxFQUFBQTtBQUFGLENBQWpCLEVBQThCO0FBQzNDLFNBQ0UsRUFBQyxNQUFEO0FBQVEsSUFBQSxLQUFLLEVBQUVOLEtBQUssQ0FBQ0MsTUFBckI7QUFBNkIsSUFBQSxFQUFFLEVBQUM7QUFBaEMsS0FDRSxFQUFDLE1BQUQsUUFDRSxFQUFDLElBQUQ7QUFBTSxJQUFBLEtBQUssRUFBQyxJQUFaO0FBQWlCLElBQUEsTUFBTSxFQUFDLElBQXhCO0FBQTZCLElBQUEsS0FBSyxFQUFDO0FBQW5DLElBREYsQ0FERixFQUlFLEVBQUMsTUFBRCxRQUNFLCtDQUNnQyxhQUFJSyxPQUFPLElBQUlBLE9BQU8sQ0FBQ0MsS0FBdkIsQ0FEaEMsMkNBREYsQ0FKRixDQURGO0FBYUQ7Ozs7In0=
