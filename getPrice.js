const moment = require('moment');
const axios = require('axios');

require('dotenv').config();

const API_SERVER = 'https://api.nomics.com/v1';
const API_KEY = process.env.NOMICS_API_KEY;

const getPrice = async (market_name, start_date, end_date) => {
    // Form request
    let ENDPOINT = '/exchange-rates/history';
    let API_PARAM = `key=${API_KEY}`;
    let CURRENCY_PARAM = `currency=${market_name}`;
    let DATE_PARAM = `start=${start_date}&end=${end_date}`;

    // Make request
    const URL = API_SERVER+ENDPOINT+'?'+API_PARAM+'&'+CURRENCY_PARAM+'&'+DATE_PARAM;
    const response = await axios.get(URL);

    // Parse response
    let prices = response.data;
    if (prices.length > 1) {
        // TODO: For now, arbitrarily return later timestamp
        let mid = prices.length / 2;
        return prices[mid];
    } else {
        return prices[0];
    }
}

async function main() {
    try {
        const SYMBOL = 'ETH';
        const DATE_FORMAT = "MM-DD-YYYY HH:mm Z";
        const START_DATE = moment('01-08-2020 22:59 +0500', DATE_FORMAT).toISOString();
        const END_DATE = moment('01-09-2020 00:01 +0500', DATE_FORMAT).toISOString();
        console.log(`Requesting the mid-price of ${SYMBOL} between ${START_DATE} and ${END_DATE}`);
        let price = await getPrice(SYMBOL, START_DATE, END_DATE);
        let price_val = parseFloat(price.rate);
        let price_timestamp = moment(price.timestamp);
        console.log(`PRICE => ${price_val}, DATE => ${price_timestamp.toString()}`);
    } catch (e) {
        console.error(`ERROR:`, e);
        return;
    }
  
}
  
main();
  