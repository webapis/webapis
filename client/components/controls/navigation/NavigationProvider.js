import {
  h,
  createContext,
} from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import {
  useContext,
  useState,
  useMemo,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cbdf6161bd8ca09a385d62c8c697bd1cd87bb184/hooks.cdn.js";

const NavContext = createContext();

function useNavContext() {
  const context = useContext(NavContext);

  if (!context) {
    throw new Error("useNavContext must be used with NavProvider");
  }

  return context;
}

export function useNavigation() {
  const [drawerOpen, setDrawerOpen] = useNavContext();
  function toggleDrawer() {
    setDrawerOpen((prev) => !prev);
  }
  return { drawerOpen, toggleDrawer };
}

export default function NavigationProvider(props) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const value = useMemo(() => [drawerOpen, setDrawerOpen], [drawerOpen]);
  return <NavContext.Provider value={value} {...props} />;
}
