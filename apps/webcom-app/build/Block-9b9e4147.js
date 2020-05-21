import { h } from './index-ca5036af.js';
import './style-8e190e7e.js';

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmxvY2stOWI5ZTQxNDcuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy92aWV3cy9CbG9jay5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0ICcuL2Nzcy9zdHlsZS5jc3MnO1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBCbG9jayh7IGNvbnRhY3Qsc2V0Um91dGUgfSkge1xyXG4gIGNvbnN0IHsgdXNlcm5hbWUgfSA9IGNvbnRhY3Q7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgY2xhc3NOYW1lPSdjaGF0LXN0YXRlLXZpZXcnIGRhdGEtdGVzdGlkPSdibG9jayc+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3sgZmxleDogMTAgfX0+XHJcbiAgICAgICAgPGg1PlxyXG4gICAgICAgICAgQmxvY2sgJiByZXBvcnQgPGI+e3VzZXJuYW1lfTwvYj5cclxuICAgICAgICA8L2g1PlxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICB7dXNlcm5hbWUgJiYgdXNlcm5hbWV9IHdpbGwgbm90IGJlIGFibGUgdG8gbWVzc2FnZSB5b3UgYW55IG1vcmUueycgJ31cclxuICAgICAgICAgIDxhIGhyZWY9Jyc+TGVhcm4gbW9yZSBoZXJlLjwvYT5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8cD5cclxuICAgICAgICAgIDxpbnB1dCB0eXBlPSdjaGVja2JveCcgaWQ9J3JlcG9ydC1jaGVja2JveCcgLz5cclxuICAgICAgICAgIDxsYWJlbCBmb3I9J3JlcG9ydC1jaGVja2JveCc+QWxzbyByZXBvcnQ8L2xhYmVsPlxyXG4gICAgICAgIDwvcD5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBmbGV4OiAxIH19PlxyXG4gICAgICAgIDxidXR0b24gY2xhc3NOYW1lPSdidG4nPkNhbmNlbDwvYnV0dG9uPlxyXG4gICAgICAgIDxidXR0b24gY2xhc3NOYW1lPSdidG4gYnRuLWNvbmZpcm0nPkNvbmZpcm08L2J1dHRvbj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiJdLCJuYW1lcyI6WyJCbG9jayIsImNvbnRhY3QiLCJzZXRSb3V0ZSIsInVzZXJuYW1lIiwiZmxleCIsImRpc3BsYXkiXSwibWFwcGluZ3MiOiI7OztBQUVlLFNBQVNBLEtBQVQsQ0FBZTtBQUFFQyxFQUFBQSxPQUFGO0FBQVVDLEVBQUFBO0FBQVYsQ0FBZixFQUFxQztBQUNsRCxRQUFNO0FBQUVDLElBQUFBO0FBQUYsTUFBZUYsT0FBckI7QUFDQSxTQUNFO0FBQUssSUFBQSxTQUFTLEVBQUMsaUJBQWY7QUFBaUMsbUJBQVk7QUFBN0MsS0FDRTtBQUFLLElBQUEsS0FBSyxFQUFFO0FBQUVHLE1BQUFBLElBQUksRUFBRTtBQUFSO0FBQVosS0FDRSxpQ0FDaUIsYUFBSUQsUUFBSixDQURqQixDQURGLEVBSUUsZUFDR0EsUUFBUSxJQUFJQSxRQURmLGdEQUNtRSxHQURuRSxFQUVFO0FBQUcsSUFBQSxJQUFJLEVBQUM7QUFBUix3QkFGRixDQUpGLEVBUUUsYUFDRTtBQUFPLElBQUEsSUFBSSxFQUFDLFVBQVo7QUFBdUIsSUFBQSxFQUFFLEVBQUM7QUFBMUIsSUFERixFQUVFO0FBQU8sSUFBQSxHQUFHLEVBQUM7QUFBWCxtQkFGRixDQVJGLENBREYsRUFjRTtBQUFLLElBQUEsS0FBSyxFQUFFO0FBQUVFLE1BQUFBLE9BQU8sRUFBRSxNQUFYO0FBQW1CRCxNQUFBQSxJQUFJLEVBQUU7QUFBekI7QUFBWixLQUNFO0FBQVEsSUFBQSxTQUFTLEVBQUM7QUFBbEIsY0FERixFQUVFO0FBQVEsSUFBQSxTQUFTLEVBQUM7QUFBbEIsZUFGRixDQWRGLENBREY7QUFxQkQ7Ozs7In0=
