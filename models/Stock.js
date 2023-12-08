const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
    stock: String,
    likes: { type: Number, default: 0 },
    ips: [String],
});

module.exports = mongoose.model("Stock", stockSchema);
