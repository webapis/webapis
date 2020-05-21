import { h } from 'preact';
import './css/style.css';
export default function Block({ contact,setRoute }) {
  const { username } = contact;
  return (
    <div className='chat-state-view' data-testid='block'>
      <div style={{ flex: 10 }}>
        <h5>
          Block & report <b>{username}</b>
        </h5>
        <div>
          {username && username} will not be able to message you any more.{' '}
          <a href=''>Learn more here.</a>
        </div>
        <p>
          <input type='checkbox' id='report-checkbox' />
          <label for='report-checkbox'>Also report</label>
        </p>
      </div>
      <div style={{ display: 'flex', flex: 1 }}>
        <button className='btn'>Cancel</button>
        <button className='btn btn-confirm'>Confirm</button>
      </div>
    </div>
  );
}
