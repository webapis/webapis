export default {
  objectName: 'person',
  defaultProperty: 'firstName',
  navigations: ['employee', 'familyMember'],
  navFilters: [
    { nav: 'employee', filter: { personType: true } },
    { nav: 'familyMember', filter: { personType: false } }
  ],
  navListView: [
    {
      nav: 'employee',
      listView: ['maritalStatus', 'project', 'subcontractor', 'salary']
    },
    { nav: 'familyMember', listView: ['employee', 'relation'] },
    {
      nav: 'both'
    }
  ],
  listView: ['firstName', 'lastName', 'birthDate', 'active'],
  propNames: [
    { name: 'personType', type: 'bool' },
    {
      name: 'firstName',
      type: 'text',
      placeholder: 'Enter firstname'
    },
    {
      name: 'lastName',
      type: 'text',
      placeholder: 'Enter lastname'
    },
    { name: 'birthDate', type: 'date' },
    { name: 'gender', type: 'id', source: 'gender' },
    { name: 'birthCountry', type: 'id', source: 'country' },
    {
      name: 'birthPlace',
      type: 'text',
      placeholder: 'Enter place of birth'
    },
    {
      name: 'maritalStatus',
      type: 'id',
      source: 'maritalStatus',
      filter: 'gender'
    },
    {
      name: 'countryOfResidence',
      type: 'id',
      source: 'country'
    },
    { name: 'addressOfResidence', type: 'text' },
    { name: 'employee', type: 'id', source: 'person' },
    {
      name: 'relation',
      type: 'id',
      source: 'relation',
      filter: 'gender'
    },
    {
      name: 'project',
      type: 'id',
      source: 'project'
    },
    {
      name: 'subcontractor',
      type: 'id',
      source: 'subcontractor'
    },
    {
      name: 'salary',
      type: 'id',
      source: 'salary'
    },
    { name: 'active', type: 'bool' },
    { name: 'outsideOfCountry', type: 'bool' }
  ],
  collections: [
    { name: 'passports', type: 'passport' },
    { name: 'educations', type: 'education' },
    { name: 'addresses', type: 'address' },
    {
      name: 'workpermits',
      type: 'employeeInWorkPermit',
      visible: ['personType', true]
    },
    { name: 'invitations', type: 'personInInvitation' },
    { name: 'applications', type: 'personInApplication' },
    { name: 'familyMembers', type: 'person', visible: ['personType', true] }
  ]
};

export const maritalStatus = {
  objectName: 'maritalStatus',
  defaultProperty: 'nameOfMaritalStatus',
  propNames: [{ name: 'nameOfMaritalStatus', type: 'text' }]
};

export const gender = {
  objectName: 'gender',
  defaultProperty: 'nameOfGender',
  propNames: [{ name: 'nameOfGender', type: 'text' }]
};
