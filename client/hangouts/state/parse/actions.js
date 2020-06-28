import { actionTypes } from '../actionTypes'
export async function fetchHangouts({ search, dispatch }) {

    try {
        // search Hangout
        const user = Parse.User.current();
        let {username} =user.attributes
        const query = new Parse.Query("Hangout");
        query.equalTo('userid',user.id)
        query.equalTo('username',search)
        let searchResult = await query.find();
        debugger;
        if(searchResult.length>0){
            let mappedHanouts = searchResult.map(s=>{return {username:s.attributes.username, email:s.attributes.email,state:s.attributes.state}})
                debugger;            
             dispatch({ type: actionTypes.FETCH_HANGOUT_SUCCESS, hangouts:mappedHanouts })
        }  
        else{
            // search HangoutUser
            const HangoutUser = Parse.Object.extend("HangoutUser");
            const query = new Parse.Query(HangoutUser);
            query.equalTo('username',search)
            let searchResult = await query.find();
            let mappedHanouts = searchResult.map(s=>{return {username:s.attributes.username, email:s.attributes.email,state:'INVITE'}})
            dispatch({ type: actionTypes.FETCH_HANGOUT_SUCCESS, hangouts:mappedHanouts })
            debugger;
        }
    } catch (error) {
        const err = error
        debugger;
    }

}