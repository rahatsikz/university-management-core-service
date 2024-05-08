import { AcademicFaculty } from "@prisma/client";
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { academicFacultyFilterableFields } from "./academicFaculty.constant";
import { AcademicFacultyService } from "./academicFaculty.service";

const insertIntoDB = catchAsync(async(req: Request, res:Response)=> {
    const result = await AcademicFacultyService.insertIntoDB(req.body);
    sendResponse<AcademicFaculty>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Academic faculty created successfully",
        data: result
    })
})

const getAllFromDB = catchAsync(async(req: Request, res:Response)=> {

    const options = pick(req.query, ['sortBy', 'sortOrder', 'limit', 'page']);
    const filters = pick(req.query, academicFacultyFilterableFields);

    // console.log(options);
    // console.log(filters);

    const result = await AcademicFacultyService.getAllFromDB(options, filters);
    sendResponse<AcademicFaculty[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Academic faculty fetched successfully",
        meta: result.meta,
        data: result.data
    })
})

const getDataById = catchAsync(async(req: Request, res:Response)=> {
    const result = await AcademicFacultyService.getDataById(req.params.id);
    sendResponse<AcademicFaculty>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Single Academic faculty fetched",
        data: result
    })
})

export const AcademicFacultyController = {
    insertIntoDB,
    getAllFromDB,
    getDataById
}