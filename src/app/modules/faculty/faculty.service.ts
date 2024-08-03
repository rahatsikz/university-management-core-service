import { CourseFaculty, Faculty, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import {
  facultyRelationalFields,
  facultyRelationalFieldsMapper,
  facultySearchableFields,
} from './faculty.constant';
import { IFacultyFilterOptions } from './faculty.interface';

const insertIntoDB = async (facultyData: Faculty): Promise<Faculty> => {
  const result = await prisma.faculty.create({
    data: facultyData,
    include: {
      academicFaculty: true,
      academicDepartment: true,
    },
  });

  return result;
};

const getAllFromDB = async (
  options: IPaginationOptions,
  filters: IFacultyFilterOptions
): Promise<IGenericResponse<Faculty[]>> => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  // console.log(filters);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: facultySearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        if (facultyRelationalFields.includes(key)) {
          return {
            [facultyRelationalFieldsMapper[key]]: {
              id: (filterData as any)[key],
            },
          };
        } else {
          return {
            [key]: {
              equals: (filterData as any)[key],
            },
          };
        }
      }),
    });
  }

  const whereConditions: Prisma.FacultyWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.faculty.findMany({
    where: whereConditions,
    include: {
      academicFaculty: true,
      academicDepartment: true,
    },
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: 'desc' },
  });

  const total = await prisma.faculty.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getDataByID = async (id: string): Promise<Faculty | null> => {
  const result = await prisma.faculty.findUnique({
    where: {
      id,
    },
    include: {
      academicFaculty: true,
      academicDepartment: true,
    },
  });
  return result;
};

const updateIntoDB = async (
  id: string,
  payload: Partial<Faculty>
): Promise<Faculty> => {
  const result = await prisma.faculty.update({
    where: {
      id,
    },
    data: payload,
    include: {
      academicFaculty: true,
      academicDepartment: true,
    },
  });
  return result;
};

const deleteFromDB = async (id: string): Promise<Faculty> => {
  const result = await prisma.faculty.delete({
    where: {
      id,
    },
    include: {
      academicFaculty: true,
      academicDepartment: true,
    },
  });
  return result;
};

const assignCourses = async (
  id: string,
  payload: string[]
): Promise<CourseFaculty[]> => {
  await prisma.courseFaculty.createMany({
    data: payload.map(courseId => ({
      facultyId: id,
      courseId: courseId,
    })),
  });

  const assignCoursesData = await prisma.courseFaculty.findMany({
    where: {
      facultyId: id,
    },
    include: {
      course: true,
    },
  });

  return assignCoursesData;
};

const removeCourses = async (
  id: string,
  payload: string[]
): Promise<CourseFaculty[]> => {
  await prisma.courseFaculty.deleteMany({
    where: {
      facultyId: id,
      courseId: {
        in: payload,
      },
    },
  });

  const assignCoursesData = await prisma.courseFaculty.findMany({
    where: {
      facultyId: id,
    },
    include: {
      course: true,
    },
  });

  return assignCoursesData;
};

const myCourses = async (
  authUser: { userId: string; role: string },
  filter: {
    academicSemesterId?: string | undefined;
    courseId?: string | undefined;
  }
) => {
  //   console.log('my Courses', authUser);

  if (!filter.academicSemesterId) {
    const currentSemester = await prisma.academicSemester.findFirst({
      where: {
        isCurrent: true,
      },
    });

    filter.academicSemesterId = currentSemester?.id;
  }

  const offeredCourseSection = await prisma.offeredCourseSection.findMany({
    where: {
      offeredCourseClassSchedules: {
        some: {
          faculty: {
            facultyId: authUser.userId,
          },
        },
      },
      offeredCourse: {
        semesterRegistration: {
          academicSemester: {
            id: filter.academicSemesterId,
          },
        },
      },
    },
    include: {
      offeredCourse: {
        include: {
          course: true,
        },
      },
      offeredCourseClassSchedules: {
        include: {
          room: {
            include: {
              building: true,
            },
          },
        },
      },
    },
  });

  //   console.log(offeredCourseSection);

  const courseAndSchedule = offeredCourseSection.reduce(
    (acc: any, obj: any) => {
      //   console.log(obj);

      const course = obj.offeredCourse.course;
      const classSchedules = obj.offeredCourseClassSchedules;

      const existingCourse = acc.find(
        (item: any) => item.course.id === course?.id
      );

      if (existingCourse) {
        existingCourse.sections.push({
          section: obj,
          classSchedules,
        });
      } else {
        acc.push({
          course,
          sections: [
            {
              section: obj,
              classSchedules,
            },
          ],
        });
      }

      return acc;
    },
    []
  );

  return courseAndSchedule;
};
const getMyCourseStudents = async (
  authUserId: string,
  filter: {
    academicSemesterId?: string | undefined;
    courseId?: string | undefined;
    courseSectionId?: string | undefined;
  },
  options: IPaginationOptions
) => {
  // console.log(authUserId, filter, options);
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);

  if (!filter.academicSemesterId) {
    const currentSemester = await prisma.academicSemester.findFirst({
      where: {
        isCurrent: true,
      },
    });

    filter.academicSemesterId = currentSemester?.id;
  }

  const offeredCourseSection =
    await prisma.studentSemesterRegistrationCourse.findMany({
      where: {
        offeredCourse: {
          course: {
            id: filter.courseId,
          },
        },
        offeredCourseSection: {
          offeredCourse: {
            semesterRegistration: {
              academicSemester: {
                id: filter.academicSemesterId,
              },
            },
          },
          id: filter.courseSectionId,
        },
      },
      include: {
        student: true,
      },
      skip,
      take: limit,
    });

  // console.log(offeredCourseSection);
  const students = offeredCourseSection.map((item: any) => item.student);

  const total = await prisma.studentSemesterRegistrationCourse.count({
    where: {
      offeredCourse: {
        course: {
          id: filter.courseId,
        },
      },
      offeredCourseSection: {
        offeredCourse: {
          semesterRegistration: {
            academicSemester: {
              id: filter.academicSemesterId,
            },
          },
        },
        id: filter.courseSectionId,
      },
    },
  });
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: students,
  };
};

export const FacultyService = {
  insertIntoDB,
  getAllFromDB,
  getDataByID,
  updateIntoDB,
  deleteFromDB,
  assignCourses,
  removeCourses,
  myCourses,
  getMyCourseStudents,
};
