import {
    messagesFromServer,
    acknowledgmentTypes,
    messageCategories,
} from '../../../client/hangouts/state/messageTypes';
export async function acceptHandler({ collection, hangout, ws, connections }) {
    debugger;
    // insert hangout to accepter hangouts list
    await collection.updateOne({ username: ws.user.username }, {
        $push: {
            hangouts: {
                username: hangout.username,
                email: hangout.email,
                state: hangout.type,
            },
        },
    })

    // send acknowledgement to accepter
    const acknowledgement = {
        category: messageCategories.ACKNOWLEDGEMENT,
        type: messagesFromServer.HANGCHAT,
        username: hangout.username,
        email: hangout.email
    }
    ws.send(JSON.stringify(acknowledgement))
    // update hangout state on inviters hangouts list
    // send acknowledgement to inviter
    // remote hangout from invitation

}//