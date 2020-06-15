import { h } from './index-e3b74eca.js';
import { B as Button } from './Button-c30a17af.js';
import { L as Layout } from './Layout-27d678ce.js';
import { M as Message } from './Message-10276b41.js';

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW52aXRlci04OWNmNDRlZC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlLXVpL0ludml0ZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQge3VzZUVmZmVjdH0gZnJvbSAncHJlYWN0L2hvb2tzJ1xuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAnLi4vLi4vbGF5b3V0L0J1dHRvbic7XG5pbXBvcnQgeyBNZXNzYWdlIH0gZnJvbSAnLi4vdWkvTWVzc2FnZSc7XG5pbXBvcnQgeyBMYXlvdXQgfSBmcm9tICcuLi9zdGF0ZS11aS9MYXlvdXQnO1xuY29uc3Qgc3R5bGUgPSB7XG4gIHJvb3Q6IHtcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXG4gICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEludml0ZXIoeyBoYW5nb3V0LCBvbkFjY2VwdCwgb25EZWNsaW5lIH0pIHtcblxuICByZXR1cm4gKFxuICAgIDxMYXlvdXQgaWQ9XCJpbnZpdGVyLXVpXCI+XG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5yb290fT5cbiAgICAgICAgPGRpdiBzdHlsZT17eyBmbGV4OiAxLCBtYXJnaW5Ub3A6IDE2LCBtYXJnaW5MZWZ0OiA4IH19PlxuICAgICAgICAgIHtoYW5nb3V0ICYmIGhhbmdvdXQubWVzc2FnZSAmJiAoXG4gICAgICAgICAgICA8TWVzc2FnZSBtZXNzYWdlPXtoYW5nb3V0ICYmIGhhbmdvdXQubWVzc2FnZSAmJiBoYW5nb3V0Lm1lc3NhZ2V9IC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIHBhZGRpbmc6IDggfX0+XG4gICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgaWQ9XCJERUNMSU5FXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9e29uRGVjbGluZX1cbiAgICAgICAgICAgIHRpdGxlPVwiSWdub3JlXCJcbiAgICAgICAgICAgIHN0eWxlPXt7IGZsZXg6IDEsIG1hcmdpblJpZ2h0OiA0LCBjb2xvcjogJ3JlZCcgfX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgIGlkPVwiQUNDRVBUXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9e29uQWNjZXB0fVxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJhY2NlcHQtYnRuXCJcbiAgICAgICAgICAgIHRpdGxlPVwiQWNjZXB0XCJcbiAgICAgICAgICAgIHN0eWxlPXt7IGZsZXg6IDEsIG1hcmdpbkxlZnQ6IDQsIGNvbG9yOiAnZ3JlZW4nIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L0xheW91dD5cbiAgKTtcbn1cbiJdLCJuYW1lcyI6WyJzdHlsZSIsInJvb3QiLCJkaXNwbGF5IiwiZmxleERpcmVjdGlvbiIsImp1c3RpZnlDb250ZW50IiwiaGVpZ2h0IiwiSW52aXRlciIsImhhbmdvdXQiLCJvbkFjY2VwdCIsIm9uRGVjbGluZSIsImZsZXgiLCJtYXJnaW5Ub3AiLCJtYXJnaW5MZWZ0IiwibWVzc2FnZSIsInBhZGRpbmciLCJtYXJnaW5SaWdodCIsImNvbG9yIl0sIm1hcHBpbmdzIjoiOzs7OztBQUtBLE1BQU1BLEtBQUssR0FBRztBQUNaQyxFQUFBQSxJQUFJLEVBQUU7QUFDSkMsSUFBQUEsT0FBTyxFQUFFLE1BREw7QUFFSkMsSUFBQUEsYUFBYSxFQUFFLFFBRlg7QUFHSkMsSUFBQUEsY0FBYyxFQUFFLGVBSFo7QUFJSkMsSUFBQUEsTUFBTSxFQUFFO0FBSko7QUFETSxDQUFkO0FBU2UsU0FBU0MsT0FBVCxDQUFpQjtBQUFFQyxFQUFBQSxPQUFGO0FBQVdDLEVBQUFBLFFBQVg7QUFBcUJDLEVBQUFBO0FBQXJCLENBQWpCLEVBQW1EO0FBRWhFLFNBQ0UsRUFBQyxNQUFEO0FBQVEsSUFBQSxFQUFFLEVBQUM7QUFBWCxLQUNFO0FBQUssSUFBQSxLQUFLLEVBQUVULEtBQUssQ0FBQ0M7QUFBbEIsS0FDRTtBQUFLLElBQUEsS0FBSyxFQUFFO0FBQUVTLE1BQUFBLElBQUksRUFBRSxDQUFSO0FBQVdDLE1BQUFBLFNBQVMsRUFBRSxFQUF0QjtBQUEwQkMsTUFBQUEsVUFBVSxFQUFFO0FBQXRDO0FBQVosS0FDR0wsT0FBTyxJQUFJQSxPQUFPLENBQUNNLE9BQW5CLElBQ0MsRUFBQyxPQUFEO0FBQVMsSUFBQSxPQUFPLEVBQUVOLE9BQU8sSUFBSUEsT0FBTyxDQUFDTSxPQUFuQixJQUE4Qk4sT0FBTyxDQUFDTTtBQUF4RCxJQUZKLENBREYsRUFPRTtBQUFLLElBQUEsS0FBSyxFQUFFO0FBQUVYLE1BQUFBLE9BQU8sRUFBRSxNQUFYO0FBQW1CWSxNQUFBQSxPQUFPLEVBQUU7QUFBNUI7QUFBWixLQUNFLEVBQUMsTUFBRDtBQUNFLElBQUEsRUFBRSxFQUFDLFNBREw7QUFFRSxJQUFBLE9BQU8sRUFBRUwsU0FGWDtBQUdFLElBQUEsS0FBSyxFQUFDLFFBSFI7QUFJRSxJQUFBLEtBQUssRUFBRTtBQUFFQyxNQUFBQSxJQUFJLEVBQUUsQ0FBUjtBQUFXSyxNQUFBQSxXQUFXLEVBQUUsQ0FBeEI7QUFBMkJDLE1BQUFBLEtBQUssRUFBRTtBQUFsQztBQUpULElBREYsRUFPRSxFQUFDLE1BQUQ7QUFDRSxJQUFBLEVBQUUsRUFBQyxRQURMO0FBRUUsSUFBQSxPQUFPLEVBQUVSLFFBRlg7QUFHRSxtQkFBWSxZQUhkO0FBSUUsSUFBQSxLQUFLLEVBQUMsUUFKUjtBQUtFLElBQUEsS0FBSyxFQUFFO0FBQUVFLE1BQUFBLElBQUksRUFBRSxDQUFSO0FBQVdFLE1BQUFBLFVBQVUsRUFBRSxDQUF2QjtBQUEwQkksTUFBQUEsS0FBSyxFQUFFO0FBQWpDO0FBTFQsSUFQRixDQVBGLENBREYsQ0FERjtBQTJCRDs7OzsifQ==
