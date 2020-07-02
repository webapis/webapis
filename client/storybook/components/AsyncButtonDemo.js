import {h} from 'preact'
import AsyncButton  from '../../components/async-button'

export default  function AsyncButtonDemo(){

    return <div>
        <AsyncButton loading  title="Send"/>
        <AsyncButton   title="Send"/>
        </div>
}