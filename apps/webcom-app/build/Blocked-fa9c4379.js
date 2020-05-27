import { h } from './index-d17aa3cb.js';
import './style-918c9e16.js';
import { B as Block } from './Block-2dcf1cc0.js';

function Blocked({
  contact,
  setRoute
}) {
  const {
    username
  } = contact;
  return h("div", {
    className: "chat-state-view",
    "data-testid": "blocked"
  }, h("div", {
    style: {
      flex: 10,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      margin: 8 //  borderBottom: '4px solid white',

    }
  }, h(Block, {
    color: "red",
    width: 50,
    height: 50
  }), h("div", null, username), h("p", {
    style: {
      textAlign: 'center'
    }
  }, "You blocked ", h("b", null, username && username), ".You cannot communicate with someone you blocked.")), h("div", {
    style: {
      display: 'flex',
      flex: 1
    }
  }, h("button", {
    className: "btn"
  }, "Close"), h("button", {
    className: "btn unblock-btn"
  }, "Unblock")));
}

export default Blocked;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmxvY2tlZC1mYTljNDM3OS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3ZpZXdzL0Jsb2NrZWQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCAnLi9jc3Mvc3R5bGUuY3NzJztcclxuaW1wb3J0IHsgQmxvY2sgfSBmcm9tICcuLi8uLi9sYXlvdXQvaWNvbnMvQmxvY2snO1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBCbG9ja2VkKHsgY29udGFjdCxzZXRSb3V0ZSB9KSB7XHJcbiAgY29uc3QgeyB1c2VybmFtZSB9ID0gY29udGFjdDtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9J2NoYXQtc3RhdGUtdmlldycgZGF0YS10ZXN0aWQ9J2Jsb2NrZWQnPlxyXG4gICAgICA8ZGl2XHJcbiAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgIGZsZXg6IDEwLFxyXG4gICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxyXG4gICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXHJcbiAgICAgICAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcclxuICAgICAgICAgIG1hcmdpbjogOCxcclxuICAgICAgICAgIC8vICBib3JkZXJCb3R0b206ICc0cHggc29saWQgd2hpdGUnLFxyXG4gICAgICAgIH19XHJcbiAgICAgID5cclxuICAgICAgICA8QmxvY2sgY29sb3I9J3JlZCcgd2lkdGg9ezUwfSBoZWlnaHQ9ezUwfSAvPlxyXG4gICAgICAgIDxkaXY+e3VzZXJuYW1lfTwvZGl2PlxyXG4gICAgICAgIDxwIHN0eWxlPXt7IHRleHRBbGlnbjogJ2NlbnRlcicgfX0+XHJcbiAgICAgICAgICBZb3UgYmxvY2tlZCA8Yj57dXNlcm5hbWUgJiYgdXNlcm5hbWV9PC9iPi5Zb3UgY2Fubm90IGNvbW11bmljYXRlIHdpdGhcclxuICAgICAgICAgIHNvbWVvbmUgeW91IGJsb2NrZWQuXHJcbiAgICAgICAgPC9wPlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBmbGV4OiAxIH19PlxyXG4gICAgICAgIDxidXR0b24gY2xhc3NOYW1lPSdidG4nPkNsb3NlPC9idXR0b24+XHJcbiAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9J2J0biB1bmJsb2NrLWJ0bic+VW5ibG9jazwvYnV0dG9uPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIl0sIm5hbWVzIjpbIkJsb2NrZWQiLCJjb250YWN0Iiwic2V0Um91dGUiLCJ1c2VybmFtZSIsImZsZXgiLCJkaXNwbGF5IiwianVzdGlmeUNvbnRlbnQiLCJhbGlnbkl0ZW1zIiwiZmxleERpcmVjdGlvbiIsIm1hcmdpbiIsInRleHRBbGlnbiJdLCJtYXBwaW5ncyI6Ijs7OztBQUdlLFNBQVNBLE9BQVQsQ0FBaUI7QUFBRUMsRUFBQUEsT0FBRjtBQUFVQyxFQUFBQTtBQUFWLENBQWpCLEVBQXVDO0FBQ3BELFFBQU07QUFBRUMsSUFBQUE7QUFBRixNQUFlRixPQUFyQjtBQUNBLFNBQ0U7QUFBSyxJQUFBLFNBQVMsRUFBQyxpQkFBZjtBQUFpQyxtQkFBWTtBQUE3QyxLQUNFO0FBQ0UsSUFBQSxLQUFLLEVBQUU7QUFDTEcsTUFBQUEsSUFBSSxFQUFFLEVBREQ7QUFFTEMsTUFBQUEsT0FBTyxFQUFFLE1BRko7QUFHTEMsTUFBQUEsY0FBYyxFQUFFLFFBSFg7QUFJTEMsTUFBQUEsVUFBVSxFQUFFLFFBSlA7QUFLTEMsTUFBQUEsYUFBYSxFQUFFLFFBTFY7QUFNTEMsTUFBQUEsTUFBTSxFQUFFLENBTkg7O0FBQUE7QUFEVCxLQVdFLEVBQUMsS0FBRDtBQUFPLElBQUEsS0FBSyxFQUFDLEtBQWI7QUFBbUIsSUFBQSxLQUFLLEVBQUUsRUFBMUI7QUFBOEIsSUFBQSxNQUFNLEVBQUU7QUFBdEMsSUFYRixFQVlFLGVBQU1OLFFBQU4sQ0FaRixFQWFFO0FBQUcsSUFBQSxLQUFLLEVBQUU7QUFBRU8sTUFBQUEsU0FBUyxFQUFFO0FBQWI7QUFBVixxQkFDYyxhQUFJUCxRQUFRLElBQUlBLFFBQWhCLENBRGQsc0RBYkYsQ0FERixFQW9CRTtBQUFLLElBQUEsS0FBSyxFQUFFO0FBQUVFLE1BQUFBLE9BQU8sRUFBRSxNQUFYO0FBQW1CRCxNQUFBQSxJQUFJLEVBQUU7QUFBekI7QUFBWixLQUNFO0FBQVEsSUFBQSxTQUFTLEVBQUM7QUFBbEIsYUFERixFQUVFO0FBQVEsSUFBQSxTQUFTLEVBQUM7QUFBbEIsZUFGRixDQXBCRixDQURGO0FBMkJEOzs7OyJ9
