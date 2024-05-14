import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import prisma from "../../../shared/prisma";
import { ICourseCreateData } from "./course.interface";

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
            for (let index = 0; index < prerequisiteCourses.length; index++) {
               const createPrerequisite = await transactionClient.courseToPrerequisite.create({
                   data: {
                    courseId: result.id,
                    prerequisiteId: prerequisiteCourses[index].courseId
                   }
               })
               console.log(createPrerequisite);
               
            }
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

export const CourseService = {
    insertIntoDB   
}