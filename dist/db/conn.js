"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const DB = process.env.DATABASE || "";
mongoose_1.default.set('strictQuery', false);
const connection = mongoose_1.default.connect(DB);
exports.default = mongoose_1.default.connection;
