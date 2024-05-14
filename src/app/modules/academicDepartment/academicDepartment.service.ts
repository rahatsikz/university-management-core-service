import { AcademicDepartment, Prisma } from "@prisma/client";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import prisma from "../../../shared/prisma";
import { academicDepartmentRelationalFieldMapper, academicDepartmentRelationalFields, academicDepartmentSearchableFields } from "./academicDepartment.constant";
import { IAcademicDepartmentFilter } from "./academicDepartment.interface";

const insertIntoDb = async(academicDepartmentData: AcademicDepartment):Promise<AcademicDepartment> => {
    const result = await prisma.academicDepartment.create({
        data: academicDepartmentData,
        include: {
            academicFaculty: true
        }
    });
    return result;
}

const getAllFromDb = async(options: IPaginationOptions, filters:IAcademicDepartmentFilter):Promise<IGenericResponse<AcademicDepartment[]>> => {
    // console.log(options);
    // console.log(filters);

    const {page, limit, skip} = paginationHelpers.calculatePagination(options);

    const {searchTerm, ...filtersData} = filters

    const andConditions = [];

    if (searchTerm) {
        andConditions.push({
            OR: academicDepartmentSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            }))
        })
    }

    if (Object.keys(filtersData).length > 0) {
        andConditions.push({
            AND: Object.keys(filtersData).map((key)=> {

                if (academicDepartmentRelationalFields.includes(key)) {
                   return {
                    [academicDepartmentRelationalFieldMapper[key]]: {
                        id: (filtersData as any)[key]
                    }
                   } 
                }

                else {
                    return {
                        [key]: {
                            equals: (filtersData as any)[key]
                        }
                    }
                }

                
            })    
        })
    }
    
    const whereConditions : Prisma.AcademicDepartmentWhereInput = andConditions.length > 0 ? {AND: andConditions} : {};
    
    const result = await prisma.academicDepartment.findMany({
        include: {
            academicFaculty: true
        },
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {[options.sortBy]: options.sortOrder} : {createdAt: 'desc'}
    });
    const total = await prisma.academicDepartment.count();
    return {
        meta: {
            page,
            limit,
            total,
            
        },
        data: result
    }
}

const getDataById = async(id: string):Promise<AcademicDepartment | null> => {
    const result = await prisma.academicDepartment.findUnique({
        where: {
            id
        },
        include: {
            academicFaculty: true
        }
    })
    return result
}

const updateIntoDB = async(id: string, payload: Partial<AcademicDepartment>):Promise<AcademicDepartment> => {
    const result = await prisma.academicDepartment.update({
        where: {
            id
        },
        data: payload,
        include: {
            academicFaculty: true
        }
    })
    return result
}

const deleteFromDB = async(id: string):Promise<AcademicDepartment> => {
    const result = await prisma.academicDepartment.delete({
        where: {
            id
        },
        include: {
            academicFaculty: true
        }
    });

    return result;
}

export const AcademicDepartmentService = {
    insertIntoDb,
    getAllFromDb,
    getDataById,
    updateIntoDB,
    deleteFromDB
}