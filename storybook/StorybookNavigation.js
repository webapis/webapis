import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import {
  useState,
  useEffect,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
import Drawer from "controls/navigation/Drawer";
import { AppBar } from "controls/navigation/AppBar";
import { Menu } from "controls/navigation/Menu";
import { NavItem } from "controls/navigation/NavItem";
import StorybookRoutes from "./StorybookRoutes";
import StorybookDrawerContent from "./StorybookDrawerContent";
import { useMediaQuery } from "components/layout/useMediaQuery";
export default function StorybookNavigation({ name }) {
  const [drawerIsOpen, setDrawerState] = useState(false);

  const { device } = useMediaQuery();
  function toggleDrawer() {
    setDrawerState((prev) => !prev);

    if (name) {
      localStorage.setItem(
        `drawer-${name}`,
        JSON.stringify({ drawerIsOpen: !drawerIsOpen })
      );
    }
  }

  useEffect(() => {
    if (name && localStorage.getItem(`drawer-${name}`)) {
      const { drawerIsOpen } = JSON.parse(
        localStorage.getItem(`drawer-${name}`)
      );
      setDrawerState(drawerIsOpen);
    }
  }, []);
  return (
    <div style={{ display: "flex", position: "fixed", width: "100%" }}>
      {drawerIsOpen && (
        <Drawer style={{ position: "absolute" }} toggleDrawer={toggleDrawer}>
          <StorybookDrawerContent
            drawerIsOpen={drawerIsOpen}
            toggleDrawer={toggleDrawer}
          />
        </Drawer>
      )}
      <div style={{ flex: 1 }}>
        <AppBar>
          <Menu onClick={toggleDrawer} />
          <NavItem style={{ flex: 5 }}>Storybook</NavItem>
        </AppBar>

        <StorybookRoutes />
      </div>
    </div>
  );
}
