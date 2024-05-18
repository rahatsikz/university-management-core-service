import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { OfferedCourseController } from './offeredCourse.controller';
import { OfferedCourseValidation } from './offeredCourse.validation';

const router = express.Router();

router.get("/", OfferedCourseController.getAllFromDB);
router.get("/:id", OfferedCourseController.getDataById);

router.post("/", 
auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
validateRequest(OfferedCourseValidation.createOfferedCourse),
OfferedCourseController.insertIntoDB);

router.patch("/:id",
auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
validateRequest(OfferedCourseValidation.updateOfferedCourse),
OfferedCourseController.updateIntoDB);

router.delete("/:id",
auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
OfferedCourseController.deleteFromDB);

export const OfferedCourseRoutes = router