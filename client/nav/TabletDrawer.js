import { h } from 'preact';
import { drawer } from './style';
export default function TabletDrawer(props) {
  const { open, onClick, children } = props;
  return (
    <div style={{ ...drawer, width: '15%' }} onClick={onClick}>
   
      {children}
    </div>
  );
}
