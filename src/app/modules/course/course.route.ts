import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CourseController } from './course.controller';
import { CourseValidation } from './course.validation';

const router = express.Router();

router.get("/", CourseController.getAllFromDB);
router.get("/:id", CourseController.getDataByID);

router.post("/",
auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
validateRequest(CourseValidation.createCourse),
CourseController.insertIntoDB);

router.patch("/:id",
auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
validateRequest(CourseValidation.updateCourse),
CourseController.updateIntoDB);

router.delete("/:id",
auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
CourseController.deleteFromDB);

router.post("/:id/assign-faculties", CourseController.assignFaculties)
router.delete("/:id/remove-faculties", CourseController.removeFaculties)


export const CourseRoutes = router;