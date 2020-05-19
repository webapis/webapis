import { h } from './index-5ddb3fa4.js';
import './style-f52267e7.js';

function Block({
  contact
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmxvY2stYjMwZjA0Y2EuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9jaGF0L0Jsb2NrLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgJy4vY3NzL3N0eWxlLmNzcyc7XHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEJsb2NrKHsgY29udGFjdCB9KSB7XHJcbiAgY29uc3QgeyB1c2VybmFtZSB9ID0gY29udGFjdDtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9J2NoYXQtc3RhdGUtdmlldycgZGF0YS10ZXN0aWQ9J2Jsb2NrJz5cclxuICAgICAgPGRpdiBzdHlsZT17eyBmbGV4OiAxMCB9fT5cclxuICAgICAgICA8aDU+XHJcbiAgICAgICAgICBCbG9jayAmIHJlcG9ydCA8Yj57dXNlcm5hbWV9PC9iPlxyXG4gICAgICAgIDwvaDU+XHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgIHt1c2VybmFtZSAmJiB1c2VybmFtZX0gd2lsbCBub3QgYmUgYWJsZSB0byBtZXNzYWdlIHlvdSBhbnkgbW9yZS57JyAnfVxyXG4gICAgICAgICAgPGEgaHJlZj0nJz5MZWFybiBtb3JlIGhlcmUuPC9hPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxwPlxyXG4gICAgICAgICAgPGlucHV0IHR5cGU9J2NoZWNrYm94JyBpZD0ncmVwb3J0LWNoZWNrYm94JyAvPlxyXG4gICAgICAgICAgPGxhYmVsIGZvcj0ncmVwb3J0LWNoZWNrYm94Jz5BbHNvIHJlcG9ydDwvbGFiZWw+XHJcbiAgICAgICAgPC9wPlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGZsZXg6IDEgfX0+XHJcbiAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9J2J0bic+Q2FuY2VsPC9idXR0b24+XHJcbiAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9J2J0biBidG4tY29uZmlybSc+Q29uZmlybTwvYnV0dG9uPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIl0sIm5hbWVzIjpbIkJsb2NrIiwiY29udGFjdCIsInVzZXJuYW1lIiwiZmxleCIsImRpc3BsYXkiXSwibWFwcGluZ3MiOiI7OztBQUVlLFNBQVNBLEtBQVQsQ0FBZTtBQUFFQyxFQUFBQTtBQUFGLENBQWYsRUFBNEI7QUFDekMsUUFBTTtBQUFFQyxJQUFBQTtBQUFGLE1BQWVELE9BQXJCO0FBQ0EsU0FDRTtBQUFLLElBQUEsU0FBUyxFQUFDLGlCQUFmO0FBQWlDLG1CQUFZO0FBQTdDLEtBQ0U7QUFBSyxJQUFBLEtBQUssRUFBRTtBQUFFRSxNQUFBQSxJQUFJLEVBQUU7QUFBUjtBQUFaLEtBQ0UsaUNBQ2lCLGFBQUlELFFBQUosQ0FEakIsQ0FERixFQUlFLGVBQ0dBLFFBQVEsSUFBSUEsUUFEZixnREFDbUUsR0FEbkUsRUFFRTtBQUFHLElBQUEsSUFBSSxFQUFDO0FBQVIsd0JBRkYsQ0FKRixFQVFFLGFBQ0U7QUFBTyxJQUFBLElBQUksRUFBQyxVQUFaO0FBQXVCLElBQUEsRUFBRSxFQUFDO0FBQTFCLElBREYsRUFFRTtBQUFPLElBQUEsR0FBRyxFQUFDO0FBQVgsbUJBRkYsQ0FSRixDQURGLEVBY0U7QUFBSyxJQUFBLEtBQUssRUFBRTtBQUFFRSxNQUFBQSxPQUFPLEVBQUUsTUFBWDtBQUFtQkQsTUFBQUEsSUFBSSxFQUFFO0FBQXpCO0FBQVosS0FDRTtBQUFRLElBQUEsU0FBUyxFQUFDO0FBQWxCLGNBREYsRUFFRTtBQUFRLElBQUEsU0FBUyxFQUFDO0FBQWxCLGVBRkYsQ0FkRixDQURGO0FBcUJEOzs7OyJ9
