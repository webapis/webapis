import { h } from 'preact'
import TextInput from 'controls/text-input'

export default function TextInputStates() {
    return <div>
        <TextInput valid={false} />
    </div>
}