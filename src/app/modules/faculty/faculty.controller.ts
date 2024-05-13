import { Faculty } from "@prisma/client";
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { FacultyService } from "./faculty.service";
import pick from "../../../shared/pick";
import { facultyFilterableFields } from "./faculty.constant";

const insertIntoDB = catchAsync(async(req: Request, res:Response)=> {
    const result = await FacultyService.insertIntoDB(req.body);

    sendResponse<Faculty>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Faculty created successfully",
        data: result
    })
})

const getAllFromDB = catchAsync(async(req: Request, res:Response)=> {

    const options = pick(req.query, ['sortBy', 'sortOrder', 'limit', 'page']);
    const filters = pick(req.query, facultyFilterableFields);

    const result = await FacultyService.getAllFromDB(options, filters);

    sendResponse<Faculty[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "All faculties fetched successfully",
        meta: result.meta,
        data: result.data
    })

})

export const FacultyController = {
    insertIntoDB,
    getAllFromDB
}