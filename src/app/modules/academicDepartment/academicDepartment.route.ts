import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicDepartmentController } from './academicDepartment.controller';
import { AcademicDepartmentValidation } from './academicDepartment.validation';
const router = express.Router()

router.get("/", AcademicDepartmentController.getAllFromDb);
router.get("/:id", AcademicDepartmentController.getDataById);
router.post("/", validateRequest(AcademicDepartmentValidation.createAcademicDepartment), AcademicDepartmentController.insertIntoDb);

export const AcademicDepartmentRoutes = router;