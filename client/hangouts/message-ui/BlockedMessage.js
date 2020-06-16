import { h } from 'preact'
const style = {
    color: 'red',
    float: 'right',
    width: '100%',
    fontSize: 16,
    textAlign: 'end'
}
export function BlockedMessage({ message }) {
    return <div style={style} data-testid="blocked-message">{message.text}</div>
}