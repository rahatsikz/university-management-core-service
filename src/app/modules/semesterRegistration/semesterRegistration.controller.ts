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

export const SemesterRegistrationController = {
    insertIntoDB,
    getAllFromDB
}