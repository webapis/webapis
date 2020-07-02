import { s as styleInject, h, _ as _extends, d as v, p } from './index-50d7d53d.js';

var css_248z = ".btn {\r\n  padding: 6px 16px;\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-box-align: center;\r\n      -ms-flex-align: center;\r\n          align-items: center;\r\n  border: none;\r\n  -webkit-box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);\r\n          box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);\r\n  min-width: 64px;\r\n  font-weight: 500;\r\n  font-size: 0.875rem;\r\n  -webkit-box-sizing: border-box;\r\n          box-sizing: border-box;\r\n}";
styleInject(css_248z);

const style = {
  circle: {
    backgroundColor: 'green',
    width: 10,
    height: 10,
    borderRadius: 10,
    marginRight: 3,
    padding: 3
  },
  circleContainer: {
    display: 'flex'
  }
};

function ProgressBar() {
  const [selected, setSelected] = v(0);
  const [state, setState] = v(false);
  p(() => {
    if (state) {
      if (selected === 0) {
        setSelected(1);
      }

      if (selected === 1) {
        setSelected(2);
      }

      if (selected === 2) {
        setSelected(0);
      }
    }
  }, [state]);
  p(() => {
    let interval = setInterval(function () {
      setState(prev => !prev);
    }, 100);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return h("div", {
    style: style.circleContainer,
    className: "btn"
  }, h("div", {
    style: { ...style.circle,
      backgroundColor: selected === 0 ? 'white' : 'green'
    }
  }), h("div", {
    style: { ...style.circle,
      backgroundColor: selected === 1 ? 'white' : 'green'
    }
  }), h("div", {
    style: { ...style.circle,
      backgroundColor: selected === 2 ? 'white' : 'green'
    }
  }));
}

function AsyncButton(props) {
  const {
    loading
  } = props;

  if (loading) {
    return h(ProgressBar, null);
  } else return h("button", _extends({
    className: "btn"
  }, props));
}

export { AsyncButton as A };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtYzcyNTNlYzkuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9jb21wb25lbnRzL2NvbnRyb2xzL2FzeW5jLWJ1dHRvbi9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0J1xyXG5pbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncHJlYWN0L2hvb2tzJ1xyXG5pbXBvcnQgJy4vY3NzL3N0eWxlLmNzcydcclxuY29uc3Qgc3R5bGUgPSB7XHJcbiAgICBjaXJjbGU6IHtcclxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdncmVlbicsXHJcbiAgICAgICAgd2lkdGg6IDEwLFxyXG4gICAgICAgIGhlaWdodDogMTAsXHJcbiAgICAgICAgYm9yZGVyUmFkaXVzOiAxMCxcclxuICAgICAgICBtYXJnaW5SaWdodDogMyxcclxuICAgICAgICBwYWRkaW5nOjMsXHJcbiAgICB9LFxyXG4gICAgY2lyY2xlQ29udGFpbmVyOiB7XHJcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnXHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIFByb2dyZXNzQmFyKCkge1xyXG4gICAgY29uc3QgW3NlbGVjdGVkLCBzZXRTZWxlY3RlZF0gPSB1c2VTdGF0ZSgwKVxyXG4gICAgY29uc3QgW3N0YXRlLHNldFN0YXRlXT11c2VTdGF0ZShmYWxzZSlcclxuICAgIHVzZUVmZmVjdCgoKT0+e1xyXG4gICAgICAgIGlmKHN0YXRlKXtcclxuICAgICAgICAgICAgaWYoc2VsZWN0ZWQ9PT0wKXtcclxuICAgICAgICAgICAgICAgIHNldFNlbGVjdGVkKDEpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYoc2VsZWN0ZWQ9PT0xKXtcclxuICAgICAgICAgICAgICAgIHNldFNlbGVjdGVkKDIpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYoc2VsZWN0ZWQ9PT0yKXtcclxuICAgICAgICAgICAgICAgIHNldFNlbGVjdGVkKDApXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgXHJcblxyXG4gICAgfSxbc3RhdGVdKVxyXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgICAgICBsZXQgaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICBzZXRTdGF0ZShwcmV2PT4gIXByZXYpXHJcbiAgICAgICAgfSwgMTAwKVxyXG5cclxuICAgICAgICByZXR1cm4gKCk9PntcclxuICAgICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsKVxyXG4gICAgICAgIH1cclxuICAgIH0sIFtdKVxyXG5cclxuICAgIHJldHVybiA8ZGl2IHN0eWxlPXtzdHlsZS5jaXJjbGVDb250YWluZXJ9IGNsYXNzTmFtZT1cImJ0blwiPlxyXG4gICAgICAgIDxkaXYgc3R5bGU9e3sgLi4uc3R5bGUuY2lyY2xlLCBiYWNrZ3JvdW5kQ29sb3I6IHNlbGVjdGVkID09PSAwID8gJ3doaXRlJyA6ICdncmVlbicgfX0+PC9kaXY+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17eyAuLi5zdHlsZS5jaXJjbGUsIGJhY2tncm91bmRDb2xvcjogc2VsZWN0ZWQgPT09IDEgPyAnd2hpdGUnIDogJ2dyZWVuJyB9fT48L2Rpdj5cclxuICAgICAgICA8ZGl2IHN0eWxlPXt7IC4uLnN0eWxlLmNpcmNsZSwgYmFja2dyb3VuZENvbG9yOiBzZWxlY3RlZCA9PT0gMiA/ICd3aGl0ZScgOiAnZ3JlZW4nIH19PjwvZGl2PlxyXG5cclxuICAgIDwvZGl2PlxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBc3luY0J1dHRvbihwcm9wcykge1xyXG4gICAgY29uc3Qge2xvYWRpbmd9PXByb3BzXHJcbiAgICBpZiAobG9hZGluZykge1xyXG4gICAgICAgIHJldHVybiA8UHJvZ3Jlc3NCYXIgLz5cclxuICAgIH1cclxuICAgIGVsc2VcclxuICAgIHJldHVybiA8YnV0dG9uICBjbGFzc05hbWU9XCJidG5cIiB7Li4ucHJvcHN9Lz5cclxufSJdLCJuYW1lcyI6WyJzdHlsZSIsImNpcmNsZSIsImJhY2tncm91bmRDb2xvciIsIndpZHRoIiwiaGVpZ2h0IiwiYm9yZGVyUmFkaXVzIiwibWFyZ2luUmlnaHQiLCJwYWRkaW5nIiwiY2lyY2xlQ29udGFpbmVyIiwiZGlzcGxheSIsIlByb2dyZXNzQmFyIiwic2VsZWN0ZWQiLCJzZXRTZWxlY3RlZCIsInVzZVN0YXRlIiwic3RhdGUiLCJzZXRTdGF0ZSIsInVzZUVmZmVjdCIsImludGVydmFsIiwic2V0SW50ZXJ2YWwiLCJwcmV2IiwiY2xlYXJJbnRlcnZhbCIsIkFzeW5jQnV0dG9uIiwicHJvcHMiLCJsb2FkaW5nIl0sIm1hcHBpbmdzIjoiOzs7OztBQUdBLE1BQU1BLEtBQUssR0FBRztBQUNWQyxFQUFBQSxNQUFNLEVBQUU7QUFDSkMsSUFBQUEsZUFBZSxFQUFFLE9BRGI7QUFFSkMsSUFBQUEsS0FBSyxFQUFFLEVBRkg7QUFHSkMsSUFBQUEsTUFBTSxFQUFFLEVBSEo7QUFJSkMsSUFBQUEsWUFBWSxFQUFFLEVBSlY7QUFLSkMsSUFBQUEsV0FBVyxFQUFFLENBTFQ7QUFNSkMsSUFBQUEsT0FBTyxFQUFDO0FBTkosR0FERTtBQVNWQyxFQUFBQSxlQUFlLEVBQUU7QUFDYkMsSUFBQUEsT0FBTyxFQUFFO0FBREk7QUFUUCxDQUFkOztBQWNBLFNBQVNDLFdBQVQsR0FBdUI7QUFDbkIsUUFBTSxDQUFDQyxRQUFELEVBQVdDLFdBQVgsSUFBMEJDLENBQVEsQ0FBQyxDQUFELENBQXhDO0FBQ0EsUUFBTSxDQUFDQyxLQUFELEVBQU9DLFFBQVAsSUFBaUJGLENBQVEsQ0FBQyxLQUFELENBQS9CO0FBQ0FHLEVBQUFBLENBQVMsQ0FBQyxNQUFJO0FBQ1YsUUFBR0YsS0FBSCxFQUFTO0FBQ0wsVUFBR0gsUUFBUSxLQUFHLENBQWQsRUFBZ0I7QUFDWkMsUUFBQUEsV0FBVyxDQUFDLENBQUQsQ0FBWDtBQUNIOztBQUNELFVBQUdELFFBQVEsS0FBRyxDQUFkLEVBQWdCO0FBQ1pDLFFBQUFBLFdBQVcsQ0FBQyxDQUFELENBQVg7QUFDSDs7QUFDRCxVQUFHRCxRQUFRLEtBQUcsQ0FBZCxFQUFnQjtBQUNaQyxRQUFBQSxXQUFXLENBQUMsQ0FBRCxDQUFYO0FBQ0g7QUFDSjtBQUlKLEdBZlEsRUFlUCxDQUFDRSxLQUFELENBZk8sQ0FBVDtBQWdCQUUsRUFBQUEsQ0FBUyxDQUFDLE1BQU07QUFDWixRQUFJQyxRQUFRLEdBQUdDLFdBQVcsQ0FBQyxZQUFXO0FBQ25DSCxNQUFBQSxRQUFRLENBQUNJLElBQUksSUFBRyxDQUFDQSxJQUFULENBQVI7QUFDRixLQUZ5QixFQUV2QixHQUZ1QixDQUExQjtBQUlBLFdBQU8sTUFBSTtBQUNSQyxNQUFBQSxhQUFhLENBQUNILFFBQUQsQ0FBYjtBQUNGLEtBRkQ7QUFHSCxHQVJRLEVBUU4sRUFSTSxDQUFUO0FBVUEsU0FBTztBQUFLLElBQUEsS0FBSyxFQUFFakIsS0FBSyxDQUFDUSxlQUFsQjtBQUFtQyxJQUFBLFNBQVMsRUFBQztBQUE3QyxLQUNIO0FBQUssSUFBQSxLQUFLLEVBQUUsRUFBRSxHQUFHUixLQUFLLENBQUNDLE1BQVg7QUFBbUJDLE1BQUFBLGVBQWUsRUFBRVMsUUFBUSxLQUFLLENBQWIsR0FBaUIsT0FBakIsR0FBMkI7QUFBL0Q7QUFBWixJQURHLEVBRUg7QUFBSyxJQUFBLEtBQUssRUFBRSxFQUFFLEdBQUdYLEtBQUssQ0FBQ0MsTUFBWDtBQUFtQkMsTUFBQUEsZUFBZSxFQUFFUyxRQUFRLEtBQUssQ0FBYixHQUFpQixPQUFqQixHQUEyQjtBQUEvRDtBQUFaLElBRkcsRUFHSDtBQUFLLElBQUEsS0FBSyxFQUFFLEVBQUUsR0FBR1gsS0FBSyxDQUFDQyxNQUFYO0FBQW1CQyxNQUFBQSxlQUFlLEVBQUVTLFFBQVEsS0FBSyxDQUFiLEdBQWlCLE9BQWpCLEdBQTJCO0FBQS9EO0FBQVosSUFIRyxDQUFQO0FBTUg7O0FBRWMsU0FBU1UsV0FBVCxDQUFxQkMsS0FBckIsRUFBNEI7QUFDdkMsUUFBTTtBQUFDQyxJQUFBQTtBQUFELE1BQVVELEtBQWhCOztBQUNBLE1BQUlDLE9BQUosRUFBYTtBQUNULFdBQU8sRUFBQyxXQUFELE9BQVA7QUFDSCxHQUZELE1BSUEsT0FBTztBQUFTLElBQUEsU0FBUyxFQUFDO0FBQW5CLEtBQTZCRCxLQUE3QixFQUFQO0FBQ0g7Ozs7In0=
