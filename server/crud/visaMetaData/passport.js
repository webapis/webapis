export default {
  objectName: 'passport',
  defaultProperty: 'number',
  propNames: [
    {
      name: 'number',
      type: 'text',
      placeholder: 'Enter Passport Number'
    },
    { name: 'personalId', type: 'text' },
    { name: 'citizenship', type: 'id', source: 'country' },
    { name: 'issuedCountry', type: 'id', source: 'country' },
    { name: 'passportType', type: 'id', source: 'passportType' },
    { name: 'issuedPlace', type: 'text' },
    { name: 'issuedDate', type: 'date' },
    { name: 'expireDate', type: 'date' }
  ]
};

export const passportType = {
  objectName: 'passportType',
  propNames: [{ name: 'typeOfPassport', type: 'text' }]
};
