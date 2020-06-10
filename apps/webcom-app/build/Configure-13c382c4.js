import { k as h } from './index-e4ef6f0b.js';
import { B as Button } from './Button-6c8bf6fc.js';
import { L as Layout } from './Layout-a5e41d71.js';
import { B as Block } from './Block-141ae6a9.js';

function Delete({
  height = 24,
  width = 24,
  color = 'black',
  fill = 'none'
}) {
  return h("svg", {
    height: height,
    viewBox: "0 0 24 24",
    width: width
  }, h("path", {
    fill: color,
    d: "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
  }), h("path", {
    d: "M0 0h24v24H0z",
    fill: fill
  }));
}

function Archive({
  height = 24,
  width = 24,
  color = 'black',
  fill = 'none'
}) {
  return h("svg", {
    height: 24,
    viewBox: "0 0 24 24",
    width: width
  }, h("path", {
    fill: color,
    d: "M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM12 17.5L6.5 12H10v-2h4v2h3.5L12 17.5zM5.12 5l.81-1h12l.94 1H5.12z"
  }), h("path", {
    d: "M0 0h24v24H0z",
    fill: fill
  }));
}

const style = {
  iconBtn: {
    display: 'flex',
    alignItems: 'center',
    margin: 8
  },
  btn: {
    marginRight: 8
  },
  btnContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  layout: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%'
  },
  btnOk: {
    margin: 8,
    display: 'flex',
    justifyContent: 'flex-end'
  }
};
function Configure({
  onBlock,
  onDelete,
  onArchive,
  onNotification,
  onConversationHistory,
  onOk
}) {
  return h(Layout, {
    style: style.layout
  }, h("div", null, h(Checkbox, {
    label: "Notifications",
    onChange: onNotification
  }), h(Checkbox, {
    label: "Conversation History",
    onChange: onConversationHistory
  })), h("hr", null), h("div", {
    style: style.btnContainer
  }, h(IconButton, {
    title: "Archive",
    Icon: Archive,
    onClick: onArchive
  }), h(IconButton, {
    title: "Delete",
    Icon: Delete,
    onClick: onDelete
  }), h(IconButton, {
    title: "Block and Report",
    Icon: Block,
    onClick: onBlock
  })), h("div", {
    style: style.btnOk
  }, h(Button, {
    onClick: onOk
  }, "OK")));
}

function IconButton({
  Icon,
  title,
  onClick
}) {
  return h("div", {
    style: style.iconBtn
  }, h("button", {
    style: style.btn,
    onClick: onClick
  }, h(Icon, null)), h("div", null, title));
}

function Checkbox({
  label,
  onChange
}) {
  return h("div", {
    style: {
      margin: 8,
      marginTop: 8
    }
  }, h("input", {
    type: "checkbox",
    onChange: onChange
  }), h("label", null, label));
}

export default Configure;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29uZmlndXJlLTEzYzM4MmM0LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9jbGllbnQvbGF5b3V0L2ljb25zL0RlbGV0ZS5qcyIsIi4uLy4uLy4uL2NsaWVudC9sYXlvdXQvaWNvbnMvQXJjaGl2ZS5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS11aS9Db25maWd1cmUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmV4cG9ydCBmdW5jdGlvbiBEZWxldGUoe1xyXG4gIGhlaWdodCA9IDI0LFxyXG4gIHdpZHRoID0gMjQsXHJcbiAgY29sb3IgPSAnYmxhY2snLFxyXG4gIGZpbGwgPSAnbm9uZScsXHJcbn0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPHN2ZyBoZWlnaHQ9e2hlaWdodH0gdmlld0JveD0nMCAwIDI0IDI0JyB3aWR0aD17d2lkdGh9PlxyXG4gICAgICA8cGF0aFxyXG4gICAgICAgIGZpbGw9e2NvbG9yfVxyXG4gICAgICAgIGQ9J002IDE5YzAgMS4xLjkgMiAyIDJoOGMxLjEgMCAyLS45IDItMlY3SDZ2MTJ6TTE5IDRoLTMuNWwtMS0xaC01bC0xIDFINXYyaDE0VjR6J1xyXG4gICAgICAvPlxyXG4gICAgICA8cGF0aCBkPSdNMCAwaDI0djI0SDB6JyBmaWxsPXtmaWxsfSAvPlxyXG4gICAgPC9zdmc+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBBcmNoaXZlKHtcclxuICBoZWlnaHQgPSAyNCxcclxuICB3aWR0aCA9IDI0LFxyXG4gIGNvbG9yID0gJ2JsYWNrJyxcclxuICBmaWxsID0gJ25vbmUnLFxyXG59KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxzdmcgaGVpZ2h0PXsyNH0gdmlld0JveD0nMCAwIDI0IDI0JyB3aWR0aD17d2lkdGh9PlxyXG4gICAgICA8cGF0aFxyXG4gICAgICAgIGZpbGw9e2NvbG9yfVxyXG4gICAgICAgIGQ9J00yMC41NCA1LjIzbC0xLjM5LTEuNjhDMTguODggMy4yMSAxOC40NyAzIDE4IDNINmMtLjQ3IDAtLjg4LjIxLTEuMTYuNTVMMy40NiA1LjIzQzMuMTcgNS41NyAzIDYuMDIgMyA2LjVWMTljMCAxLjEuOSAyIDIgMmgxNGMxLjEgMCAyLS45IDItMlY2LjVjMC0uNDgtLjE3LS45My0uNDYtMS4yN3pNMTIgMTcuNUw2LjUgMTJIMTB2LTJoNHYyaDMuNUwxMiAxNy41ek01LjEyIDVsLjgxLTFoMTJsLjk0IDFINS4xMnonXHJcbiAgICAgIC8+XHJcbiAgICAgIDxwYXRoIGQ9J00wIDBoMjR2MjRIMHonIGZpbGw9e2ZpbGx9IC8+XHJcbiAgICA8L3N2Zz5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgTGF5b3V0IH0gZnJvbSAnLi4vc3RhdGUtdWkvTGF5b3V0JztcbmltcG9ydCB7IERlbGV0ZSB9IGZyb20gJy4uLy4uL2xheW91dC9pY29ucy9EZWxldGUnO1xuaW1wb3J0IHsgQXJjaGl2ZSB9IGZyb20gJy4uLy4uL2xheW91dC9pY29ucy9BcmNoaXZlJztcbmltcG9ydCB7IEJsb2NrIH0gZnJvbSAnLi4vLi4vbGF5b3V0L2ljb25zL0Jsb2NrJztcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4uLy4uL2xheW91dC9CdXR0b24nO1xuY29uc3Qgc3R5bGUgPSB7XG4gIGljb25CdG46IHsgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgbWFyZ2luOiA4IH0sXG4gIGJ0bjogeyBtYXJnaW5SaWdodDogOCB9LFxuICBidG5Db250YWluZXI6IHtcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXG4gIH0sXG4gIGxheW91dDoge1xuICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcbiAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgIGhlaWdodDogJzEwMCUnLFxuICB9LFxuICBidG5Pazoge1xuICAgIG1hcmdpbjogOCxcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAganVzdGlmeUNvbnRlbnQ6ICdmbGV4LWVuZCcsXG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDb25maWd1cmUoe1xuICBvbkJsb2NrLFxuICBvbkRlbGV0ZSxcbiAgb25BcmNoaXZlLFxuICBvbk5vdGlmaWNhdGlvbixcbiAgb25Db252ZXJzYXRpb25IaXN0b3J5LFxuICBvbk9rLFxufSkge1xuICByZXR1cm4gKFxuICAgIDxMYXlvdXQgc3R5bGU9e3N0eWxlLmxheW91dH0+XG4gICAgICA8ZGl2PlxuICAgICAgICA8Q2hlY2tib3ggbGFiZWw9XCJOb3RpZmljYXRpb25zXCIgb25DaGFuZ2U9e29uTm90aWZpY2F0aW9ufSAvPlxuICAgICAgICA8Q2hlY2tib3hcbiAgICAgICAgICBsYWJlbD1cIkNvbnZlcnNhdGlvbiBIaXN0b3J5XCJcbiAgICAgICAgICBvbkNoYW5nZT17b25Db252ZXJzYXRpb25IaXN0b3J5fVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgICA8aHIgLz5cbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlLmJ0bkNvbnRhaW5lcn0+XG4gICAgICAgIDxJY29uQnV0dG9uIHRpdGxlPVwiQXJjaGl2ZVwiIEljb249e0FyY2hpdmV9IG9uQ2xpY2s9e29uQXJjaGl2ZX0gLz5cbiAgICAgICAgPEljb25CdXR0b24gdGl0bGU9XCJEZWxldGVcIiBJY29uPXtEZWxldGV9IG9uQ2xpY2s9e29uRGVsZXRlfSAvPlxuICAgICAgICA8SWNvbkJ1dHRvbiB0aXRsZT1cIkJsb2NrIGFuZCBSZXBvcnRcIiBJY29uPXtCbG9ja30gb25DbGljaz17b25CbG9ja30gLz5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBzdHlsZT17c3R5bGUuYnRuT2t9PlxuICAgICAgICA8QnV0dG9uIG9uQ2xpY2s9e29uT2t9Pk9LPC9CdXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICA8L0xheW91dD5cbiAgKTtcbn1cblxuZnVuY3Rpb24gSWNvbkJ1dHRvbih7IEljb24sIHRpdGxlLCBvbkNsaWNrIH0pIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXtzdHlsZS5pY29uQnRufT5cbiAgICAgIDxidXR0b24gc3R5bGU9e3N0eWxlLmJ0bn0gb25DbGljaz17b25DbGlja30+XG4gICAgICAgIDxJY29uIC8+XG4gICAgICA8L2J1dHRvbj5cbiAgICAgIDxkaXY+e3RpdGxlfTwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufVxuXG5mdW5jdGlvbiBDaGVja2JveCh7IGxhYmVsLCBvbkNoYW5nZSB9KSB7XG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17eyBtYXJnaW46IDgsIG1hcmdpblRvcDogOCB9fT5cbiAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBvbkNoYW5nZT17b25DaGFuZ2V9IC8+XG4gICAgICA8bGFiZWw+e2xhYmVsfTwvbGFiZWw+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iXSwibmFtZXMiOlsiRGVsZXRlIiwiaGVpZ2h0Iiwid2lkdGgiLCJjb2xvciIsImZpbGwiLCJBcmNoaXZlIiwic3R5bGUiLCJpY29uQnRuIiwiZGlzcGxheSIsImFsaWduSXRlbXMiLCJtYXJnaW4iLCJidG4iLCJtYXJnaW5SaWdodCIsImJ0bkNvbnRhaW5lciIsImZsZXhEaXJlY3Rpb24iLCJsYXlvdXQiLCJqdXN0aWZ5Q29udGVudCIsImJ0bk9rIiwiQ29uZmlndXJlIiwib25CbG9jayIsIm9uRGVsZXRlIiwib25BcmNoaXZlIiwib25Ob3RpZmljYXRpb24iLCJvbkNvbnZlcnNhdGlvbkhpc3RvcnkiLCJvbk9rIiwiQmxvY2siLCJJY29uQnV0dG9uIiwiSWNvbiIsInRpdGxlIiwib25DbGljayIsIkNoZWNrYm94IiwibGFiZWwiLCJvbkNoYW5nZSIsIm1hcmdpblRvcCJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDTyxT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
