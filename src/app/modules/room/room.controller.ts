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

export const RoomController = {
    insertIntoDB,
    getAllFromDB
}