import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { List, ListItem } from '../layout/NavList';
import { TextInput } from '../layout/TextInput';
import { Button } from '../layout/Button';
const style = {
  inputContainer: {
    display: 'flex',
    border: '#737373 solid 1px',
  },
  input: {
    padding: 10,
    flex: 1,
    border: 'white',
  },
};

export default function Hangout({
  hangouts,
  onSearch,
  onSelectHangout,
  onSelectUser,
  search,
  users,
  onStartSearch,
}) {
  return (
    <div>
      <div style={style.inputContainer}>
        <TextInput
          value={search}
          id="search-input"
          type="search"
          onChange={onSearch}
          style={style.input}
        />
        <Button
          data-testid="search-btn"
          disabled={!search}
          title="search"
          onClick={onStartSearch}
        />
      </div>

      <List id="hangouts-list">
        {hangouts &&
          hangouts.length > 0 &&
          hangouts.map((g) => {
            return (
              <ListItem id={g.username} onClick={onSelectHangout}>
                {g.username}
              </ListItem>
            );
          })}
      </List>
      <List id="users-list">
        {users &&
          users.map((g) => {
            return (
              <ListItem id={g.username} onClick={onSelectUser}>
                {g.username}
              </ListItem>
            );
          })}
      </List>
    </div>
  );
}
