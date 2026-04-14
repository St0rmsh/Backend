import { Router } from "express";
import {createProduct} from "../controllers/product.controller.js";
import {validateCreateProduct} from "../validators/product.validate.js";
import {authSeller} from "../Middleware/auth.middleware.js";
import multer from "multer";
const router = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
});


router.post("/create",authSeller,upload.array("images",7),createProduct)

export default router;