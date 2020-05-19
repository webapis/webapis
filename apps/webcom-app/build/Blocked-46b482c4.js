import { h } from './index-5ddb3fa4.js';
import './style-f52267e7.js';
import { B as Block } from './Block-15da604d.js';

function Blocked({
  contact
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmxvY2tlZC00NmI0ODJjNC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY2xpZW50L2NoYXQvQmxvY2tlZC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0ICcuL2Nzcy9zdHlsZS5jc3MnO1xyXG5pbXBvcnQgeyBCbG9jayB9IGZyb20gJy4uL2xheW91dC9pY29ucy9CbG9jayc7XHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEJsb2NrZWQoeyBjb250YWN0IH0pIHtcclxuICBjb25zdCB7IHVzZXJuYW1lIH0gPSBjb250YWN0O1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT0nY2hhdC1zdGF0ZS12aWV3JyBkYXRhLXRlc3RpZD0nYmxvY2tlZCc+XHJcbiAgICAgIDxkaXZcclxuICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgZmxleDogMTAsXHJcbiAgICAgICAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXHJcbiAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcclxuICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxyXG4gICAgICAgICAgbWFyZ2luOiA4LFxyXG4gICAgICAgICAgLy8gIGJvcmRlckJvdHRvbTogJzRweCBzb2xpZCB3aGl0ZScsXHJcbiAgICAgICAgfX1cclxuICAgICAgPlxyXG4gICAgICAgIDxCbG9jayBjb2xvcj0ncmVkJyB3aWR0aD17NTB9IGhlaWdodD17NTB9IC8+XHJcbiAgICAgICAgPGRpdj57dXNlcm5hbWV9PC9kaXY+XHJcbiAgICAgICAgPHAgc3R5bGU9e3sgdGV4dEFsaWduOiAnY2VudGVyJyB9fT5cclxuICAgICAgICAgIFlvdSBibG9ja2VkIDxiPnt1c2VybmFtZSAmJiB1c2VybmFtZX08L2I+LllvdSBjYW5ub3QgY29tbXVuaWNhdGUgd2l0aFxyXG4gICAgICAgICAgc29tZW9uZSB5b3UgYmxvY2tlZC5cclxuICAgICAgICA8L3A+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGZsZXg6IDEgfX0+XHJcbiAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9J2J0bic+Q2xvc2U8L2J1dHRvbj5cclxuICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT0nYnRuIHVuYmxvY2stYnRuJz5VbmJsb2NrPC9idXR0b24+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iXSwibmFtZXMiOlsiQmxvY2tlZCIsImNvbnRhY3QiLCJ1c2VybmFtZSIsImZsZXgiLCJkaXNwbGF5IiwianVzdGlmeUNvbnRlbnQiLCJhbGlnbkl0ZW1zIiwiZmxleERpcmVjdGlvbiIsIm1hcmdpbiIsInRleHRBbGlnbiJdLCJtYXBwaW5ncyI6Ijs7OztBQUdlLFNBQVNBLE9BQVQsQ0FBaUI7QUFBRUMsRUFBQUE7QUFBRixDQUFqQixFQUE4QjtBQUMzQyxRQUFNO0FBQUVDLElBQUFBO0FBQUYsTUFBZUQsT0FBckI7QUFDQSxTQUNFO0FBQUssSUFBQSxTQUFTLEVBQUMsaUJBQWY7QUFBaUMsbUJBQVk7QUFBN0MsS0FDRTtBQUNFLElBQUEsS0FBSyxFQUFFO0FBQ0xFLE1BQUFBLElBQUksRUFBRSxFQUREO0FBRUxDLE1BQUFBLE9BQU8sRUFBRSxNQUZKO0FBR0xDLE1BQUFBLGNBQWMsRUFBRSxRQUhYO0FBSUxDLE1BQUFBLFVBQVUsRUFBRSxRQUpQO0FBS0xDLE1BQUFBLGFBQWEsRUFBRSxRQUxWO0FBTUxDLE1BQUFBLE1BQU0sRUFBRSxDQU5IOztBQUFBO0FBRFQsS0FXRSxFQUFDLEtBQUQ7QUFBTyxJQUFBLEtBQUssRUFBQyxLQUFiO0FBQW1CLElBQUEsS0FBSyxFQUFFLEVBQTFCO0FBQThCLElBQUEsTUFBTSxFQUFFO0FBQXRDLElBWEYsRUFZRSxlQUFNTixRQUFOLENBWkYsRUFhRTtBQUFHLElBQUEsS0FBSyxFQUFFO0FBQUVPLE1BQUFBLFNBQVMsRUFBRTtBQUFiO0FBQVYscUJBQ2MsYUFBSVAsUUFBUSxJQUFJQSxRQUFoQixDQURkLHNEQWJGLENBREYsRUFvQkU7QUFBSyxJQUFBLEtBQUssRUFBRTtBQUFFRSxNQUFBQSxPQUFPLEVBQUUsTUFBWDtBQUFtQkQsTUFBQUEsSUFBSSxFQUFFO0FBQXpCO0FBQVosS0FDRTtBQUFRLElBQUEsU0FBUyxFQUFDO0FBQWxCLGFBREYsRUFFRTtBQUFRLElBQUEsU0FBUyxFQUFDO0FBQWxCLGVBRkYsQ0FwQkYsQ0FERjtBQTJCRDs7OzsifQ==
