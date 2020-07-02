import {h} from 'preact'
import AsyncButton  from 'controls/async-button'

export default  function AsyncButtonDemo(){

    return <div>
        <AsyncButton loading  title="Send"/>
        <AsyncButton   title="Send"/>
        </div>
}