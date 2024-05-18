import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { OfferedCourseSectionController } from './offeredCourseSection.controller';
import { OfferedCourseSectionValidation } from './offeredCourseSection.validation';

const router = express.Router();

router.get("/", OfferedCourseSectionController.getAllFromDB)
router.get("/:id", OfferedCourseSectionController.getDataById)

router.post("/", 
auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
validateRequest(OfferedCourseSectionValidation.createOfferedCourseSection),
OfferedCourseSectionController.insertIntoDB)

router.patch("/:id", 
auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
validateRequest(OfferedCourseSectionValidation.updateOfferedCourseSection),
OfferedCourseSectionController.updateIntoDB)

router.delete("/:id", 
auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
OfferedCourseSectionController.deleteFromDB)

export const OfferedCourseSectionRoutes = router