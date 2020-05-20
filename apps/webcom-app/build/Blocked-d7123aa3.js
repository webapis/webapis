import { h } from './index-e96aaf50.js';
import './style-5bc52604.js';
import { B as Block } from './Block-272060ff.js';

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmxvY2tlZC1kNzEyM2FhMy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY2xpZW50L2NoYXQvQmxvY2tlZC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0ICcuL2Nzcy9zdHlsZS5jc3MnO1xyXG5pbXBvcnQgeyBCbG9jayB9IGZyb20gJy4uL2xheW91dC9pY29ucy9CbG9jayc7XHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEJsb2NrZWQoeyBjb250YWN0LHNldFJvdXRlIH0pIHtcclxuICBjb25zdCB7IHVzZXJuYW1lIH0gPSBjb250YWN0O1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT0nY2hhdC1zdGF0ZS12aWV3JyBkYXRhLXRlc3RpZD0nYmxvY2tlZCc+XHJcbiAgICAgIDxkaXZcclxuICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgZmxleDogMTAsXHJcbiAgICAgICAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXHJcbiAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcclxuICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxyXG4gICAgICAgICAgbWFyZ2luOiA4LFxyXG4gICAgICAgICAgLy8gIGJvcmRlckJvdHRvbTogJzRweCBzb2xpZCB3aGl0ZScsXHJcbiAgICAgICAgfX1cclxuICAgICAgPlxyXG4gICAgICAgIDxCbG9jayBjb2xvcj0ncmVkJyB3aWR0aD17NTB9IGhlaWdodD17NTB9IC8+XHJcbiAgICAgICAgPGRpdj57dXNlcm5hbWV9PC9kaXY+XHJcbiAgICAgICAgPHAgc3R5bGU9e3sgdGV4dEFsaWduOiAnY2VudGVyJyB9fT5cclxuICAgICAgICAgIFlvdSBibG9ja2VkIDxiPnt1c2VybmFtZSAmJiB1c2VybmFtZX08L2I+LllvdSBjYW5ub3QgY29tbXVuaWNhdGUgd2l0aFxyXG4gICAgICAgICAgc29tZW9uZSB5b3UgYmxvY2tlZC5cclxuICAgICAgICA8L3A+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGZsZXg6IDEgfX0+XHJcbiAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9J2J0bic+Q2xvc2U8L2J1dHRvbj5cclxuICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT0nYnRuIHVuYmxvY2stYnRuJz5VbmJsb2NrPC9idXR0b24+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iXSwibmFtZXMiOlsiQmxvY2tlZCIsImNvbnRhY3QiLCJzZXRSb3V0ZSIsInVzZXJuYW1lIiwiZmxleCIsImRpc3BsYXkiLCJqdXN0aWZ5Q29udGVudCIsImFsaWduSXRlbXMiLCJmbGV4RGlyZWN0aW9uIiwibWFyZ2luIiwidGV4dEFsaWduIl0sIm1hcHBpbmdzIjoiOzs7O0FBR2UsU0FBU0EsT0FBVCxDQUFpQjtBQUFFQyxFQUFBQSxPQUFGO0FBQVVDLEVBQUFBO0FBQVYsQ0FBakIsRUFBdUM7QUFDcEQsUUFBTTtBQUFFQyxJQUFBQTtBQUFGLE1BQWVGLE9BQXJCO0FBQ0EsU0FDRTtBQUFLLElBQUEsU0FBUyxFQUFDLGlCQUFmO0FBQWlDLG1CQUFZO0FBQTdDLEtBQ0U7QUFDRSxJQUFBLEtBQUssRUFBRTtBQUNMRyxNQUFBQSxJQUFJLEVBQUUsRUFERDtBQUVMQyxNQUFBQSxPQUFPLEVBQUUsTUFGSjtBQUdMQyxNQUFBQSxjQUFjLEVBQUUsUUFIWDtBQUlMQyxNQUFBQSxVQUFVLEVBQUUsUUFKUDtBQUtMQyxNQUFBQSxhQUFhLEVBQUUsUUFMVjtBQU1MQyxNQUFBQSxNQUFNLEVBQUUsQ0FOSDs7QUFBQTtBQURULEtBV0UsRUFBQyxLQUFEO0FBQU8sSUFBQSxLQUFLLEVBQUMsS0FBYjtBQUFtQixJQUFBLEtBQUssRUFBRSxFQUExQjtBQUE4QixJQUFBLE1BQU0sRUFBRTtBQUF0QyxJQVhGLEVBWUUsZUFBTU4sUUFBTixDQVpGLEVBYUU7QUFBRyxJQUFBLEtBQUssRUFBRTtBQUFFTyxNQUFBQSxTQUFTLEVBQUU7QUFBYjtBQUFWLHFCQUNjLGFBQUlQLFFBQVEsSUFBSUEsUUFBaEIsQ0FEZCxzREFiRixDQURGLEVBb0JFO0FBQUssSUFBQSxLQUFLLEVBQUU7QUFBRUUsTUFBQUEsT0FBTyxFQUFFLE1BQVg7QUFBbUJELE1BQUFBLElBQUksRUFBRTtBQUF6QjtBQUFaLEtBQ0U7QUFBUSxJQUFBLFNBQVMsRUFBQztBQUFsQixhQURGLEVBRUU7QUFBUSxJQUFBLFNBQVMsRUFBQztBQUFsQixlQUZGLENBcEJGLENBREY7QUEyQkQ7Ozs7In0=
