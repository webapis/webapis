export default {
  objectName: 'application',
  defaultProperty: 'number',
  propNames: [
    { name: 'number', type: 'text' },
    { name: 'date', type: 'date' },
    { name: 'applicationType', type: 'id', source: 'applicationType' },
    {
      name: 'subApplicationType',
      type: 'id',
      source: 'subApplicationType',
      filter: ['applicationType']
    },
    {
      name: 'appliedOrganization',
      type: 'id',
      source: 'appliedOrganization'
    },
    {
      name: 'visaPeriod',
      type: 'id',
      source: 'visaPeriod',
      visible: ['applicationType', 'visa']
    },
    {
      name: 'visaCategory',
      type: 'id',
      source: 'visaCategory',
      visible: ['applicationType', 'visa']
    },
    {
      name: 'visaType',
      type: 'id',
      source: 'visaType',
      visible: ['applicationType', 'visa']
    }
  ],
  collections: [
    { name: 'personInApplication', type: 'personInApplication' },
    { name: 'invitation', type: 'invitation' },
    { name: 'rejection', type: 'rejection' }
  ]
};

export const subApplicationType = {
  objectName: 'subApplicationType',
  propNames: [
    { name: 'discription', type: 'text' },
    { name: 'applicationType', type: 'id', source: 'applicationType' }
  ]
};

export const personInApplication = {
  objectName: 'personInApplication',
  propNames: [
    { name: 'person', type: 'id', source: 'person' },
    {
      name: 'passport',
      type: 'id',
      source: 'passport',
      filter: 'person'
    },
    { name: 'visa', type: 'id', source: 'visa', filter: 'passport' },
    {
      name: 'workpermit',
      type: 'id',
      source: 'workpermit',
      visible: 'application.type==="0"'
    },
    { name: 'address', type: 'id', source: 'address' },
    { name: 'application', type: 'id', source: 'application' }
  ]
};

export const visaPeriod = {
  objectName: 'visaPeriod',
  propNames: [{ name: 'description', type: 'text' }]
};

export const appliedOrganization = {
  objectName: 'appliedOrganization',
  propNames: [
    { name: 'titleOfOrganization', type: 'text' },
    { name: 'fullname', type: 'text' },
    { name: 'position', type: 'text' }
  ]
};
