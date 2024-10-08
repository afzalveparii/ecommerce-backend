"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const Brand_1 = require("../Controllers/Brand");
const router = express_1.default.Router();
exports.router = router;
//  /brands is already added in base path
router.get('/', Brand_1.brandController.fetchBrands).post('/', Brand_1.brandController.createBrand);
