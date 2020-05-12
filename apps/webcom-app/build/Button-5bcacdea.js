import { i as styleInject, j as useThemeContext, h } from './index-a6321377.js';

var css_248z = ".btn {\r\n  padding: 6px 16px;\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-box-align: center;\r\n      -ms-flex-align: center;\r\n          align-items: center;\r\n  border: none;\r\n  -webkit-box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);\r\n          box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);\r\n  min-width: 64px;\r\n  font-weight: 500;\r\n  font-size: 0.875rem;\r\n  -webkit-box-sizing: border-box;\r\n          box-sizing: border-box;\r\n}";
styleInject(css_248z);

function Button({
  onClick,
  title,
  disabled,
  id,
  color = 'primary'
}) {
  const theme = useThemeContext();
  return h("button", {
    className: "btn",
    "data-testid": id,
    disabled: disabled,
    style: { ...theme[color]
    },
    onClick: onClick
  }, title);
}

export { Button as B };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQnV0dG9uLTViY2FjZGVhLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9jbGllbnQvZm9ybS9CdXR0b24uanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZVRoZW1lQ29udGV4dCB9IGZyb20gJy4uL3RoZW1lL3RoZW1lLWNvbnRleHQnO1xyXG5pbXBvcnQgJy4vY3NzL3N0eWxlLmNzcyc7XHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEJ1dHRvbih7XHJcbiAgb25DbGljayxcclxuICB0aXRsZSxcclxuICBkaXNhYmxlZCxcclxuICBpZCxcclxuICBjb2xvciA9ICdwcmltYXJ5JyxcclxufSkge1xyXG4gIGNvbnN0IHRoZW1lID0gdXNlVGhlbWVDb250ZXh0KCk7XHJcbiAgcmV0dXJuIChcclxuICAgIDxidXR0b25cclxuICAgICAgY2xhc3NOYW1lPSdidG4nXHJcbiAgICAgIGRhdGEtdGVzdGlkPXtpZH1cclxuICAgICAgZGlzYWJsZWQ9e2Rpc2FibGVkfVxyXG4gICAgICBzdHlsZT17eyAuLi50aGVtZVtjb2xvcl0gfX1cclxuICAgICAgb25DbGljaz17b25DbGlja31cclxuICAgID5cclxuICAgICAge3RpdGxlfVxyXG4gICAgPC9idXR0b24+XHJcbiAgKTtcclxufVxyXG4iXSwibmFtZXMiOlsiQnV0dG9uIiwib25DbGljayIsInRpdGxlIiwiZGlzYWJsZWQiLCJpZCIsImNvbG9yIiwidGhlbWUiLCJ1c2VUaGVtZUNvbnRleHQiXSwibWFwcGluZ3MiOiI7Ozs7O0FBR2UsU0FBU0EsTUFBVCxDQUFnQjtBQUM3QkMsRUFBQUEsT0FENkI7QUFFN0JDLEVBQUFBLEtBRjZCO0FBRzdCQyxFQUFBQSxRQUg2QjtBQUk3QkMsRUFBQUEsRUFKNkI7QUFLN0JDLEVBQUFBLEtBQUssR0FBRztBQUxxQixDQUFoQixFQU1aO0FBQ0QsUUFBTUMsS0FBSyxHQUFHQyxlQUFlLEVBQTdCO0FBQ0EsU0FDRTtBQUNFLElBQUEsU0FBUyxFQUFDLEtBRFo7QUFFRSxtQkFBYUgsRUFGZjtBQUdFLElBQUEsUUFBUSxFQUFFRCxRQUhaO0FBSUUsSUFBQSxLQUFLLEVBQUUsRUFBRSxHQUFHRyxLQUFLLENBQUNELEtBQUQ7QUFBVixLQUpUO0FBS0UsSUFBQSxPQUFPLEVBQUVKO0FBTFgsS0FPR0MsS0FQSCxDQURGO0FBV0Q7Ozs7In0=
