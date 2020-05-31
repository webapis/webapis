export function hangoutToMessage({ hangout, type }) {
 
    return{ username: hangout.username, type, message: hangout.message }
}

export function messageToHangout({ message, hangout }) {
  
    return { ...hangout, state: message.type, message: message }
}

export function messageToNewHangout(msg) {
    const { username, email, type, message } = msg
    const hangout = { username, state: type, email, message }
    return hangout
}