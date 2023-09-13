import express,{Router} from 'express'
import authenticate from '../middleware/authMiddleware'
import {isDonorAndAreaRep} from '../middleware/authzMiddleware'
import verifyStipeSignature from '../middleware/webhookMiddleware'
import controllers from '../controllers'

const router = express.Router()
router.get('/mode', [authenticate], controllers.paymentController.getPaymentMode)
router.get('/donor/:id',[authenticate],controllers.paymentController.getSinglePayment)
router.get('/donor', [authenticate],controllers.paymentController.getAllPayment)
router.post('/stipe-payment-link', [authenticate, isDonorAndAreaRep], controllers.paymentController.getPaymentLink)
router.post('/verify', [authenticate,isDonorAndAreaRep], controllers.paymentController.verifyPaymentAndUpdateStatus)
router.post('/webhook', controllers.paymentController.webhookHandler)

export default router
