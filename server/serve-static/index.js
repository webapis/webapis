import static from 'node-static';

export default function serveStatic(req, res) {
    debugger;
  let file = new static.Server(`../apps${process.env.appName}/build`);
  file.serve(req, res);
}
