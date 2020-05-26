import { h, createContext } from 'preact';
import { useContext, useState } from 'preact/hooks';

const ThemeContext = createContext();

function useThemeContext() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useThemeContext must be used with ThemeProvider');
  }


  return context
}


function ThemeProvider(props) {
  
  const { initState } = props;

  const [state, setState] = useState(initState);

  return <ThemeContext.Provider value={state} {...props} />;
}

export { useThemeContext, ThemeProvider };
