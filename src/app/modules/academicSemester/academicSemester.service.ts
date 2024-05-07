import { AcademicSemester, Prisma } from "@prisma/client";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import prisma from "../../../shared/prisma";
import { academicSemesterSearchableFields } from "./academicSemester.constant";
import { IAcademicSemesterFilterOptions } from "./academicSemester.interface";




const insertIntoDB = async (academicSemesterData:AcademicSemester):Promise<AcademicSemester> => {
    return await prisma.academicSemester.create({
        data: academicSemesterData
    })
}

const getAllFromDB = async(filters:IAcademicSemesterFilterOptions, options: IPaginationOptions):Promise<IGenericResponse<AcademicSemester[]>> =>{
    const {page,limit,skip} = paginationHelpers.calculatePagination(options);
    // console.log(filters);
    // console.log(options);
    

    const {searchTerm, ...filterData} = filters;
    const andConditions = [];

    if (searchTerm) {
        andConditions.push({
            OR: academicSemesterSearchableFields.map((field) => ({
                [field] : {
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            }))
        })
    }

    // console.log(Object.keys(filterData));

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
           AND:  Object.keys(filterData).map((key)=> ({
            [key]: {
                equals: (filterData as any)[key]
            }
           }))
        })
    }

    const whereConditions: Prisma.AcademicSemesterWhereInput = andConditions.length > 0? { AND: andConditions }: {};
    
    const result = await prisma.academicSemester.findMany({
        where: whereConditions,
        skip, 
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? { [options.sortBy]: options.sortOrder } : { createdAt: 'desc' }
        
        
    });

    const total = await prisma.academicSemester.count();

    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result
    }
}

const getDataById = async(id:string):Promise<AcademicSemester | null> => {
    const result = await prisma.academicSemester.findUnique({
        where: {
            id: id
        }
    });
    return result
}

export const AcademicSemesterService = {
    insertIntoDB, 
    getAllFromDB,
    getDataById
}