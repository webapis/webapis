import { h } from 'preact';

import { List, ListItem } from '../components/list';
import { TextInput } from '../components/TextInput';
import { Button } from '../components/Button';
import { useAppRoute } from '../app-route/AppRouteProvider'
import { saveMessage } from './state/actions/delivering-actions/savePendingHangout'

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
  onSearchInput,
  onFetchHangouts,
  onSelectHangout,
  search
}) {
  const { onAppRoute } = useAppRoute()
  function handleHangoutSelection(e) {
    const id = e.target.id
    onSelectHangout(e)
    const hangout = hangouts.find(g => g.username === id)
debugger;
    onAppRoute({ featureRoute: `/${hangout.state}`, route: '/hangouts' })
  }


  return (

    <div style={{ paddingTop: 68 }}>
      <div style={style.inputContainer}>
        <TextInput
          value={search}
          id="search-input"
          type="search"
          onChange={onSearchInput}
          style={style.input}
        />
        <Button
          data-testid="search-btn"
          disabled={!search}
          title="search"
          onClick={onFetchHangouts}
        />
      </div>

      <List id="hangouts-list">
        {hangouts &&
          hangouts.length > 0 &&
          hangouts.map((g) => {
            return (
              <ListItem id={g.username} data-testid={g.username} onClick={handleHangoutSelection}>
                {g.username}
              </ListItem>
            );
          })}
      </List>

    </div>
  );
}
