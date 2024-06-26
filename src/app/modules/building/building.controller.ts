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

const getDataByID = catchAsync(async(req: Request, res:Response)=> {
    const {id} = req.params;

    const result = await BuildingService.getDataByID(id);
    sendResponse<Building>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Building fetched successfully",
        data: result
    })
})

const deleteFromDB = catchAsync(async(req: Request, res:Response)=> {
    const {id} = req.params;

    const result = await BuildingService.deleteFromDB(id);
    sendResponse<Building>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Building deleted successfully",
        data: result
    })
})

const updateIntoDB = catchAsync(async(req: Request, res:Response)=> {
    const {id} = req.params
    const payload = req.body
    
    const result = await BuildingService.updateIntoDB(id, payload);
    sendResponse<Building>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Building updated successfully",
        data: result
    })
})

export const BuildingController = {
    insertIntoDB,
    getAllFromDB,
    getDataByID,
    deleteFromDB,
    updateIntoDB
}