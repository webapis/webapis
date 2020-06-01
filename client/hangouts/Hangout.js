import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { List, ListItem } from '../layout/NavList';
import { TextInput } from '../layout/TextInput';
export default function Hangout({
  hangouts,
  onSearch,
  onSelect,
  search,
  users,
}) {
  return (
    <div>
      <TextInput
        value={search}
        id="search-input"
        type="search"
        onChange={onSearch}
      />
      <List id="hangouts-list">
        {hangouts &&  hangouts.length>0&&
          hangouts.map((g) => {
            return (
              <ListItem id={g.username} onClick={onSelect}>
                {g.username}
              </ListItem>
            );
          })}
      </List>
      <List id="users-list">
        {hangouts && hangouts.length === 0 &&
          users &&
          users.map((g) => {
            return (
              <ListItem id={g.username} onClick={onSelect}>
                {g.username}
              </ListItem>
            );
          })}
      </List>
    </div>
  );
}
