import { h } from 'preact';
const styles = {
  root: {
    backgroundColor: '#eeeeee',
    height: '100%',
  },
};
export default function Layout({ children, style, id }) {
  return <div data-testid={id} style={{ ...styles.root, ...style }}>{children}</div>;
}
