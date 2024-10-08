"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const Order_1 = require("../Controllers/Order");
const router = express_1.default.Router();
exports.router = router;
//  /orders is already added in base path
router.post('/', Order_1.orderController.createOrder)
    .get('/own/', Order_1.orderController.fetchOrdersByUser)
    .delete('/:id', Order_1.orderController.deleteOrder)
    .patch('/:id', Order_1.orderController.updateOrder)
    .get('/', Order_1.orderController.fetchAllOrders);
