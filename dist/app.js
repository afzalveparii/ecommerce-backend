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
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const passport_jwt_1 = require("passport-jwt");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const conn_1 = __importDefault(require("./db/conn"));
const Products_1 = require("./Routes/Products");
const Categories_1 = require("./Routes/Categories");
const Brands_1 = require("./Routes/Brands");
const Users_1 = require("./Routes/Users");
const Auth_1 = require("./Routes/Auth");
const Cart_1 = require("./Routes/Cart");
const Order_1 = require("./Routes/Order");
const User_1 = require("./models/User");
const common_1 = require("./services/common");
const Order_2 = require("./models/Order");
const stripe_1 = __importDefault(require("stripe"));
const http_proxy_middleware_1 = require("http-proxy-middleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
const stripe = new stripe_1.default(process.env.STRIPE_API_KEY, { apiVersion: '2022-11-15' });
// Webhook
const endpointSecret = process.env.ENDPOINT_SECRET;
app.post('/webhook', express_1.default.raw({ type: 'application/json' }), (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const sig = request.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    }
    catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }
    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntentSucceeded = event.data.object;
            const order = yield Order_2.Order.findById(paymentIntentSucceeded.metadata.orderId);
            if (order) {
                order.paymentStatus = 'received';
                yield order.save();
            }
            break;
        // ... handle other event types
        default:
        // console.log(`Unhandled event type ${event.type}`);
    }
    // Return a 200 response to acknowledge receipt of the event
    response.send();
}));
// Increase the limit to 10MB (adjust as needed)
app.use(body_parser_1.default.json({ limit: '10mb' }));
app.use(body_parser_1.default.urlencoded({ limit: '10mb', extended: true }));
// JWT options
const opts = {
    jwtFromRequest: common_1.commonService.cookieExtractor,
    secretOrKey: process.env.JWT_SECRET_KEY
};
// Middlewares
app.use(express_1.default.static(path_1.default.resolve(__dirname, 'build')));
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport_1.default.authenticate('session'));
app.use((0, cors_1.default)({
    exposedHeaders: ['X-Total-Count'],
    origin: ['http://localhost:3000', 'http://localhost:5173', 'https://ecommerce-project-developed-by-afzal.netlify.app', 'https://stapi.co'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express_1.default.json());
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, 'public', 'uploads', 'userProfilePics')));
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, 'public', 'uploads', 'productImages')));
app.use('/products', common_1.commonService.isAuth, Products_1.router);
app.use('/categories', common_1.commonService.isAuth, Categories_1.router);
app.use('/brands', common_1.commonService.isAuth, Brands_1.router);
app.use('/users', common_1.commonService.isAuth, Users_1.router);
app.use('/auth', Auth_1.router);
app.use('/cart', common_1.commonService.isAuth, Cart_1.router);
app.use('/orders', common_1.commonService.isAuth, Order_1.router);
app.get('*', (req, res) => res.sendFile(path_1.default.join(__dirname, 'build', 'index.html')));
// Proxy middleware for frontend development
const isDevelopment = process.env.NODE_ENV === 'development';
if (isDevelopment) {
    app.use('/', (0, http_proxy_middleware_1.createProxyMiddleware)({
        target: 'http://localhost:3000', // Assuming your frontend runs on port 3000
        changeOrigin: true,
        ws: true, // Enable WebSocket proxying
        pathRewrite: (path) => {
            // Don't proxy API routes
            if (path.startsWith('/products') ||
                path.startsWith('/categories') ||
                path.startsWith('/brands') ||
                path.startsWith('/users') ||
                path.startsWith('/auth') ||
                path.startsWith('/cart') ||
                path.startsWith('/orders')) {
                return path;
            }
            // Proxy all other routes to the frontend
            return path;
        },
    }));
}
// Passport Strategies
passport_1.default.use('local', new passport_local_1.Strategy({ usernameField: 'email' }, function (email, password, done) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield User_1.User.findOne({ email: email });
            if (!user) {
                return done(null, false, { message: 'invalid credentials' });
            }
            crypto_1.default.pbkdf2(password, user.salt, 310000, 32, 'sha256', function (err, hashedPassword) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (!crypto_1.default.timingSafeEqual(user.password, hashedPassword)) {
                        return done(null, false, { message: 'invalid credentials' });
                    }
                    const token = jsonwebtoken_1.default.sign(common_1.commonService.sanitizeUser(user), process.env.JWT_SECRET_KEY);
                    done(null, { id: user.id, role: user.role, token });
                });
            });
        }
        catch (err) {
            done(err);
        }
    });
}));
passport_1.default.use('jwt', new passport_jwt_1.Strategy(opts, function (jwt_payload, done) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield User_1.User.findById(jwt_payload.id);
            if (user) {
                return done(null, common_1.commonService.sanitizeUser(user));
            }
            else {
                return done(null, false);
            }
        }
        catch (err) {
            return done(err, false);
        }
    });
}));
passport_1.default.serializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, { id: user.id, role: user.role });
    });
});
passport_1.default.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});
// Payments
app.post('/create-payment-intent', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { totalAmount, orderId } = req.body;
    const paymentIntent = yield stripe.paymentIntents.create({
        amount: totalAmount * 100,
        currency: 'inr',
        automatic_payment_methods: {
            enabled: true,
        },
        metadata: {
            orderId,
        },
    });
    res.send({
        clientSecret: paymentIntent.client_secret,
    });
}));
conn_1.default.once('open', () => {
    console.log("🚀 DaaBase Connected");
});
conn_1.default.on('error', (err) => {
    console.log("❌ DataBase Connection Error:", err);
    process.exit(1);
});
app.listen(process.env.PORT, () => {
    console.log(`server is listening on Port ${process.env.PORT}`);
});
