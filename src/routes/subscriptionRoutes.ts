import express, {Router} from 'express'
import controllers from '../controllers'
const router:Router = express.Router()

import authenticate from '../middleware/authMiddleware'
import {isDonorAndAreaRep} from '../middleware/authzMiddleware'

router.post('/:project_id',[authenticate,isDonorAndAreaRep], controllers.subscriptionController.subscribe)
router.delete('/:project_id/un-subscribe',[authenticate,isDonorAndAreaRep], controllers.subscriptionController.unsubscribe)
export default router