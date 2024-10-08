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
exports.userController = void 0;
const User_1 = require("../models/User");
class UserController {
    fetchUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.user;
            console.log(id);
            try {
                const user = yield User_1.User.findById(id);
                if (!user) {
                    res.status(404).json({ message: 'User not found' });
                    return;
                }
                res.status(200).json({
                    name: user.name,
                    id: user.id,
                    addresses: user.addresses,
                    email: user.email,
                    role: user.role,
                    profilePicture: user.profilePicture
                });
            }
            catch (err) {
                res.status(400).json(err);
            }
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const user = yield User_1.User.findByIdAndUpdate(id, req.body, { new: true });
                if (!user) {
                    res.status(404).json({ message: 'User not found' });
                    return;
                }
                res.status(200).json(user);
            }
            catch (err) {
                res.status(400).json(err);
            }
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const user = yield User_1.User.findByIdAndDelete(id);
                if (!user) {
                    res.status(404).json({ message: 'User not found' });
                    return;
                }
                res.status(200).json({ message: 'User deleted successfully' });
            }
            catch (err) {
                res.status(400).json(err);
            }
        });
    }
}
exports.userController = new UserController();
