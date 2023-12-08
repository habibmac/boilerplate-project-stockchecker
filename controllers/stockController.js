const Stock = require("../models/Stock");
const fetchStockData = require("../utils/fetchStockData");

const getStockPrices = async (req, res) => {
    const { stock, like } = req.query;
    const ip = req.ip;

    const updateStock = async (stockName) => {
        const foundStock = await Stock.findOne({
            stock: stockName.toUpperCase(),
        });
        if (foundStock) {
            if (like && !foundStock.ips.includes(ip)) {
                foundStock.likes++;
                foundStock.ips.push(ip);
            }
            await foundStock.save();
            return {
                stock: foundStock.stock,
                price: await fetchStockData(stockName),
                likes: foundStock.likes,
            };
        } else {
            const newStock = new Stock({
                stock: stockName.toUpperCase(),
                ips: like ? [ip] : [],
            });
            if (like) newStock.likes++;
            await newStock.save();
            return {
                stock: newStock.stock,
                price: await fetchStockData(stockName),
                likes: newStock.likes,
            };
        }
    };

    try {
        if (typeof stock === "string") {
            const stockData = await updateStock(stock);
            res.json({ stockData });
        } else if (Array.isArray(stock) && stock.length === 2) {
            const stockData = await Promise.all(
                stock.map((s) => updateStock(s))
            );
            const rel_likes = stockData[0].likes - stockData[1].likes;
            res.json({
                stockData: [
                    { ...stockData[0], rel_likes: rel_likes },
                    { ...stockData[1], rel_likes: -rel_likes },
                ],
            });
        } else {
            res.status(400).json({ error: "Invalid stock data" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getStockPrices,
};
