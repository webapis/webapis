import { h } from './index-58f1b195.js';
import { B as Button } from './Button-9f7e4c21.js';
import { L as Layout } from './Layout-a672d7a9.js';

const style = {
  checkbox: {
    marginRight: 8
  },
  checkboxRoot: {
    display: 'flex',
    alignItems: 'center',
    padding: 16
  },
  layout: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'space-between',
    boxSizing: 'border-box',
    paddingTop: 68
  },
  btn: {
    flex: 1,
    marginRight: 4
  }
};
function Block({
  onCancel,
  onBlock,
  onReport
}) {
  return h(Layout, {
    style: style.layout
  }, h("div", {
    style: style.checkboxRoot
  }, h("input", {
    type: "checkbox",
    style: style.checkbox,
    onChange: onReport
  }), h("label", null, "Report")), h("div", {
    style: {
      display: 'flex',
      padding: 8
    }
  }, h(Button, {
    title: "Cancel",
    style: style.btn,
    onClick: onCancel
  }), h(Button, {
    title: "Block",
    style: style.btn,
    id: "BLOCK",
    onClick: onBlock,
    "data-testid": "block-btn"
  })));
}

export default Block;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmxvY2stN2QwNDM5MjYuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS11aS9CbG9jay5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuXHJcbmltcG9ydCB7IExheW91dCB9IGZyb20gJy4uL3N0YXRlLXVpL0xheW91dCc7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvQnV0dG9uJztcclxuXHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gIGNoZWNrYm94OiB7IG1hcmdpblJpZ2h0OiA4IH0sXHJcbiAgY2hlY2tib3hSb290OiB7XHJcbiAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcclxuICAgIHBhZGRpbmc6IDE2LFxyXG4gIH0sXHJcbiAgbGF5b3V0OiB7XHJcbiAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcclxuICAgIGhlaWdodDogJzEwMCUnLFxyXG4gICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcclxuICAgIGJveFNpemluZzogJ2JvcmRlci1ib3gnLFxyXG4gICAgcGFkZGluZ1RvcDo2OFxyXG4gIH0sXHJcbiAgYnRuOiB7XHJcbiAgICBmbGV4OiAxLFxyXG4gICAgbWFyZ2luUmlnaHQ6IDQsXHJcbiAgfSxcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEJsb2NrKHsgb25DYW5jZWwsIG9uQmxvY2ssIG9uUmVwb3J0IH0pIHtcclxuXHJcbiBcclxuICByZXR1cm4gKFxyXG4gICAgPExheW91dCBzdHlsZT17c3R5bGUubGF5b3V0fT5cclxuICAgICAgPGRpdiBzdHlsZT17c3R5bGUuY2hlY2tib3hSb290fT5cclxuICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgc3R5bGU9e3N0eWxlLmNoZWNrYm94fSBvbkNoYW5nZT17b25SZXBvcnR9IC8+XHJcbiAgICAgICAgPGxhYmVsPlJlcG9ydDwvbGFiZWw+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgcGFkZGluZzogOCB9fT5cclxuICAgICAgICA8QnV0dG9uIHRpdGxlPVwiQ2FuY2VsXCIgc3R5bGU9e3N0eWxlLmJ0bn0gb25DbGljaz17b25DYW5jZWx9IC8+XHJcbiAgICAgICAgPEJ1dHRvbiB0aXRsZT1cIkJsb2NrXCIgc3R5bGU9e3N0eWxlLmJ0bn0gaWQ9XCJCTE9DS1wiIG9uQ2xpY2s9e29uQmxvY2t9IGRhdGEtdGVzdGlkPVwiYmxvY2stYnRuXCIgLz5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L0xheW91dD5cclxuICApO1xyXG59XHJcbiJdLCJuYW1lcyI6WyJzdHlsZSIsImNoZWNrYm94IiwibWFyZ2luUmlnaHQiLCJjaGVja2JveFJvb3QiLCJkaXNwbGF5IiwiYWxpZ25JdGVtcyIsInBhZGRpbmciLCJsYXlvdXQiLCJmbGV4RGlyZWN0aW9uIiwiaGVpZ2h0IiwianVzdGlmeUNvbnRlbnQiLCJib3hTaXppbmciLCJwYWRkaW5nVG9wIiwiYnRuIiwiZmxleCIsIkJsb2NrIiwib25DYW5jZWwiLCJvbkJsb2NrIiwib25SZXBvcnQiXSwibWFwcGluZ3MiOiI7Ozs7QUFLQSxNQUFNQSxLQUFLLEdBQUc7QUFDWkMsRUFBQUEsUUFBUSxFQUFFO0FBQUVDLElBQUFBLFdBQVcsRUFBRTtBQUFmLEdBREU7QUFFWkMsRUFBQUEsWUFBWSxFQUFFO0FBQ1pDLElBQUFBLE9BQU8sRUFBRSxNQURHO0FBRVpDLElBQUFBLFVBQVUsRUFBRSxRQUZBO0FBR1pDLElBQUFBLE9BQU8sRUFBRTtBQUhHLEdBRkY7QUFPWkMsRUFBQUEsTUFBTSxFQUFFO0FBQ05ILElBQUFBLE9BQU8sRUFBRSxNQURIO0FBRU5JLElBQUFBLGFBQWEsRUFBRSxRQUZUO0FBR05DLElBQUFBLE1BQU0sRUFBRSxNQUhGO0FBSU5DLElBQUFBLGNBQWMsRUFBRSxlQUpWO0FBS05DLElBQUFBLFNBQVMsRUFBRSxZQUxMO0FBTU5DLElBQUFBLFVBQVUsRUFBQztBQU5MLEdBUEk7QUFlWkMsRUFBQUEsR0FBRyxFQUFFO0FBQ0hDLElBQUFBLElBQUksRUFBRSxDQURIO0FBRUhaLElBQUFBLFdBQVcsRUFBRTtBQUZWO0FBZk8sQ0FBZDtBQXFCZSxTQUFTYSxLQUFULENBQWU7QUFBRUMsRUFBQUEsUUFBRjtBQUFZQyxFQUFBQSxPQUFaO0FBQXFCQyxFQUFBQTtBQUFyQixDQUFmLEVBQWdEO0FBRzdELFNBQ0UsRUFBQyxNQUFEO0FBQVEsSUFBQSxLQUFLLEVBQUVsQixLQUFLLENBQUNPO0FBQXJCLEtBQ0U7QUFBSyxJQUFBLEtBQUssRUFBRVAsS0FBSyxDQUFDRztBQUFsQixLQUNFO0FBQU8sSUFBQSxJQUFJLEVBQUMsVUFBWjtBQUF1QixJQUFBLEtBQUssRUFBRUgsS0FBSyxDQUFDQyxRQUFwQztBQUE4QyxJQUFBLFFBQVEsRUFBRWlCO0FBQXhELElBREYsRUFFRSwwQkFGRixDQURGLEVBS0U7QUFBSyxJQUFBLEtBQUssRUFBRTtBQUFFZCxNQUFBQSxPQUFPLEVBQUUsTUFBWDtBQUFtQkUsTUFBQUEsT0FBTyxFQUFFO0FBQTVCO0FBQVosS0FDRSxFQUFDLE1BQUQ7QUFBUSxJQUFBLEtBQUssRUFBQyxRQUFkO0FBQXVCLElBQUEsS0FBSyxFQUFFTixLQUFLLENBQUNhLEdBQXBDO0FBQXlDLElBQUEsT0FBTyxFQUFFRztBQUFsRCxJQURGLEVBRUUsRUFBQyxNQUFEO0FBQVEsSUFBQSxLQUFLLEVBQUMsT0FBZDtBQUFzQixJQUFBLEtBQUssRUFBRWhCLEtBQUssQ0FBQ2EsR0FBbkM7QUFBd0MsSUFBQSxFQUFFLEVBQUMsT0FBM0M7QUFBbUQsSUFBQSxPQUFPLEVBQUVJLE9BQTVEO0FBQXFFLG1CQUFZO0FBQWpGLElBRkYsQ0FMRixDQURGO0FBWUQ7Ozs7In0=