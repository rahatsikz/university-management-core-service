import { Prisma, Room } from "@prisma/client";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import prisma from "../../../shared/prisma";
import { roomRelationalFields, roomRelationalFieldsMapper, roomSearchableFields } from "./room.constant";
import { IRoomFilterOptions } from "./room.interface";

const insertIntoDB = async (roomData: Room): Promise<Room> => {
    const result = await prisma.room.create({
        data: roomData,
        include: {
            building: true
        }
    });
    return result;
}

const getAllFromDB = async (options: IPaginationOptions, filters: IRoomFilterOptions): Promise<IGenericResponse<Room[]>> => {

    const { page, limit, skip } = paginationHelpers.calculatePagination(options);

    const {searchTerm, ...filterData} = filters;

    const andConditions = [];

    if (searchTerm) {
        andConditions.push({
            OR: roomSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            }))
        })
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
           AND: Object.keys(filterData).map((key)=> {
            if (roomRelationalFields.includes(key)) {
               return {
                   [roomRelationalFieldsMapper[key]]: {
                       id: (filterData as any)[key]
                   }
               } 
            }
            else {
                return {
                    [key]: {
                        equals: (filterData as any)[key]
                    }
                }
            }
           }) 
        })
    }

    const whereConditions:Prisma.RoomWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.room.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {[options.sortBy]: options.sortOrder}: {createdAt: 'desc'},
        include: {
            building: true
        }
    })

    const total = await prisma.room.count({where: whereConditions});

    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    }



}

export const RoomService = {
    insertIntoDB,
    getAllFromDB
}