import { h } from 'preact'
const style = {
    color: 'red',
    float: 'right',
    width: '100%',
    fontSize: 16,
    textAlign: 'end'
}
export function BlockerMessage({ message }) {
    return <div style={style} data-testid="blocker-message">{message.text}</div>
}