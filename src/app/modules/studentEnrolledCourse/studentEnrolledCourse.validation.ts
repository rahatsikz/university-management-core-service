import { z } from 'zod';

const create = z.object({
  body: z.object({
    academicSemesterId: z.string({
      required_error: 'Academic semester id is required',
    }),
    studentId: z.string({
      required_error: 'Student id is required',
    }),
    courseId: z.string({
      required_error: 'Course id is required',
    }),
  }),
});

export const StudentEnrolledCourseValidation = {
  create,
};
