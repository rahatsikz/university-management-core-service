import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { OfferedCourseClassScheduleController } from './offeredCourseClassSchedule.controller';
import { OfferedCourseClassScheduleValidation } from './offeredCourseClassSchedule.validation';

const router = express.Router();

router.get("/", OfferedCourseClassScheduleController.getAllFromDB)
router.get("/:id", OfferedCourseClassScheduleController.getDataByID)

router.post("/", 
auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
validateRequest(OfferedCourseClassScheduleValidation.create),
OfferedCourseClassScheduleController.insertIntoDB)

router.patch("/:id", 
auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
validateRequest(OfferedCourseClassScheduleValidation.update),
OfferedCourseClassScheduleController.updateIntoDB)

router.delete("/:id", 
auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
OfferedCourseClassScheduleController.deleteFromDB)

export const OfferedCourseClassScheduleRoutes = router