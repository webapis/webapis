import usersSeed from './users';
export default function seedOperation(req, res) {
  debugger;
  const { url } = req;
  switch (true) {
    case url.includes('/users'):
      usersSeed(req, res);
      break;
    default:
      null;
  }
}
