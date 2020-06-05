import { a as h } from './index-bdb5940f.js';
import { B as Button } from './Button-508f2902.js';
import { L as Layout } from './Layout-26b487fb.js';
import { B as Block } from './Block-5abb8a45.js';
import { C as Center } from './Center-b56d569d.js';

const style = {
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
function Blocked({
  hangout,
  onUnblock,
  onClose
}) {
  return h(Layout, {
    style: style.layout,
    id: "blocked-ui"
  }, h(Center, {
    style: {
      flexDirection: 'column',
      alignItems: 'center'
    }
  }, h(Block, {
    width: "60",
    height: "70",
    color: "red"
  }), h("b", null, hangout && hangout.username), " is blocked"), h("div", {
    style: {
      display: 'flex',
      padding: 8
    }
  }, h(Button, {
    title: "Close",
    style: style.btn,
    onClick: onClose
  }), h(Button, {
    title: "Unblock",
    style: style.btn,
    onClick: onUnblock
  })));
}

export default Blocked;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmxvY2tlZC03YjMzZDIxNy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlLXVpL0Jsb2NrZWQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyBCbG9jayB9IGZyb20gJy4uLy4uL2xheW91dC9pY29ucy9CbG9jayc7XG5pbXBvcnQgeyBDZW50ZXIgfSBmcm9tICcuLi8uLi9sYXlvdXQvQ2VudGVyJztcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4uLy4uL2xheW91dC9CdXR0b24nO1xuaW1wb3J0IHsgTGF5b3V0IH0gZnJvbSAnLi9MYXlvdXQnO1xuXG5jb25zdCBzdHlsZSA9IHtcbiAgbGF5b3V0OiB7XG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxuICAgIGhlaWdodDogJzEwMCUnLFxuICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG4gIH0sXG4gIGJ0bjoge1xuICAgIGZsZXg6IDEsXG4gICAgbWFyZ2luUmlnaHQ6IDQsXG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBCbG9ja2VkKHsgaGFuZ291dCwgb25VbmJsb2NrLCBvbkNsb3NlIH0pIHtcbiAgcmV0dXJuIChcbiAgICA8TGF5b3V0IHN0eWxlPXtzdHlsZS5sYXlvdXR9IGlkPVwiYmxvY2tlZC11aVwiPlxuICAgICAgPENlbnRlciBzdHlsZT17eyBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJywgYWxpZ25JdGVtczogJ2NlbnRlcicgfX0+XG4gICAgICAgIDxCbG9jayB3aWR0aD1cIjYwXCIgaGVpZ2h0PVwiNzBcIiBjb2xvcj1cInJlZFwiIC8+XG4gICAgICAgIDxiPntoYW5nb3V0ICYmIGhhbmdvdXQudXNlcm5hbWV9PC9iPiBpcyBibG9ja2VkXG4gICAgICA8L0NlbnRlcj5cblxuICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIHBhZGRpbmc6IDggfX0+XG4gICAgICAgIDxCdXR0b24gdGl0bGU9XCJDbG9zZVwiIHN0eWxlPXtzdHlsZS5idG59IG9uQ2xpY2s9e29uQ2xvc2V9IC8+XG4gICAgICAgIDxCdXR0b24gdGl0bGU9XCJVbmJsb2NrXCIgc3R5bGU9e3N0eWxlLmJ0bn0gb25DbGljaz17b25VbmJsb2NrfSAvPlxuICAgICAgPC9kaXY+XG4gICAgPC9MYXlvdXQ+XG4gICk7XG59XG4iXSwibmFtZXMiOlsic3R5bGUiLCJsYXlvdXQiLCJkaXNwbGF5IiwiZmxleERpcmVjdGlvbiIsImhlaWdodCIsImp1c3RpZnlDb250ZW50IiwiYnRuIiwiZmxleCIsIm1hcmdpblJpZ2h0IiwiQmxvY2tlZCIsImhhbmdvdXQiLCJvblVuYmxvY2siLCJvbkNsb3NlIiwiYWxpZ25JdGVtcyIsInVzZXJuYW1lIiwicGFkZGluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBTUEsTUFBTUEsS0FBSyxHQUFHO0FBQ1pDLEVBQUFBLE1BQU0sRUFBRTtBQUNOQyxJQUFBQSxPQUFPLEVBQUUsTUFESDtBQUVOQyxJQUFBQSxhQUFhLEVBQUUsUUFGVDtBQUdOQyxJQUFBQSxNQUFNLEVBQUUsTUFIRjtBQUlOQyxJQUFBQSxjQUFjLEVBQUU7QUFKVixHQURJO0FBT1pDLEVBQUFBLEdBQUcsRUFBRTtBQUNIQyxJQUFBQSxJQUFJLEVBQUUsQ0FESDtBQUVIQyxJQUFBQSxXQUFXLEVBQUU7QUFGVjtBQVBPLENBQWQ7QUFhZSxTQUFTQyxPQUFULENBQWlCO0FBQUVDLEVBQUFBLE9BQUY7QUFBV0MsRUFBQUEsU0FBWDtBQUFzQkMsRUFBQUE7QUFBdEIsQ0FBakIsRUFBa0Q7QUFDL0QsU0FDRSxFQUFDLE1BQUQ7QUFBUSxJQUFBLEtBQUssRUFBRVosS0FBSyxDQUFDQyxNQUFyQjtBQUE2QixJQUFBLEVBQUUsRUFBQztBQUFoQyxLQUNFLEVBQUMsTUFBRDtBQUFRLElBQUEsS0FBSyxFQUFFO0FBQUVFLE1BQUFBLGFBQWEsRUFBRSxRQUFqQjtBQUEyQlUsTUFBQUEsVUFBVSxFQUFFO0FBQXZDO0FBQWYsS0FDRSxFQUFDLEtBQUQ7QUFBTyxJQUFBLEtBQUssRUFBQyxJQUFiO0FBQWtCLElBQUEsTUFBTSxFQUFDLElBQXpCO0FBQThCLElBQUEsS0FBSyxFQUFDO0FBQXBDLElBREYsRUFFRSxhQUFJSCxPQUFPLElBQUlBLE9BQU8sQ0FBQ0ksUUFBdkIsQ0FGRixnQkFERixFQU1FO0FBQUssSUFBQSxLQUFLLEVBQUU7QUFBRVosTUFBQUEsT0FBTyxFQUFFLE1BQVg7QUFBbUJhLE1BQUFBLE9BQU8sRUFBRTtBQUE1QjtBQUFaLEtBQ0UsRUFBQyxNQUFEO0FBQVEsSUFBQSxLQUFLLEVBQUMsT0FBZDtBQUFzQixJQUFBLEtBQUssRUFBRWYsS0FBSyxDQUFDTSxHQUFuQztBQUF3QyxJQUFBLE9BQU8sRUFBRU07QUFBakQsSUFERixFQUVFLEVBQUMsTUFBRDtBQUFRLElBQUEsS0FBSyxFQUFDLFNBQWQ7QUFBd0IsSUFBQSxLQUFLLEVBQUVaLEtBQUssQ0FBQ00sR0FBckM7QUFBMEMsSUFBQSxPQUFPLEVBQUVLO0FBQW5ELElBRkYsQ0FORixDQURGO0FBYUQ7Ozs7In0=
