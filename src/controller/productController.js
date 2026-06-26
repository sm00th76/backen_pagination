const mongoose = require("mongoose");
const Product = require("../models/schema");

const getProducts = async (req, res) => {
    try {
        let { limit = 50, category, cursorUpdatedAt, cursorId, snapshotTime } = req.query;

        // sanitize limit
        limit = parseInt(limit);
        if (isNaN(limit) || limit <= 0 || limit > 100) limit = 20;

        // validate cursorId
        if (cursorId && !mongoose.Types.ObjectId.isValid(cursorId))
            return res.status(400).json({ success: false, message: "Invalid cursorId" });

        // snapshot locks the result set so pages don't shift
        snapshotTime = snapshotTime ? new Date(snapshotTime) : new Date();

        // base filter: respect snapshot + optional category
        const filter = { updatedAt: { $lte: snapshotTime } };
        if (category) filter.category = category;

        // cursor filter: pick up from where last page left off
        if (cursorUpdatedAt && cursorId) {
            filter.$or = [
                { updatedAt: { $lt: new Date(cursorUpdatedAt) } },
                { updatedAt: new Date(cursorUpdatedAt), _id: { $lt: new mongoose.Types.ObjectId(cursorId) } },
            ];
        }

        const products = await Product.find(filter)
            .sort({ updatedAt: -1, _id: -1 })
            .limit(limit)
            .lean();

        const last = products.at(-1);
        const nextCursor = last ? { cursorUpdatedAt: last.updatedAt, cursorId: last._id } : null;

        return res.status(200).json({
            success: true,
            products,
            pagination: { limit, count: products.length, hasMore: products.length === limit, snapshotTime, nextCursor },
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { getProducts };