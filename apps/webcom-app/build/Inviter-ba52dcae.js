import { h } from './index-5fd01c0e.js';
import './style-fdaa0fdb.js';

function Inviter({
  accept_inv_img,
  contact
}) {
  const {
    message,
    username
  } = contact;
  return h("div", {
    className: "chat-state-view",
    "data-testid": "inviter"
  }, h("div", {
    style: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      margin: 8 //  borderBottom: '4px solid white',

    }
  }, h("img", {
    src: accept_inv_img,
    style: {
      width: 100
    }
  }), h("div", null, username && username)), h("hr", {
    style: {
      width: '99%'
    }
  }), h("div", {
    style: {
      flex: 5,
      backgroundColor: '#eeeeee'
    }
  }, h(Message, {
    message: message && message
  })), h("div", {
    style: {
      display: 'flex',
      flex: 1
    }
  }, h("button", {
    className: "btn ignore-btn"
  }, "Ignore"), h("button", {
    className: "btn accept-btn"
  }, "Accept")));
}

function Message({
  message
}) {
  return h("div", {
    style: {
      //   backgroundColor: 'yellow',
      marginTop: 15,
      marginLeft: 15,
      padding: 8
    }
  }, h("div", {
    style: {
      backgroundColor: '#ffffff',
      display: 'inline',
      paddingLeft: 16,
      paddingRight: 16,
      paddingTop: 8,
      paddingBottom: 8,
      borderRadius: 10,
      fontSize: 13
    }
  }, message && message.text), h("div", {
    style: {
      paddingLeft: 16,
      marginTop: 8,
      colod: '#737373',
      fontSize: 10
    }
  }, message && message.datetime));
}

export default Inviter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW52aXRlci1iYTUyZGNhZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3ZpZXdzL0ludml0ZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCAnLi9jc3Mvc3R5bGUuY3NzJztcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSW52aXRlcih7IGFjY2VwdF9pbnZfaW1nLCBjb250YWN0IH0pIHtcclxuICBjb25zdCB7IG1lc3NhZ2UsIHVzZXJuYW1lIH0gPSBjb250YWN0O1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT0nY2hhdC1zdGF0ZS12aWV3JyBkYXRhLXRlc3RpZD0naW52aXRlcic+XHJcbiAgICAgIDxkaXZcclxuICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgZmxleDogMSxcclxuICAgICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcclxuICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxyXG4gICAgICAgICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXHJcbiAgICAgICAgICBtYXJnaW46IDgsXHJcbiAgICAgICAgICAvLyAgYm9yZGVyQm90dG9tOiAnNHB4IHNvbGlkIHdoaXRlJyxcclxuICAgICAgICB9fVxyXG4gICAgICA+XHJcbiAgICAgICAgPGltZyBzcmM9e2FjY2VwdF9pbnZfaW1nfSBzdHlsZT17eyB3aWR0aDogMTAwIH19IC8+XHJcbiAgICAgICAgPGRpdj57dXNlcm5hbWUgJiYgdXNlcm5hbWV9PC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8aHIgc3R5bGU9e3sgd2lkdGg6ICc5OSUnIH19IC8+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3sgZmxleDogNSwgYmFja2dyb3VuZENvbG9yOiAnI2VlZWVlZScgfX0+XHJcbiAgICAgICAgPE1lc3NhZ2UgbWVzc2FnZT17bWVzc2FnZSAmJiBtZXNzYWdlfSAvPlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBmbGV4OiAxIH19PlxyXG4gICAgICAgIDxidXR0b24gY2xhc3NOYW1lPSdidG4gaWdub3JlLWJ0bic+SWdub3JlPC9idXR0b24+XHJcbiAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9J2J0biBhY2NlcHQtYnRuJz5BY2NlcHQ8L2J1dHRvbj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBNZXNzYWdlKHsgbWVzc2FnZSB9KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgc3R5bGU9e3tcclxuICAgICAgICAvLyAgIGJhY2tncm91bmRDb2xvcjogJ3llbGxvdycsXHJcbiAgICAgICAgbWFyZ2luVG9wOiAxNSxcclxuICAgICAgICBtYXJnaW5MZWZ0OiAxNSxcclxuICAgICAgICBwYWRkaW5nOiA4LFxyXG4gICAgICB9fVxyXG4gICAgPlxyXG4gICAgICA8ZGl2XHJcbiAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJyNmZmZmZmYnLFxyXG4gICAgICAgICAgZGlzcGxheTogJ2lubGluZScsXHJcbiAgICAgICAgICBwYWRkaW5nTGVmdDogMTYsXHJcbiAgICAgICAgICBwYWRkaW5nUmlnaHQ6IDE2LFxyXG4gICAgICAgICAgcGFkZGluZ1RvcDogOCxcclxuICAgICAgICAgIHBhZGRpbmdCb3R0b206IDgsXHJcbiAgICAgICAgICBib3JkZXJSYWRpdXM6IDEwLFxyXG4gICAgICAgICAgZm9udFNpemU6IDEzLFxyXG4gICAgICAgIH19XHJcbiAgICAgID5cclxuICAgICAgICB7bWVzc2FnZSAmJiBtZXNzYWdlLnRleHR9XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8ZGl2XHJcbiAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgIHBhZGRpbmdMZWZ0OiAxNixcclxuICAgICAgICAgIG1hcmdpblRvcDogOCxcclxuICAgICAgICAgIGNvbG9kOiAnIzczNzM3MycsXHJcbiAgICAgICAgICBmb250U2l6ZTogMTAsXHJcbiAgICAgICAgfX1cclxuICAgICAgPlxyXG4gICAgICAgIHttZXNzYWdlICYmIG1lc3NhZ2UuZGF0ZXRpbWV9XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iXSwibmFtZXMiOlsiSW52aXRlciIsImFjY2VwdF9pbnZfaW1nIiwiY29udGFjdCIsIm1lc3NhZ2UiLCJ1c2VybmFtZSIsImZsZXgiLCJkaXNwbGF5IiwianVzdGlmeUNvbnRlbnQiLCJhbGlnbkl0ZW1zIiwiZmxleERpcmVjdGlvbiIsIm1hcmdpbiIsIndpZHRoIiwiYmFja2dyb3VuZENvbG9yIiwiTWVzc2FnZSIsIm1hcmdpblRvcCIsIm1hcmdpbkxlZnQiLCJwYWRkaW5nIiwicGFkZGluZ0xlZnQiLCJwYWRkaW5nUmlnaHQiLCJwYWRkaW5nVG9wIiwicGFkZGluZ0JvdHRvbSIsImJvcmRlclJhZGl1cyIsImZvbnRTaXplIiwidGV4dCIsImNvbG9kIiwiZGF0ZXRpbWUiXSwibWFwcGluZ3MiOiI7OztBQUVlLFNBQVNBLE9BQVQsQ0FBaUI7QUFBRUMsRUFBQUEsY0FBRjtBQUFrQkMsRUFBQUE7QUFBbEIsQ0FBakIsRUFBOEM7QUFDM0QsUUFBTTtBQUFFQyxJQUFBQSxPQUFGO0FBQVdDLElBQUFBO0FBQVgsTUFBd0JGLE9BQTlCO0FBQ0EsU0FDRTtBQUFLLElBQUEsU0FBUyxFQUFDLGlCQUFmO0FBQWlDLG1CQUFZO0FBQTdDLEtBQ0U7QUFDRSxJQUFBLEtBQUssRUFBRTtBQUNMRyxNQUFBQSxJQUFJLEVBQUUsQ0FERDtBQUVMQyxNQUFBQSxPQUFPLEVBQUUsTUFGSjtBQUdMQyxNQUFBQSxjQUFjLEVBQUUsUUFIWDtBQUlMQyxNQUFBQSxVQUFVLEVBQUUsUUFKUDtBQUtMQyxNQUFBQSxhQUFhLEVBQUUsUUFMVjtBQU1MQyxNQUFBQSxNQUFNLEVBQUUsQ0FOSDs7QUFBQTtBQURULEtBV0U7QUFBSyxJQUFBLEdBQUcsRUFBRVQsY0FBVjtBQUEwQixJQUFBLEtBQUssRUFBRTtBQUFFVSxNQUFBQSxLQUFLLEVBQUU7QUFBVDtBQUFqQyxJQVhGLEVBWUUsZUFBTVAsUUFBUSxJQUFJQSxRQUFsQixDQVpGLENBREYsRUFlRTtBQUFJLElBQUEsS0FBSyxFQUFFO0FBQUVPLE1BQUFBLEtBQUssRUFBRTtBQUFUO0FBQVgsSUFmRixFQWdCRTtBQUFLLElBQUEsS0FBSyxFQUFFO0FBQUVOLE1BQUFBLElBQUksRUFBRSxDQUFSO0FBQVdPLE1BQUFBLGVBQWUsRUFBRTtBQUE1QjtBQUFaLEtBQ0UsRUFBQyxPQUFEO0FBQVMsSUFBQSxPQUFPLEVBQUVULE9BQU8sSUFBSUE7QUFBN0IsSUFERixDQWhCRixFQW9CRTtBQUFLLElBQUEsS0FBSyxFQUFFO0FBQUVHLE1BQUFBLE9BQU8sRUFBRSxNQUFYO0FBQW1CRCxNQUFBQSxJQUFJLEVBQUU7QUFBekI7QUFBWixLQUNFO0FBQVEsSUFBQSxTQUFTLEVBQUM7QUFBbEIsY0FERixFQUVFO0FBQVEsSUFBQSxTQUFTLEVBQUM7QUFBbEIsY0FGRixDQXBCRixDQURGO0FBMkJEOztBQUVELFNBQVNRLE9BQVQsQ0FBaUI7QUFBRVYsRUFBQUE7QUFBRixDQUFqQixFQUE4QjtBQUM1QixTQUNFO0FBQ0UsSUFBQSxLQUFLLEVBQUU7QUFDTDtBQUNBVyxNQUFBQSxTQUFTLEVBQUUsRUFGTjtBQUdMQyxNQUFBQSxVQUFVLEVBQUUsRUFIUDtBQUlMQyxNQUFBQSxPQUFPLEVBQUU7QUFKSjtBQURULEtBUUU7QUFDRSxJQUFBLEtBQUssRUFBRTtBQUNMSixNQUFBQSxlQUFlLEVBQUUsU0FEWjtBQUVMTixNQUFBQSxPQUFPLEVBQUUsUUFGSjtBQUdMVyxNQUFBQSxXQUFXLEVBQUUsRUFIUjtBQUlMQyxNQUFBQSxZQUFZLEVBQUUsRUFKVDtBQUtMQyxNQUFBQSxVQUFVLEVBQUUsQ0FMUDtBQU1MQyxNQUFBQSxhQUFhLEVBQUUsQ0FOVjtBQU9MQyxNQUFBQSxZQUFZLEVBQUUsRUFQVDtBQVFMQyxNQUFBQSxRQUFRLEVBQUU7QUFSTDtBQURULEtBWUduQixPQUFPLElBQUlBLE9BQU8sQ0FBQ29CLElBWnRCLENBUkYsRUFzQkU7QUFDRSxJQUFBLEtBQUssRUFBRTtBQUNMTixNQUFBQSxXQUFXLEVBQUUsRUFEUjtBQUVMSCxNQUFBQSxTQUFTLEVBQUUsQ0FGTjtBQUdMVSxNQUFBQSxLQUFLLEVBQUUsU0FIRjtBQUlMRixNQUFBQSxRQUFRLEVBQUU7QUFKTDtBQURULEtBUUduQixPQUFPLElBQUlBLE9BQU8sQ0FBQ3NCLFFBUnRCLENBdEJGLENBREY7QUFtQ0Q7Ozs7In0=
