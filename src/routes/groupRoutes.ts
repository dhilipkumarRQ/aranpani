import express from 'express'
import groupController from '../controllers/groupController'
import authenticate from '../middleware/authMiddleware'
import validate from '../middleware/validatorMiddleware'
import validators from '../validators'

const router = express.Router()

router.post('/add-group-member',[authenticate, validate(validators.groupValidator.addGroup)], groupController.addGroupMember)
router.get('/donor/:id/group-member',[authenticate],groupController.getGroupMember)
router.get('/group-member/:id',[authenticate], groupController.getParticularGroupMember)
router.post('/group-member/:id/verify',[authenticate], groupController.verifyGroupMember)
router.put('/group-member/:id',[authenticate, validate(validators.groupValidator.addGroup)], groupController.editParticularGroupMember)
router.delete('/group-member/:id',[authenticate], groupController.deleteParticlarGroupMember)
router.post('/group-member/:id/promote-to-donor',[authenticate, validate(validators.donorValidator.createDonor)], groupController.promoteToDonor)
router.post('/group-member/:id/promote-to-head',[authenticate], groupController.promoteToHead)

export default router






