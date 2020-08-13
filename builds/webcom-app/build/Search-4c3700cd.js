import { h } from "./index-c4021a67.js";
import { L as List, a as ListItem } from "./index-bc6d35a4.js";

function Search({
  onSearchSelect,
  onSearchInput,
  onSearch,
  search,
  searchResult = [],
}) {
  return h(
    "div",
    null,
    h(
      "div",
      {
        className: "input-group mb-3",
      },
      h("input", {
        "data-testid": "search-input",
        value: search,
        onChange: onSearchInput,
        type: "text",
        className: "form-control",
        placeholder: "Enter username",
        "aria-label": "username",
        "aria-describedby": "button-addon2",
      }),
      h(
        "div",
        {
          className: "input-group-append",
        },
        h(
          "button",
          {
            "data-testid": "search-btn",
            onClick: onSearch,
            className: "btn btn-outline-secondary",
            type: "button",
            id: "button-addon2",
          },
          "Search"
        )
      )
    ),
    h(
      List,
      null,
      searchResult.length > 0 &&
        searchResult.map((u) => {
          return h(
            ListItem,
            {
              id: u.username,
              onClick: onSearchSelect,
              "data-testid": u.username,
            },
            u.username
          );
        })
    )
  );
}

export default Search;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VhcmNoLTRjMzcwMGNkLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9TZWFyY2guanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaCB9IGZyb20gXCJwcmVhY3RcIjtcbmltcG9ydCBMaXN0LCB7IExpc3RJdGVtIH0gZnJvbSBcImNvbnRyb2xzL2xpc3RcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFNlYXJjaCh7XG4gIG9uU2VhcmNoU2VsZWN0LFxuICBvblNlYXJjaElucHV0LFxuICBvblNlYXJjaCxcbiAgc2VhcmNoLFxuICBzZWFyY2hSZXN1bHQgPSBbXSxcbn0pIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbnB1dC1ncm91cCBtYi0zXCI+XG4gICAgICAgIDxpbnB1dFxuICAgICAgICAgIGRhdGEtdGVzdGlkPVwic2VhcmNoLWlucHV0XCJcbiAgICAgICAgICB2YWx1ZT17c2VhcmNofVxuICAgICAgICAgIG9uQ2hhbmdlPXtvblNlYXJjaElucHV0fVxuICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIlxuICAgICAgICAgIHBsYWNlaG9sZGVyPVwiRW50ZXIgdXNlcm5hbWVcIlxuICAgICAgICAgIGFyaWEtbGFiZWw9XCJ1c2VybmFtZVwiXG4gICAgICAgICAgYXJpYS1kZXNjcmliZWRieT1cImJ1dHRvbi1hZGRvbjJcIlxuICAgICAgICAvPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlucHV0LWdyb3VwLWFwcGVuZFwiPlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwic2VhcmNoLWJ0blwiXG4gICAgICAgICAgICBvbkNsaWNrPXtvblNlYXJjaH1cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tb3V0bGluZS1zZWNvbmRhcnlcIlxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICBpZD1cImJ1dHRvbi1hZGRvbjJcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIFNlYXJjaFxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgPExpc3Q+XG4gICAgICAgIHtzZWFyY2hSZXN1bHQubGVuZ3RoID4gMCAmJlxuICAgICAgICAgIHNlYXJjaFJlc3VsdC5tYXAoKHUpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgIDxMaXN0SXRlbVxuICAgICAgICAgICAgICAgIGlkPXt1LnVzZXJuYW1lfVxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9e29uU2VhcmNoU2VsZWN0fVxuICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPXt1LnVzZXJuYW1lfVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge3UudXNlcm5hbWV9XG4gICAgICAgICAgICAgIDwvTGlzdEl0ZW0+XG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pfVxuICAgICAgPC9MaXN0PlxuICAgIDwvZGl2PlxuICApO1xufVxuIl0sIm5hbWVzIjpbIlNlYXJjaCIsIm9uU2VhcmNoU2VsZWN0Iiwib25TZWFyY2hJbnB1dCIsIm9uU2VhcmNoIiwic2VhcmNoIiwic2VhcmNoUmVzdWx0IiwibGVuZ3RoIiwibWFwIiwidSIsInVzZXJuYW1lIl0sIm1hcHBpbmdzIjoiOzs7QUFFZSxTQUFTQSxNQUFULENBQWdCO0FBQzdCQyxFQUFBQSxjQUQ2QjtBQUU3QkMsRUFBQUEsYUFGNkI7QUFHN0JDLEVBQUFBLFFBSDZCO0FBSTdCQyxFQUFBQSxNQUo2QjtBQUs3QkMsRUFBQUEsWUFBWSxHQUFHO0FBTGMsQ0FBaEIsRUFNWjtBQUNELFNBQ0UsZUFDRTtBQUFLLElBQUEsU0FBUyxFQUFDO0FBQWYsS0FDRTtBQUNFLG1CQUFZLGNBRGQ7QUFFRSxJQUFBLEtBQUssRUFBRUQsTUFGVDtBQUdFLElBQUEsUUFBUSxFQUFFRixhQUhaO0FBSUUsSUFBQSxJQUFJLEVBQUMsTUFKUDtBQUtFLElBQUEsU0FBUyxFQUFDLGNBTFo7QUFNRSxJQUFBLFdBQVcsRUFBQyxnQkFOZDtBQU9FLGtCQUFXLFVBUGI7QUFRRSx3QkFBaUI7QUFSbkIsSUFERixFQVdFO0FBQUssSUFBQSxTQUFTLEVBQUM7QUFBZixLQUNFO0FBQ0UsbUJBQVksWUFEZDtBQUVFLElBQUEsT0FBTyxFQUFFQyxRQUZYO0FBR0UsSUFBQSxTQUFTLEVBQUMsMkJBSFo7QUFJRSxJQUFBLElBQUksRUFBQyxRQUpQO0FBS0UsSUFBQSxFQUFFLEVBQUM7QUFMTCxjQURGLENBWEYsQ0FERixFQXdCRSxFQUFDLElBQUQsUUFDR0UsWUFBWSxDQUFDQyxNQUFiLEdBQXNCLENBQXRCLElBQ0NELFlBQVksQ0FBQ0UsR0FBYixDQUFrQkMsQ0FBRCxJQUFPO0FBQ3RCLFdBQ0UsRUFBQyxRQUFEO0FBQ0UsTUFBQSxFQUFFLEVBQUVBLENBQUMsQ0FBQ0MsUUFEUjtBQUVFLE1BQUEsT0FBTyxFQUFFUixjQUZYO0FBR0UscUJBQWFPLENBQUMsQ0FBQ0M7QUFIakIsT0FLR0QsQ0FBQyxDQUFDQyxRQUxMLENBREY7QUFTRCxHQVZELENBRkosQ0F4QkYsQ0FERjtBQXlDRDs7OzsifQ==
