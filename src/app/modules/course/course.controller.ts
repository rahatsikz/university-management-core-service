import { Course, CourseFaculty } from "@prisma/client";
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { courseFilterableFields } from "./course.constant";
import { CourseService } from "./course.service";

const insertIntoDB = catchAsync(async(req: Request, res:Response)=> {
    const result = await CourseService.insertIntoDB(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Course created successfully",
        data: result
    })
})

const getAllFromDB = catchAsync(async(req: Request, res:Response)=> {
    
    const options = pick(req.query, ['sortBy', 'sortOrder', 'limit', 'page']);
    const filters = pick(req.query, courseFilterableFields);

    const result = await CourseService.getAllFromDB(options,filters);
    sendResponse<Course[]>(res,{
            statusCode: httpStatus.OK,
            success: true,
            message: "Courses fetched successfully",
            meta: result.meta,
            data: result.data
        }
    )
})

const getDataByID = catchAsync(async(req: Request, res:Response)=> {
    const result = await CourseService.getDataByID(req.params.id);
    
    sendResponse<Course>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Course fetched successfully",
        data: result
    })
})

const updateIntoDB = catchAsync(async(req: Request, res:Response)=> {
    const {id} = req.params
    const payload = req.body
    
    const result = await CourseService.updateIntoDB(id, payload);
    sendResponse<Course>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Course updated successfully",
        data: result
    })
})

const deleteFromDB = catchAsync(async(req: Request, res:Response)=> {
    const {id} = req.params;

    const result = await CourseService.deleteFromDB(id);
    sendResponse<Course>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Course deleted successfully",
        data: result
    })
})

const assignFaculties = catchAsync(async(req: Request, res:Response)=> {
    const {id} = req.params
    const payload = req.body.faculties
    const result = await CourseService.assignFaculties(id, payload);
    sendResponse<CourseFaculty[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Course faculties added successfully",
        data: result
    })
})

const removeFaculties = catchAsync(async(req: Request, res:Response)=> {
    const {id} = req.params
    const payload = req.body.faculties
    const result = await CourseService.removeFaculties(id, payload);
    sendResponse<CourseFaculty[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Course faculty removed successfully",
        data: result
    })
})

export const CourseController = {
    insertIntoDB,
    getAllFromDB,
    getDataByID,
    deleteFromDB,
    updateIntoDB,
    assignFaculties,
    removeFaculties
}