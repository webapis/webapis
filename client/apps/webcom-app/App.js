import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
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
