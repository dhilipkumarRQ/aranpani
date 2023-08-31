import express ,{Router, Request, Response} from "express";
import donorRoute from './authRoutes';



const router: Router = express.Router();

router.use('/auth/donor', donorRoute)


export default router



