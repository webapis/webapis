import { h, B as List, C as ListItem } from './index-d2307a3a.js';
import { T as TextInput } from './TextInput-088bab78.js';
import { B as Button } from './Button-c1df6233.js';

const style = {
  inputContainer: {
    display: 'flex',
    border: '#737373 solid 1px'
  },
  input: {
    padding: 10,
    flex: 1,
    border: 'white'
  }
};
function Hangout({
  hangouts,
  onSearch,
  onSelectHangout,
  onSelectUser,
  search,
  users,
  onStartSearch
}) {
  return h("div", null, h("div", {
    style: style.inputContainer
  }, h(TextInput, {
    value: search,
    id: "search-input",
    type: "search",
    onChange: onSearch,
    style: style.input
  }), h(Button, {
    "data-testid": "search-btn",
    disabled: !search,
    title: "search",
    onClick: onStartSearch
  })), h(List, {
    id: "hangouts-list"
  }, hangouts && hangouts.length > 0 && hangouts.map(g => {
    return h(ListItem, {
      id: g.username,
      onClick: onSelectHangout
    }, g.username);
  })), h(List, {
    id: "users-list"
  }, users && users.map(g => {
    return h(ListItem, {
      id: g.username,
      onClick: onSelectUser
    }, g.username);
  })));
}

export default Hangout;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGFuZ291dC0zOGY3YWIzMC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL0hhbmdvdXQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IExpc3QsIExpc3RJdGVtIH0gZnJvbSAnLi4vbGF5b3V0L05hdkxpc3QnO1xyXG5pbXBvcnQgeyBUZXh0SW5wdXQgfSBmcm9tICcuLi9sYXlvdXQvVGV4dElucHV0JztcclxuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAnLi4vbGF5b3V0L0J1dHRvbic7XHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gIGlucHV0Q29udGFpbmVyOiB7XHJcbiAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICBib3JkZXI6ICcjNzM3MzczIHNvbGlkIDFweCcsXHJcbiAgfSxcclxuICBpbnB1dDoge1xyXG4gICAgcGFkZGluZzogMTAsXHJcbiAgICBmbGV4OiAxLFxyXG4gICAgYm9yZGVyOiAnd2hpdGUnLFxyXG4gIH0sXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBIYW5nb3V0KHtcclxuICBoYW5nb3V0cyxcclxuICBvblNlYXJjaCxcclxuICBvblNlbGVjdEhhbmdvdXQsXHJcbiAgb25TZWxlY3RVc2VyLFxyXG4gIHNlYXJjaCxcclxuICB1c2VycyxcclxuICBvblN0YXJ0U2VhcmNoLFxyXG59KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXY+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlLmlucHV0Q29udGFpbmVyfT5cclxuICAgICAgICA8VGV4dElucHV0XHJcbiAgICAgICAgICB2YWx1ZT17c2VhcmNofVxyXG4gICAgICAgICAgaWQ9XCJzZWFyY2gtaW5wdXRcIlxyXG4gICAgICAgICAgdHlwZT1cInNlYXJjaFwiXHJcbiAgICAgICAgICBvbkNoYW5nZT17b25TZWFyY2h9XHJcbiAgICAgICAgICBzdHlsZT17c3R5bGUuaW5wdXR9XHJcbiAgICAgICAgLz5cclxuICAgICAgICA8QnV0dG9uXHJcbiAgICAgICAgICBkYXRhLXRlc3RpZD1cInNlYXJjaC1idG5cIlxyXG4gICAgICAgICAgZGlzYWJsZWQ9eyFzZWFyY2h9XHJcbiAgICAgICAgICB0aXRsZT1cInNlYXJjaFwiXHJcbiAgICAgICAgICBvbkNsaWNrPXtvblN0YXJ0U2VhcmNofVxyXG4gICAgICAgIC8+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgPExpc3QgaWQ9XCJoYW5nb3V0cy1saXN0XCI+XHJcbiAgICAgICAge2hhbmdvdXRzICYmXHJcbiAgICAgICAgICBoYW5nb3V0cy5sZW5ndGggPiAwICYmXHJcbiAgICAgICAgICBoYW5nb3V0cy5tYXAoKGcpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICA8TGlzdEl0ZW0gaWQ9e2cudXNlcm5hbWV9IG9uQ2xpY2s9e29uU2VsZWN0SGFuZ291dH0+XHJcbiAgICAgICAgICAgICAgICB7Zy51c2VybmFtZX1cclxuICAgICAgICAgICAgICA8L0xpc3RJdGVtPlxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgfSl9XHJcbiAgICAgIDwvTGlzdD5cclxuICAgICAgPExpc3QgaWQ9XCJ1c2Vycy1saXN0XCI+XHJcbiAgICAgICAge3VzZXJzICYmXHJcbiAgICAgICAgICB1c2Vycy5tYXAoKGcpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICA8TGlzdEl0ZW0gaWQ9e2cudXNlcm5hbWV9IG9uQ2xpY2s9e29uU2VsZWN0VXNlcn0+XHJcbiAgICAgICAgICAgICAgICB7Zy51c2VybmFtZX1cclxuICAgICAgICAgICAgICA8L0xpc3RJdGVtPlxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgfSl9XHJcbiAgICAgIDwvTGlzdD5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIl0sIm5hbWVzIjpbInN0eWxlIiwiaW5wdXRDb250YWluZXIiLCJkaXNwbGF5IiwiYm9yZGVyIiwiaW5wdXQiLCJwYWRkaW5nIiwiZmxleCIsIkhhbmdvdXQiLCJoYW5nb3V0cyIsIm9uU2VhcmNoIiwib25TZWxlY3RIYW5nb3V0Iiwib25TZWxlY3RVc2VyIiwic2VhcmNoIiwidXNlcnMiLCJvblN0YXJ0U2VhcmNoIiwibGVuZ3RoIiwibWFwIiwiZyIsInVzZXJuYW1lIl0sIm1hcHBpbmdzIjoiOzs7O0FBS0EsTUFBTUEsS0FBSyxHQUFHO0FBQ1pDLEVBQUFBLGNBQWMsRUFBRTtBQUNkQyxJQUFBQSxPQUFPLEVBQUUsTUFESztBQUVkQyxJQUFBQSxNQUFNLEVBQUU7QUFGTSxHQURKO0FBS1pDLEVBQUFBLEtBQUssRUFBRTtBQUNMQyxJQUFBQSxPQUFPLEVBQUUsRUFESjtBQUVMQyxJQUFBQSxJQUFJLEVBQUUsQ0FGRDtBQUdMSCxJQUFBQSxNQUFNLEVBQUU7QUFISDtBQUxLLENBQWQ7QUFZZSxTQUFTSSxPQUFULENBQWlCO0FBQzlCQyxFQUFBQSxRQUQ4QjtBQUU5QkMsRUFBQUEsUUFGOEI7QUFHOUJDLEVBQUFBLGVBSDhCO0FBSTlCQyxFQUFBQSxZQUo4QjtBQUs5QkMsRUFBQUEsTUFMOEI7QUFNOUJDLEVBQUFBLEtBTjhCO0FBTzlCQyxFQUFBQTtBQVA4QixDQUFqQixFQVFaO0FBQ0QsU0FDRSxlQUNFO0FBQUssSUFBQSxLQUFLLEVBQUVkLEtBQUssQ0FBQ0M7QUFBbEIsS0FDRSxFQUFDLFNBQUQ7QUFDRSxJQUFBLEtBQUssRUFBRVcsTUFEVDtBQUVFLElBQUEsRUFBRSxFQUFDLGNBRkw7QUFHRSxJQUFBLElBQUksRUFBQyxRQUhQO0FBSUUsSUFBQSxRQUFRLEVBQUVILFFBSlo7QUFLRSxJQUFBLEtBQUssRUFBRVQsS0FBSyxDQUFDSTtBQUxmLElBREYsRUFRRSxFQUFDLE1BQUQ7QUFDRSxtQkFBWSxZQURkO0FBRUUsSUFBQSxRQUFRLEVBQUUsQ0FBQ1EsTUFGYjtBQUdFLElBQUEsS0FBSyxFQUFDLFFBSFI7QUFJRSxJQUFBLE9BQU8sRUFBRUU7QUFKWCxJQVJGLENBREYsRUFpQkUsRUFBQyxJQUFEO0FBQU0sSUFBQSxFQUFFLEVBQUM7QUFBVCxLQUNHTixRQUFRLElBQ1BBLFFBQVEsQ0FBQ08sTUFBVCxHQUFrQixDQURuQixJQUVDUCxRQUFRLENBQUNRLEdBQVQsQ0FBY0MsQ0FBRCxJQUFPO0FBQ2xCLFdBQ0UsRUFBQyxRQUFEO0FBQVUsTUFBQSxFQUFFLEVBQUVBLENBQUMsQ0FBQ0MsUUFBaEI7QUFBMEIsTUFBQSxPQUFPLEVBQUVSO0FBQW5DLE9BQ0dPLENBQUMsQ0FBQ0MsUUFETCxDQURGO0FBS0QsR0FORCxDQUhKLENBakJGLEVBNEJFLEVBQUMsSUFBRDtBQUFNLElBQUEsRUFBRSxFQUFDO0FBQVQsS0FDR0wsS0FBSyxJQUNKQSxLQUFLLENBQUNHLEdBQU4sQ0FBV0MsQ0FBRCxJQUFPO0FBQ2YsV0FDRSxFQUFDLFFBQUQ7QUFBVSxNQUFBLEVBQUUsRUFBRUEsQ0FBQyxDQUFDQyxRQUFoQjtBQUEwQixNQUFBLE9BQU8sRUFBRVA7QUFBbkMsT0FDR00sQ0FBQyxDQUFDQyxRQURMLENBREY7QUFLRCxHQU5ELENBRkosQ0E1QkYsQ0FERjtBQXlDRDs7OzsifQ==
