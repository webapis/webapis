import { h } from 'preact'
import TextInput from 'controls/text-input'

export default function TextInputStates() {
    return <div>
        <div>
            <h5>Validation</h5>
        <TextInput isValid={true} />
        <TextInput isValid={false} />
        </div>
       
    </div>
}