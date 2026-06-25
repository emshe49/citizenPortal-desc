require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const citizenRoutes = require("./routes/citizenRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Citizen Portal API Running...");
});

app.use("/api/citizens", citizenRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});