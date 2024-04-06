import { z } from "zod";

const CreateAcademicSemester = z.object({
    body: z.object({
        year: z.number({
            required_error: "Year is required",
        }),
        title: z.string({
            required_error: "Title is required",
        }),
        code: z.string({
            required_error: "Code is required",
        }),
        startMonth: z.string({
            required_error: "Start month is required",
        }),
        endMonth: z.string({
            required_error: "End month is required",
        })
    })
})

export const AcademicSemesterValidation = {
    CreateAcademicSemester
}

/* 
year       Int
  title      String
  code       String
  startMonth String
  endMonth   String
*/