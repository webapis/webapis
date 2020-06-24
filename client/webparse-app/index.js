import 'whatwg-fetch';

import { h, render } from 'preact';

Parse.initialize("zttpnqTr8refktBWNekZhZxSxwPaAAnElQ9k7CuA","Q7SHSFLG618izbySMpAsFAqgnOLaYgxNlwfFhOAr"); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
Parse.serverURL = 'http://localhost:1337/parse'
const MyThirdClass = Parse.Object.extend("MyThirdClass");
const myThirdClass = new MyThirdClass();

myThirdClass.set("name", "I'm able to save objects!");
myThirdClass.save()
.then((object) => {
  // Success
  alert('New object created with objectId: ' + object.id);
}, (error) => {
  // Save fails
  alert('Failed to create new object, with error code: ' + error.message);
});
render(
  <div>
  Web-parse app
  </div>,

  document.body
);