import { z } from "zod";

const createCourse = z.object({
    body: z.object({
        title: z.string({
            required_error: "Title is required",
        }),
        code: z.string({
            required_error: "Code is required",
        }),
        credits: z.number({
            required_error: "Credits is required",
        }),
        prerequisiteCourses: z.array(
            z.object({
                courseId: z.string({})
            })
        )
    })
})

export const CourseValidation = {
    createCourse
}