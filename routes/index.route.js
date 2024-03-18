const router = require("express").Router();

const authRouter = require("./auth.route");
const userRouter = require("./user.route");
const productRouter = require("./product.route");
const categoryRouter = require("./common.route");
const reviewRouter = require("./review.route");
const cartItemRouter = require("./cartItem.route");
const wishListItemRouter = require("./wishlistitem.route");
const orderRouter = require("./order.route");

router.use(authRouter);
router.use(productRouter);
router.use(categoryRouter);
router.use(orderRouter);
router.use(reviewRouter);
router.use(userRouter);
router.use(cartItemRouter);
router.use(wishListItemRouter);

module.exports = router;
