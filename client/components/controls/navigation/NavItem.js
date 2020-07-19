import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
//import './css/style.css'
export function NavItem(props) {
  const { children } = props;
  return (
    <div className="nav-item" {...props}>
      {children}
    </div>
  );
}
