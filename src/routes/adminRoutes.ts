import express , {Router} from "express";
import adminController from "../controllers/adminController";




const router: Router = express.Router();

router.post('/', adminController.createAdmin)

export default router



