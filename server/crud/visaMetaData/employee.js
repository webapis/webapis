export default {
  objectName: 'position',
  defaultProperty: 'titleOfPosition',
  propNames: [{ name: 'titleOfPosition', type: 'text' }]
};

export const department = {
  objectName: 'department',
  defaultProperty: 'nameOfDepartment',
  propNames: [{ name: 'nameOfDepartment', type: 'text' }]
};

export const workhistory = {
  objectName: 'workhistory',
  defaultProperty: 'position',
  propNames: [
    { name: 'company', type: 'id', source: 'company' },
    { name: 'department', type: 'id', source: 'department' },
    { name: 'position', type: 'id', source: 'position' }
  ]
};

export const salary = {
  objectName: 'salary',
  defaultProperty: 'amount',
  propNames: [{ name: 'amount', type: 'text' }]
};

export const subcontractor = {
  objectName: 'subcontractor',
  defaultProperty: 'nameOfSubcontractor',
  propNames: [{ name: 'nameOfSubcontractor', type: 'text' }]
};

export const project = {
  objectName: 'project',
  defaultProperty: 'nameOfProject',
  propNames: [{ name: 'nameOfProject', type: 'text' }]
};
