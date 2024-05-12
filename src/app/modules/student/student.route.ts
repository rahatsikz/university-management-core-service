import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { StudentController } from './student.controller';
import { StudentValidation } from './student.validation';

const router = express.Router();

router.post("/",validateRequest(StudentValidation.createStudents), StudentController.insertIntoDB);

export const StudentRoutes = router;