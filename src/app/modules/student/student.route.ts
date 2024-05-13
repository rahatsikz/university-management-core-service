import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { StudentController } from './student.controller';
import { StudentValidation } from './student.validation';

const router = express.Router();

router.get("/", StudentController.getAllFromDB);
router.get("/:id", StudentController.getDataById);
router.post("/",validateRequest(StudentValidation.createStudents), StudentController.insertIntoDB);
router.patch("/:id", validateRequest(StudentValidation.updateStudent), StudentController.updateIntoDB);


export const StudentRoutes = router;