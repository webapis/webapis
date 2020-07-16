import usersSeed from "./users";
import recoverSeed from "./seed-recover";
import hangoutSeed from "./hangouts";
export default function seedOperation(req, res) {
  const { url } = req;
  switch (true) {
    case url.includes("/users"):
      usersSeed(req, res);
      break;
    case url.includes("/requestpasschange"):
      recoverSeed(req, res);
      break;
    case url.includes("/hangouts"):
      hangoutSeed(req, res);
      break;
    default:
      null;
  }
}
