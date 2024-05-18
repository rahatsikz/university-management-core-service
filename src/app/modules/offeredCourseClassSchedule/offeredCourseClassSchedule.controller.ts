import { OfferedCourseClassSchedule } from "@prisma/client";
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { offeredCourseClassScheduleFilterableFields } from "./offeredCourseClassSchedule.constant";
import { OfferedCourseClassScheduleService } from "./offeredCourseClassSchedule.service";

const insertIntoDB = catchAsync(async(req: Request, res:Response)=> {
    const result = await OfferedCourseClassScheduleService.insertIntoDB(req.body);

    sendResponse<OfferedCourseClassSchedule>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Offered course class schedule created successfully",
        data: result
    })
})

const getAllFromDB = catchAsync(async(req: Request, res:Response)=> {
    
    const options = pick(req.query, ['sortBy', 'sortOrder', 'limit', 'page']);
    const filters = pick(req.query, offeredCourseClassScheduleFilterableFields);
    
    const result = await OfferedCourseClassScheduleService.getAllFromDB(options, filters);
    sendResponse<OfferedCourseClassSchedule[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Offered course class schedule fetched successfully",
        meta: result.meta,
        data: result.data
    })
})

export const OfferedCourseClassScheduleController = {
    insertIntoDB,
    getAllFromDB
}