const express = require("express");
const {
  addOperator,
  getOperators,
  getOperatorById,
  getCommutors,
  getCommutersById,
  updateOperator,
  updateCommuter,
  deleteOperator,
  deleteCommuter,
} = require("../controllers/usercontroller");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/addoperator", protect(["admin"]), addOperator);
router.get("/operators", protect(["admin"]), getOperators);
router.get("/operator/:id", protect(["admin"]), getOperatorById);
router.get("/commuters", protect(["admin"]), getCommutors);
router.get("/commuter/:id", protect(["admin"]), getCommutersById);
router.put("/operator/:id", protect(["admin"]), updateOperator);
router.put("/commuter/:id", protect(["admin", "commutor"]), updateCommuter);
router.delete("/operator/:id", protect(["admin"]), deleteOperator);
router.delete("/commuter/:id", protect(["admin"]), deleteCommuter);

module.exports = router;
