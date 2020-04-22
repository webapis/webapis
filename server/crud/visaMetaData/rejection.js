export default {
  objectName: 'rejection',
  defaultProperty:'number',
  
  propNames: [
    { name: 'number', type: 'text' },
    { name: 'date', type: 'date' }
  ],
  collection: [{ name: 'personInrejection', type: 'personInrejection' }]
};


export const personInRejection ={
    objectName: 'personInRejection',
    defaultProperty:'rejection',
    propNames: [
      { name: 'passport', type: 'id', source: 'passport' },
      { name: 'rejection', type: 'id', source: 'rejection' }
    ]
  }
}
