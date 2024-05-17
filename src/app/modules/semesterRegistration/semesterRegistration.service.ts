import { SemesterRegistration, SemesterRegistrationStatus } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import prisma from "../../../shared/prisma";

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

export const SemesterRegistrationService = {
    insertIntoDB
}