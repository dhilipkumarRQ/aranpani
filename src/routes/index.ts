import express ,{Router, Request, Response} from "express";
import userAuthRoute from './authRoutes';
import donorRoute from './donorRoutes'
import adminRoute from './adminRoutes'



const router: Router = express.Router();

router.use('/auth/user', userAuthRoute)
router.use('/donor', donorRoute)
router.use('/admin', adminRoute)


export default router



