import { h } from 'preact'
import { Message } from './Message'
export function Messages({ messages }) {
    return <div>

        {messages.map(m =><div><Message message={m} /></div> )}
    </div>
}