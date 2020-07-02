import { h } from './index-50d7d53d.js';

const style = {
  boxShadow: `0px 3px 3px -2px rgba(0, 0, 0, 0.2),
    0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12)`,
  margin: 8,
  padding: 8
};
function Paper(props) {
  const {
    children
  } = props;
  return h("div", {
    style: style
  }, children);
}

function Grid(props) {
  const {
    children,
    width
  } = props;
  return h("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: `auto ${width}% auto`
    }
  }, h("div", null), h("div", null, children), h("div", null));
}

export { Grid as G, Paper as P };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3JpZC01YTViOWI3NS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY2xpZW50L2NvbXBvbmVudHMvbGF5b3V0L1BhcGVyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2NvbXBvbmVudHMvbGF5b3V0L0dyaWQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcblxyXG5jb25zdCBzdHlsZSA9IHtcclxuICBib3hTaGFkb3c6IGAwcHggM3B4IDNweCAtMnB4IHJnYmEoMCwgMCwgMCwgMC4yKSxcclxuICAgIDBweCAzcHggNHB4IDBweCByZ2JhKDAsIDAsIDAsIDAuMTQpLCAwcHggMXB4IDhweCAwcHggcmdiYSgwLCAwLCAwLCAwLjEyKWAsXHJcbiAgbWFyZ2luOiA4LFxyXG4gIHBhZGRpbmc6IDgsXHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gUGFwZXIocHJvcHMpIHtcclxuICBjb25zdCB7IGNoaWxkcmVuIH0gPSBwcm9wcztcclxuICByZXR1cm4gPGRpdiBzdHlsZT17c3R5bGV9PntjaGlsZHJlbn08L2Rpdj47XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gR3JpZChwcm9wcykge1xyXG4gIGNvbnN0IHsgY2hpbGRyZW4sIHdpZHRoIH0gPSBwcm9wcztcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdlxyXG4gICAgICBzdHlsZT17e1xyXG4gICAgICAgIGRpc3BsYXk6ICdncmlkJyxcclxuICAgICAgICBncmlkVGVtcGxhdGVDb2x1bW5zOiBgYXV0byAke3dpZHRofSUgYXV0b2AsXHJcbiAgICAgIH19XHJcbiAgICA+XHJcbiAgICAgIDxkaXY+PC9kaXY+XHJcbiAgICAgIDxkaXY+e2NoaWxkcmVufTwvZGl2PlxyXG4gICAgICA8ZGl2PjwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iXSwibmFtZXMiOlsic3R5bGUiLCJib3hTaGFkb3ciLCJtYXJnaW4iLCJwYWRkaW5nIiwiUGFwZXIiLCJwcm9wcyIsImNoaWxkcmVuIiwiR3JpZCIsIndpZHRoIiwiZGlzcGxheSIsImdyaWRUZW1wbGF0ZUNvbHVtbnMiXSwibWFwcGluZ3MiOiI7O0FBRUEsTUFBTUEsS0FBSyxHQUFHO0FBQ1pDLEVBQUFBLFNBQVMsRUFBRzs2RUFEQTtBQUdaQyxFQUFBQSxNQUFNLEVBQUUsQ0FISTtBQUlaQyxFQUFBQSxPQUFPLEVBQUU7QUFKRyxDQUFkO0FBT08sU0FBU0MsS0FBVCxDQUFlQyxLQUFmLEVBQXNCO0FBQzNCLFFBQU07QUFBRUMsSUFBQUE7QUFBRixNQUFlRCxLQUFyQjtBQUNBLFNBQU87QUFBSyxJQUFBLEtBQUssRUFBRUw7QUFBWixLQUFvQk0sUUFBcEIsQ0FBUDtBQUNEOztBQ1ZNLFNBQVNDLElBQVQsQ0FBY0YsS0FBZCxFQUFxQjtBQUMxQixRQUFNO0FBQUVDLElBQUFBLFFBQUY7QUFBWUUsSUFBQUE7QUFBWixNQUFzQkgsS0FBNUI7QUFDQSxTQUNFO0FBQ0UsSUFBQSxLQUFLLEVBQUU7QUFDTEksTUFBQUEsT0FBTyxFQUFFLE1BREo7QUFFTEMsTUFBQUEsbUJBQW1CLEVBQUcsUUFBT0YsS0FBTTtBQUY5QjtBQURULEtBTUUsY0FORixFQU9FLGVBQU1GLFFBQU4sQ0FQRixFQVFFLGNBUkYsQ0FERjtBQVlEOzs7OyJ9
