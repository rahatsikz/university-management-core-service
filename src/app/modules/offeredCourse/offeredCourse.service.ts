import { OfferedCourse } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { asyncForEach } from "../../../shared/utils";
import { ICreateOfferedCourse } from "./offeredCourse.interface";

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

export const OfferedCourseService = {
    insertIntoDB
}