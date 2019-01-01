import { h } from 'preact';
const styles = {
  root: {
    backgroundColor: '#eeeeee',
    height: '100%',
  },
};
export function Layout({ children, style }) {
  return <div style={{ ...styles.root, ...style }}>{children}</div>;
}
