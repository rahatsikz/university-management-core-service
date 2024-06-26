import { Building, Prisma } from "@prisma/client";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import prisma from "../../../shared/prisma";
import { buildingSearchableFields } from "./building.constant";
import { IBuildingFilterOptions } from "./building.interface";

const insertIntoDB = async(buildingData: Building):Promise<Building> => {
    const result = await prisma.building.create({
        data: buildingData
    });
    return result;
}

const getAllFromDB = async(options: IPaginationOptions, filters: IBuildingFilterOptions)
: Promise<IGenericResponse<Building[]>> => {

    const {page,limit,skip} = paginationHelpers.calculatePagination(options);
    const {searchTerm} = filters;

    const andConditions = [];

    if (searchTerm) {
        andConditions.push({
            OR: buildingSearchableFields.map((field)=>({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            })) 
        })        
    }

    const whereConditions: Prisma.BuildingWhereInput = andConditions.length > 0 ? {AND: andConditions} : {};

    const result = await prisma.building.findMany({
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {[options.sortBy]: options.sortOrder}: {createdAt: 'desc'},
        where: whereConditions
    })

    const total = await prisma.building.count({
        where: whereConditions
    });

    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    }
}

const getDataByID = async(id: string):Promise<Building | null> => {
    const result = await prisma.building.findUnique({
        where: {
            id
        }
    })
    return result
}

const deleteFromDB = async(id: string):Promise<Building> => {
    const result = await prisma.building.delete({
        where: {
            id
        }
    })
    return result
}

const updateIntoDB = async(id: string, payload: Partial<Building>):Promise<Building> => {
    const result = await prisma.building.update({
        where: {
            id
        },
        data: payload
    })
    return result
}

export const BuildingService = {
    insertIntoDB,
    getAllFromDB,
    getDataByID,
    deleteFromDB,
    updateIntoDB
}