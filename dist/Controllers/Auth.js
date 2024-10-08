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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const common_1 = require("../services/common");
class AuthController {
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const salt = crypto_1.default.randomBytes(16);
                crypto_1.default.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', (err, hashedPassword) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        res.status(400).json(err);
                        return;
                    }
                    // Handle profile picture
                    let profilePicture = '';
                    if (req.file) {
                        profilePicture = req.file.filename;
                        // console.log('Profile picture filename:', profilePicture);
                    }
                    const user = new User_1.User(Object.assign(Object.assign({}, req.body), { password: hashedPassword, salt, profilePicture }));
                    const doc = yield user.save();
                    req.login(common_1.commonService.sanitizeUser(doc), (err) => {
                        if (err) {
                            res.status(400).json(err);
                        }
                        else {
                            const token = jsonwebtoken_1.default.sign(common_1.commonService.sanitizeUser(doc), process.env.JWT_SECRET_KEY);
                            res
                                .cookie('jwt', token, {
                                expires: new Date(Date.now() + 3600000),
                                httpOnly: true,
                            })
                                .status(201)
                                .json({ id: doc.id, role: doc.role, profilePicture: profilePicture });
                        }
                    });
                }));
            }
            catch (err) {
                res.status(400).json(err);
            }
        });
    }
    loginUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            res
                .cookie('jwt', user.token, {
                expires: new Date(Date.now() + 3600000),
                httpOnly: true,
            })
                .status(201)
                .json({ id: user.id, role: user.role });
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res
                .cookie('jwt', null, {
                expires: new Date(Date.now()),
                httpOnly: true,
            })
                .sendStatus(200);
        });
    }
    checkAuth(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.user) {
                res.json(req.user);
            }
            else {
                res.sendStatus(401);
            }
        });
    }
    resetPasswordRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = req.body.email;
            const user = yield User_1.User.findOne({ email: email });
            if (user) {
                const token = crypto_1.default.randomBytes(48).toString('hex');
                user.resetPasswordToken = token;
                yield user.save();
                const resetPageLink = 'http://localhost:3000/reset-password?token=' + token + '&email=' + email;
                const subject = 'reset password for e-commerce';
                const html = `<p>Click <a href='${resetPageLink}'>here</a> to Reset Password</p>`;
                if (email) {
                    const response = yield common_1.commonService.sendMail({ to: email, subject, html });
                    res.json(response);
                }
                else {
                    res.sendStatus(400);
                }
            }
            else {
                res.sendStatus(400);
            }
        });
    }
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password, token } = req.body;
            const user = yield User_1.User.findOne({ email: email, resetPasswordToken: token });
            if (user) {
                const salt = crypto_1.default.randomBytes(16);
                crypto_1.default.pbkdf2(password, salt, 310000, 32, 'sha256', (err, hashedPassword) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        res.status(400).json(err);
                        return;
                    }
                    user.password = hashedPassword;
                    user.salt = salt;
                    yield user.save();
                    const subject = 'password successfully reset for e-commerce';
                    const html = `<p>Successfully able to Reset Password</p>`;
                    if (email) {
                        const response = yield common_1.commonService.sendMail({ to: email, subject, html });
                        res.json(response);
                    }
                    else {
                        res.sendStatus(400);
                    }
                }));
            }
            else {
                res.sendStatus(400);
            }
        });
    }
}
exports.authController = new AuthController();
