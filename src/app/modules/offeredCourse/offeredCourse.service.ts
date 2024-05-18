import { OfferedCourse, Prisma } from "@prisma/client";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import prisma from "../../../shared/prisma";
import { asyncForEach } from "../../../shared/utils";
import { offeredCourseRelationalFields, offeredCourseRelationalFieldsMapper, offeredCourseSearchableFields } from "./offeredCourse.constant";
import { ICreateOfferedCourse, IOfferedCourseFilterOptions } from "./offeredCourse.interface";

const insertIntoDB = async(data: ICreateOfferedCourse):Promise<OfferedCourse[]> => {
    const {academicDepartmentId, semesterRegistrationId, courseIds} = data;
    
    const result:OfferedCourse[] = []
    
    await asyncForEach(courseIds, async(courseId:string)=> {

        const alreadyExists = await prisma.offeredCourse.findFirst({
            where: {
                academicDepartmentId,
                semesterRegistrationId,
                courseId
            }
        })

        if (!alreadyExists) {
            const insertOfferedCoure = await prisma.offeredCourse.create({
                data: {
                    academicDepartmentId,
                    semesterRegistrationId,
                    courseId
                },
                include: {
                    academicDepartment: true,
                    semesterRegistration: true,
                    course: true
                }
            })
    
            result.push(insertOfferedCoure)
        }
    })

    return result
 
}

const getAllFromDB = async(options: IPaginationOptions, filters:IOfferedCourseFilterOptions)
:Promise<IGenericResponse<OfferedCourse[]>> => {
    const {page,limit,skip} = paginationHelpers.calculatePagination(options);

    const {searchTerm, ...filterData} = filters;

    const andConditions = [];

    if (searchTerm) {
        andConditions.push({
            OR: offeredCourseSearchableFields.map((field) => ({
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

            if (offeredCourseRelationalFields.includes(key)) {
                return {
                    [offeredCourseRelationalFieldsMapper[key]]: {
                        id: (filterData as any)[key]
                    }
                }
            } else {
                return {
                    [key]: {
                        equals: (filterData as any)[key]
                    }
                }
            }
            
           })
        })
        
    }

    const whereConditions:Prisma.OfferedCourseWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.offeredCourse.findMany({
        where: whereConditions,
        include: {
            academicDepartment: true,
            semesterRegistration: true,
            course: true
        },
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {[options.sortBy]: options.sortOrder}: {createdAt: 'desc'}
    });

    const total = await prisma.offeredCourse.count({
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

const getDataById = async(id: string):Promise<OfferedCourse | null> => {
    const result = await prisma.offeredCourse.findUnique({
        where: {
            id
        },
        include: {
            academicDepartment: true,
            semesterRegistration: true,
            course: true
        }
    })
    return result
}

const updateIntoDB = async(id: string, payload: Partial<OfferedCourse>):Promise<OfferedCourse> => {
    const result = await prisma.offeredCourse.update({
        where: {
            id
        },
        data: payload,
        include: {
            academicDepartment: true,
            semesterRegistration: true,
            course: true
        }
    })
    return result
}

const deleteFromDB = async(id: string):Promise<OfferedCourse> => {
    const result = await prisma.offeredCourse.delete({
        where: {
            id
        },
        include: {
            academicDepartment: true,
            semesterRegistration: true,
            course: true
        }
    })
    return result
}

export const OfferedCourseService = {
    insertIntoDB,
    getAllFromDB,
    getDataById,
    deleteFromDB,
    updateIntoDB
}