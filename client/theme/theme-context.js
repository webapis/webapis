import { h, createContext } from 'preact';
import { useContext, useState } from 'preact/hooks';

const ThemeContext = createContext();

function useThemeContext() {
  const context = useContext(ThemeContext);
  debugger;
  if (!context) {
    throw new Error('useThemeContext must be used with ThemeProvider');
  }

  debugger;
  return context
}


function ThemeProvider(props) {
    debugger;
  const { initState } = props;
  debugger;
  const [state, setState] = useState(initState);
  debugger;
  return <ThemeContext.Provider value={state} {...props} />;
}

export { useThemeContext, ThemeProvider };
