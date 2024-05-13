import { Faculty } from "@prisma/client";
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { FacultyService } from "./faculty.service";

const insertIntoDB = catchAsync(async(req: Request, res:Response)=> {
    const result = await FacultyService.insertIntoDB(req.body);

    sendResponse<Faculty>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Faculty created successfully",
        data: result
    })
})

export const FacultyController = {
    insertIntoDB
}