import express , {Router, Request, Response} from "express";
import donorAuthController from '../controllers/DonorAuthController';
import validator from "../middleware/ValidatorMiddleware";
import authenticate from "../middleware/AuthMiddleware";
import validators from "../validators/index";
import { isAdmin,isDonor,isAreaRep,isSuperAdmin } from "../middleware/authzMiddleware";


const router: Router = express.Router();

router.post('/login',validator(validators.donorValidator.loginSchema), donorAuthController.login)
router.post('/signup',validator(validators.donorValidator.signupSchema), donorAuthController.signup)
router.post('/forgot-password', donorAuthController.forgot_password)
router.post('/verify-otp', [authenticate], donorAuthController.verify_otp)
router.post('/reset-password',validator(validators.donorValidator.resetPasswordSchema),[authenticate], donorAuthController.reset_password)
router.post('/change-password',validator(validators.donorValidator.changePasswordSchema),[authenticate], donorAuthController.change_password)

export default router



