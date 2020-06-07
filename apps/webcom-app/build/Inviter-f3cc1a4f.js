import { h } from './index-76b78df2.js';
import { B as Button } from './Button-48721d0a.js';
import { L as Layout } from './Layout-793eefe0.js';
import { M as Message } from './Message-90045ec2.js';

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
  const message = { ...hangout.message,
    username: hangout.username
  };
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
  }, h(Message, {
    message: message && message
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW52aXRlci1mM2NjMWE0Zi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlLXVpL0ludml0ZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4uLy4uL2xheW91dC9CdXR0b24nO1xyXG5pbXBvcnQgeyBNZXNzYWdlIH0gZnJvbSAnLi4vdWkvTWVzc2FnZSc7XHJcbmltcG9ydCB7IExheW91dCB9IGZyb20gJy4uL3N0YXRlLXVpL0xheW91dCc7XHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gIHJvb3Q6IHtcclxuICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxyXG4gICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcclxuICAgIGhlaWdodDogJzEwMCUnLFxyXG4gIH0sXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBJbnZpdGVyKHsgaGFuZ291dCwgb25BY2NlcHQsIG9uRGVjbGluZSB9KSB7XHJcbiAgY29uc3QgbWVzc2FnZSA9IHsgLi4uaGFuZ291dC5tZXNzYWdlLCB1c2VybmFtZTogaGFuZ291dC51c2VybmFtZSB9XHJcbiAgcmV0dXJuIChcclxuICAgIDxMYXlvdXQgaWQ9J2ludml0ZXItdWknPlxyXG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5yb290fT5cclxuICAgICAgICA8ZGl2IHN0eWxlPXt7IGZsZXg6IDEsIG1hcmdpblRvcDogMTYsIG1hcmdpbkxlZnQ6IDggfX0+XHJcbiAgICAgICAgICA8TWVzc2FnZVxyXG4gICAgICAgICAgICBtZXNzYWdlPXttZXNzYWdlICYmIG1lc3NhZ2V9XHJcblxyXG4gICAgICAgICAgLz5cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIHBhZGRpbmc6IDggfX0+XHJcbiAgICAgICAgICA8QnV0dG9uXHJcbiAgICAgICAgICAgIGlkPVwiREVDTElORVwiXHJcbiAgICAgICAgICAgIG9uQ2xpY2s9e29uRGVjbGluZX1cclxuICAgICAgICAgICAgdGl0bGU9XCJJZ25vcmVcIlxyXG4gICAgICAgICAgICBzdHlsZT17eyBmbGV4OiAxLCBtYXJnaW5SaWdodDogNCwgY29sb3I6ICdyZWQnIH19XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgICAgPEJ1dHRvblxyXG4gICAgICAgICAgICBpZD1cIkFDQ0VQVFwiXHJcbiAgICAgICAgICAgIG9uQ2xpY2s9e29uQWNjZXB0fVxyXG4gICAgICAgICAgICBkYXRhLXRlc3RpZD0nYWNjZXB0LWJ0bidcclxuICAgICAgICAgICAgdGl0bGU9XCJBY2NlcHRcIlxyXG4gICAgICAgICAgICBzdHlsZT17eyBmbGV4OiAxLCBtYXJnaW5MZWZ0OiA0LCBjb2xvcjogJ2dyZWVuJyB9fVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L0xheW91dD5cclxuICApO1xyXG59XHJcbiJdLCJuYW1lcyI6WyJzdHlsZSIsInJvb3QiLCJkaXNwbGF5IiwiZmxleERpcmVjdGlvbiIsImp1c3RpZnlDb250ZW50IiwiaGVpZ2h0IiwiSW52aXRlciIsImhhbmdvdXQiLCJvbkFjY2VwdCIsIm9uRGVjbGluZSIsIm1lc3NhZ2UiLCJ1c2VybmFtZSIsImZsZXgiLCJtYXJnaW5Ub3AiLCJtYXJnaW5MZWZ0IiwicGFkZGluZyIsIm1hcmdpblJpZ2h0IiwiY29sb3IiXSwibWFwcGluZ3MiOiI7Ozs7O0FBSUEsTUFBTUEsS0FBSyxHQUFHO0FBQ1pDLEVBQUFBLElBQUksRUFBRTtBQUNKQyxJQUFBQSxPQUFPLEVBQUUsTUFETDtBQUVKQyxJQUFBQSxhQUFhLEVBQUUsUUFGWDtBQUdKQyxJQUFBQSxjQUFjLEVBQUUsZUFIWjtBQUlKQyxJQUFBQSxNQUFNLEVBQUU7QUFKSjtBQURNLENBQWQ7QUFTZSxTQUFTQyxPQUFULENBQWlCO0FBQUVDLEVBQUFBLE9BQUY7QUFBV0MsRUFBQUEsUUFBWDtBQUFxQkMsRUFBQUE7QUFBckIsQ0FBakIsRUFBbUQ7QUFDaEUsUUFBTUMsT0FBTyxHQUFHLEVBQUUsR0FBR0gsT0FBTyxDQUFDRyxPQUFiO0FBQXNCQyxJQUFBQSxRQUFRLEVBQUVKLE9BQU8sQ0FBQ0k7QUFBeEMsR0FBaEI7QUFDQSxTQUNFLEVBQUMsTUFBRDtBQUFRLElBQUEsRUFBRSxFQUFDO0FBQVgsS0FDRTtBQUFLLElBQUEsS0FBSyxFQUFFWCxLQUFLLENBQUNDO0FBQWxCLEtBQ0U7QUFBSyxJQUFBLEtBQUssRUFBRTtBQUFFVyxNQUFBQSxJQUFJLEVBQUUsQ0FBUjtBQUFXQyxNQUFBQSxTQUFTLEVBQUUsRUFBdEI7QUFBMEJDLE1BQUFBLFVBQVUsRUFBRTtBQUF0QztBQUFaLEtBQ0UsRUFBQyxPQUFEO0FBQ0UsSUFBQSxPQUFPLEVBQUVKLE9BQU8sSUFBSUE7QUFEdEIsSUFERixDQURGLEVBUUU7QUFBSyxJQUFBLEtBQUssRUFBRTtBQUFFUixNQUFBQSxPQUFPLEVBQUUsTUFBWDtBQUFtQmEsTUFBQUEsT0FBTyxFQUFFO0FBQTVCO0FBQVosS0FDRSxFQUFDLE1BQUQ7QUFDRSxJQUFBLEVBQUUsRUFBQyxTQURMO0FBRUUsSUFBQSxPQUFPLEVBQUVOLFNBRlg7QUFHRSxJQUFBLEtBQUssRUFBQyxRQUhSO0FBSUUsSUFBQSxLQUFLLEVBQUU7QUFBRUcsTUFBQUEsSUFBSSxFQUFFLENBQVI7QUFBV0ksTUFBQUEsV0FBVyxFQUFFLENBQXhCO0FBQTJCQyxNQUFBQSxLQUFLLEVBQUU7QUFBbEM7QUFKVCxJQURGLEVBT0UsRUFBQyxNQUFEO0FBQ0UsSUFBQSxFQUFFLEVBQUMsUUFETDtBQUVFLElBQUEsT0FBTyxFQUFFVCxRQUZYO0FBR0UsbUJBQVksWUFIZDtBQUlFLElBQUEsS0FBSyxFQUFDLFFBSlI7QUFLRSxJQUFBLEtBQUssRUFBRTtBQUFFSSxNQUFBQSxJQUFJLEVBQUUsQ0FBUjtBQUFXRSxNQUFBQSxVQUFVLEVBQUUsQ0FBdkI7QUFBMEJHLE1BQUFBLEtBQUssRUFBRTtBQUFqQztBQUxULElBUEYsQ0FSRixDQURGLENBREY7QUE0QkQ7Ozs7In0=