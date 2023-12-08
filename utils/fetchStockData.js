const axios = require("axios");
require("dotenv").config();

const fetchStockData = async (stock) => {
    const response = await axios.get(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
    );
    const data = response.data["Global Quote"];
    return { stock: stock, price: data["05. price"] };
};

module.exports = fetchStockData;
