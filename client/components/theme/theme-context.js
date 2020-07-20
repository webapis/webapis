import {
  h,
  createContext,
} from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import {
  useContext,
  useState,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cbdf6161bd8ca09a385d62c8c697bd1cd87bb184/hooks.cdn.js";

const ThemeContext = createContext();

function useThemeContext() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useThemeContext must be used with ThemeProvider");
  }

  return context;
}

export default function ThemeProvider(props) {
  const { initState } = props;

  const [state, setState] = useState(initState);

  return <ThemeContext.Provider value={state} {...props} />;
}

export { useThemeContext };
