import express from 'express';
import { FacultyController } from './faculty.controller';
import validateRequest from '../../middlewares/validateRequest';
import { FacultyValidation } from './faculty.validation';

const router = express.Router();

router.post("/", validateRequest(FacultyValidation.createFaculty), FacultyController.insertIntoDB);

export const FacultyRoutes = router;