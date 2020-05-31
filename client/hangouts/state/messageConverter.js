export function hangoutToMessage({ hangout, type }) {
    const message = { username: hangout.username, type, message: hangout.message }
    return message
}

export function messageToHangout({ message, hangout }) {
    const hangout = { ...hangout, state: message.type, message: message }
    return hangout
}

export function messageToNewHangout(msg) {
    const { username, email, type, message } = msg
    const hangout = { username, state: type, email, message }
    return hangout
}