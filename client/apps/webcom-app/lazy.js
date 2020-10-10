export default async function (url) {
  let component = await import(url);
  debugger;
  return component;
}
