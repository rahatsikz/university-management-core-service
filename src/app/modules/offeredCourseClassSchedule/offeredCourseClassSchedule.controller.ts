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

const getDataByID = catchAsync(async(req: Request, res:Response)=> {
    const result = await OfferedCourseClassScheduleService.getDataByID(req.params.id);
    sendResponse<OfferedCourseClassSchedule>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Offered course class schedule fetched successfully",
        data: result
    })
})

const updateIntoDB = catchAsync(async(req: Request, res:Response)=> {
    const {id} = req.params
    const payload = req.body
    
    const result = await OfferedCourseClassScheduleService.updateIntoDB(id, payload);
    sendResponse<OfferedCourseClassSchedule>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Offered course class schedule updated successfully",
        data: result
    })
})

const deleteFromDB = catchAsync(async(req: Request, res:Response)=> {
    const {id} = req.params;
    const result = await OfferedCourseClassScheduleService.deleteFromDB(id);
    sendResponse<OfferedCourseClassSchedule>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Offered course class schedule deleted successfully",
        data: result
    })
})

export const OfferedCourseClassScheduleController = {
    insertIntoDB,
    getAllFromDB,
    getDataByID,
    updateIntoDB,
    deleteFromDB
}