import usersSeed from './users';
import recoverSeed from './seed-recover'
export default function seedOperation(req, res) {
  debugger;
  const { url } = req;
  switch (true) {
    case url.includes('/users'):
      usersSeed(req, res);
      break;
    case url.includes('/requestpasschange'):
      recoverSeed(req, res);
      break;
    default:
      null;
  }
}
