import { h } from 'preact';
import { useThemeContext } from '../../theme/theme-context';
import './css/style.css';
export default function Button(props) {
  const theme = useThemeContext();
  const { onClick, title, disabled, id, color = 'primary' } = props;
  return (
    <button
      className='btn'
      data-testid={id}
      disabled={disabled}
      style={{ ...theme[color] }}
      onClick={onClick}
      {...props}
    >
      {title}
    </button>
  );
}
