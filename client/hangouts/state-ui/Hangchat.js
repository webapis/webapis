import { h } from 'preact';
import {useEffect} from 'preact/hooks'
import { Messages } from '../message-ui/Messages';
import { Layout } from './Layout';
import {resetHangout} from '../state/actions'


export default function Hangchat({
  messages = [],
  onMessageText,
  onMessage,
  messageText,
  username,
  hangout,
  onNavigation,
  dispatch
}) {

  useEffect(()=>{
    return ()=>{
      debugger;
      console.log('hangout cleared')
      resetHangout({dispatch})
    }
  },[])
  return (
    <Layout id="hangchat-ui" >
      <Messages
      onNavigation={onNavigation}
        hangout={hangout}
        messages={messages}
        onMessage={onMessage}
        onMessageText={onMessageText}
        messageText ={messageText}
        username={username}
      />
    </Layout>
  );
}
