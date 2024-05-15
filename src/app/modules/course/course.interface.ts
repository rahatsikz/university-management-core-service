export type ICourseCreateData = {
    title: string;
    code: string;
    credits: number;
    prerequisiteCourses: {
        courseId: string;
    }[]
}

export type ICourseFilterOptions = {
    searchTerm?: string;
}