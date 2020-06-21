import { h } from 'preact';

const style = {
  root: {},
  top: {},
  bottom: {},
};

export function DrawerContent({ authContent, otherContent }) {
  return (
    <div>
      <div>
       
        {authContent}
      </div>
      <div>
    
        {otherContent}
      </div>
    </div>
  );
}
