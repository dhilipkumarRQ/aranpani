import express ,{Router, Request, Response} from "express";
import userAuthRoute from './authRoutes';
import donorRoute from './donorRoutes'
import adminRoute from './adminRoutes'
import groupRoute from './groupRoutes'
import projectRoute from './projectRoutes'
import subscriptionRoute from './subscriptionRoutes'
import paymentRoute from './paymentRoutes'
import imageRoute from './imageRoutes'



const router: Router = express.Router();

router.use('/auth/user', userAuthRoute)
router.use('/donor', donorRoute)
router.use('/admin', adminRoute)
router.use('/group', groupRoute)
router.use('/project', projectRoute)
router.use('/subscription', subscriptionRoute)
router.use('/payment', paymentRoute)
router.use('/upload-image', imageRoute)


export default router



