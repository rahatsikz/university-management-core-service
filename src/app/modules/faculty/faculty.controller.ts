import { CourseFaculty, Faculty } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { facultyFilterableFields } from './faculty.constant';
import { FacultyService } from './faculty.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await FacultyService.insertIntoDB(req.body);

  sendResponse<Faculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty created successfully',
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, ['sortBy', 'sortOrder', 'limit', 'page']);
  const filters = pick(req.query, facultyFilterableFields);

  const result = await FacultyService.getAllFromDB(options, filters);

  sendResponse<Faculty[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All faculties fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getDataByID = catchAsync(async (req: Request, res: Response) => {
  const result = await FacultyService.getDataByID(req.params.id);
  sendResponse<Faculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty fetched successfully',
    data: result,
  });
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;

  const result = await FacultyService.updateIntoDB(id, payload);
  sendResponse<Faculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty updated successfully',
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await FacultyService.deleteFromDB(id);
  sendResponse<Faculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty deleted successfully',
    data: result,
  });
});

const assignCourses = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body.courses;
  const result = await FacultyService.assignCourses(id, payload);
  sendResponse<CourseFaculty[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course added to faculty successfully',
    data: result,
  });
});

const removeCourses = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body.courses;
  const result = await FacultyService.removeCourses(id, payload);
  sendResponse<CourseFaculty[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course removed from faculty successfully',
    data: result,
  });
});

const myCourses = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;

  const filter = pick(req.query, ['academicSemesterId', 'courseId']);

  const result = await FacultyService.myCourses(user, filter);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty course data fetched successfully',
    data: result,
  });
});

const getMyCourseStudents = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const filter = pick(req.query, [
    'academicSemesterId',
    'courseId',
    'courseSectionId',
  ]);
  const options = pick(req.query, ['sortBy', 'sortOrder', 'limit', 'page']);

  const result = await FacultyService.getMyCourseStudents(
    user?.userId,
    filter,
    options
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'course students data for faculty fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const FacultyController = {
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
