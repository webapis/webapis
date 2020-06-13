import { h } from './index-27ec9f9e.js';
import { B as Button } from './Button-26785e0a.js';
import { L as Layout } from './Layout-f29012d0.js';
import { M as Message } from './Message-6b3a759c.js';

const style = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%'
  }
};
function Inviter({
  hangout,
  onAccept,
  onDecline
}) {
  debugger;
  return h(Layout, {
    id: "inviter-ui"
  }, h("div", {
    style: style.root
  }, h("div", {
    style: {
      flex: 1,
      marginTop: 16,
      marginLeft: 8
    }
  }, hangout && hangout.message && h(Message, {
    message: hangout && hangout.message && hangout.message
  })), h("div", {
    style: {
      display: 'flex',
      padding: 8
    }
  }, h(Button, {
    id: "DECLINE",
    onClick: onDecline,
    title: "Ignore",
    style: {
      flex: 1,
      marginRight: 4,
      color: 'red'
    }
  }), h(Button, {
    id: "ACCEPT",
    onClick: onAccept,
    "data-testid": "accept-btn",
    title: "Accept",
    style: {
      flex: 1,
      marginLeft: 4,
      color: 'green'
    }
  }))));
}

export default Inviter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW52aXRlci03MTVkNjIxZi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlLXVpL0ludml0ZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4uLy4uL2xheW91dC9CdXR0b24nO1xyXG5pbXBvcnQgeyBNZXNzYWdlIH0gZnJvbSAnLi4vdWkvTWVzc2FnZSc7XHJcbmltcG9ydCB7IExheW91dCB9IGZyb20gJy4uL3N0YXRlLXVpL0xheW91dCc7XHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gIHJvb3Q6IHtcclxuICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxyXG4gICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcclxuICAgIGhlaWdodDogJzEwMCUnLFxyXG4gIH0sXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBJbnZpdGVyKHsgaGFuZ291dCwgb25BY2NlcHQsIG9uRGVjbGluZSB9KSB7XHJcbiAgZGVidWdnZXI7XHJcbiAgcmV0dXJuIChcclxuICAgIDxMYXlvdXQgaWQ9XCJpbnZpdGVyLXVpXCI+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlLnJvb3R9PlxyXG4gICAgICAgIDxkaXYgc3R5bGU9e3sgZmxleDogMSwgbWFyZ2luVG9wOiAxNiwgbWFyZ2luTGVmdDogOCB9fT5cclxuICAgICAgICAgIHtoYW5nb3V0ICYmIGhhbmdvdXQubWVzc2FnZSAmJiAoXHJcbiAgICAgICAgICAgIDxNZXNzYWdlIG1lc3NhZ2U9e2hhbmdvdXQgJiYgaGFuZ291dC5tZXNzYWdlICYmIGhhbmdvdXQubWVzc2FnZX0gLz5cclxuICAgICAgICAgICl9XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBwYWRkaW5nOiA4IH19PlxyXG4gICAgICAgICAgPEJ1dHRvblxyXG4gICAgICAgICAgICBpZD1cIkRFQ0xJTkVcIlxyXG4gICAgICAgICAgICBvbkNsaWNrPXtvbkRlY2xpbmV9XHJcbiAgICAgICAgICAgIHRpdGxlPVwiSWdub3JlXCJcclxuICAgICAgICAgICAgc3R5bGU9e3sgZmxleDogMSwgbWFyZ2luUmlnaHQ6IDQsIGNvbG9yOiAncmVkJyB9fVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICAgIDxCdXR0b25cclxuICAgICAgICAgICAgaWQ9XCJBQ0NFUFRcIlxyXG4gICAgICAgICAgICBvbkNsaWNrPXtvbkFjY2VwdH1cclxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJhY2NlcHQtYnRuXCJcclxuICAgICAgICAgICAgdGl0bGU9XCJBY2NlcHRcIlxyXG4gICAgICAgICAgICBzdHlsZT17eyBmbGV4OiAxLCBtYXJnaW5MZWZ0OiA0LCBjb2xvcjogJ2dyZWVuJyB9fVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L0xheW91dD5cclxuICApO1xyXG59XHJcbiJdLCJuYW1lcyI6WyJzdHlsZSIsInJvb3QiLCJkaXNwbGF5IiwiZmxleERpcmVjdGlvbiIsImp1c3RpZnlDb250ZW50IiwiaGVpZ2h0IiwiSW52aXRlciIsImhhbmdvdXQiLCJvbkFjY2VwdCIsIm9uRGVjbGluZSIsImZsZXgiLCJtYXJnaW5Ub3AiLCJtYXJnaW5MZWZ0IiwibWVzc2FnZSIsInBhZGRpbmciLCJtYXJnaW5SaWdodCIsImNvbG9yIl0sIm1hcHBpbmdzIjoiOzs7OztBQUlBLE1BQU1BLEtBQUssR0FBRztBQUNaQyxFQUFBQSxJQUFJLEVBQUU7QUFDSkMsSUFBQUEsT0FBTyxFQUFFLE1BREw7QUFFSkMsSUFBQUEsYUFBYSxFQUFFLFFBRlg7QUFHSkMsSUFBQUEsY0FBYyxFQUFFLGVBSFo7QUFJSkMsSUFBQUEsTUFBTSxFQUFFO0FBSko7QUFETSxDQUFkO0FBU2UsU0FBU0MsT0FBVCxDQUFpQjtBQUFFQyxFQUFBQSxPQUFGO0FBQVdDLEVBQUFBLFFBQVg7QUFBcUJDLEVBQUFBO0FBQXJCLENBQWpCLEVBQW1EO0FBQ2hFO0FBQ0EsU0FDRSxFQUFDLE1BQUQ7QUFBUSxJQUFBLEVBQUUsRUFBQztBQUFYLEtBQ0U7QUFBSyxJQUFBLEtBQUssRUFBRVQsS0FBSyxDQUFDQztBQUFsQixLQUNFO0FBQUssSUFBQSxLQUFLLEVBQUU7QUFBRVMsTUFBQUEsSUFBSSxFQUFFLENBQVI7QUFBV0MsTUFBQUEsU0FBUyxFQUFFLEVBQXRCO0FBQTBCQyxNQUFBQSxVQUFVLEVBQUU7QUFBdEM7QUFBWixLQUNHTCxPQUFPLElBQUlBLE9BQU8sQ0FBQ00sT0FBbkIsSUFDQyxFQUFDLE9BQUQ7QUFBUyxJQUFBLE9BQU8sRUFBRU4sT0FBTyxJQUFJQSxPQUFPLENBQUNNLE9BQW5CLElBQThCTixPQUFPLENBQUNNO0FBQXhELElBRkosQ0FERixFQU9FO0FBQUssSUFBQSxLQUFLLEVBQUU7QUFBRVgsTUFBQUEsT0FBTyxFQUFFLE1BQVg7QUFBbUJZLE1BQUFBLE9BQU8sRUFBRTtBQUE1QjtBQUFaLEtBQ0UsRUFBQyxNQUFEO0FBQ0UsSUFBQSxFQUFFLEVBQUMsU0FETDtBQUVFLElBQUEsT0FBTyxFQUFFTCxTQUZYO0FBR0UsSUFBQSxLQUFLLEVBQUMsUUFIUjtBQUlFLElBQUEsS0FBSyxFQUFFO0FBQUVDLE1BQUFBLElBQUksRUFBRSxDQUFSO0FBQVdLLE1BQUFBLFdBQVcsRUFBRSxDQUF4QjtBQUEyQkMsTUFBQUEsS0FBSyxFQUFFO0FBQWxDO0FBSlQsSUFERixFQU9FLEVBQUMsTUFBRDtBQUNFLElBQUEsRUFBRSxFQUFDLFFBREw7QUFFRSxJQUFBLE9BQU8sRUFBRVIsUUFGWDtBQUdFLG1CQUFZLFlBSGQ7QUFJRSxJQUFBLEtBQUssRUFBQyxRQUpSO0FBS0UsSUFBQSxLQUFLLEVBQUU7QUFBRUUsTUFBQUEsSUFBSSxFQUFFLENBQVI7QUFBV0UsTUFBQUEsVUFBVSxFQUFFLENBQXZCO0FBQTBCSSxNQUFBQSxLQUFLLEVBQUU7QUFBakM7QUFMVCxJQVBGLENBUEYsQ0FERixDQURGO0FBMkJEOzs7OyJ9
