import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import List, { ListItem } from "controls/list";
import { useAppRoute } from "components/app-route/index";
export default function AuthDemoDrawer() {
  const { onAppRoute } = useAppRoute();

  function handleRoute(e) {
    const { id } = e.target;
    onAppRoute({ featureRoute: "/", route: `/${id}` });
  }
  return (
    <div style={{ padding: 3 }}>
      <List>
        <ListItem id="login-states" onClick={handleRoute}>
          Login
        </ListItem>
        <ListItem id="signup-states" onClick={handleRoute}>
          Signup
        </ListItem>
        <ListItem id="change-password-states" onClick={handleRoute}>
          Change Password
        </ListItem>
        <ListItem id="forgot-password-states" onClick={handleRoute}>
          Request Password Change
        </ListItem>
      </List>
    </div>
  );
}
