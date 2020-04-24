import { h } from 'preact';
import { useThemeContext } from '../theme/theme-context';
import './css/style.css';
export default function Button({
  onClick,
  title,
  disabled,
  id,
  color = 'primary',
}) {
  const theme = useThemeContext();
  return (
    <button
      className='btn'
      data-testid={id}
      disabled={disabled}
      style={{ ...theme[color] }}
      onClick={onClick}
    >
      {title}
    </button>
  );
}
