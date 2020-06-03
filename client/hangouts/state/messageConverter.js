export function hangoutToMessage({ hangout, type }) {
 
    return{ username: hangout.username, type, message: hangout.message }
}

export function updateAcknowledgement({ acknowledgement, hangout }) {
  const {username,email}=hangout
  const {type}=acknowledgement

    return { username,email,state:type }
}

export function messageToNewHangout(msg) {
    const { username, email, type, message } = msg
    const hangout = { username, state: type, email, message }
    return hangout
}