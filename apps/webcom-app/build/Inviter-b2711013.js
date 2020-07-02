import { h } from './index-58f1b195.js';
import { A as AsyncButton } from './index-d62add4f.js';
import { B as Button } from './Button-9f7e4c21.js';
import { L as Layout } from './Layout-a672d7a9.js';
import { M as Message } from './Message-5618fdc6.js';

const style = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    paddingTop: 70,
    boxSizing: 'border-box',
    justifyContent: 'space-between',
    paddingBottom: 8
  }
};
function Inviter({
  hangout,
  onAccept,
  onDecline,
  loading
}) {
  return h(Layout, {
    id: "inviter-ui"
  }, h("div", {
    style: style.root
  }, h("div", {
    style: {
      marginLeft: 8,
      display: 'flex'
    }
  }, hangout && hangout.message && h(Message, {
    message: hangout && hangout.message && { ...hangout.message,
      username: hangout.username,
      float: 'left'
    }
  })), h("div", {
    style: {
      display: 'flex',
      paddingLeft: 8,
      paddingRight: 8
    }
  }, h(Button, {
    id: "DECLINE",
    onClick: onDecline,
    "data-testid": "decline-btn",
    title: "Decline",
    style: {
      flex: 1,
      marginRight: 4,
      color: 'red'
    }
  }), h(AsyncButton, {
    id: "ACCEPT",
    onClick: onAccept,
    "data-testid": "accept-btn",
    style: {
      flex: 1,
      marginLeft: 4,
      color: 'green'
    },
    loading: loading
  }, "ACCEPT"))));
}

export default Inviter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW52aXRlci1iMjcxMTAxMy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlLXVpL0ludml0ZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvQnV0dG9uJztcclxuaW1wb3J0IHsgTWVzc2FnZSB9IGZyb20gJy4uL21lc3NhZ2UtdWkvTWVzc2FnZSc7XHJcbmltcG9ydCB7IExheW91dCB9IGZyb20gJy4uL3N0YXRlLXVpL0xheW91dCc7XHJcbmltcG9ydCBBc3luY0J1dHRvbiBmcm9tICcuLi8uLi9jb21wb25lbnRzL2FzeW5jLWJ1dHRvbidcclxuY29uc3Qgc3R5bGUgPSB7XHJcbiAgcm9vdDoge1xyXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXHJcbiAgICB3aWR0aDogJzEwMCUnLFxyXG4gICAgaGVpZ2h0OiAnMTAwJScsXHJcbiAgICBwYWRkaW5nVG9wOiA3MCxcclxuICAgIGJveFNpemluZzogJ2JvcmRlci1ib3gnLFxyXG4gICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcclxuICAgIHBhZGRpbmdCb3R0b206OCxcclxuIFxyXG4gIH0sXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBJbnZpdGVyKHsgaGFuZ291dCwgb25BY2NlcHQsIG9uRGVjbGluZSxsb2FkaW5nIH0pIHtcclxuIFxyXG4gIHJldHVybiAoXHJcbiAgICA8TGF5b3V0IGlkPVwiaW52aXRlci11aVwiPlxyXG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5yb290fT5cclxuICAgICAgICA8ZGl2IHN0eWxlPXt7IG1hcmdpbkxlZnQ6IDgsIGRpc3BsYXk6J2ZsZXgnIH19PlxyXG4gICAgICAgICAge2hhbmdvdXQgJiYgaGFuZ291dC5tZXNzYWdlICYmIChcclxuICAgICAgICAgICAgPE1lc3NhZ2VcclxuICAgICAgICAgICAgICBtZXNzYWdlPXtcclxuICAgICAgICAgICAgICAgIGhhbmdvdXQgJiZcclxuICAgICAgICAgICAgICAgIGhhbmdvdXQubWVzc2FnZSAmJiB7XHJcbiAgICAgICAgICAgICAgICAgIC4uLmhhbmdvdXQubWVzc2FnZSxcclxuICAgICAgICAgICAgICAgICAgdXNlcm5hbWU6IGhhbmdvdXQudXNlcm5hbWUsZmxvYXQ6J2xlZnQnXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgKX1cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcscGFkZGluZ0xlZnQ6OCxwYWRkaW5nUmlnaHQ6OCB9fT5cclxuICAgICAgICAgIDxCdXR0b25cclxuICAgICAgICAgICAgaWQ9XCJERUNMSU5FXCJcclxuICAgICAgICAgICAgb25DbGljaz17b25EZWNsaW5lfVxyXG4gICAgICAgICAgICBkYXRhLXRlc3RpZD1cImRlY2xpbmUtYnRuXCJcclxuICAgICAgICAgICAgdGl0bGU9XCJEZWNsaW5lXCJcclxuICAgICAgICAgICAgc3R5bGU9e3sgZmxleDogMSwgbWFyZ2luUmlnaHQ6IDQsIGNvbG9yOiAncmVkJyB9fVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICAgIDxBc3luY0J1dHRvblxyXG4gICAgICAgICAgICBpZD1cIkFDQ0VQVFwiXHJcbiAgICAgICAgICAgIG9uQ2xpY2s9e29uQWNjZXB0fVxyXG4gICAgICAgICAgICBkYXRhLXRlc3RpZD1cImFjY2VwdC1idG5cIlxyXG4gICAgICAgICAgICBzdHlsZT17eyBmbGV4OiAxLCBtYXJnaW5MZWZ0OiA0LCBjb2xvcjogJ2dyZWVuJyB9fVxyXG4gICAgICAgICAgICBsb2FkaW5nPXtsb2FkaW5nfVxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgICBBQ0NFUFRcclxuICAgICAgICAgIDwvQXN5bmNCdXR0b24+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9MYXlvdXQ+XHJcbiAgKTtcclxufVxyXG4iXSwibmFtZXMiOlsic3R5bGUiLCJyb290IiwiZGlzcGxheSIsImZsZXhEaXJlY3Rpb24iLCJ3aWR0aCIsImhlaWdodCIsInBhZGRpbmdUb3AiLCJib3hTaXppbmciLCJqdXN0aWZ5Q29udGVudCIsInBhZGRpbmdCb3R0b20iLCJJbnZpdGVyIiwiaGFuZ291dCIsIm9uQWNjZXB0Iiwib25EZWNsaW5lIiwibG9hZGluZyIsIm1hcmdpbkxlZnQiLCJtZXNzYWdlIiwidXNlcm5hbWUiLCJmbG9hdCIsInBhZGRpbmdMZWZ0IiwicGFkZGluZ1JpZ2h0IiwiZmxleCIsIm1hcmdpblJpZ2h0IiwiY29sb3IiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUtBLE1BQU1BLEtBQUssR0FBRztBQUNaQyxFQUFBQSxJQUFJLEVBQUU7QUFDSkMsSUFBQUEsT0FBTyxFQUFFLE1BREw7QUFFSkMsSUFBQUEsYUFBYSxFQUFFLFFBRlg7QUFHSkMsSUFBQUEsS0FBSyxFQUFFLE1BSEg7QUFJSkMsSUFBQUEsTUFBTSxFQUFFLE1BSko7QUFLSkMsSUFBQUEsVUFBVSxFQUFFLEVBTFI7QUFNSkMsSUFBQUEsU0FBUyxFQUFFLFlBTlA7QUFPSkMsSUFBQUEsY0FBYyxFQUFFLGVBUFo7QUFRSkMsSUFBQUEsYUFBYSxFQUFDO0FBUlY7QUFETSxDQUFkO0FBY2UsU0FBU0MsT0FBVCxDQUFpQjtBQUFFQyxFQUFBQSxPQUFGO0FBQVdDLEVBQUFBLFFBQVg7QUFBcUJDLEVBQUFBLFNBQXJCO0FBQStCQyxFQUFBQTtBQUEvQixDQUFqQixFQUEyRDtBQUV4RSxTQUNFLEVBQUMsTUFBRDtBQUFRLElBQUEsRUFBRSxFQUFDO0FBQVgsS0FDRTtBQUFLLElBQUEsS0FBSyxFQUFFZCxLQUFLLENBQUNDO0FBQWxCLEtBQ0U7QUFBSyxJQUFBLEtBQUssRUFBRTtBQUFFYyxNQUFBQSxVQUFVLEVBQUUsQ0FBZDtBQUFpQmIsTUFBQUEsT0FBTyxFQUFDO0FBQXpCO0FBQVosS0FDR1MsT0FBTyxJQUFJQSxPQUFPLENBQUNLLE9BQW5CLElBQ0MsRUFBQyxPQUFEO0FBQ0UsSUFBQSxPQUFPLEVBQ0xMLE9BQU8sSUFDUEEsT0FBTyxDQUFDSyxPQURSLElBQ21CLEVBQ2pCLEdBQUdMLE9BQU8sQ0FBQ0ssT0FETTtBQUVqQkMsTUFBQUEsUUFBUSxFQUFFTixPQUFPLENBQUNNLFFBRkQ7QUFFVUMsTUFBQUEsS0FBSyxFQUFDO0FBRmhCO0FBSHZCLElBRkosQ0FERixFQWVFO0FBQUssSUFBQSxLQUFLLEVBQUU7QUFBRWhCLE1BQUFBLE9BQU8sRUFBRSxNQUFYO0FBQWtCaUIsTUFBQUEsV0FBVyxFQUFDLENBQTlCO0FBQWdDQyxNQUFBQSxZQUFZLEVBQUM7QUFBN0M7QUFBWixLQUNFLEVBQUMsTUFBRDtBQUNFLElBQUEsRUFBRSxFQUFDLFNBREw7QUFFRSxJQUFBLE9BQU8sRUFBRVAsU0FGWDtBQUdFLG1CQUFZLGFBSGQ7QUFJRSxJQUFBLEtBQUssRUFBQyxTQUpSO0FBS0UsSUFBQSxLQUFLLEVBQUU7QUFBRVEsTUFBQUEsSUFBSSxFQUFFLENBQVI7QUFBV0MsTUFBQUEsV0FBVyxFQUFFLENBQXhCO0FBQTJCQyxNQUFBQSxLQUFLLEVBQUU7QUFBbEM7QUFMVCxJQURGLEVBUUUsRUFBQyxXQUFEO0FBQ0UsSUFBQSxFQUFFLEVBQUMsUUFETDtBQUVFLElBQUEsT0FBTyxFQUFFWCxRQUZYO0FBR0UsbUJBQVksWUFIZDtBQUlFLElBQUEsS0FBSyxFQUFFO0FBQUVTLE1BQUFBLElBQUksRUFBRSxDQUFSO0FBQVdOLE1BQUFBLFVBQVUsRUFBRSxDQUF2QjtBQUEwQlEsTUFBQUEsS0FBSyxFQUFFO0FBQWpDLEtBSlQ7QUFLRSxJQUFBLE9BQU8sRUFBRVQ7QUFMWCxjQVJGLENBZkYsQ0FERixDQURGO0FBc0NEOzs7OyJ9
