import express from 'express';
import { SemesterRegistrationController } from './semesterRegistration.controller';

const router = express.Router();

router.get("/", SemesterRegistrationController.getAllFromDB);
router.get("/:id", SemesterRegistrationController.getDataByID);

router.post("/", SemesterRegistrationController.insertIntoDB);

router.delete("/:id", SemesterRegistrationController.deleteFromDB);

export const SemesterRegistrationRoutes = router