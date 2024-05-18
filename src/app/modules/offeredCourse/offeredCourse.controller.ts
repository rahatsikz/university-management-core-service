import { OfferedCourse } from "@prisma/client";
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { offeredCourseFilterableFields } from "./offeredCourse.constant";
import { OfferedCourseService } from "./offeredCourse.service";

const insertIntoDB = catchAsync(async(req: Request, res:Response)=> {
    // console.log(req.body);

    const result = await OfferedCourseService.insertIntoDB(req.body);

    sendResponse<OfferedCourse[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Offered course created successfully",
        data: result
    })
    
})

const getAllFromDB = catchAsync(async(req: Request, res:Response)=> {
    
    const options = pick(req.query, ['sortBy', 'sortOrder', 'limit', 'page']);
    const filters = pick(req.query, offeredCourseFilterableFields);
    
    const result = await OfferedCourseService.getAllFromDB(options,filters);

    sendResponse<OfferedCourse[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Offered courses fetched successfully",
        meta: result.meta,
        data: result.data
    })
})

const getDataById = catchAsync(async(req: Request, res:Response)=> {
    const result = await OfferedCourseService.getDataById(req.params.id);
    sendResponse<OfferedCourse>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Offered course fetched successfully",
        data: result
    })
})

const updateIntoDB = catchAsync(async(req: Request, res:Response)=> {
    const {id} = req.params
    const payload = req.body
    
    const result = await OfferedCourseService.updateIntoDB(id, payload);
    sendResponse<OfferedCourse>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Offered course updated successfully",
        data: result
    })
})

const deleteFromDB = catchAsync(async(req: Request, res:Response)=> {
    const {id} = req.params;

    const result = await OfferedCourseService.deleteFromDB(id);
    sendResponse<OfferedCourse>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Offered course deleted successfully",
        data: result
    })
})

export const OfferedCourseController = {
    insertIntoDB,
    getAllFromDB,
    getDataById,
    deleteFromDB,
    updateIntoDB
}