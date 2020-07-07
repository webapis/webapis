import { h } from 'preact';

import List, { ListItem } from 'controls/list';
import TextInput from 'controls/text-input';
import Button from 'controls/button';
import { useAppRoute } from 'components/app-route'


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

      <div class="input-group mb-3">
        <input value={search} id="search-input" onChange={onSearchInput} type="text" className="form-control" aria-label="Recipient's username" aria-describedby="button-addon2" />
        <div className="input-group-append">
          <button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={onFetchHangouts} data-testid="search-btn" disabled={!search}>Search</button>
        </div>
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
