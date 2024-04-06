import { AcademicSemester, PrismaClient } from "@prisma/client";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IAcademicSemesterFilterOptions } from "./academicSemester.interface";


const prisma = new PrismaClient();

const insertIntoDB = async (academicSemesterData:AcademicSemester):Promise<AcademicSemester> => {
    return await prisma.academicSemester.create({
        data: academicSemesterData
    })
}

const getAllFromDB = async(filters:IAcademicSemesterFilterOptions, options: IPaginationOptions):Promise<IGenericResponse<AcademicSemester[]>> =>{
    const {page,limit,skip} = paginationHelpers.calculatePagination(options);
    const result = await prisma.academicSemester.findMany({
            skip, 
            take: limit
        
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

export const AcademicSemesterService = {
    insertIntoDB, 
    getAllFromDB
}