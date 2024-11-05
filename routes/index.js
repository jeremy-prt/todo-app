var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/:id", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.put("/:id", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.delete("/:id", function (req, res, next) {
  res.render("index", { title: "Express" });
});

module.exports = router;
