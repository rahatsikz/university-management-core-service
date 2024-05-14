import expess from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { RoomController } from './room.controller';
import { RoomValidation } from './room.validation';

const router = expess.Router();

router.post("/",
auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
validateRequest(RoomValidation.createRoom),
RoomController.insertIntoDB)

export const RoomRoutes = router;