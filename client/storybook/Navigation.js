import { h } from 'preact';

export default function Navigation(props) {
  const { children, drawerContent } = props;


  return (
    <div>
      <h1 style={{ display: 'flex', justifyContent: 'center', padding: 5 }}>
        Storybook
      </h1>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>{drawerContent}</div>
        <div style={{ flex: 10 }}>{children}</div>
      </div>
    </div>
  );
}

export function NavItem(props) {
  const { children } = props;
  return <div className="nav-item">{children}</div>;
}
