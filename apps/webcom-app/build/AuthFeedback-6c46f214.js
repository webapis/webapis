import { u as useAuthContext, h } from './index-d2307a3a.js';

function AuthFeedback({
  message,
  children
}) {
  const {
    state
  } = useAuthContext();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXV0aEZlZWRiYWNrLTZjNDZmMjE0LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9jbGllbnQvYXV0aC9BdXRoRmVlZGJhY2suanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUF1dGhDb250ZXh0IH0gZnJvbSAnLi4vYXV0aC9hdXRoLWNvbnRleHQnO1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBdXRoRmVlZGJhY2soeyBtZXNzYWdlLCBjaGlsZHJlbiB9KSB7XHJcbiAgY29uc3QgeyBzdGF0ZSB9ID0gdXNlQXV0aENvbnRleHQoKTtcclxuXHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2XHJcbiAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcclxuICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcclxuICAgICAgICBoZWlnaHQ6IDMwMCxcclxuICAgICAgICBmb250U2l6ZTogMTYsXHJcbiAgICAgIH19XHJcbiAgICAgIGRhdGEtdGVzdGlkPSdhdXRoLWZlZWRiYWNrJ1xyXG4gICAgPlxyXG4gICAgICA8ZGl2PntzdGF0ZS5hdXRoRmVlZGJhY2t9PC9kaXY+XHJcblxyXG4gICAgICA8ZGl2PiB7Y2hpbGRyZW59PC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gTG9naW5MaW5rKCkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2PlxyXG4gICAgICA8YSBocmVmPXtgJHthcGlfdXJsfWB9PkxvZ2luPC9hPlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iXSwibmFtZXMiOlsiQXV0aEZlZWRiYWNrIiwibWVzc2FnZSIsImNoaWxkcmVuIiwic3RhdGUiLCJ1c2VBdXRoQ29udGV4dCIsImRpc3BsYXkiLCJqdXN0aWZ5Q29udGVudCIsImFsaWduSXRlbXMiLCJoZWlnaHQiLCJmb250U2l6ZSIsImF1dGhGZWVkYmFjayIsIkxvZ2luTGluayIsImFwaV91cmwiXSwibWFwcGluZ3MiOiI7O0FBRWUsU0FBU0EsWUFBVCxDQUFzQjtBQUFFQyxFQUFBQSxPQUFGO0FBQVdDLEVBQUFBO0FBQVgsQ0FBdEIsRUFBNkM7QUFDMUQsUUFBTTtBQUFFQyxJQUFBQTtBQUFGLE1BQVlDLGNBQWMsRUFBaEM7QUFHQSxTQUNFO0FBQ0UsSUFBQSxLQUFLLEVBQUU7QUFDTEMsTUFBQUEsT0FBTyxFQUFFLE1BREo7QUFFTEMsTUFBQUEsY0FBYyxFQUFFLFFBRlg7QUFHTEMsTUFBQUEsVUFBVSxFQUFFLFFBSFA7QUFJTEMsTUFBQUEsTUFBTSxFQUFFLEdBSkg7QUFLTEMsTUFBQUEsUUFBUSxFQUFFO0FBTEwsS0FEVDtBQVFFLG1CQUFZO0FBUmQsS0FVRSxlQUFNTixLQUFLLENBQUNPLFlBQVosQ0FWRixFQVlFLG9CQUFPUixRQUFQLENBWkYsQ0FERjtBQWdCRDtBQUVNLFNBQVNTLFNBQVQsR0FBcUI7QUFDMUIsU0FDRSxlQUNFO0FBQUcsSUFBQSxJQUFJLEVBQUcsR0FBRUMsdUJBQVE7QUFBcEIsYUFERixDQURGO0FBS0Q7Ozs7OyJ9
