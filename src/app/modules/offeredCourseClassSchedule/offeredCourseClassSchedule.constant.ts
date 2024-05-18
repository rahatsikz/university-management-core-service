export const offeredCourseClassScheduleSearchableFields = ["dayOfWeek"]

export const offeredCourseClassScheduleRelationalFields = ["offeredCourseSectionId", "facultyId", "roomId", "semesterRegistrationId"]

export const offeredCourseClassScheduleRelationalFieldsMapper : { [key: string]: string } = {
    offeredCourseSectionId: "offeredCourseSection",
    facultyId: "faculty",
    roomId: "room",
    semesterRegistrationId: "semesterRegistration"
}

export const offeredCourseClassScheduleFilterableFields = [
    'searchTerm',
    'dayOfWeek',
    'offeredCourseSectionId',
    'semesterRegistrationId',
    'roomId',
    'facultyId'
]