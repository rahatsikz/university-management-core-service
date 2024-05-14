import { AcademicDepartment } from "@prisma/client";
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { academicDepartmentFilterableFields } from "./academicDepartment.constant";
import { AcademicDepartmentService } from "./academicDepartment.service";

const insertIntoDb = catchAsync(async(req: Request, res:Response)=> {
    const result = await AcademicDepartmentService.insertIntoDb(req.body)
    sendResponse<AcademicDepartment>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Academic department created successfully",
        data: result
    })
})

const getAllFromDb = catchAsync(async(req: Request, res:Response)=> {

    const options = pick(req.query, ['sortBy', 'sortOrder', 'limit', 'page']);
    const filters = pick(req.query, academicDepartmentFilterableFields);

    // console.log(options);
    // console.log(filters);

    const result = await AcademicDepartmentService.getAllFromDb(options, filters);
    sendResponse<AcademicDepartment[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Academic departments retrieved successfully",
        meta: result.meta,
        data: result.data
    })
})

const getDataById = catchAsync(async(req: Request, res:Response)=> {
    const result = await AcademicDepartmentService.getDataById(req.params.id);
    sendResponse<AcademicDepartment>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Single Academic department fetched",
        data: result
    })
})

const updateIntoDB = catchAsync(async(req: Request, res:Response)=> {
    const {id} = req.params
    const payload = req.body
    
    const result = await AcademicDepartmentService.updateIntoDB(id, payload);
    sendResponse<AcademicDepartment>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Academic department updated successfully",
        data: result
    })
})

const deleteFromDB = catchAsync(async(req: Request, res:Response)=> {
    const {id} = req.params;
    
    const result = await AcademicDepartmentService.deleteFromDB(id);
    sendResponse<AcademicDepartment>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Academic department deleted successfully",
        data: result
    })
})

export const AcademicDepartmentController = {
    insertIntoDb,
    getAllFromDb,
    getDataById,
    updateIntoDB,
    deleteFromDB
}