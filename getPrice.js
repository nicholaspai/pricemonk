const axios = require('axios');

const API_SERVER = 'https://api.pro.coinbase.com';

/**
 * Get historical price at a timestamp
 * @param {*String} market_name e.g. "ETH-USD"
 * @param {*String} date in GMT time zone, YYYY-MM-DDTHH:mm:ss (2020-01-09T00:0:00 is Jan 8 7pm EST)
 */
const getPrice = async (market_name, date) => {
    // Format market name correctly
    const MARKET = market_name.toUpperCase();

    // Form request
    const ENDPOINT = `/products/${MARKET}/candles`;
    const DATE_PARAM = `start=${date}&end=${date}`;
    const GRANULARITY_PARAM = `granularity=60`; // in seconds, must be {60, 300, 900, 3600, 21600, 86400}

    // Make request
    let URL = API_SERVER+ENDPOINT+'?'+DATE_PARAM+'&'+GRANULARITY_PARAM;
    const response = await axios.get(URL);

    // Parse response
    let prices = response.data;
    let result;
    if (prices.length > 1) {
        // TODO: For now, arbitrarily return later of two median timestamps
        // if there are an even number of timestamps
        let mid = prices.length / 2;
        result = prices[mid];
    } else {
        result = prices[0];
    }
    
    return {
        time: result[0]*1000,
        low: result[1],
        high: result[2],
        open: result[3],
        close: result[4],
        volume: result[5]
    };
}

module.exports = getPrice;
  