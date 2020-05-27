
export default async function hangouts({ message,username,client,connections }) {
  const collection = await client.db('hangouts').collection('users');
  let user =null;
  user =await collection.findOne({username})
  debugger
  if(!user){
   user= await collection.insertOne({username})
  debugger;
  }
  target = await collection.findOne({username:message.username})
  if(!target){
    target= await collection.insertOne({username:message.username})
   debugger;
   }
  switch (message.state) {
    case 'INVITEE':
     const updateUser= await collection.updateOne({username},{$push:{contacts:message}})
     const updateTarget =await collection.updateOne({username:message.username},{$push:{contacts:{contacts:{...message,state:'INVITER',username}}}})
      debugger;
      break;
    case 'ACCEPT':
      break;
    case 'BLOCK':
      break;
    case 'UNBLOCK':
      break;
    case 'DECLINE':
      break;
    case 'MESSAGE':

    default:
      throw new Error('No message type is provided for switch statement');
  }
}
