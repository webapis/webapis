export default {
  objectName: 'workpermit',
  defaultProperty: 'number',
  propNames: [
    { name: 'issuedDate', type: 'date' },
    { name: 'number', type: 'text' },
    { name: 'issuedCompany', type: 'id', source: 'company' }
  ],
  collections: [{ name: 'personInWorkpermit', type: 'personInWorkPermit' }]
};

export const personInWokrkpermit = {
  objectName: 'personInWorkPermit',
  defaultProperty: 'employee',
  propNames: [
    { name: 'asNumber', type: 'text' },
    { name: 'employee', type: 'id', source: 'employee' },
    { name: 'passport', type: 'id', source: 'passport', filter: 'employee' },
    { name: 'position', type: 'id', source: 'position' },
    {
      name: 'workPermittedPlaces',
      type: 'concat',
      source: 'workPermittedPlaces'
    },
    { name: 'startDate', type: 'date' },
    { name: 'expireDate', type: 'date' },
    { name: 'workpermitNumber', type: 'text' },
    { name: 'workpermit', type: 'id', source: 'workpermit' }
  ]
};

export const workpermitplace = {
  objectName: 'workPermittedPlaces',
  defaultProperty: 'nameOfLocation',
  propNames: [{ name: 'nameOfLocation', type: 'text' }]
};
