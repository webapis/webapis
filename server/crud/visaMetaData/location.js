export default {
  objectName: 'country',
  defaultProperty: 'codeOfCountry',
  
  propNames: [
    { name: 'codeOfCountry', type: 'text' },
    { name: 'nameOfCountry', type: 'text' }
  ]
};

export const addressOfRegistration = {
  objectName: 'addressOfRegistration',
  defaultProperty: 'description',
  propNames: [{ name: 'description', type: 'text' }]
};

export const region = {
  objectName: 'region',
  defaultProperty: 'nameOfRegion',
  propNames: [{ name: 'nameOfRegion', type: 'text' }]
};

export const city = {
  objectName: 'city',
  defaultProperty: 'nameOfCity',
  propNames: [{ name: 'nameOfCity', type: 'text' }]
};
