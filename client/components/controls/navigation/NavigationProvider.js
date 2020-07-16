import { h, createContext } from "preact";
import { useContext, useState, useMemo } from "preact/hooks";

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
