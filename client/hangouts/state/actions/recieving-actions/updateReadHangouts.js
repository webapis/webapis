
import {actionTypes} from '../../actionTypes'
export function updateReadHangouts({dispatch,hangout,name}){
    const {username}= hangout
    let unreadhangoutsKey =`${name}-unread-hangouts`
    let unreadhangouts = JSON.parse( localStorage.getItem(unreadhangoutsKey))

    // remove hangout from unread
    const filteredHangouts = unreadhangouts.filter(g=> g.username !==username)
    localStorage.setItem(unreadhangoutsKey,JSON.stringify(filteredHangouts))
    // set hangout to read
    const hangoutKey =   const hangoutKey = `${name}-hangouts`;
    const hangouts =JSON.parse(localStorage.getItem(hangoutKey))
    const hangoutIndex = hangouts.findIndex(g=> g.username===username)
    hangouts.splice(hangoutIndex,1,{...hangout,read:true})
    //
    localStorage.setItem(unreadhangoutsKey,JSON.stringify(hangouts))
    dispatch({type:actionTypes.HANGOUTS_UPDATED,hangouts})
    dispatch({type:actionTypes.UNREAD_HANGOUTS_UPDATED,unreadhangouts:filteredHangouts})
    updateReadMesssages({dispatch,hangout,name})
}


export function updateReadMesssages({hangout,name,dispatch}){
    const {username}=hangout
    const messageKey = `${name}-${username}-messages`;
    const messages = JSON.parse(localStorage.getItem(messageKey));
        const updatedMessages =messages.map(m=>{return {...m,read:true}})
        localStorage.setItem(messageKey,JSON.stringify(updatedMessages))
        dispatch({type:actionTypes.MESSAGES_UPDATED,messages:updatedMessages})
    
}
