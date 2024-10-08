"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const Product_1 = require("../Controllers/Product");
// import { uploadProductImages }  from '../multerconfig/storageConfig';
const router = express_1.default.Router();
exports.router = router;
// /products is already added in base path
router.post('/', Product_1.productController.createProduct)
    .get('/', Product_1.productController.fetchAllProducts)
    .get('/:id', Product_1.productController.fetchProductById)
    .patch('/:id', Product_1.productController.updateProduct)
    .delete('/:id', Product_1.productController.deleteProduct);
