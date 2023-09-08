import express,{Router} from 'express'

const router:Router = express.Router()

import donorController from '../controllers/donorController'
import authenticate from '../middleware/authMiddleware'
import {isDonorAndAreaRep, isAdmin, isDonor, isSuperAdminAndAdmin, isSuperAdmin} from '../middleware/authzMiddleware'
import validate from "../middleware/validatorMiddleware";
import validators from '../validators';


router.post('/',[authenticate, isSuperAdmin, validate(validators.donorValidator.createDonor)], donorController.createDonor)
router.get('/',[authenticate], donorController.getDonor)
router.get('/:id',[authenticate], donorController.getSingleDonor)
router.put('/:id',[authenticate], donorController.updateSingleDonor)
router.delete('/:id/deactivate',[authenticate, isSuperAdmin], donorController.decativateDonorAccount)
router.get('/:id/area-rep',[authenticate], donorController.getAreaRep)
router.post('/complete-profile',[authenticate, isDonorAndAreaRep, validate(validators.donorValidator.updateProfile)], donorController.completeDonorProfile)
router.patch('/pin-location',[authenticate, isDonorAndAreaRep, validate(validators.donorValidator.updatePinCode)], donorController.updateLocation)
router.patch('/language',[authenticate, isDonorAndAreaRep, validate(validators.donorValidator.updateLanguage)], donorController.updateLanguage)
router.patch('/attach-payment-plan', [authenticate, isDonorAndAreaRep], donorController.attachPlan)
router.patch('/:id/arearep', [authenticate], donorController.assignAreaRep)
router.patch('/:id/promote-to-rep', [authenticate], donorController.promoteToAreaRep)
export default router