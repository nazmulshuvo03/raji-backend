const { Router } = require("express");
const authRoutes = require("./authRoutes");
const authenticate = require("../middleware/authenticate");
const groupRoutes = require("./groupRoutes");
const projectRoutes = require("./projectRoutes");

const router = Router();

router.use("/auth", authRoutes);
router.use(authenticate);
router.use("/group", groupRoutes);
router.use("/project", projectRoutes);

router.route("/").get((_req, res) => {
  res.json({
    message: "Hello from Raji Backend",
  });
});

module.exports = router;
