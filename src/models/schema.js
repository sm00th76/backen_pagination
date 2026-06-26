const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        category: {
            type: String,
            required: true,
            trim: true,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Index for cursor pagination
productSchema.index({
    updatedAt: -1,
    _id: -1,
});

// Index for category filter + pagination
productSchema.index({
    category: 1,
    updatedAt: -1,
    _id: -1,
});

module.exports = mongoose.model("Product", productSchema);