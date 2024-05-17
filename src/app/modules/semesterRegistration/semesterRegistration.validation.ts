import { z } from "zod";

const createSemesterRegistration = z.object({
    body: z.object({
        startDate: z.string({
            required_error: "Start date is required",
        }),
        endDate: z.string({
            required_error: "End date is required",
        }),
        minCredit: z.number({
            required_error: "Min credit is required",
        }),
        maxCredit: z.number({
            required_error: "Max credit is required",
        }),
        academicSemesterId: z.string({
            required_error: "Academic semester id is required",
        })
    })
})

export const SemesterRegistrationValidation = {
    createSemesterRegistration
}

/* 
"startDate": "2023-07-01T00:00:00.000Z",
    "endDate": "2023-07-15T00:00:00.000Z",
    "status": "UPCOMING",
    "minCredit": 12,
    "maxCredit": 15,
    "academicSemesterId": "c2336be4-7137-40f9-825f-bf098ce46e96"
*/