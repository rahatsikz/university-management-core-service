import { z } from "zod";

const createFaculty = z.object({
    body: z.object({
       facultyId: z.string({
           required_error: "Faculty id is required",
       }),
       firstName: z.string({
           required_error: "First name is required",
       }),
       lastName: z.string({
           required_error: "Last name is required",
       }),
       middleName: z.string({
           required_error: "Middle name is required",
       }),
       profileImage: z.string({
           required_error: "Profile image is required",
       }),
       email: z.string({
           required_error: "Email is required",
       }),
       contactNo: z.string({
           required_error: "Contact no is required",
       }),
       gender: z.string({
           required_error: "Gender is required",
       }),
       bloodGroup: z.string({
           required_error: "Blood group is required",
       }),
       designation: z.string({
           required_error: "Designation is required",
       }),
       academicFacultyId: z.string({
           required_error: "Academic faculty id is required",
       }),
       academicDepartmentId: z.string({
           required_error: "Academic department id is required",
       })

    })
})

const updateFaculty = z.object({
    body: z.object({
        facultyId: z.string().optional(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        middleName: z.string().optional(),
        profileImage: z.string().optional(),
        email: z.string().optional(),
        contactNo: z.string().optional(),
        gender: z.string().optional(),
        bloodGroup: z.string().optional(),
        designation: z.string().optional(),
        academicFacultyId: z.string().optional(),
        academicDepartmentId: z.string().optional()
    })
})

const assignOrRemoveCourses = z.object({
    body: z.object({
        courses: z.array(z.string(),{
            required_error: "Courses are required",
        })
    })
})

export const FacultyValidation = {
    createFaculty,
    updateFaculty,
    assignOrRemoveCourses
}

/* 
facultyId    String
  firstName    String
  lastName     String
  middleName   String
  profileImage String
  email        String
  contactNo    String
  gender       String
  bloodGroup   String
  designation  String
  academicFacultyId
  academicDepartmentId

*/