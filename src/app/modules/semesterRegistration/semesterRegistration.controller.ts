import { SemesterRegistration } from "@prisma/client";
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { semesterRegistrationFilterableFields } from "./semesterRegistration.constant";
import { SemesterRegistrationService } from "./semesterRegistration.service";

const insertIntoDB = catchAsync(async(req: Request, res:Response)=> {
    const result = await SemesterRegistrationService.insertIntoDB(req.body);
    sendResponse<SemesterRegistration>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Semester Registration created successfully",
        data: result
    })
})

const getAllFromDB = catchAsync(async(req: Request, res:Response)=> {
    const options = pick(req.query, ['sortBy', 'sortOrder', 'limit', 'page']);
    const filters = pick(req.query, semesterRegistrationFilterableFields);

    const result = await SemesterRegistrationService.getAllFromDB(options, filters);
    sendResponse<SemesterRegistration[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Semester Registration data fetched successfully",
        meta: result.meta,
        data: result.data
    })
})

const getDataByID = catchAsync(async(req: Request, res:Response)=> {
    const result = await SemesterRegistrationService.getDataByID(req.params.id);
    sendResponse<SemesterRegistration>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Semester Registration fetched successfully",
        data: result
    })
})

const updateOneInDB = catchAsync(async(req: Request, res:Response)=> {
    const result = await SemesterRegistrationService.updateOneInDB(req.params.id, req.body);
    sendResponse<SemesterRegistration>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Semester Registration updated successfully",
        data: result
    })
})

const deleteFromDB = catchAsync(async(req: Request, res:Response)=> {
    const result = await SemesterRegistrationService.deleteFromDB(req.params.id);
    sendResponse<SemesterRegistration>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Semester Registration deleted successfully",
        data: result
    })
})

const startMyRegistration = catchAsync(async(req: Request, res:Response)=> {
    const user = (req as any).user;
    // console.log(user);
    const result = await SemesterRegistrationService.startMyRegistration(user.userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Student Semester Registration started successfully",
        data: result
    })
    
})

export const SemesterRegistrationController = {
    insertIntoDB,
    getAllFromDB,
    getDataByID,
    deleteFromDB,
    updateOneInDB,
    startMyRegistration
}