import { OfferedCourseSection, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { asyncForEach } from '../../../shared/utils';
import { OfferedCourseClassScheduleUtils } from '../offeredCourseClassSchedule/offeredCourseClassSchedule.utils';
import {
  offeredCourseSectionRelationalFields,
  offeredCourseSectionRelationalFieldsMapper,
  offeredCourseSectionSearchableFields,
} from './offeredCourseSection.constant';
import {
  IClassSchedule,
  IOfferedCourseSectionCreate,
  IOfferedCourseSectionFilterOptions,
} from './offeredCourseSection.interface';

const insertIntoDB = async (
  payload: IOfferedCourseSectionCreate
): Promise<OfferedCourseSection | null> => {
  const { classSchedules, ...data } = payload;

  const isExistOfferedCourse = await prisma.offeredCourse.findFirst({
    where: {
      id: data.offeredCourseId,
    },
  });

  if (!isExistOfferedCourse) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Offered course does not exist');
  }

  //   data.semesterRegistrationId = isExistOfferedCourse.semesterRegistrationId;

  console.log(data);

  await asyncForEach(classSchedules, async (classSchedule: any) => {
    await OfferedCourseClassScheduleUtils.checkRoomAvailable(classSchedule);
    await OfferedCourseClassScheduleUtils.checkFacultyAvailable(classSchedule);
  });

  const offeredCourseSectionData = await prisma.offeredCourseSection.findFirst({
    where: {
      offeredCourse: {
        id: data.offeredCourseId,
      },
      title: data.title,
    },
  });

  if (offeredCourseSectionData) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'course section already exist');
  }

  const createSection = await prisma.$transaction(async tx => {
    const createOfferCourseSection = await tx.offeredCourseSection.create({
      data: {
        title: data.title,
        maxCapacity: data.maxCapacity,
        offeredCourseId: data.offeredCourseId,
        semesterRegistrationId: isExistOfferedCourse.semesterRegistrationId,
      },
      //   include: {
      //     offeredCourse: {
      //       include: {
      //         course: true,
      //       },
      //     },
      //     semesterRegistration: true,
      //   },
    });

    const scheduleData = classSchedules.map((schedule: IClassSchedule) => ({
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      dayOfWeek: schedule.dayOfWeek,
      roomId: schedule.roomId,
      facultyId: schedule.facultyId,
      semesterRegistrationId: isExistOfferedCourse.semesterRegistrationId,
      offeredCourseSectionId: createOfferCourseSection.id,
    }));

    // console.log(scheduleData);

    await tx.offeredCourseClassSchedule.createMany({
      data: scheduleData,
    });

    return createOfferCourseSection;
  });

  const result = await prisma.offeredCourseSection.findUnique({
    where: {
      id: createSection.id,
    },
    include: {
      offeredCourse: {
        include: {
          course: true,
        },
      },
      //   semesterRegistration: true,
      offeredCourseClassSchedules: {
        include: {
          room: {
            include: {
              building: true,
            },
          },
          faculty: true,
        },
      },
    },
  });
  return result;
};

const getAllFromDB = async (
  options: IPaginationOptions,
  filters: IOfferedCourseSectionFilterOptions
): Promise<IGenericResponse<OfferedCourseSection[]>> => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);

  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: offeredCourseSectionSearchableFields.map(field => ({
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
        if (offeredCourseSectionRelationalFields.includes(key)) {
          return {
            [offeredCourseSectionRelationalFieldsMapper[key]]: {
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

  const whereConditions: Prisma.OfferedCourseSectionWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.offeredCourseSection.findMany({
    where: whereConditions,
    include: {
      offeredCourse: {
        include: {
          course: true,
        },
      },
      semesterRegistration: true,
    },
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: 'desc' },
  });

  const total = await prisma.offeredCourseSection.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getDataById = async (
  id: string
): Promise<OfferedCourseSection | null> => {
  const result = await prisma.offeredCourseSection.findUnique({
    where: {
      id,
    },
    include: {
      offeredCourse: {
        include: {
          course: true,
        },
      },
      semesterRegistration: true,
    },
  });
  return result;
};

const updateIntoDB = async (
  id: string,
  payload: Partial<OfferedCourseSection>
): Promise<OfferedCourseSection> => {
  const result = await prisma.offeredCourseSection.update({
    where: {
      id,
    },
    data: payload,
    include: {
      offeredCourse: {
        include: {
          course: true,
        },
      },
      semesterRegistration: true,
    },
  });
  return result;
};

const deleteFromDB = async (id: string): Promise<OfferedCourseSection> => {
  const result = await prisma.offeredCourseSection.delete({
    where: {
      id,
    },
    include: {
      offeredCourse: {
        include: {
          course: true,
        },
      },
      semesterRegistration: true,
    },
  });
  return result;
};

export const OfferedCourseSectionService = {
  insertIntoDB,
  getAllFromDB,
  getDataById,
  deleteFromDB,
  updateIntoDB,
};
