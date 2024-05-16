import { Course, Prisma } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import prisma from "../../../shared/prisma";
import { asyncForEach } from "../../../shared/utils";
import { courseSearchableFields } from "./course.constant";
import { ICourseCreateData, ICourseFilterOptions, IPrerequisiteCourse } from "./course.interface";

const insertIntoDB = async (data: ICourseCreateData): Promise<any> => {
    
    const {prerequisiteCourses, ...courseData} = data;

    // console.log("courseData", courseData);
    // console.log("prerequisiteCourses", prerequisiteCourses);
    

    const newCourse = await prisma.$transaction(async (transactionClient) => {
        const result = await transactionClient.course.create({
            data:courseData
        })
        if (!result) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Course not created');
        }
        if (prerequisiteCourses && prerequisiteCourses.length > 0) {
            await asyncForEach(
                prerequisiteCourses,
                async (prerequisiteCourse:IPrerequisiteCourse) => {
                    const createPrerequisite = await transactionClient.courseToPrerequisite.create({
                        data: {
                         courseId: result.id,
                         prerequisiteId: prerequisiteCourse.courseId
                        }
                    })
                    console.log(createPrerequisite);
                } 
            )
        }
        return result    
    })
    
    
    if (newCourse) {
        const responseData = await prisma.course.findUnique({
           where: {
            id: newCourse.id
           },
           include: {
               prerequisite: {
                include: {
                    prerequisite: true
                }
               },
               prerequisiteFor: {
                include: {
                    course: true
                }
               }
           } 
        })

        return responseData
    }    
    throw new ApiError(httpStatus.BAD_REQUEST, 'Course not created')
    
}

const getAllFromDB = async(options: IPaginationOptions, filters:ICourseFilterOptions): Promise<IGenericResponse<Course[]>> => {
    const {page,limit,skip} = paginationHelpers.calculatePagination(options);

    const {searchTerm, ...filterData} = filters;

    const andConditions = [];

    if (searchTerm) {
        andConditions.push({
            OR: courseSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            }))
        })
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: (filterData as any)[key]
                }
            }))
        })
    }

    const whereConditions:Prisma.CourseWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

    

    const result = await prisma.course.findMany({
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {[options.sortBy]: options.sortOrder}: {createdAt: 'desc'},
        where: whereConditions,
        include: {
            prerequisite: {
             include: {
                 prerequisite: true
             }
            },
            prerequisiteFor: {
             include: {
                 course: true,
                 
             }
            }
        } 
    })

    const total = await prisma.course.count({
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

const getDataByID = async(id: string):Promise<Course | null> => {
    const result = await prisma.course.findUnique({
        where: {
            id
        },
        include: {
            prerequisite: {
             include: {
                 prerequisite: true
             }
            },
            prerequisiteFor: {
             include: {
                 course: true,
                 
             }
            }
        } 
    });
    return result;
}

const updateIntoDB = async(id: string, data: ICourseCreateData):Promise<Course | null> => {
    const {prerequisiteCourses, ...courseData} = data;

    await prisma.$transaction(async (transactionClient) => {
        const result = await transactionClient.course.update({
            where: {
                id
            },
            data: courseData
        })
        
        if (!result) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Course not updated');
        }

        if (prerequisiteCourses && prerequisiteCourses.length > 0) {
            const deletePrerequisite = prerequisiteCourses.filter((coursePrequisite) => coursePrequisite.courseId && coursePrequisite.isDeleted)

            const newPrequisite = prerequisiteCourses.filter((coursePrequisite) => coursePrequisite.courseId && !coursePrequisite.isDeleted)

            

            await asyncForEach(
                deletePrerequisite,
                async(deletePreCourse: IPrerequisiteCourse) => {
                    await transactionClient.courseToPrerequisite.deleteMany({
                        where: {
                            AND: [
                                {
                                    courseId:id
                                },
                                {
                                    prerequisiteId: deletePreCourse.courseId
                                }
                            ]
                        }
                    })        
                }
            )

           

            await asyncForEach(
                newPrequisite,
                async (insertPrerequisite:IPrerequisiteCourse) => {
                    await transactionClient.courseToPrerequisite.create({
                        data: {
                         courseId: id,
                         prerequisiteId: insertPrerequisite.courseId
                        }
                    }) 
                }
            )

        }

        return result
    })

    const responseData = await prisma.course.findUnique({
        where: {
         id
        },
        include: {
            prerequisite: {
             include: {
                 prerequisite: true
             }
            },
            prerequisiteFor: {
             include: {
                 course: true
             }
            }
        } 
     })

     return responseData

    
    // return result
}

const deleteFromDB = async(id: string):Promise<Course> => {
    await prisma.courseToPrerequisite.deleteMany({
            where: {
                OR: [
                    {
                        courseId: id
                    },
                    {
                        prerequisiteId: id 
                    }
                ]
            }
    })
    
    const result = await prisma.course.delete({
        where: {
            id
        }
    })

    return result
}

export const CourseService = {
    insertIntoDB,
    getAllFromDB,
    getDataByID,
    deleteFromDB,
    updateIntoDB
       
}