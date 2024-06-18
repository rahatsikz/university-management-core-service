import { SemesterRegistration } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { semesterRegistrationFilterableFields } from './semesterRegistration.constant';
import { SemesterRegistrationService } from './semesterRegistration.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await SemesterRegistrationService.insertIntoDB(req.body);
  sendResponse<SemesterRegistration>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semester Registration created successfully',
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, ['sortBy', 'sortOrder', 'limit', 'page']);
  const filters = pick(req.query, semesterRegistrationFilterableFields);

  const result = await SemesterRegistrationService.getAllFromDB(
    options,
    filters
  );
  sendResponse<SemesterRegistration[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semester Registration data fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getDataByID = catchAsync(async (req: Request, res: Response) => {
  const result = await SemesterRegistrationService.getDataByID(req.params.id);
  sendResponse<SemesterRegistration>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semester Registration fetched successfully',
    data: result,
  });
});

const updateOneInDB = catchAsync(async (req: Request, res: Response) => {
  const result = await SemesterRegistrationService.updateOneInDB(
    req.params.id,
    req.body
  );
  sendResponse<SemesterRegistration>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semester Registration updated successfully',
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await SemesterRegistrationService.deleteFromDB(req.params.id);
  sendResponse<SemesterRegistration>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semester Registration deleted successfully',
    data: result,
  });
});

const startMyRegistration = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  // console.log(user);
  const result = await SemesterRegistrationService.startMyRegistration(
    user.userId
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student Semester Registration started successfully',
    data: result,
  });
});

const enrollIntoCourse = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;

  const result = await SemesterRegistrationService.enrollIntoCourse(
    user.userId,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student Semester Registration course enrolled successfully',
    data: result,
  });
});

const withdrawFromCourse = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;

  const result = await SemesterRegistrationService.withdrawFromCourse(
    user.userId,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student Semester Registration course withdrawn successfully',
    data: result,
  });
});

const confirmMyRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result = await SemesterRegistrationService.confirmMyRegistration(
      user.userId
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Confirm your registration!',
      data: result,
    });
  }
);

const getMyRegistration = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const result = await SemesterRegistrationService.getMyRegistration(
    user.userId
  );
  console.log(result);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My registration data fatched!',
    data: result,
  });
});

const startNewSemester = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SemesterRegistrationService.startNewSemester(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semester started successfully',
    data: result,
  });
});

export const SemesterRegistrationController = {
  insertIntoDB,
  getAllFromDB,
  getDataByID,
  deleteFromDB,
  updateOneInDB,
  startMyRegistration,
  enrollIntoCourse,
  withdrawFromCourse,
  confirmMyRegistration,
  getMyRegistration,
  startNewSemester,
};
