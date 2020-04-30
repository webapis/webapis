import { b as useAppContext, h } from './index-0fed73a4.js';

function AuthFeedback({
  message,
  children
}) {
  const {
    auth
  } = useAppContext();
  const {
    state
  } = auth;
  return h("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: 300,
      fontSize: 16
    },
    "data-testid": "auth-feedback"
  }, h("div", null, state.authFeedback), h("div", null, " ", children));
}
function LoginLink() {
  return h("div", null, h("a", {
    href: `${"http://localhost:3000"}`
  }, "Login"));
}

export default AuthFeedback;
export { LoginLink };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXV0aEZlZWRiYWNrLWFjNzBkNDU3LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9jbGllbnQvYXV0aC9BdXRoRmVlZGJhY2suanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUFwcENvbnRleHQgfSBmcm9tICcuLi9hcHAtY29udGV4dCc7XHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEF1dGhGZWVkYmFjayh7IG1lc3NhZ2UsIGNoaWxkcmVuIH0pIHtcclxuICBjb25zdCB7IGF1dGggfSA9IHVzZUFwcENvbnRleHQoKTtcclxuICBjb25zdCB7IHN0YXRlIH0gPSBhdXRoO1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdlxyXG4gICAgICBzdHlsZT17e1xyXG4gICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXHJcbiAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXHJcbiAgICAgICAgaGVpZ2h0OiAzMDAsXHJcbiAgICAgICAgZm9udFNpemU6IDE2LFxyXG4gICAgICB9fVxyXG4gICAgICBkYXRhLXRlc3RpZD0nYXV0aC1mZWVkYmFjaydcclxuICAgID5cclxuICAgICAgPGRpdj57c3RhdGUuYXV0aEZlZWRiYWNrfTwvZGl2PlxyXG5cclxuICAgICAgPGRpdj4ge2NoaWxkcmVufTwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIExvZ2luTGluaygpIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdj5cclxuICAgICAgPGEgaHJlZj17YCR7YXBpX3VybH1gfT5Mb2dpbjwvYT5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIl0sIm5hbWVzIjpbIkF1dGhGZWVkYmFjayIsIm1lc3NhZ2UiLCJjaGlsZHJlbiIsImF1dGgiLCJ1c2VBcHBDb250ZXh0Iiwic3RhdGUiLCJkaXNwbGF5IiwianVzdGlmeUNvbnRlbnQiLCJhbGlnbkl0ZW1zIiwiaGVpZ2h0IiwiZm9udFNpemUiLCJhdXRoRmVlZGJhY2siLCJMb2dpbkxpbmsiLCJhcGlfdXJsIl0sIm1hcHBpbmdzIjoiOztBQUVlLFNBQVNBLFlBQVQsQ0FBc0I7QUFBRUMsRUFBQUEsT0FBRjtBQUFXQyxFQUFBQTtBQUFYLENBQXRCLEVBQTZDO0FBQzFELFFBQU07QUFBRUMsSUFBQUE7QUFBRixNQUFXQyxhQUFhLEVBQTlCO0FBQ0EsUUFBTTtBQUFFQyxJQUFBQTtBQUFGLE1BQVlGLElBQWxCO0FBRUEsU0FDRTtBQUNFLElBQUEsS0FBSyxFQUFFO0FBQ0xHLE1BQUFBLE9BQU8sRUFBRSxNQURKO0FBRUxDLE1BQUFBLGNBQWMsRUFBRSxRQUZYO0FBR0xDLE1BQUFBLFVBQVUsRUFBRSxRQUhQO0FBSUxDLE1BQUFBLE1BQU0sRUFBRSxHQUpIO0FBS0xDLE1BQUFBLFFBQVEsRUFBRTtBQUxMLEtBRFQ7QUFRRSxtQkFBWTtBQVJkLEtBVUUsZUFBTUwsS0FBSyxDQUFDTSxZQUFaLENBVkYsRUFZRSxvQkFBT1QsUUFBUCxDQVpGLENBREY7QUFnQkQ7QUFFTSxTQUFTVSxTQUFULEdBQXFCO0FBQzFCLFNBQ0UsZUFDRTtBQUFHLElBQUEsSUFBSSxFQUFHLEdBQUVDLHVCQUFRO0FBQXBCLGFBREYsQ0FERjtBQUtEOzs7OzsifQ==
