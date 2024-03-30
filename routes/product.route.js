const router = require("express").Router();

const {
  addProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage,
  addProductImage,
} = require("../controllers/products/product.mutation.controller");

const {
  verifyToken,
  verifyAdmin,
  emailVerified,
} = require("../middleware/auth.middleware");


router
  .route("/product")
  .post(
    verifyToken,
    emailVerified,
    verifyAdmin,
    addProduct,
  )

  router
  .route("/product/:id")
  .put(verifyToken, emailVerified, verifyAdmin, updateProduct)
  .delete(verifyToken, emailVerified, verifyAdmin, deleteProduct);

  router.delete(
    "/product/image/:id",
    verifyToken,
    emailVerified,
    verifyAdmin,
    deleteProductImage,
  );

  router.put(
    "/product/image/add",
    verifyToken,
    emailVerified,
    verifyAdmin,
    addProductImage,
  );
  
module.exports = router;
