const crypto=require('crypto')
export  function hashPassword(password) {
 
    var salt = crypto.randomBytes(128).toString('base64');
    var iterations = 10000;
   // var hash =crypto.pbkdf2(password, salt, iterations);
    
    const hash = crypto.pbkdf2Sync(password, salt, iterations, 512, 'sha512');
    debugger;
    return {
        salt: salt,
        hash: hash,
        iterations: iterations
    };
}


export  function isPasswordCorrect(savedHash, savedSalt, savedIterations, passwordAttempt) {
    debugger
    let result=  savedHash.toString('hex') ===  crypto.pbkdf2Sync(passwordAttempt, savedSalt, savedIterations, 512, 'sha512').toString('hex');
debugger;
return result


}