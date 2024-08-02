import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { SemesterRegistrationController } from './semesterRegistration.controller';
import { SemesterRegistrationValidation } from './semesterRegistration.validation';

const router = express.Router();

router.get(
  '/get-my-registration',
  auth(ENUM_USER_ROLE.STUDENT),
  SemesterRegistrationController.getMyRegistration
);

router.get('/', SemesterRegistrationController.getAllFromDB);
router.get(
  '/get-my-semester-courses',
  auth(ENUM_USER_ROLE.STUDENT),
  SemesterRegistrationController.getMySemesterRegCourses
);
router.get('/:id', SemesterRegistrationController.getDataByID);

router.post(
  '/start-registration',
  auth(ENUM_USER_ROLE.STUDENT),
  SemesterRegistrationController.startMyRegistration
);

router.post(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(SemesterRegistrationValidation.createSemesterRegistration),
  SemesterRegistrationController.insertIntoDB
);

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(SemesterRegistrationValidation.updateSemesterRegistration),
  SemesterRegistrationController.updateOneInDB
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  SemesterRegistrationController.deleteFromDB
);

router.post(
  '/enroll-into-course',
  auth(ENUM_USER_ROLE.STUDENT),
  validateRequest(SemesterRegistrationValidation.enrollOrWithdrawFromCourse),
  SemesterRegistrationController.enrollIntoCourse
);
router.post(
  '/withdraw-from-course',
  auth(ENUM_USER_ROLE.STUDENT),
  validateRequest(SemesterRegistrationValidation.enrollOrWithdrawFromCourse),
  SemesterRegistrationController.withdrawFromCourse
);

router.post(
  '/confirm-my-registration',
  auth(ENUM_USER_ROLE.STUDENT),
  SemesterRegistrationController.confirmMyRegistration
);
router.post(
  '/:id/start-new-semester',
  auth(ENUM_USER_ROLE.ADMIN),
  SemesterRegistrationController.startNewSemester
);

export const SemesterRegistrationRoutes = router;
