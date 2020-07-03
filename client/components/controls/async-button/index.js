import { h } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import {MDCRipple} from '@material/ripple';
import './style.scss'
const style = {
    circle: {
        backgroundColor: 'green',
        width: 10,
        height: 10,
        borderRadius: 10,
        marginRight: 3,
        padding:3,
    },
    circleContainer: {
        display: 'flex'
    }
}

function ProgressBar() {
    const [selected, setSelected] = useState(0)
    const [state,setState]=useState(false)
    useEffect(()=>{
        if(state){
            if(selected===0){
                setSelected(1)
            }
            if(selected===1){
                setSelected(2)
            }
            if(selected===2){
                setSelected(0)
            }
        }
        
     

    },[state])
    useEffect(() => {
        let interval = setInterval(function() {
           setState(prev=> !prev)
        }, 100)

        return ()=>{
           clearInterval(interval)
        }
    }, [])

    return <div style={style.circleContainer} className="btn">
        <div style={{ ...style.circle, backgroundColor: selected === 0 ? 'white' : 'green' }}></div>
        <div style={{ ...style.circle, backgroundColor: selected === 1 ? 'white' : 'green' }}></div>
        <div style={{ ...style.circle, backgroundColor: selected === 2 ? 'white' : 'green' }}></div>

    </div>
}

export default function AsyncButton(props) {
    useEffect(()=>{
     //  const btn = new MDCButton(document.querySelector('.mdc-button'));
     new MDCRipple(document.querySelector('.mdc-button'));
    },[])
    const {loading}=props
    if (loading) {
        return <ProgressBar />
    }
    else
    return <button className="mdc-button">
    <div className="mdc-button__ripple"></div>
    
    <span className="mdc-button__label">AsyncButton</span>
  </button>
}