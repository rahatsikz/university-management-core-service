import { WeekDays } from '@prisma/client';

export type IOfferedCourseSectionFilterOptions = {
  searchTerm?: string | undefined;
  offeredCourseId?: string | undefined;
  semesterRegistrationId?: string | undefined;
};

export type IClassSchedule = {
  startTime: string;
  endTime: string;
  dayOfWeek: WeekDays;
  roomId: string;
  facultyId: string;
};

export type IOfferedCourseSectionCreate = {
  title: string;
  maxCapacity: number;
  offeredCourseId: string;
  classSchedules: IClassSchedule[];
};
