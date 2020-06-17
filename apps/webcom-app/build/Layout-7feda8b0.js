import { h } from './index-c8e03507.js';

const styles = {
  root: {
    backgroundColor: '#eeeeee',
    height: '100%'
  }
};
function Layout({
  children,
  style,
  id
}) {
  return h("div", {
    "data-testid": id,
    style: { ...styles.root,
      ...style
    }
  }, children);
}

export { Layout as L };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGF5b3V0LTdmZWRhOGIwLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUtdWkvTGF5b3V0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuY29uc3Qgc3R5bGVzID0ge1xuICByb290OiB7XG4gICAgYmFja2dyb3VuZENvbG9yOiAnI2VlZWVlZScsXG4gICAgaGVpZ2h0OiAnMTAwJScsXG4gIH0sXG59O1xuZXhwb3J0IGZ1bmN0aW9uIExheW91dCh7IGNoaWxkcmVuLCBzdHlsZSwgaWQgfSkge1xuICByZXR1cm4gPGRpdiBkYXRhLXRlc3RpZD17aWR9IHN0eWxlPXt7IC4uLnN0eWxlcy5yb290LCAuLi5zdHlsZSB9fT57Y2hpbGRyZW59PC9kaXY+O1xufVxuIl0sIm5hbWVzIjpbInN0eWxlcyIsInJvb3QiLCJiYWNrZ3JvdW5kQ29sb3IiLCJoZWlnaHQiLCJMYXlvdXQiLCJjaGlsZHJlbiIsInN0eWxlIiwiaWQiXSwibWFwcGluZ3MiOiI7O0FBQ0EsTUFBTUEsTUFBTSxHQUFHO0FBQ2JDLEVBQUFBLElBQUksRUFBRTtBQUNKQyxJQUFBQSxlQUFlLEVBQUUsU0FEYjtBQUVKQyxJQUFBQSxNQUFNLEVBQUU7QUFGSjtBQURPLENBQWY7QUFNTyxTQUFTQyxNQUFULENBQWdCO0FBQUVDLEVBQUFBLFFBQUY7QUFBWUMsRUFBQUEsS0FBWjtBQUFtQkMsRUFBQUE7QUFBbkIsQ0FBaEIsRUFBeUM7QUFDOUMsU0FBTztBQUFLLG1CQUFhQSxFQUFsQjtBQUFzQixJQUFBLEtBQUssRUFBRSxFQUFFLEdBQUdQLE1BQU0sQ0FBQ0MsSUFBWjtBQUFrQixTQUFHSztBQUFyQjtBQUE3QixLQUE0REQsUUFBNUQsQ0FBUDtBQUNEOzs7OyJ9