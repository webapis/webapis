import { h, _ as _extends, u as useAppRoute } from './index-e818a723.js';
import { T as TextInput, B as Button } from './index-6be3ba0e.js';

function List(props) {
  return h("div", _extends({
    className: "list"
  }, props));
}

function ListItem(props) {
  return h("div", _extends({
    className: "list-item"
  }, props));
}

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
  onSearchInput,
  onFetchHangouts,
  onSelectHangout,
  search
}) {
  const {
    onAppRoute
  } = useAppRoute();

  function handleHangoutSelection(e) {
    const id = e.target.id;
    onSelectHangout(e);
    const hangout = hangouts.find(g => g.username === id);
    onAppRoute({
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
    onChange: onSearchInput,
    style: style.input
  }), h(Button, {
    "data-testid": "search-btn",
    disabled: !search,
    title: "search",
    onClick: onFetchHangouts
  })), h(List, {
    id: "hangouts-list"
  }, hangouts && hangouts.length > 0 && hangouts.map(g => {
    return h(ListItem, {
      id: g.username,
      "data-testid": g.username,
      onClick: handleHangoutSelection
    }, g.username);
  })));
}

export default Hangout;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGFuZ291dC04OWU1MjJkOC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY2xpZW50L2NvbXBvbmVudHMvY29udHJvbHMvbGlzdC9pbmRleC5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL0hhbmdvdXQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiXHJcbmltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5cclxuXHJcblxyXG4gZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTGlzdChwcm9wcykge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImxpc3RcIiB7Li4ucHJvcHN9Lz5cclxuICApO1xyXG59XHJcblxyXG5cclxuIGZ1bmN0aW9uIExpc3RJdGVtKHByb3BzKSB7XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImxpc3QtaXRlbVwiIHsuLi5wcm9wc30gLz5cclxuICApO1xyXG59XHJcblxyXG5leHBvcnQge0xpc3RJdGVtfSIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5cclxuaW1wb3J0IExpc3QseyBMaXN0SXRlbSB9IGZyb20gJ2NvbnRyb2xzL2xpc3QnO1xyXG5pbXBvcnQgIFRleHRJbnB1dCAgZnJvbSAnY29udHJvbHMvdGV4dC1pbnB1dCc7XHJcbmltcG9ydCAgQnV0dG9uICBmcm9tICdjb250cm9scy9idXR0b24nO1xyXG5pbXBvcnQgeyB1c2VBcHBSb3V0ZSB9IGZyb20gJ2NvbXBvbmVudHMvYXBwLXJvdXRlJ1xyXG5cclxuXHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gIGlucHV0Q29udGFpbmVyOiB7XHJcbiAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICBib3JkZXI6ICcjNzM3MzczIHNvbGlkIDFweCcsXHJcbiAgfSxcclxuICBpbnB1dDoge1xyXG4gICAgcGFkZGluZzogMTAsXHJcbiAgICBmbGV4OiAxLFxyXG4gICAgYm9yZGVyOiAnd2hpdGUnLFxyXG5cclxuICB9LFxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSGFuZ291dCh7XHJcbiAgaGFuZ291dHMsXHJcbiAgb25TZWFyY2hJbnB1dCxcclxuICBvbkZldGNoSGFuZ291dHMsXHJcbiAgb25TZWxlY3RIYW5nb3V0LFxyXG4gIHNlYXJjaFxyXG59KSB7XHJcbiAgY29uc3QgeyBvbkFwcFJvdXRlIH0gPSB1c2VBcHBSb3V0ZSgpXHJcbiAgZnVuY3Rpb24gaGFuZGxlSGFuZ291dFNlbGVjdGlvbihlKSB7XHJcbiAgICBjb25zdCBpZCA9IGUudGFyZ2V0LmlkXHJcbiAgICBvblNlbGVjdEhhbmdvdXQoZSlcclxuICAgIGNvbnN0IGhhbmdvdXQgPSBoYW5nb3V0cy5maW5kKGcgPT4gZy51c2VybmFtZSA9PT0gaWQpXHJcblxyXG4gICAgb25BcHBSb3V0ZSh7IGZlYXR1cmVSb3V0ZTogYC8ke2hhbmdvdXQuc3RhdGV9YCwgcm91dGU6ICcvaGFuZ291dHMnIH0pXHJcbiAgfVxyXG5cclxuXHJcbiAgcmV0dXJuIChcclxuXHJcbiAgICA8ZGl2ID5cclxuICAgICAgPGRpdiBzdHlsZT17c3R5bGUuaW5wdXRDb250YWluZXJ9PlxyXG4gICAgICAgIDxUZXh0SW5wdXRcclxuICAgICAgICAgIHZhbHVlPXtzZWFyY2h9XHJcbiAgICAgICAgICBpZD1cInNlYXJjaC1pbnB1dFwiXHJcbiAgICAgICAgICB0eXBlPVwic2VhcmNoXCJcclxuICAgICAgICAgIG9uQ2hhbmdlPXtvblNlYXJjaElucHV0fVxyXG4gICAgICAgICAgc3R5bGU9e3N0eWxlLmlucHV0fVxyXG4gICAgICAgIC8+XHJcbiAgICAgICAgPEJ1dHRvblxyXG4gICAgICAgICAgZGF0YS10ZXN0aWQ9XCJzZWFyY2gtYnRuXCJcclxuICAgICAgICAgIGRpc2FibGVkPXshc2VhcmNofVxyXG4gICAgICAgICAgdGl0bGU9XCJzZWFyY2hcIlxyXG4gICAgICAgICAgb25DbGljaz17b25GZXRjaEhhbmdvdXRzfVxyXG4gICAgICAgIC8+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgPExpc3QgaWQ9XCJoYW5nb3V0cy1saXN0XCI+XHJcbiAgICAgICAge2hhbmdvdXRzICYmXHJcbiAgICAgICAgICBoYW5nb3V0cy5sZW5ndGggPiAwICYmXHJcbiAgICAgICAgICBoYW5nb3V0cy5tYXAoKGcpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICA8TGlzdEl0ZW0gaWQ9e2cudXNlcm5hbWV9IGRhdGEtdGVzdGlkPXtnLnVzZXJuYW1lfSBvbkNsaWNrPXtoYW5kbGVIYW5nb3V0U2VsZWN0aW9ufT5cclxuICAgICAgICAgICAgICAgIHtnLnVzZXJuYW1lfVxyXG4gICAgICAgICAgICAgIDwvTGlzdEl0ZW0+XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICB9KX1cclxuICAgICAgPC9MaXN0PlxyXG5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIl0sIm5hbWVzIjpbIkxpc3QiLCJwcm9wcyIsIkxpc3RJdGVtIiwic3R5bGUiLCJpbnB1dENvbnRhaW5lciIsImRpc3BsYXkiLCJib3JkZXIiLCJpbnB1dCIsInBhZGRpbmciLCJmbGV4IiwiSGFuZ291dCIsImhhbmdvdXRzIiwib25TZWFyY2hJbnB1dCIsIm9uRmV0Y2hIYW5nb3V0cyIsIm9uU2VsZWN0SGFuZ291dCIsInNlYXJjaCIsIm9uQXBwUm91dGUiLCJ1c2VBcHBSb3V0ZSIsImhhbmRsZUhhbmdvdXRTZWxlY3Rpb24iLCJlIiwiaWQiLCJ0YXJnZXQiLCJoYW5nb3V0IiwiZmluZCIsImciLCJ1c2VybmFtZSIsImZlYXR1cmVSb3V0ZSIsInN0YXRlIiwicm91dGUiLCJsZW5ndGgiLCJtYXAiXSwibWFwcGluZ3MiOiI7OztBQUtnQixTQUFTQSxJQUFULENBQWNDLEtBQWQsRUFBcUI7QUFDbkMsU0FDRTtBQUFLLElBQUEsU0FBUyxFQUFDO0FBQWYsS0FBMEJBLEtBQTFCLEVBREY7QUFHRDs7QUFHQSxTQUFTQyxRQUFULENBQWtCRCxLQUFsQixFQUF5QjtBQUV4QixTQUNFO0FBQUssSUFBQSxTQUFTLEVBQUM7QUFBZixLQUErQkEsS0FBL0IsRUFERjtBQUdEOztBQ1RELE1BQU1FLEtBQUssR0FBRztBQUNaQyxFQUFBQSxjQUFjLEVBQUU7QUFDZEMsSUFBQUEsT0FBTyxFQUFFLE1BREs7QUFFZEMsSUFBQUEsTUFBTSxFQUFFO0FBRk0sR0FESjtBQUtaQyxFQUFBQSxLQUFLLEVBQUU7QUFDTEMsSUFBQUEsT0FBTyxFQUFFLEVBREo7QUFFTEMsSUFBQUEsSUFBSSxFQUFFLENBRkQ7QUFHTEgsSUFBQUEsTUFBTSxFQUFFO0FBSEg7QUFMSyxDQUFkO0FBYWUsU0FBU0ksT0FBVCxDQUFpQjtBQUM5QkMsRUFBQUEsUUFEOEI7QUFFOUJDLEVBQUFBLGFBRjhCO0FBRzlCQyxFQUFBQSxlQUg4QjtBQUk5QkMsRUFBQUEsZUFKOEI7QUFLOUJDLEVBQUFBO0FBTDhCLENBQWpCLEVBTVo7QUFDRCxRQUFNO0FBQUVDLElBQUFBO0FBQUYsTUFBaUJDLFdBQVcsRUFBbEM7O0FBQ0EsV0FBU0Msc0JBQVQsQ0FBZ0NDLENBQWhDLEVBQW1DO0FBQ2pDLFVBQU1DLEVBQUUsR0FBR0QsQ0FBQyxDQUFDRSxNQUFGLENBQVNELEVBQXBCO0FBQ0FOLElBQUFBLGVBQWUsQ0FBQ0ssQ0FBRCxDQUFmO0FBQ0EsVUFBTUcsT0FBTyxHQUFHWCxRQUFRLENBQUNZLElBQVQsQ0FBY0MsQ0FBQyxJQUFJQSxDQUFDLENBQUNDLFFBQUYsS0FBZUwsRUFBbEMsQ0FBaEI7QUFFQUosSUFBQUEsVUFBVSxDQUFDO0FBQUVVLE1BQUFBLFlBQVksRUFBRyxJQUFHSixPQUFPLENBQUNLLEtBQU0sRUFBbEM7QUFBcUNDLE1BQUFBLEtBQUssRUFBRTtBQUE1QyxLQUFELENBQVY7QUFDRDs7QUFHRCxTQUVFLGVBQ0U7QUFBSyxJQUFBLEtBQUssRUFBRXpCLEtBQUssQ0FBQ0M7QUFBbEIsS0FDRSxFQUFDLFNBQUQ7QUFDRSxJQUFBLEtBQUssRUFBRVcsTUFEVDtBQUVFLElBQUEsRUFBRSxFQUFDLGNBRkw7QUFHRSxJQUFBLElBQUksRUFBQyxRQUhQO0FBSUUsSUFBQSxRQUFRLEVBQUVILGFBSlo7QUFLRSxJQUFBLEtBQUssRUFBRVQsS0FBSyxDQUFDSTtBQUxmLElBREYsRUFRRSxFQUFDLE1BQUQ7QUFDRSxtQkFBWSxZQURkO0FBRUUsSUFBQSxRQUFRLEVBQUUsQ0FBQ1EsTUFGYjtBQUdFLElBQUEsS0FBSyxFQUFDLFFBSFI7QUFJRSxJQUFBLE9BQU8sRUFBRUY7QUFKWCxJQVJGLENBREYsRUFpQkUsRUFBQyxJQUFEO0FBQU0sSUFBQSxFQUFFLEVBQUM7QUFBVCxLQUNHRixRQUFRLElBQ1BBLFFBQVEsQ0FBQ2tCLE1BQVQsR0FBa0IsQ0FEbkIsSUFFQ2xCLFFBQVEsQ0FBQ21CLEdBQVQsQ0FBY04sQ0FBRCxJQUFPO0FBQ2xCLFdBQ0UsRUFBQyxRQUFEO0FBQVUsTUFBQSxFQUFFLEVBQUVBLENBQUMsQ0FBQ0MsUUFBaEI7QUFBMEIscUJBQWFELENBQUMsQ0FBQ0MsUUFBekM7QUFBbUQsTUFBQSxPQUFPLEVBQUVQO0FBQTVELE9BQ0dNLENBQUMsQ0FBQ0MsUUFETCxDQURGO0FBS0QsR0FORCxDQUhKLENBakJGLENBRkY7QUFpQ0Q7Ozs7In0=
