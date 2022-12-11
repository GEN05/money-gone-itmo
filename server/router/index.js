const Router = require("express").Router;
const userController = require("../controllers/user-controller");
const router = new Router();
const { body } = require("express-validator");
const authMiddleware = require("../middlewares/auth-middleware");

router.post(
  "/registration",
  body("email").isEmail(),
  body("password").isLength({ min: 3, max: 32 }),
  body("firstName").isLength({ min: 1, max: 32 }),
  body("lastName").isLength({ min: 1, max: 32 }),
  userController.registration
);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/activate/:link", userController.activate);
router.post("/request-reset-password", userController.requestPasswordReset);
router.post("/reset-password", userController.resetPassword);
router.get("/refresh", userController.refresh);
router.post("/add-transaction", authMiddleware, userController.addTransaction);
router.post(
  "/delete-transaction",
  authMiddleware,
  userController.deleteTransaction
);
router.post(
  "/add-transaction-list",
  authMiddleware,
  userController.addTransactionsFromBank
);

module.exports = router;
