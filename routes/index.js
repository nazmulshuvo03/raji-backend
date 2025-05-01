const { Router } = require("express");

const router = Router();

router.route("/").get((_req, res) => {
  res.json({
    message: "Hello from Raji Backend",
  });
});

module.exports = router;
