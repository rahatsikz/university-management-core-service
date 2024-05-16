export type ICourseCreateData = {
    title: string;
    code: string;
    credits: number;
    prerequisiteCourses: IPrerequisiteCourse[]
}

export type IPrerequisiteCourse = {
    courseId: string;
    isDeleted?: null
}

export type ICourseFilterOptions = {
    searchTerm?: string;
}