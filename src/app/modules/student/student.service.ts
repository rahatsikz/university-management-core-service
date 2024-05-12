import { Student } from "@prisma/client";
import prisma from "../../../shared/prisma";

const insertIntoDB = async(studentdata: Student): Promise<Student> => {
    const result = await prisma.student.create({
        data:studentdata,
        include: {
            academicFaculty: true,
            academicDepartment: true,
            academicSemester: true
        }
    });
    return result;
}

export const StudentService = {
    insertIntoDB
}