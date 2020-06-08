import { k as h } from './index-c3b1517c.js';
import { B as Button } from './Button-45126f13.js';
import { L as Layout } from './Layout-29e9ff39.js';

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
    justifyContent: 'space-between'
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
    onClick: onBlock
  })));
}

export default Block;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmxvY2stODRmNzBhNDEuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS11aS9CbG9jay5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgTGF5b3V0IH0gZnJvbSAnLi4vc3RhdGUtdWkvTGF5b3V0JztcclxuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAnLi4vLi4vbGF5b3V0L0J1dHRvbic7XHJcblxyXG5jb25zdCBzdHlsZSA9IHtcclxuICBjaGVja2JveDogeyBtYXJnaW5SaWdodDogOCB9LFxyXG4gIGNoZWNrYm94Um9vdDoge1xyXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXHJcbiAgICBwYWRkaW5nOiAxNixcclxuICB9LFxyXG4gIGxheW91dDoge1xyXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXHJcbiAgICBoZWlnaHQ6ICcxMDAlJyxcclxuICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXHJcbiAgfSxcclxuICBidG46IHtcclxuICAgIGZsZXg6IDEsXHJcbiAgICBtYXJnaW5SaWdodDogNCxcclxuICB9LFxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQmxvY2soeyBvbkNhbmNlbCwgb25CbG9jaywgb25SZXBvcnQgfSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8TGF5b3V0IHN0eWxlPXtzdHlsZS5sYXlvdXR9PlxyXG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5jaGVja2JveFJvb3R9PlxyXG4gICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBzdHlsZT17c3R5bGUuY2hlY2tib3h9IG9uQ2hhbmdlPXtvblJlcG9ydH0gLz5cclxuICAgICAgICA8bGFiZWw+UmVwb3J0PC9sYWJlbD5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBwYWRkaW5nOiA4IH19PlxyXG4gICAgICAgIDxCdXR0b24gdGl0bGU9XCJDYW5jZWxcIiBzdHlsZT17c3R5bGUuYnRufSBvbkNsaWNrPXtvbkNhbmNlbH0gLz5cclxuICAgICAgICA8QnV0dG9uIHRpdGxlPVwiQmxvY2tcIiBzdHlsZT17c3R5bGUuYnRufSBpZD1cIkJMT0NLXCIgb25DbGljaz17b25CbG9ja30gLz5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L0xheW91dD5cclxuICApO1xyXG59XHJcbiJdLCJuYW1lcyI6WyJzdHlsZSIsImNoZWNrYm94IiwibWFyZ2luUmlnaHQiLCJjaGVja2JveFJvb3QiLCJkaXNwbGF5IiwiYWxpZ25JdGVtcyIsInBhZGRpbmciLCJsYXlvdXQiLCJmbGV4RGlyZWN0aW9uIiwiaGVpZ2h0IiwianVzdGlmeUNvbnRlbnQiLCJidG4iLCJmbGV4IiwiQmxvY2siLCJvbkNhbmNlbCIsIm9uQmxvY2siLCJvblJlcG9ydCJdLCJtYXBwaW5ncyI6Ijs7OztBQUlBLE1BQU1BLEtBQUssR0FBRztBQUNaQyxFQUFBQSxRQUFRLEVBQUU7QUFBRUMsSUFBQUEsV0FBVyxFQUFFO0FBQWYsR0FERTtBQUVaQyxFQUFBQSxZQUFZLEVBQUU7QUFDWkMsSUFBQUEsT0FBTyxFQUFFLE1BREc7QUFFWkMsSUFBQUEsVUFBVSxFQUFFLFFBRkE7QUFHWkMsSUFBQUEsT0FBTyxFQUFFO0FBSEcsR0FGRjtBQU9aQyxFQUFBQSxNQUFNLEVBQUU7QUFDTkgsSUFBQUEsT0FBTyxFQUFFLE1BREg7QUFFTkksSUFBQUEsYUFBYSxFQUFFLFFBRlQ7QUFHTkMsSUFBQUEsTUFBTSxFQUFFLE1BSEY7QUFJTkMsSUFBQUEsY0FBYyxFQUFFO0FBSlYsR0FQSTtBQWFaQyxFQUFBQSxHQUFHLEVBQUU7QUFDSEMsSUFBQUEsSUFBSSxFQUFFLENBREg7QUFFSFYsSUFBQUEsV0FBVyxFQUFFO0FBRlY7QUFiTyxDQUFkO0FBbUJlLFNBQVNXLEtBQVQsQ0FBZTtBQUFFQyxFQUFBQSxRQUFGO0FBQVlDLEVBQUFBLE9BQVo7QUFBcUJDLEVBQUFBO0FBQXJCLENBQWYsRUFBZ0Q7QUFDN0QsU0FDRSxFQUFDLE1BQUQ7QUFBUSxJQUFBLEtBQUssRUFBRWhCLEtBQUssQ0FBQ087QUFBckIsS0FDRTtBQUFLLElBQUEsS0FBSyxFQUFFUCxLQUFLLENBQUNHO0FBQWxCLEtBQ0U7QUFBTyxJQUFBLElBQUksRUFBQyxVQUFaO0FBQXVCLElBQUEsS0FBSyxFQUFFSCxLQUFLLENBQUNDLFFBQXBDO0FBQThDLElBQUEsUUFBUSxFQUFFZTtBQUF4RCxJQURGLEVBRUUsMEJBRkYsQ0FERixFQUtFO0FBQUssSUFBQSxLQUFLLEVBQUU7QUFBRVosTUFBQUEsT0FBTyxFQUFFLE1BQVg7QUFBbUJFLE1BQUFBLE9BQU8sRUFBRTtBQUE1QjtBQUFaLEtBQ0UsRUFBQyxNQUFEO0FBQVEsSUFBQSxLQUFLLEVBQUMsUUFBZDtBQUF1QixJQUFBLEtBQUssRUFBRU4sS0FBSyxDQUFDVyxHQUFwQztBQUF5QyxJQUFBLE9BQU8sRUFBRUc7QUFBbEQsSUFERixFQUVFLEVBQUMsTUFBRDtBQUFRLElBQUEsS0FBSyxFQUFDLE9BQWQ7QUFBc0IsSUFBQSxLQUFLLEVBQUVkLEtBQUssQ0FBQ1csR0FBbkM7QUFBd0MsSUFBQSxFQUFFLEVBQUMsT0FBM0M7QUFBbUQsSUFBQSxPQUFPLEVBQUVJO0FBQTVELElBRkYsQ0FMRixDQURGO0FBWUQ7Ozs7In0=
