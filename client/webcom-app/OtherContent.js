import { h } from 'preact';
import { List, ListItem } from '../layout/NavList';

export function OtherContent() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <List>
        <ListItem>Item One</ListItem>
        <ListItem>Item Two</ListItem>
      </List>
    </div>
  );
}
