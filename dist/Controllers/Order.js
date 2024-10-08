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
exports.orderController = void 0;
const Order_1 = require("../models/Order");
const Product_1 = require("../models/Product");
const User_1 = require("../models/User");
class OrderController {
    fetchOrdersByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.user;
            try {
                const orders = yield Order_1.Order.find({ user: id });
                res.status(200).json(orders);
            }
            catch (err) {
                res.status(400).json(err);
            }
        });
    }
    createOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = new Order_1.Order(req.body);
            for (let item of order.items) {
                let product = yield Product_1.Product.findOne({ _id: item.product.id });
                if (!product) {
                    res.status(400).json({ message: "Product not found" });
                    return;
                }
                product.$inc('stock', -1 * item.quantity);
                if (product.stock < 0) {
                    res.status(400).json({ message: "Stock is less than required" });
                    return;
                }
                yield product.save();
            }
            try {
                const doc = yield order.save();
                const user = yield User_1.User.findById(order.user);
                if (user) {
                    // sendMail({to: user.email, html: invoiceTemplate(order), subject: 'Order Received'});
                }
                res.status(201).json(doc);
            }
            catch (err) {
                res.status(400).json(err);
            }
        });
    }
    deleteOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const order = yield Order_1.Order.findByIdAndDelete(id);
                if (!order) {
                    res.status(404).json({ message: "Order not found" });
                    return;
                }
                res.status(200).json(order);
            }
            catch (err) {
                res.status(400).json(err);
            }
        });
    }
    updateOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const order = yield Order_1.Order.findByIdAndUpdate(id, req.body, {
                    new: true,
                });
                if (!order) {
                    res.status(404).json({ message: "Order not found" });
                    return;
                }
                res.status(200).json(order);
            }
            catch (err) {
                res.status(400).json(err);
            }
        });
    }
    fetchAllOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = Order_1.Order.find({ deleted: { $ne: true } });
            let totalOrdersQuery = Order_1.Order.find({ deleted: { $ne: true } });
            // if (req.query._sort && req.query._order) {
            //   query = query.sort({ [req.query._sort as string]: req.query._order });
            // }
            if (typeof req.query._sort === 'string' && typeof req.query._order === 'string') {
                query = query.sort({ [req.query._sort]: req.query._order === 'asc' ? 1 : -1 });
            }
            const totalDocs = yield totalOrdersQuery.countDocuments().exec();
            if (req.query._page && req.query._limit) {
                const pageSize = Number(req.query._limit);
                const page = Number(req.query._page);
                query = query.skip(pageSize * (page - 1)).limit(pageSize);
            }
            try {
                const docs = yield query.exec();
                res.set('X-Total-Count', totalDocs.toString());
                res.status(200).json(docs);
            }
            catch (err) {
                res.status(400).json(err);
            }
        });
    }
}
exports.orderController = new OrderController();
