import { OfferedCourseSection } from "@prisma/client";
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { offeredCourseSectionFilterableFields } from "./offeredCourseSection.constant";
import { OfferedCourseSectionService } from "./offeredCourseSection.service";

const insertIntoDB = catchAsync(async(req: Request, res:Response)=> {
    const result = await OfferedCourseSectionService.insertIntoDB(req.body);

    sendResponse<OfferedCourseSection>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Offered course section created successfully",
        data: result
    })
})

const getAllFromDB = catchAsync(async(req: Request, res:Response)=> {
    
    const options = pick(req.query, ['sortBy', 'sortOrder', 'limit', 'page']);
    const filters = pick(req.query, offeredCourseSectionFilterableFields);
    
    const result = await OfferedCourseSectionService.getAllFromDB(options,filters);

    sendResponse<OfferedCourseSection[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Offered course sections fetched successfully",
        meta: result.meta,
        data: result.data
    })
})

const getDataById = catchAsync(async(req: Request, res:Response)=> {
    const result = await OfferedCourseSectionService.getDataById(req.params.id);
    sendResponse<OfferedCourseSection>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Offered course section fetched successfully",
        data: result
    })
})

const updateIntoDB = catchAsync(async(req: Request, res:Response)=> {
    const result = await OfferedCourseSectionService.updateIntoDB(req.params.id, req.body);
    sendResponse<OfferedCourseSection>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Offered course section updated successfully",
        data: result
    })
})

const deleteFromDB = catchAsync(async(req: Request, res:Response)=> {
    const result = await OfferedCourseSectionService.deleteFromDB(req.params.id);
    sendResponse<OfferedCourseSection>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Offered course section deleted successfully",
        data: result
    })
})

export const OfferedCourseSectionController = {
    insertIntoDB,
    getAllFromDB,
    getDataById,
    updateIntoDB,
    deleteFromDB
}