export default {
  objectName: 'invitation',
  defaultProperty: 'asgh',
  propNames: [
    { name: 'asgh', type: 'text' },
    { name: 'asNumber', type: 'text' },
    { name: 'issuedDate', type: 'date' },
    { name: 'expireDate', type: 'date' },
    { name: 'visaCategory', type: 'id', source: 'visaCategory' },
    { name: 'visaPeriod', type: 'id', source: 'visaPeriod' },
    { name: 'notes', type: 'text' }
  ],
  collections: [{ name: 'personInInvitation', type: 'personInInvitation' }]
};

export const personInInvitation = {
  objectName: 'personInInvitation',
  defaultProperty: 'invitation',
  propNames: [
    { name: 'person', type: 'id', source: 'person' },
    { name: 'passport', type: 'id', source: 'passport', filter: 'person' },
    { name: 'invitation', type: 'id', source: 'invitation' }
  ]
};
