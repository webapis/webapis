import { h } from 'preact';
import { useThemeContext } from '../theme/theme-context';
import './css/style.css';
export default function Navigation(props) {
  const { children } = props;

  const theme = useThemeContext();

  return (
    <div
      style={{
        ...theme.primary,
        minHeight: 56,
        paddingLeft: 16,
        paddingRight: 16,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {children}
    </div>
  );
}

export function NavItem(props) {
  const { children } = props;
  return <div className='nav-item'>{children}</div>;
}
