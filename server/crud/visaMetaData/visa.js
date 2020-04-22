export default {
  objectName: 'visa',
  defaultProperty: 'number',
  propNames: [
    {
      name: 'number',
      type: 'text',
      placeholder: 'Enter Visa Number'
    },
    {
      name: 'issuedDate',
      type: 'date'
    },
    {
      name: 'startDate',
      type: 'date'
    },
    {
      name: 'expireDate',
      type: 'date'
    },
    {
      name: 'typeOfVisa',
      type: 'id',
      source: 'visaType'
    },
    {
      name: 'borderZones',
      type: 'concat',
      source: 'borderzone'
    },
    {
      name: 'registrationNotRequired',
      type: 'bool'
    },
    {
      name: 'asNumber',
      type: 'text'
    }
  ]
};

export const visaType = {
  objectName: 'visaType',
  defaultProperty: 'nameOfVisaType',
  propNames: [{ name: 'nameOfVisaType', type: 'text' }]
};
export const visaCategory = {
  objectName: 'visaCategory',
  defaultProperty: 'nameOfVisaCategory',
  propNames: [{ name: 'nameOfVisaCategory', type: 'text' }]
};

export const borderZone = {
  objectName: 'borderZone',
  defaultProperty: 'nameOfBorderZone',
  propNames: [{ name: 'nameOfBorderZone', type: 'text' }]
};
