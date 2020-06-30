import { h } from 'preact';
import { useThemeContext } from '../theme/theme-context';
export function AppBar({ children,style }) {
  const theme = useThemeContext();
  return (
    <div
      style={{
        ...theme.primary,
       //  position: 'fixed',
        // left: 0,
       //  top: 0,
        minHeight: 64,
       // paddingLeft: 16,
       // paddingRight: 16,
        width: '100%',
        display:'flex',...style
      }}
    >
    {children}
    </div>
  );
}
