import { h } from 'preact';
import { Archive } from '../layout/icons/Archive';
import { Delete } from '../layout/icons/Delete';
import { Block } from '../layout/icons/Block';

const style = {
  btnContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 8,
  },
  btnText: {
    marginLeft: 8,
  },
};

export function Configure() {
  return (
    <div className='chat-state-view'>
      <div
        style={{
          marginLeft: 16,
          flex: 10,
        }}
      >
        <div style={{ paddingBottom: 8, paddingTop: 8, flex: 10 }}>
          <div>
            <input type='checkbox' />
            <label>Notification</label>
          </div>
          <div>
            <input type='checkbox' />
            <label>Conversation</label>
          </div>

          <hr style={{ width: '96%' }} />
          <div style={style.btnContainer}>
            <button className='config-btn'>
              <Archive color='#737373' />
            </button>
            <div style={style.btnText}>Archive conversation</div>
          </div>
          <div style={style.btnContainer}>
            <button className='config-btn'>
              <Delete color='#737373' />
            </button>
            <div style={style.btnText}>Delete conversation</div>
          </div>
          <div style={style.btnContainer}>
            <button className='config-btn'>
              <Block color='red' />
            </button>
            <div style={style.btnText}>Block conversation</div>
          </div>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ flex: 3 }}></div>
        <button className='btn'>Close</button>
      </div>
    </div>
  );
}
