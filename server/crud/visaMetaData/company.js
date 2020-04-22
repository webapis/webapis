export default {
  objectName: 'company',
  defaultProperty: 'titleOfCompany',
  propNames: [
    { name: 'titleOfCompany', type: 'text' },
    { name: 'address', type: 'text' },
    { name: 'phoneNumbers', type: 'text' },
    { name: 'taxRegistration', type: 'text' },
    { name: 'representative', type: 'id', source: 'representative' },
    { name: 'signingAuthority', type: 'id', source: 'signingAuthority' },
    { name: 'email', type: 'email' }
  ]
};

export const signingAuthority = {
  objectName: 'signingAuthority',
  propNames: [{ name: 'fullName', type: 'text' }]
};

export const representative = {
  objectName: 'representative',
  propNames: [
    { name: 'fullname', type: 'text' },
    { name: 'passportInfo', type: 'text' },
    { name: 'phoneNumber', type: 'text' }
  ]
};
