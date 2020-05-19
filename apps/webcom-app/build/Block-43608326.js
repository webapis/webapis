import { h } from './index-59182f33.js';
import './style-93b3a421.js';

function Block({
  contact,
  setRoute
}) {
  const {
    username
  } = contact;
  return h("div", {
    className: "chat-state-view",
    "data-testid": "block"
  }, h("div", {
    style: {
      flex: 10
    }
  }, h("h5", null, "Block & report ", h("b", null, username)), h("div", null, username && username, " will not be able to message you any more.", ' ', h("a", {
    href: ""
  }, "Learn more here.")), h("p", null, h("input", {
    type: "checkbox",
    id: "report-checkbox"
  }), h("label", {
    for: "report-checkbox"
  }, "Also report"))), h("div", {
    style: {
      display: 'flex',
      flex: 1
    }
  }, h("button", {
    className: "btn"
  }, "Cancel"), h("button", {
    className: "btn btn-confirm"
  }, "Confirm")));
}

export default Block;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmxvY2stNDM2MDgzMjYuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9jaGF0L0Jsb2NrLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgJy4vY3NzL3N0eWxlLmNzcyc7XHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEJsb2NrKHsgY29udGFjdCxzZXRSb3V0ZSB9KSB7XHJcbiAgY29uc3QgeyB1c2VybmFtZSB9ID0gY29udGFjdDtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9J2NoYXQtc3RhdGUtdmlldycgZGF0YS10ZXN0aWQ9J2Jsb2NrJz5cclxuICAgICAgPGRpdiBzdHlsZT17eyBmbGV4OiAxMCB9fT5cclxuICAgICAgICA8aDU+XHJcbiAgICAgICAgICBCbG9jayAmIHJlcG9ydCA8Yj57dXNlcm5hbWV9PC9iPlxyXG4gICAgICAgIDwvaDU+XHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgIHt1c2VybmFtZSAmJiB1c2VybmFtZX0gd2lsbCBub3QgYmUgYWJsZSB0byBtZXNzYWdlIHlvdSBhbnkgbW9yZS57JyAnfVxyXG4gICAgICAgICAgPGEgaHJlZj0nJz5MZWFybiBtb3JlIGhlcmUuPC9hPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxwPlxyXG4gICAgICAgICAgPGlucHV0IHR5cGU9J2NoZWNrYm94JyBpZD0ncmVwb3J0LWNoZWNrYm94JyAvPlxyXG4gICAgICAgICAgPGxhYmVsIGZvcj0ncmVwb3J0LWNoZWNrYm94Jz5BbHNvIHJlcG9ydDwvbGFiZWw+XHJcbiAgICAgICAgPC9wPlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGZsZXg6IDEgfX0+XHJcbiAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9J2J0bic+Q2FuY2VsPC9idXR0b24+XHJcbiAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9J2J0biBidG4tY29uZmlybSc+Q29uZmlybTwvYnV0dG9uPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIl0sIm5hbWVzIjpbIkJsb2NrIiwiY29udGFjdCIsInNldFJvdXRlIiwidXNlcm5hbWUiLCJmbGV4IiwiZGlzcGxheSJdLCJtYXBwaW5ncyI6Ijs7O0FBRWUsU0FBU0EsS0FBVCxDQUFlO0FBQUVDLEVBQUFBLE9BQUY7QUFBVUMsRUFBQUE7QUFBVixDQUFmLEVBQXFDO0FBQ2xELFFBQU07QUFBRUMsSUFBQUE7QUFBRixNQUFlRixPQUFyQjtBQUNBLFNBQ0U7QUFBSyxJQUFBLFNBQVMsRUFBQyxpQkFBZjtBQUFpQyxtQkFBWTtBQUE3QyxLQUNFO0FBQUssSUFBQSxLQUFLLEVBQUU7QUFBRUcsTUFBQUEsSUFBSSxFQUFFO0FBQVI7QUFBWixLQUNFLGlDQUNpQixhQUFJRCxRQUFKLENBRGpCLENBREYsRUFJRSxlQUNHQSxRQUFRLElBQUlBLFFBRGYsZ0RBQ21FLEdBRG5FLEVBRUU7QUFBRyxJQUFBLElBQUksRUFBQztBQUFSLHdCQUZGLENBSkYsRUFRRSxhQUNFO0FBQU8sSUFBQSxJQUFJLEVBQUMsVUFBWjtBQUF1QixJQUFBLEVBQUUsRUFBQztBQUExQixJQURGLEVBRUU7QUFBTyxJQUFBLEdBQUcsRUFBQztBQUFYLG1CQUZGLENBUkYsQ0FERixFQWNFO0FBQUssSUFBQSxLQUFLLEVBQUU7QUFBRUUsTUFBQUEsT0FBTyxFQUFFLE1BQVg7QUFBbUJELE1BQUFBLElBQUksRUFBRTtBQUF6QjtBQUFaLEtBQ0U7QUFBUSxJQUFBLFNBQVMsRUFBQztBQUFsQixjQURGLEVBRUU7QUFBUSxJQUFBLFNBQVMsRUFBQztBQUFsQixlQUZGLENBZEYsQ0FERjtBQXFCRDs7OzsifQ==
