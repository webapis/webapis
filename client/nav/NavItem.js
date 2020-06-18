import {h} from 'preact'
import './css/style.css'
export function NavItem (props){
const {children}=props
return <div className="nav-item">{children}</div>
}