import { b as useAuthContext, h } from "./index-a45f22ef.js";

function AuthFeedback({ message, children }) {
  const { state } = useAuthContext();
  return h(
    "div",
    {
      style: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 300,
        fontSize: 16,
      },
      "data-testid": "auth-feedback",
    },
    h("div", null, state.authFeedback),
    h("div", null, " ", children)
  );
}
function LoginLink() {
  return h(
    "div",
    null,
    h(
      "a",
      {
        href: `${"https://localhost:3000"}`,
      },
      "Login"
    )
  );
}

export default AuthFeedback;
export { LoginLink };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXV0aEZlZWRiYWNrLTBjODc2YjY0LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9jbGllbnQvYXV0aC9BdXRoRmVlZGJhY2suanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyB1c2VBdXRoQ29udGV4dCB9IGZyb20gJy4uL2F1dGgvYXV0aC1jb250ZXh0JztcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEF1dGhGZWVkYmFjayh7IG1lc3NhZ2UsIGNoaWxkcmVuIH0pIHtcbiAgY29uc3QgeyBzdGF0ZSB9ID0gdXNlQXV0aENvbnRleHQoKTtcblxuXG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgc3R5bGU9e3tcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICBoZWlnaHQ6IDMwMCxcbiAgICAgICAgZm9udFNpemU6IDE2LFxuICAgICAgfX1cbiAgICAgIGRhdGEtdGVzdGlkPSdhdXRoLWZlZWRiYWNrJ1xuICAgID5cbiAgICAgIDxkaXY+e3N0YXRlLmF1dGhGZWVkYmFja308L2Rpdj5cblxuICAgICAgPGRpdj4ge2NoaWxkcmVufTwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gTG9naW5MaW5rKCkge1xuICByZXR1cm4gKFxuICAgIDxkaXY+XG4gICAgICA8YSBocmVmPXtgJHthcGlfdXJsfWB9PkxvZ2luPC9hPlxuICAgIDwvZGl2PlxuICApO1xufVxuIl0sIm5hbWVzIjpbIkF1dGhGZWVkYmFjayIsIm1lc3NhZ2UiLCJjaGlsZHJlbiIsInN0YXRlIiwidXNlQXV0aENvbnRleHQiLCJkaXNwbGF5IiwianVzdGlmeUNvbnRlbnQiLCJhbGlnbkl0ZW1zIiwiaGVpZ2h0IiwiZm9udFNpemUiLCJhdXRoRmVlZGJhY2siLCJMb2dpbkxpbmsiLCJhcGlfdXJsIl0sIm1hcHBpbmdzIjoiOztBQUVlLFNBQVNBLFlBQVQsQ0FBc0I7QUFBRUMsRUFBQUEsT0FBRjtBQUFXQyxFQUFBQTtBQUFYLENBQXRCLEVBQTZDO0FBQzFELFFBQU07QUFBRUMsSUFBQUE7QUFBRixNQUFZQyxjQUFjLEVBQWhDO0FBR0EsU0FDRTtBQUNFLElBQUEsS0FBSyxFQUFFO0FBQ0xDLE1BQUFBLE9BQU8sRUFBRSxNQURKO0FBRUxDLE1BQUFBLGNBQWMsRUFBRSxRQUZYO0FBR0xDLE1BQUFBLFVBQVUsRUFBRSxRQUhQO0FBSUxDLE1BQUFBLE1BQU0sRUFBRSxHQUpIO0FBS0xDLE1BQUFBLFFBQVEsRUFBRTtBQUxMLEtBRFQ7QUFRRSxtQkFBWTtBQVJkLEtBVUUsZUFBTU4sS0FBSyxDQUFDTyxZQUFaLENBVkYsRUFZRSxvQkFBT1IsUUFBUCxDQVpGLENBREY7QUFnQkQ7QUFFTSxTQUFTUyxTQUFULEdBQXFCO0FBQzFCLFNBQ0UsZUFDRTtBQUFHLElBQUEsSUFBSSxFQUFHLEdBQUVDLHdCQUFRO0FBQXBCLGFBREYsQ0FERjtBQUtEOzs7OzsifQ==
