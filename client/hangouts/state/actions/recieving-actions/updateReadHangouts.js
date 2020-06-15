
export function updateReadHangouts({dispatch,username,name}){
    let unreadhangoutsKey =`${name}-unread-hangouts`
    let unreadhangouts = JSON.parse( localStorage.getItem(unreadhangoutsKey))

    // remove hangout from unread
    const filteredHangouts = unreadhangouts.filter(g=> g.username !==username)
    localStorage.setItem(unreadhangoutsKey,JSON.stringify(filteredHangouts))
    // set hangout to read
    const hangoutKey =   const hangoutKey = `${name}-hangouts`;
    const hangouts =JSON.parse(localStorage.getItem(hangoutKey))
    //


}


export function updateReadMesssages(){

}
