import { Faculty } from "@prisma/client";
import prisma from "../../../shared/prisma";

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

export const FacultyService = {
    insertIntoDB
}