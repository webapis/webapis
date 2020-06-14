import { h } from './index-b9ed463d.js';
import { B as Button } from './Button-073e1ab0.js';
import { L as Layout } from './Layout-c5b7af55.js';
import { M as Message } from './Message-e683fb92.js';

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW52aXRlci0zZGNiYjRkYS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlLXVpL0ludml0ZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7dXNlRWZmZWN0fSBmcm9tICdwcmVhY3QvaG9va3MnXHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4uLy4uL2xheW91dC9CdXR0b24nO1xyXG5pbXBvcnQgeyBNZXNzYWdlIH0gZnJvbSAnLi4vdWkvTWVzc2FnZSc7XHJcbmltcG9ydCB7IExheW91dCB9IGZyb20gJy4uL3N0YXRlLXVpL0xheW91dCc7XHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gIHJvb3Q6IHtcclxuICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxyXG4gICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcclxuICAgIGhlaWdodDogJzEwMCUnLFxyXG4gIH0sXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBJbnZpdGVyKHsgaGFuZ291dCwgb25BY2NlcHQsIG9uRGVjbGluZSB9KSB7XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8TGF5b3V0IGlkPVwiaW52aXRlci11aVwiPlxyXG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5yb290fT5cclxuICAgICAgICA8ZGl2IHN0eWxlPXt7IGZsZXg6IDEsIG1hcmdpblRvcDogMTYsIG1hcmdpbkxlZnQ6IDggfX0+XHJcbiAgICAgICAgICB7aGFuZ291dCAmJiBoYW5nb3V0Lm1lc3NhZ2UgJiYgKFxyXG4gICAgICAgICAgICA8TWVzc2FnZSBtZXNzYWdlPXtoYW5nb3V0ICYmIGhhbmdvdXQubWVzc2FnZSAmJiBoYW5nb3V0Lm1lc3NhZ2V9IC8+XHJcbiAgICAgICAgICApfVxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgcGFkZGluZzogOCB9fT5cclxuICAgICAgICAgIDxCdXR0b25cclxuICAgICAgICAgICAgaWQ9XCJERUNMSU5FXCJcclxuICAgICAgICAgICAgb25DbGljaz17b25EZWNsaW5lfVxyXG4gICAgICAgICAgICB0aXRsZT1cIklnbm9yZVwiXHJcbiAgICAgICAgICAgIHN0eWxlPXt7IGZsZXg6IDEsIG1hcmdpblJpZ2h0OiA0LCBjb2xvcjogJ3JlZCcgfX1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgICA8QnV0dG9uXHJcbiAgICAgICAgICAgIGlkPVwiQUNDRVBUXCJcclxuICAgICAgICAgICAgb25DbGljaz17b25BY2NlcHR9XHJcbiAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwiYWNjZXB0LWJ0blwiXHJcbiAgICAgICAgICAgIHRpdGxlPVwiQWNjZXB0XCJcclxuICAgICAgICAgICAgc3R5bGU9e3sgZmxleDogMSwgbWFyZ2luTGVmdDogNCwgY29sb3I6ICdncmVlbicgfX1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9MYXlvdXQ+XHJcbiAgKTtcclxufVxyXG4iXSwibmFtZXMiOlsic3R5bGUiLCJyb290IiwiZGlzcGxheSIsImZsZXhEaXJlY3Rpb24iLCJqdXN0aWZ5Q29udGVudCIsImhlaWdodCIsIkludml0ZXIiLCJoYW5nb3V0Iiwib25BY2NlcHQiLCJvbkRlY2xpbmUiLCJmbGV4IiwibWFyZ2luVG9wIiwibWFyZ2luTGVmdCIsIm1lc3NhZ2UiLCJwYWRkaW5nIiwibWFyZ2luUmlnaHQiLCJjb2xvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFLQSxNQUFNQSxLQUFLLEdBQUc7QUFDWkMsRUFBQUEsSUFBSSxFQUFFO0FBQ0pDLElBQUFBLE9BQU8sRUFBRSxNQURMO0FBRUpDLElBQUFBLGFBQWEsRUFBRSxRQUZYO0FBR0pDLElBQUFBLGNBQWMsRUFBRSxlQUhaO0FBSUpDLElBQUFBLE1BQU0sRUFBRTtBQUpKO0FBRE0sQ0FBZDtBQVNlLFNBQVNDLE9BQVQsQ0FBaUI7QUFBRUMsRUFBQUEsT0FBRjtBQUFXQyxFQUFBQSxRQUFYO0FBQXFCQyxFQUFBQTtBQUFyQixDQUFqQixFQUFtRDtBQUVoRSxTQUNFLEVBQUMsTUFBRDtBQUFRLElBQUEsRUFBRSxFQUFDO0FBQVgsS0FDRTtBQUFLLElBQUEsS0FBSyxFQUFFVCxLQUFLLENBQUNDO0FBQWxCLEtBQ0U7QUFBSyxJQUFBLEtBQUssRUFBRTtBQUFFUyxNQUFBQSxJQUFJLEVBQUUsQ0FBUjtBQUFXQyxNQUFBQSxTQUFTLEVBQUUsRUFBdEI7QUFBMEJDLE1BQUFBLFVBQVUsRUFBRTtBQUF0QztBQUFaLEtBQ0dMLE9BQU8sSUFBSUEsT0FBTyxDQUFDTSxPQUFuQixJQUNDLEVBQUMsT0FBRDtBQUFTLElBQUEsT0FBTyxFQUFFTixPQUFPLElBQUlBLE9BQU8sQ0FBQ00sT0FBbkIsSUFBOEJOLE9BQU8sQ0FBQ007QUFBeEQsSUFGSixDQURGLEVBT0U7QUFBSyxJQUFBLEtBQUssRUFBRTtBQUFFWCxNQUFBQSxPQUFPLEVBQUUsTUFBWDtBQUFtQlksTUFBQUEsT0FBTyxFQUFFO0FBQTVCO0FBQVosS0FDRSxFQUFDLE1BQUQ7QUFDRSxJQUFBLEVBQUUsRUFBQyxTQURMO0FBRUUsSUFBQSxPQUFPLEVBQUVMLFNBRlg7QUFHRSxJQUFBLEtBQUssRUFBQyxRQUhSO0FBSUUsSUFBQSxLQUFLLEVBQUU7QUFBRUMsTUFBQUEsSUFBSSxFQUFFLENBQVI7QUFBV0ssTUFBQUEsV0FBVyxFQUFFLENBQXhCO0FBQTJCQyxNQUFBQSxLQUFLLEVBQUU7QUFBbEM7QUFKVCxJQURGLEVBT0UsRUFBQyxNQUFEO0FBQ0UsSUFBQSxFQUFFLEVBQUMsUUFETDtBQUVFLElBQUEsT0FBTyxFQUFFUixRQUZYO0FBR0UsbUJBQVksWUFIZDtBQUlFLElBQUEsS0FBSyxFQUFDLFFBSlI7QUFLRSxJQUFBLEtBQUssRUFBRTtBQUFFRSxNQUFBQSxJQUFJLEVBQUUsQ0FBUjtBQUFXRSxNQUFBQSxVQUFVLEVBQUUsQ0FBdkI7QUFBMEJJLE1BQUFBLEtBQUssRUFBRTtBQUFqQztBQUxULElBUEYsQ0FQRixDQURGLENBREY7QUEyQkQ7Ozs7In0=
