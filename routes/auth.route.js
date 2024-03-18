const router = require("express").Router();
const { UserSchema } = require("../zod_validation/auth.zod.validation");
const {
  loginUser,
  createUser,
  verifyOTP,
  isAdmin,
  resendVerificationEmail
} = require("../controllers/auth/auth.controller");

const {
  sendPin,
  verifyPin,
  changePassword,
} = require("../controllers/auth/password.controller");
const {
  verifyToken,
  validationMiddleware,
} = require("../middleware/auth.middleware");

router.post("/login", loginUser);
router.post("/register", validationMiddleware(UserSchema), createUser);
router.post("/auth/verifyOtp", verifyOTP);
router.post("/auth/resendOTP", resendVerificationEmail);

router.post("/auth/forgetPassword", sendPin);
router.post("/auth/verifyPin", verifyPin);
router.post("/auth/changePassword", verifyToken, changePassword);

router.post("/auth/isEmailAdmin", isAdmin);

module.exports = router;
