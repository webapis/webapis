import { j as useAppContext, k as h, L as List, J as ListItem, K as actionTypes } from './index-4a86907b.js';
import { T as TextInput } from './TextInput-df961c5f.js';
import { B as Button } from './Button-765f814e.js';

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
  search,
  users,
  onStartSearch
}) {
  const [state, dispatch] = useAppContext();

  function handleHangoutSelection(e) {
    const id = e.target.id;
    onSelectHangout(e);
    const hangout = hangouts.find(g => g.username === id);
    debugger;
    dispatch({
      type: actionTypes.APP_ROUTE_CHANGED,
      featureRoute: `/${hangout.state}`,
      route: '/hangouts'
    });
  }

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
      onClick: handleHangoutSelection
    }, g.username);
  })));
}

export default Hangout;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGFuZ291dC1iMTRjMjk1ZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL0hhbmdvdXQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xuaW1wb3J0IHsgTGlzdCwgTGlzdEl0ZW0gfSBmcm9tICcuLi9sYXlvdXQvTmF2TGlzdCc7XG5pbXBvcnQgeyBUZXh0SW5wdXQgfSBmcm9tICcuLi9sYXlvdXQvVGV4dElucHV0JztcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4uL2xheW91dC9CdXR0b24nO1xuaW1wb3J0IHt1c2VBcHBDb250ZXh0fWZyb20gJy4uL2FwcC1jb250ZXh0L2FwcC1jb250ZXh0J1xuaW1wb3J0IHthY3Rpb25UeXBlc30gZnJvbSAnLi4vYXBwLWNvbnRleHQvYWN0aW9uVHlwZXMnXG5jb25zdCBzdHlsZSA9IHtcbiAgaW5wdXRDb250YWluZXI6IHtcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgYm9yZGVyOiAnIzczNzM3MyBzb2xpZCAxcHgnLFxuICB9LFxuICBpbnB1dDoge1xuICAgIHBhZGRpbmc6IDEwLFxuICAgIGZsZXg6IDEsXG4gICAgYm9yZGVyOiAnd2hpdGUnLFxuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSGFuZ291dCh7XG4gIGhhbmdvdXRzLFxuICBvblNlYXJjaCxcbiAgb25TZWxlY3RIYW5nb3V0LFxuICBzZWFyY2gsXG4gIHVzZXJzLFxuICBvblN0YXJ0U2VhcmNoLFxufSkge1xuICBjb25zdCBbc3RhdGUsZGlzcGF0Y2hdPXVzZUFwcENvbnRleHQoKVxuICBmdW5jdGlvbiBoYW5kbGVIYW5nb3V0U2VsZWN0aW9uKGUpe1xuICAgIGNvbnN0IGlkID1lLnRhcmdldC5pZFxuICAgIG9uU2VsZWN0SGFuZ291dChlKVxuICAgIGNvbnN0IGhhbmdvdXQgPSBoYW5nb3V0cy5maW5kKGc9PiBnLnVzZXJuYW1lPT09aWQpXG4gICAgZGVidWdnZXI7XG4gICAgZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuQVBQX1JPVVRFX0NIQU5HRUQsIGZlYXR1cmVSb3V0ZTpgLyR7aGFuZ291dC5zdGF0ZX1gLHJvdXRlOicvaGFuZ291dHMnfSlcbiAgfVxuICByZXR1cm4gKFxuIFxuICAgIDxkaXY+XG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5pbnB1dENvbnRhaW5lcn0+XG4gICAgICAgIDxUZXh0SW5wdXRcbiAgICAgICAgICB2YWx1ZT17c2VhcmNofVxuICAgICAgICAgIGlkPVwic2VhcmNoLWlucHV0XCJcbiAgICAgICAgICB0eXBlPVwic2VhcmNoXCJcbiAgICAgICAgICBvbkNoYW5nZT17b25TZWFyY2h9XG4gICAgICAgICAgc3R5bGU9e3N0eWxlLmlucHV0fVxuICAgICAgICAvPlxuICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgZGF0YS10ZXN0aWQ9XCJzZWFyY2gtYnRuXCJcbiAgICAgICAgICBkaXNhYmxlZD17IXNlYXJjaH1cbiAgICAgICAgICB0aXRsZT1cInNlYXJjaFwiXG4gICAgICAgICAgb25DbGljaz17b25TdGFydFNlYXJjaH1cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuXG4gICAgICA8TGlzdCBpZD1cImhhbmdvdXRzLWxpc3RcIj5cbiAgICAgICAge2hhbmdvdXRzICYmXG4gICAgICAgICAgaGFuZ291dHMubGVuZ3RoID4gMCAmJlxuICAgICAgICAgIGhhbmdvdXRzLm1hcCgoZykgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgPExpc3RJdGVtIGlkPXtnLnVzZXJuYW1lfSBvbkNsaWNrPXtoYW5kbGVIYW5nb3V0U2VsZWN0aW9ufT5cbiAgICAgICAgICAgICAgICB7Zy51c2VybmFtZX1cbiAgICAgICAgICAgICAgPC9MaXN0SXRlbT5cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSl9XG4gICAgICA8L0xpc3Q+XG4gICBcbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiJdLCJuYW1lcyI6WyJzdHlsZSIsImlucHV0Q29udGFpbmVyIiwiZGlzcGxheSIsImJvcmRlciIsImlucHV0IiwicGFkZGluZyIsImZsZXgiLCJIYW5nb3V0IiwiaGFuZ291dHMiLCJvblNlYXJjaCIsIm9uU2VsZWN0SGFuZ291dCIsInNlYXJjaCIsInVzZXJzIiwib25TdGFydFNlYXJjaCIsInN0YXRlIiwiZGlzcGF0Y2giLCJ1c2VBcHBDb250ZXh0IiwiaGFuZGxlSGFuZ291dFNlbGVjdGlvbiIsImUiLCJpZCIsInRhcmdldCIsImhhbmdvdXQiLCJmaW5kIiwiZyIsInVzZXJuYW1lIiwidHlwZSIsImFjdGlvblR5cGVzIiwiQVBQX1JPVVRFX0NIQU5HRUQiLCJmZWF0dXJlUm91dGUiLCJyb3V0ZSIsImxlbmd0aCIsIm1hcCJdLCJtYXBwaW5ncyI6Ijs7OztBQU9BLE1BQU1BLEtBQUssR0FBRztBQUNaQyxFQUFBQSxjQUFjLEVBQUU7QUFDZEMsSUFBQUEsT0FBTyxFQUFFLE1BREs7QUFFZEMsSUFBQUEsTUFBTSxFQUFFO0FBRk0sR0FESjtBQUtaQyxFQUFBQSxLQUFLLEVBQUU7QUFDTEMsSUFBQUEsT0FBTyxFQUFFLEVBREo7QUFFTEMsSUFBQUEsSUFBSSxFQUFFLENBRkQ7QUFHTEgsSUFBQUEsTUFBTSxFQUFFO0FBSEg7QUFMSyxDQUFkO0FBWWUsU0FBU0ksT0FBVCxDQUFpQjtBQUM5QkMsRUFBQUEsUUFEOEI7QUFFOUJDLEVBQUFBLFFBRjhCO0FBRzlCQyxFQUFBQSxlQUg4QjtBQUk5QkMsRUFBQUEsTUFKOEI7QUFLOUJDLEVBQUFBLEtBTDhCO0FBTTlCQyxFQUFBQTtBQU44QixDQUFqQixFQU9aO0FBQ0QsUUFBTSxDQUFDQyxLQUFELEVBQU9DLFFBQVAsSUFBaUJDLGFBQWEsRUFBcEM7O0FBQ0EsV0FBU0Msc0JBQVQsQ0FBZ0NDLENBQWhDLEVBQWtDO0FBQ2hDLFVBQU1DLEVBQUUsR0FBRUQsQ0FBQyxDQUFDRSxNQUFGLENBQVNELEVBQW5CO0FBQ0FULElBQUFBLGVBQWUsQ0FBQ1EsQ0FBRCxDQUFmO0FBQ0EsVUFBTUcsT0FBTyxHQUFHYixRQUFRLENBQUNjLElBQVQsQ0FBY0MsQ0FBQyxJQUFHQSxDQUFDLENBQUNDLFFBQUYsS0FBYUwsRUFBL0IsQ0FBaEI7QUFDQTtBQUNBSixJQUFBQSxRQUFRLENBQUM7QUFBQ1UsTUFBQUEsSUFBSSxFQUFDQyxXQUFXLENBQUNDLGlCQUFsQjtBQUFxQ0MsTUFBQUEsWUFBWSxFQUFFLElBQUdQLE9BQU8sQ0FBQ1AsS0FBTSxFQUFwRTtBQUFzRWUsTUFBQUEsS0FBSyxFQUFDO0FBQTVFLEtBQUQsQ0FBUjtBQUNEOztBQUNELFNBRUUsZUFDRTtBQUFLLElBQUEsS0FBSyxFQUFFN0IsS0FBSyxDQUFDQztBQUFsQixLQUNFLEVBQUMsU0FBRDtBQUNFLElBQUEsS0FBSyxFQUFFVSxNQURUO0FBRUUsSUFBQSxFQUFFLEVBQUMsY0FGTDtBQUdFLElBQUEsSUFBSSxFQUFDLFFBSFA7QUFJRSxJQUFBLFFBQVEsRUFBRUYsUUFKWjtBQUtFLElBQUEsS0FBSyxFQUFFVCxLQUFLLENBQUNJO0FBTGYsSUFERixFQVFFLEVBQUMsTUFBRDtBQUNFLG1CQUFZLFlBRGQ7QUFFRSxJQUFBLFFBQVEsRUFBRSxDQUFDTyxNQUZiO0FBR0UsSUFBQSxLQUFLLEVBQUMsUUFIUjtBQUlFLElBQUEsT0FBTyxFQUFFRTtBQUpYLElBUkYsQ0FERixFQWlCRSxFQUFDLElBQUQ7QUFBTSxJQUFBLEVBQUUsRUFBQztBQUFULEtBQ0dMLFFBQVEsSUFDUEEsUUFBUSxDQUFDc0IsTUFBVCxHQUFrQixDQURuQixJQUVDdEIsUUFBUSxDQUFDdUIsR0FBVCxDQUFjUixDQUFELElBQU87QUFDbEIsV0FDRSxFQUFDLFFBQUQ7QUFBVSxNQUFBLEVBQUUsRUFBRUEsQ0FBQyxDQUFDQyxRQUFoQjtBQUEwQixNQUFBLE9BQU8sRUFBRVA7QUFBbkMsT0FDR00sQ0FBQyxDQUFDQyxRQURMLENBREY7QUFLRCxHQU5ELENBSEosQ0FqQkYsQ0FGRjtBQWlDRDs7OzsifQ==
