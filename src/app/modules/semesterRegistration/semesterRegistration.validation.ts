import { SemesterRegistrationStatus } from "@prisma/client";
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

const updateSemesterRegistration = z.object({
    body: z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        minCredit: z.number().optional(),
        maxCredit: z.number().optional(),
        academicSemesterId: z.string().optional(),
        status: z.enum([...Object.values(SemesterRegistrationStatus)] as [string,...string[]], {}).optional()
    })
})

export const SemesterRegistrationValidation = {
    createSemesterRegistration,
    updateSemesterRegistration
}

/* 
"startDate": "2023-07-01T00:00:00.000Z",
    "endDate": "2023-07-15T00:00:00.000Z",
    "status": "UPCOMING",
    "minCredit": 12,
    "maxCredit": 15,
    "academicSemesterId": "c2336be4-7137-40f9-825f-bf098ce46e96"
*/