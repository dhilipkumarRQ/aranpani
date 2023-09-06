import express, {Router}from 'express'

import authenticate from '../middleware/authMiddleware'
import controllers from '../controllers'

const router = express.Router()
router.post('/project/:id',authenticate, controllers.imageController.uploadImage.single("file"), controllers.imageController.uploadImageToS3)
export default router