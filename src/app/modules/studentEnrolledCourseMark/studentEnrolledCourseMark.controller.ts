import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { studentEnrolledCourseMarkFilterableFields } from './studentEnrolledCourseMark.constant';
import { StudentEnrolledCourseMarkService } from './studentEnrolledCourseMark.service';

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, studentEnrolledCourseMarkFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await StudentEnrolledCourseMarkService.getAllFromDB(
    filters,
    options
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student course marks fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const updateStudentMarks = catchAsync(async (req: Request, res: Response) => {
  const result = await StudentEnrolledCourseMarkService.updateStudentMarks(
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Marks updated successfully',
    data: result,
  });
});

const updateFinalMarks = catchAsync(async (req: Request, res: Response) => {
  const result = await StudentEnrolledCourseMarkService.updateFinalMarks(
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Final Marks updated successfully',
    data: result,
  });
});

const getEnrolledCourseMarks = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;
    const filter = pick(req.query, ['courseId', 'academicSemesterId']);

    const result =
      await StudentEnrolledCourseMarkService.getEnrolledCourseMarks(
        user?.userId,
        filter
      );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Course mark fetched successfully',
      data: result,
    });
  }
);

export const StudentEnrolledCourseMarkController = {
  updateStudentMarks,
  getAllFromDB,
  updateFinalMarks,
  getEnrolledCourseMarks,
};
