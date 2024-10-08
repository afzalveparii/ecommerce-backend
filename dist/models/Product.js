"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
// we can't sort using the virtual fields. better to make this field at time of doc creation
// const virtualDiscountPrice =  productSchema.virtual('discountPrice');
// virtualDiscountPrice.get(function(){
//     return Math.round(this.price*(1-this.discountPercentage/100));
// })
const mongoose_1 = __importStar(require("mongoose"));
const productSchema = new mongoose_1.Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, min: [1, 'Price must be at least 1'], max: [200000, 'Price must not exceed 200000'] },
    discountPercentage: { type: Number, min: [0, 'Discount percentage must be at least 0'], max: [80, 'Discount percentage must not exceed 80'] },
    rating: { type: Number, min: [0, 'wrong min rating'], max: [5, 'wrong max price'], default: 0 },
    stock: { type: Number, min: [0, 'wrong min stock'], default: 0 },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    thumbnail: { type: String, required: true },
    images: { type: [String], required: true },
    colors: { type: [mongoose_1.Schema.Types.Mixed] },
    sizes: { type: [mongoose_1.Schema.Types.Mixed] },
    highlights: { type: [String] },
    discountPrice: { type: Number },
    deleted: { type: Boolean, default: false },
});
productSchema.virtual('id').get(function () {
    return this._id;
});
productSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    },
});
exports.Product = mongoose_1.default.model('Product', productSchema);
