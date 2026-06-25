const express = require("express");

const router = express.Router();

const {
    getCitizens,
    createCitizen,
} = require("../controllers/citizenController");

router.get("/", getCitizens);
router.post("/", createCitizen);

module.exports = router;