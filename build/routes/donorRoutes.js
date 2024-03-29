"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const donorController_1 = __importDefault(require("../controllers/donorController"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const authzMiddleware_1 = require("../middleware/authzMiddleware");
const validatorMiddleware_1 = __importDefault(require("../middleware/validatorMiddleware"));
const validators_1 = __importDefault(require("../validators"));
router.post('/', [authMiddleware_1.default, authzMiddleware_1.isSuperAdmin, (0, validatorMiddleware_1.default)(validators_1.default.donorValidator.createDonor)], donorController_1.default.createDonor);
router.get('/', [authMiddleware_1.default], donorController_1.default.getDonor);
router.get('/:id', [authMiddleware_1.default], donorController_1.default.getSingleDonor);
router.put('/:id', [authMiddleware_1.default], donorController_1.default.updateSingleDonor);
router.delete('/:id/deactivate', [authMiddleware_1.default, authzMiddleware_1.isSuperAdmin], donorController_1.default.decativateDonorAccount);
router.get('/:id/area-rep', [authMiddleware_1.default], donorController_1.default.getAreaRep);
router.post('/complete-profile', [authMiddleware_1.default, authzMiddleware_1.isDonorAndAreaRep, (0, validatorMiddleware_1.default)(validators_1.default.donorValidator.updateProfile)], donorController_1.default.completeDonorProfile);
router.patch('/pin-location', [authMiddleware_1.default, authzMiddleware_1.isDonorAndAreaRep, (0, validatorMiddleware_1.default)(validators_1.default.donorValidator.updatePinCode)], donorController_1.default.updateLocation);
router.patch('/language', [authMiddleware_1.default, authzMiddleware_1.isDonorAndAreaRep, (0, validatorMiddleware_1.default)(validators_1.default.donorValidator.updateLanguage)], donorController_1.default.updateLanguage);
router.patch('/attach-payment-plan', [authMiddleware_1.default, authzMiddleware_1.isDonorAndAreaRep], donorController_1.default.attachPlan);
router.patch('/:id/arearep', [authMiddleware_1.default], donorController_1.default.assignAreaRep);
router.patch('/:id/promote-to-rep', [authMiddleware_1.default], donorController_1.default.promoteToAreaRep);
exports.default = router;
