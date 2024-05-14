import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicSemesterController } from './academicSemester.controller';
import { AcademicSemesterValidation } from './academicSemester.validation';

const router = express.Router();
router.get("/", AcademicSemesterController.getAllFromDB)
router.get("/:id", AcademicSemesterController.getDataById)

router.post("/",
auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), 
validateRequest(AcademicSemesterValidation.CreateAcademicSemester), 
AcademicSemesterController.insertIntoDB);

router.patch("/:id",
auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
validateRequest(AcademicSemesterValidation.updateAcademicSemester),
AcademicSemesterController.updateIntoDB);

router.delete("/:id",
auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
AcademicSemesterController.deleteFromDB);

export const AcademicSemesterRoutes = router