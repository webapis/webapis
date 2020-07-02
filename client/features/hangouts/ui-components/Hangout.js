import { h } from 'preact';

import List,{ ListItem } from 'controls/list';
import { TextInput } from 'controls/text-input';
import { Button } from 'controls/button';
import { useAppRoute } from 'components/app-route/AppRouteProvider'


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

    onAppRoute({ featureRoute: `/${hangout.state}`, route: '/hangouts' })
  }


  return (

    <div >
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
