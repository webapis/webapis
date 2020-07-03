import { h } from 'preact';
import {useEffect} from 'preact/hooks'
import {MDCTextField} from '@material/textfield';
import './css/style.scss'

export default function TextInput(props) {
useEffect(()=>{
  const username = new MDCTextField(document.querySelector('.mdc-text-field'));
 
},[])
  return (
<label className="mdc-text-field mdc-text-field--filled inputtext">
  <span className="mdc-text-field__ripple"></span>
  <input type="text" className="mdc-text-field__input" aria-labelledby="username-label" name="username" required/>
  <span className="mdc-floating-label" id="username-label">Username</span>
  <span className="mdc-line-ripple"></span>
</label>
  );
}
