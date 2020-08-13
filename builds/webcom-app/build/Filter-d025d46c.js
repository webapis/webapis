import { h, p } from "./index-c4021a67.js";
import { L as List, a as ListItem } from "./index-bc6d35a4.js";

function PersonPlusFill(props) {
  const { width, height, color } = props;
  return h(
    "svg",
    {
      width: width,
      height: height,
      viewBox: "0 0 16 16",
      className: "bi bi-person-plus-fill",
      fill: color,
      xmlns: "http://www.w3.org/2000/svg",
    },
    h("path", {
      "fill-rule": "evenodd",
      d:
        "M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm7.5-3a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z",
    }),
    h("path", {
      "fill-rule": "evenodd",
      d: "M13 7.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0v-2z",
    })
  );
}

function Filter({
  onLoadHangout,
  filter,
  filterResult = [],
  onFilterSelect,
  onFilterInput,
  onNavigation,
}) {
  p(() => {
    onLoadHangout();
  }, []);
  return h(
    "div",
    {
      style: {
        height: "100%",
        display: "flex",
        flexDirection: "column",
      },
    },
    h("input", {
      className: "form-control",
      value: filter,
      onChange: onFilterInput,
      "data-testid": "filter-input",
    }),
    h(
      "div",
      null,
      h(
        List,
        null,
        filterResult.length > 0 &&
          filterResult.map((f) => {
            return h(
              ListItem,
              {
                id: f.username,
                "data-testid": f.username,
                onClick: onFilterSelect,
              },
              f.username
            );
          })
      )
    ),
    filterResult.length === 0 &&
      h(
        "div",
        {
          className: "row align-items-center",
          style: {
            flex: 1,
          },
        },
        h(
          "div",
          {
            className: "col-2  mx-auto",
          },
          h(
            "button",
            {
              "data-testid": "search",
              id: "search",
              onClick: onNavigation,
              className: "btn btn-outline-secondary",
            },
            h(PersonPlusFill, {
              width: "2em",
              height: "2em",
            })
          )
        )
      )
  );
}

export default Filter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmlsdGVyLWQwMjVkNDZjLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9jbGllbnQvY29tcG9uZW50cy9pY29ucy9ib290c3RyYXAvUGVyc29uUGx1c0ZpbGwuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9GaWx0ZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaCB9IGZyb20gXCJwcmVhY3RcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFBlcnNvblBsdXNGaWxsKHByb3BzKSB7XG4gIGNvbnN0IHsgd2lkdGgsIGhlaWdodCwgY29sb3IgfSA9IHByb3BzO1xuICByZXR1cm4gKFxuICAgIDxzdmdcbiAgICAgIHdpZHRoPXt3aWR0aH1cbiAgICAgIGhlaWdodD17aGVpZ2h0fVxuICAgICAgdmlld0JveD1cIjAgMCAxNiAxNlwiXG4gICAgICBjbGFzc05hbWU9XCJiaSBiaS1wZXJzb24tcGx1cy1maWxsXCJcbiAgICAgIGZpbGw9e2NvbG9yfVxuICAgICAgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiXG4gICAgPlxuICAgICAgPHBhdGhcbiAgICAgICAgZmlsbC1ydWxlPVwiZXZlbm9kZFwiXG4gICAgICAgIGQ9XCJNMSAxNHMtMSAwLTEtMSAxLTQgNi00IDYgMyA2IDQtMSAxLTEgMUgxem01LTZhMyAzIDAgMSAwIDAtNiAzIDMgMCAwIDAgMCA2em03LjUtM2EuNS41IDAgMCAxIC41LjV2MmEuNS41IDAgMCAxLS41LjVoLTJhLjUuNSAwIDAgMSAwLTFIMTNWNS41YS41LjUgMCAwIDEgLjUtLjV6XCJcbiAgICAgIC8+XG4gICAgICA8cGF0aFxuICAgICAgICBmaWxsLXJ1bGU9XCJldmVub2RkXCJcbiAgICAgICAgZD1cIk0xMyA3LjVhLjUuNSAwIDAgMSAuNS0uNWgyYS41LjUgMCAwIDEgMCAxSDE0djEuNWEuNS41IDAgMCAxLTEgMHYtMnpcIlxuICAgICAgLz5cbiAgICA8L3N2Zz5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tIFwicHJlYWN0XCI7XG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tIFwicHJlYWN0L2hvb2tzXCI7XG5pbXBvcnQgTGlzdCwgeyBMaXN0SXRlbSB9IGZyb20gXCJjb250cm9scy9saXN0XCI7XG5cbmltcG9ydCBQZXJzb25QbHVzRmlsbCBmcm9tIFwiaWNvbnMvYm9vdHN0cmFwL1BlcnNvblBsdXNGaWxsXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBGaWx0ZXIoe1xuICBvbkxvYWRIYW5nb3V0LFxuICBmaWx0ZXIsXG4gIGZpbHRlclJlc3VsdCA9IFtdLFxuICBvbkZpbHRlclNlbGVjdCxcbiAgb25GaWx0ZXJJbnB1dCxcbiAgb25OYXZpZ2F0aW9uLFxufSkge1xuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIG9uTG9hZEhhbmdvdXQoKTtcbiAgfSwgW10pO1xuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiBcIjEwMCVcIiwgZGlzcGxheTogXCJmbGV4XCIsIGZsZXhEaXJlY3Rpb246IFwiY29sdW1uXCIgfX0+XG4gICAgICA8aW5wdXRcbiAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCJcbiAgICAgICAgdmFsdWU9e2ZpbHRlcn1cbiAgICAgICAgb25DaGFuZ2U9e29uRmlsdGVySW5wdXR9XG4gICAgICAgIGRhdGEtdGVzdGlkPVwiZmlsdGVyLWlucHV0XCJcbiAgICAgIC8+XG4gICAgICA8ZGl2PlxuICAgICAgICA8TGlzdD5cbiAgICAgICAgICB7ZmlsdGVyUmVzdWx0Lmxlbmd0aCA+IDAgJiZcbiAgICAgICAgICAgIGZpbHRlclJlc3VsdC5tYXAoKGYpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8TGlzdEl0ZW1cbiAgICAgICAgICAgICAgICAgIGlkPXtmLnVzZXJuYW1lfVxuICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9e2YudXNlcm5hbWV9XG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXtvbkZpbHRlclNlbGVjdH1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICB7Zi51c2VybmFtZX1cbiAgICAgICAgICAgICAgICA8L0xpc3RJdGVtPlxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSl9XG4gICAgICAgIDwvTGlzdD5cbiAgICAgIDwvZGl2PlxuICAgICAge2ZpbHRlclJlc3VsdC5sZW5ndGggPT09IDAgJiYgKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdyBhbGlnbi1pdGVtcy1jZW50ZXJcIiBzdHlsZT17eyBmbGV4OiAxIH19PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLTIgIG14LWF1dG9cIj5cbiAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJzZWFyY2hcIlxuICAgICAgICAgICAgICBpZD1cInNlYXJjaFwiXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e29uTmF2aWdhdGlvbn1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi1vdXRsaW5lLXNlY29uZGFyeVwiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxQZXJzb25QbHVzRmlsbCB3aWR0aD1cIjJlbVwiIGhlaWdodD1cIjJlbVwiIC8+XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuICAgIDwvZGl2PlxuICApO1xufVxuIl0sIm5hbWVzIjpbIlBlcnNvblBsdXNGaWxsIiwicHJvcHMiLCJ3aWR0aCIsImhlaWdodCIsImNvbG9yIiwiRmlsdGVyIiwib25Mb2FkSGFuZ291dCIsImZpbHRlciIsImZpbHRlclJlc3VsdCIsIm9uRmlsdGVyU2VsZWN0Iiwib25GaWx0ZXJJbnB1dCIsIm9uTmF2aWdhdGlvbiIsInVzZUVmZmVjdCIsImRpc3BsYXkiLCJmbGV4RGlyZWN0aW9uIiwibGVuZ3RoIiwibWFwIiwiZiIsInVzZXJuYW1lIiwiZmxleCJdLCJtYXBwaW5ncyI6Ijs7O0FBQ2UsU0FBU0EsY0FBVCxDQUF3QkMsS0FBeEIsRUFBK0I7QUFDNUMsUUFBTTtBQUFFQyxJQUFBQSxLQUFGO0FBQVNDLElBQUFBLE1BQVQ7QUFBaUJDLElBQUFBO0FBQWpCLE1BQTJCSCxLQUFqQztBQUNBLFNBQ0U7QUFDRSxJQUFBLEtBQUssRUFBRUMsS0FEVDtBQUVFLElBQUEsTUFBTSxFQUFFQyxNQUZWO0FBR0UsSUFBQSxPQUFPLEVBQUMsV0FIVjtBQUlFLElBQUEsU0FBUyxFQUFDLHdCQUpaO0FBS0UsSUFBQSxJQUFJLEVBQUVDLEtBTFI7QUFNRSxJQUFBLEtBQUssRUFBQztBQU5SLEtBUUU7QUFDRSxpQkFBVSxTQURaO0FBRUUsSUFBQSxDQUFDLEVBQUM7QUFGSixJQVJGLEVBWUU7QUFDRSxpQkFBVSxTQURaO0FBRUUsSUFBQSxDQUFDLEVBQUM7QUFGSixJQVpGLENBREY7QUFtQkQ7O0FDakJjLFNBQVNDLE1BQVQsQ0FBZ0I7QUFDN0JDLEVBQUFBLGFBRDZCO0FBRTdCQyxFQUFBQSxNQUY2QjtBQUc3QkMsRUFBQUEsWUFBWSxHQUFHLEVBSGM7QUFJN0JDLEVBQUFBLGNBSjZCO0FBSzdCQyxFQUFBQSxhQUw2QjtBQU03QkMsRUFBQUE7QUFONkIsQ0FBaEIsRUFPWjtBQUNEQyxFQUFBQSxDQUFTLENBQUMsTUFBTTtBQUNkTixJQUFBQSxhQUFhO0FBQ2QsR0FGUSxFQUVOLEVBRk0sQ0FBVDtBQUdBLFNBQ0U7QUFBSyxJQUFBLEtBQUssRUFBRTtBQUFFSCxNQUFBQSxNQUFNLEVBQUUsTUFBVjtBQUFrQlUsTUFBQUEsT0FBTyxFQUFFLE1BQTNCO0FBQW1DQyxNQUFBQSxhQUFhLEVBQUU7QUFBbEQ7QUFBWixLQUNFO0FBQ0UsSUFBQSxTQUFTLEVBQUMsY0FEWjtBQUVFLElBQUEsS0FBSyxFQUFFUCxNQUZUO0FBR0UsSUFBQSxRQUFRLEVBQUVHLGFBSFo7QUFJRSxtQkFBWTtBQUpkLElBREYsRUFPRSxlQUNFLEVBQUMsSUFBRCxRQUNHRixZQUFZLENBQUNPLE1BQWIsR0FBc0IsQ0FBdEIsSUFDQ1AsWUFBWSxDQUFDUSxHQUFiLENBQWtCQyxDQUFELElBQU87QUFDdEIsV0FDRSxFQUFDLFFBQUQ7QUFDRSxNQUFBLEVBQUUsRUFBRUEsQ0FBQyxDQUFDQyxRQURSO0FBRUUscUJBQWFELENBQUMsQ0FBQ0MsUUFGakI7QUFHRSxNQUFBLE9BQU8sRUFBRVQ7QUFIWCxPQUtHUSxDQUFDLENBQUNDLFFBTEwsQ0FERjtBQVNELEdBVkQsQ0FGSixDQURGLENBUEYsRUF1QkdWLFlBQVksQ0FBQ08sTUFBYixLQUF3QixDQUF4QixJQUNDO0FBQUssSUFBQSxTQUFTLEVBQUMsd0JBQWY7QUFBd0MsSUFBQSxLQUFLLEVBQUU7QUFBRUksTUFBQUEsSUFBSSxFQUFFO0FBQVI7QUFBL0MsS0FDRTtBQUFLLElBQUEsU0FBUyxFQUFDO0FBQWYsS0FDRTtBQUNFLG1CQUFZLFFBRGQ7QUFFRSxJQUFBLEVBQUUsRUFBQyxRQUZMO0FBR0UsSUFBQSxPQUFPLEVBQUVSLFlBSFg7QUFJRSxJQUFBLFNBQVMsRUFBQztBQUpaLEtBTUUsRUFBQyxjQUFEO0FBQWdCLElBQUEsS0FBSyxFQUFDLEtBQXRCO0FBQTRCLElBQUEsTUFBTSxFQUFDO0FBQW5DLElBTkYsQ0FERixDQURGLENBeEJKLENBREY7QUF3Q0Q7Ozs7In0=