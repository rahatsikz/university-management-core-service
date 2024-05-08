export const academicDepartmentFilterableFields = ['searchTerm', 'id', 'academicFacultyId'];

export const academicDepartmentSearchableFields = ['title'];

export const academicDepartmentRelationalFields = ['academicFacultyId']

export const academicDepartmentRelationalFieldMapper:{[key: string]: string} = {academicFacultyId: 'academicFaculty'}