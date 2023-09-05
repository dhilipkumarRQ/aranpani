import express, {Router} from 'express'
import authenticate from '../middleware/authMiddleware'
import {isSuperAdminAndAdmin, isDonorAndAreaRep} from '../middleware/authzMiddleware'
import controller from '../controllers'
import validators from '../validators'
import validate from '../middleware/validatorMiddleware'

const router:Router = express.Router()

router.post('/', [authenticate, validate(validators.projectValidator.createProject)], controller.projectController.addProject)
router.put('/:id', [authenticate], controller.projectController.updateProject)
router.get('/', controller.projectController.getAllProject) 
router.get('/:id', [authenticate], controller.projectController.getProject) 
router.put('/:id/change-status', [authenticate,isSuperAdminAndAdmin, validate(validators.projectValidator.status)], controller.projectController.changeProjectState)
router.delete('/:id/scrap', [authenticate, isSuperAdminAndAdmin], controller.projectController.deleteProject)
router.patch('/:id/restore', [authenticate, isSuperAdminAndAdmin], controller.projectController.restoreProject)
router.get('/:project_id/subscriber', [authenticate, isDonorAndAreaRep], controller.projectController.getAllSubscriber)

router.get('/:project_id/activity', [authenticate],controller.projectController.getAllActivity)
router.post('/:project_id/activity', [authenticate],controller.projectController.addActivity)
router.put('/:project_id/activity/:activity_id', [authenticate],controller.projectController.editActivity)

export default router