import {
  StudentEnrolledCourse,
  StudentEnrolledCourseStatus,
} from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';

const insertIntoDB = async (data: StudentEnrolledCourse) => {
  const isCourseOngoingOrCompleted =
    await prisma.studentEnrolledCourse.findFirst({
      where: {
        OR: [
          {
            status: StudentEnrolledCourseStatus.ONGOING,
          },
          {
            status: StudentEnrolledCourseStatus.COMPLETED,
          },
        ],
      },
    });

  if (isCourseOngoingOrCompleted) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `There is already an ${isCourseOngoingOrCompleted.status?.toLowerCase()} course registration`
    );
  }

  const result = await prisma.studentEnrolledCourse.create({
    data,
    include: {
      academicSemester: true,
      course: true,
      student: true,
    },
  });

  return result;
};

export const StudentEnrolledCourseService = {
  insertIntoDB,
};
