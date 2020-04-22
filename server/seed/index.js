import authSeedOperation from './auth/authSeedOperation';
export default function authSeed(req, res) {
  debugger;
  const { url } = req;
  switch (true) {
    case url.includes('/authseed'):
      authSeedOperation(req, res);
      break;
    default:
      null;
  }
}
