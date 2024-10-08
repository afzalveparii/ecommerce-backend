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
exports.brandController = void 0;
const Brand_1 = require("../models/Brand");
class BrandController {
    fetchBrands(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const brands = yield Brand_1.Brand.find({}).exec();
                res.status(200).json(brands);
            }
            catch (err) {
                res.status(400).json(err);
            }
        });
    }
    createBrand(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const brand = new Brand_1.Brand(req.body);
            try {
                const doc = yield brand.save();
                res.status(201).json(doc);
            }
            catch (err) {
                res.status(400).json(err);
            }
        });
    }
}
exports.brandController = new BrandController();
