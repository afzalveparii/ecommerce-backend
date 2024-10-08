"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const User_1 = require("../Controllers/User");
const router = express_1.default.Router();
exports.router = router;
// /users is already added in base path
router.get('/own', User_1.userController.fetchUserById)
    .patch('/:id', User_1.userController.updateUser)
    .delete('/:id', User_1.userController.deleteUser);
