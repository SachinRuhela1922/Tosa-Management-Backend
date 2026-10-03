const express = require("express");
const auth = require("../middleware/contributeAuth");
const { createContribution, getMyContributions } = require("../controller/Contributecontroller");

const router = express.Router();

router.post("/", auth, createContribution);
router.get("/me", auth, getMyContributions);

module.exports = router;