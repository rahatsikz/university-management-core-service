export const studentFilterableFields = [
    'searchTerm',
    'studentId',
    'email',
    'contactNo',
    'gender',
    'bloodGroup',
    'gender',
    'academicFacultyId',
    'academicDepartmentId',
    'academicSemesterId'
];

export const studentSearchableFields = [
    'firstName',
    'lastName',
    'middleName',
    'email',
    'contactNo',
    'studentId'
];

export const studentRelationalFields = [
    'academicFacultyId',
    'academicDepartmentId',
    'academicSemesterId'
];
export const studentRelationalFieldsMapper: { [key: string]: string } = {
    academicFacultyId: 'academicFaculty',
    academicDepartmentId: 'academicDepartment',
    academicSemesterId: 'academicSemester'
};