import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { FacultyController } from './faculty.controller';
import { FacultyValidation } from './faculty.validation';

const router = express.Router();

router.get("/", FacultyController.getAllFromDB);
router.get("/:id", FacultyController.getDataByID);
router.post("/", validateRequest(FacultyValidation.createFaculty), FacultyController.insertIntoDB);

export const FacultyRoutes = router;