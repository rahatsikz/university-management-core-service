import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicDepartmentController } from './academicDepartment.controller';
import { AcademicDepartmentValidation } from './academicDepartment.validation';
const router = express.Router()

router.get("/", AcademicDepartmentController.getAllFromDb);
router.get("/:id", AcademicDepartmentController.getDataById);

router.post("/",
auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
validateRequest(AcademicDepartmentValidation.createAcademicDepartment),
AcademicDepartmentController.insertIntoDb);

router.patch("/:id",
auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
validateRequest(AcademicDepartmentValidation.updateAcademicDepartment),
AcademicDepartmentController.updateIntoDB);

router.delete("/:id",
auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
AcademicDepartmentController.deleteFromDB);

export const AcademicDepartmentRoutes = router;