import { Building } from "@prisma/client";
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { buildingFilterableFields } from "./building.constant";
import { BuildingService } from "./building.service";

const insertIntoDB = catchAsync(async(req: Request, res:Response)=> {
    const result = await BuildingService.insertIntoDB(req.body);

    sendResponse<Building>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Building created successfully",
        data: result
    })
});

const getAllFromDB = catchAsync(async(req: Request, res:Response)=> {
    
    const options = pick(req.query, ['sortBy', 'sortOrder', 'limit', 'page']);
    const filters = pick(req.query, buildingFilterableFields);

    const result = await BuildingService.getAllFromDB(options, filters);

    sendResponse<Building[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Buildings fetched successfully",
        meta: result.meta,
        data: result.data
    })
})

export const BuildingController = {
    insertIntoDB,
    getAllFromDB
}