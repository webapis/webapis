import {
  h,
  createContext,
} from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import {
  useContext,
  useState,
} from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/hooks.module.js";

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
