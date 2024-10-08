"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartController = void 0;
const Cart_1 = require("../models/Cart");
class CartController {
    fetchCartByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.user;
            try {
                const cartItems = yield Cart_1.Cart.find({ user: id }).populate('product');
                res.status(200).json(cartItems);
            }
            catch (err) {
                res.status(400).json(err);
            }
        });
    }
    addToCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.user;
            const cart = new Cart_1.Cart(Object.assign(Object.assign({}, req.body), { user: id }));
            try {
                const doc = yield cart.save();
                const result = yield doc.populate('product');
                // if (result.quantity > result.product.stock) {
                //   res.status(400).json({ message: "Stock is less than required" });
                //   return;
                // }
                res.status(201).json(result);
            }
            catch (err) {
                res.status(400).json(err);
            }
        });
    }
    deleteFromCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                yield Cart_1.Cart.findByIdAndDelete(id);
                res.status(200).json({ message: 'Item removed from cart' });
            }
            catch (err) {
                res.status(400).json(err);
            }
        });
    }
    updateCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const cart = yield Cart_1.Cart.findByIdAndUpdate(id, req.body, {
                    new: true,
                });
                if (!cart) {
                    res.status(404).json({ message: 'Cart item not found' });
                    return;
                }
                const result = yield cart.populate('product');
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json(err);
            }
        });
    }
}
exports.cartController = new CartController();
