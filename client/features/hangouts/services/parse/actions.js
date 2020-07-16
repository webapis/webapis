import { actionTypes } from "../../state/actionTypes";
export async function searchHangouts({ search, dispatch, userId }) {
  try {
    // search Hangout

    const query = new Parse.Query("Hangout");
    query.equalTo("userid", userId);
    query.equalTo("username", search);
    let searchResult = await query.find();

    if (searchResult.length > 0) {
      let mappedHanouts = searchResult.map((s) => {
        return {
          username: s.attributes.username,
          email: s.attributes.email,
          state: s.attributes.state,
        };
      });

      dispatch({
        type: actionTypes.FETCH_HANGOUT_SUCCESS,
        hangouts: mappedHanouts,
      });
    } else {
      // search HangoutUser
      const HangoutUser = Parse.Object.extend("HangoutUser");
      const query = new Parse.Query(HangoutUser);
      query.equalTo("username", search);
      let searchResult = await query.find();
      let mappedHanouts = searchResult.map((s) => {
        return {
          username: s.attributes.username,
          email: s.attributes.email,
          state: "INVITE",
        };
      });
      dispatch({
        type: actionTypes.FETCH_HANGOUT_SUCCESS,
        hangouts: mappedHanouts,
      });
    }
  } catch (error) {
    dispatch({ type: actionTypes.ERROR_RECIEVED, error });
  }
}
