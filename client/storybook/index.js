
import { h, render } from 'preact';
import Hangout from '../hangouts/Hangout'
const hangouts =[{username:'userone'},{username:'usertwo'},{username:'userthree'}]
render(
<div>
    <Hangout hangouts={hangouts}/>
</div>,
  document.body
);
