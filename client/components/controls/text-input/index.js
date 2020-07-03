import { h } from 'preact';
import {useEffect,useRef} from 'preact/hooks'
import {MDCTextField} from '@material/textfield';
import './css/style.scss'

export default function TextInput(props) {
  const {label,name,type}=props
  const input = useRef(null);
useEffect(()=>{
  new MDCTextField(document.querySelector(`.${name}`));
 
},[])
  return (
<label className={`mdc-text-field mdc-text-field--filled ${name}`}>
  <span className="mdc-text-field__ripple"></span>
  <input  type={type} className="mdc-text-field__input" aria-labelledby={`${name}-label`} name={name} required {...props}/>
  <span className="mdc-floating-label" id={`${name}-label`}>{label}</span>
  <span className="mdc-line-ripple"></span>
</label>
  );
}
