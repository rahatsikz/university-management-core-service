import { AcademicSemester } from "@prisma/client";
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { academicSemesterFilterableFields } from "./academicSemester.constant";
import { AcademicSemesterService } from "./academicSemester.service";


const insertIntoDB = catchAsync(async(req: Request, res:Response)=> {
    const result = await AcademicSemesterService.insertIntoDB(req.body)
    sendResponse<AcademicSemester>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Academic semester created successfully",
        data: result
    })
}) 

const getAllFromDB = catchAsync(async(req: Request, res:Response)=> {
    // console.log(req.query);

    const filters = pick(req.query, academicSemesterFilterableFields);
    const options = pick(req.query,['page', 'limit', 'sortBy', 'sortOrder']);

    // console.log("filters", filters);
    // console.log("options", options);
    
    
    
    const result = await AcademicSemesterService.getAllFromDB(filters, options)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Academic semester fetched successfully",
        meta: result.meta,
        data: result.data
    })
})

const getDataById = catchAsync(async(req: Request, res:Response)=> {
    const result = await AcademicSemesterService.getDataById(req.params.id)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Academic semester fetched",
        data: result
    })

})



export const AcademicSemesterController = {
    insertIntoDB,
    getAllFromDB,
    getDataById
}