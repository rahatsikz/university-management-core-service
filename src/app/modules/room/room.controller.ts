import { Room } from "@prisma/client";
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { roomFilterableFields } from "./room.constant";
import { RoomService } from "./room.service";

const insertIntoDB = catchAsync(async(req: Request, res:Response)=> {
    const result = await RoomService.insertIntoDB(req.body);

    sendResponse<Room>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Room created successfully",
        data: result
    })
})

const getAllFromDB = catchAsync(async(req: Request, res:Response)=> {
    
    const options = pick(req.query, ['sortBy', 'sortOrder', 'limit', 'page']);
    const filters = pick(req.query, roomFilterableFields);
    
    const result = await RoomService.getAllFromDB(options,filters);

    sendResponse<Room[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Rooms fetched successfully",
        meta: result.meta,
        data: result.data
    })
})

const getDataByID = catchAsync(async(req: Request, res:Response)=> {
    const {id} = req.params;

    const result = await RoomService.getDataByID(id);

    sendResponse<Room>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Room fetched successfully",
        data: result
    })
});

const updateIntoDB = catchAsync(async(req: Request, res:Response)=> {
    const {id} = req.params
    const payload = req.body
    
    const result = await RoomService.updateIntoDB(id, payload);
    sendResponse<Room>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Room updated successfully",
        data: result
    })
})

const deleteFromDB = catchAsync(async(req: Request, res:Response)=> {
    const {id} = req.params;

    const result = await RoomService.deleteFromDB(id);
    sendResponse<Room>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Room deleted successfully",
        data: result
    })
})

export const RoomController = {
    insertIntoDB,
    getAllFromDB,
    getDataByID,
    updateIntoDB,
    deleteFromDB
}