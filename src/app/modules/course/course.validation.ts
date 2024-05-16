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

const updateCourse = z.object({
    body: z.object({
        title: z.string().optional(),
        code: z.string().optional(),
        credits: z.number().optional(),
        prerequisiteCourses: z.array(
            z.object({
                courseId: z.string({}),
                isDeleted: z.boolean().optional()
            })
        ).optional()
    })
})

const assignOrRemoveFaculties = z.object({
    body: z.object({
        faculties: z.array(z.string(),{
            required_error: "Faculties are required",
        })
    })
})

export const CourseValidation = {
    createCourse,
    updateCourse,
    assignOrRemoveFaculties
}