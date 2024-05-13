import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { StudentController } from './student.controller';
import { StudentValidation } from './student.validation';

const router = express.Router();

router.get("/", StudentController.getAllFromDB);
router.get("/:id", StudentController.getDataById);

router.post("/",
auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
validateRequest(StudentValidation.createStudents), 
StudentController.insertIntoDB);

router.patch("/:id",
auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
validateRequest(StudentValidation.updateStudent), StudentController.updateIntoDB);

router.delete("/:id",
auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
StudentController.deleteFromDB);


export const StudentRoutes = router;