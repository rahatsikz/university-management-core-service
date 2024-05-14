import { Faculty, Prisma } from "@prisma/client";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import prisma from "../../../shared/prisma";
import { facultyRelationalFields, facultyRelationalFieldsMapper, facultySearchableFields } from "./faculty.constant";
import { IFacultyFilterOptions } from "./faculty.interface";

const insertIntoDB = async(facultyData: Faculty):Promise<Faculty> => {
    const result = await prisma.faculty.create({
        data: facultyData,
        include: {
            academicFaculty:true,
            academicDepartment:true
        }
    });

    return result;
}

const getAllFromDB = async(options: IPaginationOptions, filters: IFacultyFilterOptions):Promise<IGenericResponse<Faculty[]>> => {
    
    const {page,limit,skip} = paginationHelpers.calculatePagination(options);
    const {searchTerm, ...filterData}= filters;
    // console.log(filters);

    const andConditions = [];

    if (searchTerm) {
        andConditions.push({
            OR: facultySearchableFields.map((field) => ({
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
                if (facultyRelationalFields.includes(key)) {
                    return {
                        [facultyRelationalFieldsMapper[key]]: {
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

    const whereConditions:Prisma.FacultyWhereInput = andConditions.length > 0 ? { AND: andConditions } : {}; 
    
    
    const result = await prisma.faculty.findMany({
        where: whereConditions,
        include: {
            academicFaculty:true,
            academicDepartment:true
        },
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {[options.sortBy]: options.sortOrder}: {createdAt: 'desc'}
    });
    
    const total = await prisma.faculty.count();

    return {
        meta:{
            total,
            page,
            limit
        },
        data: result
    }
    
}

const getDataByID = async(id: string):Promise<Faculty | null> => {
    const result = await prisma.faculty.findUnique({
        where: {
            id
        },
        include: {
            academicFaculty:true,
            academicDepartment:true
        }
    });
    return result
}

const updateIntoDB = async(id: string, payload: Partial<Faculty>):Promise<Faculty> => {
    const result = await prisma.faculty.update({
        where: {
            id
        },
        data: payload,
        include: {
            academicFaculty:true,
            academicDepartment:true
        }
    });
    return result
}

const deleteFromDB = async(id: string):Promise<Faculty> => {
    const result = await prisma.faculty.delete({
        where: {
            id
        },
        include: {
            academicFaculty:true,
            academicDepartment:true
        }
    });
    return result
}

export const FacultyService = {
    insertIntoDB,
    getAllFromDB,
    getDataByID,
    updateIntoDB,
    deleteFromDB
}