import { db } from '../db';
export default function ({ req, res, collection }) {
  
  db.emit('insertOne', {
    colName: 'invitation',
    dbName: 'chat',
    obj: { sender: 'testuser' },
  });

  db.on('insertOne_invitation', function (obj) {
    console.log('object inserted', obj);
  });
}
