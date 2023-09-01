import express , {Router, Request, Response} from "express";
import userAuthController from '../controllers/userAuthController';
import validator from "../middleware/validatorMiddleware";
import authenticate from "../middleware/authMiddleware";
import {isDonorAndAreaRep, isAdmin} from '../middleware/authzMiddleware'
import validators from "../validators";



const router: Router = express.Router();

router.post('/login',validator(validators.authValidator.loginSchema), userAuthController.login)
router.post('/signup',validator(validators.authValidator.signupSchema), userAuthController.signup)
router.post('/forgot-password', userAuthController.forgot_password)
router.post('/verify-otp', [authenticate], userAuthController.verify_otp)
router.post('/reset-password',[authenticate, isDonorAndAreaRep],validator(validators.authValidator.resetPasswordSchema), userAuthController.reset_password)
router.post('/change-password',[authenticate],validator(validators.authValidator.changePasswordSchema), userAuthController.change_password)

export default router



