const mongoose = require("mongoose");

const citizenSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true,
    },

    cnic: {
        type: String,
        required: true,
        unique: true,
    },

    email: {
        type: String,
        required: true,
    }
},
{
    timestamps: true,
}
);

module.exports = mongoose.model("Citizen", citizenSchema);