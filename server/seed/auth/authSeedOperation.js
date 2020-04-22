import loginSeed from './loginSeed';
import signupSeed from './signupSeed';
export default function authSeedOperation(req, res) {
  debugger;
  const { url } = req;
  switch (true) {
    case url.includes('/login'):
      loginSeed(req, res);
      break;
    case url.includes('/signup'):
      debugger;
      signupSeed(req, res);
      break;
    default:
      null;
  }
}
