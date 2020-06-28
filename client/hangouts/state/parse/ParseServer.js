import { h } from 'preact'
import { useEffect } from 'preact/hooks'
import { useHangouts } from '../useHangouts'
import * as actions from './actions'
import { stateMapper } from '../../../../server/hangouts/stateMapper'
import { clientCommands } from '../../../hangouts/state/clientCommands'
import { useAuthContext } from '../../../auth/auth-context'
import { actionTypes } from '../actionTypes'
export function ParseServer(props) {
    const { children } = props
    const { state, dispatch } = useHangouts()
    const authContext = useAuthContext()
    const { user } = authContext.state
    const { fetchHangouts, search, pendingHangout } = state

    useEffect(() => {
        if (fetchHangouts) {
            debugger;
            actions.fetchHangouts({ dispatch, search })
        }

    }, [fetchHangouts])


    useEffect(() => {
        if (pendingHangout) {

            sendHangout()
        }

    }, [pendingHangout])

    useEffect(() => {
        if (user) {
          subsFirst()
        }

    }, [user])

    function handleHangout ({hangout}){
        debugger;
        switch (hangout.state) {
            case 'INVITED':
            case 'ACCEPTED':
            case 'BLOCKED':
            case 'MESSAGED':
            case 'DECLINED':
            case 'UNBLOCKED':
                debugger;
                dispatch({ type: actionTypes.SERVER_MESSAGE_RECIEVED, message: { hangout, type: 'ACKHOWLEDGEMENT' } })
                break;
            case 'INVITER':
            case 'ACCEPTER':
            case 'BLOCKER':
            case 'MESSANGER':
            case 'UNBLOCKER':
                dispatch({ type: actionTypes.SERVER_MESSAGE_RECIEVED, message: { hangout, type: 'HANGOUT' } })
                break;
            }
    }

  async function subsFirst(){
    let query = new Parse.Query("Hangout");
    var currentUser = Parse.User.current();
    query.equalTo('userid', currentUser.id)
    let subscription = await query.subscribe();
    subscription.on('create', (object) => {
        const hangout = object.attributes
        debugger;
        handleHangout({hangout})
      
        console.log('object created');
    });
    subscription.on('update', (object) => {
        const hangout = object.attributes
        debugger;
        handleHangout({hangout})

        console.log('object updated');
    });
    subscription.on('enter', (object) => {
        debugger;
        console.log('object entered');
      });
      subscription.on('leave', (object) => {
          debugger;
          const {hangouts}=object.attributes
          const hangout =hangouts[0].attributes
          handleHangout({hangout})
          debugger;
        console.log('object left');
      });
  }


   
  

    async function sendHangout() {

        try {
            debugger;
            const { senderState, targetState } = stateMapper({
                command: pendingHangout.command,
            });
            const { username, email, message, offline, timestamp } = pendingHangout;
            const Hangout = Parse.Object.extend("Hangout");
            const SenderUser = Parse.Object.extend("HangoutUser");
            let senderQuery = new Parse.Query(SenderUser);
            senderQuery.equalTo('username', user.username)
            let senderUser = await senderQuery.first()
            debugger;


            const TargetUser = Parse.Object.extend("HangoutUser");
            let targetQuery = new Parse.Query(TargetUser);
            targetQuery.equalTo('username', username)
            let targetUser = await targetQuery.first()

            const sender = new Hangout()
            sender.set('username', username)
            sender.set('email', email)
            sender.set('message', message)
            sender.set('timestamp', timestamp)
            sender.set('state', senderState)
            sender.set('userid', senderUser.attributes.userid)

            const target = new Hangout()
            target.set('username', user.username)
            target.set('email', user.email)
            target.set('message', message)
            target.set('timestamp', timestamp)
            target.set('state', targetState)
            target.set('userid', targetUser.attributes.userid)
            debugger;
            if (pendingHangout.command === clientCommands.INVITE) {

                senderUser.addUnique('hangouts', sender)
                targetUser.addUnique('hangouts', target)
                sender.set('owner',senderUser)
             //   sender.save()
                target.set('owner',targetUser)
               // target.save()
                senderUser.save()
                targetUser.save()

            } else {
                debugger;
                let targetQuery = new Parse.Query("Hangout");
                targetQuery.equalTo('userid',targetUser.attributes.userid)
                let targetHangout = await targetQuery.first()
                targetHangout.set('message',message)
                targetHangout.set('timestamp', timestamp)
                targetHangout.set('state', targetState)
                targetHangout.save()
                debugger;
                var currentUser = Parse.User.current();
                let senderQuery = new Parse.Query("Hangout");
                senderQuery.equalTo('userid',currentUser.id)
                let senderHangout = await senderQuery.first()
                senderHangout.set('message',message)
                senderHangout.set('timestamp', timestamp)
                senderHangout.set('state', senderState)
                senderHangout.save()
                debugger;
            }
        } catch (error) {
            debugger;
        }

    }

    return children
}