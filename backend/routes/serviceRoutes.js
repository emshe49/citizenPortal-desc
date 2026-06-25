// backend/routes/serviceRoutes.js
const express = require("express");
const router = express.Router();

const {
    getServices,
    getServicesByCategory,
    createService,
    updateService,
    deleteService,
} = require("../controllers/serviceController");

router.get("/", getServices);
router.get("/category/:category", getServicesByCategory);
router.post("/", createService);
router.put("/:id", updateService);
router.delete("/:id", deleteService);

module.exports = router;