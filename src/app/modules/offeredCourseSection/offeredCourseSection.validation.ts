import { z } from "zod";

const createOfferedCourseSection = z.object({
    body: z.object({
        title: z.string({
            required_error: "Title is required",
        }),
        maxCapacity: z.number({
            required_error: "Max capacity is required",
        }),
        offeredCourseId: z.string({
            required_error: "Offered course id is required",
        })
    })
})

const updateOfferedCourseSection = z.object({
    body: z.object({
        title: z.string().optional(),
        maxCapacity: z.number().optional(),
    })
});

export const OfferedCourseSectionValidation = {
    createOfferedCourseSection,
    updateOfferedCourseSection
}


/* 
"title": "B",
    "maxCapacity": 50,
    "offeredCourseId": "626205dc-90a3-4153-89e0-50c571a9c508"
*/