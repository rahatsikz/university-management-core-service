import { Student } from "@prisma/client";
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { studentFilterableFields } from "./student.constant";
import { StudentService } from "./student.service";

const insertIntoDB = catchAsync(async(req: Request, res:Response)=> {
    const result = await StudentService.insertIntoDB(req.body);
    sendResponse<Student>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Student created successfully",
        data: result  
    })

})

const getAllFromDB = catchAsync(async(req: Request, res:Response)=> {
    const options = pick(req.query, ['sortBy', 'sortOrder', 'limit', 'page']);
    const filters = pick(req.query, studentFilterableFields);
    
    const result = await StudentService.getAllFromDB(options, filters);
    sendResponse<Student[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Students retrieved successfully",
        meta: result.meta,
        data: result.data
    }) 
})

const getDataById = catchAsync(async(req: Request, res:Response)=> {
    const result = await StudentService.getDataById(req.params.id);
    sendResponse<Student>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Student retrieved successfully",
        data: result
    })
})

const updateIntoDB = catchAsync(async(req: Request, res:Response)=> {
    const {id} = req.params
    const payload = req.body
    
    const result = await StudentService.updateIntoDB(id, payload);
    sendResponse<Student>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Student updated successfully",
        data: result
    })
})

export const StudentController = {
    insertIntoDB,
    getAllFromDB,
    getDataById,
    updateIntoDB
}