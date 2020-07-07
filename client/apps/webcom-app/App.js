import { h } from "preact";
import { AppNavigation } from "./AppNavigation";
import { AppRoutes } from "./AppRoutes";

export function App() {
  return (
    <div>
      <AppNavigation />
      <AppRoutes />
      {""}
    </div>
  );
}
