import {h} from 'preact'
export default function Alert (props){
const {alert,message}=props
    return <div className={`alert alert-${alert}`} role="alert" data-testid="alert">
    {message}
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
  </div>
}