import { h } from "./index-c4021a67.js";
import { B as Button } from "./index-93758c5b.js";
import { L as Layout } from "./Layout-65d0d414.js";

const style = {
  checkbox: {
    marginRight: 8,
  },
  checkboxRoot: {
    display: "flex",
    alignItems: "center",
    padding: 16,
  },
  layout: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "space-between",
    boxSizing: "border-box",
    paddingTop: 68,
  },
};
function Block({ onCancel, onBlock, onReport }) {
  return h(
    Layout,
    {
      style: style.layout,
    },
    h(
      "div",
      {
        style: style.checkboxRoot,
      },
      h("input", {
        type: "checkbox",
        style: style.checkbox,
        onChange: onReport,
      }),
      h("label", null, "Report")
    ),
    h(
      "div",
      {
        className: "row",
      },
      h(
        "div",
        {
          className: "col",
        },
        h(Button, {
          "data-testid": "cancel-btn",
          onClick: onCancel,
          title: "Cancel",
          bg: "secondary",
          outline: true,
          block: true,
        })
      ),
      h(
        "div",
        {
          className: "col",
        },
        h(Button, {
          id: "BLOCK",
          onClick: onBlock,
          "data-testid": "block-btn",
          title: "Block",
          bg: "primary",
          block: true,
        })
      )
    )
  );
}

export default Block;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmxvY2stNjEzMTIwOTkuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL0Jsb2NrLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGggfSBmcm9tIFwicHJlYWN0XCI7XG5pbXBvcnQgTGF5b3V0IGZyb20gXCIuL0xheW91dFwiO1xuaW1wb3J0IEJ1dHRvbiBmcm9tIFwiY29udHJvbHMvYnV0dG9uXCI7XG5jb25zdCBzdHlsZSA9IHtcbiAgY2hlY2tib3g6IHsgbWFyZ2luUmlnaHQ6IDggfSxcbiAgY2hlY2tib3hSb290OiB7XG4gICAgZGlzcGxheTogXCJmbGV4XCIsXG4gICAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcbiAgICBwYWRkaW5nOiAxNixcbiAgfSxcbiAgbGF5b3V0OiB7XG4gICAgZGlzcGxheTogXCJmbGV4XCIsXG4gICAgZmxleERpcmVjdGlvbjogXCJjb2x1bW5cIixcbiAgICBoZWlnaHQ6IFwiMTAwJVwiLFxuICAgIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIixcbiAgICBib3hTaXppbmc6IFwiYm9yZGVyLWJveFwiLFxuICAgIHBhZGRpbmdUb3A6IDY4LFxuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQmxvY2soeyBvbkNhbmNlbCwgb25CbG9jaywgb25SZXBvcnQgfSkge1xuICByZXR1cm4gKFxuICAgIDxMYXlvdXQgc3R5bGU9e3N0eWxlLmxheW91dH0+XG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5jaGVja2JveFJvb3R9PlxuICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgc3R5bGU9e3N0eWxlLmNoZWNrYm94fSBvbkNoYW5nZT17b25SZXBvcnR9IC8+XG4gICAgICAgIDxsYWJlbD5SZXBvcnQ8L2xhYmVsPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbFwiPlxuICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwiY2FuY2VsLWJ0blwiXG4gICAgICAgICAgICBvbkNsaWNrPXtvbkNhbmNlbH1cbiAgICAgICAgICAgIHRpdGxlPVwiQ2FuY2VsXCJcbiAgICAgICAgICAgIGJnPVwic2Vjb25kYXJ5XCJcbiAgICAgICAgICAgIG91dGxpbmVcbiAgICAgICAgICAgIGJsb2NrXG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2xcIj5cbiAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICBpZD1cIkJMT0NLXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9e29uQmxvY2t9XG4gICAgICAgICAgICBkYXRhLXRlc3RpZD1cImJsb2NrLWJ0blwiXG4gICAgICAgICAgICB0aXRsZT1cIkJsb2NrXCJcbiAgICAgICAgICAgIGJnPVwicHJpbWFyeVwiXG4gICAgICAgICAgICBibG9ja1xuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9MYXlvdXQ+XG4gICk7XG59XG4iXSwibmFtZXMiOlsic3R5bGUiLCJjaGVja2JveCIsIm1hcmdpblJpZ2h0IiwiY2hlY2tib3hSb290IiwiZGlzcGxheSIsImFsaWduSXRlbXMiLCJwYWRkaW5nIiwibGF5b3V0IiwiZmxleERpcmVjdGlvbiIsImhlaWdodCIsImp1c3RpZnlDb250ZW50IiwiYm94U2l6aW5nIiwicGFkZGluZ1RvcCIsIkJsb2NrIiwib25DYW5jZWwiLCJvbkJsb2NrIiwib25SZXBvcnQiXSwibWFwcGluZ3MiOiI7Ozs7QUFHQSxNQUFNQSxLQUFLLEdBQUc7QUFDWkMsRUFBQUEsUUFBUSxFQUFFO0FBQUVDLElBQUFBLFdBQVcsRUFBRTtBQUFmLEdBREU7QUFFWkMsRUFBQUEsWUFBWSxFQUFFO0FBQ1pDLElBQUFBLE9BQU8sRUFBRSxNQURHO0FBRVpDLElBQUFBLFVBQVUsRUFBRSxRQUZBO0FBR1pDLElBQUFBLE9BQU8sRUFBRTtBQUhHLEdBRkY7QUFPWkMsRUFBQUEsTUFBTSxFQUFFO0FBQ05ILElBQUFBLE9BQU8sRUFBRSxNQURIO0FBRU5JLElBQUFBLGFBQWEsRUFBRSxRQUZUO0FBR05DLElBQUFBLE1BQU0sRUFBRSxNQUhGO0FBSU5DLElBQUFBLGNBQWMsRUFBRSxlQUpWO0FBS05DLElBQUFBLFNBQVMsRUFBRSxZQUxMO0FBTU5DLElBQUFBLFVBQVUsRUFBRTtBQU5OO0FBUEksQ0FBZDtBQWlCZSxTQUFTQyxLQUFULENBQWU7QUFBRUMsRUFBQUEsUUFBRjtBQUFZQyxFQUFBQSxPQUFaO0FBQXFCQyxFQUFBQTtBQUFyQixDQUFmLEVBQWdEO0FBQzdELFNBQ0UsRUFBQyxNQUFEO0FBQVEsSUFBQSxLQUFLLEVBQUVoQixLQUFLLENBQUNPO0FBQXJCLEtBQ0U7QUFBSyxJQUFBLEtBQUssRUFBRVAsS0FBSyxDQUFDRztBQUFsQixLQUNFO0FBQU8sSUFBQSxJQUFJLEVBQUMsVUFBWjtBQUF1QixJQUFBLEtBQUssRUFBRUgsS0FBSyxDQUFDQyxRQUFwQztBQUE4QyxJQUFBLFFBQVEsRUFBRWU7QUFBeEQsSUFERixFQUVFLDBCQUZGLENBREYsRUFLRTtBQUFLLElBQUEsU0FBUyxFQUFDO0FBQWYsS0FDRTtBQUFLLElBQUEsU0FBUyxFQUFDO0FBQWYsS0FDRSxFQUFDLE1BQUQ7QUFDRSxtQkFBWSxZQURkO0FBRUUsSUFBQSxPQUFPLEVBQUVGLFFBRlg7QUFHRSxJQUFBLEtBQUssRUFBQyxRQUhSO0FBSUUsSUFBQSxFQUFFLEVBQUMsV0FKTDtBQUtFLElBQUEsT0FBTyxNQUxUO0FBTUUsSUFBQSxLQUFLO0FBTlAsSUFERixDQURGLEVBWUU7QUFBSyxJQUFBLFNBQVMsRUFBQztBQUFmLEtBQ0UsRUFBQyxNQUFEO0FBQ0UsSUFBQSxFQUFFLEVBQUMsT0FETDtBQUVFLElBQUEsT0FBTyxFQUFFQyxPQUZYO0FBR0UsbUJBQVksV0FIZDtBQUlFLElBQUEsS0FBSyxFQUFDLE9BSlI7QUFLRSxJQUFBLEVBQUUsRUFBQyxTQUxMO0FBTUUsSUFBQSxLQUFLO0FBTlAsSUFERixDQVpGLENBTEYsQ0FERjtBQStCRDs7OzsifQ==
