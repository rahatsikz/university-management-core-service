import { Prisma, SemesterRegistration, SemesterRegistrationStatus } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import prisma from "../../../shared/prisma";
import { semesterRegistrationRelationalFields, semesterRegistrationRelationalFieldsMapper, semesterRegistrationSearchableFields } from "./semesterRegistration.constant";
import { ISemesterRegistrationFilterOptions } from "./semesterRegistration.interface";

const insertIntoDB = async(semesterRegistrationData: SemesterRegistration):Promise<SemesterRegistration> => {
    
    const anySemesterUpcomingOrOngoing = await prisma.semesterRegistration.findFirst({
        where: {
            OR: [
                {
                    status: SemesterRegistrationStatus.UPCOMING
                },
                {
                    status: SemesterRegistrationStatus.ONGOING
                }
            ]
        }
    })

    if (anySemesterUpcomingOrOngoing) {
        throw new ApiError(httpStatus.BAD_REQUEST, `There is already an ${anySemesterUpcomingOrOngoing.status} semester registration`);
    }
    
    const result = await prisma.semesterRegistration.create({
        data: semesterRegistrationData,
        include: {
            academicSemester:true
        }
    });

    return result;
}

const getAllFromDB = async(options: IPaginationOptions, filters:ISemesterRegistrationFilterOptions):Promise<IGenericResponse<SemesterRegistration[]>> => {
    const {page,limit,skip} = paginationHelpers.calculatePagination(options);
    const {searchTerm,...filterData} = filters;

    const andConditions = [];

    if (searchTerm) {
        andConditions.push({
           OR: semesterRegistrationSearchableFields.map((field) => ({
               [field]: {
                   contains: searchTerm,
                   mode: 'insensitive'
               }
           })) 
        })
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => {
                if (semesterRegistrationRelationalFields.includes(key)) {
                    return {
                        [semesterRegistrationRelationalFieldsMapper[key]]: {
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

    const whereConditions: Prisma.SemesterRegistrationWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};


    const result = await prisma.semesterRegistration.findMany({
        skip,
        take: limit,
        where: whereConditions,
        orderBy: options.sortBy && options.sortOrder ? { [options.sortBy]: options.sortOrder } : { createdAt: 'desc' },
        include: {
            academicSemester:true
        }
        
    })

    const total = await prisma.semesterRegistration.count({
        where: whereConditions
    })

    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    }

}

const getDataByID = async(id: string):Promise<SemesterRegistration | null> => {
    const result = await prisma.semesterRegistration.findUnique({
        where: {
            id
        },
        include: {
            academicSemester: true
        }
    });

    return result
}

const updateOneInDB = async(id: string, payload: Partial<SemesterRegistration>):Promise<SemesterRegistration> => {

    const isExists = await prisma.semesterRegistration.findUnique({
        where: {
            id
        }
    })

    if (!isExists) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Semester Registration not found');
    }

    if (payload.status && isExists.status === SemesterRegistrationStatus.UPCOMING &&
        payload.status !== SemesterRegistrationStatus.ONGOING) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Can only move from upcoming to ongoing');
    }

    if (payload.status && isExists.status === SemesterRegistrationStatus.ONGOING &&
        payload.status !== SemesterRegistrationStatus.ENDED) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Can only move from ongoing to ended');
    }

    const result = await prisma.semesterRegistration.update({
        where: {
            id
        },
        data: payload,
        include: {
            academicSemester: true
        }
    })

    return result
}

const deleteFromDB = async(id: string):Promise<SemesterRegistration> => {
    const result = await prisma.semesterRegistration.delete({
        where: {
            id
        },
        include: {
            academicSemester: true
        }
    });
    return result
}

export const SemesterRegistrationService = {
    insertIntoDB,
    getAllFromDB,
    getDataByID,
    deleteFromDB,
    updateOneInDB
}