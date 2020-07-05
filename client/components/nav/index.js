import {h} from 'preact'
import {useAppRoute} from 'components/app-route'

export default function Nav (props){
    const {children,horizontalAlignment}=props

return <ul className={`nav ${horizontalAlignment && horizontalAlignment}`} {...props}>{children}</ul>
}


