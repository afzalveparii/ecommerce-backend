"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const Cart_1 = require("../Controllers/Cart");
const router = express_1.default.Router();
exports.router = router;
//  /products is already added in base path
router.post('/', Cart_1.cartController.addToCart)
    .get('/', Cart_1.cartController.fetchCartByUser)
    .delete('/:id', Cart_1.cartController.deleteFromCart)
    .patch('/:id', Cart_1.cartController.updateCart);
