import { h } from "./index-c4021a67.js";
import { B as Button } from "./index-93758c5b.js";
import { L as Layout } from "./Layout-65d0d414.js";
import { B as Block } from "./Block-e70a11e5.js";
import { C as Center } from "./Center-fce8149d.js";

const style = {
  layout: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "space-between",
    boxSizing: "border-box",
    paddingTop: 68,
  },
};
function Blocked({ hangout, onUnblock, onClose }) {
  return h(
    Layout,
    {
      style: style.layout,
      id: "blocked-ui",
    },
    h(
      Center,
      {
        style: {
          flexDirection: "column",
          alignItems: "center",
        },
      },
      h(Block, {
        width: "60",
        height: "70",
        color: "red",
      }),
      h("b", null, hangout && hangout.username),
      " is blocked"
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
          "data-testid": "close-btn",
          onClick: onClose,
          title: "CLOSE",
          bg: "secondary",
          block: true,
          outline: true,
        })
      ),
      h(
        "div",
        {
          className: "col",
        },
        h(Button, {
          id: "UNBLOCK",
          onClick: onUnblock,
          "data-testid": "unblock-btn",
          title: "UNBLOCK",
          bg: "primary",
          block: true,
        })
      )
    )
  );
}

export default Blocked;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmxvY2tlZC02NzY4MTI0Yy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY2xpZW50L2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvQmxvY2tlZC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBoIH0gZnJvbSBcInByZWFjdFwiO1xuXG5pbXBvcnQgeyBCbG9jayB9IGZyb20gXCJpY29ucy9CbG9ja1wiO1xuaW1wb3J0IHsgQ2VudGVyIH0gZnJvbSBcImNvbXBvbmVudHMvbGF5b3V0L0NlbnRlclwiO1xuaW1wb3J0IEJ1dHRvbiBmcm9tIFwiY29udHJvbHMvYnV0dG9uXCI7XG5pbXBvcnQgTGF5b3V0IGZyb20gXCIuL0xheW91dFwiO1xuXG5jb25zdCBzdHlsZSA9IHtcbiAgbGF5b3V0OiB7XG4gICAgZGlzcGxheTogXCJmbGV4XCIsXG4gICAgZmxleERpcmVjdGlvbjogXCJjb2x1bW5cIixcbiAgICBoZWlnaHQ6IFwiMTAwJVwiLFxuICAgIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIixcbiAgICBib3hTaXppbmc6IFwiYm9yZGVyLWJveFwiLFxuICAgIHBhZGRpbmdUb3A6IDY4LFxuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQmxvY2tlZCh7IGhhbmdvdXQsIG9uVW5ibG9jaywgb25DbG9zZSB9KSB7XG4gIHJldHVybiAoXG4gICAgPExheW91dCBzdHlsZT17c3R5bGUubGF5b3V0fSBpZD1cImJsb2NrZWQtdWlcIj5cbiAgICAgIDxDZW50ZXIgc3R5bGU9e3sgZmxleERpcmVjdGlvbjogXCJjb2x1bW5cIiwgYWxpZ25JdGVtczogXCJjZW50ZXJcIiB9fT5cbiAgICAgICAgPEJsb2NrIHdpZHRoPVwiNjBcIiBoZWlnaHQ9XCI3MFwiIGNvbG9yPVwicmVkXCIgLz5cbiAgICAgICAgPGI+e2hhbmdvdXQgJiYgaGFuZ291dC51c2VybmFtZX08L2I+IGlzIGJsb2NrZWRcbiAgICAgIDwvQ2VudGVyPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2xcIj5cbiAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICBkYXRhLXRlc3RpZD1cImNsb3NlLWJ0blwiXG4gICAgICAgICAgICBvbkNsaWNrPXtvbkNsb3NlfVxuICAgICAgICAgICAgdGl0bGU9XCJDTE9TRVwiXG4gICAgICAgICAgICBiZz1cInNlY29uZGFyeVwiXG4gICAgICAgICAgICBibG9ja1xuICAgICAgICAgICAgb3V0bGluZVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbFwiPlxuICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgIGlkPVwiVU5CTE9DS1wiXG4gICAgICAgICAgICBvbkNsaWNrPXtvblVuYmxvY2t9XG4gICAgICAgICAgICBkYXRhLXRlc3RpZD1cInVuYmxvY2stYnRuXCJcbiAgICAgICAgICAgIHRpdGxlPVwiVU5CTE9DS1wiXG4gICAgICAgICAgICBiZz1cInByaW1hcnlcIlxuICAgICAgICAgICAgYmxvY2tcbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvTGF5b3V0PlxuICApO1xufVxuIl0sIm5hbWVzIjpbInN0eWxlIiwibGF5b3V0IiwiZGlzcGxheSIsImZsZXhEaXJlY3Rpb24iLCJoZWlnaHQiLCJqdXN0aWZ5Q29udGVudCIsImJveFNpemluZyIsInBhZGRpbmdUb3AiLCJCbG9ja2VkIiwiaGFuZ291dCIsIm9uVW5ibG9jayIsIm9uQ2xvc2UiLCJhbGlnbkl0ZW1zIiwidXNlcm5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7OztBQU9BLE1BQU1BLEtBQUssR0FBRztBQUNaQyxFQUFBQSxNQUFNLEVBQUU7QUFDTkMsSUFBQUEsT0FBTyxFQUFFLE1BREg7QUFFTkMsSUFBQUEsYUFBYSxFQUFFLFFBRlQ7QUFHTkMsSUFBQUEsTUFBTSxFQUFFLE1BSEY7QUFJTkMsSUFBQUEsY0FBYyxFQUFFLGVBSlY7QUFLTkMsSUFBQUEsU0FBUyxFQUFFLFlBTEw7QUFNTkMsSUFBQUEsVUFBVSxFQUFFO0FBTk47QUFESSxDQUFkO0FBV2UsU0FBU0MsT0FBVCxDQUFpQjtBQUFFQyxFQUFBQSxPQUFGO0FBQVdDLEVBQUFBLFNBQVg7QUFBc0JDLEVBQUFBO0FBQXRCLENBQWpCLEVBQWtEO0FBQy9ELFNBQ0UsRUFBQyxNQUFEO0FBQVEsSUFBQSxLQUFLLEVBQUVYLEtBQUssQ0FBQ0MsTUFBckI7QUFBNkIsSUFBQSxFQUFFLEVBQUM7QUFBaEMsS0FDRSxFQUFDLE1BQUQ7QUFBUSxJQUFBLEtBQUssRUFBRTtBQUFFRSxNQUFBQSxhQUFhLEVBQUUsUUFBakI7QUFBMkJTLE1BQUFBLFVBQVUsRUFBRTtBQUF2QztBQUFmLEtBQ0UsRUFBQyxLQUFEO0FBQU8sSUFBQSxLQUFLLEVBQUMsSUFBYjtBQUFrQixJQUFBLE1BQU0sRUFBQyxJQUF6QjtBQUE4QixJQUFBLEtBQUssRUFBQztBQUFwQyxJQURGLEVBRUUsYUFBSUgsT0FBTyxJQUFJQSxPQUFPLENBQUNJLFFBQXZCLENBRkYsZ0JBREYsRUFLRTtBQUFLLElBQUEsU0FBUyxFQUFDO0FBQWYsS0FDRTtBQUFLLElBQUEsU0FBUyxFQUFDO0FBQWYsS0FDRSxFQUFDLE1BQUQ7QUFDRSxtQkFBWSxXQURkO0FBRUUsSUFBQSxPQUFPLEVBQUVGLE9BRlg7QUFHRSxJQUFBLEtBQUssRUFBQyxPQUhSO0FBSUUsSUFBQSxFQUFFLEVBQUMsV0FKTDtBQUtFLElBQUEsS0FBSyxNQUxQO0FBTUUsSUFBQSxPQUFPO0FBTlQsSUFERixDQURGLEVBV0U7QUFBSyxJQUFBLFNBQVMsRUFBQztBQUFmLEtBQ0UsRUFBQyxNQUFEO0FBQ0UsSUFBQSxFQUFFLEVBQUMsU0FETDtBQUVFLElBQUEsT0FBTyxFQUFFRCxTQUZYO0FBR0UsbUJBQVksYUFIZDtBQUlFLElBQUEsS0FBSyxFQUFDLFNBSlI7QUFLRSxJQUFBLEVBQUUsRUFBQyxTQUxMO0FBTUUsSUFBQSxLQUFLO0FBTlAsSUFERixDQVhGLENBTEYsQ0FERjtBQThCRDs7OzsifQ==
