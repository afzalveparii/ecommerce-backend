"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const Auth_1 = require("../Controllers/Auth");
const passport_1 = __importDefault(require("passport"));
const storageConfig_1 = require("../multerconfig/storageConfig");
const router = express_1.default.Router();
exports.router = router;
//  /auth is already added in base path
router.post('/signup', storageConfig_1.uploadProfilePicture, Auth_1.authController.createUser)
    .post('/login', passport_1.default.authenticate('local'), Auth_1.authController.loginUser)
    .get('/check', passport_1.default.authenticate('jwt'), Auth_1.authController.checkAuth)
    .get('/logout', Auth_1.authController.logout)
    .post('/reset-password-request', Auth_1.authController.resetPasswordRequest)
    .post('/reset-password', Auth_1.authController.resetPassword);
