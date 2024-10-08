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
exports.productController = void 0;
const Product_1 = require("../models/Product");
class ProductController {
    createProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // this product we have to get from API body
            const product = new Product_1.Product(req.body);
            product.discountPrice = Math.round(product.price * (1 - product.discountPercentage / 100));
            try {
                const doc = yield product.save();
                res.status(201).json(doc);
            }
            catch (err) {
                res.status(400).json(err);
            }
        });
    }
    // async createProduct(req: Request, res: Response): Promise<void> {
    //   try {
    //     const productData = req.body;
    //     // Handle uploaded images
    //     if (req.files && Array.isArray(req.files)) {
    //       productData.images = (req.files as Express.Multer.File[]).map(file => `/uploads/productImages/${file.filename}`);
    //     } else if (!productData.images) {
    //       productData.images = []; 
    //     }
    //     const product = new Product(productData);
    //     // Calculate discountPrice
    //     product.discountPrice = Math.round(product.price * (1 - product.discountPercentage / 100));
    //     const doc: IProduct = await product.save();
    //     res.status(201).json(doc);
    //   } catch (err) {
    //     console.error('Error creating product:', err);
    //     res.status(400).json(err);
    //   }
    // }
    fetchAllProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // filter = {"category":["smartphone","laptops"]}
            // sort = {_sort:"price",_order="desc"}
            // pagination = {_page:1,_limit=10}
            let condition = {};
            if (!req.query.admin) {
                condition.deleted = { $ne: true };
            }
            let query = Product_1.Product.find(condition);
            let totalProductsQuery = Product_1.Product.find(condition);
            // console.log(req.query.category);
            if (req.query.category) {
                query = query.find({ category: { $in: req.query.category.split(',') } });
                totalProductsQuery = totalProductsQuery.find({
                    category: { $in: req.query.category.split(',') },
                });
            }
            if (req.query.brand) {
                query = query.find({ brand: { $in: req.query.brand.split(',') } });
                totalProductsQuery = totalProductsQuery.find({ brand: { $in: req.query.brand.split(',') } });
            }
            // if (req.query._sort && req.query._order) {
            //   query = query.sort({ [req.query._sort as string]: req.query._order });
            // }
            if (typeof req.query._sort === 'string' && typeof req.query._order === 'string') {
                query = query.sort({ [req.query._sort]: req.query._order === 'asc' ? 1 : -1 });
            }
            const totalDocs = yield totalProductsQuery.countDocuments().exec();
            // console.log({ totalDocs });
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
    fetchProductById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const product = yield Product_1.Product.findById(id);
                if (!product) {
                    res.status(404).json({ message: 'Product not found' });
                    return;
                }
                res.status(200).json(product);
            }
            catch (err) {
                res.status(400).json(err);
            }
        });
    }
    updateProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const product = yield Product_1.Product.findByIdAndUpdate(id, req.body, { new: true });
                if (!product) {
                    res.status(404).json({ message: 'Product not found' });
                    return;
                }
                product.discountPrice = Math.round(product.price * (1 - product.discountPercentage / 100));
                const updatedProduct = yield product.save();
                res.status(200).json(updatedProduct);
            }
            catch (err) {
                res.status(400).json(err);
            }
        });
    }
    deleteProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const product = yield Product_1.Product.findByIdAndDelete(id);
                if (!product) {
                    res.status(404).json({ message: 'Product not found' });
                    return;
                }
                res.status(200).json({ message: 'Product deleted successfully' });
            }
            catch (err) {
                res.status(400).json(err);
            }
        });
    }
}
exports.productController = new ProductController();
